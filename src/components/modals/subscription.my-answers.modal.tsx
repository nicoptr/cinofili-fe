import type {AnswerDTO} from "../../models/AnswerFormDTO.ts";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    movieName: string;
    answers: AnswerDTO[];
}


export default function MyAnswersModal({
                                        isOpen,
                                        onClose,
                                        movieName,
                                        answers
                                      }: Props) {

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2 className="modal-title">{`Vota: ${movieName}`}</h2>

                <p className="modal-info-text">
                    Questi sono i voti che hai assegnato a questo film
                </p>

                <form>
                    {answers?.sort((a, b) => a.question!.ordinal - b.question!.ordinal)
                        .map(a => {
                            const q = a.question!;

                            return (
                                <div key={a.id} className="rating-question-block">
                                    <label className="modal-label rating-award-label">
                                        <span className="rating-question-number">{a.question!.ordinal}.</span>
                                        {a.question!.award.name}
                                    </label>
                                    <label className="modal-label rating-description-label">
                                        {a.question!.award.description}
                                    </label>
                                    <label className="modal-label rating-question-label">
                                        {q.text}
                                    </label>

                                    <div className="rating-input-row">
                                        <input
                                            disabled
                                            type="range"
                                            min={0}
                                            max={100}
                                            value={a.value}
                                            className="rating-slider"
                                        />

                                        <input
                                            disabled
                                            type="number"
                                            min={0}
                                            max={100}
                                            value={a.value}
                                            className="modal-input rating-number-input"
                                        />
                                    </div>
                                </div>
                            );
                        })}

                    <div className="modal-buttons">
                        <button
                            type="submit"
                            onClick={onClose}
                            className="modal-button modal-button-submit"
                        >
                            Chiudi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
