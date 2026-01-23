'use client';

import { useEffect, useState } from 'react';
import http from '@/lib/http';
import Button from '@/components/ui/button';

export default function WidgetsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [widget, setWidget] = useState({
        title: 'Deals of the Week',
        settings: {
            targetProductId: '',
            expiryDate: ''
        }
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, widgetRes] = await Promise.all([
                http.get('/products?limit=1000'),
                http.get('/widgets/deals-of-week').catch(() => ({ data: null }))
            ]);

            const prodData = prodRes.data;
            const productsArray = prodData.data || (Array.isArray(prodData) ? prodData : []);
            setProducts(productsArray);

            if (widgetRes.data) {
                const w = widgetRes.data;
                setWidget({
                    title: w.title || 'Deals of the Week',
                    settings: {
                        targetProductId: w.settings?.targetProductId || '',
                        expiryDate: w.settings?.expiryDate ? new Date(w.settings.expiryDate).toISOString().slice(0, 16) : ''
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await http.post('/widgets/deals-of-week', {
                slug: 'deals-of-week',
                title: widget.title,
                settings: {
                    targetProductId: widget.settings.targetProductId,
                    expiryDate: new Date(widget.settings.expiryDate)
                },
                isActive: true
            });
            alert('Widget updated successfully!');
        } catch (error) {
            console.error('Error saving widget:', error);
            alert('Failed to save widget settings.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl">
            <h2 className="text-3xl font-bold text-brand-dark mb-8">Widget Management</h2>

            <div className="bg-white rounded-lg shadow-card border border-border-base p-6 mb-6">
                <h3 className="text-lg font-semibold text-brand-dark mb-4 border-b pb-2">Deal of the Week</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-brand-muted">Widget Title</label>
                        <input
                            type="text"
                            value={widget.title}
                            onChange={(e) => setWidget({ ...widget, title: e.target.value })}
                            className="py-2 px-4 border border-border-base rounded-md text-sm focus:ring-brand focus:border-brand"
                            placeholder="e.g. Deals of the Week"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-brand-muted">Target Product</label>
                        <select
                            value={widget.settings.targetProductId}
                            onChange={(e) => setWidget({ ...widget, settings: { ...widget.settings, targetProductId: e.target.value } })}
                            className="py-2 px-4 border border-border-base rounded-md text-sm focus:ring-brand focus:border-brand"
                        >
                            <option value="">Select a Product</option>
                            {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name} (ID: {p.id})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-brand-muted">Expiry Date & Time</label>
                        <input
                            type="datetime-local"
                            value={widget.settings.expiryDate}
                            onChange={(e) => setWidget({ ...widget, settings: { ...widget.settings, expiryDate: e.target.value } })}
                            className="py-2 px-4 border border-border-base rounded-md text-sm focus:ring-brand focus:border-brand"
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <Button
                        onClick={handleSave}
                        loading={saving}
                        disabled={saving}
                        className="w-full sm:w-auto"
                    >
                        Save Configuration
                    </Button>
                </div>
            </div>

            <div className="bg-fill-base p-4 rounded-md border border-border-base border-dashed">
                <p className="text-sm text-brand-muted italic text-center">
                    Note: These changes will reflect immediately on the storefront homepage after saving.
                </p>
            </div>
        </div>
    );
}
