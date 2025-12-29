import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Shield, User } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function PrivacyRedaction() {
  const [isRedacted, setIsRedacted] = useState(true);
  const [userRole, setUserRole] = useState('investigator'); // investigator or judge

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient-primary mb-2">Privacy & Reversible Redaction</h1>
        <p className="text-muted-foreground">Role-based access control with reversible privacy protection</p>
      </div>

      {/* Role & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Current Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button
                  variant={userRole === 'investigator' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUserRole('investigator')}
                  className={userRole === 'investigator' ? 'bg-primary' : ''}
                >
                  Investigator
                </Button>
                <Button
                  variant={userRole === 'judge' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUserRole('judge')}
                  className={userRole === 'judge' ? 'bg-secondary' : ''}
                >
                  Judge (Full Access)
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Role determines access level to unredacted content
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Redaction Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="redaction-toggle" className="text-sm font-medium">
                  {isRedacted ? 'Redacted View' : 'Original View'}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {userRole === 'judge' ? 'Full access granted' : 'Bystanders protected'}
                </p>
              </div>
              <Switch
                id="redaction-toggle"
                checked={!isRedacted}
                onCheckedChange={(checked) => setIsRedacted(!checked)}
                disabled={userRole !== 'judge'}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Access Alert */}
      {userRole === 'investigator' && !isRedacted && (
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            Only judges have permission to view unredacted evidence. Your current role (Investigator) restricts access to protect civilian privacy.
          </AlertDescription>
        </Alert>
      )}

      {/* Evidence Preview */}
      <Card className="border-border shadow-lg">
        <CardHeader>
          <CardTitle>Evidence Preview: Downtown Incident</CardTitle>
          <CardDescription>Frame 00:04:15 - Suspect and bystanders present</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50" />
            
            {/* Mock Video Frame with Redaction */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              {isRedacted ? (
                <div className="relative w-full h-full">
                  {/* Clear Suspect */}
                  <div className="absolute top-1/4 left-1/3 w-32 h-40 border-2 border-destructive rounded-lg flex items-center justify-center bg-card/50">
                    <div className="text-center">
                      <User className="w-12 h-12 mx-auto mb-2 text-destructive" />
                      <p className="text-xs font-medium text-destructive">Suspect</p>
                      <p className="text-[10px] text-muted-foreground">Visible</p>
                    </div>
                  </div>
                  
                  {/* Blurred Bystanders */}
                  <div 
                    className="absolute top-1/3 right-1/4 w-24 h-32 border-2 border-secondary rounded-lg bg-card/90"
                    style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
                  >
                    <div className="w-full h-full flex items-center justify-center backdrop-blur-xl bg-muted/70">
                      <div className="text-center">
                        <EyeOff className="w-8 h-8 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-[10px] text-muted-foreground">Bystander</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="absolute bottom-1/4 left-1/4 w-20 h-28 border-2 border-secondary rounded-lg bg-card/90"
                    style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
                  >
                    <div className="w-full h-full flex items-center justify-center backdrop-blur-xl bg-muted/70">
                      <div className="text-center">
                        <EyeOff className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-[10px] text-muted-foreground">Bystander</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Redaction Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-secondary/20 text-secondary border-secondary">
                      <EyeOff className="w-3 h-3 mr-1" />
                      Redacted (Mock)
                    </Badge>
                  </div>
                </div>
              ) : userRole === 'judge' ? (
                <div className="relative w-full h-full">
                  {/* All Clear */}
                  <div className="absolute top-1/4 left-1/3 w-32 h-40 border-2 border-destructive rounded-lg flex items-center justify-center bg-card/50">
                    <div className="text-center">
                      <User className="w-12 h-12 mx-auto mb-2 text-destructive" />
                      <p className="text-xs font-medium">Suspect</p>
                    </div>
                  </div>
                  
                  <div className="absolute top-1/3 right-1/4 w-24 h-32 border-2 border-primary rounded-lg flex items-center justify-center bg-card/50">
                    <div className="text-center">
                      <User className="w-8 h-8 mx-auto mb-1 text-primary" />
                      <p className="text-[10px]">Bystander 1</p>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-1/4 left-1/4 w-20 h-28 border-2 border-primary rounded-lg flex items-center justify-center bg-card/50">
                    <div className="text-center">
                      <User className="w-6 h-6 mx-auto mb-1 text-primary" />
                      <p className="text-[10px]">Bystander 2</p>
                    </div>
                  </div>
                  
                  {/* Original Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary/20 text-primary border-primary">
                      <Eye className="w-3 h-3 mr-1" />
                      Original (Judge Only - Mock)
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6">
                  <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Access Restricted</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Redaction Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Redaction Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Suspects Identified</span>
              <Badge variant="outline" className="border-destructive text-destructive">1 (Visible)</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Bystanders Detected</span>
              <Badge variant="outline" className="border-secondary text-secondary">2 (Protected)</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Redaction Method</span>
              <Badge variant="outline">Reversible Blur</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Access Log (Mock)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Access:</span>
                <span>Judge K. Sharma - 2024-01-15 10:30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Access Count:</span>
                <span>3 (All authorized)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Session:</span>
                <span className="text-secondary">Investigator View</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
