'use client';

import { useState, useEffect } from 'react';
import { useWishlistProductsQuery } from '@framework/product/get-wishlist-product';
import Button from '@components/ui/button';
import Counter from '@components/ui/counter';
import { useParams } from 'next/navigation';
import { ROUTES } from '@utils/routes';
import useWindowSize from '@utils/use-window-size';
import { useProductQuery } from '@framework/product/get-product';
import { getVariations } from '@framework/utils/get-variations';
import usePrice from '@framework/product/use-price';
import { useWishlistMutation } from '@framework/product/use-wishlist-mutation';
import { useCart } from '@contexts/cart/cart.context';
import { generateCartItem } from '@utils/generate-cart-item';
import ProductAttributes from '@components/product/product-attributes';
import isEmpty from 'lodash/isEmpty';
import { toast } from 'react-toastify';
import ThumbnailCarousel from '@components/ui/carousel/thumbnail-carousel';
import Image from '@components/ui/image';
import CartIcon from '@components/icons/cart-icon';
import { IoIosHeart, IoIosHeartEmpty } from 'react-icons/io';
import TagLabel from '@components/ui/tag-label';
import LabelIcon from '@components/icons/label-icon';
import { IoArrowRedoOutline } from 'react-icons/io5';
import SocialShareBox from '@components/ui/social-share-box';
import ProductDetailsTab from '@components/product/product-details/product-tab';
import VariationPrice from './variation-price';
import isEqual from 'lodash/isEqual';
import { useTranslation } from 'src/app/i18n/client';

