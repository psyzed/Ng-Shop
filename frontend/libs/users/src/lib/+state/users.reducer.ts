import { Action, createReducer, on } from '@ngrx/store';

import * as UsersActions from './users.actions';
import { User } from '@frontend/users';

export const USERS_FEATURE_KEY = 'users';

export interface UsersState {
    user: User;
    isAuthenticated: boolean;
}

export interface UsersPartialState {
    readonly [USERS_FEATURE_KEY]: UsersState;
}

export const initialUsersState: UsersState = {
    user: {} as User,
    isAuthenticated: false
};

export const usersReducer = createReducer(
    initialUsersState,
    on(UsersActions.buildUserSession, (state) => {
        return {
            ...state
        };
    }),

    on(UsersActions.buildUserSessionSuccess, (state, action) => {
        return {
            ...state,
            user: action.user,
            isAuthenticated: true
        };
    }),

    on(UsersActions.buildUserSessionFailure, (state, { error }) => {
        return {
            ...state,
            isAuthenticated: false,
            error
        };
    })
);

export function reducer(state: UsersState | undefined, action: Action) {
    return usersReducer(state, action);
}
