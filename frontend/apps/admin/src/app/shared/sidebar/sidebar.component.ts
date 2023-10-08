import { Component, inject } from '@angular/core';
import { AuthService } from '@frontend/users';

@Component({
    selector: 'admin-sidebar',
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
    private _authService = inject(AuthService);

    onLogout() {
        this._authService.logout();
    }
}
