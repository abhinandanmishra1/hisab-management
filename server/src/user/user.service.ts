import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/interfaces/user.interface';
import { CreateUserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDTO): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return await newUser.save();
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userModel
    .find()
    .populate('groups')
    .exec();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).populate('groups').exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async deleteUser(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndDelete(id).populate('groups').exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
}
}
