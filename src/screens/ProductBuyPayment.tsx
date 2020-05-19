import React, {Fragment, useCallback, useEffect, useState} from 'react';

import {View, Text, SafeAreaView, ScrollView, RefreshControl, TouchableOpacity, StyleSheet, TextInput} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {useFocusEffect} from "@react-navigation/native";
import NumberFormat from "react-number-format";
import * as yup from "yup";

import MyUtil from '../common/MyUtil';
import {MyStyle, MyStyleSheet} from '../common/MyStyle';
import MyColor from '../common/MyColor';
import MyImage from '../shared/MyImage';
import {MyAPI, MyConfig} from '../shared/MyConfig';
import MyLANG from '../shared/MyLANG';
import {MyConstant} from '../common/MyConstant';
import MyIcon from '../components/MyIcon';
import {MyInput} from "../components/MyInput";
import MyFunction from "../shared/MyFunction";
import MyMaterialRipple from "../components/MyMaterialRipple";
import {MyFastImage} from "../components/MyFastImage";

import {StatusBarLight} from '../components/MyComponent';
import {MyButton} from "../components/MyButton";
import {AddressListItem, CartPageBottomButtons, CartPageTotal, ModalRadioList, CartListItemSmall, ModalNotFullScreen} from "../shared/MyContainer";
import {MyModal} from "../components/MyModal";
import {cartUpdateDelivery} from "../store/CartRedux";
import {MyWebView} from "../components/MyWebView";


let renderCount = 0;


const orderFormSchema: any = yup.object().shape(
    {
        id              : yup.number()
                             .max(14, MyLANG.ID + ' ' + MyLANG.mustBeMaximum + ' 14 ' + MyLANG.character),
        delivery_type   : yup.object()
                             .required(MyLANG.DeliveryType + ' ' + MyLANG.isRequired),
        pickup_address  : yup.object()
                             .when('delivery_type', {
                                 is  : (val: any) => val?.id === MyConfig.DeliveryType.PickUp.id,
                                 then: yup.object().required(MyLANG.PickupAddress + ' ' + MyLANG.isRequired),
                             }),
        receiver_name   : yup.string()
                             .max(255, MyLANG.ReceiverName + ' ' + MyLANG.mustBeMaximum + ' 255 ' + MyLANG.character)
                             .when('delivery_type', {
                                 is  : (val: any) => val?.id === MyConfig.DeliveryType.PickUp.id,
                                 then: yup.string().required(MyLANG.ReceiverName + ' ' + MyLANG.isRequired),
                             }),
        receiver_phone  : yup.string()
                             .max(16, MyLANG.ReceiverPhoneNumber + ' ' + MyLANG.mustBeMaximum + ' 16 ' + MyLANG.character)
                             .matches(MyConstant.Validation.phone, MyLANG.InvalidPhone)
                             .when('delivery_type', {
                                 is  : (val: any) => val?.id === MyConfig.DeliveryType.PickUp.id,
                                 then: yup.string().required(MyLANG.ReceiverPhoneNumber + ' ' + MyLANG.isRequired),
                             }),
        receiver_ic     : yup.string()
                             .max(64, MyLANG.ReceiverICPassport + ' ' + MyLANG.mustBeMaximum + ' 64 ' + MyLANG.character)
                             .when('delivery_type', {
                                 is  : (val: any) => val?.id === MyConfig.DeliveryType.PickUp.id,
                                 then: yup.string().required(MyLANG.ReceiverICPassport + ' ' + MyLANG.isRequired),
                             }),
        delivery_address: yup.object()
                             .when('delivery_type', {
                                 is  : (val: any) => val?.id === MyConfig.DeliveryType.Courier.id,
                                 then: yup.object().required(MyLANG.DeliveryAddress + ' ' + MyLANG.isRequired),
                             }),
        delivery_method : yup.object()
                             .when('delivery_type', {
                                 is  : (val: any) => val?.id === MyConfig.DeliveryType.Courier.id,
                                 then: yup.object().required(MyLANG.DeliveryMethod + ' ' + MyLANG.isRequired),
                             }),
        payment_method  : yup.object()
                             .required(MyLANG.PaymentMethod + ' ' + MyLANG.isRequired),
        billing_address : yup.object()
                             .required(MyLANG.BillingAddress + ' ' + MyLANG.isRequired),
        order_note      : yup.string()
                             .max(1000, MyLANG.OrderNote + ' ' + MyLANG.mustBeMaximum + ' 1000 ' + MyLANG.character),
    }
);

