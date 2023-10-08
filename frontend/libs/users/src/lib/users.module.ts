import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { usersRoutes } from './users.routes';
import { NgPrimeModule } from '@frontend/ui';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        NgPrimeModule,
        ReactiveFormsModule,
        RouterModule.forChild(usersRoutes)
    ],
    declarations: [LoginComponent]
})
export class UsersModule {}
