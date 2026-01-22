'use client';

import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { checkoutAtom } from '@contexts/checkout.atom';
import { TiPencil } from 'react-icons/ti';
import { AiOutlinePlus } from 'react-icons/ai';
import { Description, Label, Radio, RadioGroup } from '@headlessui/react';
import { useModalAction } from '@components/common/modal/modal.context';
import { formatAddress } from '@utils/format-address';
import Button from '@components/ui/button';
import { useTranslation } from 'src/app/i18n/client';
import { useDeleteAddressMutation } from '@framework/address/address';
import { TiTrash } from 'react-icons/ti';

const AddressGrid = ({ address, lang }) => {
  console.log('AddressGrid received address:', address);
  const { t } = useTranslation(lang, 'common');
  const { openModal } = useModalAction();
  const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddressMutation();

  function handleDelete(id) {
    if (confirm(t('text-delete-address-confirm'))) {
        deleteAddress(id);
    }
  }

  function handlePopupView(item) {
    openModal('ADDRESS_VIEW_AND_EDIT', item);
  }

  address = address || [];

  const [checkoutState, setCheckoutState] = useAtom(checkoutAtom);
  const [selected, setSelected] = useState(checkoutState.shippingAddress || address[0] || null);

  useEffect(() => {
    if (address?.length && !selected) {
      setSelected(address[0]);
      setCheckoutState((prev) => ({ ...prev, shippingAddress: address[0] }));
    }
  }, [address, selected, setCheckoutState]);

  useEffect(() => {
    if (selected) {
      setCheckoutState((prev) => ({ ...prev, shippingAddress: selected }));
    }
  }, [selected, setCheckoutState]);

  return (
    <div className="flex flex-col justify-between h-full -mt-4 text-15px md:mt-0">
      <RadioGroup
        value={selected || null}
        onChange={setSelected}
        className="space-y-4 md:grid md:grid-cols-2 md:gap-5 auto-rows-auto md:space-y-0"
      >
        <Label className="sr-only">{t('address')}</Label>
        {address?.length > 0 ? (
          address?.map((item, index) => (
            <Radio
              key={index}
              value={item}
              className={({ checked }) =>
                `${checked ? 'border-brand' : 'border-border-base'}
                  border-2 relative focus:outline-none rounded-md p-5 block cursor-pointer min-h-[112px] h-full group address__box`
              }
            >
              <Label
                as="h3"
                className="mb-2 -mt-1 font-semibold text-brand-dark "
              >
                {item?.title}
              </Label>
              <Description as="div" className="leading-6 text-brand-muted">
                {item?.address ? formatAddress(item?.address) : 'No address details'}
              </Description>
              <div className="absolute z-10 flex transition-all ltr:right-3 rtl:left-3 top-3 address__actions">
                <button
                  onClick={() => handlePopupView(item)}
                  className="flex items-center justify-center w-6 h-6 text-base rounded-full bg-brand text-brand-light text-opacity-80"
                >
                  <span className="sr-only">{t(item?.title)}</span>
                  <TiPencil />
                </button>
                <button
                  onClick={() => handleDelete(item?.id)}
                  className="flex items-center justify-center w-6 h-6 text-base rounded-full bg-brand-danger text-brand-light text-opacity-80 ml-2"
                >
                  <span className="sr-only">{t('text-delete')}</span>
                  <TiTrash />
                </button>
              </div>
            </Radio>
          ))
        ) : (
          <div className="border-2 border-border-base rounded font-semibold p-5 px-10 text-brand-danger flex justify-start items-center min-h-[112px] h-full">
            {t('text-no-address-found')}
          </div>
        )}
        <button
          className="w-full border-2 transition-all border-border-base rounded font-semibold p-5 px-10 cursor-pointer text-brand flex justify-start hover:border-brand items-center min-h-[112px] h-full"
          onClick={handlePopupView}
        >
          <AiOutlinePlus size={18} className="ltr:mr-2 rtl:ml-2" />
          {t('text-add-address')}
        </button>
      </RadioGroup>

      <div className="flex mt-5 sm:justify-end md:mt-10 lg:mt-20 save-change-button">
        <Button className="w-full sm:w-auto">{t('button-save-changes')}</Button>
      </div>
    </div>
  );
};

export default AddressGrid;
