import type {AwardDTO} from "./eventDTOs.ts";

export interface QuestionDTO {
    id: number;
    ordinal: number;
    text: string;
    awardId: number;
    award: AwardDTO;
}