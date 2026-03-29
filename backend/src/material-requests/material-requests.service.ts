import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { isUniqueConstraintViolation } from '../common/database/query-error.util';
import { CreateMaterialRequestDto } from './dto/create-material-request.dto';
import { MaterialRequest } from './entities/material-request.entity';
import { MaterialDetail } from './entities/material-detail.entity';

@Injectable()
export class MaterialRequestsService {
  constructor(private readonly dataSource: DataSource) {}

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

        return this.toCreateResponse(savedRequest, savedDetail);
      });
    } catch (error) {
      if (this.isRequestNumberConflict(error)) {
        throw new ConflictException('Request number already exists.');
      }

      throw error;
    }
  }

  private toCreateResponse(
    materialRequest: MaterialRequest,
    materialDetails: MaterialDetail[],
  ) {
    // Return explicit API shape
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
          quantity: Number(detail.quantity),
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
