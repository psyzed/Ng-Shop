import { Injectable, inject } from '@angular/core';
import { Store, select } from '@ngrx/store';

import * as UsersActions from './users.actions';
import * as UsersSelectors from './users.selectors';

@Injectable()
export class UsersFacade {
    private readonly store = inject(Store);

    user$ = this.store.pipe(select(UsersSelectors.selectUser));
    isAuth$ = this.store.pipe(select(UsersSelectors.selectIsAuthenticated));

    buildUserSession() {
        this.store.dispatch(UsersActions.buildUserSession());
    }
}
