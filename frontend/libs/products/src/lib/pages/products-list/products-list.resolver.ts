import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Category } from '../../models/category.model';
import { Observable, take } from 'rxjs';
import { CategoriesService } from '@frontend/products';
import { inject } from '@angular/core';

export const CategoriesResolver: ResolveFn<Category[]> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    categoriesService: CategoriesService = inject(CategoriesService)
): Observable<Category[]> => {
    return categoriesService.getCategories().pipe(take(1));
};
