import { Product } from '@frontend/products';

export interface OrderItem {
    product: Product;
    quantity: number;
}
