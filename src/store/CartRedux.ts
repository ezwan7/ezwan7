const initialState: any = {
    items          : {},
    count          : 0,
    subtotal       : 0,
    discount       : 9.5,
    voucher        : 11.70,
    delivery_charge: 18.45,
    service_charge : 13.50,
    tax            : 7.8,
    total          : 0,
};

/*const initialState: any = {
    items   : {
        [44]: {
            item    : {
                freegift               : 0,
                id                     : 25,
                image                  : "https://smddeveloper.com/directd_merge/resources/assets/images/product_images/1582202232.samsung-galaxy-m30s-dummy-original-imafkzzxdbfut6ta.jpeg",
                is_feature             : 0,
                is_liked               : 0,
                low_limit              : 0,
                manufacturers_id       : 28,
                pickpoints             : null,
                price                  : "258.00",
                products_date_added    : "2017-08-08 12:25:02",
                products_date_available: null,
                products_id            : 25,
                products_image         : "resources/assets/images/product_images/1582202232.samsung-galaxy-m30s-dummy-original-imafkzzxdbfut6ta.jpeg",
                products_last_modified : "2020-03-16 09:48:07",
                products_liked         : 0,
                products_max_stock     : 0,
                products_min_order     : 1,
                products_model         : "",
                products_name          : "Samsung Galaxy M30s (Black, 64 GB)",
                products_ordered       : 0,
                products_price         : "258.00",
                products_quantity      : 0,
                products_slug          : "samsung-galaxy-m30s",
                products_status        : 1,
                products_tax_class_id  : 0,
                products_type          : 0,
                products_weight        : "0.500",
                products_weight_unit   : "Kilogram",
                rating                 : 5,
                stores                 : null,
            },
            quantity: 1,
            total   : 0
        },
        [45]: {
            item    : {
                freegift               : 0,
                id                     : 25,
                image                  : "https://smddeveloper.com/directd_merge/resources/assets/images/product_images/1582202232.samsung-galaxy-m30s-dummy-original-imafkzzxdbfut6ta.jpeg",
                is_feature             : 0,
                is_liked               : 0,
                low_limit              : 0,
                manufacturers_id       : 28,
                pickpoints             : null,
                price                  : "258.00",
                products_date_added    : "2017-08-08 12:25:02",
                products_date_available: null,
                products_id            : 25,
                products_image         : "resources/assets/images/product_images/1582202232.samsung-galaxy-m30s-dummy-original-imafkzzxdbfut6ta.jpeg",
                products_last_modified : "2020-03-16 09:48:07",
                products_liked         : 0,
                products_max_stock     : 0,
                products_min_order     : 1,
                products_model         : "",
                products_name          : "Samsung Galaxy M30s (Black, 64 GB)",
                products_ordered       : 0,
                products_price         : "258.00",
                products_quantity      : 0,
                products_slug          : "samsung-galaxy-m30s",
                products_status        : 1,
                products_tax_class_id  : 0,
                products_type          : 0,
                products_weight        : "0.500",
                products_weight_unit   : "Kilogram",
                rating                 : 5,
                stores                 : null,
            },
            quantity: 1,
            total   : 0
        },
    },
    count   : 0,
    subtotal: 0,
    discount: 14.50,
    delivery_charge: 7,
    tax     : 11,
    total   : 0,
}*/

const types = {
    ADD_CART_ITEM      : "ADD_CART_ITEM",
    REMOVE_CART_ITEM   : "REMOVE_CART_ITEM",
    INCREMENT_CART_ITEM: "INCREMENT_CART_ITEM",
    DECREMENT_CART_ITEM: "DECREMENT_CART_ITEM",
    EMPTY_CART         : "EMPTY_CART",

    UPDATE_CART         : "UPDATE_CART",
    CALCULATE_CART_TOTAL: "CALCULATE_CART_TOTAL",

    UPDATE_DISCOUNT      : "UPDATE_DISCOUNT",
    UPDATE_VOUCHER       : "UPDATE_VOUCHER",
    UPDATE_DELIVERY      : "UPDATE_DELIVERY",
    UPDATE_SERVICE_CHARGE: "UPDATE_SERVICE_CHARGE",
    UPDATE_TAX           : "UPDATE_TAX",
}

