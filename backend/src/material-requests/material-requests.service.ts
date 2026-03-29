import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { isUniqueConstraintViolation } from '../common/database/query-error.util';
import { CreateMaterialRequestDto } from './dto/create-material-request.dto';
import { ListMaterialRequestsQueryDto } from './dto/list-material-requests-query.dto';
import { MaterialDetail } from './entities/material-detail.entity';
import { MaterialRequest } from './entities/material-request.entity';
import { MaterialRequestsRepository } from './material-requests.repository';

@Injectable()
export class MaterialRequestsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly materialRequestsRepository: MaterialRequestsRepository,
  ) {}

  async create(dto: CreateMaterialRequestDto) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const materialRequest = manager.create(MaterialRequest, {
          requestNumber: dto.requestNumber,
          requestDate: dto.requestDate,
          requesterName: dto.requesterName,
          purpose: dto.purpose,
          notes: dto.notes ?? null,
        });

        const savedRequest = await manager.save(
          MaterialRequest,
          materialRequest,
        );

        const materialDetails = dto.materialDetails.map((detail) =>
          manager.create(MaterialDetail, {
            requestId: savedRequest.id,
            name: detail.name,
            description: detail.description,
            category: detail.category,
            specification: detail.specification ?? null,
            quantity: detail.quantity,
            unit: detail.unit,
            remarks: detail.remarks ?? null,
          }),
        );

        const savedDetail = await manager.save(MaterialDetail, materialDetails);

        return this.toDetailResponse(savedRequest, savedDetail);
      });
    } catch (error) {
      if (this.isRequestNumberConflict(error)) {
        throw new ConflictException('Request number already exists.');
      }

      throw error;
    }
  }

  async findAll(query: ListMaterialRequestsQueryDto) {
    const { materialRequests, total } =
      await this.materialRequestsRepository.findListPage(query);

    return {
      data: materialRequests.map((materialRequest) => ({
        id: materialRequest.id,
        requestNumber: materialRequest.requestNumber,
        requestDate: materialRequest.requestDate,
        requesterName: materialRequest.requesterName,
        purpose: materialRequest.purpose,
        createdAt: materialRequest.createdAt,
        updatedAt: materialRequest.updatedAt,
      })),
      meta: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize),
      },
    };
  }

  async findOne(id: number) {
    const materialRequest = await this.materialRequestsRepository.findDetailById(
      id,
    );

    if (!materialRequest) {
      throw new NotFoundException(`Material request #${id} not found.`);
    }

    return this.toDetailResponse(
      materialRequest,
      materialRequest.materialDetails,
    );
  }

  private toDetailResponse(
    materialRequest: MaterialRequest,
    materialDetails: MaterialDetail[],
  ) {
    // Return an explicit API shape so controller responses stay stable even if
    // entity internals or ORM configuration change later.
    return {
      data: {
        id: materialRequest.id,
        requestNumber: materialRequest.requestNumber,
        requestDate: materialRequest.requestDate,
        requesterName: materialRequest.requesterName,
        purpose: materialRequest.purpose,
        notes: materialRequest.notes,
        createdAt: materialRequest.createdAt,
        updatedAt: materialRequest.updatedAt,
        materialDetails: materialDetails.map((detail) => ({
          id: detail.id,
          requestId: detail.requestId,
          name: detail.name,
          description: detail.description,
          category: detail.category,
          specification: detail.specification,
          quantity: detail.quantity,
          unit: detail.unit,
          remarks: detail.remarks,
          createdAt: detail.createdAt,
          updatedAt: detail.updatedAt,
        })),
      },
    };
  }

  private isRequestNumberConflict(error: unknown): boolean {
    return isUniqueConstraintViolation(
      error,
      'uq_material_requests_request_number',
    );
  }
}
