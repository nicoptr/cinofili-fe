import type {QuestionDTO} from "./QuestionDTO.ts";

export interface AnswerDTO {
    id?: number;
    questionId: number;
    value: number;
    userId?: number;
    subscriptionId?: number;
    question?: QuestionDTO;
}

export interface AnswerFormDTO {
    answers: Array<AnswerDTO>;
}