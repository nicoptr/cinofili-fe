import { useEffect, useState } from "react";
import { type Category, fetchCategories } from "../services/category";
import {type ApiEvent, type ApiEventParticipant, fetchEvents} from "../services/apiEvent";
import { type SubscriptionForm } from "../services/subscription";
import { type UserProfile} from "../services/auth.ts";
import * as React from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: SubscriptionForm) => void;
    initialData?: SubscriptionForm;
}

export default function SubscriptionModal({
                                              isOpen,
                                              onClose,
                                              onSubmit,
                                              initialData
                                          }: Props) {
    const [movieName, setMovieName] = useState(initialData?.movieName ?? "");
    const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "");
    const [eventId, setEventId] = useState(initialData?.eventId ?? "");

    const [categories, setCategories] = useState<Category[]>([]);
    const [events, setEvents] = useState<ApiEvent[]>([]);

    useEffect(() => {
        if (!isOpen) return;

        const loggedUser = JSON.parse(localStorage.getItem("userProfile")!) as UserProfile;
        console.log("loggedUser: ", loggedUser);

        fetchEvents().then(r => {
            const filteredEvents = r.docs.filter(e => e.participants.some(p => p.id === loggedUser?.id) && e.isActive);
            setEvents(filteredEvents);
        }).catch(console.error);

        setMovieName(initialData?.movieName ?? "");
        setCategoryId(initialData?.categoryId ?? "");
        setEventId(initialData?.eventId ?? "");
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        console.log("event selected: ", eventId);
        if (!eventId) {
            setCategories([]);
            return;
        }

        fetchCategories().then(r => {
            console.log("events: ", events);
            const filteredByEventCategories = r.docs
                .filter(c => events
                    .find(e => e.id === eventId)
                    ?.categories
                    .map(ec => ec.id)
                    .includes(c.id));
            console.log("by event categories: ", filteredByEventCategories);
            const loggedUser = JSON.parse(localStorage.getItem("userProfile")!) as ApiEventParticipant;
            console.log("loggedUser: ", loggedUser);

            const filteredByUserCategories = filteredByEventCategories
                .filter(c => loggedUser.eventSpecification
                    ?.filter(es => es.eventId === eventId)
                    .map(es => es.categoryId)
                    .includes(c.id));
            console.log("filteredByUserCategories: ", filteredByUserCategories);

            setCategories(filteredByUserCategories);
        }).catch(console.error);
    }, [eventId, isOpen, events]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            movieName,
            categoryId: Number(categoryId),
            eventId: Number(eventId)
        });
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: "fixed",
            top: 0, left: 0,
            width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex", justifyContent: "center", alignItems: "center",
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: "#f5f9f0",
                padding: "2rem",
                borderRadius: "1rem",
                border: "2px solid #daa520",
                width: "420px",
                position: "relative"
            }}>
                <h2 style={{ textAlign: "center", color: "#daa520", marginBottom: "1rem" }}>
                    {initialData ? "Modifica iscrizione" : "Nuova iscrizione"}
                </h2>

                {/* Info */}
                <p style={{ fontSize: "0.9rem", color: "#2f4f4f", marginBottom: "1rem" }}>
                    ⚠️ Alla conferma verrà inviata una mail alla Presidentessa per l’approvazione.
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Nome film */}
                    <label style={{ color: "#2f4f4f", fontWeight: "bold" }}>Nome Film</label>
                    <input
                        type="text"
                        value={movieName}
                        onChange={(e) => setMovieName(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "0.5rem",
                            borderRadius: "0.5rem",
                            marginBottom: "1rem",
                            border: "1px solid #daa520"
                        }}
                    />

                    {/* Evento */}
                    <label style={{ color: "#2f4f4f", fontWeight: "bold" }}>Evento</label>
                    <select
                        value={eventId}
                        onChange={(e) => setEventId(Number(e.target.value))}
                        required
                        style={{
                            width: "100%",
                            padding: "0.5rem",
                            borderRadius: "0.5rem",
                            marginBottom: "1rem",
                            border: "1px solid #daa520"
                        }}
                    >
                        <option value="" disabled>Seleziona</option>
                        {events.map(ev => (
                            <option key={ev.id} value={ev.id}>{ev.name}</option>
                        ))}
                    </select>

                    {/* Categoria */}
                    <label style={{ color: "#2f4f4f", fontWeight: "bold" }}>Categoria</label>
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(Number(e.target.value))}
                        required
                        style={{
                            width: "100%",
                            padding: "0.5rem",
                            borderRadius: "0.5rem",
                            marginBottom: "1rem",
                            border: "1px solid #daa520"
                        }}
                    >
                        <option value="" disabled>Seleziona</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>

                    {/* Bottoni */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                backgroundColor: "#ccc",
                                color: "#000",
                                padding: "0.5rem 1rem",
                                borderRadius: "0.5rem",
                                border: "none",
                                cursor: "pointer"
                            }}
                        >
                            Annulla
                        </button>

                        <button
                            type="submit"
                            style={{
                                backgroundColor: "#daa520",
                                color: "#2f4f4f",
                                padding: "0.5rem 1rem",
                                borderRadius: "0.5rem",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: "bold"
                            }}
                        >
                            {initialData ? "Salva" : "Candidati"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
