import AddressGrid from '@components/address/address-grid';
import { useAddressQuery } from '@framework/address/address';

export default function AccountDetailsPage({ lang }) {
  let { data, isLoading, isError, error } = useAddressQuery();
  
  console.log('DEBUG_V3: Address Query Data:', data);
  console.log('DEBUG_V3: Address Query Loading:', isLoading);
  console.log('DEBUG_V3: Address Query Error:', error);

  if (isError) return <div>Error loading addresses: {error.message}</div>;

  // Normalize data: check if it's an array or wrapped in data property
  // If data is the array [ ... ], data.data is undefined.
  // If data is { data: [ ... ] }, data.data is the array.
  const addresses = Array.isArray(data) ? data : data?.data || [];

  return (
    <div className="pt-4">
      {!isLoading ? (
        <AddressGrid address={addresses} lang={lang} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
