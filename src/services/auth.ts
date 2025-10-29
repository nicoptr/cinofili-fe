import {customFetch} from "./customFetch.ts";

export interface LoginPayload {
    usernameOrEmail: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    window.location.href = "/login";
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
    try {
        const response = await customFetch(false, `/auth/login`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        }) as LoginResponse;

        localStorage.setItem("token", response.token);

        return response;


    } catch (err: any) {
        throw err;
    }
}

export interface UserProfile {
    id: number;
    username: string;
    email: string;
    roles: Array<{
        id: number;
        roleName: string;
        userId: number;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
    }>;
    avatarUrl?: string | null;
    note?: string | null;
    deleted?: boolean;
    createdAt: string;
    updatedAt: string;
}

export async function getMe(): Promise<UserProfile> {
    try {
        const result = await customFetch(true, `/auth/profile`, {
            method: "GET",
        });
        localStorage.setItem("userProfile", JSON.stringify(result));
        return result as UserProfile;
    } catch (err: any) {
        throw err;
    }
}

export interface RegisterBody {
    username: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    id?: number;
    username?: string;
    email?: string;
}

export async function registerUser(body: RegisterBody): Promise<RegisterResponse> {
    try {
        return await customFetch(false, `/users/register`, {
            method: "POST",
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
    } catch (err: any) {
        console.error("registerUser error:", err);
        throw err;
    }
}