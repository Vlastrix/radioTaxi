import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findAllOperators() {
    const role = await this.prisma.role.findUnique({ where: { name: 'OPERATOR' } });
    if (!role) return [];
    return this.prisma.user.findMany({
      where: { roleId: role.id },
      select: { id: true, name: true, email: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createOperator(data: any) {
    const existing = await this.findOneByEmail(data.email);
    if (existing) throw new BadRequestException('El correo ya está en uso');

    const role = await this.prisma.role.findUnique({ where: { name: 'OPERATOR' } });
    if (!role) throw new Error('Role OPERATOR not found');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        roleId: role.id,
      },
      select: { id: true, name: true, email: true, createdAt: true }
    });
  }

  async updateOperator(id: number, data: any) {
    const updateData: any = { name: data.name };
    if (data.email) updateData.email = data.email;
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    
    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, createdAt: true }
    });
  }

  async deleteOperator(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
