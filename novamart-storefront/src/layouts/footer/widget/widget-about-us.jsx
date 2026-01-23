'use client';

import Link from 'next/link';
import Logo from '@components/ui/logo';
import Text from '@components/ui/text';
import Image from '@components/ui/image';
import { ROUTES } from '@utils/routes';
import { useTranslation } from 'src/app/i18n/client';

const WidgetAbout = ({ lang, className }) => {
    const { t } = useTranslation(lang, 'footer');

    return (
        <div className={`pb-10 sm:pb-0 ${className}`}>
            <div className="flex flex-col text-center sm:ltr:text-left sm:rtl:text-right max-w-[300px] mx-auto sm:ltr:ml-0 sm:rtl:mr-0 pb-6 sm:pb-5">
                <Logo
                    href={ROUTES.HOME}
                    className="mx-auto mb-3 lg:mb-5 sm:ltr:ml-0 sm:rtl:mr-0"
                />
                <Text>{t('text-about-us')}</Text>
            </div>


        </div>
    );
};

export default WidgetAbout;
