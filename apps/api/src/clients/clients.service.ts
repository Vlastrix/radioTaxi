import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    let userId = null;

    if (data.email && data.password) {
      const role = await this.prisma.role.findUnique({ where: { name: 'CLIENT' } });
      if (role) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.prisma.user.create({
          data: {
            email: data.email,
            password: hashedPassword,
            name: data.name,
            roleId: role.id,
          }
        });
        userId = user.id;
      }
    }

    const clientData: any = { ...data };
    delete clientData.password; // Don't try to insert password into client model
    if (userId) clientData.userId = userId;

    return this.prisma.client.create({ data: clientData });
  }

  findAll() {
    return this.prisma.client.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  findOne(id: number) {
    return this.prisma.client.findUnique({ where: { id } });
  }

  async update(id: number, data: any) {
    const client = await this.prisma.client.findUnique({ where: { id } });

    if (data.password && client?.userId) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      await this.prisma.user.update({
        where: { id: client.userId },
        data: { password: hashedPassword }
      });
    } else if (data.password && !client?.userId && data.email) {
      const role = await this.prisma.role.findUnique({ where: { name: 'CLIENT' } });
      if (role) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.prisma.user.create({
          data: {
            email: data.email,
            password: hashedPassword,
            name: data.name || client?.name,
            roleId: role.id,
          }
        });
        data.userId = user.id;
      }
    }

    const updateData: any = { ...data };
    delete updateData.password; // Don't pass password to Prisma Client update

    return this.prisma.client.update({
      where: { id },
      data: updateData,
    });
  }

  remove(id: number) {
    return this.prisma.client.delete({ where: { id } });
  }
}
