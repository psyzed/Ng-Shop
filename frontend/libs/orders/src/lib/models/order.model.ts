import { User } from '@frontend/users';
import { OrderItem } from './order-item.model';

export interface DashBoardTotals {
    totalOrders?: number;
    totalSales?: number;
}

export interface OrderApiResponse {
    message: string;
    success: boolean;
    order: Order;
}
export interface Order {
    _id?: string;
    orderItems: OrderItem[];
    shippingAddress1: string;
    shippingAddress2: string;
    city: string;
    zip: string;
    country: string;
    phone: string;
    status: number;
    totalPrice?: number;
    user: User;
    dateOrdered: string;
}

export interface OrderStatus {
    [key: number]: {
        label: string;
        color: string;
    };
}

export const ORDER_STATUS: OrderStatus = {
    0: {
        label: 'Pending',
        color: 'primary'
    },
    1: {
        label: 'Processed',
        color: 'warning'
    },
    2: {
        label: 'Shipped',
        color: 'warning'
    },
    3: {
        label: 'Delivered',
        color: 'success'
    },
    4: {
        label: 'Cancelled',
        color: 'danger'
    }
};
