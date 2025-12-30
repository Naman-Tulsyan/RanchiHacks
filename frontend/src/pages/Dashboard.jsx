import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
    Upload, Shield, FileCheck, Clock, AlertCircle,
    CheckCircle2, ArrowRight, Eye, RefreshCw
} from 'lucide-react';
import { evidenceAPI } from '@/services/api';

const STATUS_BADGES = {
    registered: { label: 'Registered', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    in_analysis: { label: 'In Analysis', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    verified: { label: 'Verified', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
    transferred: { label: 'Transferred', className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    archived: { label: 'Archived', className: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
};

export default function Dashboard() {
    const navigate = useNavigate();
    const [evidence, setEvidence] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [error, setError] = useState('');

    // Upload form state
    const [file, setFile] = useState(null);
    const [caseId, setCaseId] = useState('');
    const [description, setDescription] = useState('');
    const [evidenceType, setEvidenceType] = useState('');
    const [notes, setNotes] = useState('');

    // Get current user
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        loadEvidence();
    }, []);

    const loadEvidence = async () => {
        try {
            setLoading(true);
            const data = await evidenceAPI.list();
            setEvidence(data);
        } catch (err) {
            // If no token or error, redirect to login
            if (err.response?.status === 401) {
                navigate('/login');
            } else {
                setError('Failed to load evidence');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        setError('');

        try {
            await evidenceAPI.upload(file, {
                case_id: caseId,
                description,
                evidence_type: evidenceType,
                notes,
            });

            // Reset form and reload
            setFile(null);
            setCaseId('');
            setDescription('');
            setEvidenceType('');
            setNotes('');
            setUploadOpen(false);
            loadEvidence();
        } catch (err) {
            setError(err.response?.data?.detail || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const canUpload = user.role === 'police' || user.role === 'forensic_lab';

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Evidence Dashboard</h1>
                    <p className="text-slate-400">Manage and track digital evidence chain-of-custody</p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={loadEvidence} variant="outline" className="border-slate-600 text-slate-300">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    {canUpload && (
                        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-gradient-to-r from-blue-600 to-cyan-500">
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Evidence
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="text-white">Upload New Evidence</DialogTitle>
                                    <DialogDescription className="text-slate-400">
                                        Upload evidence file with metadata. SHA-256 hash will be generated automatically.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleUpload} className="space-y-4 mt-4">
                                    {/* File Upload */}
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Evidence File</Label>
                                        <Input
                                            type="file"
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                            className="bg-slate-900/50 border-slate-600 text-white"
                                            required
                                        />
                                    </div>

                                    {/* Case ID */}
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Case ID</Label>
                                        <Input
                                            type="text"
                                            placeholder="e.g., CASE-2024-001"
                                            value={caseId}
                                            onChange={(e) => setCaseId(e.target.value)}
                                            className="bg-slate-900/50 border-slate-600 text-white"
                                            required
                                        />
                                    </div>

                                    {/* Evidence Type */}
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Evidence Type</Label>
                                        <Select value={evidenceType} onValueChange={setEvidenceType} required>
                                            <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-800 border-slate-600">
                                                <SelectItem value="document" className="text-white">Document</SelectItem>
                                                <SelectItem value="image" className="text-white">Image</SelectItem>
                                                <SelectItem value="video" className="text-white">Video</SelectItem>
                                                <SelectItem value="audio" className="text-white">Audio</SelectItem>
                                                <SelectItem value="digital_artifact" className="text-white">Digital Artifact</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Description</Label>
                                        <Textarea
                                            placeholder="Describe the evidence..."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="bg-slate-900/50 border-slate-600 text-white min-h-[80px]"
                                            required
                                        />
                                    </div>

                                    {/* Notes */}
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Notes (Optional)</Label>
                                        <Textarea
                                            placeholder="Additional notes..."
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            className="bg-slate-900/50 border-slate-600 text-white min-h-[60px]"
                                        />
                                    </div>

                                    {error && (
                                        <div className="p-3 rounded bg-red-500/20 border border-red-500/50">
                                            <p className="text-sm text-red-400">{error}</p>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-500"
                                        disabled={uploading || !file}
                                    >
                                        {uploading ? 'Uploading...' : 'Upload Evidence'}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-blue-500/20">
                            <Shield className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{evidence.length}</p>
                            <p className="text-sm text-slate-400">Total Evidence</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-green-500/20">
                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">
                                {evidence.filter(e => e.integrity_verified).length}
                            </p>
                            <p className="text-sm text-slate-400">Verified</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-purple-500/20">
                            <ArrowRight className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">
                                {evidence.filter(e => e.status === 'transferred').length}
                            </p>
                            <p className="text-sm text-slate-400">Transferred</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-amber-500/20">
                            <Clock className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">
                                {evidence.filter(e => e.custodian === user.role).length}
                            </p>
                            <p className="text-sm text-slate-400">In My Custody</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Evidence List */}
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white">Evidence Records</CardTitle>
                    <CardDescription className="text-slate-400">
                        Click on any evidence to view details and chain-of-custody
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">
                            <RefreshCw className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-2" />
                            <p className="text-slate-400">Loading evidence...</p>
                        </div>
                    ) : evidence.length === 0 ? (
                        <div className="text-center py-8">
                            <FileCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                            <p className="text-slate-400">No evidence records yet</p>
                            {canUpload && (
                                <p className="text-sm text-slate-500 mt-1">
                                    Click "Upload Evidence" to add your first record
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {evidence.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => navigate(`/evidence/${item.id}`)}
                                    className="p-4 rounded-lg bg-slate-900/50 border border-slate-700 hover:border-blue-500/50 cursor-pointer transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-lg bg-slate-800">
                                                <FileCheck className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-white">{item.id}</span>
                                                    <Badge variant="outline" className={STATUS_BADGES[item.status]?.className}>
                                                        {STATUS_BADGES[item.status]?.label || item.status}
                                                    </Badge>
                                                    {item.integrity_verified && (
                                                        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                                            Verified
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-400 mt-1">{item.description}</p>
                                                <div className="flex gap-4 mt-2 text-xs text-slate-500">
                                                    <span>Case: {item.case_id}</span>
                                                    <span>Type: {item.evidence_type}</span>
                                                    <span>Size: {formatFileSize(item.file_size)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-slate-300">Custodian: {item.custodian_name}</p>
                                            <p className="text-xs text-slate-500">{formatDate(item.created_at)}</p>
                                            <Button variant="ghost" size="sm" className="mt-2 text-blue-400 hover:text-blue-300">
                                                <Eye className="w-4 h-4 mr-1" />
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
