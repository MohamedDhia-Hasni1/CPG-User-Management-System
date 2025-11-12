import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { PasswordModule } from 'primeng/password';
import { Agent } from '../../models/agent';
import { AgentService } from '../../_services/agent.service';
import { PanelModule } from 'primeng/panel'; 
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-crud',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        InputTextModule,
        DialogModule,
        TagModule,
        PasswordModule,
        PanelModule,
        ConfirmDialogModule,
        ProgressBarModule,
        CardModule
    ],
    template: `
        <!-- Enhanced Stats Cards -->
        <div class="grid mb-6">
            <div class="col-12 md:col-4">
                <div class="stats-card bg-blue-50 border-round p-4 shadow-2 hover:shadow-4 transition-all transition-duration-300">
                    <div class="flex align-items-center justify-content-between mb-3">
                        <div class="flex align-items-center">
                            <i class="pi pi-users text-blue-600 text-3xl mr-3"></i>
                            <div>
                                <div class="text-500 font-medium">Nombre d'utilisateurs</div>
                                <div class="text-900 font-bold text-4xl">{{ listAgents.length }}</div>
                            </div>
                        </div>
                    </div>
                    <p-progressBar 
                        [value]="100" 
                        [showValue]="false"
                        styleClass="h-2rem bg-blue-100"
                        [style]="{'border-radius': '6px', 'background': 'rgba(59, 130, 246, 0.2)'}">
                    </p-progressBar>
                </div>
            </div>
            
            <div class="col-12 md:col-4">
                <div class="stats-card bg-green-50 border-round p-4 shadow-2 hover:shadow-4 transition-all transition-duration-300">
                    <div class="flex align-items-center justify-content-between mb-3">
                        <div class="flex align-items-center">
                            <i class="pi pi-check-circle text-green-600 text-3xl mr-3"></i>
                            <div>
                                <div class="text-500 font-medium">Utilisateurs actifs</div>
                                <div class="text-900 font-bold text-4xl">{{ getActiveCount() }}</div>
                            </div>
                        </div>
                        <span class="text-green-600 font-bold">{{ (getActiveCount() / listAgents.length * 100 || 0).toFixed(0) }}%</span>
                    </div>
                    <p-progressBar 
                        [value]="(getActiveCount() / listAgents.length * 100) || 0" 
                        [showValue]="false"
                        styleClass="h-2rem bg-green-100"
                        [style]="{'border-radius': '6px', 'background': 'rgba(16, 185, 129, 0.2)'}">
                    </p-progressBar>
                </div>
            </div>
            
            <div class="col-12 md:col-4">
                <div class="stats-card bg-red-50 border-round p-4 shadow-2 hover:shadow-4 transition-all transition-duration-300">
                    <div class="flex align-items-center justify-content-between mb-3">
                        <div class="flex align-items-center">
                            <i class="pi pi-ban text-red-600 text-3xl mr-3"></i>
                            <div>
                                <div class="text-500 font-medium">Utilisateurs désactivés</div>
                                <div class="text-900 font-bold text-4xl">{{ getInactiveCount() }}</div>
                            </div>
                        </div>
                        <span class="text-red-600 font-bold">{{ (getInactiveCount() / listAgents.length * 100 || 0).toFixed(0) }}%</span>
                    </div>
                    <p-progressBar 
                        [value]="(getInactiveCount() / listAgents.length * 100) || 0" 
                        [showValue]="false"
                        styleClass="h-2rem bg-red-100"
                        [style]="{'border-radius': '6px', 'background': 'rgba(239, 68, 68, 0.2)'}">
                    </p-progressBar>
                </div>
            </div>
        </div>
         <!-- Toolbar with Add Button -->
        <p-toolbar styleClass="mb-4">
            <ng-template pTemplate="left">
                <p-button 
                    label="Ajouter un agent" 
                    icon="pi pi-plus" 
                    (click)="openNewAgentDialog()"
                    styleClass="p-button-success mr-2">
                </p-button>
            </ng-template>
        </p-toolbar>

        <!-- Existing Agent Table -->
        <p-table 
            #dtt
            [value]="listAgents"
            [rows]="10"
            [paginator]="true"
            styleClass="p-datatable-striped"
            [tableStyle]="{ 'min-width': '75rem', 'margin-top': '2rem' }"
            [globalFilterFields]="['nom_prenom']"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Liste des Agents</h5>
                    <span class="p-input-icon-left">
                        <i class="pi pi-search"></i>
                        <input pInputText type="text" (input)="applyFilter($event)" placeholder="Rechercher par nom" />
                    </span>
                </div>
            </ng-template>

            <ng-template #header>
                <tr>
                    <th>Matricule</th>
                    <th pSortableColumn="nom_prenom">Nom & Prénom <p-sortIcon field="nom_prenom"></p-sortIcon></th>
                    <th>Imputation</th>
                    <th>État</th>
                    <th>Applications Associées</th>
                    <th>Actions</th>
                </tr>
            </ng-template>
            
            <ng-template #body let-agent>
                <tr>
                    <td>{{ agent.matricule }}</td>
                    <td>{{ agent.nom_prenom }}</td>
                    <td>{{ agent.code_siege }}.{{ agent.code_section }}</td>
                    <td>
                        <p-tag [severity]="agent.etat == 1 ? 'success' : 'danger'" 
                              [value]="agent.etat == 1 ? 'Actif' : 'Désactif'">
                        </p-tag>
                    </td>
                    <td>
                        <p-button 
                            icon="pi pi-apple" 
                            label="App" 
                            class="p-button-sm p-button-rounded p-button-outlined">
                        </p-button>
                    </td>
                    <td>
                        <p-button 
                            icon="pi pi-eye" 
                            label="Afficher" 
                            (click)="showAgentDetails(agent)" 
                            class="p-button-sm p-button-rounded p-button-outlined">
                        </p-button>
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <!-- Agent Details Dialog -->
        <p-dialog 
            [(visible)]="agentDialogVisible" 
            [style]="{ width: '50vw' }" 
            header="Détails Complets de l'Agent"
            [modal]="true"
            [draggable]="false"
            [resizable]="false">
            <div *ngIf="selectedAgent" class="grid p-fluid">
                <div class="col-12">
                    <div class="grid">
                        <div class="col-12 md:col-6">
                            <strong>Matricule:</strong> {{ selectedAgent.matricule }}
                        </div>
                        <div class="col-12 md:col-6">
                            <strong>Nom & Prénom:</strong> {{ selectedAgent.nom_prenom }}
                        </div>
                        <div class="col-12 md:col-6">
                            <strong>Code Siège:</strong> {{ selectedAgent.code_siege }}
                        </div>
                        <div class="col-12 md:col-6">
                            <strong>Code Section:</strong> {{ selectedAgent.code_section }}
                        </div>
                        <div class="col-12 md:col-6">
                            <strong>Imputation:</strong> {{ selectedAgent.code_siege }}.{{ selectedAgent.code_section }}
                        </div>
                        <div class="col-12 md:col-6">
                            <strong>État:</strong> 
                            <p-tag [severity]="selectedAgent.etat == 1 ? 'success' : 'danger'" 
                                  [value]="selectedAgent.etat == 1 ? 'Actif' : 'Désactif'">
                            </p-tag>
                        </div>
                    </div>
                    
                    <div class="col-12 mt-4 flex gap-3">
                        <p-button 
                            *ngIf="selectedAgent?.etat === 1"
                            label="Désactiver" 
                            icon="pi pi-lock" 
                            (click)="toggleAgentStatus(selectedAgent!)"
                            class="p-button-rounded p-button-danger"
                            styleClass="hover:bg-red-100 transition-colors transition-duration-300">
                        </p-button>
                        <p-button 
                            *ngIf="selectedAgent?.etat === 0"
                            label="Activer" 
                            icon="pi pi-lock-open" 
                            (click)="toggleAgentStatus(selectedAgent!)"
                            class="p-button-rounded p-button-success"
                            styleClass="hover:bg-green-100 transition-colors transition-duration-300">
                        </p-button>
                        <p-button 
                            label="Réinitialiser le mot de passe" 
                            icon="pi pi-key" 
                            (click)="showResetPassword = !showResetPassword"
                            class="p-button-rounded p-button-warning"
                            styleClass="hover:bg-yellow-100 transition-colors transition-duration-300">
                        </p-button>
                    </div>

                    <!-- Password Reset Fields -->
                    <div class="col-12 mt-4" *ngIf="showResetPassword">
                        <div class="grid">
                            <div class="col-12 md:col-6">
                                <label for="newPassword">Nouveau mot de passe</label>
                                <p-password id="newPassword" [toggleMask]="true" />
                            </div>
                            <div class="col-12 md:col-6">
                                <label for="confirmNewPassword">Confirmation mot de passe</label>
                                <p-password id="confirmNewPassword" [toggleMask]="true" />
                            </div>
                            <div class="col-12 mt-2">
                                <p-button 
                                    label="Réinitialiser" 
                                    icon="pi pi-check" 
                                    class="p-button-rounded p-button-success">
                                </p-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ng-template pTemplate="footer">
                <div class="flex justify-content-end">
                    <p-button 
                        label="Fermer" 
                        icon="pi pi-times" 
                        (click)="agentDialogVisible = false" 
                        class="p-button-text p-button-plain">
                    </p-button>
                </div>
            </ng-template>
        </p-dialog>

        <!-- Simplified Add New Agent Dialog -->
        <p-dialog 
            [(visible)]="newAgentDialogVisible" 
            [style]="{ width: '40vw' }" 
            header="Ajouter un nouvel agent"
            [modal]="true"
            [closable]="true">
            <form [formGroup]="newAgentForm" (ngSubmit)="saveNewAgent()">
                <div class="grid p-fluid">
                    <div class="col-12 md:col-6">
                        <label for="matricule">Matricule <span class="text-red-500">*</span></label>
                        <input pInputText id="matricule" formControlName="matricule" 
                            [class]="{'ng-invalid ng-dirty': isFieldInvalid('matricule')}" />
                        <small class="text-red-500" *ngIf="isFieldInvalid('matricule')">Ce champ est requis</small>
                    </div>
                    
                    <div class="col-12 md:col-6">
                        <label for="nom_prenom">Nom & Prénom <span class="text-red-500">*</span></label>
                        <input pInputText id="nom_prenom" formControlName="nom_prenom" 
                            [class]="{'ng-invalid ng-dirty': isFieldInvalid('nom_prenom')}" />
                        <small class="text-red-500" *ngIf="isFieldInvalid('nom_prenom')">Ce champ est requis</small>
                    </div>
                    
                    <div class="col-12 md:col-6">
                        <label for="code_siege">Code Siège <span class="text-red-500">*</span></label>
                        <input pInputText id="code_siege" formControlName="code_siege" 
                            [class]="{'ng-invalid ng-dirty': isFieldInvalid('code_siege')}" />
                        <small class="text-red-500" *ngIf="isFieldInvalid('code_siege')">Ce champ est requis</small>
                    </div>
                    
                    <div class="col-12 md:col-6">
                        <label for="code_section">Code Section <span class="text-red-500">*</span></label>
                        <input pInputText id="code_section" formControlName="code_section" 
                            [class]="{'ng-invalid ng-dirty': isFieldInvalid('code_section')}" />
                        <small class="text-red-500" *ngIf="isFieldInvalid('code_section')">Ce champ est requis</small>
                    </div>
                    
                    <div class="col-12 md:col-6">
                        <label for="mot_pass">Mot de passe <span class="text-red-500">*</span></label>
                        <p-password id="mot_pass" formControlName="mot_pass" [feedback]="false" 
                            [class]="{'ng-invalid ng-dirty': isFieldInvalid('mot_pass')}" 
                            [toggleMask]="true" />
                        <small class="text-red-500" *ngIf="isFieldInvalid('mot_pass')">Ce champ est requis (min. 6 caractères)</small>
                    </div>
                    
                    <div class="col-12 md:col-6">
                        <label for="confirmPassword">Confirmation mot de passe <span class="text-red-500">*</span></label>
                        <p-password id="confirmPassword" formControlName="confirmPassword" [feedback]="false" 
                            [class]="{'ng-invalid ng-dirty': isFieldInvalid('confirmPassword')}" 
                            [toggleMask]="true" />
                        <small class="text-red-500" *ngIf="isFieldInvalid('confirmPassword')">Ce champ est requis</small>
                        <small class="text-red-500 block" *ngIf="newAgentForm.hasError('passwordMismatch') && newAgentForm.get('confirmPassword')?.dirty">
                            Les mots de passe ne correspondent pas
                        </small>
                    </div>
                </div>

                <div class="flex justify-content-end gap-2 mt-4">
                    <p-button 
                        label="Annuler" 
                        icon="pi pi-times" 
                        (click)="cancelNewAgent()" 
                        class="p-button-text p-button-danger">
                    </p-button>
                    <p-button 
                        label="Enregistrer" 
                        icon="pi pi-save" 
                        type="submit"
                        [disabled]="!newAgentForm.valid || !passwordsMatch()"
                        styleClass="p-button-success">
                    </p-button>
                </div>
            </form>
        </p-dialog>

        <p-toast></p-toast>
        <p-confirmDialog></p-confirmDialog>
    `,
    styles: [`
        .stats-card {
            transition: all 0.3s ease;
            border-left: 4px solid;
            height: 100%;
        }
        
        .stats-card:hover {
            transform: translateY(-5px);
        }
        
        .bg-blue-50 {
            border-left-color: #3B82F6;
            background-color: rgba(59, 130, 246, 0.05);
        }
        
        .bg-green-50 {
            border-left-color: #10B981;
            background-color: rgba(16, 185, 129, 0.05);
        }
        
        .bg-red-50 {
            border-left-color: #EF4444;
            background-color: rgba(239, 68, 68, 0.05);
        }
        
        .p-progressbar {
            border-radius: 6px;
        }
        
        .p-progressbar-determinate {
            height: 2rem !important;
        }

        /* Custom button styles */
        .p-button.p-button-plain {
            color: #6b7280;
            background-color: transparent;
            border-color: transparent;
        }
        
        .p-button.p-button-plain:hover {
            background-color: rgba(0, 0, 0, 0.04);
        }
    `],
    providers: [MessageService, ConfirmationService]
})
export class Crud implements OnInit {
    private agentService = inject(AgentService);
    private fb = inject(FormBuilder);
    
