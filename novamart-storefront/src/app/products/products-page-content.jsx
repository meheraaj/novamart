'use client';

import { useProductsQuery } from '@framework/product/get-all-products';
import { LIMITS } from '@framework/utils/limits';
import { useSearchParams } from 'next/navigation';

export default function ProductsPageContent({ lang }) {
    const searchParams = useSearchParams();
    const queryString = searchParams.toString();
    const newQuery = queryString ? `?${queryString}` : '';

    const {
        isFetching: isLoading,
        isFetchingNextPage: loadingMore,
        fetchNextPage,
        hasNextPage,
        data,
        error,
    } = useProductsQuery({
        limit: LIMITS.PRODUCTS_LIMITS,
        newQuery,
    });

    return (
        <Container>
            {/* @ts-ignore */}
            <Element name="grid" className="flex pb-16 pt-7 lg:pt-11 lg:pb-20">
                <div className="sticky hidden h-full shrink-0 ltr:pr-8 rtl:pl-8 xl:ltr:pr-16 xl:rtl:pl-16 lg:block w-80 xl:w-96 top-16">
                    <ShopFilters lang={lang} />
                </div>
                <div className="w-full lg:ltr:-ml-4 lg:rtl:-mr-2 xl:ltr:-ml-8 xl:rtl:-mr-8 lg:-mt-1">
                    <SearchTopBar lang={lang} />
                    <ProductGrid
                        lang={lang}
                        data={data}
                        isLoading={isLoading}
                        error={error}
                        loadingMore={loadingMore}
                        fetchNextPage={fetchNextPage}
                        hasNextPage={hasNextPage}
                    />
                </div>
            </Element>
        </Container>
    );
}
