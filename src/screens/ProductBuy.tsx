import React, {Fragment, useCallback, useEffect, useState} from 'react';

import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    RefreshControl, TouchableOpacity, StyleSheet,
} from 'react-native';
import LinearGradient from "react-native-linear-gradient";

import MyUtil from '../common/MyUtil';
import {MyStyle, MyStyleSheet} from '../common/MyStyle';
import MyColor from '../common/MyColor';
import MyImage from '../shared/MyImage';
import {MyAPI, MyConfig} from '../shared/MyConfig';
import MyLANG from '../shared/MyLANG';
import {MyConstant} from '../common/MyConstant';
import MyIcon from '../components/MyIcon';

import {
    ActivityIndicatorLarge, IconStar,
    ListEmptyViewLottie,
    StatusBarLight
} from '../components/MyComponent';

import {MyButton} from "../components/MyButton";
import {ShadowBox} from "react-native-neomorph-shadows";
import {MyFastImage} from "../components/MyFastImage";
import {CartListItem, CartPageBottom, CartPageHeader, CartPageTotal} from "../shared/MyContainer";
import {useDispatch, useSelector} from "react-redux";
import {
    cartCalculateTotal,
    cartItemQuantityDecrement,
    cartItemQuantityIncrement,
    cartItemRemove,
    cartUpdateDiscount,
    cartUpdateDelivery,
    cartUpdateTax
} from "../store/CartRedux";

let renderCount = 0;

const ProductBuyScreen = ({route, navigation}: any) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${ProductBuyScreen.name}. renderCount: `, renderCount);
    }

    const dispatch = useDispatch();

    const cart: any                   = useSelector((state: any) => state.cart);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${ProductBuyScreen.name}. useEffect: `, cart);

    }, [cart]);

    const onRefresh = useCallback(async () => {
        MyUtil.printConsole(true, 'log', 'LOG: onRefresh: ', {});

        setRefreshing(true);
        dispatch(cartCalculateTotal());
        setRefreshing(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onBack = () => {
        MyUtil.stackAction(false,
                           null,
                           MyConstant.StackAction.pop,
                           1,
                           null,
                           null
        )
    }

    const cartItemIncrement = (key: string) => {
        MyUtil.printConsole(true, 'log', 'LOG: cartItemIncrement: ', {key, cart});

        if (Number(cart?.items[key]?.item?.products_liked) > Number(cart?.items[key]?.quantity)) {
            dispatch(cartItemQuantityIncrement(key));
        } else {
            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.OutOfStock, false);
        }
    }

    return (
        <Fragment>
            <StatusBarLight/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView1}/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <View style = {[MyStyleSheet.SafeAreaView3, {backgroundColor: MyColor.Material.WHITE}]}>

                    {/*<CartPageHeader/>*/}

                    {
                        (cart?.items && Object.keys(cart?.items).length > 0 && cart?.items.constructor === Object) ?
                        <>
                            <ScrollView
                                contentInsetAdjustmentBehavior = "automatic"
                                contentContainerStyle = {{paddingTop: MyStyle.headerHeightAdjusted, flexGrow: 1}}
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
                                    onPressCartItemRemove = {(key: string) => dispatch(cartItemRemove(key))}
                                    onPressQuantityIncrement = {(key: string) => cartItemIncrement(key)}
                                    onPressQuantityDecrement = {(key: string) => dispatch(cartItemQuantityDecrement(key))}
                                />

                                <View style = {{height: 12, width: MyStyle.screenWidth, backgroundColor: MyColor.backgroundGrey}}></View>

                                <CartPageTotal cart = {cart}/>

                            </ScrollView>

                            <CartPageBottom
                                textBackButton = {MyLANG.Back}
                                textNextButton = {MyLANG.NextStep}
                                onPressBack = {onBack}
                                onPressNext = {onBack}
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
                                textBackButton = {MyLANG.Back}
                                textNextButton = {MyLANG.GoToShop}
                                onPressBack = {onBack}
                                onPressNext = {
                                    () =>
                                        MyUtil.stackAction(false,
                                                           null,
                                                           MyConstant.StackAction.popToTop,
                                                           null,
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

ProductBuyScreen.navigationOptions = {};

export default ProductBuyScreen;

