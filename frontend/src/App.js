import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@/App.css';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CaptureEvidence from '@/pages/CaptureEvidence';
import DigitalMalkhana from '@/pages/DigitalMalkhana';
import AITriage from '@/pages/AITriage';
import AuthenticityCheck from '@/pages/AuthenticityCheck';
import VisualHeatmaps from '@/pages/VisualHeatmaps';
import PrivacyRedaction from '@/pages/PrivacyRedaction';
import ChainOfCustody from '@/pages/ChainOfCustody';
import CrossBorderSharing from '@/pages/CrossBorderSharing';
import LegalCertificate from '@/pages/LegalCertificate';
import CourtroomPresentation from '@/pages/CourtroomPresentation';
import RetentionClosure from '@/pages/RetentionClosure';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout currentStep={currentStep} setCurrentStep={setCurrentStep} />}>
            <Route index element={<CaptureEvidence />} />
            <Route path="capture" element={<CaptureEvidence />} />
            <Route path="malkhana" element={<DigitalMalkhana />} />
            <Route path="triage" element={<AITriage />} />
            <Route path="authenticity" element={<AuthenticityCheck />} />
            <Route path="heatmaps" element={<VisualHeatmaps />} />
            <Route path="privacy" element={<PrivacyRedaction />} />
            <Route path="custody" element={<ChainOfCustody />} />
            <Route path="sharing" element={<CrossBorderSharing />} />
            <Route path="certificate" element={<LegalCertificate />} />
            <Route path="courtroom" element={<CourtroomPresentation />} />
            <Route path="closure" element={<RetentionClosure />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
