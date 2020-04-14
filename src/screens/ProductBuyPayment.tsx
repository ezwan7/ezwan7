import React, {Fragment, useCallback, useEffect, useState} from 'react';

import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    RefreshControl, TouchableOpacity, StyleSheet,
} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import {ShadowBox} from "react-native-neomorph-shadows";
import {useForm} from "react-hook-form";

import MyUtil from '../common/MyUtil';
import {MyStyle, MyStyleSheet} from '../common/MyStyle';
import MyColor from '../common/MyColor';
import MyImage from '../shared/MyImage';
import {MyAPI, MyConfig} from '../shared/MyConfig';
import MyLANG from '../shared/MyLANG';
import {MyConstant} from '../common/MyConstant';
import MyIcon from '../components/MyIcon';
import {MyInput} from "../components/MyInput";

import {StatusBarLight} from '../components/MyComponent';

import {MyButton} from "../components/MyButton";
import {MyFastImage} from "../components/MyFastImage";
import {CartListItem, CartPageBottomButtons, CartPageTotal, OrderListItem} from "../shared/MyContainer";
import {useDispatch, useSelector} from "react-redux";
import MyFunction from "../shared/MyFunction";

let renderCount = 0;

const ProductBuyPayment = ({route, navigation}: any) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${ProductBuyPayment.name}. renderCount: `, renderCount);
    }

    const dispatch = useDispatch();

    const cart: any      = useSelector((state: any) => state.cart);
    const app_input: any = useSelector((state: any) => state.app_input);

    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${ProductBuyPayment.name}. useEffect: `, {cart, app_input});

        MyFunction.fetchPaymentMethod(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cart]);

    const onBack = () => {
        MyUtil.stackAction(false,
                           null,
                           MyConstant.StackAction.pop,
                           1,
                           null,
                           null
        )
    }

    return (
        <Fragment>
            <StatusBarLight/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView1}/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <View style = {[MyStyleSheet.SafeAreaView3, {backgroundColor: MyColor.backgroundGrey}]}>

                    <ScrollView
                        contentInsetAdjustmentBehavior = "automatic"
                        contentContainerStyle = {{paddingTop: MyStyle.headerHeightAdjusted, flexGrow: 1}}
                    >
                        <View style = {MyStyleSheet.cardViewPage}>
                            <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 4}]}>
                                {MyLANG.DeliveryAddress}
                            </Text>
                            <Text
                                numberOfLines = {1}>
                                Mr Mokhless
                            </Text>
                            <Text
                                numberOfLines = {1}>
                                +60 1154 215 2154
                            </Text>
                            <Text
                                numberOfLines = {4}>
                                Desaria Villa Condominium No.1, Jalan Desaria Kg, Kampung Pulau Meranti, 47120 Puchong, Selangor
                            </Text>

                        </View>

                        <View style = {MyStyleSheet.cardViewPage}>
                            <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 4}]}>
                                {MyLANG.CartItems}
                            </Text>
                            <OrderListItem items = {cart?.items}/>

                        </View>

                        <View style = {MyStyleSheet.cardViewPage}>
                            <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 4}]}>
                                {MyLANG.PaymentMethod}
                            </Text>

                            {app_input?.payment_method?.[0] &&
                             app_input.payment_method
                                      .map((prop: any) =>
                                               (
                                                   <Text
                                                       numberOfLines = {1}>
                                                       {prop?.name}
                                                   </Text>
                                               )
                                      )
                            }

                        </View>

                        <CartPageTotal
                            cart = {cart}
                            style = {{backgroundColor: MyColor.Material.WHITE, paddingBottom: MyStyle.paddingVerticalLogin}}
                        />

                    </ScrollView>

                </View>
            </SafeAreaView>
        </Fragment>
    )
}

ProductBuyPayment.navigationOptions = {};

export default ProductBuyPayment;

