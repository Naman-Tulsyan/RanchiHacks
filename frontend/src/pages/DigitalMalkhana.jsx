import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Database, Check, FileText, Image, Video, Music } from 'lucide-react';
import { toast } from 'sonner';

const mockEvidence = [
  { id: 'EV-2024-001', type: 'image', hash: 'a7f5c8d9...c6d9', officer: 'DCP-2847', timestamp: '2024-01-15 14:30:22', storage: 'Encrypted S3', blockchain: 'pending' },
  { id: 'EV-2024-002', type: 'video', hash: 'b8e6d9f0...d7e0', officer: 'DCP-2847', timestamp: '2024-01-15 15:45:10', storage: 'Encrypted S3', blockchain: 'pending' },
  { id: 'EV-2024-003', type: 'audio', hash: 'c9f7e0a1...e8f1', officer: 'INS-4521', timestamp: '2024-01-15 16:20:55', storage: 'Encrypted S3', blockchain: 'pending' },
];

export default function DigitalMalkhana() {
  const [evidenceList, setEvidenceList] = useState(mockEvidence);
  const [ingesting, setIngesting] = useState(false);

  const handleIngest = () => {
    setIngesting(true);
    setTimeout(() => {
      setEvidenceList(evidenceList.map(ev => ({ ...ev, blockchain: 'recorded' })));
      setIngesting(false);
      toast.success('All evidence ingested to Digital Malkhana successfully');
    }, 2000);
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Music className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary mb-2">Digital Malkhana</h1>
          <p className="text-muted-foreground">Secure evidence storage and blockchain ingestion</p>
        </div>
        <Button
          onClick={handleIngest}
          disabled={ingesting || evidenceList.every(ev => ev.blockchain === 'recorded')}
          className="bg-gradient-primary hover:opacity-90 shadow-glow"
        >
          {ingesting ? (
            'Ingesting...'
          ) : evidenceList.every(ev => ev.blockchain === 'recorded') ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              All Ingested
            </>
          ) : (
            <>
              <Database className="w-4 h-4 mr-2" />
              Ingest to Malkhana
            </>
          )}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{evidenceList.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Items</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">{evidenceList.filter(ev => ev.blockchain === 'recorded').length}</p>
              <p className="text-xs text-muted-foreground mt-1">Blockchain Recorded</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{evidenceList.filter(ev => ev.blockchain === 'pending').length}</p>
              <p className="text-xs text-muted-foreground mt-1">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">256-bit</p>
              <p className="text-xs text-muted-foreground mt-1">Encryption</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evidence Table */}
      <Card className="border-border shadow-lg">
        <CardHeader>
          <CardTitle>Evidence Inventory</CardTitle>
          <CardDescription>All captured evidence awaiting or completed blockchain ingestion</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Hash (Short)</TableHead>
                <TableHead>Officer</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Storage</TableHead>
                <TableHead>Blockchain Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evidenceList.map((evidence) => (
                <TableRow key={evidence.id} className="hover:bg-accent/50">
                  <TableCell className="font-mono text-sm">{evidence.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(evidence.type)}
                      <span className="capitalize">{evidence.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{evidence.hash}</TableCell>
                  <TableCell>{evidence.officer}</TableCell>
                  <TableCell className="text-sm">{evidence.timestamp}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{evidence.storage}</Badge>
                  </TableCell>
                  <TableCell>
                    {evidence.blockchain === 'recorded' ? (
                      <Badge className="bg-secondary/20 text-secondary border-secondary">
                        <Check className="w-3 h-3 mr-1" />
                        Recorded (Mock)
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Info Banner */}
      {evidenceList.every(ev => ev.blockchain === 'recorded') && (
        <Card className="border-secondary/30 bg-secondary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-secondary" />
              <div>
                <p className="text-sm font-medium text-secondary">All Evidence Successfully Ingested</p>
                <p className="text-xs text-muted-foreground mt-0.5">Blockchain timestamps recorded. Evidence is now tamper-proof and court-admissible (Mock).</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
