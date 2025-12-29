import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Thermometer, Eye, EyeOff } from 'lucide-react';

export default function VisualHeatmaps() {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState('EV-2024-001');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient-primary mb-2">Visual Heatmaps Analysis</h1>
        <p className="text-muted-foreground">AI-generated attention heatmaps showing regions of interest</p>
      </div>

      {/* Controls */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-primary" />
            Heatmap Controls
          </CardTitle>
          <CardDescription>Toggle heatmap overlay and select evidence for analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="heatmap-toggle" className="text-base">Show Heatmap Overlay</Label>
              <p className="text-sm text-muted-foreground">Display AI-detected regions of interest</p>
            </div>
            <Switch
              id="heatmap-toggle"
              checked={showHeatmap}
              onCheckedChange={setShowHeatmap}
            />
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              {showHeatmap ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              {showHeatmap ? 'Heatmap Active' : 'Original View'}
            </Badge>
            <Badge variant="outline">Evidence: {selectedEvidence}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Split View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original Frame */}
        <Card className="border-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-base">Original Frame</CardTitle>
            <CardDescription>Unmodified evidence capture</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50" />
              <div className="relative z-10 text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-card flex items-center justify-center">
                  <Thermometer className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Original Video Frame</p>
                <p className="text-xs text-muted-foreground mt-1">00:04:15 - Downtown Incident</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Heatmap View */}
        <Card className={`border-border shadow-lg ${showHeatmap ? 'border-primary/30 shadow-glow' : ''}`}>
          <CardHeader>
            <CardTitle className="text-base">Heatmap Analysis</CardTitle>
            <CardDescription>AI-detected regions of interest (Mock)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
              {showHeatmap ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50" />
                  {/* Mock Heatmap Overlays */}
                  <div className="absolute top-1/4 left-1/3 w-24 h-24 rounded-full bg-destructive/40 blur-2xl animate-pulse" />
                  <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-destructive/30 blur-3xl" />
                  <div className="absolute bottom-1/4 left-1/2 w-20 h-20 rounded-full bg-warning/30 blur-2xl" />
                  <div className="relative z-10 text-center p-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-card flex items-center justify-center border-2 border-destructive">
                      <Thermometer className="w-8 h-8 text-destructive" />
                    </div>
                    <p className="text-sm font-medium text-destructive">High-Interest Regions Detected</p>
                    <p className="text-xs text-muted-foreground mt-1">Weapon, License Plate, Subjects</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-muted/10" />
                  <div className="relative z-10 text-center p-6">
                    <EyeOff className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Enable heatmap to view analysis</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Details */}
      <Card className="border-border shadow-lg">
        <CardHeader>
          <CardTitle>Heatmap Analysis Details (Mock)</CardTitle>
          <CardDescription>AI-generated insights about detected regions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">High Interest</p>
                  <Badge variant="destructive" className="text-xs">Critical</Badge>
                </div>
                <p className="text-2xl font-bold text-destructive">3 regions</p>
                <p className="text-xs text-muted-foreground mt-1">Weapon, License plate, Subject faces</p>
              </div>
              
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Medium Interest</p>
                  <Badge className="text-xs bg-warning/20 text-warning border-warning">Relevant</Badge>
                </div>
                <p className="text-2xl font-bold" style={{color: 'hsl(var(--warning))'}}>
                  2 regions
                </p>
                <p className="text-xs text-muted-foreground mt-1">Vehicle details, Background activity</p>
              </div>
              
              <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/30">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Low Interest</p>
                  <Badge className="text-xs bg-secondary/20 text-secondary border-secondary">Info</Badge>
                </div>
                <p className="text-2xl font-bold text-secondary">5 regions</p>
                <p className="text-xs text-muted-foreground mt-1">Environmental context, Timestamps</p>
              </div>
            </div>

            {/* Blockchain Storage */}
            <div className="p-4 bg-muted/30 rounded-lg flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Thermometer className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Heatmap Hash Stored (Mock)</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Hash: e4f7a0b3c6d9e2f5a8b1c4d7e0f3a6b9c2d5e8f1a4b7c0d3e6f9a2b5c8d1e4f7
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  This heatmap analysis is cryptographically recorded and can be verified in court proceedings.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
