import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
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
    updateArticle(id: string, title: string, content: string, category: string, imageUrl: string, slug: string, status: string): Promise<Article>;
}
