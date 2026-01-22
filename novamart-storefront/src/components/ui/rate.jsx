import React, { forwardRef } from 'react';
import RcRate from 'rc-rate';
import cn from 'classnames';
import StarIcon from '@components/icons/star-icon';

const labelClasses = {
    size: {
        sm: 'text-xs mb-1',
        DEFAULT: 'text-sm mb-1.5',
        lg: 'text-sm mb-1.5',
        xl: 'text-base mb-2',
    },
};

const rateClasses = {
    base: 'flex items-center [&>li]:cursor-pointer [&.rc-rate-disabled>li]:cursor-default [&>li]:relative [&>li]:mr-0.5 rtl:[&>li]:ml-0.5 [&>li]:inline-block text-gray-200',
    size: {
        sm: 'h-5 w-5',
        DEFAULT: 'h-4. w-6',
        lg: 'h-7 w-5',
        xl: 'h-8 w-8',
    },
    firstStar:
        '[&>li>div>.rc-rate-star-first]:absolute [&>li>div>.rc-rate-star-first]:left-0 rtl:[&>li>div>.rc-rate-star-first]:right-0 [&>li>div>.rc-rate-star-first]:top-0 [&>li>div>.rc-rate-star-first]:w-1/2 [&>li>div>.rc-rate-star-first]:h-full [&>li>div>.rc-rate-star-first]:overflow-hidden',
    color:
        '[&>.rc-rate-star-half>div>.rc-rate-star-first]:text-orange-light [&>.rc-rate-star-full>div]:text-orange-light',
    transition:
        '[&>li>div]:transition-all [&>li>div]:duration-300 [&>.rc-rate-star:hover]:scale-110',
};

const Rate = forwardRef(
    (
        {
            size = 'DEFAULT',
            disabled = false,
            character = <StarIcon className="w-4" />,
            label,
            tooltips,
            error,
            helperText,
            labelClassName,
            characterClassName,
            errorClassName,
            helperClassName,
            rateClassName,
            className,
            ...props
        },
        ref,
    ) => {
        return (
            <div className={cn('aegon-rate', className)}>
                {label && (
                    <div className={cn('block', labelClasses.size[size], labelClassName)}>
                        {label}
                    </div>
                )}
                <RcRate
                    ref={ref}
                    disabled={disabled}
                    character={({ index }) => (
                        <div
                            className={cn(
                                '[&>svg]:fill-current',
                                rateClasses.size[size],
                                characterClassName,
                            )}
                        >
                            {Array.isArray(character)
                                ? character[index]
                                : character}
                        </div>
                    )}
                    className={cn(
                        rateClasses.base,
                        rateClasses.firstStar,
                        rateClasses.color,
                        !disabled && rateClasses.transition,
                        rateClassName,
                    )}
                    {...props}
                />
            </div>
        );
    },
);

Rate.displayName = 'Rate';
export default Rate;
