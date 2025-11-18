export interface AnswerDTO {
    questionId: number;
    value: number;
}

export interface AnswerFormDTO {
    answers: Array<AnswerDTO>;
}