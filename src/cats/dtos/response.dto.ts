import { ApiProperty } from "@nestjs/swagger";
import { ZodCatDto } from "../cats.interface";

export class ResponseDto {
    @ApiProperty()
    message: string;
  
    data: ZodCatDto[];
  }