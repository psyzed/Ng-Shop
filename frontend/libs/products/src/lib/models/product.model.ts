import { Category } from './category.model';

export interface Product {
    id: string;
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
}

export interface ProductFormData {
    id?: string;
    name: string;
    brand: string;
    price: number;
    category: string;
    countInStock: number;
    description: string;
    richDescription: string;
    image?: File;
    isFeatured: boolean;
}

export interface ProductReview {
    avatar: string;
    name: string;
    review: string;
}
