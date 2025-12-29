import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, Check, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function CaptureEvidence() {
  const [file, setFile] = useState(null);
  const [captured, setCaptured] = useState(false);
  const [evidenceData, setEvidenceData] = useState({
    case: '',
    title: '',
    description: '',
    location: '',
    officer: 'DCP-2847'
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleCapture = () => {
    if (!file || !evidenceData.case || !evidenceData.title) {
      toast.error('Please fill all required fields and upload a file');
      return;
    }
    
    // Mock capture with generated data
    setCaptured(true);
    toast.success('Evidence captured successfully with blockchain verification');
  };

  const mockHash = 'a7f5c8d9e2b4f1a6c3d8e9f0b2c5d8e1a4b7c0d3e6f9a2b5c8d1e4f7a0b3c6d9';
  const mockTimestamp = new Date().toISOString();
  const mockDeviceId = 'LENS-CAM-2847-A';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient-primary mb-2">LensLock Evidence Capture</h1>
        <p className="text-muted-foreground">Secure digital evidence capture with cryptographic proof</p>
      </div>

      {/* Main Capture Form */}
      <Card className="border-border shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Evidence Details
          </CardTitle>
          <CardDescription>All fields are recorded immutably at capture time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Case Selection */}
          <div className="space-y-2">
            <Label htmlFor="case">Case ID *</Label>
            <Select value={evidenceData.case} onValueChange={(val) => setEvidenceData({...evidenceData, case: val})}>
              <SelectTrigger id="case">
                <SelectValue placeholder="Select case" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASE-2024-001">CASE-2024-001 - Downtown Incident</SelectItem>
                <SelectItem value="CASE-2024-002">CASE-2024-002 - Highway Surveillance</SelectItem>
                <SelectItem value="CASE-2024-003">CASE-2024-003 - Property Investigation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Evidence Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Suspect vehicle capture at 14:30"
              value={evidenceData.title}
              onChange={(e) => setEvidenceData({...evidenceData, title: e.target.value})}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the evidence..."
              value={evidenceData.description}
              onChange={(e) => setEvidenceData({...evidenceData, description: e.target.value})}
              rows={4}
            />
          </div>

          {/* Location and Officer */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="GPS coordinates or address"
                value={evidenceData.location}
                onChange={(e) => setEvidenceData({...evidenceData, location: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="officer">Officer ID</Label>
              <Input id="officer" value={evidenceData.officer} disabled />
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file">Upload Evidence File *</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,video/*,audio/*"
              />
              <label htmlFor="file" className="cursor-pointer flex flex-col items-center">
                <Upload className="w-12 h-12 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-1">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-muted-foreground">Supports: Images, Videos, Audio files</p>
              </label>
            </div>
          </div>

          {/* Capture Button */}
          <Button 
            onClick={handleCapture}
            className="w-full bg-gradient-primary hover:opacity-90 shadow-glow"
            size="lg"
            disabled={captured}
          >
            {captured ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Evidence Captured
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Capture & Verify Evidence
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Verification Results */}
      {captured && (
        <Card className="border-primary/30 shadow-glow bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-secondary">
              <Check className="w-5 h-5" />
              Integrity at Birth: VERIFIED (Mock)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Timestamp</p>
                <p className="text-sm font-mono text-foreground">{mockTimestamp}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Device ID</p>
                <p className="text-sm font-mono text-foreground">{mockDeviceId}</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">SHA-256 Hash</p>
              <p className="text-xs font-mono text-foreground break-all bg-muted p-2 rounded">{mockHash}</p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline" className="border-secondary text-secondary">
                Blockchain: Recorded
              </Badge>
              <Badge variant="outline" className="border-primary text-primary">
                Encrypted: AES-256
              </Badge>
              <Badge variant="outline" className="border-muted-foreground text-muted-foreground">
                Storage: Secure S3
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
