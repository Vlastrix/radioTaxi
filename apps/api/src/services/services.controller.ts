import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Roles('CLIENT')
  @Post()
  create(@Request() req: any, @Body() createServiceDto: { origin: string; destination: string }) {
    return this.servicesService.create(req.user.userId, createServiceDto);
  }

  @Roles('OPERATOR')
  @Get('operadora')
  getOperadoraDashboard() {
    return this.servicesService.getOperadoraDashboard();
  }

  @Roles('OPERATOR')
  @Patch(':id/assign')
  assignDriver(@Param('id') id: string, @Body() body: { driverId: number }) {
    return this.servicesService.assignDriver(+id, body.driverId);
  }

  @Roles('DRIVER')
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.servicesService.updateStatus(+id, body.status);
  }

  @Get('current')
  getCurrentTrip(@Request() req: any) {
    return this.servicesService.getCurrentTrip(req.user);
  }

  @Roles('ADMIN', 'OPERATOR')
  @Get('history')
  getHistory() {
    return this.servicesService.getHistory();
  }
}
