import { TeamPartialUpdateType, ZodCatDto } from './cats.interface';

import { CreateCatClassDto } from './dtos/create-cat.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatsService {
  private readonly cats: ZodCatDto[] = [];

  create(cat: CreateCatClassDto): ZodCatDto {
    const newCat = {
      ...cat,
      testnull: null,
      testRefine: {
        id: 'testid',
        name: 'test',
      },
      pagination: {
        limit: 10,
        page: 1,
      }
    };
    this.cats.push(newCat);
    return newCat;
  }

  findOne(id: number, team?: TeamPartialUpdateType): ZodCatDto {
    return this.cats[id];
  }
}
