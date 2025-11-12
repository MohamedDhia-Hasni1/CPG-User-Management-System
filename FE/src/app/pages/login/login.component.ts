import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService } from '../../_services/auth.service';

@Component({
    selector: 'app-login',
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    private authService = inject(AuthService);
    private router = inject(Router);
    loginForm!: FormGroup;
    ngOnInit(): void {
        this.loginForm = new FormGroup({
            matricule: new FormControl('', [Validators.required, Validators.minLength(6)]),
            password: new FormControl('', [Validators.required])
        });
    }
    get matricule() {
        return this.loginForm.get('matricule');
    }

    get password() {
        return this.loginForm.get('password');
    }
    login() {
    if (this.loginForm.invalid) {
      Object.values(this.loginForm.controls).forEach(control => {
        control.markAsDirty();
        control.markAsTouched();
      });
      return;
    }

    const { matricule, password } = this.loginForm.value;
    const postData = { matricule, password };


    this.authService.login(postData).subscribe({
      next: (data: any) => {
      
        localStorage.setItem("matricule", data.matricule);
        localStorage.setItem("nom", data.nom);
        
       // this.router.navigate(["layout/dashboard"]);
        this.router.navigate(["layout/pages/crud"]);
      },
      error: (error: any) => {
        console.log("Erreur de connexion", error);
      }
    });
  }
}
