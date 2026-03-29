import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListMaterialRequestsQueryDto } from './dto/list-material-requests-query.dto';
import { MaterialRequest } from './entities/material-request.entity';

@Injectable()
export class MaterialRequestsRepository {
  constructor(
    @InjectRepository(MaterialRequest)
    private readonly materialRequestRepository: Repository<MaterialRequest>,
  ) {}

  async findListPage(query: ListMaterialRequestsQueryDto) {
    const { page, pageSize } = query;

    // Keep the list endpoint only return summary data without material details
    const [materialRequests, total] =
      await this.materialRequestRepository.findAndCount({
        select: {
          id: true,
          requestNumber: true,
          requestDate: true,
          requesterName: true,
          purpose: true,
          createdAt: true,
          updatedAt: true,
        },
        order: {
          requestDate: 'DESC',
          id: 'DESC',
        },
        // Use offset pagination for simplicity
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

    return { materialRequests, total };
  }

  async findDetailById(id: number) {
    return this.materialRequestRepository.findOne({
      where: { id: id },
      relations: {
        materialDetails: true,
      },
      order: {
        materialDetails: {
          id: 'ASC',
        },
      },
    });
  }
}
