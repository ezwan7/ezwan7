const initialState: any = {
    items   : {},
    count   : 0,
    subtotal: 0,

    discount       : 0,
    voucher        : {
        item  : {},
        amount: 0,
    },
    delivery_charge: 0,
    service_charge : 0,
    tax            : 0,

    total: 0,
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

export const cartItemAdd               = (product: any) => {
    return {
        type   : types.ADD_CART_ITEM,
        payload: product,
    }
}
export const cartItemRemove            = (key: string) => {
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
export const cartEmpty                 = () => {
    return {
        type   : types.EMPTY_CART,
        payload: null,
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

            const price: number = Number(state.items[key]?.item?.discount_price) > 0 ? Number(state.items[key]?.item?.discount_price) : Number(state.items[key]?.item?.products_price);

            if (price > 0 && Number(state.items[key]?.quantity) > 0) {
                /*console.log('LOG: cartCalculatePrice: ', {
                                price   : price,
                                quantity: Number(state.items[key]?.quantity)
                            }
                );*/
                calculatedCart.items[key].total = price * Number(state.items[key]?.quantity);
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
                                   (Number(calculatedCart.voucher?.amount) > 0 ? Number(calculatedCart.voucher?.amount) : 0)
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
export const cartUpdateVoucher       = (item: any, amount: number) => {
    return {
        type   : types.UPDATE_VOUCHER,
        payload: {item, amount},
    }
}
export const cartUpdateDelivery      = (amount: number) => {
    return {
        type   : types.UPDATE_DELIVERY,
        payload: amount,
    }
}
export const cartUpdateServiceCharge = (amount: number) => {
    return {
        type   : types.UPDATE_SERVICE_CHARGE,
        payload: amount,
    }
}
export const cartUpdateTax           = (amount: number) => {
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
        calculatedCart.discount = 0;
        calculatedCart.total    = 0;

        for (const key of Object.keys(state.items)) {
            // console.log('LOG: cartCalculatePrice: ', {key, item: state.items[key]});

            const quantity: number         = Number(state.items[key]?.quantity) > 0 ? Number(state.items[key]?.quantity) : 0;
            const discounted_price: number = Number(state.items[key]?.item?.discount_price) > 0 ? Number(state.items[key]?.item?.discount_price) : 0;
            const product_price: number    = Number(state.items[key]?.item?.products_price) > 0 ? Number(state.items[key]?.item?.products_price) : 0;
            const price: number            = discounted_price > 0 ? discounted_price : product_price;

            let attribute_amount: number            = 0;
            let price_with_attribute_amount: number = 0;
            let attribute_total: number             = 0;
            let subtotal_before_discount_with_attribute_total: number = 0;

            let addon_amount: number            = 0;
            let price_with_addon_amount: number = 0;
            let addon_total: number             = 0;
            let subtotal_before_discount_with_addon_total: number = 0;

            let subtotal_before_discount_with_attribute_and_addon_total: number = 0;
            let price_with_attribute_and_addon_amount: number = 0;

            let discount: number = 0;

            if (price > 0 && quantity > 0) {
                // console.log('LOG: cartCalculatePrice: ', {price   : price, quantity: quantity});

                if (state.items[key]?.item?.attributes?.length > 0) {
                    for (const [i, attribute] of state.items[key]?.item?.attributes?.entries()) {
                        if (attribute?.values?.length > 0) {
                            for (const [i, value] of attribute?.values?.entries()) {
                                if (value?.cart_selected === true && Number.isFinite(Number(value?.price))) {
                                    if (value?.price_prefix === '+') {
                                        attribute_amount += Number(value?.price);
                                    } else if (value?.price_prefix === '-') {
                                        attribute_amount -= Number(value?.price);
                                    }
                                }
                            }
                        }
                    }
                }

                if (state.items[key]?.item?.linked?.length > 0) {
                    for (const [i, addon] of state.items[key]?.item?.linked?.entries()) {
                        if (addon?.products?.length > 0) {
                            for (const [i, value] of addon?.products?.entries()) {
                                if (value?.cart_selected === true && Number.isFinite(Number(value?.products_price))) {
                                    addon_amount += Number(value?.products_price);
                                }
                            }
                        }
                    }
                }

                price_with_attribute_amount                   = price + attribute_amount;
                attribute_total                               = attribute_amount * quantity;
                subtotal_before_discount_with_attribute_total = (product_price * quantity) + attribute_total;

                price_with_addon_amount                   = price + addon_amount;
                addon_total                               = addon_amount * quantity;
                subtotal_before_discount_with_addon_total = (product_price * quantity) + addon_total;

                subtotal_before_discount_with_attribute_and_addon_total = (product_price * quantity) + (attribute_total + addon_total);
                price_with_attribute_and_addon_amount = price + attribute_amount + addon_amount;


                discount = discounted_price > 0 ? ((product_price - discounted_price) * quantity) : 0;

                calculatedCart.items[key].price = price; // either base price or discounted price(if exist)

                calculatedCart.items[key].attribute_amount            = attribute_amount; // Sum of all selected perks price
                calculatedCart.items[key].price_with_attribute_amount = price_with_attribute_amount; // price + attribute_amount

                calculatedCart.items[key].addon_amount            = addon_amount; // Sum of all selected perks price
                calculatedCart.items[key].price_with_addon_amount = price_with_addon_amount; // price + attribute_amount

                calculatedCart.items[key].attribute_total = attribute_total;

                calculatedCart.items[key].addon_total = addon_total;

                calculatedCart.items[key].subtotal_price                                = (price * quantity); // Based on base or discounted price
                calculatedCart.items[key].subtotal_price_with_attribute_total           = (price * quantity) + attribute_total;
                calculatedCart.items[key].subtotal_price_with_addon_total               = (price * quantity) + addon_total;
                calculatedCart.items[key].subtotal_price_with_attribute_and_addon_total = (price * quantity) + (attribute_total + addon_total);

                calculatedCart.items[key].subtotal_before_discount                                = product_price * quantity; // Based on Product's Actual Price
                calculatedCart.items[key].subtotal_before_discount_with_attribute_total           = subtotal_before_discount_with_attribute_total; // Based on Product's Actual Price with attribute_amount
                calculatedCart.items[key].subtotal_before_discount_with_addon_total               = subtotal_before_discount_with_addon_total; // Based on Product's Actual Price with attribute_amount
                calculatedCart.items[key].subtotal_before_discount_with_attribute_and_addon_total = subtotal_before_discount_with_attribute_and_addon_total;

                calculatedCart.items[key].discount = discount;

                calculatedCart.items[key].total = price_with_attribute_and_addon_amount * quantity;

                //
                calculatedCart.count    = Number(calculatedCart.count) > 0 ? Number(calculatedCart.count) + 1 : 1;
                calculatedCart.subtotal = Number(calculatedCart.subtotal) > 0 ?
                                          Number(calculatedCart.subtotal) +
                                          Number(subtotal_before_discount_with_attribute_and_addon_total)
                                                                              :
                                          Number(subtotal_before_discount_with_attribute_and_addon_total);
                calculatedCart.discount = Number(calculatedCart.discount) > 0 ?
                                          Number(calculatedCart.discount) +
                                          Number(discount)
                                                                              :
                                          Number(discount);

            }
        }

        calculatedCart.total = Number(calculatedCart.subtotal) > 0 ?
                               (
                                   Number(calculatedCart.subtotal)
                                   -
                                   (
                                   (Number(calculatedCart.discount) > 0 ? Number(calculatedCart.discount) : 0) +
                                   (Number(calculatedCart.voucher?.amount) > 0 ? Number(calculatedCart.voucher?.amount) : 0)
                                   )
                                   +
                                   (
                                   (Number(calculatedCart.delivery_charge) > 0 ? Number(calculatedCart.delivery_charge) : 0) +
                                   (Number(calculatedCart.service_charge) > 0 ? Number(calculatedCart.service_charge) : 0) +
                                   (Number(calculatedCart.tax) > 0 ? Number(calculatedCart.tax) : 0)
                                   )
                               )
                                                                   :
                               0
        ;

        return {
            ...state,
            count   : calculatedCart.count,
            subtotal: calculatedCart.subtotal,
            discount: calculatedCart.discount,
            total   : calculatedCart.total,
        }

    } else {

        return {
            ...initialState,
            items: {}
        };
    }
}

// base price, discounted price, ... price: base/discounted, attribute_total, price_with_attribute, subtotal: price*qty, subtotal_with_attribute:price+ta*qty, discount, total

// REDUCER:
const CartReducer = (state: any = initialState, action: any) => {
    // console.log('Redux CartReducer: ', state, action);

    switch (action.type) {

        case types.ADD_CART_ITEM:
            const addCartItem: any = state?.items;
            const itemId: string   = '_' + action.payload?.id;

            if (addCartItem && itemId) {

                if (addCartItem[itemId]) {

                    if (Number(action.payload?.current_stock) > Number(addCartItem[itemId]?.quantity)) {
                        addCartItem[itemId].item     = action.payload;
                        addCartItem[itemId].quantity = Number(addCartItem[itemId].quantity) > 0 ? Number(addCartItem[itemId].quantity) + 1 : 1;
                    } else {
                        return state;
                    }

                } else {

                    if (Number(action.payload?.current_stock) > 0) {

                        const discount_price: number = Number(action.payload?.discount_price) > 0 ? Number(action.payload?.discount_price) : 0;
                        const products_price: number = Number(action.payload?.products_price) > 0 ? Number(action.payload?.products_price) : 0;
                        const price: number          = discount_price > 0 ? discount_price : products_price;

                        addCartItem[itemId] = {};
                        addCartItem[itemId] = {
                            item    : action.payload,
                            quantity: 1,

                            /*price: price,

                            attribute_amount           : price,
                            price_with_attribute_amount: price,

                            subtotal_price                     : price,
                            subtotal_price_with_attribute_amount: price,

                            subtotal_before_discount                     : price,
                            subtotal_before_discount_with_attribute_amount: price,

                            discount: discount_price > 0 ? (products_price - discount_price) : 0,
                            total   : price > 0 ? price : 0,*/
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

                const items: any                = {...state.items};
                const itemsIncrement            = items;
                itemsIncrement[itemIdIncrement] = {
                    ...state.items[itemIdIncrement],
                    quantity: quantityIncrement,
                }

                return calculateTotal(
                    {
                        ...state,
                        items: itemsIncrement
                    }
                )

                /*return calculateTotal(
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
                );*/
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

                    const items: any                = {...state.items};
                    const itemsDecrement            = items;
                    itemsDecrement[itemIdDecrement] = {
                        ...state.items[itemIdDecrement],
                        quantity: quantityDecrement,
                    };

                    return calculateTotal(
                        {
                            ...state,
                            items: itemsDecrement
                        }
                    );

                    /*return calculateTotal(
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
                    );*/
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
            const updateVoucher: any = state?.voucher;
            updateVoucher.item       = action.payload?.item;
            updateVoucher.amount     = action.payload?.amount;

            return calculateTotal(
                {
                    ...state,
                    voucher: updateVoucher
                }
            );

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

