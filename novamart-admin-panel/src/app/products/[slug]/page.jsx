'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Input from '@/components/ui/form/input';
import Button from '@/components/ui/button';
import http from '@/lib/http';

export default function ProductFormPage() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug;

    const isEdit = slug !== 'new';

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        slug: '',
        price: 0,
        quantity: 0,
        description: '',
        categories: [], // Array of category IDs
    });

    // Separate state for files
    const [imageMain, setImageMain] = useState(null);
    const [imageGallery1, setImageGallery1] = useState(null);
    const [imageGallery2, setImageGallery2] = useState(null);

    const [categories, setCategories] = useState([]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        fetchCategories();
        if (isEdit) {
            fetchProduct();
        }
    }, [slug]);

    const fetchCategories = async () => {
        try {
            const res = await http.get('/categories');
            const data = res.data;
            // Handle both array and { data: [...] } format just in case
            setCategories(Array.isArray(data) ? data : data.data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProduct = async () => {
        try {
            const res = await http.get(`/products/${slug}`);
            if (res.status === 200) {
                const data = res.data;
                setFormData({
                    id: data.id,
                    name: data.name,
                    slug: data.slug,
                    price: data.price,
                    quantity: data.quantity,
                    description: data.description || '',
                    categories: data.categories ? data.categories.map((c) => c._id || c) : [],
                });
                // Note: We don't pre-fill file inputs for security reasons, 
                // but we could show existing images if we wanted to improve UI.
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isEdit
            ? `/products/${formData.id}`
            : '/products';

        const method = isEdit ? 'put' : 'post';

        // Create FormData
        const data = new FormData();
        data.append('id', formData.id);
        data.append('name', formData.name);
        data.append('slug', formData.slug);
        data.append('price', formData.price);
        data.append('quantity', formData.quantity);
        data.append('description', formData.description);
        
        // Append categories individually or as JSON string if backend expects it
        // Since backend uses req.body which is parsed by multer, simple fields are available.
        // But arrays in FormData can be tricky. Express/Multer handles repeated keys as array.
        formData.categories.forEach(cat => data.append('categories[]', cat));

        if (imageMain) data.append('image_main', imageMain);
        if (imageGallery1) data.append('image_gallery_1', imageGallery1);
        if (imageGallery2) data.append('image_gallery_2', imageGallery2);

        try {
            // Need to set content-type header to undefined so browser sets it with boundary
            // But our http lib might set application/json by default.
            // Let's assume http lib handles it or we use fetch directly if needed.
            // If http lib is axios wrapper:
            const res = await http[method](url, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === 200 || res.status === 201) {
                router.push('/products');
            } else {
                alert('Failed to save product');
            }
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName) return;
        try {
            const res = await http.post('/categories', { name: newCategoryName });
            if (res.status === 200 || res.status === 201) {
                const newCat = res.data;
                setCategories([...categories, newCat]);
                setNewCategoryName('');
                setShowCategoryModal(false);
                // Auto-select the new category
                setFormData(prev => ({ ...prev, categories: [...prev.categories, newCat._id] }));
            }
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-brand-dark">
                {isEdit ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-card border border-border-base space-y-4">
                {!isEdit && (
                    <Input
                        label="ID (Unique)"
                        name="id"
                        value={formData.id}
                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                        required
                    />
                )}

                <Input
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />

                <Input
                    label="Slug"
                    name="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                />

                {/* Image Uploads */}
                <div className="space-y-3 border p-4 rounded bg-gray-50">
                    <h3 className="font-semibold text-brand-dark">Images</h3>
                    
                    <div>
                        <label className="block text-sm font-medium text-brand-dark text-opacity-70 mb-1">Main Image</label>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => setImageMain(e.target.files[0])}
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-light file:text-brand hover:file:bg-brand-light/80"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-brand-dark text-opacity-70 mb-1">Gallery Image 1</label>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => setImageGallery1(e.target.files[0])}
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-light file:text-brand hover:file:bg-brand-light/80"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-brand-dark text-opacity-70 mb-1">Gallery Image 2</label>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => setImageGallery2(e.target.files[0])}
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-light file:text-brand hover:file:bg-brand-light/80"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        required
                    />
                    <Input
                        label="Quantity"
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-brand-dark text-opacity-70 mb-3">Category</label>
                    <div className="flex gap-2">
                        <select
                            multiple
                            value={formData.categories}
                            onChange={(e) => {
                                const selected = Array.from(e.target.selectedOptions, option => option.value);
                                setFormData({ ...formData, categories: selected });
                            }}
                            className="py-2 px-4 w-full appearance-none transition duration-150 ease-in-out border text-input text-13px lg:text-sm font-body rounded placeholder-[#B3B3B3] min-h-12 transition duration-200 ease-in-out text-brand-dark focus:ring-0 bg-gray-100 border-gray-300 focus:shadow focus:text-brand-dark focus:border-brand"
                        >
                            {categories.map((cat) => (
                                <option key={cat._id || cat.id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <Button type="button" onClick={() => setShowCategoryModal(true)} className="whitespace-nowrap">
                            + New
                        </Button>
                    </div>
                    <p className="text-xs text-brand-muted mt-1">Hold Ctrl/Cmd to select multiple</p>
                </div>

                {showCategoryModal && (
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
                                <Button type="button" variant="border" onClick={() => setShowCategoryModal(false)}>
                                    Cancel
                                </Button>
                                <Button type="button" onClick={handleCreateCategory}>
                                    Create
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-brand-dark text-opacity-70 mb-3">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="py-2 px-4 w-full appearance-none transition duration-150 ease-in-out border text-input text-13px lg:text-sm font-body rounded placeholder-[#B3B3B3] min-h-12 transition duration-200 ease-in-out text-brand-dark focus:ring-0 bg-gray-100 border-gray-300 focus:shadow focus:text-brand-dark focus:border-brand h-32"
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        variant="formButton"
                    >
                        Save Product
                    </Button>
                </div>
            </form>
        </div>
    );
}
