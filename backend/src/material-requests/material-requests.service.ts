import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { isUniqueConstraintViolation } from '../common/database/query-error.util';
import { CreateMaterialRequestDto } from './dto/create-material-request.dto';
import { ListMaterialRequestsQueryDto } from './dto/list-material-requests-query.dto';
import { UpdateMaterialRequestDto } from './dto/update-material-request.dto';
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
        const materialRequest =
          this.materialRequestsRepository.createRequestEntity(
            manager,
            this.toMaterialRequestPersistence(dto),
          );

        const savedRequest = await this.materialRequestsRepository.saveRequest(
          manager,
          materialRequest,
        );

        const savedDetail =
          await this.materialRequestsRepository.replaceRequestDetails(
            manager,
            savedRequest.id,
            this.toMaterialDetailPersistence(dto),
          );

        return this.toDetailResponse(savedRequest, savedDetail);
      });
    } catch (error) {
      if (this.isRequestNumberConflict(error)) {
        throw new ConflictException('Request number already exists.');
      }

      throw error;
    }
  }

  async update(id: number, dto: UpdateMaterialRequestDto) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const materialRequest =
          await this.materialRequestsRepository.findByIdWithManager(
            manager,
            id,
          );

        if (!materialRequest) {
          throw new NotFoundException(`Material request #${id} not found.`);
        }

        Object.assign(materialRequest, this.toMaterialRequestPersistence(dto));

        const savedRequest = await this.materialRequestsRepository.saveRequest(
          manager,
          materialRequest,
        );
        const savedDetail =
          await this.materialRequestsRepository.replaceRequestDetails(
            manager,
            id,
            this.toMaterialDetailPersistence(dto),
          );

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
    const materialRequest =
      await this.materialRequestsRepository.findDetailById(id);

    if (!materialRequest) {
      throw new NotFoundException(`Material request #${id} not found.`);
    }

    return this.toDetailResponse(
      materialRequest,
      materialRequest.materialDetails,
    );
  }

  async remove(id: number) {
    const affectedRows = await this.materialRequestsRepository.deleteById(id);

    if (!affectedRows) {
      throw new NotFoundException(`Material request #${id} not found.`);
    }
  }

  private toDetailResponse(
    materialRequest: MaterialRequest,
    materialDetails: MaterialDetail[],
  ) {
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

  private toMaterialRequestPersistence(dto: CreateMaterialRequestDto) {
    return {
      requestNumber: dto.requestNumber,
      requestDate: dto.requestDate,
      requesterName: dto.requesterName,
      purpose: dto.purpose,
      notes: dto.notes ?? null,
    };
  }

  private toMaterialDetailPersistence(dto: CreateMaterialRequestDto) {
    return dto.materialDetails.map((detail) => ({
      name: detail.name,
      description: detail.description,
      category: detail.category,
      specification: detail.specification ?? null,
      quantity: detail.quantity,
      unit: detail.unit,
      remarks: detail.remarks ?? null,
    }));
  }

  private isRequestNumberConflict(error: unknown): boolean {
    return isUniqueConstraintViolation(
      error,
      'uq_material_requests_request_number',
    );
  }
}
