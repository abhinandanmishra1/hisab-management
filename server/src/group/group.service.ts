import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGroupDTO } from './dto/group.dto';
import { Group } from 'src/interfaces/group.interface';
import { Hisab } from 'src/interfaces/hisab.interface';

@Injectable()
export class GroupService {
  constructor(@InjectModel('Group') private readonly groupModel: Model<Group>, @InjectModel('Hisab') private readonly hisabModel: Model<Hisab>) {}

  async createGroup(createGroupDto: CreateGroupDTO): Promise<Group> {
    const newGroup = new this.groupModel(createGroupDto);
    return await newGroup.save();
  }

  async getAllGroups(): Promise<Group[]> {
    return await this.groupModel
    .find()
    .populate('members', {
      password: 0
    })
    // .populate('hisabs')
    .exec();
  }

  async getGroupById(id: string): Promise<Group> {
    const group = await this.groupModel.findById(id).populate('members').populate('hisabs').exec();
    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  async getHisabsByGroupId(id: string): Promise<{data: Hisab[], count: number}> {
    const hisabs = await this.hisabModel.find({ group: id }).populate('distributions.userId').populate('paidBy').exec();

    if(!hisabs) throw new NotFoundException('Group not found');

    return {
      data: hisabs,
      count: hisabs.length
    }
  }

  async deleteGroup(id: string): Promise<Group> {
    const group = await this.groupModel.findByIdAndDelete(id);
    if (!group) throw new NotFoundException('Group not found');

    return group;
  }
}
