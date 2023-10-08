import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { LocalstorageService } from '@frontend/users';

export class JwtInterceptor implements HttpInterceptor {
    intercept(
        req: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        const localStorageService = inject(LocalstorageService);
        const token = localStorageService.getJWTToken();
        const apiURL = req.url.startsWith(environment.apiURL);

        if (token && apiURL) {
            req = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            });
        }
        return next.handle(req);
    }
}
