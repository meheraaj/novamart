import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@components/ui/button';
import Input from '@components/ui/form/input';
import { useTranslation } from 'src/app/i18n/client';
import { useUserQuery } from '@framework/auth/use-user';
import { useUpdateUserMutation } from '@framework/customer/use-update-customer';
import { useAtom } from 'jotai';
import { checkoutAtom } from '@contexts/checkout.atom';
import Alert from '@components/ui/alert';

const ContactPage = ({ lang }) => {
  const { t } = useTranslation(lang);
  const { data: user, isLoading } = useUserQuery();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUserMutation();
  const [checkout, setCheckout] = useAtom(checkoutAtom);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: user?.phone || '',
    },
  });

  useEffect(() => {
    if (user?.phone) {
      setValue('phone', user.phone);
      setCheckout((prev) => ({ ...prev, contactNumber: user.phone }));
    }
  }, [user?.phone, setValue, setCheckout]);

  function onSubmit(values) {
    updateUser(
      { phone: values.phone },
      {
        onSuccess: () => {
          setCheckout((prev) => ({ ...prev, contactNumber: values.phone }));
        },
      }
    );
  }

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full mx-auto">
      {user?.phone ? (
        <div className="flex items-center justify-between p-4 border rounded-md border-border-base bg-fill-base">
          <span className="font-semibold text-brand-dark">{user.phone}</span>
          <span className="text-sm text-brand-muted">{t('text-saved-number')}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Alert message={t('text-add-phone-number-helper')} variant="info" className="mb-4" />
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <Input
              variant="outline"
              label={t('forms:label-phone')}
              {...register('phone', { required: 'Phone number is required' })}
              error={t(errors.phone?.message)}
              className="w-full sm:w-auto flex-1"
            />
            <Button loading={isUpdating} disabled={isUpdating}>
              {t('button-save-number')}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContactPage;
