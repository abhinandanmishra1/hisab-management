import { IsArray, IsEmail, IsMongoId, IsString, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty({
    example: 'Rishabh Jain',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'rjain@pm.me',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password',
    required: true,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @IsArray()
  @IsMongoId({ each: true })
  groups: string[];
}
