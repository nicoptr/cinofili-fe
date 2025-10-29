import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type {JSX} from "react";
import Login from "./pages/Login.tsx";
import AdminHome from "./pages/AdminHome.tsx";
import type {UserProfile} from "./services/auth.ts";
import Register from "./pages/Register.tsx";
import UserHome from "./pages/UserHome.tsx";

function ProtectedRoute({ children, roleRequired }: { children: JSX.Element; roleRequired?: string }) {
    const userProfile = localStorage.getItem("userProfile");

    if (!localStorage.getItem("token")) return <Navigate to="/login" replace />;

    if (!userProfile) return <Navigate to="/login" replace />;

    const role = (JSON.parse(userProfile) as UserProfile).roles[0].roleName

    if (roleRequired && roleRequired !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route
                    path="/admin-home"
                    element={
                        <ProtectedRoute roleRequired="GOD">
                            <AdminHome />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <UserHome />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}