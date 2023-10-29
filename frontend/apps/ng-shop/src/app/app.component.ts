import { Component, OnInit, inject } from '@angular/core';
import { UsersService } from '@frontend/users';

@Component({
    selector: 'frontend-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    title = 'ng-shop';

    private _userService = inject(UsersService);

    ngOnInit(): void {
        this._initUserSession();
    }

    private _initUserSession(): void {
        this._userService.initUserSession();
    }
}
