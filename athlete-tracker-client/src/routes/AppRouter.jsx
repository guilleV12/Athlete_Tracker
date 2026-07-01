import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import LandingPage from "../pages/LandingPage";
import DashboardPage from "../pages/DashboardPage";
import AppLayout from "../components/layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import WorkoutsPage from "../pages/WorkoutsPage";
import MealsPage from "../pages/MealsPage";
import InsightsPage from "../pages/InsightsPage";
import AchievementsPage from "../pages/AchievementsPage";
import ProfilePage from "../pages/ProfilePage";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route element={<AppLayout />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/workouts" element={<WorkoutsPage />} />
                        <Route path="/meals" element={<MealsPage />} />
                        <Route path="/insights" element={<InsightsPage />} />
                        <Route path="/achievements" element={<AchievementsPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
