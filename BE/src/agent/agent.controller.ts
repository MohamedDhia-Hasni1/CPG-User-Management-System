/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AgentService } from './agent.service';

import { Prisma } from '@prisma/client';
import { JwtguardGuard } from 'src/auth/jwtguard.guard';
@UseGuards(JwtguardGuard)
@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post()
  create(@Body() createAgentDto: Prisma.agentUncheckedCreateInput) {
    return this.agentService.create(createAgentDto);
  }

  @Get()
  findAll() {
    return this.agentService.findAll();
  }

  @Get(':matricule')
  findOne(@Param('matricule') matricule: string) {
    return this.agentService.findOne(matricule);
  }

  @Patch(':matricule')
  update(@Param('matricule') matricule: string, @Body() updateAgentDto: Prisma.agentUncheckedCreateInput) {
    return this.agentService.update(matricule, updateAgentDto);
  }

  @Delete(':matricule')
  remove(@Param('matricule') matricule: string) {
    return this.agentService.remove(matricule);
  }
}
