'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/form/input';
import Button from '@/components/ui/button';
import http from '@/lib/http';
import { setToken } from '@/lib/auth';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await http.post('/auth/login', { email, password });
            const data = res.data;

            if (res.status === 200) {
                // Store token in cookie
                setToken(data.accessToken);

                // Also store user info if needed
                localStorage.setItem('user', JSON.stringify(data));

                if (data.role === 'admin') {
                    router.push('/');
                } else {
                    setError('You are not authorized to access the admin panel.');
                    setLoading(false);
                }
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Something went wrong');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-fill-base">
            <div className="bg-white p-8 rounded-lg shadow-card w-full max-w-md border border-border-base">
                <h1 className="text-2xl font-bold text-brand-dark mb-6 text-center">NovaMart Admin Login</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="admin@example.com"
                    />

                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        loading={loading}
                    >
                        Login
                    </Button>
                </form>
            </div>
        </div>
    );
}
