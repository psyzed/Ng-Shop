import { Injectable } from '@angular/core';
import { Cart, CartItem } from '../models/cart.model';
import { BehaviorSubject } from 'rxjs';

const CART_KEY = 'cart';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    public cart$ = new BehaviorSubject<{
        cart: Cart | null;
        getProducts: boolean;
    }>({ cart: this.getCart(), getProducts: true });

    initCartLocalStorage(): void {
        const cart: Cart | null = this.getCart();
        if (!cart) {
            const inialCart = {
                items: []
            };

            localStorage.setItem(CART_KEY, JSON.stringify(inialCart));
        }
    }

    getCart(): Cart | null {
        const storedCart: string | null = localStorage.getItem(CART_KEY);
        if (storedCart) {
            const cart = JSON.parse(storedCart);
            return cart;
        } else {
            return null;
        }
    }

    setCartItem(cartItem: CartItem): void {
        let cart: Cart | null = this.getCart();
        if (!cart) {
            cart = {
                items: []
            };
        }

        const existingItems = cart.items.findIndex(
            (item) => item.productId === cartItem.productId
        );

        if (existingItems !== -1) {
            cart.items[existingItems].quantity + cartItem.quantity;
        } else {
            cart.items.push(cartItem);
        }
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        this.cart$.next({ cart: cart, getProducts: true });
    }

    updateCartItem(cartItem: CartItem): void {
        let cart: Cart | null = this.getCart();
        if (!cart) {
            cart = {
                items: []
            };
        }
        const existingItem = cart.items.findIndex(
            (item) => item.productId === cartItem.productId
        );

        if (existingItem !== -1) {
            cart.items[existingItem].quantity = cartItem.quantity;
        }

        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        this.cart$.next({ cart: cart, getProducts: false });
    }

    deleteCartItem(itemId: string) {
        let cart: Cart | null = this.getCart();

        if (!cart) {
            return;
        }

        const newCartItems = cart.items.filter((item) => {
            return item.productId !== itemId;
        });

        cart.items = newCartItems;

        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        this.cart$.next({ cart: cart, getProducts: true });
    }

    resetCart(): void {
        localStorage.removeItem(CART_KEY);
        this.cart$.next({ cart: null, getProducts: false });
    }
}
