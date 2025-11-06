export interface EventDTO {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    subscriptionExpiresAt: string; // ISO string da Postgres
    expiresAt: string; // ISO string
    numberOfParticipants: number;
    categories: CategoryInEventDTO[];
    participants: ParticipantInEventDTO[];
    subscriptions: SubscriptionInEventDTO[];
    createdAt?: string;
    updatedAt?: string;
}

export interface CategoryInEventDTO {
    id: number;
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ParticipantInEventDTO {
    id: number;
    username: string;
    email?: string;
    roles?: { id: number; roleName: string }[];
    eventSpecification?: {
        eventId: number;
        categoryId: number;
    }[];
}

export interface SubscriptionInEventDTO {
    id: number;
    ownerId: number;
    movieName: string;
    isValid: boolean;
    isProjectionPlanned: boolean;
    isReadyForProjection: boolean;
    isReadyForRating: boolean;
    projectAt: string | null;
    location: string | null;
    projectionOrder: number;
    categoryId: number;
    eventId: number;
    createdAt: string;
    updatedAt: string;
}