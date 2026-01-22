import Input from '@components/ui/form/input';
import { useForm } from 'react-hook-form';
import TextArea from '@components/ui/form/text-area';
import { useCheckoutMutation } from '@framework/checkout/use-checkout';
import { useCart } from '@contexts/cart/cart.context';
import { CheckBox } from '@components/ui/form/checkbox';
import Button from '@components/ui/button';
import { ROUTES } from '@utils/routes';
import { useTranslation } from 'src/app/i18n/client';
import { useRouter } from 'next/navigation';

const CheckoutForm = ({ lang }) => {
    const { t } = useTranslation(lang);
    const router = useRouter();
    const { items, total, isEmpty } = useCart();
    const { mutate: updateUser, isPending } = useCheckoutMutation();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    
    function onSubmit(input) {
        if (isEmpty) return;
        
        const orderInput = {
            ...input,
            products: items.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                price: item.price,
                name: item.name,
                image: item.image
            })),
            total: total,
            status: { name: 'Pending', color: 'yellow' }
        };

        updateUser(orderInput, {
            onSuccess: (data) => {
                console.log("Order created successfully, data:", data);
                if (data && data.id) {
                    router.push(`${ROUTES.ORDER}?id=${data.id}`);
                } else {
                    console.error("Order created but no ID returned:", data);
                    // Fallback or alert user
                }
            },
            onError: (error) => {
                console.error("Order creation failed:", error);
            }
        });
    }

    return (
        <>
            <h2 className="mb-6 text-lg font-bold md:text-xl xl:text-2xl text-heading xl:mb-8">
                {t('text-shipping-address')}
            </h2>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col justify-center w-full mx-auto "
                noValidate
            >
                <div className="flex flex-col space-y-4 lg:space-y-5">
                    <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0">
                        <Input
                            label={t('forms:label-first-name')}
                            {...register('firstName', {
                                required: 'forms:first-name-required',
                            })}
                            error={errors.firstName?.message}
                            variant="solid"
                            className="w-full lg:w-1/2 "
                            lang={lang}
                        />
                        <Input
                            label={t('forms:label-last-name')}
                            {...register('lastName', {
                                required: 'forms:last-name-required',
                            })}
                            error={errors.lastName?.message}
                            variant="solid"
                            className="w-full mt-2 lg:w-1/2 lg:ltr:ml-3 lg:rtl:mr-3 md:mt-0"
                            lang={lang}
                        />
                    </div>
                    <Input
                        label={t('forms:label-address')}
                        {...register('address', {
                            required: 'forms:address-required',
                        })}
                        error={errors.address?.message}
                        variant="solid"
                        lang={lang}
                    />
                    <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0">
                        <Input
                            type="tel"
                            label={t('forms:label-phone')}
                            {...register('phone', {
                                required: 'forms:phone-required',
                            })}
                            error={errors.phone?.message}
                            variant="solid"
                            className="w-full lg:w-1/2 "
                            lang={lang}
                        />

                        <Input
                            type="email"
                            label={t('forms:label-email-star')}
                            {...register('email', {
                                required: 'forms:email-required',
                                pattern: {
                                    value:
                                        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                    message: 'forms:email-error',
                                },
                            })}
                            error={errors.email?.message}
                            variant="solid"
                            className="w-full mt-2 lg:w-1/2 lg:ltr:ml-3 lg:rtl:mr-3 md:mt-0"
                            lang={lang}
                        />
                    </div>
                    <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0">
                        <Input
                            label={t('forms:label-city')}
                            {...register('city')}
                            variant="solid"
                            className="w-full lg:w-1/2 "
                            lang={lang}
                        />

                        <Input
                            label={t('forms:label-postcode')}
                            {...register('zipCode')}
                            variant="solid"
                            className="w-full mt-2 lg:w-1/2 lg:ltr:ml-3 lg:rtl:mr-3 md:mt-0"
                            lang={lang}
                        />
                    </div>
                    <div className="relative flex items-center ">
                        <CheckBox label="forms:label-save-information" lang={lang} />
                    </div>
                    <TextArea
                        label="forms:label-order-notes"
                        {...register('note')}
                        placeholder="forms:placeholder-order-notes"
                        className="relative pt-3 xl:pt-6"
                        lang={lang}
                    />
                    <div className="flex w-full">
                        <Button
                            className="w-full sm:w-auto"
                            loading={isPending}
                            disabled={isPending}
                        >
                            {t('common:button-place-order')}
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default CheckoutForm;
