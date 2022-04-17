import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForgotPwd } from './forgotpwd.entity';

@Injectable()
export class ForgotPwdService {
  constructor(
    @InjectRepository(ForgotPwd)
    private forgotpwdRepository: Repository<ForgotPwd>,
  ) {}

  findAll(): Promise<ForgotPwd[]> {
    return this.forgotpwdRepository.find();
  }

  findOne(args): Promise<ForgotPwd> {
    return this.forgotpwdRepository.findOne(args);
  }

  async create(row) {
    return this.forgotpwdRepository.save(row);
  }

  async remove(email: string): Promise<void> {
    await this.forgotpwdRepository.delete({ email });
  }

  async update(email: string, newInfo) {
    return this.forgotpwdRepository.update({ email }, newInfo);
  }
}
