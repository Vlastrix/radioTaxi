import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DriversService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.driver.create({
      data: {
        name: data.name,
        phone: data.phone,
        license: data.license,
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

  update(id: number, data: any) {
    return this.prisma.driver.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone,
        license: data.license,
      }
    });
  }

  remove(id: number) {
    return this.prisma.driver.delete({ where: { id } });
  }
}
