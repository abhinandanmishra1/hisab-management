import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDTO } from './dto/group.dto';
import { Group } from 'src/interfaces/group.interface';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  async createGroup(@Body() createGroupDto: CreateGroupDTO): Promise<Group> {
    return await this.groupService.createGroup(createGroupDto);
  }

  @Get()
  async getAllGroups(): Promise<Group[]> {
    return await this.groupService.getAllGroups();
  }

  @Get(':id')
  async getGroupById(@Param('id') id: string): Promise<Group> {
    return await this.groupService.getGroupById(id);
  }

  @Delete(':id')
  async deleteGroup(@Param('id') id: string): Promise<Group> {
    return await this.groupService.deleteGroup(id);
  }
}
