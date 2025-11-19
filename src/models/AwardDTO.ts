import type {AwardQuestionDTO} from "./eventDTOs.ts";

export interface AwardDTO {
    id: number;
    name: string;
    description: string;
    questionId: number;
    createdAt: string;
    updatedAt: string;
    question: AwardQuestionDTO;
}