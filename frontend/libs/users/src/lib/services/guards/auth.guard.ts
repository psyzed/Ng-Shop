import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalstorageService, TokenPayload } from '@frontend/users';

export function authGuard(): CanActivateFn {
    return () => {
        const router = inject(Router);
        const localStorageService = inject(LocalstorageService);
        const token = localStorageService.getJWTToken();

        if (token) {
            const tokenPayload: TokenPayload = JSON.parse(
                atob(token.split('.')[1])
            );
            if (tokenPayload.isAdmin && checkTokenExpDate(tokenPayload.exp)) {
                return true;
            } else {
                localStorageService.removeJwtToken();
                router.navigate(['login']);
                return false;
            }
        } else {
            router.navigate(['login']);
            return false;
        }
    };
}

function checkTokenExpDate(expirationDate: number): boolean {
    return Math.floor(Date.now() / 1000) <= expirationDate;
}
