import { API_BASE_URL } from "../constants";

export async function customFetch<T>(
    requiresAuth: boolean,
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {

    const token = localStorage.getItem("token");

    if (requiresAuth) {
        if (!token) {
            window.location.href = "/";
            throw new Error("Token mancante: redirect a login");
        }
    }

    // Costruisci headers di base
    const headers = new Headers(options.headers || {});
    headers.set("Accept", "*/*");
    headers.set("Content-Type", "application/json");
    requiresAuth && headers.set("Authorization", `Bearer ${token}`);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // Se token scaduto o invalido → logout automatico
    if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
        throw new Error("Token non valido o scaduto, redirect a login");
    }

    // Se risposta non OK → errore
    if (!response.ok) {
        let message = `Errore API (${response.status})`;
        try {
            const errData = await response.json();
            message = errData.message || message;
        } catch (_) {}
        throw new Error(message);
    }

    // Prova a restituire JSON
    try {
        return (await response.json()) as T;
    } catch {
        // Se non è JSON, restituisci un oggetto vuoto
        return {} as T;
    }
}