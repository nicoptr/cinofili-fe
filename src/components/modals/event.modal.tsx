import {type FC, useEffect, useState, useRef } from "react";
import './Modal.css';
import {type Category, fetchCategories} from "../../services/category.ts";
import {fetchUsers, type User} from "../../services/user.ts";  // Importa il CSS per il modal

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

const EventModal: FC<EventModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
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
        <div className="modal-overlay">
            <div className="modal-container">
                <h2 className="modal-title">{initialData ? "Modifica Evento" : "Crea Evento"}</h2>

                {/* ✅ Nome */}
                <label className="modal-label">Nome</label>
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="modal-input"
                />

                {/* ✅ Descrizione */}
                <label className="modal-label">Descrizione</label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="modal-textarea"
                />

                {/* ✅ Attivo */}
                <label style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: "1rem" }}>
                    <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
                    Attivo
                </label>

                {/* ✅ Scadenza Candidature */}
                <label className="modal-label">Scadenza Candidature</label>
                <input
                    type="date"
                    value={subscriptionExpiresAt}
                    onChange={e => setSubscriptionExpiresAt(e.target.value)}
                    className="modal-input"
                />

                {/* ✅ Data Premiazione */}
                <label className="modal-label">Data Premiazione</label>
                <input
                    type="date"
                    value={expiresAt}
                    onChange={e => setExpiresAt(e.target.value)}
                    className="modal-input"
                />

                {/* ✅ Numero partecipanti */}
                <label className="modal-label">Numero Partecipanti</label>
                <input
                    type="number"
                    value={numberOfParticipants}
                    onChange={e => setNumberOfParticipants(+e.target.value)}
                    className="modal-input"
                />

                {/* ✅ Categorie — Dropdown Multi-select */}
                <div ref={catRef} style={{ marginBottom: "1rem" }}>
                    <label className="modal-label">Categorie</label>

                    {/* Badge selezionati */}
                    <div style={{ margin: ".2rem 0" }}>
                        {allCategories
                            .filter(c => categories.includes(c.id))
                            .map(c => (
                                <span key={c.id} className="modal-category-badge">
                                    🎬 {c.name}
                                </span>
                            ))}
                    </div>

                    <div
                        onClick={() => setOpenCategories(prev => !prev)}
                        className="modal-select-dropdown"
                    >
                        Seleziona categorie ⌄
                    </div>

                    {openCategories && (
                        <div className="modal-select-list">
                            {allCategories.map(c => (
                                <label key={c.id} style={{ fontSize: ".85rem" }}>
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
                    <label className="modal-label">Partecipanti</label>

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
                        className="modal-select-dropdown"
                    >
                        Seleziona partecipanti ⌄
                    </div>

                    {openParticipants && (
                        <div className="modal-select-list">
                            {allUsers.map(u => (
                                <label key={u.id} style={{ fontSize: ".85rem" }}>
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
                <div className="modal-buttons">
                    <button
                        onClick={onClose}
                        className="modal-button modal-button-cancel"
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
                        className="modal-button modal-button-submit"
                    >
                        {initialData ? "Salva" : "Crea"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventModal;
