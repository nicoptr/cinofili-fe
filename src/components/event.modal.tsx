import {type FC, useEffect, useState } from "react";

export interface EventFormBody {
    name: string;
    description: string;
    isActive: boolean;
    subscriptionExpiresAt: string | null;
    numberOfParticipants: number;
}

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: EventFormBody) => void;
    initialData?: EventFormBody;
}

const EventModal: FC<EventModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [name, setName] = useState(initialData?.name || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
    const [subscriptionExpiresAt, setSubscriptionExpiresAt] = useState(initialData?.subscriptionExpiresAt || "");
    const [numberOfParticipants, setNumberOfParticipants] = useState(initialData?.numberOfParticipants || 0);

    useEffect(() => {
        setName(initialData?.name || "");
        setDescription(initialData?.description || "");
        setIsActive(initialData?.isActive ?? true);
        setSubscriptionExpiresAt(initialData?.subscriptionExpiresAt || "");
        setNumberOfParticipants(initialData?.numberOfParticipants || 0);
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0, left: 0,
                width: "100%", height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000
            }}
        >
            <div
                style={{
                    backgroundColor: "#f5f9f0",
                    padding: "2rem",
                    borderRadius: "1rem",
                    width: "400px",
                    maxWidth: "90%",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
                }}
            >
                <h2 style={{ color: "#2f4f4f", marginBottom: "1rem", textAlign: "center" }}>
                    {initialData ? "Modifica Evento" : "Crea Evento"}
                </h2>

                <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.25rem", color: "#2f4f4f" }}>Nome</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "0.5rem",
                            borderRadius: "0.5rem",
                            border: "2px solid #daa520"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.25rem", color: "#2f4f4f" }}>Descrizione</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "0.5rem",
                            borderRadius: "0.5rem",
                            border: "2px solid #daa520",
                            minHeight: "60px"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#2f4f4f" }}>
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={e => setIsActive(e.target.checked)}
                        />
                        Attivo
                    </label>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.25rem", color: "#2f4f4f" }}>Scadenza iscrizione</label>
                    <input
                        type="datetime-local"
                        value={subscriptionExpiresAt ? subscriptionExpiresAt.slice(0,16) : ""}
                        onChange={e => setSubscriptionExpiresAt(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "0.5rem",
                            borderRadius: "0.5rem",
                            border: "2px solid #daa520"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.25rem", color: "#2f4f4f" }}>Numero partecipanti</label>
                    <input
                        type="number"
                        value={numberOfParticipants}
                        onChange={e => setNumberOfParticipants(Number(e.target.value))}
                        style={{
                            width: "100%",
                            padding: "0.5rem",
                            borderRadius: "0.5rem",
                            border: "2px solid #daa520"
                        }}
                    />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            backgroundColor: "#ff4d4f",
                            color: "#fff",
                            padding: "0.5rem",
                            borderRadius: "0.5rem",
                            border: "none",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        Annulla
                    </button>
                    <button
                        onClick={() => onSubmit({ name, description, isActive, subscriptionExpiresAt, numberOfParticipants })}
                        style={{
                            flex: 1,
                            backgroundColor: "#2f4f4f",
                            color: "#daa520",
                            padding: "0.5rem",
                            borderRadius: "0.5rem",
                            border: "none",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        {initialData ? "Salva" : "Crea"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventModal;
