import { Controller, Get, Post, Delete, Body, Param, Put } from '@nestjs/common';
import { HisabService } from './hisab.service';
import { Hisab } from 'src/interfaces/hisab.interface';
import { CreateHisabDTO } from './dto/hisab.dto';

@Controller('hisab')
export class HisabController {
  constructor(private readonly hisabService: HisabService) {}

  @Post()
  async createHisab(@Body() createHisabDto: CreateHisabDTO): Promise<Hisab> {
    return await this.hisabService.createHisab(createHisabDto);
  }

  @Put(':id')
  async updateHisab(@Param('id') id: string, @Body() updateHisabDto: CreateHisabDTO): Promise<Hisab> {
      return await this.hisabService.updateHisab(id, updateHisabDto);
  }

  @Get()
  async getAllHisabs(): Promise<Hisab[]> {
    return await this.hisabService.getAllHisabs();
  }

  @Get(':id')
  async getHisabById(@Param('id') id: string): Promise<Hisab> {
    return await this.hisabService.getHisabById(id);
  }

  @Delete(':id')
  async deleteHisab(@Param('id') id: string): Promise<Hisab> {
    return await this.hisabService.deleteHisab(id);
  }
}
