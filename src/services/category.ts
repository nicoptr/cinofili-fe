import {customFetch} from "./customFetch.ts";

export interface Category {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryBody {
    name: string;
    description: string;
}

export interface CategoriesResponse {
    docs: Category[];
}

export async function fetchCategories(): Promise<CategoriesResponse> {
    const body = {
        query: { value: "" },
        options: { limit: 10, page: 1, sort: [], populate: "" },
    };

    try {
        return await customFetch(true, `/categories/`, {
            method: "POST",
            body: JSON.stringify(body),
        });
    } catch (err: any) {
        console.error("fetchCategories error:", err);
        throw err;
    }
}

export async function createCategory(body: CategoryBody): Promise<Category> {
    try {
        return await customFetch(true, `/categories/create`, {
            method: "POST",
            body: JSON.stringify(body),
        });
    } catch (err: any) {
        console.error("createCategory error:", err);
        throw err;
    }
}

export async function deleteCategory(id: number): Promise<void> {
    try {
        return await customFetch(true, `/categories/${id}`, {
            method: "DELETE",
        });
        // se la chiamata va a buon fine, non restituiamo nulla
    } catch (err: any) {
        console.error("deleteCategory error:", err);
        throw err;
    }
}


export async function updateCategory(id: number, body: CategoryBody): Promise<Category> {
    try {
        return await customFetch(true, `/categories/${id}`, {
            method: "PATCH",
            body: JSON.stringify(body),
        });
    } catch (err: any) {
        console.error("updateCategory error:", err);
        throw err;
    }
}
