'use client';

import BannerGridTwo from '@components/common/banner-grid-two';
import {
  bannerGridMediumTwo as bannersMedium,
  bannerDiscount,
} from '@framework/static/banner';
import BannerAllCarousel from '@components/common/banner-all-carousel';
import { useCategoriesQuery } from '@framework/category/get-all-categories';
import CategoryListCard from '@components/cards/category-list-card';
import { ROUTES } from '@utils/routes';
import { LIMITS } from '@framework/utils/limits';

const HeroBannerWithCategory = ({
  lang,
  className = 'mb-12 lg:mb-14 xl:mb-16 2xl:mb-20',
}) => {
  const { data } = useCategoriesQuery({
    limit: LIMITS.CATEGORIES_LIMITS,
  });

  return (
    <div className={`xl:flex md:pb-2.5 ${className}`}>
      {/* Category Sidebar - Hidden on mobile/tablet */}
      <div className="hidden xl:block shrink-0 ltr:pr-8 rtl:pl-8 xl:w-[320px] 2xl:w-92.5 pt-px">
        <div className="flex flex-col justify-between h-full border rounded-md border-[#E7ECF0]">
          {data?.categories?.data
            ?.slice(0, 10)
            ?.map((category) => (
              <CategoryListCard
                key={`category--key-${category.id}`}
                category={category}
                href={`${ROUTES.SEARCH}?category=${category.slug}`}
                className="transition border-b border-[#E7ECF0] last:border-b-0"
                variant="small"
                lang={lang}
              />
            ))}
        </div>
      </div>

      {/* Main Banner Content */}
      <div className="w-full trendy-main-content">
        <BannerGridTwo data={bannersMedium} lang={lang} />
        <BannerAllCarousel
          data={bannerDiscount}
          buttonSize="small"
          className="mb-0"
          lang={lang}
        />
      </div>
    </div>
  );
};

export default HeroBannerWithCategory;