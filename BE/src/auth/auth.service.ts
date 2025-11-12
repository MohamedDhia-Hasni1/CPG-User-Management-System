import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { jwtSecret } from './constants';
const bcrypt= require('bcryptjs');
const oneDay=3600*1000*24;

@Injectable()
export class AuthService {
   constructor(
      private prismaService: PrismaService,
      private jwt:JwtService
    ){}
  async login(matricule: string , password:string , res:any) {
    
    const user = await this.prismaService.agent.findUnique({
      where:{matricule}
    });
    if(!user){
      throw new BadRequestException("Incorrect Matricule");
    }
    const isMatch = await this.comparePassword({
      password,
      hash: user.mot_pass
    });
    if(!isMatch){
      throw new BadRequestException("Incorrect PassWord");
    }
    const token = await this.signToken({
      matricule: user.matricule,
      name: user.nom_prenom!
      })
      if(!token){
        throw new BadRequestException("Token Not Received");
      }
      res.cookie('token',token,{
        httpOnly: false,
        secure: false,
        expires:new Date(Date.now()+oneDay)
      });
      
      
      res.send({
        message:"Logged In",
        matricule: user.matricule,
        nom: user.nom_prenom,
        
      });
  }



async comparePassword(args:{password:string;hash:string}){
  return await bcrypt.compareSync(args.password,args.hash);
}
 async signToken(args:{matricule:string;name:string}){
  const payload=args;
  return this.jwt.signAsync(payload,{secret:jwtSecret})
 }
 
 async getUserPriv(matricule:string,idApp:number){
  return await this.prismaService.profil.findFirst({where:{
    matricule: matricule,
    id_application:idApp,
  }})
 }
}
