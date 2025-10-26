import {type FC, useEffect, useState} from "react";
import * as React from "react";

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string, description: string) => void;
    initialName?: string;
    initialDescription?: string;
}

const CategoryModal: FC<CategoryModalProps> = ({ isOpen, onClose, onSubmit, initialName = "", initialDescription = "" }) => {
    const [name, setName] = useState(initialName);
    const [description, setDescription] = useState(initialDescription);

    useEffect(() => {
        setName(initialName);
        setDescription(initialDescription);
    }, [initialName, initialDescription, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(name, description);
        setName("");
        setDescription("");
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000
            }}
        >
            <form
                onSubmit={handleSubmit}
                style={{
                    backgroundColor: "#f5f9f0",
                    border: "2px solid #daa520",
                    borderRadius: "1rem",
                    padding: "2rem",
                    width: "400px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem"
                }}
            >
                <h2 style={{ color: "#2f4f4f", textAlign: "center" }}>Crea Nuova Categoria</h2>

                <input
                    type="text"
                    placeholder="Nome categoria"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    style={{
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #daa520"
                    }}
                />

                <textarea
                    placeholder="Descrizione"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    style={{
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #daa520"
                    }}
                />

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            backgroundColor: "#ff4d4f",
                            color: "#fff",
                            border: "none",
                            borderRadius: "0.5rem",
                            padding: "0.5rem 1rem",
                            fontWeight: "bold",
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
                            border: "none",
                            borderRadius: "0.5rem",
                            padding: "0.5rem 1rem",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        Crea
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoryModal;
