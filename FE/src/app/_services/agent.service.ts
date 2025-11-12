 import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Agent } from '../models/agent';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class AgentService {
    private http = inject(HttpClient);
    API_URL = environment.API_URL;

    getListAgent(): Promise<Agent[]> {
        return firstValueFrom(this.http.get<Agent[]>(`${this.API_URL}agent`));
    }

    createAgent(agent: Agent): Promise<Agent> {
        return firstValueFrom(this.http.post<Agent>(`${this.API_URL}agent`, agent));
    }

    updateAgent(id: string, agent: Agent): Promise<Agent> {
        return firstValueFrom(this.http.put<Agent>(`${this.API_URL}agent/${id}`, agent));
    }

    deleteAgent(id: string): Promise<void> {
        return firstValueFrom(this.http.delete<void>(`${this.API_URL}agent/${id}`));
    }

    getAgentById(id: string): Promise<Agent> {
        return firstValueFrom(this.http.get<Agent>(`${this.API_URL}agent/${id}`));
    }
}