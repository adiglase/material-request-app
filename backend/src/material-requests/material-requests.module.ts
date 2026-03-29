import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialDetail } from './entities/material-detail.entity';
import { MaterialRequest } from './entities/material-request.entity';
import { MaterialRequestsController } from './material-requests.controller';
import { MaterialRequestsRepository } from './material-requests.repository';
import { MaterialRequestsService } from './material-requests.service';

@Module({
  imports: [TypeOrmModule.forFeature([MaterialRequest, MaterialDetail])],
  controllers: [MaterialRequestsController],
  providers: [MaterialRequestsService, MaterialRequestsRepository],
  exports: [MaterialRequestsService],
})
export class MaterialRequestsModule {}
