import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil } from 'rxjs';
import { ProductsService } from '../../services/products/products.service';
import { Product } from '../../models/product.model';

@Component({
    selector: 'products-search',
    templateUrl: './products-search.component.html',
    styles: []
})
export class ProductsSearchComponent implements OnInit, OnDestroy {
    public searchForm!: FormGroup;

    private _formBuilder = inject(FormBuilder);
    private _productsService = inject(ProductsService);
    private _destroyed$ = new Subject<void>();

    ngOnInit(): void {
        this._initForm();
        this._onSearchProduct();
    }

    private _initForm(): void {
        this.searchForm = this._formBuilder.group({
            searchTerm: ['']
        });
    }

    private _onSearchProduct(): void {
        this.searchForm
            .get('searchTerm')!
            .valueChanges.pipe(
                debounceTime(750),
                distinctUntilChanged(),
                map((value) => value.trim()),
                filter((value) => value.length > 2),
                switchMap((value: string) => {
                    return this._productsService.getProducts(undefined, value);
                }),
                takeUntil(this._destroyed$)
            )
            .subscribe(
                (res: Product[]) => {
                    console.log(res);
                },
                (error) => {
                    console.log(error);
                }
            );
    }

    ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
