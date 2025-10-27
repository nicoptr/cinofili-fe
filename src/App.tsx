import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type {JSX} from "react";
import Login from "./pages/Login.tsx";
import AdminHome from "./pages/AdminHome.tsx";
import type {UserProfile} from "./services/auth.ts";
import Register from "./pages/Register.tsx";
import UserHome from "./pages/UserHome.tsx";

function ProtectedRoute({ children, roleRequired }: { children: JSX.Element; roleRequired?: string }) {
    const token = localStorage.getItem("token");
    const userProfile = localStorage.getItem("userProfile");

    console.log(userProfile);


    if (!token) return <Navigate to="/" replace />;

    if (!userProfile) return <Navigate to="/" replace />;

    const role = (JSON.parse(userProfile) as UserProfile).roles[0].roleName

    if (roleRequired && roleRequired !== role) {
        return <Navigate to="/home" replace />;
    }

    return children;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

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
                    path="/home"
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