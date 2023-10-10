import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { OrdersService } from '@frontend/orders';
import { ProductsService } from '@frontend/products';
import { UsersService } from '@frontend/users';
import { Subject, forkJoin, takeUntil, tap } from 'rxjs';

@Component({
    selector: 'admin-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
    private _ordersService = inject(OrdersService);
    private _productsService = inject(ProductsService);
    private _userService = inject(UsersService);

    private _destroy$ = new Subject<void>();
    public totalOrders = 0;
    public totalSales = 0;
    public totalProducts = 0;
    public totalUsers = 0;

    ngOnInit(): void {
        forkJoin([
            this._ordersService.getTotalOrders(),
            this._ordersService.getTotalSales(),
            this._productsService.getTotalProducts(),
            this._userService.getTotalUsers()
        ])
            .pipe(
                takeUntil(this._destroy$),
                tap(([totalOrders, totalSales, totalProducts, totalUsers]) => {
                    this.totalSales = totalSales.totalSales || 0;
                    this.totalProducts = totalProducts.totalProducts || 0;
                    this.totalUsers = totalUsers.totalUsers || 0;
                    this.totalOrders = totalOrders.totalOrders || 0;
                })
            )
            .subscribe();
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }
}
