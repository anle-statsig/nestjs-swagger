import { IsArray, IsInt, IsString } from 'class-validator';

import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";

const StrArray = z.string().array();
export class StrArrayDto extends createZodDto(StrArray) {}

export class QueryCatClassDto {
    @IsString()
    readonly name: string;
  
    @IsInt()
    readonly age: number;
  
    @IsString()
    readonly breed: string;

    @IsArray({  })
    readonly catFriends: StrArrayDto;
  }