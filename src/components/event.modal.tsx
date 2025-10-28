import { type FC, useEffect, useState, useRef } from "react";
import { fetchCategories, type Category } from "../services/category";
import { fetchUsers, type User } from "../services/user";

export interface EventFormBody {
    name: string;
    description: string;
    isActive: boolean;
    subscriptionExpiresAt: string;
    expiresAt: string;
    numberOfParticipants: number;
    categories: number[];
    participants: number[];
}

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: EventFormBody) => void;
    initialData?: EventFormBody;
}

const EventModal: FC<EventModalProps> = ({
                                             isOpen,
                                             onClose,
                                             onSubmit,
                                             initialData
                                         }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [subscriptionExpiresAt, setSubscriptionExpiresAt] = useState("");
    const [expiresAt, setExpiresAt] = useState<string>("");
    const [numberOfParticipants, setNumberOfParticipants] = useState(0);

    const [categories, setCategories] = useState<number[]>([]);
    const [participants, setParticipants] = useState<number[]>([]);

    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);

    const [openCategories, setOpenCategories] = useState(false);
    const [openParticipants, setOpenParticipants] = useState(false);

    const catRef = useRef<HTMLDivElement>(null);
    const partRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        fetchCategories().then(r => setAllCategories(r.docs));
        fetchUsers({
            query: { value: "", roles: [] },
            options: { limit: 200, page: 1, sort: [], populate: "" }
        }).then(r => setAllUsers(r));

        setName(initialData?.name || "");
        setDescription(initialData?.description || "");
        setIsActive(initialData?.isActive ?? true);
        setSubscriptionExpiresAt(initialData?.subscriptionExpiresAt?.slice(0, 10) || "");
        setExpiresAt(initialData?.expiresAt?.slice(0, 10) || "");
        setNumberOfParticipants(initialData?.numberOfParticipants || 0);
        setCategories(initialData?.categories || []);
        setParticipants(initialData?.participants || []);
    }, [initialData, isOpen]);

    // 🔹 Chiudi dropdown cliccando fuori
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (catRef.current && !catRef.current.contains(e.target as Node)) {
                setOpenCategories(false);
            }
            if (partRef.current && !partRef.current.contains(e.target as Node)) {
                setOpenParticipants(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!isOpen) return null;

    const toggleValue = (arr: number[], id: number) =>
        arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id];

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    background: "#f5f9f0",
                    borderRadius: "1rem",
                    padding: "2rem",
                    width: "450px",
                    border: "2px solid #daa520",
                }}
            >
                <h2 style={{ color: "#daa520", textAlign: "center", marginBottom: "1rem" }}>
                    {initialData ? "Modifica Evento" : "Crea Evento"}
                </h2>

                {/* ✅ Nome */}
                <label style={{ fontWeight: "bold", color: "#2f4f4f" }}>Nome</label>
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{
                        width: "100%",
                        marginBottom: "1rem",
                        padding: ".5rem",
                        borderRadius: "0.5rem",
                        border: "2px solid #daa520"
                    }}
                />

                {/* ✅ Descrizione */}
                <label style={{ fontWeight: "bold", color: "#2f4f4f" }}>Descrizione</label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    style={{
                        width: "100%",
                        marginBottom: "1rem",
                        padding: ".5rem",
                        borderRadius: "0.5rem",
                        border: "2px solid #daa520",
                        minHeight: "60px"
                    }}
                />

                {/* ✅ Attivo */}
                <label style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: "1rem" }}>
                    <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
                    Attivo
                </label>

                {/* ✅ Scadenza Candidature */}
                <label style={{ fontWeight: "bold", color: "#2f4f4f" }}>Scadenza Candidature</label>
                <input
                    type="date"
                    value={subscriptionExpiresAt}
                    onChange={e => setSubscriptionExpiresAt(e.target.value)}
                    style={{
                        width: "100%",
                        marginBottom: "1rem",
                        padding: ".5rem",
                        borderRadius: ".5rem",
                        border: "2px solid #daa520"
                    }}
                />

                {/* ✅ Data Premiazione */}
                <label style={{ fontWeight: "bold", color: "#2f4f4f" }}>Data Premiazione</label>
                <input
                    type="date"
                    value={expiresAt}
                    onChange={e => setExpiresAt(e.target.value)}
                    style={{
                        width: "100%",
                        marginBottom: "1rem",
                        padding: ".5rem",
                        borderRadius: ".5rem",
                        border: "2px solid #daa520"
                    }}
                />

                {/* ✅ Numero partecipanti */}
                <label style={{ fontWeight: "bold", color: "#2f4f4f" }}>Numero Partecipanti</label>
                <input
                    type="number"
                    value={numberOfParticipants}
                    onChange={e => setNumberOfParticipants(+e.target.value)}
                    style={{
                        width: "100%",
                        marginBottom: "1rem",
                        padding: ".5rem",
                        borderRadius: ".5rem",
                        border: "2px solid #daa520"
                    }}
                />

                {/* ✅ Categorie — Dropdown Multi-select */}
                <div ref={catRef} style={{ marginBottom: "1rem" }}>
                    <label style={{ fontWeight: "bold", color: "#2f4f4f" }}>Categorie</label>

                    {/* Badge selezionati */}
                    <div style={{ margin: ".2rem 0" }}>
                        {allCategories
                            .filter(c => categories.includes(c.id))
                            .map(c => (
                                <span key={c.id} style={{
                                    background: "#daa520",
                                    color: "#2f4f4f",
                                    padding: ".2rem .4rem",
                                    borderRadius: ".4rem",
                                    marginRight: ".3rem",
                                    fontSize: ".75rem"
                                }}>
                                    🎬 {c.name}
                                </span>
                            ))}
                    </div>

                    <div
                        onClick={() => setOpenCategories(prev => !prev)}
                        style={{
                            padding: ".5rem",
                            border: "2px solid #daa520",
                            borderRadius: ".5rem",
                            cursor: "pointer",
                            background: "#fff",
                            marginBottom: ".3rem",
                            userSelect: "none"
                        }}
                    >
                        Seleziona categorie ⌄
                    </div>

                    {openCategories && (
                        <div
                            style={{
                                background: "#fff",
                                border: "2px solid #daa520",
                                borderRadius: ".5rem",
                                maxHeight: "120px",
                                overflowY: "auto",
                                padding: ".5rem"
                            }}
                        >
                            {allCategories.map(c => (
                                <label key={c.id} style={{ display: "block", fontSize: ".85rem", marginBottom: ".3rem" }}>
                                    <input
                                        type="checkbox"
                                        checked={categories.includes(c.id)}
                                        onChange={() => setCategories(prev => toggleValue(prev, c.id))}
                                    />{" "}
                                    {c.name}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* ✅ Partecipanti — Dropdown Multi-select */}
                <div ref={partRef} style={{ marginBottom: "1.5rem" }}>
                    <label style={{ fontWeight: "bold", color: "#2f4f4f" }}>Partecipanti</label>

                    <div style={{ margin: ".2rem 0" }}>
                        {allUsers
                            .filter(u => participants.includes(u.id))
                            .map(u => (
                                <span key={u.id} style={{
                                    background: "#2f4f4f",
                                    color: "#daa520",
                                    padding: ".2rem .4rem",
                                    borderRadius: ".4rem",
                                    marginRight: ".3rem",
                                    fontSize: ".75rem"
                                }}>
                                    👤 {u.username}
                                </span>
                            ))}
                    </div>

                    <div
                        onClick={() => setOpenParticipants(prev => !prev)}
                        style={{
                            padding: ".5rem",
                            border: "2px solid #daa520",
                            borderRadius: ".5rem",
                            cursor: "pointer",
                            background: "#fff",
                            marginBottom: ".3rem",
                            userSelect: "none"
                        }}
                    >
                        Seleziona partecipanti ⌄
                    </div>

                    {openParticipants && (
                        <div
                            style={{
                                background: "#fff",
                                border: "2px solid #daa520",
                                borderRadius: ".5rem",
                                maxHeight: "140px",
                                overflowY: "auto",
                                padding: ".5rem"
                            }}
                        >
                            {allUsers.map(u => (
                                <label key={u.id} style={{ display: "block", fontSize: ".85rem", marginBottom: ".3rem" }}>
                                    <input
                                        type="checkbox"
                                        checked={participants.includes(u.id)}
                                        onChange={() => setParticipants(prev => toggleValue(prev, u.id))}
                                    />{" "}
                                    {u.username}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* ✅ Bottoni */}
                <div style={{ display: "flex", gap: "1rem" }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            backgroundColor: "#ff4d4f",
                            color: "#fff",
                            fontWeight: "bold",
                            padding: ".5rem",
                            borderRadius: ".5rem",
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        Annulla
                    </button>

                    <button
                        onClick={() => onSubmit({
                            name,
                            description,
                            isActive,
                            subscriptionExpiresAt,
                            expiresAt,
                            numberOfParticipants,
                            categories,
                            participants
                        })}
                        style={{
                            flex: 1,
                            backgroundColor: "#2f4f4f",
                            color: "#daa520",
                            fontWeight: "bold",
                            padding: ".5rem",
                            borderRadius: ".5rem",
                            border: "none",
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
