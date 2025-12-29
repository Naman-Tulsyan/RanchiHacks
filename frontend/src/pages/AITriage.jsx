import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AlertTriangle, CheckCircle, Info, Brain } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const mockEvidence = [
  { id: 'EV-2024-001', title: 'Downtown Incident Video', priority: 'high', confidence: 0.94, findings: ['Weapon detected at 00:04:15', 'License plate visible: XYZ-1234', 'Multiple subjects identified'] },
  { id: 'EV-2024-002', title: 'Highway Surveillance', priority: 'medium', confidence: 0.78, findings: ['Vehicle speed anomaly detected', 'Traffic violation probable'] },
  { id: 'EV-2024-003', title: 'Audio Recording - Interview', priority: 'low', confidence: 0.65, findings: ['Voice stress analysis: normal', 'No deception indicators'] },
  { id: 'EV-2024-004', title: 'Property Investigation Photos', priority: 'high', confidence: 0.91, findings: ['Forced entry evidence detected', 'Fingerprint regions identified', 'Tool marks present'] },
];

export default function AITriage() {
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  const highCount = mockEvidence.filter(e => e.priority === 'high').length;
  const mediumCount = mockEvidence.filter(e => e.priority === 'medium').length;
  const lowCount = mockEvidence.filter(e => e.priority === 'low').length;

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Info className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient-primary mb-2">AI Triage Analysis</h1>
        <p className="text-muted-foreground">Automatic priority classification and intelligent evidence analysis</p>
      </div>

      {/* Priority Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-destructive/30 bg-destructive/5 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold text-destructive">{highCount}</p>
                <p className="text-sm text-muted-foreground mt-1">High Priority</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-destructive opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-primary/5 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold text-primary">{mediumCount}</p>
                <p className="text-sm text-muted-foreground mt-1">Medium Priority</p>
              </div>
              <Info className="w-12 h-12 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary/30 bg-secondary/5 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold text-secondary">{lowCount}</p>
                <p className="text-sm text-muted-foreground mt-1">Low Priority</p>
              </div>
              <CheckCircle className="w-12 h-12 text-secondary opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evidence List */}
      <Card className="border-border shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI Analysis Results (Mock)
          </CardTitle>
          <CardDescription>AI-powered triage classification with confidence scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockEvidence.map((evidence) => (
              <Card key={evidence.id} className="border-border hover:border-primary/30 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant={getPriorityColor(evidence.priority)} className="flex items-center gap-1">
                          {getPriorityIcon(evidence.priority)}
                          {evidence.priority.toUpperCase()}
                        </Badge>
                        <span className="font-mono text-sm text-muted-foreground">{evidence.id}</span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{evidence.title}</h3>
                      <p className="text-sm text-muted-foreground">AI Confidence: {(evidence.confidence * 100).toFixed(0)}%</p>
                    </div>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedEvidence(evidence)}
                        >
                          View Analysis (Mock)
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-full sm:max-w-lg">
                        <SheetHeader>
                          <SheetTitle>AI Analysis Details</SheetTitle>
                          <SheetDescription>Mock AI-generated findings and insights</SheetDescription>
                        </SheetHeader>
                        <ScrollArea className="h-full mt-6">
                          <div className="space-y-6">
                            <div>
                              <p className="text-sm font-medium mb-2">Evidence ID</p>
                              <p className="font-mono text-sm text-muted-foreground">{evidence.id}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-2">Title</p>
                              <p className="text-sm">{evidence.title}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-2">Priority Classification</p>
                              <Badge variant={getPriorityColor(evidence.priority)} className="flex items-center gap-1 w-fit">
                                {getPriorityIcon(evidence.priority)}
                                {evidence.priority.toUpperCase()}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-2">AI Confidence</p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-primary"
                                    style={{ width: `${evidence.confidence * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium">{(evidence.confidence * 100).toFixed(0)}%</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-3">Key Findings (Mock)</p>
                              <ul className="space-y-2">
                                {evidence.findings.map((finding, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm">
                                    <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                                    <span>{finding}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-muted/30 p-4 rounded-lg">
                              <p className="text-xs text-muted-foreground">
                                <strong>Note:</strong> This analysis is mocked for demonstration. In production, this would contain real AI insights from computer vision, audio analysis, and NLP models.
                              </p>
                            </div>
                          </div>
                        </ScrollArea>
                      </SheetContent>
                    </Sheet>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
