import { Product } from '@frontend/products';

export interface OrderItem {
    _id: string;
    quantity: number;
    product?: Product;
}
