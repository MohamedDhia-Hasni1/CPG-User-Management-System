import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class AgentService {
  constructor(
    private prismaService: PrismaService
  ){}
  create(createAgentDto: Prisma.agentUncheckedCreateInput) {
    Logger.debug('DTO:', createAgentDto); 
    return this.prismaService.agent.create({data:createAgentDto});
  }

  findAll() {
    return this.prismaService.agent.findMany();
  }

  findOne(matricule: string) {
    return this.prismaService.agent.findFirst({
      where: {
        matricule
      }
    });
  }

  update(matricule: string, updateAgentDto: Prisma.agentUncheckedCreateInput) {
    return this.prismaService.agent.update({
      where: { 
       matricule
      },
      data: updateAgentDto
    });
  }

  remove(matricule: string) {
    return this.prismaService.agent.delete({where:  {
      matricule
    }
  });
  }
  
}
