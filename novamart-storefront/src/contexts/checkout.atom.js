import { atom } from 'jotai';

export const checkoutAtom = atom({
  shippingAddress: null,
  billingAddress: null,
  deliverySchedule: null,
  contactNumber: null,
  deliveryNote: null,
});
