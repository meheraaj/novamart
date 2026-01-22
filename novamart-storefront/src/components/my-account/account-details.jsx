'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Input from '@components/ui/form/input';
import PasswordInput from '@components/ui/form/password-input';
import Button from '@components/ui/button';
import Heading from '@components/ui/heading';
import Switch from '@components/ui/switch';
import Text from '@components/ui/text';
import { useTranslation } from 'src/app/i18n/client';
import {
  useUpdateUserMutation,
} from '@framework/customer/use-update-customer';
import { useUserQuery } from '@framework/auth/use-user';
import { toast } from 'react-toastify';

const AccountDetails = ({ lang }) => {
  const { t } = useTranslation(lang, ['common', 'forms']);
  const { mutate: updateUser, isPending } = useUpdateUserMutation();
  const { data: userData } = useUserQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      shareProfileData: true,
      setAdsPerformance: true,
    },
  });

  useEffect(() => {
    if (userData) {
      reset({
        firstName: userData.name?.split(' ')[0] || '',
        lastName: userData.name?.split(' ')[1] || '',
        phoneNumber: userData.phone || '',
        email: userData.email || '',
        shareProfileData: true,
        setAdsPerformance: true,
      });
    }
  }, [userData, reset]);



  const onSubmit = (input) => {
    updateUser({
        name: `${input.firstName} ${input.lastName}`,
        phone: input.phoneNumber,
        email: input.email,

    }, {
        onSuccess: () => {
            toast.success(t('common:text-profile-updated'));
        },
        onError: (error) => {
             console.error(error);
             toast.error(t('common:text-profile-update-failed'));
        }
    });
  };

  return (
    <div className="flex flex-col w-full">
      <Heading variant="titleLarge" className="mb-5 md:mb-6 lg:mb-7 lg:-mt-1">
        {t('common:text-account-details-personal')}
      </Heading>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full mx-auto" noValidate>
        {/* Personal Information Section */}
        <div className="border-b border-border-base pb-7 md:pb-8 lg:pb-10">
          <div className="flex flex-col space-y-4 sm:space-y-5">
            <div className="flex flex-col sm:flex-row -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
              <Input
                label={t('forms:label-first-name')}
                {...register('firstName', { required: 'forms:first-name-required' })}
                variant="solid"
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                error={t(errors.firstName?.message || '')}
                lang={lang}
              />
              <Input
                label={t('forms:label-last-name')}
                {...register('lastName', { required: 'forms:last-name-required' })}
                variant="solid"
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                error={t(errors.lastName?.message || '')}
                lang={lang}
              />
            </div>
            <Input
              type="tel"
              label={t('forms:label-phone')}
              {...register('phoneNumber', { required: 'forms:phone-required' })}
              variant="solid"
              className="w-full sm:w-1/2 px-1.5 md:px-2.5"
              error={t(errors.phoneNumber?.message || '')}
              lang={lang}
            />
          </div>
        </div>

        {/* Account Settings Section */}
        <Heading variant="titleLarge" className="pt-6 mb-5 xl:mb-8 md:pt-7 lg:pt-8">
          {t('common:text-account-details-account')}
        </Heading>

        <div className="border-b border-border-base pb-7 md:pb-9 lg:pb-10">
          <div className="flex flex-col space-y-4 sm:space-y-5">
            <Input
              type="email"
              label={t('forms:label-email-star')}
              {...register('email', {
                required: 'forms:email-required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'forms:email-error',
                },
              })}
              variant="solid"
              className="w-full sm:w-1/2 px-1.5 md:px-2.5"
              error={t(errors.email?.message || '')}
              lang={lang}
            />


          </div>
        </div>

        {/* Privacy and Preferences Section */}
        <div className="flex flex-col space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <div className="ltr:pr-2.5 rtl:pl-2.5">
              <Heading className="mb-1 font-medium">{t('common:text-share-profile-data')}</Heading>
              <Text variant="small">{t('common:text-share-profile-data-description')}</Text>
            </div>
            <Controller
              name="shareProfileData"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Switch onChange={onChange} checked={value} />
              )}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="ltr:pr-2.5 rtl:pl-2.5">
              <Heading className="mb-1 font-medium">{t('common:text-ads-performance')}</Heading>
              <Text variant="small">{t('common:text-ads-performance-description')}</Text>
            </div>
            <Controller
              name="setAdsPerformance"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Switch onChange={onChange} checked={value} />
              )}
            />
          </div>
        </div>

        {/* Form Submission */}
        <div className="mt-8 flex ltr:sm:justify-end rtl:sm:justify-start">
          <Button
            type="submit"
            loading={isPending}
            disabled={isPending}
            variant="formButton"
            className="w-full sm:w-auto"
          >
            {t('common:button-save-changes')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AccountDetails;