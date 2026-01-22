'use client';

import Widgets from './widget/widget';
import Copyright from './copyright';
import { footer } from './data';
const { widgets, payment } = footer;

const Footer = ({ variant = 'default', lang }) => {
    return (
        <footer className="mt-[50px] lg:mt-14 2xl:mt-16">
            <Widgets widgets={widgets} variant={variant} lang={lang} />
            <Copyright payment={payment} variant={variant} lang={lang} />
        </footer>
    );
};

export default Footer;