export const cartItemAdd    = (product: any) => {
    return {
        type   : types.ADD_CART_ITEM,
        payload: product,
    }
}
export const cartItemRemove = (key: string) => {
    return {
        type   : types.REMOVE_CART_ITEM,
        payload: key,
    }
}

export const cartItemQuantityIncrement = (key: string) => {
    return {
        type   : types.INCREMENT_CART_ITEM,
        payload: key,
    }
}
export const cartItemQuantityDecrement = (key: string) => {
    return {
        type   : types.DECREMENT_CART_ITEM,
        payload: key,
    }
}

export const cartEmpty = () => {
    return {
        type   : types.EMPTY_CART,
        payload: '',
    }
}

// TODO:
export const cartUpdate = (state: any) => {
    // console.log('Redux calculate: ', state);
    let calculatedCart: any = state;
    if (state?.items && Object.keys(state?.items).length > 0 && state?.items?.constructor === Object) {
        calculatedCart.count    = 0;
        calculatedCart.subtotal = 0;
        for (const key of Object.keys(state.items)) {
            // console.log('LOG: cartCalculatePrice: ', {key, item: state.items[key]});
            if (Number(state.items[key]?.item?.products_price) > 0 && Number(state.items[key]?.quantity) > 0) {
                /*console.log('LOG: cartCalculatePrice: ', {
                                price   : Number(state.items[key]?.item?.products_price),
                                quantity: Number(state.items[key]?.quantity)
                            }
                );*/
                calculatedCart.items[key].total = Number(state.items[key]?.item?.products_price) * Number(state.items[key]?.quantity);
                calculatedCart.count            = Number(calculatedCart.count) > 0 ? Number(calculatedCart.count) + 1 : 1;
                calculatedCart.subtotal         = Number(calculatedCart.subtotal) > 0 ? Number(calculatedCart.subtotal) + Number(
                    calculatedCart.items[key].total) : Number(
                    calculatedCart.items[key].total);

            }
        }
        calculatedCart.total = Number(calculatedCart.subtotal) > 0 ?
                               (
                                   Number(calculatedCart.subtotal)
                                   -
                                   (
                                   (Number(calculatedCart.discount) > 0 ? Number(calculatedCart.discount) : 0) +
                                   (Number(calculatedCart.voucher) > 0 ? Number(calculatedCart.voucher) : 0)
                                   )
                                   +
                                   (
                                   (Number(calculatedCart.delivery_charge) > 0 ? Number(calculatedCart.delivery_charge) : 0) +
                                   (Number(calculatedCart.tax) > 0 ? Number(calculatedCart.tax) : 0)
                                   )
                               )
                                                                   : 0;

        // console.log('LOG: Redux calculate: ', {calculatedCart});

        return calculatedCart;
    } else {
        return state;
    }
}

export const cartCalculateTotal = () => {
    return {
        type   : types.CALCULATE_CART_TOTAL,
        payload: '',
    }
}

export const cartUpdateDiscount      = (amount: any) => {
    return {
        type   : types.UPDATE_DISCOUNT,
        payload: amount,
    }
}
export const cartUpdateVoucher       = (amount: any) => {
    return {
        type   : types.UPDATE_VOUCHER,
        payload: amount,
    }
}
export const cartUpdateDelivery      = (amount: any) => {
    return {
        type   : types.UPDATE_DELIVERY,
        payload: amount,
    }
}
export const cartUpdateServiceCharge = (amount: any) => {
    return {
        type   : types.UPDATE_SERVICE_CHARGE,
        payload: amount,
    }
}
export const cartUpdateTax           = (amount: any) => {
    return {
        type   : types.UPDATE_TAX,
        payload: amount,
    }
}


