import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { User, UsersService } from '@frontend/users';
import { Subject, filter, takeUntil, tap } from 'rxjs';

@Component({
    selector: 'ngshop-home-page',
    templateUrl: './home-page.component.html'
})
export class HomePageComponent implements OnInit, OnDestroy {
    public user: User = null;

    private _userService = inject(UsersService);
    private _destroyed$ = new Subject<void>();

    ngOnInit(): void {
        this._getUser();
        this._initUserSession();
    }

    private _initUserSession(): void {
        if (!this.user) {
            this._userService.initUserSession();
        }
    }

    private _getUser(): void {
        this._userService
            .getCurrentUser()
            .pipe(
                takeUntil(this._destroyed$),
                filter((user) => Object.keys(user).length > 0),
                tap((user) => (this.user = user))
            )
            .subscribe();
    }

    ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
