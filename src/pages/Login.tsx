import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {getMe, login} from "../services/auth.ts";

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await login({ usernameOrEmail: username, password });

            const user = await getMe();
            if (user?.roles![0].roleName === "GOD") {
                navigate("/admin-home");
            } else {
                navigate("/home");
            }
        } catch (err: any) {
            alert(err.message || "Errore durante il login");
        }
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            backgroundColor: "#d0f0c0" // verde chiaro
        }}>
            <form onSubmit={handleLogin} style={{
                backgroundColor: "#f5f9f0",
                padding: "2rem",
                borderRadius: "1rem",
                border: "2px solid #daa520", // oro
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                width: "320px",
                textAlign: "center"
            }}>
                <h2 style={{ color: "#daa520", marginBottom: "1.5rem" }}>Login Cinofilo</h2>

                <div style={{ marginBottom: "1rem", textAlign: "left" }}>
                    <label style={{ color: "#b8860b" }}>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "0.5rem",
                            marginTop: "0.25rem",
                            borderRadius: "0.5rem",
                            border: "1px solid #daa520"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "1.5rem", textAlign: "left" }}>
                    <label style={{ color: "#b8860b" }}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "0.5rem",
                            marginTop: "0.25rem",
                            borderRadius: "0.5rem",
                            border: "1px solid #daa520"
                        }}
                    />
                </div>

                <button type="submit" style={{
                    width: "100%",
                    backgroundColor: "#daa520",
                    color: "#2f4f4f",
                    padding: "0.5rem",
                    borderRadius: "0.5rem",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}>Accedi</button>

                <p style={{ marginTop: "1rem", color: "#b8860b", fontSize: "0.9rem" }}>
                    Non hai un account? <Link to="/register" style={{ color: "#daa520" }}>Registrati</Link>
                </p>
            </form>
        </div>
    );
}