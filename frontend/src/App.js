import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/App.css";
import "shepherd.js/dist/css/shepherd.css";
import MainLayout from "@/components/layout/MainLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import EvidenceDetail from "@/pages/EvidenceDetail";
import ChainOfCustody from "@/pages/ChainOfCustody";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Login page - no layout */}
          <Route path="/login" element={<Login />} />

          {/* Main app with layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/evidence/:id" element={<EvidenceDetail />} />
            <Route path="/custody" element={<ChainOfCustody />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
