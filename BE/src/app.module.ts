/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma/prisma.module';
import { AgentModule } from './agent/agent.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AgentModule, AuthModule],
  controllers: [AppController],
   
  providers: [AppService,PrismaModule, AuthModule],
})
export class AppModule {}
