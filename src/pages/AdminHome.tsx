import {useEffect, useState} from "react";
import {
    type ApiEvent, createEvent,
    deleteEvent,
    type EventFormBody,
    fetchEvents, inviteParticipants,
    updateEvent
} from "../services/apiEvent";
import {
    type Category,
    createCategory,
    deleteCategory,
    fetchCategories,
    updateCategory
} from "../services/category";
import CategoryModal from "../components/modals/category.modal.tsx";
import EventModal from "../components/modals/event.modal.tsx";
import {invalidate} from "../services/subscription.ts";
import {useNavigate} from "react-router-dom";
import "../App.css";
import {handleLogout} from "../services/utils.ts";
import {DateTime} from "luxon";

export default function AdminHome() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<"events" | "categories">("events");
    const [events, setEvents] = useState<ApiEvent[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<ApiEvent | null>(null);

    // ⬇️ Per toggle candidatura evento
    const [expandedEvents, setExpandedEvents] = useState<Record<number, boolean>>({});

    const toggleExpand = (eventId: number) => {
        setExpandedEvents(prev => ({
            ...prev,
            [eventId]: !prev[eventId]
        }));
    };

    // ✅ Fetch eventi
    useEffect(() => {
        if (activeTab !== "events") return;
        setLoading(true);

        fetchEvents()
            .then(data => setEvents(data.docs))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [activeTab]);

    // ✅ Fetch categorie
    useEffect(() => {
        if (activeTab !== "categories") return;
        setLoading(true);

        fetchCategories()
            .then(data => setCategories(data.docs))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [activeTab]);

    // ✅ Submit Categoria (create/update)
    const handleSubmitCategory = async (name: string, description: string) => {
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, {name, description});
            } else {
                await createCategory({name, description});
            }

            setIsCategoryModalOpen(false);
            setEditingCategory(null);

            setLoading(true);
            fetchCategories().then(data => setCategories(data.docs)).finally(() => setLoading(false));
        } catch (err: any) {
            alert("Errore: " + err.message);
        }
    };

    // ✅ Submit Evento (create/update)
    const handleSubmitEvent = async (data: EventFormBody) => {
        try {
            if (editingEvent) await updateEvent(editingEvent.id, data);
            else await createEvent(data);

            setIsEventModalOpen(false);
            setEditingEvent(null);

            setLoading(true);
            fetchEvents().then(data => setEvents(data.docs)).finally(() => setLoading(false));
        } catch (err: any) {
            alert("Errore: " + err.message);
        }
    };

    const renderEventsTab = () => {
        if (loading) return <p style={{textAlign: "center"}}>Caricamento eventi...</p>;
        if (error) return <p style={{textAlign: "center", color: "red"}}>Errore: {error}</p>;

        return (
            <>
                <div className="button-container">
                    <button className="button button-candidature" onClick={() => {
                        setEditingEvent(null);
                        setIsEventModalOpen(true);
                    }}>
                        Crea nuovo evento
                    </button>
                </div>

                <ul className="card-container">
                    {events.map(event => {
                        const expanded = expandedEvents[event.id] || false;
                        const max = event.numberOfParticipants || 1;
                        const current = event.participants?.length ?? 0;
                        const progress = Math.min((current / max) * 100, 100);
                        const subsProgress = Math.min(((event.subscriptions.length || 0) / max) * 100, 100);
                        const deadline = new Date(event.subscriptionExpiresAt).toLocaleDateString("it-IT");
                        const awardDate = new Date(event.expiresAt).toLocaleDateString("it-IT");

                        return (
                            <li className="card" key={event.id}>
                                <div className="card-content">
                                    <strong>{event.name}</strong>
                                    <p>{event.description}</p>

                                    <div className="card-categories">
                                        {event.categories.map(cat => (
                                            <span key={cat.id} className="category-badge">
                                                {cat.name.toUpperCase()}
                                            </span>
                                        ))}
                                    </div>

                                    <p>Scadenza candidature: <b>{deadline}</b></p>
                                    <p>🏆​ Data premiazione: <b>{awardDate}</b></p>

                                    <div className="card-progress-bar">
                                        <div className="bar" style={{width: `${progress}%`}}/>
                                    </div>
                                    <p>{current}/{max} partecipanti iscritti</p>

                                    <div className="card-progress-bar">
                                        <div className="bar" style={{width: `${subsProgress}%`}}/>
                                    </div>
                                    <p>{event.subscriptions?.length || 0}/{max} candidature inviate</p>
                                </div>

                                <div className="card-actions">
                                    {DateTime.fromISO(event.subscriptionExpiresAt) > DateTime.local() ?
                                        (
                                            <button
                                                className="button"
                                                onClick={async () => {
                                                    if (!confirm("Confermando questa operazione tutti i partecipanti inseriti riceveranno un'email di invito a presentare una candidatura. ...")) return;
                                                    try {
                                                        await inviteParticipants(event.id);
                                                        setLoading(true);
                                                        fetchEvents()
                                                            .then(data => setEvents(data.docs))
                                                            .catch(err => setError(err.message))
                                                            .finally(() => setLoading(false));
                                                    } catch (err: any) {
                                                        alert("Errore durante l'invito: " + err.message);
                                                    }
                                                }}
                                            >
                                                Invita partecipanti
                                            </button>
                                        )
                                        :
                                        (
                                            <button
                                                className="button"
                                                onClick={() => navigate(`/projection/${event.id}`)}
                                            >
                                                Vai alla programmazione
                                            </button>
                                        )
                                    }
                                    <button
                                        className="button"
                                        onClick={() => {
                                            setEditingEvent(event);
                                            setIsEventModalOpen(true);
                                        }}
                                    >
                                        Modifica
                                    </button>
                                    <button
                                        className="button"
                                        onClick={async () => {
                                            if (!confirm(`Eliminare '${event.name}'?`)) return;
                                            await deleteEvent(event.id);
                                            setLoading(true);
                                            fetchEvents().then(d => setEvents(d.docs)).finally(() => setLoading(false));
                                        }}
                                    >
                                        Elimina
                                    </button>
                                </div>

                                <button
                                    className="button-expand"
                                    onClick={() => toggleExpand(event.id)}
                                >
                                    {expanded ? "Nascondi candidature ⬆️" : "Mostra candidature ⬇️"}
                                </button>

                                {expanded &&
                                    <div>
                                        {event.subscriptions.length === 0 ? (
                                            <p style={{fontSize: ".85rem"}}>Nessuna candidatura registrata.</p>
                                        ) : (
                                            event.subscriptions.map(sub => (
                                                <div key={sub.id}
                                                     className={`sub-card ${sub.isValid ? "" : "invalid"}`}>
                                                    <div>
                                                        <span className="movie-title">📽️​ {sub.movieName}</span>
                                                        <div className="category-tag">
                                                            {event.categories.find(cat => cat.id === sub.categoryId)?.name.toUpperCase() ?? "SENZA CATEGORIA"}
                                                        </div>
                                                    </div>
                                                    {sub.isValid ? (
                                                        (
                                                            DateTime.fromISO(event.subscriptionExpiresAt) > DateTime.local() ? (
                                                                <button className="button" onClick={async () => {
                                                                    if (!confirm(`Vuoi davvero invalidare la candidatura "${sub.movieName}"?`)) return;
                                                                    try {
                                                                        await invalidate(sub.id);

                                                                        setLoading(true);
                                                                        fetchEvents()
                                                                            .then(data => setEvents(data.docs))
                                                                            .catch(err => setError(err.message))
                                                                            .finally(() => setLoading(false));
                                                                    } catch (err: any) {
                                                                        alert("Errore durante l'invalidazione: " + err.message);
                                                                    }
                                                                }}>
                                                                    Invalida
                                                                </button>
                                                            ) : (
                                                                <span className="valid-text">​✔️ Verificato</span>
                                                            )
                                                        )
                                                    ) : (
                                                        <span className="invalid-text">⏳ In attesa di modifica</span>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                }
                            </li>
                        );
                    })}
                </ul>

                <EventModal
                    isOpen={isEventModalOpen}
                    onClose={() => {
                        setIsEventModalOpen(false);
                        setEditingEvent(null);
                    }}
                    onSubmit={handleSubmitEvent}
                    initialData={editingEvent ? {
                        name: editingEvent.name,
                        description: editingEvent.description,
                        isActive: editingEvent.isActive,
                        subscriptionExpiresAt: editingEvent.subscriptionExpiresAt,
                        numberOfParticipants: editingEvent.numberOfParticipants,
                        categories: editingEvent.categories?.map(c => c.id) || [],
                        participants: editingEvent.participants?.map(p => p.id) || [],
                        expiresAt: editingEvent.expiresAt,
                    } : undefined}
                />
            </>
        );
    };

    const renderCategoriesTab = () => (
        <>
            <div className="button-container">
                <button
                    className="button"
                    onClick={() => {
                        setEditingCategory(null);
                        setIsCategoryModalOpen(true);
                    }}
                >
                    Crea nuova categoria
                </button>
            </div>

            <ul className="card-container">
                {categories.map(category => (
                    <li className="card" key={category.id}>
                        <div>
                            <strong>{category.name}</strong>
                            <p>{category.description}</p>
                        </div>

                        <div className="card-actions">
                            <button
                                className="button"
                                onClick={() => {
                                    setEditingCategory(category);
                                    setIsCategoryModalOpen(true);
                                }}
                            >
                                Modifica
                            </button>

                            <button
                                className="button"
                                onClick={async () => {
                                    if (!confirm(`Eliminare '${category.name}'?`)) return;
                                    await deleteCategory(category.id);
                                    setLoading(true);
                                    fetchCategories().then(d => setCategories(d.docs)).finally(() => setLoading(false));
                                }}
                            >
                                Elimina
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <CategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => {
                    setIsCategoryModalOpen(false);
                    setEditingCategory(null);
                }}
                onSubmit={handleSubmitCategory}
                initialName={editingCategory?.name}
                initialDescription={editingCategory?.description}
            />
        </>
    );


    return (
        <div className="admin-home-container">

            <button
                onClick={handleLogout}
                className="button button-logout"
            >
                Logout
            </button>

            <button
                onClick={() => navigate('/')}
                className="button button-candidature"
            >
                Presenta candidatura
            </button>

            <h1 className="admin-home-title">Pannello di controllo della Presidentessa</h1>

            <div className="tab-container">
                <button
                    className={`tab-button ${activeTab === "events" ? "active" : ""}`}
                    onClick={() => setActiveTab("events")}
                >
                    Eventi
                </button>
                <button
                    className={`tab-button ${activeTab === "categories" ? "active" : ""}`}
                    onClick={() => setActiveTab("categories")}
                >
                    Categorie
                </button>
            </div>

            {activeTab === "events" ? renderEventsTab() : renderCategoriesTab()}
        </div>
    );
}
