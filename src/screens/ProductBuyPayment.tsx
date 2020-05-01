import React, {Fragment, useCallback, useEffect, useState} from 'react';

import {View, Text, SafeAreaView, ScrollView, RefreshControl, TouchableOpacity, StyleSheet, TextInput} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import {ShadowBox} from "react-native-neomorph-shadows";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {MyFastImage} from "../components/MyFastImage";
import MyMaterialRipple from "../components/MyMaterialRipple";
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

import {StatusBarLight} from '../components/MyComponent';
import {MyButton} from "../components/MyButton";
import {AddressListItem, CartPageBottomButtons, CartPageTotal, ModalRadioList, CartListItemSmall, ModalNotFullScreen} from "../shared/MyContainer";
import {MyModal} from "../components/MyModal";
import {cartUpdateDelivery} from "../store/CartRedux";
import {MyWebView} from "../components/MyWebView";
import {useFocusEffect} from "@react-navigation/native";


let renderCount = 0;


const orderFormSchema: any = yup.object().shape(
    {
        id              : yup.number()
                             .max(14, MyLANG.ID + ' ' + MyLANG.mustBeMaximum + ' 14 ' + MyLANG.character),
        delivery_type   : yup.object()
                             .required(MyLANG.DeliveryType + ' ' + MyLANG.isRequired),
        delivery_address: yup.object()
        /*.required(MyLANG.DeliveryAddress + ' ' + MyLANG.isRequired)*/,
        pickup_address  : yup.object()
        /*.required(MyLANG.PickupAddress + ' ' + MyLANG.isRequired)*/,
        billing_address : yup.object()
                             .required(MyLANG.BillingAddress + ' ' + MyLANG.isRequired),
        delivery_method : yup.object()
                             .required(MyLANG.DeliveryMethod + ' ' + MyLANG.isRequired),
        payment_method  : yup.object()
                             .required(MyLANG.PaymentMethod + ' ' + MyLANG.isRequired),
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

    const values                                                                                                          = getValues();
    const {delivery_type, delivery_address, pickup_address, billing_address, delivery_method, payment_method, order_note} = watch(['delivery_type', 'delivery_address', 'pickup_address', 'billing_address', 'delivery_method', 'payment_method', 'order_note']);


    useFocusEffect(
        useCallback(() => {

            MyUtil.printConsole(true, 'log', `LOG: ${ProductBuyPayment.name}. useFocusEffect: `, {addresses, params: route?.params});

            if (route?.params?.updateAddress === true) {
                //await MyFunction.fetchAddress(user?.id, user?.customers_telephone);
                getDeliveryAddress();
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [route.params, addresses])
    );

    useEffect(() => {

        MyUtil.printConsole(true, 'log', `LOG: ${ProductBuyPayment.name}. useEffect: []`, null);

        dispatch(cartUpdateDelivery(0));

        MyFunction.fetchPaymentMethod(false);
        MyFunction.fetchAddress(user?.id, user?.customers_telephone);
        MyFunction.fetchPickUpAddress(false);

        getDeliveryAddress(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${ProductBuyPayment.name}. useEffect: `, {app_input, addresses, cart, values});

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [app_input, addresses, cart]);

    // TODO: on demand validation
    // TODO: validation lag 1 step back


    const onBack = () => {
        MyUtil.stackAction(false,
                           null,
                           MyConstant.StackAction.pop,
                           1,
                           null,
                           null
        )
    }

    const getDeliveryAddress = (showInfoMessage: any = false) => {

        // Pick Default Address:
        let address_default: any         = addresses?.[0];
        const default_address_id: number = addresses.find((e: any) => Number(e.default_address) > 0)?.default_address;
        if (Number(default_address_id) > 0) {
            address_default = addresses.find((e: any) => Number(e.id) === default_address_id);
        }
        if (address_default?.id) {
            setValue('delivery_address', address_default, false);

            getDeliveryMethod(address_default, showInfoMessage);
        }

        MyUtil.printConsole(true, 'log', `LOG: getDeliveryAddress: `, {default_address_id, address_default, delivery_address});
    }

    const getDeliveryMethod = async (item: any, showInfoMessage: any = false) => {

        const data = await MyFunction.fetchDeliveryMethod(
            {
                "zone_id"    : item?.zone_id,
                "products"   : [{
                    "final_price": cart?.total,
                    "products_id": "1"
                }],
                "country_id" : item?.countries_id,
                "postal_code": item?.postcode,
                "city_id"    : item?.city,
                "state_id"   : item?.state,
            },
            MyLANG.PleaseWait + '...',
            MyLANG.DeliveryMethodUpdated,
            MyLANG.DeliveryMethodUpdateFailed,
        );

        if (data) {

            setDeliveryMethodList(data);

            if (showInfoMessage !== false) {
                MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.DeliveryMethodUpdated, false);
            }

        } else {

            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.DeliveryMethodUpdateFailed, false);
        }

        MyUtil.printConsole(true, 'log', `LOG: getDeliveryMethod: `, {item, cart, data});
    }

    const onDeliveryMethod = async (item: any) => {

        let amount = 15; // TODO:
        if (item) {

        }

        dispatch(cartUpdateDelivery(amount));

        MyUtil.printConsole(true, 'log', `LOG: onDeliveryMethod: `, {item, amount});
    }

    //
    const onDeliveryType = (item: any) => {

        setValue('delivery_type', item, true);

        MyUtil.printConsole(true, 'log', `LOG: onDeliveryType: `, {item, delivery_address});
    }

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
                if (delivery_type?.id === MyConfig.DevlieryMethod.PickUp) {
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
                break;

            case 'delivery_address':
                setModalVisibleDeliveryAddress(false);
                getDeliveryMethod(item, true);
                break;

            case 'billing_address':
                setModalVisibleBillingAddress(false);
                break;

            case 'delivery_method':
                setModalVisibleDeliveryMethod(false);
                onDeliveryMethod(item);
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

                billing_firstname     : billing_address?.firstname,
                billing_lastname      : billing_address?.lastname,
                billing_street_address: billing_address?.street,
                billing_suburb        : billing_address?.suburb,
                billing_city          : billing_address?.city,
                billing_postcode      : billing_address?.postcode,
                billing_zone          : billing_address?.zone_id,
                billing_country       : billing_address?.countries_id,

                payment_method : payment_method?.id,
                totalPrice     : cart?.total,
                currency_code  : MyConfig.Currency.MYR.code,
                // shipping_cost  : user?.id,
                shipping_method: delivery_method?.id,
                comments       : order_note,

                delivery_phone: delivery_address?.phone,
                billing_phone : billing_address?.phone,

                // currency_value   : user?.id,
                total_tax        : cart?.tax,
                is_coupon_applied: cart?.voucher?.amount > 0,
                coupon_amount    : cart?.voucher?.amount,
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
                            <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 2}]}>
                                {MyLANG.DeliveryType}
                            </Text>
                            <Text style = {[MyStyleSheet.textListItemSubTitle, {marginBottom: 4}]}>
                                {MyLANG.DeliveryTypeDesc}
                            </Text>

                            <View style = {[MyStyle.RowBetweenCenter, {marginTop: MyStyle.marginVerticalList}]}>
                                {MyConfig.deliveryTypes
                                         .map((prop: any, key: any) =>
                                                  (
                                                      <MyMaterialRipple
                                                          key = {key}
                                                          style = {[MyStyle.ColumnCenter, styles.rippleDeliveryType, delivery_type?.id === prop?.id && styles.rippleDeliveryTypeSelected]}
                                                          {...MyStyle.MaterialRipple.drawer}
                                                          onPress = {() => onDeliveryType(prop)}
                                                      >
                                                          <MyIcon.Fontisto
                                                              name = {prop?.icon}
                                                              size = {32}
                                                              color = {MyColor.Material.GREY["800"]}
                                                              style = {{marginBottom: 12}}
                                                          />
                                                          <Text style = {[MyStyleSheet.textListItemTitleDark, {paddingBottom: 14}]}>
                                                              {prop?.title}
                                                          </Text>
                                                      </MyMaterialRipple>
                                                  )
                                         )
                                }
                            </View>
                        </View>

                        {(delivery_type?.id === MyConfig.DevlieryMethod.PickUp) &&
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
                                     style = {{}}
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

                        {(delivery_type?.id === MyConfig.DevlieryMethod.Courier) &&
                         <View style = {[MyStyleSheet.viewPageCard, {paddingHorizontal: 0}]}>

                             <View style = {[MyStyle.RowBetweenCenter, {paddingHorizontal: MyStyle.paddingHorizontalPage}]}>
                                 <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 4}]}>{MyLANG.DeliveryAddress}</Text>
                                 <TouchableOpacity activeOpacity = {0.8}
                                                   onPress = {onAddressManage}>
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

                            <View style = {[MyStyle.RowBetweenCenter, {paddingHorizontal: MyStyle.paddingHorizontalPage}]}>
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

                        <View style = {MyStyleSheet.viewPageCard}>
                            <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 4}]}>
                                {MyLANG.CartItems}
                            </Text>
                            <CartListItemSmall items = {cart?.items}/>

                        </View>

                        {(delivery_type?.id === MyConfig.DevlieryMethod.Courier) &&
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
                                             {delivery_method?.table_name}
                                         </Text>
                                         <Text style = {[MyStyleSheet.textListItemSubTitle]}>
                                             {'1 day delivery\nSuper express cost RM15.00'}
                                         </Text>
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

                {delivery_type?.id === MyConfig.DevlieryMethod.PickUp &&
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

                {delivery_type?.id === MyConfig.DevlieryMethod.Courier &&
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

                {(deliveryMethodList?.length > 0 && delivery_type?.id === MyConfig.DevlieryMethod.Courier) &&
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
                                     subTitleText = "table_name"
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
