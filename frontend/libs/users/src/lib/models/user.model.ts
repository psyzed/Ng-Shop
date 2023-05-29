export interface UserApiResponse {
    success: boolean;
    user: User;
}
export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    token: string;
    phone: string;
    isAdmin: boolean;
    street: string;
    apartment: string;
    zip: string;
    city: string;
    country: string;
}
