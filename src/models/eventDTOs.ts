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
    awards: AwardInEventDTO[];
    createdAt?: string;
    updatedAt?: string;
}

export interface AwardInEventDTO {
    id: number;
    awardId: number;
    eventId: number;
    winnerId: number | null;
    createdAt: string;
    updatedAt: string;
    award: AwardDTO;
}

export interface AwardDTO {
    id: number;
    name: string;
    description: string;
    questionId: number;
    createdAt: string;
    updatedAt: string;
    question: AwardQuestionDTO;
}

export interface AwardQuestionDTO {
    id: number;
    ordinal: number;
    text: string;
    awardId: number;
    createdAt: string;
    updatedAt: string;
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