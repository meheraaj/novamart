'use client';

import { useEffect, useState } from 'react';
import Input from '@/components/ui/form/input';
import Button from '@/components/ui/button';
import http from '@/lib/http';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    // Form State
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        parent: '',
        image: null
    });

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

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                slug: category.slug,
                parent: '', // Complex to pre-fill if we don't have parent info easily, skipping for now
                image: null
            });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', slug: '', parent: '', image: null });
        }
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!formData.name) return;

        const data = new FormData();
        data.append('name', formData.name);
        if (formData.slug) data.append('slug', formData.slug);
        if (formData.parent) data.append('parent', formData.parent);
        if (formData.image) data.append('image', formData.image);

        try {
            let res;
            if (editingCategory) {
                res = await http.put(`/categories/${editingCategory._id || editingCategory.id}`, data);
            } else {
                res = await http.post('/categories', data);
            }

            if (res.status === 200 || res.status === 201) {
                fetchCategories();
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Failed to save category');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await http.delete(`/categories/${id}`);
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-brand-dark">Categories</h2>
                <Button onClick={() => handleOpenModal()}>
                    + Add Category
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow-card overflow-hidden border border-border-base">
                <table className="w-full text-left">
                    <thead className="bg-fill-base border-b border-border-base">
                        <tr>
                            <th className="p-4 font-semibold text-brand-muted">Image</th>
                            <th className="p-4 font-semibold text-brand-muted">Name</th>
                            <th className="p-4 font-semibold text-brand-muted">Slug</th>
                            <th className="p-4 font-semibold text-brand-muted">Products</th>
                            <th className="p-4 font-semibold text-brand-muted">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat._id} className="border-b border-border-base hover:bg-fill-secondary">
                                <td className="p-4">
                                    {cat.image?.thumbnail ? (
                                        <img src={cat.image.thumbnail} alt={cat.name} className="w-10 h-10 object-cover rounded" />
                                    ) : (
                                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">No Img</div>
                                    )}
                                </td>
                                <td className="p-4 text-brand-dark font-medium">{cat.name}</td>
                                <td className="p-4 text-brand-muted">{cat.slug}</td>
                                <td className="p-4">
                                    <span className="bg-brand-muted/10 text-brand-muted px-2 py-1 rounded-full text-xs font-semibold">
                                        {cat.productCount} Products
                                    </span>
                                </td>
                                <td className="p-4 flex gap-2">
                                    <button onClick={() => handleOpenModal(cat)} className="text-brand hover:text-brand-tree">
                                        <FiEdit />
                                    </button>
                                    <button onClick={() => handleDelete(cat._id || cat.id)} className="text-red-500 hover:text-red-700">
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-bold mb-4">{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-brand-dark mb-1">Name</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-brand-dark mb-1">Slug (Optional)</label>
                                <Input
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brand-dark mb-1">Parent Category</label>
                                <select 
                                    className="w-full border border-border-base rounded p-2 text-sm"
                                    value={formData.parent}
                                    onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                                >
                                    <option value="">None (Top Level)</option>
                                    {categories.filter(c => c._id !== editingCategory?._id).map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brand-dark mb-1">Image</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                    className="w-full text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <Button type="button" variant="border" onClick={() => setShowModal(false)}>
                                Cancel
                            </Button>
                            <Button type="button" onClick={handleSubmit}>
                                {editingCategory ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
