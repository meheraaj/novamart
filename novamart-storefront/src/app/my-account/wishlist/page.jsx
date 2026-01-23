import Wishlist from '@components/my-account/wishlist';

export const metadata = {
    title: 'Wishlist',
};

export default async function WishlistPage({ params }) {
    const lang = 'en';
    return <Wishlist lang={lang} />;
}
