import TextArea from '@components/ui/form/text-area';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'src/app/i18n/client';
import Text from '@components/ui/text';
import { useAtom } from 'jotai';
import { checkoutAtom } from '@contexts/checkout.atom';
import { useEffect } from 'react';

const DeliveryInstructions = ({
    data,
    lang,
}) => {
    const { t } = useTranslation(lang);
    const [checkout, setCheckout] = useAtom(checkoutAtom);
    const {
        register,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            instructionNote: checkout?.deliveryNote || data || '',
            default: data || false,
        },
    });

    const instructionNote = watch('instructionNote');

    useEffect(() => {
        setCheckout((prev) => ({ ...prev, deliveryNote: instructionNote }));
    }, [instructionNote, setCheckout]);

    return (
        <div className="w-full">
            <div className="w-full mx-auto">
                <form noValidate>
                    <div className="mb-6">
                        <TextArea
                            variant="normal"
                            inputClassName="focus:border-2 focus:outline-none focus:border-brand"
                            label="forms:label-delivery-instructions-note"
                            {...register('instructionNote')}
                            lang={lang}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DeliveryInstructions;
