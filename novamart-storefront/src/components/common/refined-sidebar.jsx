import cn from 'classnames';
import BannerCard from '@components/cards/banner-card';
import ProductFlashSaleCoral from '@components/product/product-cards/product-flash-sale-coral';
import { homeRefinedBanner as banner } from '@framework/static/banner';
import { useFlashSellProductsQuery } from '@framework/product/get-all-flash-sell-products';
import { LIMITS } from '@framework/utils/limits';
import { useTranslation } from 'src/app/i18n/client';
import { useWidgetQuery } from '@framework/widgets/get-widget';

const RefinedSidebar = ({ lang, className }) => {
    const { t } = useTranslation(lang, 'common');

    // Fetch dynamic widget settings
    const { data: widgetData, isLoading: isWidgetLoading } = useWidgetQuery('deals-of-week');

    // Backward compatibility or fallback: if no widget, maybe fall back to flash sales?
    // But for now, we assume widget exists.

    // Verify product exists in widget response
    const product = widgetData?.product;
    const expiryDate = widgetData?.settings?.expiryDate ? new Date(widgetData.settings.expiryDate).getTime() : Date.now() + 4000000 * 60;

    return (
        <div
            className={cn(
                'h-full w-full xl:w-[350px] 2xl:w-96 shrink-0 md:ltr:pl-5 md:rtl:pr-5 lg:ltr:pl-6 lg:rtl:pr-6 xl:ltr:pl-7 xl:rtl:pr-7 space-y-6 lg:space-y-8',
                className,
            )}
        >
            <div className="h-auto overflow-hidden border-2 border-yellow-200 rounded-md 3xl:h-full shadow-card">
                <h2 className="bg-yellow-200 text-center font-bold text-brand-dark font-manrope p-2.5 text-15px lg:text-base">
                    {widgetData?.title ? t(widgetData.title) : t('text-deals-of-the-week')}
                </h2>
                {isWidgetLoading ? (
                    <div className="p-4">Loading Deal...</div>
                ) : (
                    <ProductFlashSaleCoral
                        product={product}
                        date={expiryDate}
                        lang={lang}
                    />
                )}
            </div>

            <BannerCard banner={banner} className="hidden md:flex" lang={lang} />
        </div>
    );
};

export default RefinedSidebar;
