import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {fetchEvent} from "../services/apiEvent.ts";
import type {EventDTO, SubscriptionInEventDTO} from "../models/eventDTOs.ts";
import {handleLogout} from "../services/utils.ts";
import {updateProjectionPlanning} from "../services/subscription.ts";
import PlanningModal from "../components/modals/subscription.planning.modal.tsx";
import {getMe, type UserProfile} from "../services/auth.ts";

export default function EventDetails() {
    const {eventId} = useParams<{ eventId: string }>();
    const [error,] = useState<string | null>(null);
    const [isPlanningModalOpen, setIsPlanningModalOpen] = useState(false);
    const [editingSub, setEditingSub] = useState<SubscriptionInEventDTO | null>(null);

    const [loggedUser, setLoggedUser] = useState<UserProfile | null>(null);

    const [event, setEvent] = useState<EventDTO>();
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

    const handleSubmitPlanning = async (projectAt: string, location: string) => {
        try {
            console.log("projeto", projectAt);
            console.log("sub", editingSub);
            if (editingSub) await updateProjectionPlanning(editingSub.id, projectAt, location);

            setIsPlanningModalOpen(false);
            setEditingSub(null);
            fetchEvent(+eventId!).then(data => setEvent(data));
        } catch (err: any) {
            alert("Errore: " + err.message);
        }
    };

    const renderVoteButton = (sub: SubscriptionInEventDTO) => {
        return sub.isReadyForRating && sub.ownerId !== loggedUser?.id;
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
                                                {(renderVoteButton(sub)) &&
                                                    <button className="button" onClick={async () => {
                                                        setEditingSub(sub);
                                                        setIsPlanningModalOpen(true);
                                                    }}>
                                                        Vota
                                                    </button>}
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
            <PlanningModal
                isOpen={isPlanningModalOpen}
                onClose={() => {
                    setIsPlanningModalOpen(false);
                    setEditingSub(null);
                }}
                onSubmit={handleSubmitPlanning}
                initialData={{
                    projectAt: editingSub?.projectAt || undefined,
                    location: editingSub?.location || "",
                }}
            />
        </>
    )
}