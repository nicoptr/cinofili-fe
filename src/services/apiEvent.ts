import {customFetch} from "./customFetch.ts";

export interface ApiEvent {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    expiresAt: string | null;
    subscriptionExpiresAt: string | null;
    numberOfParticipants: number;
    createdAt: string;
    updatedAt: string;
}

export interface EventFormBody {
    name: string;
    description: string;
    isActive: boolean;
    subscriptionExpiresAt: string | null;
    numberOfParticipants: number;
}

export interface EventsResponse {
    docs: ApiEvent[];
}

export async function fetchEvents(): Promise<EventsResponse> {
    const body = {
        query: { value: "" },
        options: { limit: 10, page: 1, sort: [], populate: "" },
    };
    try {
        return await customFetch(true, `/events/`, {
            method: "POST",
            body: JSON.stringify(body),
        });
    } catch (err: any) {
        console.error("fetchEvents error:", err);
        throw err;
    }
}

export async function createEvent(body: EventFormBody): Promise<ApiEvent> {

    try {
        return await customFetch(true, `/events/create`, {
            method: "POST",
            body: JSON.stringify(body),
        });
    } catch (err: any) {
        console.error("createEvent error:", err);
        throw err;
    }

}

export async function updateEvent(id: number, body: EventFormBody): Promise<ApiEvent> {
    try {
        return await customFetch(true, `/events/${id}`, {
            method: "PATCH",
            body: JSON.stringify(body),
        });
    } catch (err: any) {
    console.error("updateEvent error:", err);
    throw err;
}
}

export async function deleteEvent(id: number): Promise<void> {
    try {
        return await customFetch(true, `/events/${id}`, {
            method: "DELETE",
        });
    } catch (err: any) {
        console.error("deleteEvent error:", err);
        throw err;
    }
}