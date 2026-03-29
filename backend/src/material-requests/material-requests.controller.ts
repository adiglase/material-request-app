import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ListMaterialRequestsQueryDto } from './dto/list-material-requests-query.dto';
import { CreateMaterialRequestDto } from './dto/create-material-request.dto';
import { MaterialRequestsService } from './material-requests.service';

@Controller('material-requests')
export class MaterialRequestsController {
  constructor(
    private readonly materialRequestsService: MaterialRequestsService,
  ) {}

  @Post()
  create(@Body() dto: CreateMaterialRequestDto) {
    return this.materialRequestsService.create(dto);
  }

  @Get()
  findAll(@Query() query: ListMaterialRequestsQueryDto) {
    return this.materialRequestsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.materialRequestsService.findOne(id);
  }
}
