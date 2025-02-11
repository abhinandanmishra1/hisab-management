import { HisabController } from './hisab.controller';
import { HisabSchema } from 'src/schemas/hisab.schema';
import { HisabService } from './hisab.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Hisab', schema: HisabSchema }])],
  controllers: [HisabController],
  providers: [HisabService],
})
export class HisabModule {}
