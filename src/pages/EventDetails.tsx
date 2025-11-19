import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {fetchEvent} from "../services/apiEvent.ts";
import type {EventDTO, SubscriptionInEventDTO} from "../models/EventDTO.ts";
import {handleLogout} from "../services/utils.ts";
import {getMe, type UserProfile} from "../services/auth.ts";
import RatingModal from "../components/modals/subscription.rating.modal.tsx";
import type {AnswerDTO, AnswerFormDTO} from "../models/AnswerFormDTO.ts";
import {fetchAnswers, rateSubscription} from "../services/answer.ts";
import MyAnswersModal from "../components/modals/subscription.my-answers.modal.tsx";

export default function EventDetails() {
    const {eventId} = useParams<{ eventId: string }>();
    const [error,] = useState<string | null>(null);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [ratingSub, setRatingSub] = useState<SubscriptionInEventDTO | null>(null);

    const [loggedUser, setLoggedUser] = useState<UserProfile | null>(null);

    const [event, setEvent] = useState<EventDTO>();
    const [subsAnswers, setSubsAnswers] = useState<AnswerDTO[]>([]);

    const [modalAnswers, setModalAnswers] = useState<AnswerDTO[]>([]);
    const [isAnswersModalOpen, setIsAnswersModalOpen] = useState(false);

    const navigate = useNavigate();


    useEffect(() => {
        if (!eventId) {
            navigate("/");
        }
        fetchEvent(+eventId!).then(e => {
            setEvent(e);
        });

        getMe().then(res => setLoggedUser(res)).catch(e => console.error(e));

    }, [eventId]);

    useEffect(() => {
        if (!event) {
            return;
        }

        event.subscriptions.forEach(subscription => {
            fetchAnswers(subscription.id).then(res => {
                setSubsAnswers(prevState => [...prevState, ...res]);
            });
        })
    }, [event]);

    const handleSubmitRating = async (subId: number, dto: AnswerFormDTO) => {
        try {
            if (ratingSub) await rateSubscription(subId, dto);

            setIsRatingModalOpen(false);
            setRatingSub(null);
            fetchEvent(+eventId!).then(data => setEvent(data));
        } catch (err: any) {
            alert("Errore: " + err.message);
        }

    };

    const manageRightSideOfCard= (sub: SubscriptionInEventDTO) => {
        if (!sub.isReadyForRating) {
            return (
                <span className="info-text-warning">⌛​ In attesa</span>
            )
        }
        if (sub.ownerId === loggedUser?.id) {
            return (
                <span className="info-text-valid">🗿​ Tua candidatura</span>
            )
        }
        if (subsAnswers.some(ans => ans.subscriptionId === sub.id)) {
            return (
                <button className="button" onClick={async () => {
                    setModalAnswers(subsAnswers.filter(ans => ans.subscriptionId === sub.id));
                    setIsAnswersModalOpen(true);
                }}>
                    Vedi voti
                </button>
            )
        } else {
            return (
                <button className="button" onClick={async () => {
                    setRatingSub(sub);
                    setIsRatingModalOpen(true);
                }}>
                    Vota
                </button>
            )
        }
    }

    return (
        <>
            {error && <div>C'è stato un errore imprevisto: {error}</div>}
            <div className="admin-home-container">

                <button
                    onClick={handleLogout}
                    className="button button-logout"
                >
                    Logout
                </button>

                {(loggedUser?.roles[0].roleName === "GOD") && <button
                    onClick={() => navigate('/admin-home')}
                    className="button button-candidature"
                >
                    Pannello di controllo
                </button>}

                <button
                    onClick={() => navigate('/')}
                    className="button button-candidature"
                >
                    Le mie candidature
                </button>

                <h1 className="admin-home-title">Dettagli evento</h1>

                <div className="card-container">
                    <div className="card" key={eventId}>
                        <div className="card-content">
                            <strong>{event?.name}</strong>
                            <p>{event?.description}</p>

                            <div className="card-categories">
                                {event?.categories.map(cat => (
                                    <span key={cat.id} className="category-badge">
                                                {cat.name.toUpperCase()}
                                            </span>
                                ))}
                            </div>

                            <p>🏆​ Data
                                premiazione: <b>{new Date(event?.expiresAt || "").toLocaleDateString("it-IT")}</b></p>

                            <div className="card-progress-bar">
                                <div className="bar"
                                     style={{width: `${Math.min(((event?.subscriptions.filter(s => s.isReadyForProjection).length ?? 0) / (event?.subscriptions.length ?? 1)) * 100, 100)}%`}}/>
                            </div>
                            <p>{event?.subscriptions.filter(s => s.isReadyForProjection).length}/{event?.subscriptions.length} film
                                svelati</p>

                        </div>

                        <div className="card-actions">
                        </div>

                        <div className="spacer"/>

                        <div>
                            {event?.subscriptions.sort((a, b) => a.projectionOrder - b.projectionOrder).map(sub => (
                                (sub.isReadyForProjection ? (
                                        <div key={sub.id}
                                             className={`sub-card ${sub.projectAt ? "" : "invalid"}`}>
                                            <div className="sub-card-left">
                                                <span className="movie-title">📽️​ {sub.movieName}</span>
                                                <div className="category-tag">
                                                    {event.categories.find(cat => cat.id === sub.categoryId)?.name.toUpperCase() ?? "SENZA CATEGORIA"}
                                                </div>
                                                <div>
                                                    {
                                                        sub.projectAt ? (
                                                                <span>
                                                                    Data di proiezione: {new Date(sub.projectAt).toLocaleDateString("it-IT")}{" "}
                                                                    | alle ore: {new Date(sub.projectAt).toLocaleTimeString("it-IT", {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit"
                                                                })}{" "}
                                                                    | dove: {sub.location || <strong>DA DEFINIRE</strong>}
                                                                </span>)
                                                            :
                                                            (
                                                                <span>Data di proiezione: <strong>DA DEFINIRE</strong></span>)
                                                    }
                                                </div>
                                            </div>
                                            <div className="sub-card-right">
                                                {manageRightSideOfCard(sub)}
                                            </div>

                                        </div>
                                    ) :
                                    (
                                        <div key={sub.id} className={`sub-card censored`}>
                                            <div>
                                                <span className="movie-title"></span>
                                            </div>
                                        </div>
                                    ))
                            ))
                            }
                        </div>
                    </div>
                </div>
            </div>
            <RatingModal
                isOpen={isRatingModalOpen}
                onClose={() => {
                    setIsRatingModalOpen(false);
                    setRatingSub(null);
                }}
                eventId={+eventId!}
                subId={ratingSub?.id ?? 0}
                movieName={ratingSub?.movieName ?? ""}
                onSubmit={handleSubmitRating}
            />
            <MyAnswersModal
                isOpen={isAnswersModalOpen}
                onClose={() => {
                    setIsAnswersModalOpen(false);
                    setModalAnswers([]);
                }}
                movieName={ratingSub?.movieName ?? ""}
                answers={modalAnswers}
            />
        </>
    )
}