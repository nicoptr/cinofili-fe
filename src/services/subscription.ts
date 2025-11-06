import {customFetch} from "./customFetch.ts";

export interface Subscription {
    id: number;
    ownerId: number;
    movieName: string;
    isValid: boolean;
    categoryId: number;
    eventId: number;
    createdAt: string;
    updatedAt: string;
    event?: {
        id: number;
        name: string;
        description: string;
        isActive: boolean;
        expiresAt: string | null;
        subscriptionExpiresAt: string | null;
        numberOfParticipants: number;
        createdAt: string;
        updatedAt: string;
    };
    category?: {
        id: number;
        name: string;
        description: string;
        createdAt: string;
        updatedAt: string;
    };
}

export interface SubscriptionsResponse {
    docs: Subscription[];
}

export async function fetchMySubscriptions(): Promise<SubscriptionsResponse> {
    return customFetch(true, "/subscriptions/my", {
        method: "POST",
        body: JSON.stringify({
            query: { value: "" },
            options: { limit: 10, page: 1, sort: [], populate: "" },
        }),
    });
}

export interface SubscriptionForm {
    movieName: string;
    categoryId: number;
    eventId: number;
}

export async function createSubscription(body: SubscriptionForm) {
    return customFetch(true, "/subscriptions/create", {
        method: "POST",
        body: JSON.stringify({ ...body }),
    });
}

export async function updateSubscription(id: number, body: SubscriptionForm) {
    return customFetch(true, `/subscriptions/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
    });
}

export async function updateProjectionPlanning(id: number, projectAt: string, location: string) {
    return customFetch(true, `/subscriptions/plan/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
            projectAt,
            location,
        }),
    });
}

export async function invalidate(subscriptionId: number): Promise<void> {
    await customFetch<void>(true, `/subscriptions/invalidate/${subscriptionId}`, {
        method: "PATCH",
        body: JSON.stringify({})

    });
}

export async function deleteSubscription(subscriptionId: number) {
    await customFetch<void>(true, `/subscriptions/${subscriptionId}`, {
        method: "DELETE",
        body: JSON.stringify({})
    });
}

export async function unlockNextSubscription(eventId: number): Promise<boolean> {
    return customFetch<boolean>(true, `/subscriptions/next/${eventId}`, {
        method: "GET",
    })
}