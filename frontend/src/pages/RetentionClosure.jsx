import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Archive, AlertCircle, Check, Shield, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function RetentionClosure() {
  const [caseClosed, setCaseClosed] = useState(false);

  const mockCaseData = {
    caseId: 'CASE-2024-001',
    title: 'Downtown Incident Investigation',
    evidenceCount: 3,
    createdDate: '2024-01-15',
    retentionPeriod: '7 years',
    deletionDate: '2031-01-15',
    status: 'active'
  };

  const handleClosureCase = () => {
    setCaseClosed(true);
    toast.success('Case closed successfully. Evidence retention policies applied (Mock)');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient-primary mb-2">Retention & Case Closure</h1>
        <p className="text-muted-foreground">Evidence lifecycle management and secure deletion</p>
      </div>

      {/* Case Status */}
      <Card className={`border-border shadow-lg ${caseClosed ? 'opacity-75' : ''}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Archive className="w-6 h-6 text-primary" />
                {mockCaseData.title}
              </CardTitle>
              <CardDescription className="mt-1">Case ID: {mockCaseData.caseId}</CardDescription>
            </div>
            <Badge 
              variant={caseClosed ? 'outline' : 'default'}
              className={caseClosed ? 'text-muted-foreground' : 'bg-primary/20 text-primary border-primary'}
            >
              {caseClosed ? 'Closed' : 'Active'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Case Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Evidence Items</p>
                <p className="text-lg font-semibold">{mockCaseData.evidenceCount} items</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Created Date</p>
                <p className="text-lg font-semibold">{mockCaseData.createdDate}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Retention Period</p>
                <p className="text-lg font-semibold">{mockCaseData.retentionPeriod}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Scheduled Deletion</p>
                <p className="text-lg font-semibold">{mockCaseData.deletionDate}</p>
              </div>
            </div>
          </div>

          {/* Evidence List */}
          <div className="pt-4 border-t border-border">
            <p className="text-sm font-medium mb-3">Associated Evidence</p>
            <div className="space-y-2">
              {['EV-2024-001', 'EV-2024-002', 'EV-2024-003'].map((evidenceId, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-mono text-sm">{evidenceId}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {caseClosed ? 'Access Restricted' : 'Active'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Retention Policy */}
      <Card className="border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-base">Retention Policy Details</CardTitle>
          <CardDescription>Evidence lifecycle and deletion procedures</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
              <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">Blockchain Proof Retained (Metadata Only - Mock)</p>
                <p className="text-xs text-muted-foreground">
                  After deletion, cryptographic proof and audit trail remain on blockchain. Actual evidence data is securely wiped.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
              <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">Secure Deletion Process</p>
                <p className="text-xs text-muted-foreground">
                  Multi-pass overwrite deletion following DoD 5220.22-M standard. All copies across encrypted storage destroyed.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
              <Archive className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">Retention Period</p>
                <p className="text-xs text-muted-foreground">
                  Evidence retained for {mockCaseData.retentionPeriod} as per legal requirements. Auto-deletion scheduled for {mockCaseData.deletionDate}.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Access Status After Closure */}
      {caseClosed && (
        <Alert variant="default" className="border-muted-foreground/30">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Case Closed - Access Restricted</AlertTitle>
          <AlertDescription>
            Evidence access has been restricted to authorized personnel only. All actions are logged for audit purposes. Evidence will be automatically deleted on {mockCaseData.deletionDate}.
          </AlertDescription>
        </Alert>
      )}

      {/* Closure Actions */}
      {!caseClosed ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-base font-semibold text-destructive mb-2">Close Case</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Closing this case will restrict evidence access, apply retention policies, and schedule automatic deletion after the retention period. This action can be reversed by authorized administrators.
                </p>
                <Button
                  variant="destructive"
                  onClick={handleClosureCase}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Close Case (Mock)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-secondary/30 bg-secondary/5 shadow-glow-green">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <Check className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-base font-semibold text-secondary">Case Successfully Closed (Mock)</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Evidence retention policies applied. Blockchain proof retained. Access restricted to authorized personnel.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-foreground">{mockCaseData.retentionPeriod}</p>
            <p className="text-xs text-muted-foreground mt-1">Retention Period</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-primary">Metadata</p>
            <p className="text-xs text-muted-foreground mt-1">Blockchain Proof</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-secondary">{caseClosed ? 'Restricted' : 'Active'}</p>
            <p className="text-xs text-muted-foreground mt-1">Access Status</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
