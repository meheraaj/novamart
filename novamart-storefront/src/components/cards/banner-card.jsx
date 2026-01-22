'use client';

import Link from '@components/ui/link';
import Image from 'next/image';
import useWindowSize from '@utils/use-window-size';
import cn from 'classnames';

function getImage(deviceWidth, imgObj) {
  return deviceWidth < 480 ? imgObj.mobile : imgObj.desktop;
}

const BannerCard = ({
  lang,
  banner,
  className,
  variant = 'default',
  effectActive = true,
  classNameInner,
}) => {
  const { width } = useWindowSize();
  const { slug, title, image } = banner;
  const selectedImage = getImage(width, image);
  return (
    <div className={cn('mx-auto', className)}>
      <Link
        href={`${slug}`}
        className={cn(
          'h-full group flex justify-center relative overflow-hidden',
          classNameInner,
        )}
      >
        <Image
          src={selectedImage.url}
          width={selectedImage.width}
          height={selectedImage.height}
          alt={title}
          quality={100}
          priority
          className={cn('bg-fill-thumbnail object-cover w-full', {
            'rounded-md': variant === 'rounded',
          })}
        />
        {effectActive && (
          <div className="absolute top-0 block w-1/2 h-full transform -skew-x-12 ltr:-left-full rtl:-right-full z-5 bg-gradient-to-r from-transparent to-white opacity-30 group-hover:animate-shine" />
        )}
      </Link>
    </div>
  );
};

export default BannerCard;