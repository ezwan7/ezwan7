import React, {Fragment, useCallback, useEffect, useState} from 'react';

import {View, Text, SafeAreaView, ScrollView, RefreshControl, TouchableOpacity, StyleSheet} from 'react-native';
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
import {AddressListItem, CartListItem, CartPageBottomButtons, CartPageTotal, ModalRadioList, OrderListItem} from "../shared/MyContainer";
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
        delivery_address: yup.object()
                             .required(MyLANG.DeliveryAddress + ' ' + MyLANG.isRequired),
        billing_address : yup.object()
                             .required(MyLANG.BillingAddress + ' ' + MyLANG.isRequired),
        delivery_method : yup.object()
                             .required(MyLANG.DeliveryMethod + ' ' + MyLANG.isRequired),
        payment_method  : yup.object()
                             .required(MyLANG.PaymentMethod + ' ' + MyLANG.isRequired),
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

    const [addressList, setAddressList]               = useState([]);
    const [deliveryMethodList, setDeliveryMethodList] = useState([]);

    const [modalVisibleDeliveryAddress, setModalVisibleDeliveryAddress] = useState(false);
    const [modalVisibleBillingAddress, setModalVisibleBillingAddress]   = useState(false);
    const [modalVisibleDeliveryMethod, setModalVisibleDeliveryMethod]   = useState(false);
    const [modalVisiblePaymentMethod, setModalVisiblePaymentMethod]     = useState(false);

    useEffect(() => {

        MyUtil.printConsole(true, 'log', `LOG: ${ProductBuyPayment.name}. useEffect: []`, null);

        MyFunction.fetchPaymentMethod(false);
        MyFunction.fetchAddress(user?.id);

        getDeliveryAddress();

        dispatch(cartUpdateDelivery(0));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const values                                                                              = getValues();
    const {delivery_type, delivery_address, billing_address, delivery_method, payment_method} = watch(['delivery_type', 'delivery_address', 'billing_address', 'delivery_method', 'payment_method']);

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

    const getDeliveryAddress = () => {

        // Prepare Address List:
        const addressesReduced = addresses.reduce((accumulator: any, item: any) => {
            const addressText = MyUtil.generateAddress(null,
                                                       item?.street,
                                                       item?.city,
                                                       item?.zone_name,
                                                       item?.country_name,
                                                       item?.postcode
            );
            accumulator.push(
                {
                    ...item,
                    id      : item?.address_id,
                    bodyText: `${item.firstname} ${item.lastname}\n${user?.customers_telephone}\n${addressText}`,
                }
            );
            return accumulator;

        }, []);

        setAddressList(addressesReduced);
        MyUtil.printConsole(true, 'log', `LOG: getDeliveryAddress: `, {addressesReduced, addressList});

        // Pick Default Address:
        let address_default: any         = addresses?.[0];
        const default_address_id: number = addresses.find((e: any) => Number(e.default_address) > 0)?.default_address;
        if (Number(default_address_id) > 0) {
            address_default = addresses.find((e: any) => Number(e.address_id) === default_address_id);
        }
        if (address_default?.address_id) {
            setValue('delivery_address', address_default, false); // TODO: not working.
        }

        MyUtil.printConsole(true, 'log', `LOG: getDeliveryAddress: `, {default_address_id, address_default, delivery_address});
    }

    const getDeliveryMethod = async (item: any) => {

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

            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.DeliveryMethodUpdated, false);

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
                            null,
                            null,
        )
    }


    const onModalVisible = (key: string) => {

        switch (key) {
            case 'delivery_address':
                setModalVisibleDeliveryAddress(true);
                break;
            case 'billing_address':
                setModalVisibleBillingAddress(true);
                break;
            case 'delivery_method':
                if (delivery_type?.id === 1) {
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

        MyUtil.printConsole(true, 'log', `LOG: onModalVisible: `, {addressList, delivery_address, billing_address});
    }

    const onModalItem = (item: any, key: string) => {

        switch (key) {
            case 'delivery_address':
                setModalVisibleDeliveryAddress(false);
                getDeliveryMethod(item);
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

        MyUtil.printConsole(true, 'log', `LOG: onModalItem: `, {item, key, delivery_address, billing_address, delivery_method, payment_method});
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

                            case 100: // Cash On Delivery:
                                orderPlace();
                                break;

                            default:
                                MyUtil.commonAction(false,
                                                    null,
                                                    MyConstant.CommonAction.navigate,
                                                    MyConfig.routeName.MyWebViewPage,
                                                    {source: 'https://www.google.com/'},
                                                    null,
                                );
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

        const response = await MyFunction.placeOrder(
            {
                user_id: user?.id,
                cart   : cart,
            },
            MyLANG.PleaseWait + '...',
            MyLANG.DeliveryMethodUpdated,
            MyLANG.DeliveryMethodUpdateFailed,
        );

        if (response === true) {

            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.OrderPlacedSuccessfully, false);

            MyUtil.commonAction(false,
                                null,
                                MyConstant.CommonAction.navigate,
                                MyConfig.routeName.ProductBuySuccess,
                                {id: 992992},
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
                        contentContainerStyle = {{paddingTop: MyStyle.headerHeightAdjusted, flexGrow: 1}}
                    >

                        <View style = {[MyStyleSheet.viewPageCard, {marginTop: MyStyle.marginViewGapCard}]}>
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

                        {delivery_type?.id === 1 &&
                         <View style = {[MyStyleSheet.viewPageCard, {}]}>
                             <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 4}]}>
                                 {MyLANG.PickupAddress}
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
                        }

                        {delivery_type?.id === 2 &&
                         <View style = {[MyStyleSheet.viewPageCard, {paddingHorizontal: 0}]}>
                             <View style = {[MyStyle.RowBetweenCenter, {paddingHorizontal: MyStyle.paddingHorizontalPage}]}>
                                 <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 4}]}>{MyLANG.DeliveryAddress}</Text>
                                 <TouchableOpacity activeOpacity = {0.8}
                                                   onPress = {onAddressManage}>
                                     <Text style = {{...MyStyleSheet.linkTextList}}>{MyLANG.ManageAddress}</Text>
                                 </TouchableOpacity>
                             </View>

                             {delivery_address?.address_id ?
                              <AddressListItem
                                  item = {delivery_address}
                                  onPress = {() => onModalVisible('delivery_address')}
                                  rippleStyle = {{
                                      marginTop      : 5,
                                      paddingLeft    : MyStyle.paddingVerticalList,
                                      backgroundColor: MyColor.Material.WHITE
                                  }}
                                  address_title = {true}
                                  phone = {user?.customers_telephone}
                              />
                                                           :

                              <MyMaterialRipple
                                  style = {[MyStyleSheet.viewPageCard, MyStyle.RowStartCenter, {paddingRight: 8}]}
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
                              </MyMaterialRipple>
                             }
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

                            {billing_address?.address_id ?
                             <AddressListItem
                                 item = {billing_address}
                                 onPress = {() => onModalVisible('billing_address')}
                                 rippleStyle = {{
                                     marginTop      : 5,
                                     paddingLeft    : MyStyle.paddingVerticalList,
                                     backgroundColor: MyColor.Material.WHITE
                                 }}
                                 address_title = {true}
                                 phone = {user?.customers_telephone}
                             />
                                                         :

                             <MyMaterialRipple
                                 style = {[MyStyleSheet.viewPageCard, MyStyle.RowStartCenter, {paddingRight: 8}]}
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

                        <View style = {MyStyleSheet.viewPageCard}>
                            <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 4}]}>
                                {MyLANG.CartItems}
                            </Text>
                            <OrderListItem items = {cart?.items}/>

                        </View>

                        {(delivery_type?.id === 2) &&
                         <View style = {[MyStyleSheet.viewPageCard, {paddingHorizontal: 0, paddingBottom: 0}]}>
                             <View style = {[MyStyle.RowBetweenCenter, {paddingHorizontal: MyStyle.paddingHorizontalPage}]}>
                                 <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 4}]}>{MyLANG.DeliveryMethod}</Text>
                                 {/*<TouchableOpacity activeOpacity = {0.8}
                                                  onPress = {onAddressManage}>
                                    <Text style = {{...MyStyleSheet.linkTextList}}>{MyLANG.AddAddress}</Text>
                                </TouchableOpacity>*/}
                             </View>

                             <MyMaterialRipple
                                 style = {[MyStyleSheet.viewPageCard, MyStyle.RowStartCenter, {paddingRight: 8}]}
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
                                     delivery_method?.shipping_methods_id ?
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
                                             {MyLANG.SelectdDeliveryMethodDesc}
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
                                style = {[MyStyleSheet.viewPageCard, MyStyle.RowStartCenter, {paddingRight: 8}]}
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
                                            {MyLANG.SelectdPaymentMethodDesc}
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

                {delivery_type?.id === 2 &&
                 <MyModal
                     visible = {modalVisibleDeliveryAddress}
                     onRequestClose = {() => setModalVisibleDeliveryAddress(false)}
                     children = {
                         <ModalRadioList
                             title = {MyLANG.SelectDeliveryAddress}
                             selected = {delivery_address?.address_id}
                             onItem = {(item: any) => onModalItem(item, 'delivery_address')}
                             items = {addressList}
                             titleText = "company"
                             bodyText = "bodyText"
                         />
                     }
                 />
                }

                <MyModal
                    visible = {modalVisibleBillingAddress}
                    onRequestClose = {() => setModalVisibleBillingAddress(false)}
                    children = {
                        <ModalRadioList
                            title = {MyLANG.SelectBillingAddress}
                            selected = {billing_address?.address_id}
                            onItem = {(item: any) => onModalItem(item, 'billing_address')}
                            items = {addressList}
                            titleText = "company"
                            bodyText = "bodyText"
                        />
                    }
                />

                {(deliveryMethodList?.length > 0 && delivery_type?.id === 2) &&
                 <MyModal
                     visible = {modalVisibleDeliveryMethod}
                     onRequestClose = {() => setModalVisibleDeliveryMethod(false)}
                     children = {
                         <ModalRadioList
                             title = {MyLANG.SelectDeliveryMethod}
                             selected = {delivery_method?.shipping_methods_id}
                             onItem = {(item: any) => onModalItem(item, 'delivery_method')}
                             items = {deliveryMethodList}
                             subTitleText = "table_name"
                         />
                     }
                 />
                }

                <MyModal
                    visible = {modalVisiblePaymentMethod}
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
    }
);
