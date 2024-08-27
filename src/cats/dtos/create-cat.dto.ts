import { IsInt, IsString } from 'class-validator';

export class CreateCatClassDto {
    @IsString()
    readonly name: string;
  
    @IsInt()
    readonly age: number;
  
    @IsString()
    readonly breed: string;
  }