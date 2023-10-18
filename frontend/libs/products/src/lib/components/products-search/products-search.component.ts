import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil, tap } from 'rxjs';
import { ProductsService } from '../../services/products/products.service';
import { Product } from '../../models/product.model';
import { Router } from '@angular/router';

@Component({
    selector: 'products-search',
    templateUrl: './products-search.component.html',
    styles: []
})
export class ProductsSearchComponent implements OnInit, OnDestroy {
    public searchForm!: FormGroup;
    public searchResults: Product[] = [];
    public showDropDown = false;
    public isLoading = false;
    private _destroyed$ = new Subject<void>();

    private _formBuilder = inject(FormBuilder);
    private _productsService = inject(ProductsService);
    private _router = inject(Router);

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
        this.formCotrol.valueChanges
            .pipe(
                tap((value) => {
                    value.length > 2 ? (this.isLoading = true) : (this.isLoading = false);
                    if (value.length === 0) this.showDropDown = false;
                }),
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
                    this.searchResults = res;
                    this.isLoading = false;
                    this.showDropDown = res.length > 0;
                },
                (error) => {
                    this.isLoading = false;
                }
            );
    }

    public onSelectProduct(productId: string): void {
        this.showDropDown = false;
        this.formCotrol.setValue('');
        this._router.navigate(['product', productId]);
    }

    private get formCotrol(): FormControl {
        return <FormControl>this.searchForm.get('searchTerm')!;
    }

    ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
