import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scale, Shield, Check, FileText, Thermometer, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

const mockEvidence = {
  id: 'EV-2024-001',
  title: 'Downtown Incident Video',
  authenticity: 'AUTHENTIC',
  confidence: 0.96,
  heatmapRegions: ['Weapon at 00:04:15', 'License plate: XYZ-1234', 'Multiple subjects'],
  custodyCount: 4,
  certificateGenerated: true
};

export default function CourtroomPresentation() {
  const [verified, setVerified] = useState(false);

  const handleVerify = () => {
    setTimeout(() => {
      setVerified(true);
      toast.success('Hash matches. Evidence admitted to court proceedings (Mock)');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary mb-2">Courtroom Presentation</h1>
          <p className="text-muted-foreground">Court-ready evidence presentation with verification</p>
        </div>
        <Button
          onClick={handleVerify}
          disabled={verified}
          className="bg-gradient-secondary hover:opacity-90 shadow-glow-green"
          size="lg"
        >
          {verified ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Evidence Admitted
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Verify Against Blockchain (Mock)
            </>
          )}
        </Button>
      </div>

      {/* Verification Status */}
      {verified && (
        <Card className="border-secondary/30 bg-secondary/5 shadow-glow-green">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <Check className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-base font-semibold text-secondary">Hash Matches - Evidence Admitted (Mock)</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Blockchain verification complete. Evidence integrity confirmed. Court-admissible under Section 63 BSA 2023.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Evidence Preview */}
      <Card className="border-border shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-6 h-6 text-primary" />
                {mockEvidence.title}
              </CardTitle>
              <CardDescription className="mt-1">Evidence ID: {mockEvidence.id}</CardDescription>
            </div>
            <Badge className="bg-secondary/20 text-secondary border-secondary text-base px-4 py-2">
              {mockEvidence.authenticity}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Evidence Display */}
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50" />
            <div className="relative z-10 text-center p-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-card flex items-center justify-center border-2 border-primary">
                <Scale className="w-10 h-10 text-primary" />
              </div>
              <p className="text-base font-medium mb-2">Video Evidence Preview</p>
              <p className="text-sm text-muted-foreground">Frame 00:04:15 - Critical evidence visible</p>
            </div>
          </div>

          {/* Evidence Details Tabs */}
          <Tabs defaultValue="authenticity" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="authenticity">Authenticity</TabsTrigger>
              <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
              <TabsTrigger value="custody">Custody</TabsTrigger>
              <TabsTrigger value="certificate">Certificate</TabsTrigger>
            </TabsList>
            
            <TabsContent value="authenticity" className="space-y-4 mt-6">
              <Card className="border-secondary/30 bg-secondary/5">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">AI Authenticity Status</span>
                      <Badge className="bg-secondary/20 text-secondary border-secondary">
                        {mockEvidence.authenticity} (Mock)
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Confidence Score</span>
                        <span className="font-medium">{(mockEvidence.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-secondary"
                          style={{ width: `${mockEvidence.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-border space-y-2">
                      <div className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                        <span>No temporal inconsistencies detected</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                        <span>Frame rate consistent throughout</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                        <span>Metadata verified against blockchain</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="heatmap" className="space-y-4 mt-6">
              <Card className="border-border">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Thermometer className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">AI-Detected Regions of Interest (Mock)</h3>
                    </div>
                    {mockEvidence.heatmapRegions.map((region, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-destructive">{index + 1}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{region}</p>
                          <p className="text-xs text-muted-foreground mt-1">High-interest region - Critical for case</p>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Heatmap hash stored on blockchain for verification: e4f7a0b3c6d9e2f5a8b1c4d7...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="custody" className="space-y-4 mt-6">
              <Card className="border-border">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <LinkIcon className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">Chain of Custody Timeline</h3>
                    </div>
                    <div className="space-y-3">
                      {[
                        { entity: 'DCP-2847', action: 'Captured', time: '2024-01-15 14:30:22' },
                        { entity: 'Forensics Lab', action: 'Analyzed', time: '2024-01-15 16:20:00' },
                        { entity: 'Evidence Room', action: 'Stored', time: '2024-01-15 18:45:00' },
                        { entity: 'Court Registry', action: 'Admitted', time: '2024-01-16 09:00:00' },
                      ].map((entry, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-secondary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium">{entry.entity}</span>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-muted-foreground">{entry.action}</span>
                            </div>
                            <p className="text-xs text-muted-foreground font-mono">{entry.time}</p>
                          </div>
                          <Badge variant="outline" className="border-secondary text-secondary text-xs">Verified</Badge>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Total custody transfers: {mockEvidence.custodyCount} • All verified • No tampering detected
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="certificate" className="space-y-4 mt-6">
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">Legal Certificate Snippet</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Certificate ID</p>
                        <p className="font-mono">CERT-{mockEvidence.id}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Compliance</p>
                        <p>Section 63 - Bharat Sakshya Adhiniyam, 2023</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Status</p>
                        <Badge className="bg-secondary/20 text-secondary border-secondary">Court-Ready</Badge>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        This certificate confirms that the digital evidence has been captured, stored, and maintained in accordance with Section 63 of BSA 2023. Evidence integrity cryptographically verified at each custody stage.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-secondary">{mockEvidence.authenticity}</p>
            <p className="text-xs text-muted-foreground mt-1">Authenticity Status</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-foreground">{(mockEvidence.confidence * 100).toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground mt-1">AI Confidence</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-foreground">{mockEvidence.custodyCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Custody Transfers</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-primary">100%</p>
            <p className="text-xs text-muted-foreground mt-1">Blockchain Verified</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
