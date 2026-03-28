import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_header {
    value: string;
    name: string;
}
export interface Article {
    id: string;
    status: string;
    title: string;
    content: string;
    createdAt: bigint;
    slug: string;
    author: Principal;
    imageUrl: string;
    category: string;
    featured?: boolean;
    excerpt?: string;
    tags?: string[];
    publishedAt?: number;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface UserProfile {
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createArticle(title: string, content: string, category: string, imageUrl: string, slug: string, status: string): Promise<string>;
    deleteArticle(id: string): Promise<void>;
    getArticle(id: string): Promise<Article | null>;
    getArticles(): Promise<Array<Article>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendTelegramMessage(botToken: string, chatId: string, message: string): Promise<string>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateArticle(id: string, title: string, content: string, category: string, imageUrl: string, slug: string, status: string): Promise<Article>;
}
