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
import CategoryModal from "../components/category.modal";
import EventModal from "../components/event.modal";
import {invalidate} from "../services/subscription.ts";
import {useNavigate} from "react-router-dom";

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

    // ⬇️ Per toggle candidature evento
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


    // ✅ Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };


    const renderEventsTab = () => {
        if (loading) return <p style={{textAlign: "center"}}>Caricamento eventi...</p>;
        if (error) return <p style={{textAlign: "center", color: "red"}}>Errore: {error}</p>;

        return (
            <>
                <div style={{textAlign: "center", marginBottom: "1.5rem"}}>
                    <button
                        style={{
                            backgroundColor: "#daa520", color: "#2f4f4f",
                            padding: "0.5rem 1rem", border: "none",
                            borderRadius: "0.5rem", cursor: "pointer",
                            fontWeight: "bold"
                        }}
                        onClick={() => {
                            setEditingEvent(null);
                            setIsEventModalOpen(true);
                        }}
                    >
                        Crea nuovo evento
                    </button>
                </div>

                <ul style={{listStyle: "none", padding: 0}}>
                    {events.map(event => {
                        const expanded = expandedEvents[event.id] || false;

                        const max = event.numberOfParticipants || 1;
                        const current = event.participants?.length ?? 0;
                        const progress = Math.min((current / max) * 100, 100);

                        const subsProgress = Math.min(((event.subscriptions.length || 0) / max) * 100, 100);


                        const deadline = new Date(event.subscriptionExpiresAt).toLocaleDateString("it-IT");
                        const awardDate = new Date(event.expiresAt).toLocaleDateString("it-IT");


                        return (
                            <li key={event.id} style={{
                                backgroundColor: "#f5f9f0",
                                border: "2px solid #daa520",
                                borderRadius: "0.5rem",
                                padding: "1rem",
                                marginBottom: "1rem"
                            }}>
                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                    <div style={{flex: 1}}>
                                        <strong style={{color: "#2f4f4f", fontSize: "1.1rem"}}>{event.name}</strong>
                                        <p style={{margin: "0.25rem 0", color: "#2f4f4f"}}>{event.description}</p>

                                        {/* ✅ Categorie */}
                                        <div style={{marginBottom: "0.5rem"}}>
                                            {event.categories.map(cat => (
                                                <span key={cat.id} style={{
                                                    backgroundColor: "#daa520",
                                                    color: "#2f4f4f",
                                                    padding: "0.25rem 0.7rem",
                                                    borderRadius: "0.5rem",
                                                    marginRight: "0.3rem",
                                                    fontSize: "0.75rem",
                                                    fontWeight: "bold"
                                                }}>
                                                    {cat.name.toUpperCase()}
                                                </span>
                                            ))}
                                        </div>

                                        {/* ✅ Barra progressiva */}
                                        <div style={{
                                            backgroundColor: "#d3e6c5",
                                            height: "10px", width: "100%",
                                            borderRadius: "0.5rem", overflow: "hidden"
                                        }}>
                                            <div style={{
                                                height: "100%", width: `${progress}%`,
                                                backgroundColor: progress >= 100 ? "#daa520" : "#2f4f4f",
                                                transition: "width .3s"
                                            }}/>
                                        </div>

                                        <p style={{fontSize: "0.85rem", margin: "0.25rem 0", color: "#2f4f4f"}}>
                                            {current}/{max} partecipanti iscritti
                                        </p>

                                        {/* ✅ Barra progressiva candidature */}
                                        <div style={{
                                            backgroundColor: "#d3e6c5",
                                            height: "10px", width: "100%",
                                            borderRadius: "0.5rem", overflow: "hidden"
                                        }}>
                                            <div style={{
                                                height: "100%", width: `${subsProgress}%`,
                                                backgroundColor: progress >= 100 ? "#daa520" : "#397d7d",
                                                transition: "width .3s"
                                            }}/>
                                        </div>

                                        <p style={{fontSize: "0.85rem", margin: "0.25rem 0", color: "#2f4f4f"}}>
                                            {event.subscriptions?.length || 0}/{max} candidature inviate
                                        </p>

                                        {/* ✅ Date */}
                                        <p style={{margin: 0, fontSize: "0.85rem", color: "#2f4f4f"}}>
                                            Scadenza candidature: <b>{deadline}</b>
                                        </p>
                                        <p style={{fontSize: "0.85rem", color: "#2f4f4f"}}>
                                            Data premiazione: <b>{awardDate}</b>
                                        </p>
                                    </div>

                                    {/* ✅ Pulsanti */}
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0.5rem",
                                        marginLeft: "1rem"
                                    }}>
                                        <button
                                            style={{
                                                backgroundColor: "#1e7e34",
                                                color: "#fff",
                                                padding: ".4rem .7rem",
                                                borderRadius: ".5rem",
                                                border: "none",
                                                cursor: "pointer",
                                                fontWeight: "bold"
                                            }}
                                            onClick={async () => {
                                                if (!confirm("Confermando questa operazione tutti i partecipanti inseriti riceveranno un'email di invito a presentare una candidatura. Nell'email sarà specificata la categoria da utlizzare e non potranno cambiarla. Questa operazione è possibile solo se il numero di categorie è minore del numero di partecipanti. Ogni partecipante riceverà una categoria in maniera del tutto casuale. ")) return;
                                                try {
                                                    await inviteParticipants(event.id);

                                                    setLoading(true);
                                                    fetchEvents()
                                                        .then(data => setEvents(data.docs))
                                                        .catch(err => setError(err.message))
                                                        .finally(() => setLoading(false));
                                                } catch (err: any) {
                                                    alert("Errore durante l'invalidazione: " + err.message);
                                                }
                                            }}
                                        >
                                            Invita partecipanti
                                        </button>
                                        <button
                                            style={{
                                                backgroundColor: "#2f4f4f", color: "#daa520",
                                                padding: ".4rem .7rem", borderRadius: ".5rem",
                                                border: "none", cursor: "pointer", fontWeight: "bold"
                                            }}
                                            onClick={() => {
                                                setEditingEvent(event);
                                                setIsEventModalOpen(true);
                                            }}
                                        >
                                            Modifica
                                        </button>
                                        <button
                                            style={{
                                                backgroundColor: "#ff4d4f", color: "#fff",
                                                padding: ".4rem .7rem", borderRadius: ".5rem",
                                                border: "none", cursor: "pointer", fontWeight: "bold"
                                            }}
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
                                </div>

                                {/* ✅ Espandi candidature */}
                                <button
                                    style={{
                                        marginTop: "1rem",
                                        backgroundColor: "#daa520", color: "#2f4f4f",
                                        padding: ".4rem .7rem", border: "none",
                                        borderRadius: ".5rem", cursor: "pointer",
                                        fontWeight: "bold"
                                    }}
                                    onClick={() => toggleExpand(event.id)}
                                >
                                    {expanded ? "Nascondi candidature ⬆️" : "Mostra candidature ⬇️"}
                                </button>

                                {expanded &&
                                    <div style={{marginTop: ".7rem"}}>
                                        {event.subscriptions.length === 0 ? (
                                            <p style={{fontSize: ".85rem"}}>Nessuna candidatura registrata.</p>
                                        ) : (
                                            event.subscriptions.map(sub => (
                                                <div key={sub.id} style={{
                                                    backgroundColor: "#fff",
                                                    border: `2px solid ${sub.isValid ? "#2f4f4f" : "#ff4d4f"}`,
                                                    borderRadius: "0.5rem",
                                                    padding: ".6rem",
                                                    marginBottom: ".5rem",
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center"
                                                }}>
                                                    <div style={{flex: 1}}>
                                                        <span
                                                            style={{
                                                                color: sub.isValid ? "#2f4f4f" : "#ff4d4f",
                                                                fontWeight: sub.isValid ? "normal" : "bold",
                                                                marginRight: "1rem"
                                                            }}
                                                        >
                                                            🎬 {sub.movieName}
                                                        </span>

                                                        {/* Indicatore Categoria */}
                                                        <span style={{
                                                            backgroundColor: "#daa520",
                                                            color: "#2f4f4f",
                                                            padding: "0.2rem 0.6rem",
                                                            borderRadius: "0.5rem",
                                                            fontSize: "0.75rem",
                                                            fontWeight: "bold",
                                                            marginLeft: "0.5rem"
                                                        }}>
                                                            {event.categories.find(cat => cat.id === sub.categoryId)?.name.toUpperCase() ?? "SENZA CATEGORIA"}
                                                        </span>
                                                    </div>

                                                    {sub.isValid ? (
                                                        <button
                                                            style={{
                                                                backgroundColor: "#ff4d4f", color: "#fff",
                                                                padding: ".3rem .6rem",
                                                                borderRadius: ".4rem",
                                                                border: "none",
                                                                cursor: "pointer",
                                                                fontWeight: "bold",
                                                                fontSize: ".75rem"
                                                            }}
                                                            onClick={async () => {
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
                                                            }}
                                                        >
                                                            Invalida
                                                        </button>
                                                    ) : (
                                                        <span style={{
                                                            fontSize: ".75rem",
                                                            fontWeight: "bold",
                                                            color: "#ff4d4f"
                                                        }}>
                                                            ⏳ In attesa di modifica
                                                        </span>
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
            <div style={{textAlign: "center", marginBottom: "1.5rem"}}>
                <button
                    style={{
                        backgroundColor: "#daa520", color: "#2f4f4f",
                        padding: "0.5rem 1rem", borderRadius: "0.5rem",
                        border: "none", cursor: "pointer", fontWeight: "bold"
                    }}
                    onClick={() => {
                        setEditingCategory(null);
                        setIsCategoryModalOpen(true);
                    }}
                >
                    Crea nuova categoria
                </button>
            </div>

            <ul style={{listStyle: "none", padding: 0}}>
                {categories.map(category => (
                    <li key={category.id} style={{
                        backgroundColor: "#f5f9f0",
                        border: "2px solid #daa520",
                        borderRadius: "0.5rem",
                        padding: "1rem",
                        marginBottom: "1rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <div>
                            <strong style={{color: "#2f4f4f"}}>{category.name}</strong>
                            <p style={{fontSize: ".85rem", color: "#2f4f4f"}}>{category.description}</p>
                        </div>

                        <div style={{display: "flex", gap: ".5rem"}}>
                            <button
                                style={{
                                    backgroundColor: "#2f4f4f", color: "#daa520",
                                    padding: ".4rem .7rem", borderRadius: ".5rem",
                                    cursor: "pointer", fontWeight: "bold"
                                }}
                                onClick={() => {
                                    setEditingCategory(category);
                                    setIsCategoryModalOpen(true);
                                }}
                            >
                                Modifica
                            </button>

                            <button
                                style={{
                                    backgroundColor: "#ff4d4f", color: "#fff",
                                    padding: ".4rem .7rem", borderRadius: ".5rem",
                                    cursor: "pointer", fontWeight: "bold"
                                }}
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
        <div style={{padding: "2rem", backgroundColor: "#d0f0c0", minHeight: "100vh", position: "relative"}}>

            {/* ✅ Pulsante "Presenta candidatura" */}
            <button
                onClick={() => navigate('/home')}
                style={{
                    position: "absolute", top: "1.5rem", left: "2rem",
                    backgroundColor: "#2f4f4f", color: "#daa520",
                    padding: "0.5rem 1rem", border: "none",
                    borderRadius: "0.5rem", cursor: "pointer",
                    fontWeight: "bold"
                }}
            >
                Presenta candidatura
            </button>

            {/* ✅ Logout */}
            <button
                onClick={handleLogout}
                style={{
                    position: "absolute", top: "1.5rem", right: "2rem",
                    backgroundColor: "#2f4f4f", color: "#daa520",
                    padding: "0.5rem 1rem", border: "none",
                    borderRadius: "0.5rem", cursor: "pointer",
                    fontWeight: "bold"
                }}
            >
                Logout
            </button>

            <h1 style={{textAlign: "center", color: "#daa520"}}>Pannello di controllo della Presidentessa</h1>

            {/* ✅ Tabs */}
            <div style={{display: "flex", justifyContent: "center", marginBottom: "2rem", gap: "1rem"}}>
                <button
                    style={{
                        backgroundColor: activeTab === "events" ? "#daa520" : "#f5f9f0",
                        color: "#2f4f4f", border: "2px solid #daa520",
                        padding: ".5rem 1rem", borderRadius: ".5rem",
                        cursor: "pointer", fontWeight: "bold"
                    }}
                    onClick={() => setActiveTab("events")}
                >
                    Eventi
                </button>
                <button
                    style={{
                        backgroundColor: activeTab === "categories" ? "#daa520" : "#f5f9f0",
                        color: "#2f4f4f", border: "2px solid #daa520",
                        padding: ".5rem 1rem", borderRadius: ".5rem",
                        cursor: "pointer", fontWeight: "bold"
                    }}
                    onClick={() => setActiveTab("categories")}
                >
                    Categorie
                </button>
            </div>

            {activeTab === "events" ? renderEventsTab() : renderCategoriesTab()}
        </div>
    );
}
