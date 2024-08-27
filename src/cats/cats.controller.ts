import { Body, Controller, Get, Param, Post, Query, UsePipes } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TeamPartialUpdateDto, ZodCatDto, ZodTestDto, ZodTestQueryDto } from './cats.interface';
import { CatsService } from './cats.service';
import { CreateCatClassDto } from './dtos/create-cat.dto';
import { QueryCatClassDto } from './dtos/query-cat.dto';
import { ResponseDto } from './dtos/response.dto';
import { ZodValidationPipe } from '@anatine/zod-nestjs';

@UsePipes(ZodValidationPipe)
@ApiBearerAuth()
@ApiTags('cats')
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @ApiOperation({ summary: 'Create cat' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 200, description: 'Forbidden.', type: ResponseDto })
  async create(@Body() CreateCatClassDto: CreateCatClassDto): Promise<ResponseDto> {
    return  {
      message: 'Cat created',
      data: [this.catsService.create(CreateCatClassDto)],
    }
  }

  @Get('class/:id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ZodCatDto,
  })
  @ApiQuery({ name: 'query', type: QueryCatClassDto })
  findOneClass(@Param('id') id: string, @Query('query') query: QueryCatClassDto): ZodCatDto {
    return this.catsService.findOne(+id);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ZodCatDto,
  })
  @ApiQuery({ name: 'query', type: ZodTestQueryDto })
  findOne(@Param('id') id: string, @Query('query') query: ZodTestQueryDto): ZodCatDto {
    return this.catsService.findOne(+id);
  }

  @Post(':id/test')
  @ApiResponse({
    status: 200,
    description: 'Test record',
    type: ZodTestDto,
  })
  postTest(@Param('id') id: string,  @Body() body: ZodTestQueryDto): ZodTestDto {
    return {
      address: 'test',
      friends: ['test'],
    }
  }

  @Get('1/:id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ZodCatDto,
  })
  @ApiQuery({ name: 'query', type: ZodTestQueryDto })
  findOneX(@Param('id') id: string, @Query('query') query: TeamPartialUpdateDto): ZodCatDto {
    return this.catsService.findOne(+id, query);
  }
}
