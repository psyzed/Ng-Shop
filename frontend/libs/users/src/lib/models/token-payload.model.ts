export interface TokenPayload {
    userId: string;
    isAdmin: boolean;
    iat: number;
    exp: number;
}
