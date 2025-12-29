import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const steps = [
  'Capture',
  'Ingestion',
  'Triage',
  'Authenticity',
  'Heatmaps',
  'Privacy',
  'Transfers',
  'Sharing',
  'Certificate',
  'Courtroom',
  'Closure'
];

export default function TopBar({ currentStep }) {
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
      {/* Progress Section */}
      <div className="flex-1 max-w-4xl">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-xs font-medium text-muted-foreground">Evidence Processing Pipeline</p>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
            Step {currentStep + 1}/{steps.length}
          </Badge>
        </div>
        <div className="space-y-1">
          <Progress value={progressPercentage} className="h-1.5" />
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span className="text-primary font-medium">{steps[currentStep]}</span>
            {currentStep < steps.length - 1 && (
              <>
                <span>→</span>
                <span className="opacity-60">{steps[currentStep + 1]}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-glow-green" />
          <span className="text-xs text-muted-foreground">Blockchain: Connected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-glow" />
          <span className="text-xs text-muted-foreground">AI: Online</span>
        </div>
      </div>
    </div>
  );
}
