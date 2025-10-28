import { useEffect, useState } from "react";
import {
    createSubscription, deleteSubscription,
    fetchMySubscriptions,
    type Subscription,
    updateSubscription
} from "../services/subscription";
import { getMe, type UserProfile } from "../services/auth.ts";
import SubscriptionModal from "../components/modals/subsription.modal.tsx";
import { useNavigate } from "react-router-dom";
import "../App.css";  // Importa il file CSS

export default function UserHome() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
    const [editingSubscription, setEditingSubscription] = useState<any | null>(null);
    const [role, setRole] = useState("");

    const navigate = useNavigate();

    const handleLogout = async () => {
        localStorage.removeItem("token");
        try {
            await getMe();
        } catch {
            window.location.href = "/";
        }
    };

    useEffect(() => {
        const userProfile = localStorage.getItem("userProfile");
        if (userProfile) {
            const parsedProfile = JSON.parse(userProfile) as UserProfile;
            setRole(parsedProfile.roles[0].roleName);
        }
        setLoading(true);
        fetchMySubscriptions()
            .then(data => setSubscriptions(data.docs))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const handleSubmitSubscription = async (data: any) => {
        try {
            if (editingSubscription) {
                await updateSubscription(editingSubscription.id, data);
            } else {
                await createSubscription(data);
            }

            setIsSubscriptionModalOpen(false);
            setEditingSubscription(null);
            setLoading(true);

            fetchMySubscriptions()
                .then(r => setSubscriptions(r.docs))
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));

        } catch (err: any) {
            alert("Errore nella candidatura: " + err.message);
        }
    };
    if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Caricamento in corso...</p>;
    if (error) return <p style={{ color: "red", textAlign: "center", marginTop: "2rem" }}>Errore: {error}</p>;

    return (
        <div className="admin-home-container">

            <button
                onClick={handleLogout}
                className="button button-logout"
            >
                Logout
            </button>

            {role === 'GOD' && (
                <button
                    onClick={() => navigate('/admin-home')}
                    className="button button-candidature"
                >
                    Pannello di controllo
                </button>
            )}

            <h1 className="admin-home-title">Le tue candidature</h1>

            <div className="tab-container">
                <button
                    className="button"
                    onClick={() => {
                        setEditingSubscription(null);
                        setIsSubscriptionModalOpen(true);
                    }}
                >
                    Nuova iscrizione
                </button>
            </div>

            <ul className="card-container">
                {subscriptions.map(sub => {
                    const total = sub.event?.numberOfParticipants ?? 1;
                    const currentValids = sub.isValid ? 1 : 0;
                    const percentage = Math.min((currentValids / total) * 100, 100);

                    return (
                        <li className="card" key={sub.id}>
                            <div className="card-content">

                                <span className="movie-title">📽️​ {sub.movieName}</span>

                                {/* Categoria */}
                                <span className="category-tag">
                                    {sub.category?.name?.toUpperCase() ?? "SENZA CATEGORIA"}
                                </span>

                                <p>Evento: <b>{sub.event?.name}</b></p>
                                <p>Scadenza candidature: <b>{sub.event?.subscriptionExpiresAt
                                    ? new Date(sub.event.subscriptionExpiresAt).toLocaleDateString("it-IT")
                                    : "Non definita"}</b></p>
                                <p>🏆​ Data premiazione: <b>{sub.event?.expiresAt
                                    ? new Date(sub.event.expiresAt).toLocaleDateString("it-IT")
                                    : "Non definita"}</b></p>

                                {/* Barra di avanzamento */}
                                <div className="card-progress-bar">
                                    <div className="bar" style={{ width: `${percentage}%` }} />
                                </div>
                                <p>Candidature valide: <b>{currentValids}/{total}</b> ({Math.round(percentage)}%)</p>

                            </div>

                            <div className="card-actions">
                                <button
                                    className="button"
                                    onClick={() => {
                                        setEditingSubscription(sub);
                                        setIsSubscriptionModalOpen(true);
                                    }}
                                >
                                    Modifica
                                </button>

                                <button
                                    className="button"
                                    onClick={async () => {
                                        if (!confirm(`Eliminare '${sub.movieName}'?`)) return;
                                        await deleteSubscription(sub.id);
                                        setLoading(true);
                                        fetchMySubscriptions().then(d => setSubscriptions(d.docs)).finally(() => setLoading(false));
                                    }}
                                >
                                    Elimina
                                </button>
                            </div>

                        </li>
                    );
                })}
            </ul>

            <SubscriptionModal
                isOpen={isSubscriptionModalOpen}
                onClose={() => {
                    setIsSubscriptionModalOpen(false);
                    setEditingSubscription(null);
                }}
                onSubmit={handleSubmitSubscription}
                initialData={editingSubscription ?? undefined}
            />
        </div>
    );
}
