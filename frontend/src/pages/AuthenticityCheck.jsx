import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldCheck, ShieldAlert, Video, Image as ImageIcon, Music, CheckCircle, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const mockEvidence = [
  { 
    id: 'EV-2024-001', 
    title: 'Downtown Incident Video',
    type: 'video',
    status: 'authentic', 
    confidence: 0.96,
    checks: {
      video: ['No temporal inconsistencies detected', 'Frame rate consistent throughout', 'No compression artifacts from editing'],
      image: ['Lighting analysis: Natural and consistent', 'Shadow direction verified', 'EXIF data intact and unmodified'],
      metadata: ['Camera model verified: Canon EOS R5', 'GPS coordinates match reported location', 'Timestamp verified against blockchain'],
      audio: ['Audio waveform natural', 'No splicing detected', 'Background noise consistent']
    }
  },
  { 
    id: 'EV-2024-002', 
    title: 'Highway Surveillance',
    type: 'video',
    status: 'suspicious', 
    confidence: 0.43,
    checks: {
      video: ['Frame duplication detected at 00:02:45', 'Potential temporal manipulation', 'Unnatural scene transitions'],
      image: ['Clone stamp artifacts present', 'Inconsistent compression levels'],
      metadata: ['EXIF timestamp mismatch', 'GPS data missing'],
      audio: ['Audio sync issues detected', 'Background noise discontinuity']
    }
  },
];

export default function AuthenticityCheck() {
  const [selectedEvidence, setSelectedEvidence] = useState(mockEvidence[0]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient-primary mb-2">AI Authenticity Verification</h1>
        <p className="text-muted-foreground">Deep learning analysis for tampering and manipulation detection</p>
      </div>

      {/* Evidence Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockEvidence.map((evidence) => (
          <Card 
            key={evidence.id}
            className={`cursor-pointer transition-all border-2 ${
              selectedEvidence.id === evidence.id 
                ? evidence.status === 'authentic' 
                  ? 'border-secondary shadow-glow-green' 
                  : 'border-destructive shadow-lg'
                : 'border-border hover:border-primary/30'
            }`}
            onClick={() => setSelectedEvidence(evidence)}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {evidence.type === 'video' && <Video className="w-5 h-5 text-primary" />}
                  {evidence.type === 'image' && <ImageIcon className="w-5 h-5 text-primary" />}
                  {evidence.type === 'audio' && <Music className="w-5 h-5 text-primary" />}
                  <span className="font-mono text-sm text-muted-foreground">{evidence.id}</span>
                </div>
                {evidence.status === 'authentic' ? (
                  <ShieldCheck className="w-8 h-8 text-secondary" />
                ) : (
                  <ShieldAlert className="w-8 h-8 text-destructive" />
                )}
              </div>
              <h3 className="font-semibold mb-2">{evidence.title}</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Authenticity</span>
                  <Badge variant={evidence.status === 'authentic' ? 'default' : 'destructive'} className={evidence.status === 'authentic' ? 'bg-secondary/20 text-secondary border-secondary' : ''}>
                    {evidence.status === 'authentic' ? 'AUTHENTIC' : 'SUSPICIOUS'} (Mock)
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={evidence.confidence * 100} className="flex-1" />
                  <span className="text-sm font-medium">{(evidence.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analysis */}
      <Card className="border-border shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {selectedEvidence.status === 'authentic' ? (
                  <ShieldCheck className="w-6 h-6 text-secondary" />
                ) : (
                  <ShieldAlert className="w-6 h-6 text-destructive" />
                )}
                {selectedEvidence.title}
              </CardTitle>
              <CardDescription className="mt-1">{selectedEvidence.id} - Comprehensive AI Analysis (Mock)</CardDescription>
            </div>
            <Badge 
              variant={selectedEvidence.status === 'authentic' ? 'default' : 'destructive'}
              className={`text-base px-4 py-2 ${selectedEvidence.status === 'authentic' ? 'bg-secondary/20 text-secondary border-secondary' : ''}`}
            >
              {selectedEvidence.status === 'authentic' ? 'AUTHENTIC' : 'SUSPICIOUS'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="video" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="video">Video Analysis</TabsTrigger>
              <TabsTrigger value="image">Image Forensics</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
              <TabsTrigger value="audio">Audio Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="video" className="space-y-4 mt-6">
              <div className="space-y-3">
                {selectedEvidence.checks.video.map((check, idx) => {
                  const isPass = !check.toLowerCase().includes('detected') || check.toLowerCase().includes('no ');
                  return (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      {isPass ? (
                        <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      )}
                      <span className="text-sm">{check}</span>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="image" className="space-y-4 mt-6">
              <div className="space-y-3">
                {selectedEvidence.checks.image.map((check, idx) => {
                  const isPass = !check.toLowerCase().includes('artifacts') && !check.toLowerCase().includes('inconsistent');
                  return (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      {isPass ? (
                        <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      )}
                      <span className="text-sm">{check}</span>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="metadata" className="space-y-4 mt-6">
              <div className="space-y-3">
                {selectedEvidence.checks.metadata.map((check, idx) => {
                  const isPass = check.toLowerCase().includes('verified') || check.toLowerCase().includes('match');
                  return (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      {isPass ? (
                        <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      )}
                      <span className="text-sm">{check}</span>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="audio" className="space-y-4 mt-6">
              <div className="space-y-3">
                {selectedEvidence.checks.audio.map((check, idx) => {
                  const isPass = !check.toLowerCase().includes('issues') && !check.toLowerCase().includes('discontinuity');
                  return (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      {isPass ? (
                        <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      )}
                      <span className="text-sm">{check}</span>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>

          {/* Blockchain Verification */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Blockchain Hash Verification (Mock)</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Hash comparison: Original capture hash matches current file hash. No tampering detected at storage level.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
