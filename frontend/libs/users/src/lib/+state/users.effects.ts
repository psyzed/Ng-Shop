import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';

import * as UsersActions from './users.actions';

import { switchMap, catchError, of, map, Observable } from 'rxjs';
import { LocalstorageService } from '../services/localstorage/localstorage.service';
import { UsersService } from '../services/users/users.service';
import { Action } from '@ngrx/store';

@Injectable()
export class UsersEffects {
    private actions$ = inject(Actions);
    private localStorageService = inject(LocalstorageService);
    private userService = inject(UsersService);

    buildUserSession$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(UsersActions.buildUserSession),
            switchMap(() => {
                if (this.localStorageService.isValidToken()) {
                    const userId =
                        this.localStorageService.getUserIdFromToken();
                    if (userId) {
                        return this.fetchUserById(userId);
                    } else {
                        return of(
                            UsersActions.buildUserSessionFailure({
                                error: 'Invalid Token'
                            })
                        );
                    }
                } else {
                    return of(
                        UsersActions.buildUserSessionFailure({
                            error: 'Invalid Token'
                        })
                    );
                }
            }),
            catchError((error) =>
                of(UsersActions.buildUserSessionFailure({ error }))
            )
        );
    });

    private fetchUserById(userId: string): Observable<Action> {
        return this.userService.getUserById(userId).pipe(
            map(
                (user) => {
                    return UsersActions.buildUserSessionSuccess({
                        user: user.user
                    });
                },
                catchError((error) =>
                    of(UsersActions.buildUserSessionFailure({ error }))
                )
            )
        );
    }
}
