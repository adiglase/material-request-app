import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Put,
} from '@nestjs/common';
import { ListMaterialRequestsQueryDto } from './dto/list-material-requests-query.dto';
import { CreateMaterialRequestDto } from './dto/create-material-request.dto';
import { MaterialRequestsService } from './material-requests.service';
import { UpdateMaterialRequestDto } from './dto/update-material-request.dto';

@Controller('material-requests')
export class MaterialRequestsController {
  constructor(
    private readonly materialRequestsService: MaterialRequestsService,
  ) {}

  @Post()
  create(@Body() dto: CreateMaterialRequestDto) {
    return this.materialRequestsService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMaterialRequestDto,
  ) {
    return this.materialRequestsService.update(id, dto);
  }

  @Get()
  findAll(@Query() query: ListMaterialRequestsQueryDto) {
    return this.materialRequestsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.materialRequestsService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.materialRequestsService.remove(id);
  }
}
