import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    RefreshControl,
} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import {ShadowBox} from "react-native-neomorph-shadows";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";

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
import {CartPageBottomButtons} from "../shared/MyContainer";

let renderCount = 0;

const addressForm: any = {
    coupon_code: {
        ref           : {name: 'coupon_code'},
        value         : null,
        shouldValidate: true,
        validation    : {
            required : MyLANG.Coupon + ' ' + MyLANG.isRequired,
            minLength: {value: 4, message: MyLANG.Coupon + ' ' + MyLANG.mustBeMinimum + ' 4 ' + MyLANG.character},
            maxLength: {value: 32, message: MyLANG.Coupon + ' ' + MyLANG.mustBeMaximum + ' 32 ' + MyLANG.character}
        }
    },
}

const ProductBuyDelivery = ({route, navigation}: any) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${ProductBuyDelivery.name}. renderCount: `, renderCount);
    }

    const dispatch = useDispatch();

    const cart: any = useSelector((state: any) => state.cart);

    const {register, getValues, setValue, handleSubmit, formState, errors}: any = useForm(MyConfig.defaultUseForm);

    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${ProductBuyDelivery.name}. useEffect: `, cart);

    }, [cart]);

    useEffect(() => {
        // MyUtil.printConsole(true, 'log', `LOG: ${ProductBuyDelivery.name}. useEffect: `, 'register');
        for (const key of Object.keys(addressForm)) {
            if (addressForm[key]['ref']) {
                register(addressForm[key]['ref'], addressForm[key]['shouldValidate'] ? addressForm[key]['validation'] : null);
            }
        }
    }, [register]);

    const onBack = () => {
        MyUtil.stackAction(false,
                           null,
                           MyConstant.StackAction.pop,
                           1,
                           null,
                           null
        )
    }
    const onNext = () => {
        MyUtil.commonAction(false,
                            null,
                            MyConstant.CommonAction.navigate,
                            MyConfig.routeName.ProductBuyPayment,
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
                                {MyLANG.ShippingMethod}
                            </Text>
                            <MyInput
                                mode = "line"
                                floatingLabel = {MyLANG.Address}
                                onChangeText = {(text: any) => setValue('coupon_code', text, true)}
                                value = {getValues().coupon_code}
                                helperText = {{message: errors.coupon_code?.message ? errors.coupon_code.message : null}}
                            />
                            <MyInput
                                mode = "line"
                                floatingLabel = {MyLANG.City}
                                onChangeText = {(text: any) => setValue('coupon_code', text, true)}
                                value = {getValues().coupon_code}
                                helperText = {{message: errors.coupon_code?.message ? errors.coupon_code.message : null}}
                            />
                            <MyInput
                                mode = "line"
                                floatingLabel = {MyLANG.Country}
                                onChangeText = {(text: any) => setValue('coupon_code', text, true)}
                                value = {getValues().coupon_code}
                                helperText = {{message: errors.coupon_code?.message ? errors.coupon_code.message : null}}
                            />
                        </View>

                        <View style = {MyStyleSheet.cardViewPage}>
                            <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 4}]}>
                                {MyLANG.ShippingAddress}
                            </Text>
                        </View>

                        <View style = {MyStyleSheet.cardViewPage}>
                            <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 4}]}>
                                {MyLANG.BillingAddress}
                            </Text>
                        </View>

                    </ScrollView>

                    <CartPageBottomButtons
                        textBackButton = {MyLANG.Back}
                        onPressBack = {onBack}
                        textNextButton = {MyLANG.NextStep}
                        onPressNext = {onNext}
                    />

                </View>
            </SafeAreaView>
        </Fragment>
    )
}

ProductBuyDelivery.navigationOptions = {};

export default ProductBuyDelivery;

