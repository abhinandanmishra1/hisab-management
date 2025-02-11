import {
  IsArray,
  IsDate,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

enum HisabStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
}
class DistributionDTO {
  @IsNumber()
  amount: number;

  @IsMongoId()
  userId: string;
}

export class CreateHisabDTO {
  @ApiProperty({
      example: 'Chai',
      required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 20,
    required: true,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: '2023-01-01',
    required: true,
  })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({
    example: '67ab67f72907b7d61241598e',
    required: true,
  })
  @IsString()
  paidBy: Types.ObjectId;

  @ApiProperty({
    example: [
      {
        amount: 10,
        userId: '67ab682b2907b7d612415991',
      },
      {
        amount: 10,
        userId: '67ab67f72907b7d61241598e',
      }
    ],
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DistributionDTO)
  distributions: DistributionDTO[];

  @ApiProperty({
    example: '67ab684c2907b7d612415994',
    required: true,
  })
  @IsMongoId()
  group: string;

  status?: HisabStatus;
}

export class UpdateHisabDTO extends CreateHisabDTO {}