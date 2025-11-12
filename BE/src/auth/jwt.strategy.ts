import { Injectable } from "@nestjs/common";
import { jwtSecret } from "./constants";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from "src/prisma/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prismaService:PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
      secretOrKey: jwtSecret,
    });
  }

  private static extractJWT(req: Request): string | null {
    
    
    if (req.cookies && 'token' in req.cookies) {
        
        
      return req.cookies.token;
    }
    return null;
  }

  async validate(payload: { matricule: string; name: string }) {
    
    const user=await this.prismaService.agent.findUnique({
      where:
      {matricule:payload.matricule}
  });
   return user;
  }
}