import {customFetch} from "./customFetch.ts";
import type {AnswerFormDTO} from "../models/AnswerFormDTO.ts";


export async function rateSubscription(subId: number, dto: AnswerFormDTO) {
    return await customFetch(true, `/answers/rate/${subId}`, {
        method: "POST",
        body: JSON.stringify(dto),
    });
}
