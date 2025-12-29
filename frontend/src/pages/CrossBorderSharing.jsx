import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Globe, Shield, Check, FileText } from 'lucide-react';
import { toast } from 'sonner';

const mockLogs = [
  { step: 'Redaction Applied', status: 'completed', timestamp: '2024-01-16 09:15:00' },
  { step: 'Encryption (AES-256)', status: 'completed', timestamp: '2024-01-16 09:15:02' },
  { step: 'Audit Trail Created', status: 'completed', timestamp: '2024-01-16 09:15:03' },
];

export default function CrossBorderSharing() {
  const [sharing, setSharing] = useState(false);
  const [shareData, setShareData] = useState({
    from: 'India - Delhi Police',
    to: '',
    purpose: '',
    evidence: 'EV-2024-001'
  });
  const [sharingSteps, setSharingSteps] = useState(mockLogs);
  const [shareComplete, setShareComplete] = useState(false);

  const handleShare = () => {
    if (!shareData.to || !shareData.purpose) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setSharing(true);
    
    // Simulate sharing process
    const steps = [...mockLogs];
    setSharingSteps(steps);
    
    setTimeout(() => {
      setSharingSteps([...steps, { step: 'Delivered to ' + shareData.to, status: 'completed', timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) }]);
      setSharing(false);
      setShareComplete(true);
      toast.success('Evidence shared successfully across jurisdictions (Mock)');
    }, 3000);
  };

  const currentStepIndex = sharingSteps.findIndex(s => s.status === 'pending');
  const activeStepIndex = currentStepIndex === -1 ? sharingSteps.length - 1 : currentStepIndex;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient-primary mb-2">Cross-Border Evidence Sharing</h1>
        <p className="text-muted-foreground">Secure international evidence transfer with compliance tracking</p>
      </div>

      {/* Share Form */}
      <Card className="border-border shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            International Sharing Request
          </CardTitle>
          <CardDescription>Share evidence across jurisdictions with automated compliance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From Jurisdiction</Label>
              <Input value={shareData.from} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to">To Jurisdiction *</Label>
              <Select value={shareData.to} onValueChange={(val) => setShareData({...shareData, to: val})}>
                <SelectTrigger id="to">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USA - FBI">USA - FBI</SelectItem>
                  <SelectItem value="UK - Scotland Yard">UK - Scotland Yard</SelectItem>
                  <SelectItem value="Interpol - Lyon">Interpol - Lyon</SelectItem>
                  <SelectItem value="Australia - AFP">Australia - AFP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="evidence">Evidence ID</Label>
            <Input id="evidence" value={shareData.evidence} disabled />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose of Sharing *</Label>
            <Textarea
              id="purpose"
              placeholder="e.g., Joint investigation, Mutual legal assistance, Witness protection..."
              value={shareData.purpose}
              onChange={(e) => setShareData({...shareData, purpose: e.target.value})}
              rows={3}
            />
          </div>
          
          <Button
            onClick={handleShare}
            disabled={sharing || shareComplete}
            className="w-full bg-gradient-primary hover:opacity-90 shadow-glow"
            size="lg"
          >
            {sharing ? (
              'Sharing in Progress...'
            ) : shareComplete ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Evidence Shared Successfully
              </>
            ) : (
              <>
                <Globe className="w-4 h-4 mr-2" />
                Share Evidence (Mock)
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Sharing Process */}
      {(sharing || shareComplete) && (
        <Card className="border-border shadow-lg">
          <CardHeader>
            <CardTitle>Sharing Process (Mock)</CardTitle>
            <CardDescription>Automated compliance and security steps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Redaction', 'Encryption', 'Audit Trail', 'Delivered'].map((step, index) => {
                const stepData = sharingSteps[index];
                const isCompleted = stepData?.status === 'completed';
                const isActive = index === activeStepIndex && sharing;
                
                return (
                  <div key={step} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-secondary text-secondary-foreground' 
                        : isActive
                        ? 'bg-primary text-primary-foreground animate-pulse'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{stepData?.step || step}</p>
                      {stepData?.timestamp && (
                        <p className="text-xs text-muted-foreground font-mono">{stepData.timestamp}</p>
                      )}
                    </div>
                    {isCompleted && (
                      <Badge className="bg-secondary/20 text-secondary border-secondary">Done</Badge>
                    )}
                    {isActive && (
                      <Badge variant="outline" className="border-primary text-primary">Processing...</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Log */}
      {shareComplete && (
        <Card className="border-border shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Sharing Activity Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Step</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sharingSteps.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{log.step}</TableCell>
                    <TableCell>
                      <Badge className="bg-secondary/20 text-secondary border-secondary">
                        <Check className="w-3 h-3 mr-1" />
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-primary">Automated Compliance & Security (Mock)</p>
              <p className="text-xs text-muted-foreground mt-1">
                All cross-border sharing follows MLAT protocols, applies jurisdiction-specific redactions, encrypts data in transit, and maintains comprehensive audit trails for international law enforcement cooperation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
