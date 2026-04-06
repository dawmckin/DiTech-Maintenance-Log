import { Routes, Route } from "react-router-dom";
import Login from "./components/login-portal/LoginPortal";
import Dashboard from "./components/dashboard/Dashboard";
import WorklogForm from "./components/worklog-form/WorklogForm";
import Ticket from "./components/worklog-form/Ticket";
import WorkLogHistory from "./components/worklog-history/worklog-history";

import AppLayout from "./components/AppLayout";
import AuthLayout from "./components/AuthLayout";

import { LoaderProvider, useLoader } from "./components/loader/LoaderContext";
import Loader from './components/loader/Loader';

import { ToastProvider } from "./components/toast/ToastContext";

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
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/new-maintenance-log" element={<WorklogForm />} />
            <Route path="/new-maintenance-log/ticket/:id" element={<Ticket />} />
            <Route path="/logs" element={<WorkLogHistory />} />
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
        <AppContent></AppContent>
      </ToastProvider>
    </LoaderProvider>
  );
}