    listAgents: Agent[] = [];
    agentDialogVisible: boolean = false;
    newAgentDialogVisible: boolean = false;
    selectedAgent: Agent | null = null;
    newAgentForm: FormGroup;
    showResetPassword: boolean = false;
    
    @ViewChild('dtt') dtt!: Table;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {
        this.newAgentForm = this.fb.group({
            matricule: ['', Validators.required],
            nom_prenom: ['', Validators.required],
            code_siege: ['', Validators.required],
            code_section: ['', Validators.required],
            mot_pass: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
            etat: [1, Validators.required]
        }, { validators: this.passwordMatchValidator });
    }

    ngOnInit() {
        this.getAllAgents();
    }

    async getAllAgents() {
       this.listAgents = await this.agentService.getListAgent();
      // console.log("list:", this.listAgents);
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dtt.filterGlobal(filterValue, 'contains');
    }

    showAgentDetails(agent: Agent) {
        this.selectedAgent = agent;
        this.showResetPassword = false;
        this.agentDialogVisible = true;
    }

    async toggleAgentStatus(agent: Agent) {
        if (!agent) {
            console.error('No agent selected');
            return;
        }

        try {
            const newStatus = agent.etat === 1 ? 0 : 1;
            const updatedAgent = { ...agent, etat: newStatus };
            await this.agentService.updateAgent(agent.matricule.toString(), updatedAgent);
            
            // Update local data
            const index = this.listAgents.findIndex(a => a.matricule === agent.matricule);
            if (index !== -1) {
                this.listAgents[index] = updatedAgent;
                this.listAgents = [...this.listAgents];
            }
            
            this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: `Agent ${newStatus === 1 ? 'activé' : 'désactivé'} avec succès`,
                life: 3000
            });
            
