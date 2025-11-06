import { useEffect, useState } from "react";
import {formatItaliaTimeStringFromString} from "../../services/utils.ts";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (projectAt: string, location: string) => void;
    initialData?: { projectAt?: string; location?: string };
}

export default function PlanningModal({
                                          isOpen,
                                          onClose,
                                          onSubmit,
                                          initialData
                                      }: Props) {



    const [date, setDate] = useState(
        initialData?.projectAt ? initialData?.projectAt.split("T")[0] : ""
    );
    const [time, setTime] = useState(
        initialData?.projectAt
            ? initialData?.projectAt.substring(11, 16)
            : ""
    );
    const [location, setLocation] = useState(initialData?.location || "");

    useEffect(() => {
        if (!isOpen) return;
        setDate(initialData?.projectAt ? initialData?.projectAt.split("T")[0] : "");
        console.log("initialData?.projectAt: ", initialData?.projectAt)
        setTime(initialData?.projectAt ? formatItaliaTimeStringFromString(initialData?.projectAt) : "");
        setLocation(initialData?.location || "");
        console.log("time: ", time)
    }, [isOpen]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!date || !time) return;
        const combined = new Date(`${date}T${time}`).toISOString();

        onSubmit(combined, location);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2 className="modal-title">
                    {initialData ? "Modifica iscrizione" : "Nuova iscrizione"}
                </h2>

                <p className="modal-info-text">
                    ⚠️ Salvando imposterai la data prevista di proiezione e i
                    partecipanti riceveranno una mail informativa. Potrai cambiare
                    data fino a un giorno prima della proiezione prevista. In caso di
                    modifiche verrà inviata una nuova mail.
                </p>

                <form onSubmit={handleSubmit}>
                    <label className="modal-label">Data</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="modal-input"
                    />

                    <label className="modal-label">Ora</label>
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                        className="modal-input"
                    />

                    <label className="modal-label">Luogo</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Inserisci il luogo della proiezione"
                        required
                        className="modal-input"
                    />

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
                            Salva
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
