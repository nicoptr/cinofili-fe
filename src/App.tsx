import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type {JSX} from "react";
import Login from "./pages/Login.tsx";
import AdminHome from "./pages/AdminHome.tsx";
import {getMe} from "./services/auth.ts";
import Register from "./pages/Register.tsx";
import UserHome from "./pages/UserHome.tsx";
import ProjectionPlanning from "./pages/ProjectionPlanning.tsx";
import EventDetails from "./pages/EventDetails.tsx";

function ProtectedRoute({ children, roleRequired }: { children: JSX.Element; roleRequired?: string }) {
    const userProfile = localStorage.getItem("userProfile");

    if (!localStorage.getItem("token")) return <Navigate to="/login" replace />;

    if (!userProfile) return <Navigate to="/login" replace />;

    getMe().then(res => {
        console.log("Role required: ", roleRequired);
        if (roleRequired && roleRequired !== res.roles[0].roleName) {
            console.log("Actual role", res.roles[0].roleName);
            window.location.href = "/login";
        }
    });

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
                <Route
                    path="/projection/:eventId"
                    element={
                        <ProtectedRoute roleRequired="GOD">
                            <ProjectionPlanning />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/event/:eventId"
                    element={
                        <ProtectedRoute>
                            <EventDetails />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}