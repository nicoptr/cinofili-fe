import { useEffect, useState } from "react";
import {
    createSubscription, deleteSubscription,
    fetchMySubscriptions,
    type Subscription,
    updateSubscription
} from "../services/subscription";
import {getMe, type UserProfile} from "../services/auth.ts";
import SubscriptionModal from "../components/subsription.modal.tsx";
import {useNavigate} from "react-router-dom";

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
        <>
            <div style={{ padding: "2rem", backgroundColor: "#d0f0c0", minHeight: "100vh", position: "relative" }}>

                { role === 'GOD' && <button
                    onClick={() => navigate('/admin-home')}
                    style={{
                        position: "absolute", top: "1.5rem", left: "2rem",
                        backgroundColor: "#2f4f4f", color: "#daa520",
                        padding: "0.5rem 1rem", border: "none",
                        borderRadius: "0.5rem", cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    Pannello di controllo
                </button>
                }
                <button
                    onClick={handleLogout}
                    style={{
                        position: "absolute",
                        top: "1.5rem",
                        right: "2rem",
                        backgroundColor: "#2f4f4f",
                        color: "#daa520",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    Logout
                </button>

                <h1 style={{ color: "#daa520", textAlign: "center", marginBottom: "2rem" }}>
                    Le tue candidature
                </h1>

                {/* Pulsante Crea */}
                <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                    <button
                        style={{
                            backgroundColor: "#daa520",
                            color: "#2f4f4f",
                            padding: "0.5rem 1rem",
                            border: "none",
                            borderRadius: "0.5rem",
                            fontWeight: "bold",
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            setEditingSubscription(null);
                            setIsSubscriptionModalOpen(true);
                        }}
                    >
                        Nuova iscrizione
                    </button>
                </div>

                <ul style={{ listStyle: "none", padding: 0 }}>
                    {subscriptions.map(sub => {
                        const total = sub.event?.numberOfParticipants ?? 1;
                        const currentValids = sub.isValid ? 1 : 0;
                        const percentage = Math.min((currentValids / total) * 100, 100);

                        return (
                            <li
                                key={sub.id}
                                style={{
                                    backgroundColor: "#f5f9f0",
                                    border: `4px solid ${sub.isValid ? "green" : "red"}`,
                                    borderRadius: "0.5rem",
                                    padding: "1rem",
                                    marginBottom: "1rem",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <div style={{ width: "100%", marginRight: "1rem" }}>

                                    {/* Categoria */}
                                    <span
                                        style={{
                                            display: "inline-block",
                                            backgroundColor: "#daa520",
                                            color: "#2f4f4f",
                                            fontWeight: "bold",
                                            padding: "0.2rem 0.6rem",
                                            borderRadius: "0.5rem",
                                            marginBottom: "0.5rem",
                                            fontSize: "0.85rem",
                                        }}
                                    >
                    {sub.category?.name?.toUpperCase() ?? "SENZA CATEGORIA"}
                  </span>

                                    <strong style={{ color: "#2f4f4f", fontSize: "1.1rem", display: "block" }}>
                                        {sub.movieName}
                                    </strong>

                                    <p style={{ margin: "0.25rem 0", color: "#2f4f4f" }}>
                                        Evento: <b>{sub.event?.name}</b>
                                    </p>

                                    <p style={{ margin: "0.25rem 0", fontSize: "0.85rem", color: "#555" }}>
                                        Scadenza candidature:{" "}
                                        <b>{sub.event?.subscriptionExpiresAt
                                            ? new Date(sub.event.subscriptionExpiresAt).toLocaleDateString("it-IT")
                                            : "Non definita"}</b>
                                    </p>

                                    <p style={{ margin: "0.15rem 0 0.5rem", fontSize: "0.85rem", color: "#555" }}>
                                        Data premiazione:{" "}
                                        <b>{sub.event?.expiresAt
                                            ? new Date(sub.event.expiresAt).toLocaleDateString("it-IT")
                                            : "Non definita"}</b>
                                    </p>

                                    {/* 🔹 Barra avanzamento */}
                                    <div style={{ marginTop: "0.75rem" }}>
                                        <div style={{
                                            width: "100%",
                                            height: "10px",
                                            backgroundColor: "#ccc",
                                            borderRadius: "5px",
                                        }}>
                                            <div style={{
                                                width: `${percentage}%`,
                                                height: "100%",
                                                backgroundColor: percentage >= 100 ? "green" : "#daa520",
                                                borderRadius: "5px",
                                                transition: "width 0.3s",
                                            }} />
                                        </div>

                                        <p style={{ marginTop: "0.3rem", fontSize: "0.8rem", color: "#2f4f4f" }}>
                                            Candidature valide:{" "}
                                            <b>{currentValids}/{total}</b> ({Math.round(percentage)}%)
                                        </p>
                                    </div>
                                </div>

                                {/* Pulsanti */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    <button
                                        style={{
                                            backgroundColor: "#2f4f4f",
                                            color: "#daa520",
                                            padding: "0.4rem 0.7rem",
                                            borderRadius: "0.5rem",
                                            border: "none",
                                            cursor: "pointer",
                                            fontWeight: "bold",
                                            whiteSpace: "nowrap",
                                        }}
                                        onClick={() => {
                                            setEditingSubscription(sub);
                                            setIsSubscriptionModalOpen(true);
                                        }}
                                    >
                                        Modifica
                                    </button>

                                    <button
                                        style={{
                                            backgroundColor: "#ff4d4f",
                                            color: "#fff",
                                            padding: "0.4rem 0.7rem",
                                            borderRadius: "0.5rem",
                                            border: "none",
                                            cursor: "pointer",
                                            fontWeight: "bold",
                                            whiteSpace: "nowrap",
                                        }}
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

            </div>
            <SubscriptionModal
                isOpen={isSubscriptionModalOpen}
                onClose={() => {
                    setIsSubscriptionModalOpen(false);
                    setEditingSubscription(null);
                }}
                onSubmit={handleSubmitSubscription}
                initialData={editingSubscription ?? undefined}
            />
            </>

    );

}
