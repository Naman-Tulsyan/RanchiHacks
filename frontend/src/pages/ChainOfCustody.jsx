import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Link as LinkIcon, Check, Clock, Shield } from 'lucide-react';
import { toast } from 'sonner';

const mockTransfers = [
  { id: 'T-001', from: 'DCP-2847 (Capture)', to: 'Forensics Lab', timestamp: '2024-01-15 14:35:00', status: 'completed', hash: 'a7f5c8d9...verified' },
  { id: 'T-002', from: 'Forensics Lab', to: 'Evidence Room', timestamp: '2024-01-15 16:20:00', status: 'completed', hash: 'a7f5c8d9...verified' },
  { id: 'T-003', from: 'Evidence Room', to: 'Prosecutor Office', timestamp: '2024-01-15 18:45:00', status: 'pending', hash: 'awaiting acceptance' },
];

export default function ChainOfCustody() {
  const [transfers, setTransfers] = useState(mockTransfers);
  const [newTransfer, setNewTransfer] = useState({ from: 'Evidence Room', to: '', evidence: 'EV-2024-001' });

  const handleInitiateTransfer = () => {
    if (!newTransfer.to) {
      toast.error('Please select a recipient');
      return;
    }
    
    const transfer = {
      id: `T-${String(transfers.length + 1).padStart(3, '0')}`,
      from: newTransfer.from,
      to: newTransfer.to,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'pending',
      hash: 'awaiting acceptance'
    };
    
    setTransfers([...transfers, transfer]);
    toast.success('Transfer initiated successfully (Mock)');
  };

  const handleAcceptTransfer = (transferId) => {
    setTransfers(transfers.map(t => 
      t.id === transferId 
        ? { ...t, status: 'completed', hash: 'a7f5c8d9...verified' }
        : t
    ));
    toast.success('Transfer accepted. Hash verified - No tampering detected (Mock)');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient-primary mb-2">Chain-of-Custody Transfers</h1>
        <p className="text-muted-foreground">Blockchain-verified evidence transfers with cryptographic proof</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">{transfers.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Total Transfers</p>
              </div>
              <LinkIcon className="w-10 h-10 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-secondary">{transfers.filter(t => t.status === 'completed').length}</p>
                <p className="text-xs text-muted-foreground mt-1">Completed</p>
              </div>
              <Check className="w-10 h-10 text-secondary opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">{transfers.filter(t => t.status === 'pending').length}</p>
                <p className="text-xs text-muted-foreground mt-1">Pending</p>
              </div>
              <Clock className="w-10 h-10 text-foreground opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transfer Timeline */}
      <Card className="border-border shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-primary" />
            Custody Transfer Timeline
          </CardTitle>
          <CardDescription>Evidence: EV-2024-001 - Downtown Incident Video</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transfers.map((transfer, index) => (
              <div key={transfer.id} className="flex gap-4">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    transfer.status === 'completed' 
                      ? 'bg-secondary shadow-glow-green' 
                      : 'bg-muted border-2 border-primary animate-pulse'
                  }`} />
                  {index < transfers.length - 1 && (
                    <div className="w-0.5 h-full min-h-[60px] bg-border mt-2" />
                  )}
                </div>
                
                {/* Transfer Card */}
                <Card className={`flex-1 ${
                  transfer.status === 'pending' 
                    ? 'border-primary/30' 
                    : 'border-border'
                }`}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="font-mono text-xs">{transfer.id}</Badge>
                          {transfer.status === 'completed' ? (
                            <Badge className="bg-secondary/20 text-secondary border-secondary">
                              <Check className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-primary text-primary">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending Acceptance
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">From:</span>
                            <span className="font-medium">{transfer.from}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">To:</span>
                            <span className="font-medium">{transfer.to}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Time:</span>
                            <span className="font-mono text-xs">{transfer.timestamp}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Hash Status:</span>
                            <span className={`font-mono text-xs ${
                              transfer.status === 'completed' ? 'text-secondary' : 'text-muted-foreground'
                            }`}>
                              {transfer.hash}
                            </span>
                          </div>
                        </div>
                      </div>
                      {transfer.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleAcceptTransfer(transfer.id)}
                          className="bg-gradient-secondary hover:opacity-90"
                        >
                          Accept Transfer (Mock)
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Initiate New Transfer */}
      <Card className="border-border shadow-lg">
        <CardHeader>
          <CardTitle>Initiate New Transfer (Mock)</CardTitle>
          <CardDescription>Create a new custody transfer with blockchain verification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>From</Label>
              <Input value={newTransfer.from} disabled />
            </div>
            <div className="space-y-2">
              <Label>To</Label>
              <Select value={newTransfer.to} onValueChange={(val) => setNewTransfer({...newTransfer, to: val})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Court Registry">Court Registry</SelectItem>
                  <SelectItem value="Defense Attorney">Defense Attorney</SelectItem>
                  <SelectItem value="External Agency">External Agency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Evidence</Label>
              <Input value={newTransfer.evidence} disabled />
            </div>
          </div>
          <Button 
            onClick={handleInitiateTransfer}
            className="bg-gradient-primary hover:opacity-90 shadow-glow"
          >
            <Shield className="w-4 h-4 mr-2" />
            Initiate Transfer (Mock)
          </Button>
        </CardContent>
      </Card>

      {/* Integrity Notice */}
      <Card className="border-secondary/30 bg-secondary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-secondary">Hash Verified - No Tampering (Mock)</p>
              <p className="text-xs text-muted-foreground mt-1">
                All transfers are cryptographically verified. The evidence hash remains unchanged throughout the custody chain, ensuring court admissibility.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
