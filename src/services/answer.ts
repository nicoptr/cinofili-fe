import {customFetch} from "./customFetch.ts";
import type {AnswerDTO, AnswerFormDTO} from "../models/AnswerFormDTO.ts";


export async function rateSubscription(subId: number, dto: AnswerFormDTO) {
    return await customFetch(true, `/answers/rate/${subId}`, {
        method: "POST",
        body: JSON.stringify(dto),
    });
}

export async function fetchPersonalAnswers(subId: number): Promise<AnswerDTO[]> {
    return await customFetch(true, `/answers/rate/${subId}`, {
        method: "GET",
    });
}

export async function fetchAllAnswers(subId: number): Promise<AnswerDTO[]> {
    return await customFetch(true, `/answers/rate/all/${subId}`, {
        method: "GET",
    });
}
