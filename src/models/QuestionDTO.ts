import type {AwardDTO} from "./EventDTO.ts";

export interface QuestionDTO {
    id: number;
    ordinal: number;
    text: string;
    awardId: number;
    award: AwardDTO;
}