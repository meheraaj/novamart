import { useMutation } from '@tanstack/react-query';

async function changeEmail(input) {
    return input;
}
export const useChangeEmailMutation = () => {
    return useMutation({
        mutationFn: (input) => changeEmail(input),
        onSuccess: (data) => {
            console.log(data, 'ChangeEmail success response');
        },
        onError: (data) => {
            console.log(data, 'ChangeEmail error response');
        },
    });
};
