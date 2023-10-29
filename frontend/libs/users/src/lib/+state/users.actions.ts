import { createAction, props } from '@ngrx/store';
import { User } from '../models/user.model';

export const buildUserSession = createAction('[Users] Build User Session');

export const initUsers = createAction('[Users Page] Init');

export const buildUserSessionSuccess = createAction(
    '[Users/API] Build User Session Success',
    props<{ user: User }>()
);

export const buildUserSessionFailure = createAction(
    '[Users/API] Build User Session Failure',
    props<{ error: string }>()
);
