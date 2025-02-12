import { GroupController } from './group.controller';
import { GroupSchema } from 'src/schemas/group.schema';
import { GroupService } from './group.service';
import { HisabSchema } from 'src/schemas/hisab.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Group', schema: GroupSchema },
      {
        name: 'Hisab',
        schema: HisabSchema,
      },
    ]),
  ],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
