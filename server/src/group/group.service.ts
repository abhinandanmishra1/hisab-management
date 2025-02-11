import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGroupDTO } from './dto/group.dto';
import { Group } from 'src/interfaces/group.interface';

@Injectable()
export class GroupService {
  constructor(@InjectModel('Group') private readonly groupModel: Model<Group>) {}

  async createGroup(createGroupDto: CreateGroupDTO): Promise<Group> {
    const newGroup = new this.groupModel(createGroupDto);
    return await newGroup.save();
  }

  async getAllGroups(): Promise<Group[]> {
    return await this.groupModel.find().populate('members').populate('hisabs').exec();
  }

  async getGroupById(id: string): Promise<Group> {
    const group = await this.groupModel.findById(id).populate('members').populate('hisabs').exec();
    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  async deleteGroup(id: string): Promise<Group> {
    const group = await this.groupModel.findByIdAndDelete(id);
    if (!group) throw new NotFoundException('Group not found');

    return group;
  }
}
