'use client';

import { useState } from 'react';
import Button from '@components/ui/button';
import Heading from '@components/ui/heading';
import Contact from '@components/contact/contact';
import DeliveryAddresses from '@components/address/delivery-addresses';
import DeliveryNotes from './delivery-instruction';
import DeliverySchedule from './schedule';
import DeliveryTips from './delivery-tips';
// import StripeCheckoutInlineForm from './stripe-checkout-inline-form';
import { useTranslation } from 'src/app/i18n/client';
import { useIsMounted } from '@utils/use-is-mounted';

const CheckoutDetails = ({ lang }) => {
    const { t } = useTranslation(lang, 'common');
    const [bindIndex, setBindIndex] = useState(0);
    const data = [
        {
            id: 1,
            title: 'text-delivery-address',
            component: <DeliveryAddresses lang={lang} />, // Replaced Address with DeliveryAddresses
        },
        {
            id: 2,
            title: 'text-delivery-schedule',
            component: <DeliverySchedule lang={lang} />,
        },
        {
            id: 3,
            title: 'text-contact-number',
            component: <Contact lang={lang} />,
        },
        // {
        //     id: 4,
        //     title: 'text-payment-option',
        //     component: <StripeCheckoutInlineForm lang={lang} />,
        // },
        {
            id: 5,
            title: 'text-delivery-instructions',
            component: <DeliveryNotes lang={lang} />,
        },
        {
            id: 6,
            title: 'text-delivery-tip',
            component: <DeliveryTips lang={lang} />,
        },
    ];
    const changeItem = (itemIndex) => {
        if (itemIndex !== bindIndex) {
            setBindIndex(itemIndex);
        }
    };
    const mounted = useIsMounted();
    return (
        <div className="border rounded-md border-border-base text-brand-light">
            {mounted &&
                data?.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className={`p-4 sm:p-8 ${index !== data.length - 1 ? 'border-b border-border-base' : ''}`}
                        >
                            <div className="flex items-center pb-6">
                                <span className="flex items-center justify-center font-semibold border-2 border-current rounded-full h-9 w-9 text-brand ltr:mr-3 rtl:ml-3">
                                    {index + 1}
                                </span>
                                <Heading>{t(item?.title)}</Heading>
                            </div>

                            <div className="ltr:pl-5 rtl:pr-5 sm:ltr:pl-9 sm:rtl:pr-9 lg:ltr:pl-20 lg:rtl:pr-20 sm:ltr:pr-9 sm:rtl:pl-9 ltr:pr-5 rtl:pl-5">
                                {item?.component}
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};

export default CheckoutDetails;
