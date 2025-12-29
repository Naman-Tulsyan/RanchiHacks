import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Shield, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function LegalCertificate() {
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerated(true);
    toast.success('Legal certificate generated successfully (Mock)');
  };

  const handleDownload = () => {
    toast.success('Certificate PDF downloaded (Mock)');
  };

  const mockCertificateData = {
    evidenceId: 'EV-2024-001',
    title: 'Downtown Incident Video',
    captureTime: '2024-01-15 14:30:22',
    captureOfficer: 'DCP-2847',
    captureDevice: 'LENS-CAM-2847-A',
    captureLocation: '28.6139° N, 77.2090° E (Connaught Place, Delhi)',
    hash: 'a7f5c8d9e2b4f1a6c3d8e9f0b2c5d8e1a4b7c0d3e6f9a2b5c8d1e4f7a0b3c6d9',
    blockchainTx: '0x7f3d8e9a2b5c8d1e4f7a0b3c6d9e2f5a8b1c4d7e0f3a6b9c2d5e8f1a4b7c0d3',
    custody: [
      { entity: 'DCP-2847', action: 'Captured', time: '2024-01-15 14:30:22', verified: true },
      { entity: 'Forensics Lab', action: 'Analyzed', time: '2024-01-15 16:20:00', verified: true },
      { entity: 'Evidence Room', action: 'Stored', time: '2024-01-15 18:45:00', verified: true },
    ],
    aiAnalysis: 'High priority evidence. Weapon detected at 00:04:15, license plate visible (XYZ-1234), multiple subjects identified. Authenticity verified with 96% confidence.',
    section: 'Section 63 - Bharat Sakshya Adhiniyam, 2023'
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary mb-2">Legal Certificate (Section 63 BSA)</h1>
          <p className="text-muted-foreground">Court-admissible evidence certification</p>
        </div>
        {!generated ? (
          <Button
            onClick={handleGenerate}
            className="bg-gradient-primary hover:opacity-90 shadow-glow"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Certificate (Mock)
          </Button>
        ) : (
          <Button
            onClick={handleDownload}
            className="bg-gradient-secondary hover:opacity-90"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF (Mock)
          </Button>
        )}
      </div>

      {/* Certificate Preview */}
      {!generated ? (
        <Card className="border-border shadow-lg">
          <CardContent className="pt-12 pb-12 text-center">
            <FileText className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Certificate Generated</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Generate a legal certificate compliant with Section 63 of Bharat Sakshya Adhiniyam, 2023 for court presentation.
            </p>
            <Button
              onClick={handleGenerate}
              className="bg-gradient-primary hover:opacity-90 shadow-glow"
            >
              Generate Certificate
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Certificate Document */}
          <Card className="border-primary/30 shadow-glow bg-card">
            <CardHeader className="border-b border-border pb-6">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">Digital Evidence Certificate</CardTitle>
                  <CardDescription className="text-base">{mockCertificateData.section}</CardDescription>
                </div>
                <Badge className="bg-secondary/20 text-secondary border-secondary text-sm px-3 py-1">
                  <Check className="w-4 h-4 mr-1" />
                  Verified
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Evidence Details */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">EVIDENCE DETAILS</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Evidence ID</p>
                    <p className="font-mono font-medium">{mockCertificateData.evidenceId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Title</p>
                    <p className="font-medium">{mockCertificateData.title}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Capture Time</p>
                    <p className="font-mono">{mockCertificateData.captureTime}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Capturing Officer</p>
                    <p className="font-medium">{mockCertificateData.captureOfficer}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Device ID</p>
                    <p className="font-mono">{mockCertificateData.captureDevice}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Location</p>
                    <p className="text-xs">{mockCertificateData.captureLocation}</p>
                  </div>
                </div>
              </div>

              {/* Cryptographic Proof */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">CRYPTOGRAPHIC PROOF</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <p className="text-muted-foreground mb-1">SHA-256 Hash</p>
                    <p className="font-mono break-all bg-card p-2 rounded">{mockCertificateData.hash}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Blockchain Transaction ID (Mock)</p>
                    <p className="font-mono break-all bg-card p-2 rounded">{mockCertificateData.blockchainTx}</p>
                  </div>
                </div>
              </div>

              {/* Chain of Custody */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">CHAIN OF CUSTODY SUMMARY</h3>
                <div className="space-y-2">
                  {mockCertificateData.custody.map((entry, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-secondary" />
                      </div>
                      <div className="flex-1 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{entry.entity}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">{entry.action}</span>
                        </div>
                        <p className="text-xs text-muted-foreground font-mono">{entry.time}</p>
                      </div>
                      <Badge variant="outline" className="border-secondary text-secondary text-xs">
                        Verified
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Analysis Summary */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">AI ANALYSIS SUMMARY (Mock)</h3>
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm leading-relaxed">{mockCertificateData.aiAnalysis}</p>
                </div>
              </div>

              {/* Certification Statement */}
              <div className="border-t border-border pt-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-sm font-semibold mb-2">CERTIFICATION STATEMENT (Mock)</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      This certificate confirms that the digital evidence identified herein has been captured, stored, and maintained in accordance with Section 63 of the Bharat Sakshya Adhiniyam, 2023. The evidence integrity has been cryptographically verified at each stage of custody, with all transactions recorded on an immutable blockchain ledger. The chain of custody is complete and unbroken, making this evidence admissible in court proceedings.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border text-xs text-muted-foreground">
                <div>
                  <p>Generated: {new Date().toISOString().replace('T', ' ').substring(0, 19)}</p>
                  <p className="mt-1">ForensiChain AI Evidence Console v2.0</p>
                </div>
                <div className="text-right">
                  <p>Certificate ID: CERT-{mockCertificateData.evidenceId}</p>
                  <p className="mt-1">Status: Court-Ready</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
