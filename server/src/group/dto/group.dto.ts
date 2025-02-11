import { IsArray, IsMongoId, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CreateGroupDTO {
  @ApiProperty({
      example: 'Athome PG',
      required: true
  })
  @IsString()
  name: string;

  @ApiProperty({
      example: [
        "67ab67f72907b7d61241598e",
        "67ab682b2907b7d612415991"
      ],
      required: true
  })
  @IsArray()
  @IsMongoId({ each: true })
  members: Types.ObjectId[];
}
