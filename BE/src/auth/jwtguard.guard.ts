import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtguardGuard extends AuthGuard('jwt') {
  constructor(){
    super();
  }
}