import { useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import Heading from '@components/ui/heading';
import ProductReviewRating from './product-review-rating';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ProductDetailsTab({ lang, product }) {
  let [tabHeading] = useState({
    Product_Details: '',
    Review_Rating: '',
  });

  return (
    <div className="w-full xl:px-2 py-11 lg:py-14 xl:py-16 sm:px-0">
      <TabGroup>
        <TabList className="block border-b border-border-base">
          {Object.keys(tabHeading).map((item) => (
            <Tab
              key={item}
              className={({ selected }) =>
                classNames(
                  'relative inline-block transition-all text-15px lg:text-17px leading-5 text-brand-dark focus:outline-none pb-3 lg:pb-5 hover:text-brand ltr:mr-8 rtl:ml-8',
                  selected
                    ? 'font-semibold after:absolute after:w-full after:h-0.5 after:bottom-0 after:translate-y-px after:ltr:left-0 after:rtl:right-0 after:bg-brand'
                    : '',
                )
              }
            >
              {item.split('_').join(' ')}
            </Tab>
          ))}
        </TabList>
        <TabPanels className="mt-6 lg:mt-9">
          <TabPanel>
            <div className="text-sm sm:text-15px text-brand-muted leading-[2em] space-y-4 lg:space-y-5 xl:space-y-7 w-full">
              <p>{product?.description}</p>
            </div>
          </TabPanel>
          <TabPanel>
            <ProductReviewRating lang={lang} />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
