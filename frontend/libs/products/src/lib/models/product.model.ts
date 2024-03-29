import { Category } from './category.model';

export interface ProductApiResponse {
    totalProducts?: number;
}

export interface ApiResponse<T> {
    message: string;
    data: T;
}

export interface Product {
    _id: string;
    image: string;
    brand: string;
    price: number;
    rating: number;
    numReviews: number | null;
    isFeatured: boolean;
    name: string;
    description: string;
    category: Category;
    reviews: ProductReview[];
    countInStock: number;
    richDescription: string;
    images: string[];
    dateCreated: string;
    quantity?: number;
}

export interface ProductFormData extends FormData {
    id: string;
    name: string;
    brand: string;
    price: number;
    category: string;
    countInStock: number;
    description: string;
    richDescription: string;
    image: File | null;
    isFeatured: boolean;
}

export interface ProductReview {
    avatar: string;
    name: string;
    review: string;
}
