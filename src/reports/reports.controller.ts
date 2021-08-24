import {
  Get,
  Body,
  Post,
  Patch,
  Query,
  Param,
  UseGuards,
  Controller,
} from '@nestjs/common';
import { AuthGuard } from './../guards/auth.guard';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { CurrentUser } from './../users/decorators/current-user.decorator';
import { User } from './../users/user.entity';
import { ReportDto } from './dtos/report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';

@Controller('reports')
export class ReportsController {
  constructor(private reportsSerice: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsSerice.create(body, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  listReport() {
    return this.reportsSerice.find();
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportsSerice.changeApproval(id, body.approved);
  }

  @Get('/estimate')
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsSerice.createEstimate(query);
  }
}
