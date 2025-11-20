import { useEffect, useState } from "react";
import {fetchFormByEventId} from "../../services/apiEvent.ts";
import type {EventDTO} from "../../models/EventDTO.ts";
import type {AnswerFormDTO} from "../../models/AnswerFormDTO.ts";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (subId: number, dto: AnswerFormDTO) => void;
    eventId: number;
    subId: number;
    movieName: string;
}

const CONFIRM_TEXT = "Sei sicuro di voler inviare questa recensione? \n" +
    "Una volta inviata non potrai più modificarla.\n" +
    "Pensaci bene, altrimenti chi ci lavora è costretto ad accedere al DB e fare cose brutte che gli faranno vedere un sacco di roba che rovinerebbe l'esperienza di gioco.\n" +
    "Pinz, i pinz bunn!"


export default function RatingModal({
                                        isOpen,
                                        onClose,
                                        onSubmit,
                                        eventId,
                                        subId,
                                        movieName,
                                      }: Props) {

    const [event, setEvent] = useState<EventDTO>();
    const [answers, setAnswers] = useState<Record<number, number>>({});

    useEffect(() => {
        if (!isOpen) return;

        fetchFormByEventId(eventId)
            .then(res => setEvent(res))
            .catch(e => console.error(e));
    }, [isOpen]);

    useEffect(() => {
        if (!event) return;

        const initial: Record<number, number> = {};

        event.awards.forEach(a => {
            initial[a.award.question.id] = 50;
        });

        setAnswers(initial);
    }, [event]);


    const handleChange = (questionId: number, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!confirm(CONFIRM_TEXT)) return;

        const dto: AnswerFormDTO = {
            answers: Object.entries(answers).map(([id, value]) => ({
                questionId: Number(id),
                value: Number(value)
            }))
        };
        onSubmit(subId, dto);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2 className="modal-title">{`Vota: ${movieName}`}</h2>

                <p className="modal-info-text">
                    Assegna un voto da <strong>0</strong> a <strong>100</strong> per ogni categoria.
                </p>

                <form onSubmit={handleSubmit}>
                    {event?.awards
                        .sort((a, b) => a.award.question.ordinal - b.award.question.ordinal)
                        .map(a => {
                            const q = a.award.question;

                            return (
                                <div key={q.id} className="rating-question-block">
                                    <label className="modal-label rating-award-label">
                                        <span className="rating-question-number">{q.ordinal}.</span>
                                        {a.award.name}
                                    </label>
                                    <label className="modal-label rating-description-label">
                                        {a.award.description}
                                    </label>
                                    <label className="modal-label rating-question-label">
                                        {q.text}
                                    </label>

                                    <div className="rating-input-row">
                                        <input
                                            type="range"
                                            min={0}
                                            max={100}
                                            value={answers[q.id] ?? 0}
                                            className="rating-slider"
                                            onChange={(e) =>
                                                handleChange(q.id, Number(e.target.value))
                                            }
                                        />

                                        <input
                                            type="number"
                                            min={0}
                                            max={100}
                                            value={answers[q.id] ?? 0}
                                            className="modal-input rating-number-input"
                                            onChange={(e) => {
                                                const val = Math.min(Math.max(Number(e.target.value), 0), 100);
                                                handleChange(q.id, val);
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}

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
                            Conferma
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
