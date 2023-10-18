import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { CategoriesResolver } from './pages/products-list/products-list.resolver';
import { ProductDetailPageComponent } from './pages/product-detail-page/product-detail-page.component';

export const productsRoutes: Route[] = [
    {
        path: 'products',
        component: ProductsListComponent,
        resolve: {
            categories: CategoriesResolver
        },
        children: [
            {
                path: 'category/:categoryId',
                component: ProductsListComponent
            }
        ]
    },
    {
        path: 'product/:productId',
        component: ProductDetailPageComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(productsRoutes)],
    exports: [RouterModule]
})
export class ProductsRoutingModule {}
