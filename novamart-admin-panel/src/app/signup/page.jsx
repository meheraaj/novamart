'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/form/input';
import Button from '@/components/ui/button';
import http from '@/lib/http';

export default function SignupPage() {
    const [name, setName] = useState('');
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
            const res = await http.post('/auth/register', { name, email, password, role: 'admin' });

            if (res.status === 200 || res.status === 201) {
                // Redirect to login after successful registration
                router.push('/login');
            } else {
                setError(res.data.message || 'Registration failed');
                setLoading(false);
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
                <h1 className="text-2xl font-bold text-brand-dark mb-6 text-center">Create Admin Account</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="John Doe"
                    />

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
                        Sign Up
                    </Button>
                </form>

                <div className="mt-4 text-center text-sm text-brand-muted">
                    Already have an account?{' '}
                    <Link href="/login" className="text-brand hover:underline">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
