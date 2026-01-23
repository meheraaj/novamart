import WidgetLink from './widget-link';
import WidgetAbout from './widget-about-us';
import WidgetSubscription from './widget-subscription';
import { footer } from '../data';
import cn from 'classnames';

const Widgets = ({
    lang,
    widgets,
    variant = 'default',
}) => {
    return (
        <div
            className={`${variant === 'default' &&
                'mx-auto max-w-[1920px] px-4 md:px-6 lg:px-8 2xl:px-10'
                }`}
        >
            <div className="grid grid-cols-2 md:grid-cols-7 xl:grid-cols-12 gap-5 sm:gap-9 lg:gap-11 xl:gap-7 pb-[50px]">
                <WidgetAbout
                    className="mb-4 border-b col-span-full sm:col-span-1 md:col-span-3 sm:border-b-0 border-border-three sm:mb-0"
                    lang={lang}
                />
                {widgets?.map((widget) => (
                    <WidgetLink
                        key={`footer-widget--key${widget.id}`}
                        data={widget}
                        className="pb-3.5 sm:pb-0 col-span-1 md:col-span-2"
                        lang={lang}
                    />
                ))}
                <WidgetSubscription
                    className={cn(
                        'pt-8 border-t col-span-full sm:col-span-1 md:col-start-4 xl:col-start-auto md:col-span-4 xl:col-span-3 xl:ltr:pl-6 xl:rtl:pr-6 sm:pt-0 sm:border-t-0 border-border-three',
                        {
                            '2xl:ltr:pl-7 2xl:rtl:pr-7 3xl:ltr:pl-16 3xl:rtl:pr-16':
                                variant === 'default',
                        },
                    )}
                    lang={lang}
                />
            </div>
        </div>
    );
};

export default Widgets;
