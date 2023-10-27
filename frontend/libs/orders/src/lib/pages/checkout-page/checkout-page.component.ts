import { Component, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User, UsersService } from '@frontend/users';
import { OrderItem } from '../../models/order-item.model';
import { Order } from '../../models/order.model';
import { CartService, OrdersService } from '@frontend/orders';
import { take } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'orders-checkout-page',
    templateUrl: './checkout-page.component.html',
    styles: []
})
export class CheckoutPageComponent implements OnInit {
    public userForm!: FormGroup;
    public countries: { id: string; name: string }[] = [];
    public isSubmited = false;
    public isShippingFree = false;
    public totalItemsPrice = 0;
    public shippingCosts: number = 0;
    public totalOrderPrice = 0;
    public orderItems: OrderItem[] = [];
    public user: User = { id: '65395cc644014a39b0deace3' } as User;

    private _router = inject(Router);
    private _formBuilder = inject(FormBuilder);
    private _userService = inject(UsersService);
    private _location = inject(Location);
    private _ordersService = inject(OrdersService);
    private _confirmationService = inject(ConfirmationService);
    private _toastMessageService = inject(MessageService);
    private _cartService = inject(CartService);

    ngOnInit(): void {
        this._initForm();
        this._getCountries();
        this._getDataFromRouter();
    }

    onNavigate(url: string) {
        this._router.navigate([url]);
    }

    private _initForm() {
        this.userForm = this._formBuilder.group({
            name: [null, Validators.required],
            email: [null, [Validators.required, Validators.email]],
            phone: [null, Validators.required],
            street: [null, Validators.required],
            apartment: [null, Validators.required],
            zip: [null, Validators.required],
            city: [null, Validators.required],
            country: [null, Validators.required]
        });
    }

    onPlaceOrder(): void {
        this.isSubmited = true;
        if (this.userForm.invalid) {
            return;
        }
        const orderItems = this.orderItems.map((item) => {
            return {
                _id: item._id,
                quantity: item.quantity
            };
        });
        const order: Order = {
            orderItems: orderItems,
            shippingAddress1: this.userFormControls['street'].value,
            shippingAddress2: this.userFormControls['apartment'].value,
            city: this.userFormControls['city'].value,
            zip: this.userFormControls['zip'].value,
            country: this.userFormControls['country'].value,
            phone: this.userFormControls['phone'].value,
            status: 0,
            user: this.user,
            dateOrdered: Date.now().toString()
        };
        this._ordersService
            .createOrder(order)
            .pipe(take(1))
            .subscribe(
                (order) => {
                    this._confirmationService.confirm({
                        message: 'We have received your order successfully',
                        header: 'Thank you!',
                        icon: 'pi pi-check',
                        accept: () => {
                            this._cartService.resetCart();
                            this._router.navigate(['/']);
                        }
                    });
                },
                (error) => {
                    this._toastMessageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Order was not created, please try again later'
                    });
                }
            );
    }

    private _getCountries(): void {
        this.countries = this._userService.getCountries();
    }

    private _getDataFromRouter(): void {
        const data = this._location.getState() as {
            totalItemsPrice: number;
            shippingCosts: number;
            totalOrderPrice: number;
            isShippingFree: boolean;
            products: OrderItem[];
        };
        this.isShippingFree = data.isShippingFree;
        this.totalItemsPrice = data.totalItemsPrice;
        this.shippingCosts = data.shippingCosts;
        this.totalOrderPrice = data.totalOrderPrice;
        this.orderItems = data.products;
    }

    get userFormControls() {
        return this.userForm.controls;
    }
}
