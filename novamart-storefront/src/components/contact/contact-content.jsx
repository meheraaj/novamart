import { useState, useEffect } from 'react';
import { TiPencil } from 'react-icons/ti';
import { AiOutlinePlus } from 'react-icons/ai';
import { Description, Label, Radio, RadioGroup } from '@headlessui/react';
import { useModalAction } from '@components/common/modal/modal.context';
import { useTranslation } from 'src/app/i18n/client';

const ContactBox = ({ items, lang }) => {
  const { t } = useTranslation(lang, 'common');
  // Initialize with null check
  let [contactData, setContactData] = useState(items?.data || []);
  const { openModal } = useModalAction();

  // Controlled state for RadioGroup
  const [selected, setSelected] = useState(contactData[0] || null);

  // Sync state when contactData changes
  useEffect(() => {
    if (contactData?.length && !selected) {
      setSelected(contactData[0]);
    } else if (contactData?.length === 0) {
      setSelected(null);
    }
  }, [contactData, selected]);

  function handlePopupView(item) {
    openModal('PHONE_NUMBER', item);
  }

  const removeItem = (id, title) => {
    const result = confirm(`Want to delete? ${title} Contact`);
    if (result) {
      let items = [...contactData];
      let array = items.filter((item) => item.id !== id);
      setContactData(array);
    }
  };

  return (
    <>
      <div className="text-[15px] text-brand-dark ">
        <RadioGroup
          value={selected || null}
          onChange={setSelected}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 auto-rows-auto"
        >
          <Label className="sr-only">{t('text-default')}</Label>
          {contactData?.map((item, index) => (
            <Radio
              key={index}
              value={item}
              className={({ checked }) =>
                `${checked ? 'border-brand' : 'border-border-base'}
                  border-2 relative focus:outline-none rounded p-5 block cursor-pointer min-h-28 h-full group address__box`
              }
            >
              <Label as="h2" className="mb-2 font-semibold">
                {item?.title}
              </Label>
              <Description as="div" className="opacity-70">
                {item?.number}
              </Description>
              <div className="absolute z-30 flex transition-all ltr:right-3 rtl:left-3 top-3 lg:opacity-0 address__actions">
                <button
                  onClick={() => handlePopupView(item)}
                  className="flex items-center justify-center w-6 h-6 text-base rounded-full bg-brand text-brand-light text-opacity-80"
                >
                  <TiPencil />
                </button>
              </div>
            </Radio>
          ))}
          <button
            className="border-2 transition-all border-border-base rounded font-semibold p-5 px-10 cursor-pointer text-brand flex justify-start hover:border-brand items-center min-h-28 h-full"
            onClick={() => handlePopupView()}
          >
            <AiOutlinePlus size={18} className="ltr:mr-2 rtl:ml-2" />
            {t('text-add-phone-number')}
          </button>
        </RadioGroup>
      </div>
    </>
  );
};

export default ContactBox;

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}