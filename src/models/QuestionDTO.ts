import type {AwardDTO} from "./AwardDTO.ts";

export interface QuestionDTO {
    id: number;
    ordinal: number;
    text: string;
    awardId: number;
    award: AwardDTO;
}