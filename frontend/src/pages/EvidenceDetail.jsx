import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    ArrowLeft, Shield, FileCheck, Clock, CheckCircle2, XCircle,
    ArrowRightLeft, RefreshCw, Link2, User, Building2, Hash
} from 'lucide-react';
import { evidenceAPI } from '@/services/api';

const STATUS_BADGES = {
    registered: { label: 'Registered', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    in_analysis: { label: 'In Analysis', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    verified: { label: 'Verified', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
    transferred: { label: 'Transferred', className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    archived: { label: 'Archived', className: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
};

const ROLES = [
    { value: 'police', label: 'Police Officer' },
    { value: 'forensic_lab', label: 'Forensic Lab' },
    { value: 'prosecutor', label: 'Prosecutor' },
    { value: 'judge', label: 'Judge' },
];

export default function EvidenceDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [evidence, setEvidence] = useState(null);
    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [transferring, setTransferring] = useState(false);
    const [verificationResult, setVerificationResult] = useState(null);
    const [transferOpen, setTransferOpen] = useState(false);
    const [error, setError] = useState('');

    // Transfer form state
    const [toRole, setToRole] = useState('');
    const [toName, setToName] = useState('');
    const [reason, setReason] = useState('');
    const [transferNotes, setTransferNotes] = useState('');

    // Get current user
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        loadEvidence();
    }, [id]);

    const loadEvidence = async () => {
        try {
            setLoading(true);
            const [evidenceData, historyData] = await Promise.all([
                evidenceAPI.get(id),
                evidenceAPI.getHistory(id),
            ]);
            setEvidence(evidenceData);
            setHistory(historyData);
        } catch (err) {
            if (err.response?.status === 404) {
                setError('Evidence not found');
            } else if (err.response?.status === 401) {
                navigate('/login');
            } else {
                setError('Failed to load evidence');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        setVerifying(true);
        setVerificationResult(null);
        try {
            const result = await evidenceAPI.verify(id);
            setVerificationResult(result);
            loadEvidence(); // Reload to update status
        } catch (err) {
            setVerificationResult({
                verified: false,
                message: err.response?.data?.detail || 'Verification failed'
            });
        } finally {
            setVerifying(false);
        }
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        setTransferring(true);
        setError('');
        try {
            await evidenceAPI.transfer(id, {
                to_role: toRole,
                to_name: toName,
                reason: reason,
                notes: transferNotes,
            });
            setTransferOpen(false);
            setToRole('');
            setToName('');
            setReason('');
            setTransferNotes('');
            loadEvidence();
        } catch (err) {
            setError(err.response?.data?.detail || 'Transfer failed');
        } finally {
            setTransferring(false);
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const canTransfer = evidence?.custodian === user.role;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <RefreshCw className="w-8 h-8 text-slate-400 animate-spin" />
            </div>
        );
    }

    if (error && !evidence) {
        return (
            <div className="text-center py-16">
                <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <p className="text-xl text-white mb-2">{error}</p>
                <Button onClick={() => navigate('/')} variant="outline" className="mt-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button onClick={() => navigate('/')} variant="ghost" className="text-slate-400">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-white">{evidence.id}</h1>
                        <Badge variant="outline" className={STATUS_BADGES[evidence.status]?.className}>
                            {STATUS_BADGES[evidence.status]?.label || evidence.status}
                        </Badge>
                    </div>
                    <p className="text-slate-400">{evidence.description}</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleVerify} disabled={verifying} variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/10">
                        {verifying ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                        Verify Integrity
                    </Button>
                    {canTransfer && (
                        <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-gradient-to-r from-purple-600 to-pink-500">
                                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                                    Transfer Custody
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-800 border-slate-700">
                                <DialogHeader>
                                    <DialogTitle className="text-white">Transfer Custody</DialogTitle>
                                    <DialogDescription className="text-slate-400">
                                        Transfer evidence custody to another authorized party. This action is recorded on blockchain.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleTransfer} className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Transfer To (Role)</Label>
                                        <Select value={toRole} onValueChange={setToRole} required>
                                            <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-800 border-slate-600">
                                                {ROLES.filter(r => r.value !== user.role).map((r) => (
                                                    <SelectItem key={r.value} value={r.value} className="text-white">
                                                        {r.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Recipient Name</Label>
                                        <Input
                                            placeholder="Full name of recipient"
                                            value={toName}
                                            onChange={(e) => setToName(e.target.value)}
                                            className="bg-slate-900/50 border-slate-600 text-white"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Reason for Transfer</Label>
                                        <Textarea
                                            placeholder="Explain why custody is being transferred..."
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            className="bg-slate-900/50 border-slate-600 text-white"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Additional Notes</Label>
                                        <Textarea
                                            placeholder="Optional notes..."
                                            value={transferNotes}
                                            onChange={(e) => setTransferNotes(e.target.value)}
                                            className="bg-slate-900/50 border-slate-600 text-white"
                                        />
                                    </div>
                                    {error && (
                                        <div className="p-3 rounded bg-red-500/20 border border-red-500/50">
                                            <p className="text-sm text-red-400">{error}</p>
                                        </div>
                                    )}
                                    <DialogFooter>
                                        <Button type="submit" disabled={transferring} className="bg-gradient-to-r from-purple-600 to-pink-500">
                                            {transferring ? 'Transferring...' : 'Confirm Transfer'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>

            {/* Verification Result */}
            {verificationResult && (
                <Card className={`border ${verificationResult.verified ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                    <CardContent className="p-4 flex items-center gap-4">
                        {verificationResult.verified ? (
                            <CheckCircle2 className="w-8 h-8 text-green-400" />
                        ) : (
                            <XCircle className="w-8 h-8 text-red-400" />
                        )}
                        <div>
                            <p className={`font-medium ${verificationResult.verified ? 'text-green-400' : 'text-red-400'}`}>
                                {verificationResult.message}
                            </p>
                            {verificationResult.tx_hash && (
                                <p className="text-sm text-slate-400 mt-1">
                                    Transaction: {verificationResult.tx_hash}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Evidence Info Card */}
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <FileCheck className="w-5 h-5 text-blue-400" />
                                Evidence Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-slate-400 text-xs">Case ID</Label>
                                    <p className="text-white font-mono">{evidence.case_id}</p>
                                </div>
                                <div>
                                    <Label className="text-slate-400 text-xs">Evidence Type</Label>
                                    <p className="text-white capitalize">{evidence.evidence_type}</p>
                                </div>
                                <div>
                                    <Label className="text-slate-400 text-xs">Original Filename</Label>
                                    <p className="text-white">{evidence.original_filename}</p>
                                </div>
                                <div>
                                    <Label className="text-slate-400 text-xs">File Size</Label>
                                    <p className="text-white">{formatFileSize(evidence.file_size)}</p>
                                </div>
                            </div>
                            <Separator className="bg-slate-700" />
                            <div>
                                <Label className="text-slate-400 text-xs flex items-center gap-1">
                                    <Hash className="w-3 h-3" /> SHA-256 Hash
                                </Label>
                                <p className="text-cyan-400 font-mono text-sm break-all mt-1">{evidence.file_hash}</p>
                            </div>
                            {evidence.notes && (
                                <>
                                    <Separator className="bg-slate-700" />
                                    <div>
                                        <Label className="text-slate-400 text-xs">Notes</Label>
                                        <p className="text-slate-300 mt-1">{evidence.notes}</p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Chain of Custody Timeline */}
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Clock className="w-5 h-5 text-purple-400" />
                                Chain of Custody Timeline
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Complete audit trail of all custody events
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {history?.timeline?.length > 0 ? (
                                <div className="relative">
                                    <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-700" />
                                    <div className="space-y-4">
                                        {history.timeline.map((event, index) => (
                                            <div key={index} className="relative pl-10">
                                                <div className={`absolute left-2 w-5 h-5 rounded-full border-2 ${event.event === 'created' ? 'bg-blue-500 border-blue-400' :
                                                        event.event === 'transferred' ? 'bg-purple-500 border-purple-400' :
                                                            event.event === 'verified' ? 'bg-green-500 border-green-400' :
                                                                'bg-slate-500 border-slate-400'
                                                    }`} />
                                                <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <Badge variant="outline" className="mb-2 capitalize">
                                                                {event.event}
                                                            </Badge>
                                                            <p className="text-white text-sm">
                                                                <span className="text-slate-400">By:</span> {event.actor_name || event.actor_role}
                                                            </p>
                                                            {event.details && (
                                                                <p className="text-slate-400 text-sm mt-1">{event.details}</p>
                                                            )}
                                                        </div>
                                                        <span className="text-xs text-slate-500">
                                                            {formatDate(event.timestamp)}
                                                        </span>
                                                    </div>
                                                    {event.blockchain_tx && (
                                                        <div className="mt-2 flex items-center gap-1 text-xs text-cyan-400">
                                                            <Link2 className="w-3 h-3" />
                                                            <span className="font-mono truncate">{event.blockchain_tx}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center text-slate-400 py-4">No custody events recorded</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Status Cards */}
                <div className="space-y-6">
                    {/* Current Custodian */}
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-white text-sm flex items-center gap-2">
                                <User className="w-4 h-4 text-amber-400" />
                                Current Custodian
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-semibold text-white">{evidence.custodian_name}</p>
                            <Badge variant="outline" className="mt-2 capitalize">
                                {evidence.custodian.replace('_', ' ')}
                            </Badge>
                        </CardContent>
                    </Card>

                    {/* Integrity Status */}
                    <Card className={`border ${evidence.integrity_verified ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-white text-sm flex items-center gap-2">
                                <Shield className="w-4 h-4 text-green-400" />
                                Integrity Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                {evidence.integrity_verified ? (
                                    <>
                                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                                        <span className="text-green-400 font-medium">Verified</span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-6 h-6 text-red-400" />
                                        <span className="text-red-400 font-medium">Unverified</span>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Blockchain Badge */}
                    <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-white text-sm flex items-center gap-2">
                                <Link2 className="w-4 h-4 text-cyan-400" />
                                Blockchain Record
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {evidence.blockchain_tx ? (
                                <>
                                    <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        On-Chain
                                    </Badge>
                                    <p className="text-xs font-mono text-cyan-400 mt-2 break-all">
                                        {evidence.blockchain_tx}
                                    </p>
                                </>
                            ) : (
                                <Badge variant="outline" className="text-slate-400">
                                    Pending
                                </Badge>
                            )}
                        </CardContent>
                    </Card>

                    {/* Timestamps */}
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-white text-sm flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-400" />
                                Timestamps
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <Label className="text-slate-500 text-xs">Created</Label>
                                <p className="text-slate-300 text-sm">{formatDate(evidence.created_at)}</p>
                            </div>
                            <div>
                                <Label className="text-slate-500 text-xs">Last Updated</Label>
                                <p className="text-slate-300 text-sm">{formatDate(evidence.updated_at)}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
