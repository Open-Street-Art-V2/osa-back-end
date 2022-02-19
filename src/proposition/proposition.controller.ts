/* eslint-disable */
import { Controller, Get, Post, Patch, Param, Delete } from '@nestjs/common';
import { PropositionService } from './proposition.service';
//import { CreatePropositionDto } from './dto/create-proposition.dto';
//import { UpdatePropositionDto } from './dto/update-proposition.dto';

@Controller('proposition')
export class PropositionController {
  constructor(private readonly propositionService: PropositionService) {}

  @Post()
  create(/*@Body() createPropositionDto: CreatePropositionDto*/) {
    return this.propositionService.create(/*createPropositionDto*/);
  }

  @Get()
  findAll() {
    return this.propositionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propositionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, /*@Body() updatePropositionDto: UpdatePropositionDto*/) {
    return this.propositionService.update(+id, /*updatePropositionDto*/);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propositionService.remove(+id);
  }
}