// Genral function to Calculate Total, Subtotal, Item Count Only:
const calculateTotal = (state: any) => {
    console.log('Redux calculateTotal: ', state);
    let calculatedCart: any = state;
    if (state?.items && Object.keys(state?.items).length > 0 && state?.items?.constructor === Object) {
        calculatedCart.count    = 0;
        calculatedCart.subtotal = 0;
        for (const key of Object.keys(state.items)) {
            // console.log('LOG: cartCalculatePrice: ', {key, item: state.items[key]});
            if (Number(state.items[key]?.item?.products_price) > 0 && Number(state.items[key]?.quantity) > 0) {
                /*console.log('LOG: cartCalculatePrice: ', {
                                price   : Number(state.items[key]?.item?.products_price),
                                quantity: Number(state.items[key]?.quantity)
                            }
                );*/
                calculatedCart.items[key].total = Number(state.items[key]?.item?.products_price) * Number(state.items[key]?.quantity);
                calculatedCart.count            = Number(calculatedCart.count) > 0 ? Number(calculatedCart.count) + 1 : 1;
                calculatedCart.subtotal         = Number(calculatedCart.subtotal) > 0 ?
                                                  Number(calculatedCart.subtotal) +
                                                  Number(calculatedCart.items[key].total)
                                                                                      :
                                                  Number(calculatedCart.items[key].total);

            }
        }
        calculatedCart.total = Number(calculatedCart.subtotal) > 0 ?
                               (
                                   Number(calculatedCart.subtotal)
                                   -
                                   (
                                   (Number(calculatedCart.discount) > 0 ? Number(calculatedCart.discount) : 0) +
                                   (Number(calculatedCart.voucher) > 0 ? Number(calculatedCart.voucher) : 0)
                                   )
                                   +
                                   (
                                   (Number(calculatedCart.delivery_charge) > 0 ? Number(calculatedCart.delivery_charge) : 0) +
                                   (Number(calculatedCart.service_charge) > 0 ? Number(calculatedCart.service_charge) : 0) +
                                   (Number(calculatedCart.tax) > 0 ? Number(calculatedCart.tax) : 0)
                                   )
                               )
                                                                   : 0;

        return {
            ...state,
            count   : calculatedCart.count,
            subtotal: calculatedCart.subtotal,
            total   : calculatedCart.total,
        }
    } else {
        return {
            ...initialState,
            items: {}
        };
    }
}

