'use client';

import { useEffect, useState } from 'react';
import http from '@/lib/http';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', isAdmin: false });

    const fetchUsers = async () => {
        try {
            const res = await http.get('/users');
            if (res.status === 200) {
                const data = res.data;
                setUsers(Array.isArray(data) ? data : []);
            } else {
                console.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (user) => {
        setEditingUser(user);
        setFormData({ name: user.name, email: user.email, isAdmin: user.isAdmin });
        setIsEditModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const res = await http.put(`/users/${editingUser._id}`, formData);
            if (res.status === 200) {
                // Update local state
                setUsers(users.map(u => u._id === editingUser._id ? res.data : u));
                setIsEditModalOpen(false);
                setEditingUser(null);
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-brand-dark">Users</h2>

            <div className="bg-white rounded-lg shadow-card overflow-hidden border border-border-base">
                <table className="w-full text-left">
                    <thead className="bg-fill-base border-b border-border-base">
                        <tr>
                            <th className="p-4 font-semibold text-brand-muted">Name</th>
                            <th className="p-4 font-semibold text-brand-muted">Email</th>
                            <th className="p-4 font-semibold text-brand-muted">Joined Date</th>
                            <th className="p-4 font-semibold text-brand-muted">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="border-b border-border-base hover:bg-fill-secondary">
                                <td className="p-4 font-medium text-brand-dark">{user.name}</td>
                                <td className="p-4 text-brand-muted">{user.email}</td>
                                <td className="p-4 text-brand-muted">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <button 
                                        onClick={() => handleEditClick(user)}
                                        className="text-brand hover:text-brand-tree"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Edit User</h3>
                        <form onSubmit={handleUpdateUser}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Password (Optional)</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password || ''}
                                    onChange={handleInputChange}
                                    placeholder="Leave blank to keep current password"
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                            </div>
                            <div className="mb-4 flex items-center">
                                <input
                                    type="checkbox"
                                    name="isAdmin"
                                    checked={formData.isAdmin}
                                    onChange={handleInputChange}
                                    className="mr-2"
                                />
                                <label className="text-sm font-medium">Is Admin</label>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-brand text-white rounded hover:bg-brand-dark"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
