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

    getUserIdFromToken(): string {
        const token = this.getJWTToken();
        if (token) {
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            return tokenPayload.userId;
        } else {
            return '';
        }
    }

    removeJwtToken(): void {
        localStorage.removeItem(TOKEN);
    }

    isValidToken(): boolean {
        const token = this.getJWTToken();
        if (token) {
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            return Math.floor(Date.now() / 1000) <= tokenPayload.exp;
        } else {
            return false;
        }
    }
}
