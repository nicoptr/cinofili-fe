import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {registerUser} from "../services/auth.ts";

export default function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== passwordConfirm) {
            setError("Le password non coincidono.");
            return;
        }

        setLoading(true);
        try {
            await registerUser({
                username,
                email,
                password,
            });

            // Registrazione avvenuta: reindirizza al login (o mostra messaggio)
            alert("Registrazione avvenuta con successo. Effettua il login.");
            navigate("/");
        } catch (err: any) {
            setError(err?.message || "Errore durante la registrazione");
        } finally {
            setLoading(false);
        }
    };

    // Stili inline coerenti con il tema verde/oro precedente
    const pageStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#d0f0c0",
        padding: "1rem",
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: "#f5f9f0",
        padding: "2rem",
        borderRadius: "1rem",
        border: "2px solid #daa520",
        width: "360px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center",
    };

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "0.5rem",
        marginTop: "0.25rem",
        borderRadius: "0.5rem",
        border: "1px solid #daa520",
        boxSizing: "border-box",
    };

    const buttonStyle: React.CSSProperties = {
        width: "100%",
        backgroundColor: "#daa520",
        color: "#2f4f4f",
        padding: "0.6rem",
        borderRadius: "0.5rem",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
    };

    const smallTextStyle: React.CSSProperties = {
        marginTop: "0.75rem",
        color: "#b8860b",
        fontSize: "0.9rem",
    };

    return (
        <div style={pageStyle}>
            <form onSubmit={handleSubmit} style={cardStyle}>
                <h2 style={{ color: "#daa520", marginBottom: "1rem" }}>Registrazione</h2>

                {error && (
                    <div style={{ color: "white", backgroundColor: "#ff4d4f", padding: "0.5rem", borderRadius: "0.5rem", marginBottom: "1rem" }}>
                        {error}
                    </div>
                )}

                <div style={{ marginBottom: "0.75rem", textAlign: "left" }}>
                    <label style={{ color: "#b8860b" }}>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={inputStyle}
                        required
                    />
                </div>

                <div style={{ marginBottom: "0.75rem", textAlign: "left" }}>
                    <label style={{ color: "#b8860b" }}>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                        required
                    />
                </div>

                <div style={{ marginBottom: "0.75rem", textAlign: "left" }}>
                    <label style={{ color: "#b8860b" }}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                        required
                    />
                </div>

                <div style={{ marginBottom: "0.75rem", textAlign: "left" }}>
                    <label style={{ color: "#b8860b" }}>Conferma Password</label>
                    <input
                        type="password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        style={inputStyle}
                        required
                    />
                </div>

                <button type="submit" style={buttonStyle} disabled={loading}>
                    {loading ? "Registrazione..." : "Registrati"}
                </button>

                <p style={smallTextStyle}>
                    Hai già un account?{" "}
                    <Link to="/" style={{ color: "#daa520", fontWeight: "600" }}>
                        Accedi
                    </Link>
                </p>
            </form>
        </div>
    );
}