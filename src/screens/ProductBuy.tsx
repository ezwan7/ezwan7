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

import MyUtil from '../common/MyUtil';
import {MyStyle, MyStyleSheet} from '../common/MyStyle';
import MyColor from '../common/MyColor';
import MyImage from '../shared/MyImage';
import {MyAPI, MyConfig} from '../shared/MyConfig';
import MyLANG from '../shared/MyLANG';
import {MyConstant} from '../common/MyConstant';
import MyIcon from '../components/MyIcon';
import {MyInput} from "../components/MyInput";

import {
    ListEmptyViewLottie,
    StatusBarLight
} from '../components/MyComponent';

import {MyButton} from "../components/MyButton";
import {MyFastImage} from "../components/MyFastImage";
import {CartListItem, CartPageBottomButtons, CartPageHeader, CartPageTotal} from "../shared/MyContainer";
import {useDispatch, useSelector} from "react-redux";
import {
    cartCalculateTotal,
    cartItemQuantityDecrement,
    cartItemQuantityIncrement,
    cartItemRemove, cartUpdateVoucher,
} from "../store/CartRedux";
import MyFunction from "../shared/MyFunction";

let renderCount = 0;

const couponForm: any = {
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

const ProductBuyScreen = ({route, navigation}: any) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${ProductBuyScreen.name}. renderCount: `, renderCount);
    }

    const dispatch = useDispatch();

    const cart: any                   = useSelector((state: any) => state.cart);
    const [refreshing, setRefreshing] = useState(false);

    const {register, getValues, setValue, handleSubmit, formState, errors}: any = useForm(MyConfig.useFormDefault);

    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${ProductBuyScreen.name}. useEffect: `, cart);

    }, [cart]);

    useEffect(() => {
        // MyUtil.printConsole(true, 'log', `LOG: ${ProductBuyScreen.name}. useEffect: `, 'register');
        for (const key of Object.keys(couponForm)) {
            if (couponForm[key]['ref']) {
                register(couponForm[key]['ref'], couponForm[key]['shouldValidate'] ? couponForm[key]['validation'] : null);
            }
        }
    }, [register]);

    const onRefresh = useCallback(async () => {
        MyUtil.printConsole(true, 'log', 'LOG: onRefresh: ', {});

        setRefreshing(true);
        dispatch(cartCalculateTotal());
        setRefreshing(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cartItemIncrement = (key: string) => {
        MyUtil.printConsole(true, 'log', 'LOG: cartItemIncrement: ', {key, cart});

        if (Number(cart?.items[key]?.item?.current_stock) > Number(cart?.items[key]?.quantity)) {
            dispatch(cartItemQuantityIncrement(key));
        } else {
            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.NoMoreInStock, false);
        }
    }

    const onCartItemRemove = (key: string) => {
        MyUtil.printConsole(true, 'log', 'LOG: onCartItemRemove: ', {key, cart});


        MyUtil.showAlert(MyLANG.Attention, MyLANG.CartItemRemoveAlert, false, [
            {
                text   : MyLANG.No,
                style  : 'cancel',
                onPress: () => {
                    MyUtil.printConsole(true, 'log', 'LOG: showAlert: ', 'Cancel');
                },
            },
            {
                text   : MyLANG.Yes,
                onPress: async () => {
                    MyUtil.printConsole(true, 'log', 'LOG: showAlert: ', 'OK');

                    dispatch(cartItemRemove(key));
                }
            },
        ])
    }

    const applyCoupon = async (e: any) => {
        const formValue: any = await MyUtil.formProcess(e, getValues, handleSubmit, formState, errors);
        MyUtil.printConsole(true, 'log', 'LOG: formProcess: await-response: ', {'formValue': formValue});

        if (formValue?.type === MyConstant.RESPONSE.TYPE.data && formValue?.data) {

            const response: any = await MyUtil
                .myHTTP(false, MyConstant.HTTP_POST, MyAPI.coupon_apply,
                        {
                            'language_id': MyConfig.LanguageActive,
                            'code'       : formValue.data.coupon_code,

                            'app_ver'      : MyConfig.app_version,
                            'app_build_ver': MyConfig.app_build_version,
                            'platform'     : MyConfig.app_platform,
                            'device'       : null,
                        }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, MyLANG.PleaseWait + '...', true, false
                );

            MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
                'apiURL': MyAPI.coupon_apply, 'response': response
            });

            if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data?.data?.data?.[0]) {

                const data = response.data.data.data[0];

                const coupon_discount: number = data?.amount;
                if (coupon_discount > 0) {

                    dispatch(cartUpdateVoucher({
                                                   id            : data?.coupans_id,
                                                   code          : data?.code,
                                                   discount_type : data?.discount_type,
                                                   minimum_amount: data?.minimum_amount,
                                                   maximum_amount: data?.maximum_amount,
                                               },
                                               coupon_discount
                    ));

                    MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, `${MyLANG.CouponApplied}${coupon_discount} ${MyLANG.Discounted}`, false);

                } else {

                    dispatch(cartUpdateVoucher({}, 0));

                    MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.CouponNotWorking, false);
                }

            } else {

                dispatch(cartUpdateVoucher({}, 0));

                MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, response.errorMessage ? response.errorMessage : MyLANG.CouponNotWorking, false);
            }

        } else {
            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT,
                               formValue.errorMessage ? formValue.errorMessage : MyLANG.CouponCodeInvalid,
                               false
            );
        }
    }

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
        MyUtil.commonAction(true,
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

                    {/*<CartPageHeader/>*/}

                    {
                        (cart?.items && Object.keys(cart?.items).length > 0 && cart?.items.constructor === Object) ?
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
                                    index = {0}
                                    onPressCartItemRemove = {(key: string) => onCartItemRemove(key)}
                                    onPressQuantityIncrement = {(key: string) => cartItemIncrement(key)}
                                    onPressQuantityDecrement = {(key: string) => dispatch(cartItemQuantityDecrement(key))}
                                />

                                <View style = {{
                                    display       : "flex",
                                    flexDirection : "column",
                                    justifyContent: "flex-start",
                                    alignItems    : "flex-start",

                                    marginVertical: MyStyle.marginViewGapCard,

                                    paddingHorizontal: MyStyle.marginHorizontalPage,
                                    paddingVertical  : MyStyle.marginVerticalList,
                                    paddingBottom    : MyStyle.marginVerticalLogin,

                                    backgroundColor: MyColor.Material.WHITE,
                                }}>
                                    <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 10}]}>
                                        {MyLANG.YouHaveGotCoupon}?
                                    </Text>

                                    <View style = {{
                                        flexDirection : "row",
                                        justifyContent: "flex-start",
                                        alignItems    : "center",

                                        backgroundColor: cart?.voucher?.item?.id && Number(cart?.voucher?.amount) > 0 ? MyColor.backgroundGrey : 'transparent',
                                        marginTop      : cart?.voucher?.item?.id && Number(cart?.voucher?.amount) > 0 ? 16 : 0,

                                        borderRadius: 100,
                                    }}>
                                        {(cart?.voucher?.item?.id && Number(cart?.voucher?.amount) > 0) ?
                                         <>
                                             <View
                                                 style = {{
                                                     flex       : 0.68,
                                                     marginRight: 4,

                                                     marginLeft: 24,
                                                 }}
                                             >
                                                 <Text
                                                     style = {{
                                                         fontFamily: MyStyle.FontFamily.Roboto.regular,
                                                         fontSize  : 14,
                                                         color     : MyColor.textDarkSecondary
                                                     }}
                                                 >
                                                     {cart?.voucher?.item?.code}
                                                 </Text>
                                                 <Text
                                                     style = {{
                                                         fontFamily: MyStyle.FontFamily.OpenSans.semiBold,
                                                         fontSize  : 15,
                                                         color     : MyColor.attentionDark,
                                                     }}
                                                 >
                                                     {MyConfig.Currency.MYR.symbol} {cart?.voucher?.amount} off
                                                 </Text>
                                             </View>
                                             <MyButton
                                                 fill = "solid"
                                                 color = {MyColor.Material.BLUEGREY["A400"]}
                                                 display = "inline"
                                                 title = {MyLANG.Remove}
                                                 linearGradientStyle = {{flex: 0.32, height: 46}}
                                                 onPress = {(e: any) => dispatch(cartUpdateVoucher({}, 0))}
                                             />
                                         </>
                                                                                                        :
                                         <>
                                             <MyInput
                                                 floatingLabel = {MyLANG.CouponCode}
                                                 floatingLabelBackground = {MyColor.backgroundGrey}
                                                 onChangeText = {(text: any) => setValue('coupon_code', text, true)}
                                                 value = {getValues().coupon_code}

                                                 viewGroupStyle = {{flex: 0.68, marginRight: 10}}
                                                 viewStyle = {{backgroundColor: MyColor.backgroundGrey}}

                                                 // helperText = {{message: errors.coupon_code?.message ? errors.coupon_code.message : null}}
                                             />
                                             <MyButton
                                                 fill = "solid"
                                                 color = {MyColor.Material.GREEN["700"]}
                                                 display = "inline"
                                                 title = {MyLANG.Apply}
                                                 linearGradientStyle = {{flex: 0.32, height: 46}}
                                                 onPress = {(e: any) => applyCoupon(e)}
                                             />
                                         </>
                                        }

                                    </View>
                                </View>

                                <CartPageTotal
                                    cart = {cart}
                                    service_charge = {false}
                                    delivery_charge = {false}
                                    tax = {false}
                                    total = {Number(cart?.subtotal) - Number(cart?.discount) - Number(cart?.voucher?.amount)}
                                    style = {{backgroundColor: MyColor.Material.WHITE, paddingBottom: MyStyle.paddingVerticalLogin}}
                                />

                                <MyButton
                                    color = {MyStyle.LGButtonPrimary}
                                    title = {MyLANG.Next}
                                    linearGradientStyle = {{marginVertical: MyStyle.marginVerticalPage, marginHorizontal: MyStyle.marginHorizontalPage}}
                                    onPress = {onNext}
                                />

                            </ScrollView>

                            {/*<CartPageBottomButtons
                                textBackButton = {MyLANG.Back}
                                onPressBack = {onBack}
                                textNextButton = {MyLANG.NextStep}
                                onPressNext = {onNext}
                            />*/}

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
                            {/*<CartPageBottomButtons
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
                                        )
                                }
                            />*/}
                        </>
                    }

                </View>
            </SafeAreaView>
        </Fragment>
    )
}

ProductBuyScreen.navigationOptions = {};

export default ProductBuyScreen;

