import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Lock, User, Building2 } from 'lucide-react';
import { authAPI } from '@/services/api';

const ROLES = [
    { value: 'police', label: 'Police Officer', icon: Shield, color: 'text-blue-500' },
    { value: 'forensic_lab', label: 'Forensic Lab', icon: Building2, color: 'text-purple-500' },
    { value: 'prosecutor', label: 'Prosecutor', icon: User, color: 'text-amber-500' },
    { value: 'judge', label: 'Judge', icon: Lock, color: 'text-red-500' },
];

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.login(username, password, role);

            // Store token and user info
            localStorage.setItem('token', response.access_token);
            localStorage.setItem('user', JSON.stringify(response.user));

            // Navigate to dashboard
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Evidence Chain</h1>
                    <p className="text-slate-400">Digital Evidence Chain-of-Custody Platform</p>
                </div>

                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-white">Sign In</CardTitle>
                        <CardDescription className="text-slate-400">
                            Enter your credentials to access the platform
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            {/* Username */}
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-slate-300">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-300">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                                    required
                                />
                            </div>

                            {/* Role Selection */}
                            <div className="space-y-2">
                                <Label className="text-slate-300">Role</Label>
                                <Select value={role} onValueChange={setRole} required>
                                    <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                                        <SelectValue placeholder="Select your role" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-600">
                                        {ROLES.map((r) => (
                                            <SelectItem
                                                key={r.value}
                                                value={r.value}
                                                className="text-white hover:bg-slate-700"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <r.icon className={`w-4 h-4 ${r.color}`} />
                                                    {r.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-3 rounded bg-red-500/20 border border-red-500/50">
                                    <p className="text-sm text-red-400">{error}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                                disabled={loading || !role}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>

                            {/* Demo Credentials */}
                            <div className="mt-4 p-3 rounded bg-slate-700/50 border border-slate-600">
                                <p className="text-xs text-slate-400 text-center">
                                    Demo: Use any username with password <code className="text-cyan-400">demo123</code>
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
