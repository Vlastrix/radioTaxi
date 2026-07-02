import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, data: { origin: string; destination: string }) {
    // Buscar el cliente asociado al usuario
    const client = await this.prisma.client.findUnique({ where: { userId } });
    if (!client) throw new NotFoundException('Cliente no encontrado');

    return this.prisma.service.create({
      data: {
        clientId: client.id,
        origin: data.origin,
        destination: data.destination,
        status: 'PENDING',
      },
    });
  }

  async getOperadoraDashboard() {
    const pendingTrips = await this.prisma.service.findMany({
      where: { status: 'PENDING' },
      include: { client: true },
    });

    // En un sistema real, el chofer tendría un estado (Disponible/Ocupado).
    // Para simplificar, buscamos choferes que no tengan un servicio "IN_PROGRESS" o "ASSIGNED".
    const activeDriverIds = await this.prisma.service.findMany({
      where: { status: { in: ['IN_PROGRESS', 'ASSIGNED'] } },
      select: { driverId: true },
    });
    
    const busyIds = activeDriverIds.map(s => s.driverId).filter(id => id !== null);

    const availableDrivers = await this.prisma.driver.findMany({
      where: { id: { notIn: busyIds } },
    });

    return { pendingTrips, availableDrivers };
  }

  async assignDriver(serviceId: number, driverId: number) {
    return this.prisma.service.update({
      where: { id: serviceId },
      data: { driverId, status: 'ASSIGNED' },
    });
  }

  async updateStatus(serviceId: number, status: string) {
    // Si status es COMPLETED, podríamos también simular el pago
    return this.prisma.service.update({
      where: { id: serviceId },
      data: { status },
    });
  }

  async getCurrentTrip(user: any) {
    if (user.role === 'DRIVER') {
      const driver = await this.prisma.driver.findUnique({ where: { userId: user.userId } });
      if (!driver) return null;
      return this.prisma.service.findFirst({
        where: { driverId: driver.id, status: { in: ['ASSIGNED', 'IN_PROGRESS'] } },
        include: { client: true },
      });
    }

    if (user.role === 'CLIENT') {
      const client = await this.prisma.client.findUnique({ where: { userId: user.userId } });
      if (!client) return null;
      return this.prisma.service.findFirst({
        where: { clientId: client.id, status: { in: ['PENDING', 'ASSIGNED', 'IN_PROGRESS'] } },
        include: { driver: true },
      });
    }

    return null;
  }

  async getHistory() {
    return this.prisma.service.findMany({
      orderBy: { createdAt: 'desc' },
      include: { client: true, driver: true }
    });
  }
}
