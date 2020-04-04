const initialState: any = {
    items   : {},
    count   : undefined,
    subtotal: undefined,
    discount: undefined,
    shipping: undefined,
    tax     : undefined,
    total   : undefined,
};

const types = {
    ADD_CART_ITEM   : "ADD_CART_ITEM",
    REMOVE_CART_ITEM: "REMOVE_CART_ITEM",
    DELETE_CART_ITEM: "DELETE_CART_ITEM",
    EMPTY_CART      : "EMPTY_CART",
}

export const cartAddItem = (item: any) => {
    return {
        type   : types.ADD_CART_ITEM,
        payload: item,
    }
}

export const cartEmpty = (id: string) => {
    return {
        type   : types.EMPTY_CART,
        payload: id,
    }
}

const CartReducer = (state: any = initialState, action: any) => {
    switch (action.type) {

        case types.ADD_CART_ITEM:
            const cart                     = state;
            cart.items[action.payload?.id] = {
                item : action.payload,
                count: 1,
                // count: cart.items.count > 0 ? cart.items.count++ : 1,
            };
            return cart;

        case types.EMPTY_CART:
            return initialState;

        default:
            return state;
    }
}

export default CartReducer;

