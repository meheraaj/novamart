'use client';

import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { AiOutlinePlus } from 'react-icons/ai';
import { Description, Label, Radio, RadioGroup } from '@headlessui/react';
import { useModalAction } from '@components/common/modal/modal.context';

const PaymentBox = ({ items }) => {
  const { openModal } = useModalAction();

  function handlePopupView(item) {
    openModal('PAYMENT');
  }

  const removeItem = (id, title) => {
    const result = confirm(`Want to delete? ${title} Payment Card ?`);
    // Logic to handle deletion would go here
  };

  const [selected, setSelected] = useState(items?.[0]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 auto-rows-auto text-[15px] text-black">
      <RadioGroup value={selected} onChange={setSelected}>
        <Label className="sr-only">Default</Label>
        {items?.map((item, index) => (
          <Radio
            key={index}
            value={item}
            className={({ checked }) =>
              `${checked ? 'border-brand' : 'border-border-base'}
                  border-2 relative shadow-md focus:outline-none rounded p-5 block cursor-pointer min-h-28 h-full group bg-repeat bg-cover address__box`
            }
            style={{
              backgroundImage: 'url(/assets/images/card.png)',
            }}
          >
            <Label as="h2" className="text-xl font-semibold text-white pb-7">
              {item?.title}
            </Label>
            <Description
              as="div"
              className="flex flex-col justify-between text-white"
            >
              <h2 className="text-2xl tracking-widest ">{`${item?.card?.number}`}</h2>
              <div className="flex pt-8 text-white">
                <div className="flex flex-col">
                  <span className="text-[12px] mb-1 font-medium">
                    Card Holder Name
                  </span>
                  <span className="text-sm font-bold">{`${item?.card?.name}`}</span>
                </div>
                <div className="flex flex-col ltr:ml-auto rtl:mr-auto">
                  <span className="text-[12px] mb-1 font-medium">
                    Zip Code
                  </span>
                  <span className="text-sm font-bold">{`${item?.card?.address_zip}`}</span>
                </div>
              </div>
            </Description>
            <div className="absolute z-30 flex transition-all ltr:right-3 rtl:left-3 top-3 lg:opacity-0 address__actions">
              <button
                type="button"
                className="flex justify-center items-center bg-[#F35C5C] h-5 w-5 rounded-full"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents radio selection when clicking delete
                  removeItem(item?.id, item?.title);
                }}
              >
                <IoMdClose size={12} fill={'#fff'} />
              </button>
            </div>
          </Radio>
        ))}
      </RadioGroup>
      <button
        type="button"
        className="border-2 transition-all border-border-base rounded-2xl lg:rounded-lg font-semibold p-5 px-10 cursor-pointer bg-brand flex justify-start hover:border-brand items-center min-h-50 h-full text-white"
        onClick={handlePopupView}
      >
        <AiOutlinePlus size={18} className="ltr:mr-2 rtl:ml-2" />
        Add Payment
      </button>
    </div>
  );
};

export default PaymentBox;
