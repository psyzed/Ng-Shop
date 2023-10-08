import { Injectable } from '@angular/core';

const TOKEN = 'jwtToken';

@Injectable({
    providedIn: 'root'
})
export class LocalstorageService {
    setJWTToken(token: string): void {
        localStorage.setItem(TOKEN, token);
    }

    getJWTToken(): string | null {
        return localStorage.getItem(TOKEN);
    }

    removeJwtToken(): void {
        localStorage.removeItem(TOKEN);
    }
}
