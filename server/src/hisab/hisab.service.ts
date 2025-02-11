import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hisab } from 'src/interfaces/hisab.interface';
import { CreateHisabDTO } from './dto/hisab.dto';

@Injectable()
export class HisabService {
  constructor(@InjectModel('Hisab') private readonly hisabModel: Model<Hisab>) {}

  async createHisab(createHisabDto: CreateHisabDTO): Promise<Hisab> {
    const newHisab = new this.hisabModel(createHisabDto);
    return await newHisab.save();
  }

  async updateHisab(id: string, updateHisabDto: CreateHisabDTO): Promise<Hisab> {
    const updatedHisab = await this.hisabModel.findByIdAndUpdate(id, updateHisabDto, { new: true });
    if (!updatedHisab) throw new NotFoundException('Hisab not found');
    return updatedHisab;
  }

  async getAllHisabs(): Promise<Hisab[]> {
    return await this.hisabModel.find();
  }

  async getHisabById(id: string): Promise<Hisab> {
    const hisab = await this.hisabModel.findById(id).populate('group').populate('distributions.userId').exec();
    if (!hisab) throw new NotFoundException('Hisab not found');
    return hisab;
  }

  async deleteHisab(id: string): Promise<Hisab> {
    const deletedHisab = await this.hisabModel.findByIdAndDelete(id);
    if (!deletedHisab) throw new NotFoundException('Hisab not found');

    return deletedHisab;
  }
}
