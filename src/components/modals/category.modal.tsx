import {type FC, useEffect, useState} from "react";
import * as React from "react";
import './Modal.css';


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
        <div className="modal-overlay">
            <form onSubmit={handleSubmit} className="modal-container">
                <h2 className="modal-title">Crea Nuova Categoria</h2>

                <label className="modal-label">Nome Categoria</label>
                <input
                    type="text"
                    placeholder="Nome categoria"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="modal-input"
                />

                <label className="modal-label">Descrizione</label>
                <textarea
                    placeholder="Descrizione"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="modal-textarea"
                />

                <div className="modal-buttons">
                    <button type="button" onClick={onClose} className="modal-button modal-button-cancel">
                        Annulla
                    </button>
                    <button type="submit" className="modal-button modal-button-submit">
                        Crea
                    </button>
                </div>
            </form>
        </div>
    );
};


export default CategoryModal;
