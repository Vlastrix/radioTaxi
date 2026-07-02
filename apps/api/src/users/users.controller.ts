import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('ADMIN')
  @Get('operators')
  findAllOperators() {
    return this.usersService.findAllOperators();
  }

  @Roles('ADMIN')
  @Post('operators')
  createOperator(@Body() data: any) {
    return this.usersService.createOperator(data);
  }

  @Roles('ADMIN')
  @Patch('operators/:id')
  updateOperator(@Param('id') id: string, @Body() data: any) {
    return this.usersService.updateOperator(+id, data);
  }

  @Roles('ADMIN')
  @Delete('operators/:id')
  deleteOperator(@Param('id') id: string) {
    return this.usersService.deleteOperator(+id);
  }
}
