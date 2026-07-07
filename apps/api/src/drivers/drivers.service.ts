import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DriversService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    let userId = null;

    if (data.email && data.password) {
      const role = await this.prisma.role.findUnique({ where: { name: 'DRIVER' } });
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

    return this.prisma.driver.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        license: data.license,
        ...(userId && { userId }),
      }
    });
  }

  findAll() {
    return this.prisma.driver.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  findOne(id: number) {
    return this.prisma.driver.findUnique({ where: { id } });
  }

  async update(id: number, data: any) {
    const driver = await this.prisma.driver.findUnique({ where: { id } });

    if (data.password && driver?.userId) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      await this.prisma.user.update({
        where: { id: driver.userId },
        data: { password: hashedPassword }
      });
    } else if (data.password && !driver?.userId && data.email) {
      const role = await this.prisma.role.findUnique({ where: { name: 'DRIVER' } });
      if (role) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.prisma.user.create({
          data: {
            email: data.email,
            password: hashedPassword,
            name: data.name || driver.name,
            roleId: role.id,
          }
        });
        data.userId = user.id;
      }
    }

    const updateData: any = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      license: data.license,
    };

    if (data.userId) {
       updateData.userId = data.userId;
    }

    return this.prisma.driver.update({
      where: { id },
      data: updateData
    });
  }

  remove(id: number) {
    return this.prisma.driver.delete({ where: { id } });
  }
}
