'use client';

import { useEffect, useState } from 'react';
import Input from '@/components/ui/form/input';
import Button from '@/components/ui/button';
import http from '@/lib/http';

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showModal, setShowModal] = useState(false);


    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await http.get('/categories');
            const data = res.data;
            setCategories(Array.isArray(data) ? data : data.data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName) return;
        try {
            const res = await http.post('/categories', { name: newCategoryName });
            if (res.status === 200 || res.status === 201) {
                fetchCategories(); // Refresh list
                setNewCategoryName('');
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-brand-dark">Categories</h2>
                <Button onClick={() => setShowModal(true)}>
                    + Add Category
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow-card overflow-hidden border border-border-base">
                <table className="w-full text-left">
                    <thead className="bg-fill-base border-b border-border-base">
                        <tr>
                            <th className="p-4 font-semibold text-brand-muted">ID</th>
                            <th className="p-4 font-semibold text-brand-muted">Name</th>
                            <th className="p-4 font-semibold text-brand-muted">Slug</th>
                            <th className="p-4 font-semibold text-brand-muted">Products</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat._id} className="border-b border-border-base hover:bg-fill-secondary">
                                <td className="p-4 font-medium text-brand-dark">#{cat.id}</td>
                                <td className="p-4 text-brand-dark font-medium">{cat.name}</td>
                                <td className="p-4 text-brand-muted">{cat.slug}</td>
                                <td className="p-4">
                                    <span className="bg-brand-muted/10 text-brand-muted px-2 py-1 rounded-full text-xs font-semibold">
                                        {cat.productCount} Products
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-bold mb-4">Add New Category</h3>
                        <Input
                            label="Category Name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="mb-4"
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <Button type="button" variant="border" onClick={() => setShowModal(false)}>
                                Cancel
                            </Button>
                            <Button type="button" onClick={handleCreateCategory}>
                                Create
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
