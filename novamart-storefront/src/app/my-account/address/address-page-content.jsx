'use client';

import AddressGrid from '@components/address/address-grid';
import { useAddressQuery } from '@framework/address/address';

export default function AddressPageContent({ lang }) {
    let { data, isLoading, isError, error } = useAddressQuery();

    if (isError) return <div>Error loading addresses: {error.message}</div>;

    // Normalize data: check if it's an array or wrapped in data property
    const addresses = Array.isArray(data) ? data : data?.data || [];

    return (
        <>
            {!isLoading ? (
                <AddressGrid address={addresses} lang={lang} />
            ) : (
                <div>Loading...</div>
            )}
        </>
    );
}