// REDUCER:
const CartReducer = (state: any = initialState, action: any) => {
    // console.log('Redux CartReducer: ', state, action);

    switch (action.type) {

        case types.ADD_CART_ITEM:
            const addCartItem: any = state?.items;
            const itemId: string   = '_' + action.payload?.id;

            if (addCartItem && itemId) {

                if (addCartItem[itemId]) {

                    if (Number(action.payload?.products_liked) > Number(addCartItem[itemId]?.quantity)) {
                        addCartItem[itemId].item     = action.payload;
                        addCartItem[itemId].quantity = Number(addCartItem[itemId].quantity) > 0 ? Number(addCartItem[itemId].quantity) + 1 : 1;
                    } else {
                        return state;
                    }

                } else {

                    if (Number(action.payload?.products_liked) > 0) {
                        addCartItem[itemId] = {};
                        addCartItem[itemId] = {
                            item    : action.payload,
                            quantity: 1,
                            total   : Number(action.payload?.products_price) > 0 ? Number(action.payload?.products_price) : 0,
                        };
                    } else {
                        return state;
                    }

                }

                return calculateTotal(
                    {
                        ...state,
                        items: addCartItem
                    }
                );

            } else {
                return state;
            }
        case types.REMOVE_CART_ITEM:
            const itemIdRemove: string = action.payload;
            const removeCartItem: any  = state?.items;
            console.log('Redux REMOVE_CART_ITEM 1: ', itemIdRemove, removeCartItem);
            if (removeCartItem) {
                delete removeCartItem[itemIdRemove];
                console.log('Redux REMOVE_CART_ITEM 2: ', itemIdRemove, removeCartItem);
                return calculateTotal(
                    {
                        ...state,
                        items: removeCartItem
                    }
                );
            } else {
                return state;
            }

        case types.INCREMENT_CART_ITEM:
            const itemIdIncrement: string = action.payload;
            let quantityIncrement: number = state?.items[itemIdIncrement]?.quantity;
            if (quantityIncrement) {
                quantityIncrement = quantityIncrement > 0 ? quantityIncrement + 1 : 1;

                return calculateTotal(
                    {
                        ...state,
                        items: {
                            ...state.items,
                            [itemIdIncrement]: {
                                ...state.items[itemIdIncrement],
                                quantity: quantityIncrement,
                            }
                        }
                    }
                );
            } else {
                return state;
            }
        case types.DECREMENT_CART_ITEM:
            const itemIdDecrement: string = action.payload;
            let quantityDecrement: number = state?.items[itemIdDecrement]?.quantity;
            if (quantityDecrement) {
                if (quantityDecrement === 1) {
                    return state;
                } else {
                    quantityDecrement = quantityDecrement > 1 ? quantityDecrement - 1 : 1;
                    return calculateTotal(
                        {
                            ...state,
                            items: {
                                ...state.items,
                                [itemIdDecrement]: {
                                    ...state.items[itemIdDecrement],
                                    quantity: quantityDecrement,
                                }
                            }
                        }
                    );
                }
            } else {
                return state;
            }

        case types.EMPTY_CART:
            return initialState;

        case types.UPDATE_CART:
        /*let calculatedCart: any = state;

        if (state?.items && Object.keys(state?.items).length > 0 && state?.items?.constructor === Object) {
            calculatedCart.count    = 0;
            calculatedCart.subtotal = 0;
            for (const key of Object.keys(state.items)) {
                // console.log('LOG: cartCalculatePrice: ', {key, item: state.items[key]});
                if (Number(state.items[key]?.item?.products_price) > 0 && Number(state.items[key]?.quantity) > 0) {
                    /!*console.log('LOG: cartCalculatePrice: ', {
                                    price   : Number(state.items[key]?.item?.products_price),
                                    quantity: Number(state.items[key]?.quantity)
                                }
                    );*!/
                    calculatedCart.items[key].total = Number(state.items[key]?.item?.products_price) * Number(state.items[key]?.quantity);
                    calculatedCart.count            = Number(calculatedCart.count) > 0 ? Number(calculatedCart.count) + 1 : 1;
                    calculatedCart.subtotal         = Number(calculatedCart.subtotal) > 0 ? Number(calculatedCart.subtotal) + Number(
                        calculatedCart.items[key].total) : Number(
                        calculatedCart.items[key].total);

                }
            }
            calculatedCart.total = Number(calculatedCart.subtotal) > 0 ?
                                   (
                                       Number(calculatedCart.subtotal) -
                                       (Number(calculatedCart.discount) > 0 ? Number(calculatedCart.discount) : 0) +
                                       (Number(calculatedCart.delivery_charge) > 0 ? Number(calculatedCart.delivery_charge) : 0) +
                                       (Number(calculatedCart.tax) > 0 ? Number(calculatedCart.tax) : 0)
                                   )
                                                                       : 0;
            // console.log('LOG: Redux calculate: ', {calculatedCart});
            return {
                ...state,
                count   : calculatedCart.count,
                subtotal: calculatedCart.subtotal,
                total   : calculatedCart.total,
            }
        } else {
            return state;
        }*/

        case types.CALCULATE_CART_TOTAL:
            return calculateTotal(state);

        case types.UPDATE_DISCOUNT:
            if (Number(action.payload) >= 0) {
                return calculateTotal(
                    {
                        ...state,
                        discount: action.payload
                    }
                );
            } else {
                return state;
            }
        case types.UPDATE_VOUCHER:
            if (Number(action.payload) >= 0) {
                return calculateTotal(
                    {
                        ...state,
                        voucher: action.payload
                    }
                );
            } else {
                return state;
            }
        case types.UPDATE_DELIVERY:
            if (Number(action.payload) >= 0) {
                return calculateTotal(
                    {
                        ...state,
                        delivery_charge: action.payload
                    }
                );
            } else {
                return state;
            }
        case types.UPDATE_SERVICE_CHARGE:
            if (Number(action.payload) >= 0) {
                return calculateTotal(
                    {
                        ...state,
                        service_charge: action.payload
                    }
                );
            } else {
                return state;
            }
        case types.UPDATE_TAX:
            if (Number(action.payload) >= 0) {
                return calculateTotal(
                    {
                        ...state,
                        tax: action.payload
                    }
                );
            } else {
                return state;
            }

        default:
            return state;
    }
}

export default CartReducer;

