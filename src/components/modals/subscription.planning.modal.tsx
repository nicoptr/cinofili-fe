import {useEffect, useState} from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (projectAt: string) => void;
    initialData?: { projectAt?: string };
}

export default function PlanningModal({
                                              isOpen,
                                              onClose,
                                              onSubmit,
                                              initialData
                                          }: Props) {
    const [projectAt, setProjectAt] = useState(initialData?.projectAt ?? "");

    useEffect(() => {
        if (!isOpen) return;
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(projectAt);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2 className="modal-title">{initialData ? "Modifica iscrizione" : "Nuova iscrizione"}</h2>

                <p className="modal-info-text">
                    ⚠️ Salvando imposterai la data prevista di proiezione e i partecipanti riceveranno una mail informativa. Potrai cambiare data fino a un giorno prima della proiezione prevista.
                    In caso di modifiche verrà inviata una nuova mail.
                </p>

                <form onSubmit={handleSubmit}>
                    <label className="modal-label">Nome Film</label>
                    <input
                        type="date"
                        value={projectAt}
                        onChange={(e) => setProjectAt(e.target.value)}
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