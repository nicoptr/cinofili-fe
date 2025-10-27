import { customFetch } from "./customFetch";

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    avatarUrl?: string | null;
    note?: string | null;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UserQueryBody {
    query: {
        value: string;
        roles: string[];
    };
    options: {
        limit: number;
        page: number;
        sort: any[];
        populate: string;
    };
}

export interface UserPaginatedResponse {
    docs: User[];
}


export async function fetchUsers(body: UserQueryBody): Promise<User[]> {
    const response = await customFetch<UserPaginatedResponse>(
        true, // requiresAuth ✅
        "/users/",
        {
            method: "POST",
            body: JSON.stringify(body),
        }
    );

    return response.docs;
}