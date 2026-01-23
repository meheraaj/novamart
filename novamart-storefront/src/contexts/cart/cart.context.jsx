'use client';

import React, { useCallback } from 'react';
import { cartReducer, initialState } from './cart.reducer';
import { getItem, inStock } from './cart.utils';
import { useLocalStorage } from '@utils/use-local-storage';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import Cookies from 'js-cookie';

export const cartContext = React.createContext(undefined);

cartContext.displayName = 'CartContext';

export const useCart = () => {
    const context = React.useContext(cartContext);
    if (context === undefined) {
        throw new Error(`useCart must be used within a CartProvider`);
    }
    return context;
};

export function CartProvider(props) {
    const [savedCart, saveCart] = useLocalStorage(
        `borobazar-cart`,
        JSON.stringify(initialState),
    );
    const [state, dispatch] = React.useReducer(
        cartReducer,
        JSON.parse(savedCart),
    );

    // Helper to merge local and server items
    const mergeItems = (localItems, serverItems) => {
        const merged = [...serverItems];
        localItems.forEach(localItem => {
            const existingIndex = merged.findIndex(i => i.id === localItem.id);
            if (existingIndex > -1) {
                // If item exists, update quantity (or keep max? let's sum them)
                merged[existingIndex].quantity += localItem.quantity;
            } else {
                merged.push(localItem);
            }
        });
        return merged;
    };

    const loadCart = useCallback(async () => {
        const token = Cookies.get('auth_token');
        if (token) {
            try {
                const { data } = await http.get(API_ENDPOINTS.CART);
                if (data && data.items) {
                    let finalItems = data.items;
                    // Smart Merge: If we have local items that are NOT in server cart (or just merge all)
                    // But wait, if we just logged in, 'state.items' might be the guest cart.
                    // We should merge guest cart into server cart.

                    // Note: This logic runs on mount or when called. 
                    // If 'state.items' has stuff, it's the local cart.
                    if (state.items.length > 0) {
                        finalItems = mergeItems(state.items, data.items);
                        // If we merged, we should probably sync back to server immediately
                        await http.post(API_ENDPOINTS.CART, { ...state, totalPrice: state.total, items: finalItems });
                    }

                    dispatch({ type: 'REPLACE_CART', items: finalItems });
                }
            } catch (err) {
                console.error("Failed to fetch cart", err);
            }
        }
    }, [state.items]);

    // Sync with API on mount
    React.useEffect(() => {
        loadCart();
    }, []); // Run once on mount

    // Sync to API on change
    React.useEffect(() => {
        const token = Cookies.get('auth_token');
        if (token) {
            // Debounce could be good here, but for now direct sync
            // We need to calculate totals for the payload if the API expects them
            // The reducer calculates them in 'state'
            http.post(API_ENDPOINTS.CART, { ...state, totalPrice: state.total })
                .catch(err => console.error("Failed to sync cart", err));
        }
    }, [state, saveCart]);

    const addItemToCart = (item, quantity) =>
        dispatch({ type: 'ADD_ITEM_WITH_QUANTITY', item, quantity });
    const removeItemFromCart = (id) =>
        dispatch({ type: 'REMOVE_ITEM_OR_QUANTITY', id });
    const clearItemFromCart = (id) => dispatch({ type: 'REMOVE_ITEM', id });
    const isInCart = useCallback(
        (id) => !!getItem(state.items, id),
        [state.items],
    );
    const getItemFromCart = useCallback(
        (id) => getItem(state.items, id),
        [state.items],
    );
    const isInStock = useCallback(
        (id) => inStock(state.items, id),
        [state.items],
    );
    const resetCart = () => dispatch({ type: 'RESET_CART' });
    const value = React.useMemo(
        () => ({
            ...state,
            addItemToCart,
            removeItemFromCart,
            clearItemFromCart,
            getItemFromCart,
            isInCart,
            isInStock,
            isInStock,
            resetCart,
            loadCart, // Expose loadCart to allow manual sync (e.g. after login)
        }),
        [getItemFromCart, isInCart, isInStock, state],
    );
    return <cartContext.Provider value={value} {...props} />;
}
