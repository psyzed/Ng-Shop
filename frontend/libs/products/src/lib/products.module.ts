import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsSearchComponent } from './components/products-search/products-search.component';
import { CategoriesBannerComponent } from './components/categories-banner/categories-banner.component';
import { NgPrimeModule, UiModule } from '@frontend/ui';
import { HttpClientModule } from '@angular/common/http';
import { ProductItemComponent } from './components/product-item/product-item.component';
import { FeaturedProductsComponent } from './components/featured-products/featured-products.component';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { ProductsRoutingModule } from './products-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductDetailPageComponent } from './pages/product-detail-page/product-detail-page.component';
import { DropdownMenuComponent } from './components/product-search/dropdown-menu/dropdown-menu.component';

@NgModule({
    imports: [
        CommonModule,
        NgPrimeModule,
        UiModule,
        HttpClientModule,
        ProductsRoutingModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        ProductsSearchComponent,
        CategoriesBannerComponent,
        ProductItemComponent,
        FeaturedProductsComponent,
        ProductsListComponent,
        ProductDetailPageComponent,
        DropdownMenuComponent
    ],
    exports: [
        ProductsSearchComponent,
        CategoriesBannerComponent,
        FeaturedProductsComponent,
        ProductItemComponent,
        ProductsListComponent,
        ProductDetailPageComponent,
        DropdownMenuComponent
    ]
})
export class ProductsModule {}
