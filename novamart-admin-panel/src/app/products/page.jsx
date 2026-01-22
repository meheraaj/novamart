'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import http from '@/lib/http';
import Button from '@/components/ui/button';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                http.get('/products?limit=1000'), // Fetch all products for client-side pagination
                http.get('/categories')
            ]);

            const prodData = prodRes.data;
            const catData = catRes.data;

            // Handle both paginated (new) and array (old) formats
            const productsArray = prodData.data || (Array.isArray(prodData) ? prodData : []);
            setProducts(productsArray);
            setCategories(Array.isArray(catData) ? catData : catData.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const res = await http.delete(`/products/${id}`);
            if (res.status === 200 || res.status === 204) {
                setProducts(products.filter((p) => p.id !== id));
            } else {
                alert('Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    // Filter Logic
    const filteredProducts = products.filter(p => {
        const matchesCategory = selectedCategory ? p.categories?.includes(selectedCategory) : true;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-brand-dark">Products</h2>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="py-2 px-4 border border-border-base rounded-md text-sm focus:ring-brand focus:border-brand w-full sm:w-64"
                    />
                    <select
                        value={selectedCategory}
                        onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                        className="py-2 px-4 border border-border-base rounded-md text-sm focus:ring-brand focus:border-brand w-full sm:w-auto"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <Link
                        href="/products/new"
                        className="bg-brand text-white px-4 py-2 rounded hover:bg-brand-tree transition-colors text-center whitespace-nowrap"
                    >
                        Add Product
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-card overflow-hidden border border-border-base">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-fill-base border-b border-border-base">
                            <tr>
                                <th className="p-4 font-semibold text-brand-muted">Image</th>
                                <th className="p-4 font-semibold text-brand-muted">Name</th>
                                <th className="p-4 font-semibold text-brand-muted">Price</th>
                                <th className="p-4 font-semibold text-brand-muted">Quantity</th>
                                <th className="p-4 font-semibold text-brand-muted">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedProducts.map((product) => (
                                <tr key={product.id} className="border-b border-border-base hover:bg-fill-secondary">
                                    <td className="p-4">
                                        {(product.image?.thumbnail || product.image) ? (
                                            <img
                                                src={product.image?.thumbnail || product.image}
                                                alt={product.name}
                                                className="w-10 h-10 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">No Img</div>
                                        )}
                                    </td>
                                    <td className="p-4 font-medium text-brand-dark">{product.name}</td>
                                    <td className="p-4 text-brand-muted">৳{product.price}</td>
                                    <td className="p-4 text-brand-muted">{product.quantity}</td>
                                    <td className="p-4">
                                        <div className="flex space-x-2">
                                            <Link
                                                href={`/products/${product.slug}`}
                                                className="text-brand hover:text-brand-tree"
                                            >
                                                Edit
                                            </Link>
                                            <Button
                                                onClick={() => handleDelete(product.id)}
                                                className="!h-auto !px-3 !py-1 text-xs bg-red-600 hover:bg-red-700 text-white"
                                                variant="primary"
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredProducts.length === 0 && (
                    <div className="p-8 text-center text-brand-muted">
                        No products found matching your search.
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-between items-center p-4 border-t border-border-base bg-fill-base">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border border-border-base rounded-md text-sm bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-brand-dark">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border border-border-base rounded-md text-sm bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