const ProductSingleDetails = ({ lang }) => {
  const { t } = useTranslation(lang, 'common');
  const pathname = useParams();
  const { slug } = pathname;
  const { width } = useWindowSize();
  const { data, isLoading } = useProductQuery(slug);
  const { addItemToCart, isInCart, getItemFromCart, isInStock } = useCart();
  const { data: wishlistData } = useWishlistProductsQuery();

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [attributes, setAttributes] = useState({});
  const [favorite, setFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addToCartLoader, setAddToCartLoader] = useState(false);
  const [addToWishlistLoader, setAddToWishlistLoader] = useState(false);
  const [shareButtonStatus, setShareButtonStatus] = useState(false);

  useEffect(() => {
    if (wishlistData && data?._id) {
      const isFavorite = wishlistData.some((item) => item.product_id === data._id);
      setFavorite(isFavorite);
    }
  }, [wishlistData, data]);

  const productUrl = `${process.env.NEXT_PUBLIC_WEBSITE_URL}${ROUTES.PRODUCT}/${pathname.slug}`;

  const { price, basePrice, discount } = usePrice(
    data && {
      amount: data.sale_price ? data.sale_price : data.price,
      baseAmount: data.price,
      currencyCode: 'BDT',
    }
  );

  const handleChange = () => {
    setShareButtonStatus(!shareButtonStatus);
  };

  if (isLoading) return <p>Loading...</p>;

  const variations = getVariations(data?.variations);

  const isSelected = !isEmpty(variations)
    ? !isEmpty(attributes) &&
      Object.keys(variations).every((variation) =>
        attributes.hasOwnProperty(variation)
      )
    : true;

  let selectedVariation = {};
  if (isSelected) {
    const dataVaiOption = data?.variation_options;
    selectedVariation = dataVaiOption?.find((o) =>
      isEqual(
        o.options.map((v) => v.value).sort(),
        Object.values(attributes).sort()
      )
    );
  }

  const item = generateCartItem(data, selectedVariation);
  const outOfStock = isInCart(item.id) && !isInStock(item.id);

  function addToCart() {
    if (!isSelected) return;
    setAddToCartLoader(true);
    setTimeout(() => {
      setAddToCartLoader(false);
    }, 1500);
    addItemToCart(item, selectedQuantity);
    toast(t('text-added-to-bag'), {
      progressClassName: 'fancy-progress-bar',
      position: width > 768 ? 'bottom-right' : 'top-right',
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  function addToWishlist() {
    setAddToWishlistLoader(true);
    setFavorite(!favorite);
    const toastStatus = favorite
      ? t('text-remove-favorite')
      : t('text-added-favorite');
    setTimeout(() => {
      setAddToWishlistLoader(false);
    }, 1500);
    toast(toastStatus, {
      progressClassName: 'fancy-progress-bar',
      position: width > 768 ? 'bottom-right' : 'top-right',
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  return (
    <div className="block grid-cols-9 gap-x-10 xl:gap-x-14 pt-7 pb-10 lg:grid lg:pb-14 2xl:pb-20 items-start">
      {width < 1025 ? (
        <div className="col-span-5 mb-6 overflow-hidden border rounded-md border-border-base md:mb-8 lg:mb-0">
          {!!data?.gallery?.length ? (
            <ThumbnailCarousel
              gallery={data?.gallery}
              thumbnailClassName="xl:w-[700px] 2xl:w-[900px]"
              galleryClassName="xl:w-[150px] 2xl:w-[170px]"
            />
          ) : (
            <div className="flex items-center justify-center w-auto">
              <Image
                src={data?.image?.original ?? '/product-placeholder.svg'}
                alt={data?.name}
                width={900}
                height={680}
                style={{ width: 'auto' }}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="col-span-5 mb-6 overflow-hidden border rounded-md border-border-base md:mb-8 lg:mb-0">
          {!!data?.gallery?.length ? (
            <ThumbnailCarousel
              gallery={data?.gallery}
              thumbnailClassName="xl:w-[700px] 2xl:w-[900px]"
              galleryClassName="xl:w-[150px] 2xl:w-[170px]"
            />
          ) : (
            <div className="flex items-center justify-center w-auto">
              <Image
                src={data?.image?.original ?? '/product-placeholder.svg'}
                alt={data?.name}
                width={900}
                height={680}
                style={{ width: 'auto' }}
              />
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col col-span-5 shrink-0 xl:col-span-4 xl:ltr:pl-2 xl:rtl:pr-2">
        <div className="pb-3 lg:pb-5">
          <div className="md:mb-2.5 block -mt-1.5">
            <h2 className="text-lg font-medium transition-colors duration-300 text-brand-dark md:text-xl xl:text-2xl">
              {data?.name}
            </h2>
          </div>
          {data?.unit && isEmpty(variations) ? (
            <div className="text-sm font-medium md:text-15px">
              {data?.unit}
            </div>
          ) : (
            <VariationPrice
              selectedVariation={selectedVariation}
              minPrice={data?.min_price}
              maxPrice={data?.max_price}
              lang={lang}
            />
          )}

          {isEmpty(variations) && (
            <div className="flex items-center mt-5">
              <div className="text-brand-dark font-bold text-base md:text-xl xl:text-[22px]">
                {price}
              </div>
              {discount && (
                <>
                  <del className="text-sm text-opacity-50 md:text-15px ltr:pl-3 rtl:pr-3 text-brand-dark ">
                    {basePrice}
                  </del>
                  <span className="inline-block rounded font-bold text-xs md:text-sm bg-brand-tree bg-opacity-20 text-brand-tree uppercase px-2 py-1 ltr:ml-2.5 rtl:mr-2.5">
                    {discount} {t('text-off')}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {Object.keys(variations).map((variation) => {
          return (
            <ProductAttributes
              key={`popup-attribute-key${variation}`}
              variations={variations}
              attributes={attributes}
              setAttributes={setAttributes}
            />
          );
        })}

        <div className="pb-2">
          {isEmpty(variations) && (
            <>
              {Number(quantity) > 0 || !outOfStock ? (
                <span className="text-sm font-medium text-yellow">
                  {t('text-only') +
                    ' ' +
                    quantity +
                    ' ' +
                    t('text-left-item')}
                </span>
              ) : (
                <div className="text-base text-red-500 whitespace-nowrap">
                  {t('text-out-stock')}
                </div>
              )}
            </>
          )}

          {!isEmpty(selectedVariation) && (
            <span className="text-sm font-medium text-yellow">
              {selectedVariation?.is_disable ||
              selectedVariation.quantity === 0
                ? t('text-out-stock')
                : `${
                    t('text-only') +
                    ' ' +
                    selectedVariation.quantity +
                    ' ' +
                    t('text-left-item')
                  }`}
            </span>
          )}
        </div>

        <div className="pt-1.5 lg:pt-3 xl:pt-4 space-y-2.5 md:space-y-3.5">
          <Counter
            variant="single"
            value={selectedQuantity}
            onIncrement={() => setSelectedQuantity((prev) => prev + 1)}
            onDecrement={() =>
              setSelectedQuantity((prev) => (prev !== 1 ? prev - 1 : 1))
            }
            disabled={
              isInCart(item.id)
                ? getItemFromCart(item.id).quantity + selectedQuantity >=
                  Number(item.stock)
                : selectedQuantity >= Number(item.stock)
            }
            lang={lang}
          />
          <Button
            onClick={addToCart}
            className="w-full px-1.5"
            disabled={!isSelected}
            loading={addToCartLoader}
          >
            <CartIcon color="#ffffff" className="ltr:mr-3 rtl:ml-3" />
            {t('text-add-to-cart')}
          </Button>
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              variant="border"
              onClick={addToWishlist}
              loading={addToWishlistLoader}
              className={`group hover:text-brand ${
                favorite === true && 'text-brand'
              }`}
            >
              {favorite === true ? (
                <IoIosHeart className="text-2xl md:text-[26px] ltr:mr-2 rtl:ml-2 transition-all" />
              ) : (
                <IoIosHeartEmpty className="text-2xl md:text-[26px] ltr:mr-2 rtl:ml-2 transition-all group-hover:text-brand" />
              )}

              {t('text-wishlist')}
            </Button>
            <div className="relative group">
              <Button
                variant="border"
                className={`w-full hover:text-brand ${
                  shareButtonStatus === true && 'text-brand'
                }`}
                onClick={handleChange}
              >
                <IoArrowRedoOutline className="text-2xl md:text-[26px] ltr:mr-2 rtl:ml-2 transition-all group-hover:text-brand" />
                {t('text-share')}
              </Button>
              <SocialShareBox
                className={`absolute z-10 ltr:right-0 rtl:left-0 w-75 md:min-w-100 transition-all duration-300 ${
                  shareButtonStatus === true
                    ? 'visible opacity-100 top-full'
                    : 'opacity-0 invisible top-[130%]'
                }`}
                shareUrl={productUrl}
                lang={lang}
              />
            </div>
          </div>
        </div>
        {data?.tag && (
          <ul className="pt-5 xl:pt-6">
            <li className="relative inline-flex items-center justify-center text-sm md:text-15px text-brand-dark text-opacity-80 ltr:mr-2 rtl:ml-2 top-1">
              <LabelIcon className="ltr:mr-2 rtl:ml-2" /> {t('text-tags')}:
            </li>
            {data?.tag?.map((item) => (
              <li className="inline-block p-0.75" key={`tag-${item.id}`}>
                <TagLabel data={item} />
              </li>
            ))}
          </ul>
        )}
      </div>
      <ProductDetailsTab lang={lang} />
    </div>
  );
};

export default ProductSingleDetails;
