import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./components/dashboard/Dashboard";
import WorklogForm from "./components/worklog-form";
import WorkLogHistory from "./components/worklog-history";

function App() {
  return (
    <div>
      <Header />

      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/new-maintenance-log" element={<WorklogForm />} />
        <Route path="/logs" element={<WorkLogHistory />} />
      </Routes>
    </div>
  );
}

export default App;