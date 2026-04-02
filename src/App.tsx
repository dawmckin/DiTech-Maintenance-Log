import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./components/dashboard/Dashboard";
import WorklogForm from "./components/worklog-form";
import WorkLogHistory from "./components/worklog-history/worklog-history";

function App() {
  return (
    <div className="app-container">
      <div className="app-content">
        <Header />

        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-maintenance-log" element={<WorklogForm />} />
          <Route path="/logs" element={<WorkLogHistory />} />
        </Routes>
      </div>
      
      <Footer />
    </div>
  );
}

export default App;