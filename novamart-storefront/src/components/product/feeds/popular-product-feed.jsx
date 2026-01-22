'use client';

import { usePopularProductsQuery } from '@framework/product/get-all-popular-products';
import ProductsGridBlock from '@components/product/products-grid-block';
import { LIMITS } from '@framework/utils/limits';

const PopularProductFeed = ({
  lang,
  className,
  variant,
}) => {
  const limit = LIMITS.POPULAR_PRODUCTS_LIMITS;
  const { data, isLoading, error } = usePopularProductsQuery({
    limit: limit,
  });

  return (
    <ProductsGridBlock
      sectionHeading="text-popular-product"
      sectionSubHeading="text-fresh-grocery-items"
      className={className}
      products={data}
      loading={isLoading}
      error={error?.message}
      limit={limit}
      uniqueKey="popular-product"
      variant={variant}
      lang={lang}
    />
  );
};

export default PopularProductFeed;