const ProductBuyPayment = ({route, navigation}: any) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${ProductBuyPayment.name}. renderCount: `, renderCount);
    }

    const dispatch = useDispatch();

    const user: any      = useSelector((state: any) => state.auth.user);
    const app_input: any = useSelector((state: any) => state.app_input);
    const addresses: any = useSelector((state: any) => state.addresses);
    const cart: any      = useSelector((state: any) => state.cart);

    const [deliveryMethodList, setDeliveryMethodList] = useState([]);

    const [modalVisiblePickupAddress, setModalVisiblePickupAddress]     = useState(false);
    const [modalVisibleDeliveryAddress, setModalVisibleDeliveryAddress] = useState(false);
    const [modalVisibleBillingAddress, setModalVisibleBillingAddress]   = useState(false);
    const [modalVisibleDeliveryMethod, setModalVisibleDeliveryMethod]   = useState(false);
    const [modalVisiblePaymentMethod, setModalVisiblePaymentMethod]     = useState(false);

    const {register, getValues, setValue, handleSubmit, formState, errors, reset, triggerValidation, watch}: any = useForm(
        {
            mode                : 'onSubmit',
            reValidateMode      : 'onChange',
            // defaultValues       : defaultValues,
            validationSchema    : orderFormSchema,
            validateCriteriaMode: 'all',
            submitFocusError    : true,
        }
    );

    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${ProductBuyPayment.name}. useEffect: `, 'register');

        for (const key of Object.keys(orderFormSchema['fields'])) {
            if (key) {
                register({name: key});
            }
        }
    }, [register]);

    const values                                                                                              = getValues();
    const {delivery_type, delivery_address, pickup_address, billing_address, delivery_method, payment_method} = watch(['delivery_type', 'delivery_address', 'pickup_address', 'billing_address', 'delivery_method', 'payment_method']);


    useFocusEffect(
        useCallback(() => {

            MyUtil.printConsole(true, 'log', `LOG: ${ProductBuyPayment.name}. useFocusEffect: `, {addresses, params: route?.params});

            if (route?.params?.updateAddress === true) {
                //await MyFunction.fetchAddress(user?.id, user?.customers_telephone);
                getDefaultDeliveryAddress();
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [route.params, addresses])
    );

    useEffect(() => {

        MyUtil.printConsole(true, 'log', `LOG: ${ProductBuyPayment.name}. useEffect: []`, null);

        dispatch(cartUpdateDelivery(0));

        MyFunction.fetchDeliveryType(false);

        MyFunction.fetchAddress(user?.id, user?.customers_telephone);

        MyFunction.fetchTax(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${ProductBuyPayment.name}. useEffect: `, {app_input, addresses, cart, values});

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [app_input, addresses, cart]);

    // TODO: validation lag 1 step back


    const getDefaultDeliveryAddress = (formParam: any = {}, showInfoMessage: any = false) => {

        // Pick Default Address:
        let address_default: any         = addresses?.[0];
        const default_address_id: number = addresses.find((e: any) => Number(e.default_address) > 0)?.default_address;
        if (Number(default_address_id) > 0) {
            address_default = addresses.find((e: any) => Number(e.id) === default_address_id);
        }
        if (address_default?.id) {
            setValue('delivery_address', address_default, false);

            onChangeDeliveryPayment(
                {
                    'zone_id': address_default?.zone_id,
                    'city_id': address_default?.city_id,
                    ...formParam,
                },
                showInfoMessage,
            );
        }

        MyUtil.printConsole(true, 'log', `LOG: getDefaultDeliveryAddress: `, {default_address_id, address_default, delivery_address});
    }

    const onChangeDeliveryPayment = async (item: any, showInfoMessage: any = false) => {

        setValue('delivery_method', undefined, false);
        setValue('payment_method', undefined, false);

        dispatch(cartUpdateDelivery(0));

        const data = await MyFunction.fetchDeliveryMethod(
            {
                'total'  : cart?.total,
                'time'   : MyUtil.momentFormat(new Date(), MyConstant.MomentFormat["1970-01-01 20:01:01"]),
                'zone_id': delivery_address?.zone_id,
                'city_id': delivery_address?.city_id,
                ...item,
            },
            MyLANG.PleaseWait + '...',
            MyLANG.DeliveryMethodUpdated,
            MyLANG.DeliveryMethodUpdateFailed,
        );

        if (data) {
            if (data?.length > 0) {
                setDeliveryMethodList(data);
            }

            if (showInfoMessage !== false) {
                MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.DeliveryMethodUpdated, false);
            }

        } else {

            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.DeliveryMethodUpdateFailed, false);
        }

        MyFunction.fetchPaymentMethod(
            {
                'total'  : cart?.total,
                'time'   : MyUtil.momentFormat(new Date(), MyConstant.MomentFormat["1970-01-01 20:01:01"]),
                'zone_id': delivery_address?.zone_id,
                'city_id': delivery_address?.city_id,
                ...item,
            }, false);

        MyUtil.printConsole(true, 'log', `LOG: getDeliveryMethod: `, {item, cart, data});
    }

    const onDeliveryType = (item: any) => {

        setValue('delivery_type', item, true);

        if (item?.id === MyConfig.DeliveryType.Courier.id && !delivery_address?.id) {
            getDefaultDeliveryAddress({'delivery_type': item?.id}, false);
        } else {
            onChangeDeliveryPayment({'delivery_type': item?.id});
        }

        MyUtil.printConsole(true, 'log', `LOG: onDeliveryType: `, {item, delivery_address});
    }

    const onModalVisible = (key: string) => {

        switch (key) {

            case 'pickup_address':
                setModalVisiblePickupAddress(true);
                break;

            case 'delivery_address':
                setModalVisibleDeliveryAddress(true);
                break;

            case 'billing_address':
                setModalVisibleBillingAddress(true);
                break;

            case 'delivery_method':
                if (delivery_type?.id === MyConfig.DeliveryType.PickUp.id) {
                    MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.DeliveryMethodPickupErrorMessage, false);
                } else if (deliveryMethodList?.length > 0) {
                    setModalVisibleDeliveryMethod(true);
                } else {
                    MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.DeliveryMethodEmptyMessage, false);
                }
                break;

            case 'payment_method':
                setModalVisiblePaymentMethod(true);
                break;

            default:
                break;
        }

        MyUtil.printConsole(true,
                            'log',
                            `LOG: onModalVisible: `,
                            {addresses, pickup_address, delivery_address, billing_address, delivery_method, payment_method}
        );
    }

    const onModalItem = (item: any, key: string) => {

        switch (key) {

            case 'pickup_address':
                setModalVisiblePickupAddress(false);

                const points_pickup_fee: number = Number(item?.points_pickup_fee) > 0 ? Number(item?.points_pickup_fee) : 0;
                dispatch(cartUpdateDelivery(points_pickup_fee));

                break;

            case 'delivery_address':
                setModalVisibleDeliveryAddress(false);
                onChangeDeliveryPayment({'delivery_type': delivery_type?.id, 'zone_id': item?.zone_id, 'city_id': item?.city_id}, true);
                break;

            case 'billing_address':
                setModalVisibleBillingAddress(false);
                break;

            case 'delivery_method':
                setModalVisibleDeliveryMethod(false);

                const delivery_cost: number = Number(item?.price) > 0 ? Number(item?.price) : 0;
                dispatch(cartUpdateDelivery(delivery_cost));

                break;

            case 'payment_method':
                setModalVisiblePaymentMethod(false);
                break;

            default:
                break;
        }

        setValue(key, item, false);

        MyUtil.printConsole(true,
                            'log',
                            `LOG: onModalItem: `,
                            {item, key, pickup_address, delivery_address, billing_address, delivery_method, payment_method}
        );
    };

    const formSubmit = async (e: any) => {

        const formValue: any = await MyUtil.formProcess(e, getValues, handleSubmit, formState, errors);

        MyUtil.printConsole(true, 'log', 'LOG: formProcess: await-response: ', {'formValue': formValue});

        if (formValue && formValue.type === MyConstant.RESPONSE.TYPE.data && formValue.data) {

            MyUtil.showAlert(MyLANG.Attention, MyLANG.OrderPlaceAlert, false, [
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

                        switch (payment_method?.id) {

                            case MyConfig.PaymentMethod.CashOnDelivery.id:
                                orderPlace();
                                break;

                            case MyConfig.PaymentMethod.CreditCard:

                                const paymentGatewayUrl: string = MyAPI.payment_gateway;

                                MyUtil.commonAction(false,
                                                    null,
                                                    MyConstant.CommonAction.navigate,
                                                    MyConfig.routeName.MyWebViewPage,
                                                    {source: paymentGatewayUrl},
                                                    null,
                                );
                                break;

                            case MyConfig.PaymentMethod.Grabpay:

                                break;

                            default:
                                break;
                        }
                    }
                },
            ])

        } else {
            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT,
                               formValue.errorMessage ? formValue.errorMessage : MyLANG.FormInvalid,
                               false
            );
        }
    };


    const orderPlace = async () => {

        const cart_array: any = new Array();

        for (const key of Object.keys(cart)) {
            if (key) {
                cart_array.push(cart?.[key]?.item);
            }
        }

        const response: any = await MyFunction.placeOrder(
            {

                products: cart_array,

                // products_id,attributes in array products_options,products_options_values,options_values_price,price_prefix

                customers_id       : user?.id,
                email              : user?.email,
                customers_telephone: user?.customers_telephone,

                delivery_firstname     : delivery_address?.firstname,
                delivery_lastname      : delivery_address?.lastname,
                delivery_street_address: delivery_address?.street,
                delivery_suburb        : delivery_address?.suburb,
                delivery_city          : delivery_address?.city,
                delivery_postcode      : delivery_address?.postcode,
                delivery_zone          : delivery_address?.zone_id,
                delivery_country       : delivery_address?.countries_id,

                receiver_name : values.receiver_name,
                receiver_phone: values.receiver_phone,
                receiver_ic   : values.receiver_ic,

                billing_firstname     : billing_address?.firstname,
                billing_lastname      : billing_address?.lastname,
                billing_street_address: billing_address?.street,
                billing_suburb        : billing_address?.suburb,
                billing_city          : billing_address?.city,
                billing_postcode      : billing_address?.postcode,
                billing_zone          : billing_address?.zone_id,
                billing_country       : billing_address?.countries_id,

                shipping_method: delivery_method?.id,
                shipping_cost  : cart?.delivery_charge,
                payment_method : payment_method?.id,

                is_coupon_applied: cart?.voucher?.amount > 0,
                coupon_amount    : cart?.voucher?.amount,
                total_tax        : cart?.tax,
                totalPrice       : cart?.total,

                comments: values.order_note,

                currency_code: MyConfig.Currency.MYR.code,

                delivery_phone: delivery_address?.phone,
                billing_phone : billing_address?.phone,

                // currency_value   : user?.id,
            },
            MyLANG.PleaseWait + '...',
            MyLANG.OrderPlacedSuccessfully,
            MyLANG.OrderPlacedFailed,
        );

        if (Number(response?.id) > 0) {

            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.OrderPlacedSuccessfully, false);

            MyUtil.commonAction(false,
                                null,
                                MyConstant.CommonAction.navigate,
                                MyConfig.routeName.ProductBuySuccess,
                                {id: response?.id, item: response},
                                null,
            );

            // Reset Cart, Navigation Stack.

        } else {

            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT, MyLANG.OrderPlacedFailed, false);
        }
    };

    const onAddressManage = () => {
        // MyUtil.printConsole(true, 'log', `LOG: onDeliveryAddressAdd: `, {});

        MyUtil.commonAction(true,
                            navigation,
                            MyConstant.CommonAction.navigate,
                            MyConfig.routeName.MyAddress,
                            {routeName: MyConfig.routeName.ProductBuyPayment, params: {'updateAddress': true}},
                            null,
        )
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

    return (
        <Fragment>
            <StatusBarLight/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView1}/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <View style = {[MyStyleSheet.SafeAreaView3, {backgroundColor: MyColor.backgroundGrey}]}>

                    <ScrollView
                        contentInsetAdjustmentBehavior = "automatic"
                        contentContainerStyle = {{paddingTop: MyStyle.headerHeightAdjusted}}
                    >

                        <View style = {[MyStyleSheet.viewPageCard, {marginTop: MyStyle.marginViewGapCardTop}]}>
                            <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 4}]}>
                                {MyLANG.CartItems}
                            </Text>
                            <CartListItemSmall items = {cart?.items}/>

                        </View>

                        <View style = {MyStyleSheet.viewPageCard}>
                            <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 2}]}>
                                {MyLANG.DeliveryType}
                            </Text>
                            <Text style = {[MyStyleSheet.textListItemSubTitle, {marginBottom: 4}]}>
                                {MyLANG.DeliveryTypeDesc}
                            </Text>

                            <View style = {[MyStyle.RowBetweenCenter, {marginTop: MyStyle.marginVerticalList}]}>
                                {app_input?.delivery_type && app_input?.delivery_type.map(
                                    (item: any, index: number) => (
                                        <MyMaterialRipple
                                            key = {index}
                                            style = {[MyStyle.ColumnCenter, styles.rippleDeliveryType, delivery_type?.id === item?.id && styles.rippleDeliveryTypeSelected]}
                                            {...MyStyle.MaterialRipple.drawer}
                                            onPress = {() => onDeliveryType(item)}
                                        >
                                            <MyFastImage
                                                source = {[item?.image?.length > 9 ? {'uri': item?.image} : MyImage.logo_white, MyImage.logo_white]}
                                                style = {{
                                                    width       : (MyStyle.screenWidth * 0.5) - 120,
                                                    height      : (MyStyle.screenWidth * 0.5) - 120,
                                                    marginBottom: 10,
                                                }}
                                                resizeMode = "contain"
                                            />
                                            {/*<MyIcon.Fontisto
                                                name = {prop?.icon}
                                                size = {32}
                                                color = {MyColor.Material.GREY["800"]}
                                                style = {{marginBottom: 12}}
                                            />*/}
                                            <Text style = {[MyStyleSheet.textListItemTitleDark, {paddingBottom: 14}]}>
                                                {item?.name}
                                            </Text>
                                        </MyMaterialRipple>
                                    )
                                )}
                            </View>
                        </View>

                        {(delivery_type?.id === MyConfig.DeliveryType.PickUp.id) &&
                         <View style = {[MyStyleSheet.viewPageCard, {paddingHorizontal: 0}]}>

                             <View style = {[MyStyle.RowBetweenCenter, {paddingHorizontal: MyStyle.paddingHorizontalPage}]}>
                                 <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 4}]}>{MyLANG.PickupAddress}</Text>
                             </View>

                             <MyMaterialRipple
                                 style = {[MyStyleSheet.viewPageCard, MyStyle.RowLeftCenter, {paddingRight: 8}]}
                                 {...MyStyle.MaterialRipple.drawer}
                                 onPress = {() => onModalVisible('pickup_address')}
                             >
                                 <MyIcon.SimpleLineIcons
                                     name = "map"
                                     size = {26}
                                     color = {MyColor.textDarkSecondary}
                                     style = {{alignSelf: "flex-start", marginTop: 6}}
                                 />

                                 {
                                     pickup_address?.id ?
                                     <View style = {[MyStyle.ColumnCenterStart, {flex: 1, marginHorizontal: 14}]}>
                                         <Text style = {MyStyleSheet.textListItemTitleDark}>
                                             {pickup_address?.points_name}
                                         </Text>
                                         <Text style = {MyStyleSheet.textListItemSubTitleAlt}>
                                             {pickup_address?.points_address}
                                         </Text>
                                         <Text style = {MyStyleSheet.textListItemSubTitleAlt}>
                                             {pickup_address?.points_city}
                                         </Text>
                                         <Text style = {MyStyleSheet.textListItemSubTitleAlt}>
                                             {pickup_address?.points_state}
                                         </Text>
                                         <Text style = {MyStyleSheet.textListItemSubTitleAlt}>
                                             {pickup_address?.country_name}
                                         </Text>
                                         <Text style = {MyStyleSheet.textListItemSubTitleAlt}>
                                             {pickup_address?.points_zip}
                                         </Text>
                                         <Text style = {[MyStyleSheet.textListItemTitle2Dark, {marginTop: 3}]}>
                                             {MyLANG.OpeningHours}: {pickup_address?.points_opening_hours}
                                         </Text>
                                         <Text style = {[MyStyleSheet.textListItemSubTitleAlt, {}]}>
                                             {MyLANG.PickupFee}: {MyConfig.Currency.MYR.symbol} {pickup_address?.points_pickup_fee}
                                         </Text>
                                     </View>
                                                        :
                                     <View style = {[MyStyle.ColumnCenterStart, {flex: 1, marginHorizontal: 14}]}>
                                         <Text style = {[MyStyleSheet.textListItemTitleDark]}>
                                             {MyLANG.SelectPickupAddress}
                                         </Text>
                                         <Text style = {[MyStyleSheet.textListItemSubTitle]}>
                                             {MyLANG.SelectPickupAddressDesc}
                                         </Text>
                                     </View>
                                 }

                                 <MyIcon.Entypo
                                     name = "chevron-right"
                                     size = {20}
                                     color = {MyColor.Material.GREY["800"]}
                                     style = {{}}
                                 />
                             </MyMaterialRipple>

                         </View>
                        }

                        {(delivery_type?.id === MyConfig.DeliveryType.PickUp.id) &&
                         <View style = {[MyStyleSheet.viewPageCard, {}]}>

                             <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 2}]}>
                                 {MyLANG.ReceiverDetails}
                             </Text>
                             <Text style = {[MyStyleSheet.textListItemSubTitle, {marginBottom: 4}]}>
                                 {MyLANG.ReceiverDetailsDesc}
                             </Text>

                             <View style = {[{marginTop: MyStyle.marginVerticalList}]}>
                                 <MyInput
                                     mode = "line"
                                     floatingLabel = {MyLANG.ReceiverName}
                                     readyBorderColor = {{borderColor: MyColor.Primary.first}}
                                     onChangeText = {(text: any) => setValue('receiver_name', text, true)}
                                     value = {values.receiver_name}
                                     viewStyle = {{borderColor: MyColor.Material.GREY["300"]}}
                                     helperText = {{message: errors.receiver_name?.message ? errors.receiver_name.message : null}}
                                 />
                                 <MyInput
                                     mode = "line"
                                     floatingLabel = {MyLANG.ReceiverPhoneNumber}
                                     placeholderLabel = "+60 00 0000 0000"
                                     mask = {"+60 [00] [0000] [9999]"}
                                     inputProps = {{keyboardType: 'phone-pad'}}
                                     onChangeText = {(text: any) => setValue('receiver_phone', text, true)}
                                     value = {values.receiver_phone}
                                     viewStyle = {{borderColor: MyColor.Material.GREY["300"]}}
                                     helperText = {{message: errors.receiver_phone?.message ? errors.receiver_phone.message : null}}
                                 />
                                 <MyInput
                                     mode = "line"
                                     floatingLabel = {MyLANG.ReceiverICPassport}
                                     readyBorderColor = {{borderColor: MyColor.Primary.first}}
                                     onChangeText = {(text: any) => setValue('receiver_ic', text, true)}
                                     value = {values.receiver_ic}
                                     viewStyle = {{borderColor: MyColor.Material.GREY["300"]}}
                                     helperText = {{message: errors.receiver_ic?.message ? errors.receiver_ic.message : null}}
                                 />
                             </View>

                         </View>
                        }

                        {(delivery_type?.id === MyConfig.DeliveryType.Courier.id) &&
                         <View style = {[MyStyleSheet.viewPageCard, {paddingHorizontal: 0}]}>

                             <View style = {[MyStyle.RowBetweenTop, {paddingHorizontal: MyStyle.paddingHorizontalPage}]}>
                                 <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 4}]}>{MyLANG.DeliveryAddress}</Text>
                                 <TouchableOpacity
                                     activeOpacity = {0.8}
                                     onPress = {onAddressManage}
                                 >
                                     <Text style = {{...MyStyleSheet.linkTextList}}>{MyLANG.ManageAddress}</Text>
                                 </TouchableOpacity>
                             </View>

                             {delivery_address?.id ?
                              <AddressListItem
                                  item = {delivery_address}
                                  onPress = {() => onModalVisible('delivery_address')}
                                  rippleStyle = {{
                                      marginTop      : 5,
                                      paddingLeft    : 9,
                                      backgroundColor: MyColor.Material.WHITE
                                  }}
                                  address_title = {true}
                                  phone = {user?.customers_telephone}
                              />
                                                   :

                              <MyMaterialRipple
                                  style = {[MyStyleSheet.viewPageCard, MyStyle.RowLeftCenter, {paddingRight: 8}]}
                                  {...MyStyle.MaterialRipple.drawer}
                                  onPress = {() => onModalVisible('delivery_address')}
                              >
                                  <MyIcon.SimpleLineIcons
                                      name = "notebook"
                                      size = {26}
                                      color = {MyColor.textDarkSecondary}
                                      style = {{}}
                                  />
                                  <View style = {[MyStyle.ColumnCenterStart, {flex: 1, marginHorizontal: 14}]}>
                                      <Text style = {[MyStyleSheet.textListItemTitleDark]}>
                                          {MyLANG.SelectAddress}
                                      </Text>
                                      <Text style = {[MyStyleSheet.textListItemSubTitle]}>
                                          {MyLANG.SelectDeliveryAddressDesc}
                                      </Text>
                                  </View>
                                  <MyIcon.Entypo
                                      name = "chevron-right"
                                      size = {20}
                                      color = {MyColor.Material.GREY["800"]}
                                      style = {{}}
                                  />
                              </MyMaterialRipple>}

                         </View>
                        }

                        <View style = {[MyStyleSheet.viewPageCard, {paddingHorizontal: 0}]}>

                            <View style = {[MyStyle.RowBetweenTop, {paddingHorizontal: MyStyle.paddingHorizontalPage}]}>
                                <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 4}]}>{MyLANG.BillingAddress}</Text>
                                <TouchableOpacity activeOpacity = {0.8}
                                                  onPress = {onAddressManage}>
                                    <Text style = {{...MyStyleSheet.linkTextList}}>{MyLANG.ManageAddress}</Text>
                                </TouchableOpacity>
                            </View>

                            {billing_address?.id ?
                             <AddressListItem
                                 item = {billing_address}
                                 onPress = {() => onModalVisible('billing_address')}
                                 rippleStyle = {{
                                     marginTop      : 5,
                                     paddingLeft    : 16,
                                     backgroundColor: MyColor.Material.WHITE
                                 }}
                                 iconLeft = {{name: 'envelope', size: 21, style: {alignSelf: "flex-start", marginTop: 2, marginRight: 10, marginLeft: 8}}}
                                 address_title = {true}
                                 phone = {user?.customers_telephone}
                             />
                                                 :

                             <MyMaterialRipple
                                 style = {[MyStyleSheet.viewPageCard, MyStyle.RowLeftCenter, {paddingRight: 8}]}
                                 {...MyStyle.MaterialRipple.drawer}
                                 onPress = {() => onModalVisible('billing_address')}
                             >
                                 <MyIcon.SimpleLineIcons
                                     name = "notebook"
                                     size = {26}
                                     color = {MyColor.textDarkSecondary}
                                     style = {{}}
                                 />
                                 <View style = {[MyStyle.ColumnCenterStart, {flex: 1, marginHorizontal: 14}]}>
                                     <Text style = {[MyStyleSheet.textListItemTitleDark]}>
                                         {MyLANG.SelectAddress}
                                     </Text>
                                     <Text style = {[MyStyleSheet.textListItemSubTitle]}>
                                         {MyLANG.SelectBillingAddressDesc}
                                     </Text>
                                 </View>
                                 <MyIcon.Entypo
                                     name = "chevron-right"
                                     size = {20}
                                     color = {MyColor.Material.GREY["800"]}
                                     style = {{}}
                                 />
                             </MyMaterialRipple>
                            }
                        </View>

                        {(delivery_type?.id === MyConfig.DeliveryType.Courier.id) &&
                         <View style = {[MyStyleSheet.viewPageCard, {paddingHorizontal: 0, paddingBottom: 0}]}>
                             <View style = {[MyStyle.RowBetweenCenter, {paddingHorizontal: MyStyle.paddingHorizontalPage}]}>
                                 <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 4}]}>{MyLANG.DeliveryMethod}</Text>
                                 {/*<TouchableOpacity activeOpacity = {0.8}
                                                  onPress = {onAddressManage}>
                                    <Text style = {{...MyStyleSheet.linkTextList}}>{MyLANG.AddAddress}</Text>
                                </TouchableOpacity>*/}
                             </View>

                             <MyMaterialRipple
                                 style = {[MyStyleSheet.viewPageCard, MyStyle.RowLeftCenter, {paddingRight: 8}]}
                                 {...MyStyle.MaterialRipple.drawer}
                                 onPress = {() => onModalVisible('delivery_method')}
                             >
                                 <MyIcon.SimpleLineIcons
                                     name = "handbag"
                                     size = {26}
                                     color = {MyColor.textDarkSecondary}
                                     style = {{}}
                                 />
                                 {
                                     delivery_method?.id ?
                                     <View style = {[MyStyle.ColumnCenterStart, {flex: 1, marginHorizontal: 14}]}>
                                         <Text style = {[MyStyleSheet.textListItemTitleDark]}>
                                             {delivery_method?.name}
                                         </Text>
                                         <NumberFormat
                                             value = {delivery_method?.price}
                                             defaultValue = {0}
                                             displayType = {'text'}
                                             thousandSeparator = {true}
                                             decimalScale = {2}
                                             fixedDecimalScale = {true}
                                             decimalSeparator = {'.'}
                                             renderText = {
                                                 (value: any) =>
                                                     <Text style = {MyStyleSheet.textListItemSubTitle}>
                                                         {MyLANG.DeliveryCost} {MyConfig.Currency.MYR.symbol} {value}
                                                     </Text>
                                             }
                                         />
                                     </View>
                                                         :
                                     <View style = {[MyStyle.ColumnCenterStart, {flex: 1, marginHorizontal: 14}]}>
                                         <Text style = {[MyStyleSheet.textListItemTitleDark]}>
                                             {MyLANG.SelectDeliveryMethod}
                                         </Text>
                                         <Text style = {[MyStyleSheet.textListItemSubTitle]}>
                                             {MyLANG.SelectedDeliveryMethodDesc}
                                         </Text>
                                     </View>
                                 }
                                 <MyIcon.Entypo
                                     name = "chevron-right"
                                     size = {20}
                                     color = {MyColor.Material.GREY["800"]}
                                     style = {{}}
                                 />
                             </MyMaterialRipple>

                         </View>
                        }

                        <View style = {[MyStyleSheet.viewPageCard, {paddingHorizontal: 0, paddingBottom: 0}]}>
                            <View style = {[MyStyle.RowBetweenCenter, {paddingHorizontal: MyStyle.paddingHorizontalPage}]}>
                                <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 4}]}>{MyLANG.PaymentMethod}</Text>
                                {/*<TouchableOpacity activeOpacity = {0.8}
                                                  onPress = {onAddressManage}>
                                    <Text style = {{...MyStyleSheet.linkTextList}}>{MyLANG.AddAddress}</Text>
                                </TouchableOpacity>*/}
                            </View>

                            <MyMaterialRipple
                                style = {[MyStyleSheet.viewPageCard, MyStyle.RowLeftCenter, {paddingRight: 8}]}
                                {...MyStyle.MaterialRipple.drawer}
                                onPress = {() => onModalVisible('payment_method')}
                            >
                                <MyIcon.SimpleLineIcons
                                    name = "wallet"
                                    size = {26}
                                    color = {MyColor.textDarkSecondary}
                                    style = {{}}
                                />
                                {
                                    payment_method?.id ?
                                    <View style = {[MyStyle.ColumnCenterStart, {flex: 1, marginHorizontal: 14}]}>
                                        <Text style = {[MyStyleSheet.textListItemTitleDark]}>
                                            {payment_method?.name}
                                        </Text>
                                        <Text style = {[MyStyleSheet.textListItemSubTitle]}>
                                            {MyLANG.SelectedPaymentMethodDesc}
                                        </Text>
                                    </View>
                                                       :
                                    <View style = {[MyStyle.ColumnCenterStart, {flex: 1, marginHorizontal: 14}]}>
                                        <Text style = {[MyStyleSheet.textListItemTitleDark]}>
                                            {MyLANG.SelectPaymentMethod}
                                        </Text>
                                        <Text style = {[MyStyleSheet.textListItemSubTitle]}>
                                            {MyLANG.SelectPaymentMethodDesc}
                                        </Text>
                                    </View>
                                }
                                <MyIcon.Entypo
                                    name = "chevron-right"
                                    size = {20}
                                    color = {MyColor.Material.GREY["800"]}
                                    style = {{}}
                                />
                            </MyMaterialRipple>

                        </View>

                        <View style = {[MyStyleSheet.viewPageCard, {}]}>

                            <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 2}]}>
                                {MyLANG.OrderNote}
                            </Text>
                            <Text style = {[MyStyleSheet.textListItemSubTitle, {marginBottom: 4}]}>
                                {MyLANG.PleaseWriteNotesOfYourOrder}
                            </Text>

                            <View style = {[{marginTop: MyStyle.marginVerticalList}]}>
                                <TextInput
                                    style = {{
                                        fontFamily       : MyStyle.FontFamily.OpenSans.semiBold,
                                        fontSize         : MyStyle.FontSize.small,
                                        color            : MyColor.Material.BLACK,
                                        borderColor      : MyColor.Material.GREY["300"],
                                        borderWidth      : 1,
                                        paddingHorizontal: MyStyle.paddingHorizontalList / 2,
                                    }}
                                    multiline = {true}
                                    numberOfLines = {5}
                                    onChangeText = {(text: any) => setValue('order_note', text, true)}
                                    // value = {order_note}
                                />
                            </View>

                        </View>

                        <CartPageTotal
                            cart = {cart}
                            service_charge = {false}
                            style = {{backgroundColor: MyColor.Material.WHITE, paddingBottom: MyStyle.paddingVerticalLogin}}
                        />

                        <MyButton
                            color = {MyStyle.LGButtonPrimary}
                            title = {MyLANG.PlaceOrder}
                            linearGradientStyle = {{marginVertical: MyStyle.marginVerticalPage, marginHorizontal: MyStyle.marginHorizontalPage}}
                            onPress = {(e: any) => {
                                formSubmit(e);
                            }}
                        />

                    </ScrollView>

                </View>

                {delivery_type?.id === MyConfig.DeliveryType.PickUp.id &&
                 <MyModal
                     visible = {modalVisiblePickupAddress}
                     onRequestClose = {() => setModalVisiblePickupAddress(false)}
                     children = {
                         <ModalNotFullScreen
                             onRequestClose = {() => setModalVisiblePickupAddress(false)}
                             children = {
                                 <ModalRadioList
                                     title = {MyLANG.SelectPickupAddress}
                                     selected = {pickup_address?.id}
                                     onItem = {(item: any) => onModalItem(item, 'pickup_address')}
                                     items = {app_input?.pickup_address}
                                     titleText = "points_name"
                                     bodyText = "addressText"
                                     footerText = "footerText"
                                 />
                             }
                         />
                     }
                 />
                }

                {delivery_type?.id === MyConfig.DeliveryType.Courier.id &&
                 <MyModal
                     visible = {modalVisibleDeliveryAddress}
                     onRequestClose = {() => setModalVisibleDeliveryAddress(false)}
                     children = {
                         <ModalNotFullScreen
                             onRequestClose = {() => setModalVisibleDeliveryAddress(false)}
                             children = {
                                 <ModalRadioList
                                     title = {MyLANG.SelectDeliveryAddress}
                                     selected = {delivery_address?.id}
                                     onItem = {(item: any) => onModalItem(item, 'delivery_address')}
                                     items = {addresses}
                                     titleText = "company"
                                     bodyText = "addressText"
                                 />
                             }
                         />
                     }
                 />
                }

                <MyModal
                    visible = {modalVisibleBillingAddress}
                    onRequestClose = {() => setModalVisibleBillingAddress(false)}
                    children = {
                        <ModalNotFullScreen
                            onRequestClose = {() => setModalVisibleBillingAddress(false)}
                            children = {
                                <ModalRadioList
                                    title = {MyLANG.SelectBillingAddress}
                                    selected = {billing_address?.id}
                                    onItem = {(item: any) => onModalItem(item, 'billing_address')}
                                    items = {addresses}
                                    titleText = "company"
                                    bodyText = "addressText"
                                />
                            }
                        />
                    }
                />

                {(deliveryMethodList?.length > 0 && delivery_type?.id === MyConfig.DeliveryType.Courier.id) &&
                 <MyModal
                     visible = {modalVisibleDeliveryMethod}
                     onRequestClose = {() => setModalVisibleDeliveryMethod(false)}
                     children = {
                         <ModalNotFullScreen
                             onRequestClose = {() => setModalVisibleDeliveryMethod(false)}
                             children = {
                                 <ModalRadioList
                                     title = {MyLANG.SelectDeliveryMethod}
                                     selected = {delivery_method?.id}
                                     onItem = {(item: any) => onModalItem(item, 'delivery_method')}
                                     items = {deliveryMethodList}
                                     titleText = "name"
                                     bodyText = "priceText"
                                 />
                             }
                         />
                     }
                 />
                }

                <MyModal
                    visible = {modalVisiblePaymentMethod}
                    onRequestClose = {() => setModalVisiblePaymentMethod(false)}
                    children = {
                        <ModalNotFullScreen
                            onRequestClose = {() => setModalVisiblePaymentMethod(false)}
                            children = {
                                <ModalRadioList
                                    title = {MyLANG.SelectPaymentMethod}
                                    selected = {payment_method?.id}
                                    onItem = {(item: any) => onModalItem(item, 'payment_method')}
                                    items = {app_input?.payment_method}
                                    subTitleText = "name"
                                />
                            }
                        />
                    }
                />

            </SafeAreaView>
        </Fragment>
    )
}

ProductBuyPayment.navigationOptions = {};

export default ProductBuyPayment;

const styles = StyleSheet.create(
    {
        rippleDeliveryType        : {
            flex             : 0.5,
            paddingTop       : 20,
            paddingHorizontal: 10,
            marginHorizontal : 4,
            borderRadius     : 1,
        },
        rippleDeliveryTypeSelected: {
            backgroundColor: MyColor.backgroundGrey,
            borderWidth    : 0.2,
            borderColor    : MyColor.textDarkSecondary
        },
        rippleDeliveryTypeBorder  : {
            borderRightWidth: 1,
            borderRightColor: MyColor.textDarkPrimary
        },
    }
);
