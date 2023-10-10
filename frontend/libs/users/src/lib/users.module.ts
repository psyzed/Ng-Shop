import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { NgPrimeModule } from '@frontend/ui';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersRoutingModule } from './users.routes';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        NgPrimeModule,
        ReactiveFormsModule,
        UsersRoutingModule
    ],
    declarations: [LoginComponent]
})
export class UsersModule {}
