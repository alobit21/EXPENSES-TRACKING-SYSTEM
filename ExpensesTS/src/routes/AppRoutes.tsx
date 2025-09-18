import {  Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

// Pages
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import Layout from "../components/layout/Layout";
import ReportsPage from "../pages/ReportsPage";
import SettingsPage from "../pages/SettingsPage";
import CategoriesPage from "../pages/CategoriesPage";
import IncomesPage from "../pages/IncomesPage";
import ExpensesPage from "../pages/ExpensesPage";
import GoalsPage from "../pages/GoalsPage";
import LandingPage from "../components/landingpage/LandingPage";

// PrivateRoute component
function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth();

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render children (protected page)
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<LandingPage />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        {/* Default child of /dashboard */}
        <Route index element={<DashboardPage />} />

        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="incomes" element={<IncomesPage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="goals" element={<GoalsPage />} />
      </Route>

      {/* Catch-all redirects to landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

