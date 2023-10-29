import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { LoginComponent } from './pages/login/login.component';
import { UiModule } from '@frontend/ui';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersRoutingModule } from './users.routes';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromUsers from './+state/users.reducer';
import { UsersEffects } from './+state/users.effects';
import { UsersFacade } from './+state/users.facade';
import { environment } from '@env/environment';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        UiModule,
        ReactiveFormsModule,
        UsersRoutingModule,
        StoreModule.forFeature(fromUsers.USERS_FEATURE_KEY, fromUsers.reducer),
        EffectsModule.forFeature([UsersEffects]),
        !environment.production ? StoreDevtoolsModule.instrument() : []
    ],
    declarations: [LoginComponent],
    providers: [UsersFacade]
})
export class UsersModule {}
