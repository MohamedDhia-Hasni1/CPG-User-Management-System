import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../models/user";

const API_URL=environment.API_URL;
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http=inject(HttpClient);
  login(postData:{matricule:string;password:string}):Observable<User>{
    const login= this.http.post<User>(`${API_URL}auth/login`,postData,{withCredentials:true});
    return login;
  }
}