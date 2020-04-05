import React, {Fragment, useCallback, useEffect, useState} from 'react';

import {
    View,
    SafeAreaView,
    ScrollView,
    FlatList,
    RefreshControl,
} from 'react-native';

import MyUtil from '../common/MyUtil';
import {MyStyle, MyStyleSheet} from '../common/MyStyle';
import MyColor from '../common/MyColor';
import MyImage from '../shared/MyImage';
import {MyAPI, MyConfig} from '../shared/MyConfig';
import MyLANG from '../shared/MyLANG';
import {MyConstant} from '../common/MyConstant';
import MyIcon from '../components/MyIcon';
import {
    ActivityIndicatorLarge,
    ListEmptyViewLottie,
    StatusBarDark,
    StatusBarLight
} from '../components/MyComponent';
import {
    CategoryListItemContentLoader,
    ListItemSeparator,
    CategoryListItem, CartListItem, CartPageTotal, CartPageBottom,
} from "../shared/MyContainer";
import {useDispatch, useSelector} from "react-redux";
import {cartCalculateTotal, cartItemQuantityDecrement, cartItemQuantityIncrement, cartItemRemove} from "../store/CartRedux";


let renderCount = 0;

const CartScreen = ({}) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${CartScreen.name}. renderCount: `, renderCount);
    }
    const dispatch = useDispatch();

    const cart: any = useSelector((state: any) => state.cart);

    const [refreshing, setRefreshing] = useState(false);

    const [firstLoad, setFirstLoad] = useState(true);

    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${CartScreen.name}. useEffect: `, cart);

    }, [cart]);

    const onRefresh = useCallback(async () => {
        MyUtil.printConsole(true, 'log', 'LOG: onRefresh: ', {});

        setRefreshing(true);
        dispatch(cartCalculateTotal());
        setRefreshing(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onNext = () => {
    }

    const cartItemIncrement = (key: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: cartItemIncrement: ', {key, cart});

        if (Number(cart?.items[key]?.item?.products_liked) > Number(cart?.items[key]?.quantity)) {
            dispatch(cartItemQuantityIncrement(key));
        } else {
            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.OutOfStock, false);
        }
    }

    /* const cartItemRemove    = (key: any) => {
         MyUtil.printConsole(true, 'log', 'LOG: cartItemRemove: ', {cart, key});

         const newCartItem: any = cart?.items;
         if (newCartItem) {
             delete newCartItem[key];

             const updatedCart = {
                 ...cart,
                 items: newCartItem
             };

             // setCart(updatedCart);


         }
     }
     const quantityIncrement = (key: any) => {
         MyUtil.printConsole(true, 'log', 'LOG: quantityIncrement: ', {cart, key});

         let quantity: number = cart?.items[key]?.quantity;
         if (quantity) {
             quantity = quantity > 0 ? quantity + 1 : 1;

             const updatedCart = {
                 ...cart,
                 items: {
                     ...cart.items,
                     [key]: {
                         ...cart.items[key],
                         quantity: quantity,
                     }
                 }
             };

             // setCart(updatedCart);


         }
     }
     const quantityDecrement = (key: any) => {
         MyUtil.printConsole(true, 'log', 'LOG: quantityIncrement: ', {cart, key});

         let quantity: number = cart?.items[key]?.quantity;
         if (quantity) {
             quantity = quantity > 1 ? quantity - 1 : 1;

             const updatedCart = {
                 ...cart,
                 items: {
                     ...cart.items,
                     [key]: {
                         ...cart.items[key],
                         quantity: quantity,
                     }
                 }
             };

             // setCart(updatedCart);


         }
     }

     const cartCalculatePrice = async (updatedCart: any) => {
         MyUtil.printConsole(true, 'log', 'LOG: cartCalculatePrice: ', {cart, updatedCart});


         // setCart(calculatedCart);
     }*/

    /*const onCartItemRemove        = (key: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: onCartItemRemove: ', {cart, key});

        dispatch(cartItemRemove(key));

        // setCart(updatedCart);
    }
    const onCartQuantityIncrement = (key: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: onCartQuantityIncrement: ', {cart, key});

        dispatch(cartItemQuantityIncrement(key));

        // setCart(updatedCart);
    }
    const onCartQuantityDecrement = (key: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: onCartQuantityDecrement: ', {cart, key});

        dispatch(cartItemQuantityDecrement(key));

        // setCart(updatedCart);
    }*/

    return (
        <Fragment>
            <StatusBarLight/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView1}/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <View style = {[MyStyleSheet.SafeAreaView3, {backgroundColor: MyColor.Material.WHITE}]}>

                    {
                        cart?.items && Object.keys(cart?.items).length > 0 && cart?.items.constructor === Object ?
                        <>
                            <ScrollView
                                contentInsetAdjustmentBehavior = "automatic"
                                contentContainerStyle = {{paddingTop: MyStyle.headerHeightAdjusted}}
                                refreshControl = {
                                    <RefreshControl
                                        refreshing = {refreshing}
                                        onRefresh = {onRefresh}
                                        progressViewOffset = {MyStyle.headerHeightAdjusted}
                                        colors = {[MyColor.Primary.first]}
                                    />
                                }
                            >
                                <CartListItem
                                    items = {cart?.items}
                                    onPressCartItemRemove = {(key: any) => dispatch(cartItemRemove(key))}
                                    onPressQuantityIncrement = {(key: any) => cartItemIncrement(key)}
                                    onPressQuantityDecrement = {(key: any) => dispatch(cartItemQuantityDecrement(key))}
                                />

                                <View style = {{height: 12, width: MyStyle.screenWidth, backgroundColor: MyColor.backgroundGrey}}></View>

                                <CartPageTotal cart = {cart}/>

                            </ScrollView>

                            <CartPageBottom
                                // textBackButton = {MyLANG.Back}
                                textNextButton = {MyLANG.NextStep}
                                // onPressBack = {onBack}
                                onPressNext = {onNext}
                            />

                        </>
                                                                                                                 :
                        <>
                            <ListEmptyViewLottie
                                source = {MyImage.lottie_box_open}
                                message = {MyLANG.NoItemInYourCart}
                                loop = {false}
                                speed = {0.5}
                                style = {{view: {}, image: {}, text: {}}}
                            />
                            <CartPageBottom
                                // textBackButton = {MyLANG.Back}
                                textNextButton = {MyLANG.GoToShop}
                                // onPressBack = {onBack}
                                onPressNext = {
                                    () =>
                                        MyUtil.commonAction(false,
                                                            null,
                                                            MyConstant.CommonAction.navigate,
                                                            MyConfig.routeName.BottomTab1,
                                                            null,
                                                            null
                                        )}
                            />
                        </>
                    }

                </View>
            </SafeAreaView>
        </Fragment>
    )
}


CartScreen.navigationOptions = {}

export default CartScreen;

