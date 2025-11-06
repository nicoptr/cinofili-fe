import {logout} from "./auth.ts";
import {DateTime} from "luxon";

export const handleLogout = async () => {
    logout();
};

export const formatItaliaDateString = (date: Date | undefined | null): string => {
    return date ? DateTime.fromJSDate(date).toFormat("dd-MM-yyyy") : "data mancante";
}

export const formatItaliaTimeStringFromString = (date: string | undefined | null): string => {
    console.log("received date: ", date)
    const result = new Date(date ?? "").toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit"
    });
    console.log("result: ", result)
    return result;

}