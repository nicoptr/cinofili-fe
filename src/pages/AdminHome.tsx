import { useEffect, useState } from "react";
import {
    type ApiEvent,
    createEvent,
    deleteEvent,
    type EventFormBody,
    fetchEvents,
    updateEvent,
} from "../services/apiEvent.ts";
import {
    type Category,
    createCategory,
    deleteCategory,
    fetchCategories,
    updateCategory,
} from "../services/category.ts";
import CategoryModal from "../components/category.modal.tsx";
import EventModal from "../components/event.modal.tsx";
import {getMe} from "../services/auth.ts";

export default function AdminHome() {
    const [activeTab, setActiveTab] = useState<"events" | "categories">("events");
    const [events, setEvents] = useState<ApiEvent[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editingEvent, setEditingEvent] = useState<ApiEvent | null>(null);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);


    const handleLogout = async () => {
        localStorage.removeItem("token");
        try {
            await getMe();
        } catch {
            window.location.href = "/";
        }
    };

    useEffect(() => {
        if (activeTab === "events") {
            setLoading(true);
            fetchEvents()
                .then((data) => setEvents(data.docs))
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === "categories") {
            setLoading(true);
            fetchCategories()
                .then((data) => setCategories(data.docs))
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [activeTab]);

    const handleSubmitCategory = async (name: string, description: string) => {
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, { name, description });
            } else {
                await createCategory({ name, description });
            }

            setIsCategoryModalOpen(false);
            setEditingCategory(null);
            setLoading(true);
            fetchCategories()
                .then((data) => setCategories(data.docs))
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false));
        } catch (err: any) {
            alert("Errore: " + err.message);
        }
    };

    const handleSubmitEvent = async (data: EventFormBody) => {
        try {
            if (editingEvent) {
                await updateEvent(editingEvent.id, data);
            } else {
                await createEvent(data);
            }

            setIsEventModalOpen(false);
            setEditingEvent(null);
            setLoading(true);
            fetchEvents()
                .then((d) => setEvents(d.docs))
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false));
        } catch (err: any) {
            alert("Errore: " + err.message);
        }
    };


    const renderEventsTab = () => {
        if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Caricamento eventi...</p>;
        if (error) return <p style={{ color: "red", textAlign: "center", marginTop: "2rem" }}>Errore: {error}</p>;

        return (
            <>
                <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                    <button
                        style={{
                            backgroundColor: "#daa520",
                            color: "#2f4f4f",
                            padding: "0.5rem 1rem",
                            border: "none",
                            borderRadius: "0.5rem",
                            fontWeight: "bold",
                            cursor: "pointer",
                            marginBottom: "1rem",
                        }}
                        onClick={() => {
                            setEditingEvent(null);
                            setIsEventModalOpen(true);
                        }}
                    >
                        Crea nuovo evento
                    </button>
                </div>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {events.map((event) => (
                        <li
                            key={event.id}
                            style={{
                                backgroundColor: "#f5f9f0",
                                border: "2px solid #daa520",
                                borderRadius: "0.5rem",
                                padding: "1rem",
                                marginBottom: "1rem",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <div>
                                <strong style={{ color: "#2f4f4f", fontSize: "1.1rem" }}>{event.name}</strong>
                                <p style={{ color: "#2f4f4f", margin: "0.25rem 0" }}>{event.description}</p>
                                <p style={{ color: "#2f4f4f", fontSize: "0.85rem" }}>
                                    Partecipanti: {event.numberOfParticipants} | Attivo: {event.isActive ? "Sì" : "No"}
                                </p>
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button
                                    style={{
                                        backgroundColor: "#2f4f4f",
                                        color: "#daa520",
                                        padding: "0.4rem 0.7rem",
                                        borderRadius: "0.5rem",
                                        border: "none",
                                        cursor: "pointer",
                                        fontWeight: "bold",
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
                                        backgroundColor: "#ff4d4f",
                                        color: "#fff",
                                        padding: "0.4rem 0.7rem",
                                        borderRadius: "0.5rem",
                                        border: "none",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                    }}
                                    onClick={async () => {
                                        if (!confirm(`Sei sicuro di voler eliminare l'evento ${event.name}?`)) return;

                                        try {
                                            await deleteEvent(event.id);
                                            setLoading(true);
                                            fetchEvents()
                                                .then((data) => setEvents(data.docs))
                                                .catch((err) => setError(err.message))
                                                .finally(() => setLoading(false));
                                        } catch (err: any) {
                                            alert("Errore durante l'eliminazione: " + err.message);
                                        }
                                    }}
                                >
                                    Elimina
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                <EventModal
                    isOpen={isEventModalOpen}
                    onClose={() => {
                        setIsEventModalOpen(false);
                        setEditingEvent(null);
                    }}
                    onSubmit={handleSubmitEvent}
                    initialData={
                        editingEvent
                            ? {
                                name: editingEvent.name,
                                description: editingEvent.description,
                                isActive: editingEvent.isActive,
                                subscriptionExpiresAt: editingEvent.subscriptionExpiresAt,
                                numberOfParticipants: editingEvent.numberOfParticipants,
                            }
                            : undefined
                    }
                />
            </>
        );
    };

    const renderCategoriesTab = () => (
        <>
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <button
                    style={{
                        backgroundColor: "#daa520",
                        color: "#2f4f4f",
                        padding: "0.5rem 1rem",
                        border: "none",
                        borderRadius: "0.5rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                        marginBottom: "1rem",
                    }}
                    onClick={() => setIsCategoryModalOpen(true)}
                >
                    Crea nuova categoria
                </button>
            </div>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {categories.map((category) => (
                    <li
                        key={category.id}
                        style={{
                            backgroundColor: "#f5f9f0",
                            border: "2px solid #daa520",
                            borderRadius: "0.5rem",
                            padding: "1rem",
                            marginBottom: "1rem",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <div>
                            <strong style={{ color: "#2f4f4f", fontSize: "1.1rem" }}>{category.name}</strong>
                            <p style={{ color: "#2f4f4f", margin: "0.25rem 0" }}>{category.description}</p>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                                style={{
                                    backgroundColor: "#2f4f4f",
                                    color: "#daa520",
                                    padding: "0.4rem 0.7rem",
                                    borderRadius: "0.5rem",
                                    border: "none",
                                    cursor: "pointer",
                                    fontWeight: "bold",
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
                                    backgroundColor: "#ff4d4f",
                                    color: "#fff",
                                    padding: "0.4rem 0.7rem",
                                    borderRadius: "0.5rem",
                                    border: "none",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                }}
                                onClick={async () => {
                                    if (!confirm(`Sei sicuro di voler eliminare la categoria ${category.name}?`)) return;
                                    try {
                                        await deleteCategory(category.id);
                                        setLoading(true);
                                        fetchCategories()
                                            .then((data) => setCategories(data.docs))
                                            .catch((err) => setError(err.message))
                                            .finally(() => setLoading(false));
                                    } catch (err: any) {
                                        alert("Errore durante l'eliminazione: " + err.message);
                                    }
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
        <div style={{ padding: "2rem", backgroundColor: "#d0f0c0", minHeight: "100vh", position: "relative" }}>
            {/* 🔹 Bottone logout */}
            <button
                onClick={handleLogout}
                style={{
                    position: "absolute",
                    top: "1.5rem",
                    right: "2rem",
                    backgroundColor: "#2f4f4f",
                    color: "#daa520",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                }}
            >
                Logout
            </button>

            <h1 style={{ color: "#daa520", textAlign: "center", marginBottom: "2rem" }}>Admin Dashboard</h1>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem", gap: "1rem" }}>
                <button
                    style={{
                        backgroundColor: activeTab === "events" ? "#daa520" : "#f5f9f0",
                        color: "#2f4f4f",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem",
                        border: "2px solid #daa520",
                        fontWeight: "bold",
                        cursor: "pointer",
                    }}
                    onClick={() => setActiveTab("events")}
                >
                    Eventi
                </button>
                <button
                    style={{
                        backgroundColor: activeTab === "categories" ? "#daa520" : "#f5f9f0",
                        color: "#2f4f4f",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem",
                        border: "2px solid #daa520",
                        fontWeight: "bold",
                        cursor: "pointer",
                    }}
                    onClick={() => setActiveTab("categories")}
                >
                    Categorie
                </button>
            </div>

            <div>{activeTab === "events" ? renderEventsTab() : renderCategoriesTab()}</div>
        </div>
    );
}
