/* eslint-disable */
import { Injectable } from '@nestjs/common';
// import { CreatePropositionDto } from './dto/create-proposition.dto';
// import { UpdatePropositionDto } from './dto/update-proposition.dto';

@Injectable()
export class PropositionService {
  create(/*createPropositionDto: CreatePropositionDto*/) {
    return 'This action adds a new proposition';
  }

  findAll() {
    return `This action returns all proposition`;
  }

  findOne(id: number) {
    return `This action returns a #${id} proposition`;
  }

  update(id: number, /*updatePropositionDto: UpdatePropositionDto*/) {
    return `This action updates a #${id} proposition`;
  }

  remove(id: number) {
    return `This action removes a #${id} proposition`;
  }
}
