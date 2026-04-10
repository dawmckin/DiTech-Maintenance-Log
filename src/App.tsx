import { Routes, Route } from "react-router-dom";
import Login from "./components/login-portal/LoginPortal";
import Dashboard from "./components/dashboard/Dashboard";
import WorklogForm from "./components/worklog-form/WorklogForm";
import Ticket from "./components/worklog-form/Ticket";
import WorkLogHistory from "./components/worklog-history/WorklogHistory";
import AdminSettings from "./components/settings/AdminSettings";

import AppLayout from "./components/layout/AppLayout";
import AuthLayout from "./components/layout/AuthLayout";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/util/ProtectedRoute";

import { LoaderProvider, useLoader } from "./context/LoaderContext";
import Loader from './components/loader/Loader';

import { ToastProvider } from "./context/ToastContext";

function AppContent() {
  const { loading } = useLoader();

  return (
    <>
      {loading && <Loader />}
      {
        <Routes>
          {/* Login (no header/footer) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Main app (with header/footer) */}
          <Route 
            element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/new-maintenance-log" element={<WorklogForm />} />
            <Route path="/new-maintenance-log/ticket/:id" element={<Ticket />} />
            <Route path="/logs" element={<WorkLogHistory />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      }
    </>
  )
}

export default function App() {
  return (
    <LoaderProvider>
      <ToastProvider>
        <AuthProvider>
          <AppContent></AppContent>
        </AuthProvider>
      </ToastProvider>
    </LoaderProvider>
  );
}