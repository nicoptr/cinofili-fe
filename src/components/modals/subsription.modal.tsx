import { useEffect, useState } from "react";
import './Modal.css';
import {type ApiEvent, type ApiEventParticipant, fetchEvents} from "../../services/apiEvent.ts";
import type {UserProfile} from "../../services/auth.ts";
import {type Category, fetchCategories} from "../../services/category.ts";
import type {SubscriptionForm} from "../../services/subscription.ts";

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

        if (!eventId) {
            setCategories([]);
            return;
        }

        fetchCategories().then(r => {
            const filteredByEventCategories = r.docs
                .filter(c => events
                    .find(e => e.id === eventId)
                    ?.categories
                    .map(ec => ec.id)
                    .includes(c.id));
            const loggedUser = JSON.parse(localStorage.getItem("userProfile")!) as ApiEventParticipant;

            const filteredByUserCategories = filteredByEventCategories
                .filter(c => loggedUser.eventSpecification
                    ?.filter(es => es.eventId === eventId)
                    .map(es => es.categoryId)
                    .includes(c.id));

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
        <div className="modal-overlay">
            <div className="modal-container">
                <h2 className="modal-title">{initialData ? "Modifica iscrizione" : "Nuova iscrizione"}</h2>

                {/* Info */}
                <p className="modal-info-text">
                    ⚠️ Alla conferma verrà inviata una mail alla Presidentessa per l’approvazione.
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Nome film */}
                    <label className="modal-label">Nome Film</label>
                    <input
                        type="text"
                        value={movieName}
                        onChange={(e) => setMovieName(e.target.value)}
                        required
                        className="modal-input"
                    />

                    {/* Evento */}
                    <label className="modal-label">Evento</label>
                    <select
                        value={eventId}
                        onChange={(e) => setEventId(Number(e.target.value))}
                        required
                        className="modal-select"
                    >
                        <option value="" disabled>Seleziona</option>
                        {events.map(ev => (
                            <option key={ev.id} value={ev.id}>{ev.name}</option>
                        ))}
                    </select>

                    {/* Categoria */}
                    <label className="modal-label">Categoria</label>
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(Number(e.target.value))}
                        required
                        className="modal-select"
                    >
                        <option value="" disabled>Seleziona</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>

                    {/* Bottoni */}
                    <div className="modal-buttons">
                        <button
                            type="button"
                            onClick={onClose}
                            className="modal-button modal-button-cancel"
                        >
                            Annulla
                        </button>

                        <button
                            type="submit"
                            className="modal-button modal-button-submit"
                        >
                            {initialData ? "Salva" : "Candidati"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
