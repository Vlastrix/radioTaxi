import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const payload = { sub: user.id, email: user.email, role: (user as any).role.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: (user as any).role.name
      }
    };
  }

  async register(data: any): Promise<any> {
    const existing = await this.usersService.findOneByEmail(data.email);
    if (existing) {
      throw new BadRequestException('El correo ya está en uso');
    }

    const requestedRole = data.role === 'DRIVER' ? 'DRIVER' : 'CLIENT';
    const role = await this.prisma.role.findUnique({ where: { name: requestedRole } });
    if (!role) throw new Error(`Role ${requestedRole} not found`);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userData: any = {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      roleId: role.id,
    };

    if (requestedRole === 'CLIENT') {
      userData.client = {
        create: {
          name: data.name,
          phone: data.phone,
          email: data.email
        }
      };
    } else if (requestedRole === 'DRIVER') {
      userData.driver = {
        create: {
          name: data.name,
          phone: data.phone,
          license: data.license || 'PENDING'
        }
      };
    }

    const user = await this.prisma.user.create({
      data: userData,
      include: { role: true }
    });

    const payload = { sub: user.id, email: user.email, role: user.role.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.name
      }
    };
  }
}