            this.agentDialogVisible = false;
            this.selectedAgent = updatedAgent;
        } catch (error) {
            console.error('Error updating agent status:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: "Échec de la modification de l'état de l'agent",
                life: 3000
            });
        }
    }

    openNewAgentDialog() {
        this.newAgentForm.reset({ etat: 1 });
        this.newAgentDialogVisible = true;
    }

    cancelNewAgent() {
        this.newAgentDialogVisible = false;
        this.newAgentForm.reset();
    }

    isFieldInvalid(field: string): boolean {
        const control = this.newAgentForm.get(field);
        return control ? control.invalid && (control.dirty || control.touched) : false;
    }

    passwordMatchValidator(form: FormGroup) {
        const password = form.get('mot_pass')?.value;
       // console.log("password:", password);
        
        const confirmPassword = form.get('confirmPassword')?.value;
       // console.log("confirmPassword:", confirmPassword);
        
        return password === confirmPassword ? null : { passwordMismatch: true };
    }

    passwordsMatch(): boolean {
        return this.newAgentForm.value.mot_pass === this.newAgentForm.value.confirmPassword;
    }

    async saveNewAgent() {
        if (this.newAgentForm.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez remplir tous les champs obligatoires',
                life: 3000
            });
            return;
        }

        if (!this.passwordsMatch()) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Les mots de passe ne correspondent pas',
                life: 3000
            });
            return;
        }

        try {
            const newAgent = {
                ...this.newAgentForm.value,
                confirmPassword: undefined
            };
           // console.log("newAgent:", newAgent);
            

            const createdAgent = await this.agentService.createAgent(newAgent);
            this.listAgents = [...this.listAgents, createdAgent];
            
            this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Nouvel agent ajouté avec succès',
                life: 3000
            });

            this.newAgentDialogVisible = false;
            this.newAgentForm.reset();
        } catch (error) {
           // console.error('Error creating agent:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: "Échec de l'ajout de l'agent. Veuillez réessayer.",
                life: 3000
            });
        }
    }

    getActiveCount(): number {
        return this.listAgents.filter(agent => agent.etat === 1).length;
    }

    getInactiveCount(): number {
        return this.listAgents.filter(agent => agent.etat === 0).length;
    }
}