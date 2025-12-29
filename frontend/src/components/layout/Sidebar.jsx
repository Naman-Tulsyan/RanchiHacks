import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Camera, Database, Brain, ShieldCheck, Thermometer, 
  Eye, Link as LinkIcon, Globe, FileText, 
  Scale, Archive, Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const navItems = [
  { path: '/capture', icon: Camera, label: 'Capture Evidence', step: 0 },
  { path: '/malkhana', icon: Database, label: 'Digital Malkhana', step: 1 },
  { path: '/triage', icon: Brain, label: 'AI Triage', step: 2 },
  { path: '/authenticity', icon: ShieldCheck, label: 'Authenticity Check', step: 3 },
  { path: '/heatmaps', icon: Thermometer, label: 'Visual Heatmaps', step: 4 },
  { path: '/privacy', icon: Eye, label: 'Privacy & Redaction', step: 5 },
  { path: '/custody', icon: LinkIcon, label: 'Chain of Custody', step: 6 },
  { path: '/sharing', icon: Globe, label: 'Cross-Border Sharing', step: 7 },
  { path: '/certificate', icon: FileText, label: 'Legal Certificate', step: 8 },
  { path: '/courtroom', icon: Scale, label: 'Courtroom', step: 9 },
  { path: '/closure', icon: Archive, label: 'Retention & Closure', step: 10 },
];

export default function Sidebar({ currentStep, setCurrentStep }) {
  const location = useLocation();

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
            <ShieldCheck className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gradient-primary">ForensiChain AI</h1>
            <p className="text-[10px] text-muted-foreground">Evidence Console</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/capture');
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setCurrentStep(item.step)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-accent text-accent-foreground border border-primary/30 shadow-glow'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive && 'text-primary')} />
                <span className="flex-1">{item.label}</span>
                {currentStep > item.step && (
                  <div className="w-2 h-2 rounded-full bg-secondary shadow-glow-green" />
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Officer: DCP-2847</p>
          <p className="text-[10px]">Session: Active • Secure</p>
        </div>
      </div>
    </div>
  );
}
