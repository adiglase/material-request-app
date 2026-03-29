import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { ListMaterialRequestsQueryDto } from './dto/list-material-requests-query.dto';
import { MaterialDetail } from './entities/material-detail.entity';
import { MaterialRequest } from './entities/material-request.entity';

@Injectable()
export class MaterialRequestsRepository {
  constructor(
    @InjectRepository(MaterialRequest)
    private readonly materialRequestRepository: Repository<MaterialRequest>,
  ) {}

  async findListPage(query: ListMaterialRequestsQueryDto) {
    const { page, pageSize } = query;

    const queryBuilder = this.materialRequestRepository
      .createQueryBuilder('materialRequest')
      .select([
        'materialRequest.id',
        'materialRequest.requestNumber',
        'materialRequest.requestDate',
        'materialRequest.requesterName',
        'materialRequest.purpose',
        'materialRequest.createdAt',
        'materialRequest.updatedAt',
      ]);

    this.applyListFilters(queryBuilder, query);

    const [materialRequests, total] = await queryBuilder
      .orderBy('materialRequest.requestDate', 'DESC')
      .addOrderBy('materialRequest.id', 'DESC')
      // Do offset pagination for simplicity.
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

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

  async findByIdWithManager(manager: EntityManager, id: number) {
    return manager.findOneBy(MaterialRequest, { id });
  }

  createRequestEntity(
    manager: EntityManager,
    payload: Pick<
      MaterialRequest,
      'requestNumber' | 'requestDate' | 'requesterName' | 'purpose' | 'notes'
    >,
  ) {
    return manager.create(MaterialRequest, payload);
  }

  async saveRequest(manager: EntityManager, materialRequest: MaterialRequest) {
    return manager.save(MaterialRequest, materialRequest);
  }

  async replaceRequestDetails(
    manager: EntityManager,
    requestId: number,
    details: Array<
      Pick<
        MaterialDetail,
        | 'name'
        | 'description'
        | 'category'
        | 'specification'
        | 'quantity'
        | 'unit'
        | 'remarks'
      >
    >,
  ) {
    await manager.delete(MaterialDetail, { requestId });

    const materialDetails = details.map((detail) =>
      manager.create(MaterialDetail, {
        requestId,
        ...detail,
      }),
    );

    return manager.save(MaterialDetail, materialDetails);
  }

  async deleteById(id: number) {
    const deleteResult = await this.materialRequestRepository.delete({ id });
    return deleteResult.affected ?? 0;
  }

  private applyListFilters(
    queryBuilder: SelectQueryBuilder<MaterialRequest>,
    query: ListMaterialRequestsQueryDto,
  ) {
    const { requestNumber, requesterName, requestDateFrom, requestDateTo } =
      query;

    const filterClauses: string[] = [];
    const parameters: Record<string, string> = {};

    if (requestNumber) {
      filterClauses.push(
        "materialRequest.requestNumber ILIKE :requestNumber ESCAPE '\\'",
      );
      parameters.requestNumber = this.toContainsSearch(requestNumber);
    }

    if (requesterName) {
      filterClauses.push(
        "materialRequest.requesterName ILIKE :requesterName ESCAPE '\\'",
      );
      parameters.requesterName = this.toContainsSearch(requesterName);
    }

    if (requestDateFrom) {
      filterClauses.push('materialRequest.requestDate >= :requestDateFrom');
      parameters.requestDateFrom = requestDateFrom;
    }

    if (requestDateTo) {
      filterClauses.push('materialRequest.requestDate <= :requestDateTo');
      parameters.requestDateTo = requestDateTo;
    }

    if (filterClauses.length > 0) {
      queryBuilder.where(filterClauses.join(' AND '), parameters);
    }
  }

  /**
   * Build an ILIKE pattern that matches the input anywhere in the column.
   */
  private toContainsSearch(value: string) {
    return `%${this.escapeLikePattern(value)}%`;
  }

  private escapeLikePattern(value: string) {
    //  The regex /[\\%_]/g matches every "\", "%", and "_" in the input string.
    //  The replacement string "\\$&" prefixes each matched character with "\".
    return value.replace(/[\\%_]/g, '\\$&');
  }
}
