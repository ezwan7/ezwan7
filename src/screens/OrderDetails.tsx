import React, {Fragment, useCallback, useEffect, useLayoutEffect, useState} from 'react';

import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    RefreshControl,
    Modal, TouchableOpacity, StyleSheet,
} from 'react-native';

import HTML from 'react-native-render-html';
import ImageViewer from "react-native-image-zoom-viewer";

import {useDispatch, useSelector} from "react-redux";

import MyUtil from '../common/MyUtil';
import {MyStyle, MyStyleSheet} from '../common/MyStyle';
import MyColor from '../common/MyColor';
import MyImage from '../shared/MyImage';
import {MyAPI, MyConfig} from '../shared/MyConfig';
import MyLANG from '../shared/MyLANG';
import {MyConstant} from '../common/MyConstant';
import MyIcon from '../components/MyIcon';
import MyFunction from "../shared/MyFunction";
import {MyButton} from "../components/MyButton";

import {
    ActivityIndicatorLarge,
    IconStar,
    ListEmptyViewLottie,
    StatusBarLight
} from '../components/MyComponent';
import {
    ImageSliderBanner,
    ProductListItemContentLoader,
    ListItemSeparator,
    ProductListItem,
    ProductDetailsContentLoader, AddressListItem, CartPageTotal, OrderDetailsContentLoader, ModalNotFullScreen, ModalRadioList,
} from "../shared/MyContainer";

import {cartEmpty, cartItemQuantityIncrement} from "../store/CartRedux";
import {MyImageViewer} from "../components/MyImageViewer";
import MyMaterialRipple from "../components/MyMaterialRipple";
import {MyFastImage} from "../components/MyFastImage";
import NumberFormat from "react-number-format";
import {MyModal} from "../components/MyModal";


let renderCount = 0;

const OrderDetailsScreen = ({route, navigation}: any) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${OrderDetailsScreen.name}. renderCount: `, {renderCount});
    }

    const dispatch = useDispatch();

    const user: any      = useSelector((state: any) => state.auth.user);
    const app_input: any = useSelector((state: any) => state.app_input);

    const [refreshing, setRefreshing] = useState(false);
    const [firstLoad, setFirstLoad]   = useState(true);
    const [order, setOrder]: any      = useState([]);

    const [imageViewerVisible, setImageViewerVisible]         = useState(false);
    const [modalVisibleFileSource, setModalVisibleFileSource] = useState(false);

    const isLinked: any = [];

    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${OrderDetailsScreen.name}. useEffect: `, {user, app_input});

        fetchData(false, false, false);

        // setOrder(route?.params?.item);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRefresh = useCallback(() => {
        MyUtil.printConsole(true, 'log', 'LOG: onRefresh: ', {});

        setRefreshing(true);

        fetchData(false, true, {
            'showMessage': MyConstant.SHOW_MESSAGE.TOAST,
            'message'    : MyLANG.PageRefreshed
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = async (showLoader: any = MyLANG.Loading + '...', setRefresh: boolean = false, showInfoMessage: any = false) => {
        if (route?.params?.id) {
            const response: any = await MyUtil
                .myHTTP(false, MyConstant.HTTP_POST, MyAPI.order,
                        {
                            'language_id': MyConfig.LanguageActive,

                            'orders_id'   : route?.params?.id,
                            'customers_id': user?.id,

                            'app_ver'      : MyConfig.app_version,
                            'app_build_ver': MyConfig.app_build_version,
                            'platform'     : MyConfig.app_platform,
                            'device'       : null,
                        }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
                );

            MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
                'apiURL': MyAPI.order, 'response': response
            });

            if (response.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data?.data?.success === '1' && response.data?.data?.data?.[0]) {

                const data = response.data.data.data[0];

                setOrder(data);

            } else {
                MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT, response.errorMessage ? response.errorMessage : MyLANG.UnknownError, false);
            }

            setFirstLoad(false);
            if (setRefresh === true) {
                setRefreshing(false);
            }

            if (showInfoMessage !== false) {
                MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message, false);
            }
        }
    }

    const onProductDetails = (item: any) => {
        MyUtil.commonAction(false,
                            null,
                            MyConstant.CommonAction.navigate,
                            MyConfig.routeName.ProductDetails,
                            {'id': item?.products_id, 'item': item},
                            null,
        )

    };

    const onUploadReceipt = () => {

        if (order?.orders_status_id === MyConstant.OrderStatus.Pending && order?.payment_method === MyConfig.PaymentMethod.CashOnDelivery.name) {

            setModalVisibleFileSource(true);

        } else {

            MyUtil.showMessage(
                MyConstant.SHOW_MESSAGE.ALERT,
                `${MyLANG.OrderUnableToUploadReceipt} ${order?.orders_status}, ${MyLANG.PaymentMethod} ${order?.payment_method}`,
                false,
            );
        }
    };

    const onModalItem = async (item: any) => {

        setModalVisibleFileSource(false);

        let response: any = null;

        switch (item?.key) {
            case 'Camera':
                response = await MyUtil.imagePicker(MyConfig.DefatulImagePickerOptions,
                                                    MyConstant.IMAGE_PICKER.OPEN_TYPE.Camera,
                                                    MyConstant.SHOW_MESSAGE.TOAST,
                )
                break;

            case 'Gallery':
                response = await MyUtil.imagePicker(MyConfig.DefatulImagePickerOptions,
                                                    MyConstant.IMAGE_PICKER.OPEN_TYPE.ImageLibrary,
                                                    MyConstant.SHOW_MESSAGE.TOAST,
                )
                break;

            case 'Other':
                response = await MyUtil.documentPicker(MyConfig.DefatulFilePickerOptions,
                                                       null,
                                                       MyConstant.SHOW_MESSAGE.TOAST,
                );
                break;

            default:
                break;
        }

        if (response) {

            MyUtil.printConsole(true, 'log', 'LOG: sourcePicker: await-response: ', {'response': response});

            if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.data && response.data?.type && Number(response.data?.fileSize) > 0) {

                uploadReceipt(response.data);
            }
        }

    };

    const uploadReceipt = async (data: any) => {
        /*const blob: any = await MyUtil.fetchBlob(MyConstant.FetchBlobType.fs,
                                                 data?.uri,
                                                 {},
                                                 MyConstant.FetchFileType.base64,
                                                 MyLANG.PleaseWait + '...',
                                                 true
        );
        MyUtil.printConsole(true, 'log', 'LOG: fetchBlob: await-response: ', {
            'blob': blob,
        });
        if (blob?.type === MyConstant.RESPONSE.TYPE.data && blob?.data) {

        } else {

        }*/

        const response: any = await MyUtil
            .myHTTP(true, MyConstant.HTTP_POST, MyAPI.upload_payment_receipt,
                    {
                        'language_id': MyConfig.LanguageActive,

                        'customers_id': user?.id,
                        order_id      : order?.id,
                        'receipt'     : `data:${data?.type};base64,` + data?.data,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, MyLANG.PleaseWait + '...', true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.upload_payment_receipt, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data?.data?.success === '1') {

            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.PaymentReceiptUploadedSuccessfully, false);

            fetchData(MyLANG.PleaseWait + '...', false, false);

        } else {

            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT, MyLANG.FileUploadFailed, false);
        }
    };

    const onCancelOrder = () => {

        if (order?.orders_status_id === MyConstant.OrderStatus.Pending) {
            MyUtil.showAlert(MyLANG.Attention, MyLANG.OrderCancelAlert, false, [
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

                        const cancleOrder: any = await MyFunction.cancelOrder(
                            {
                                user_id         : user?.id,
                                orders_id       : order?.id,
                                orders_status_id: MyConstant.OrderStatus.Cancelled
                            });

                        if (cancleOrder !== false) {
                            fetchData(MyLANG.PleaseWait + '...', false, false);
                            // setOrder(cancleOrder);
                        }
                    }
                },
            ])

        } else {

            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT, MyLANG.OrderUnableToCancel + order?.orders_status, false);
        }
    };

    const onReturnOrder = () => {

        if (order?.orders_status_id === MyConstant.OrderStatus.Pending) {

            MyUtil.showAlert(MyLANG.Attention, MyLANG.OrderReturnAlert, false, [
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

                    }
                },
            ])

        } else {

            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT, MyLANG.OrderUnableToReturn + order?.orders_status, false);
        }
    };

    const onOrderTracking = () => {

        const webUrl: string = order?.tracking_shipments?.[0]?.shipment_tracking_number;

        MyUtil.commonAction(false,
                            null,
                            MyConstant.CommonAction.navigate,
                            MyConfig.routeName.MyWebViewPage,
                            {source: webUrl},
                            null,
        );
    };


    return (
        <Fragment>
            <StatusBarLight/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView1}/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <View style = {[MyStyleSheet.SafeAreaView3, {backgroundColor: MyColor.backgroundGrey}]}>

                    {order?.id > 0 ?
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

                             <View style = {[MyStyleSheet.viewPageCard, {marginTop: MyStyle.marginViewGapCardTop}]}>
                                 <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 10}]}>{MyLANG.OrderSummary}</Text>

                                 <View style = {[MyStyle.RowBetweenCenter, {marginBottom: 6}]}>
                                     <Text style = {[MyStyleSheet.textListItemTitle2Alt]}>{MyLANG.OrderID}</Text>
                                     <Text style = {[MyStyleSheet.textListItemTitle2AltDark]}>#{order?.id}</Text>
                                 </View>

                                 <View style = {[MyStyle.RowBetweenCenter, {marginBottom: 20}]}>
                                     <Text style = {[MyStyleSheet.textListItemTitle2Alt]}>{MyLANG.OrderStatus}</Text>
                                     <Text style = {[MyStyleSheet.textListItemTitle2Alt, {color: MyColor.attentionDark}]}>{order?.orders_status || 'No Status'}</Text>
                                 </View>

                                 <View style = {[MyStyle.RowBetweenCenter, {marginBottom: 6}]}>
                                     <Text style = {[MyStyleSheet.textListItemTitle2Alt]}>{MyLANG.OrderTime}</Text>
                                     <Text style = {[MyStyleSheet.textListItemTitle2AltDark]}>
                                         {MyUtil.momentFormat(order?.date_purchased, MyConstant.MomentFormat["1st Jan, 1970 12:01 am"])}
                                     </Text>
                                 </View>

                                 {
                                     order?.payment_method !== MyConfig.PaymentMethod.CashOnDelivery.name &&
                                     <View style = {[MyStyle.RowBetweenCenter, {marginBottom: 6}]}>
                                         <Text style = {[MyStyleSheet.textListItemTitle2Alt]}>{MyLANG.PaymentTime}</Text>
                                         <Text style = {[MyStyleSheet.textListItemTitle2Alt]}>
                                             {MyUtil.momentFormat(order?.date_purchased, MyConstant.MomentFormat["1st Jan, 1970 12:01 am"])}
                                         </Text>
                                     </View>
                                 }

                                 <View style = {[MyStyle.RowBetweenCenter, {marginBottom: 6}]}>
                                     <Text style = {[MyStyleSheet.textListItemTitle2Alt]}>{MyLANG.ShipTime}</Text>
                                     <Text style = {[MyStyleSheet.textListItemTitle2Alt]}>
                                         {MyUtil.momentFormat(order?.date_purchased, MyConstant.MomentFormat["1st Jan, 1970 12:01 am"])}
                                     </Text>
                                 </View>

                                 <View style = {[MyStyle.RowBetweenCenter, {marginBottom: 6}]}>
                                     <Text style = {[MyStyleSheet.textListItemTitle2Alt]}>{MyLANG.CompletedTime}</Text>
                                     <Text style = {[MyStyleSheet.textListItemTitle2AltDark]}>
                                         {MyUtil.momentFormat(order?.orders_date_finished, MyConstant.MomentFormat["1st Jan, 1970 12:01 am"]) || '-'}
                                     </Text>
                                 </View>

                             </View>

                             <View style = {[MyStyleSheet.viewPageCard, {}]}>
                                 <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 15}]}>{MyLANG.TrackingInformation}</Text>

                                 <View style = {[MyStyle.RowLeftTop, {marginBottom: 5}]}>
                                     <MyIcon.SimpleLineIcons
                                         name = "compass"
                                         size = {26}
                                         color = {MyColor.textDarkSecondary2}
                                         style = {{marginTop: 4}}
                                     />
                                     <View style = {[MyStyle.ColumnCenterStart, {flex: 1, marginHorizontal: 14}]}>
                                         <Text style = {[MyStyleSheet.textListItemTitleDark]}>
                                             {order?.tracking_shipments?.[0]?.shipment_comment}
                                         </Text>

                                         <View style = {MyStyle.RowLeftCenter}>
                                             <Text style = {[MyStyleSheet.textListItemSubTitle, {marginRight: 5}]}>
                                                 {MyLANG.TrackingNumber}
                                             </Text>
                                             <Text style = {MyStyleSheet.linkTextList}>
                                                 {order?.tracking_shipments?.[0]?.shipment_tracking_number}
                                             </Text>
                                             {/*{order?.tracking_shipments?.[0]?.shipment_tracking_number?.length > 0 &&
                                              <TouchableOpacity
                                                  activeOpacity = {0.8}
                                                  onPress = {onOrderTracking}
                                              >
                                                  <Text style = {MyStyleSheet.linkTextList}>
                                                      {order?.tracking_shipments?.[0]?.shipment_tracking_number}
                                                  </Text>
                                              </TouchableOpacity>
                                             }*/}
                                         </View>

                                         <Text style = {[MyStyleSheet.textListItemSubTitleDark]}>
                                             {order?.tracking_shipments?.[0]?.shipment_status}
                                         </Text>
                                     </View>
                                 </View>
                             </View>

                             <View style = {[MyStyleSheet.viewPageCard, {paddingHorizontal: 0}]}>
                                 <Text style = {[{
                                     ...MyStyleSheet.headerPage,
                                     paddingHorizontal: MyStyle.paddingHorizontalPage,
                                     marginBottom     : 10
                                 }]}>
                                     {MyLANG.OrderedItems}
                                 </Text>

                                 {(order?.data?.length > 0) &&
                                  order.data.map(
                                      (prop: any, index: number) => (
                                          <MyMaterialRipple
                                              key = {index}
                                              style = {[cartListSmall.view, {
                                                  paddingHorizontal: MyStyle.paddingHorizontalPage,
                                                  borderBottomWidth: index === (order.data?.length - 1) ? 0 : 0.9
                                              }]}
                                              {...MyStyle.MaterialRipple.drawer}
                                              onPress = {() => onProductDetails(prop)}
                                          >
                                              <MyFastImage
                                                  source = {[prop?.products_image?.length > 9 ? {'uri': prop?.products_image} : MyImage.camera, MyImage.camera]}
                                                  style = {cartListSmall.image}
                                              />

                                              <View style = {cartListSmall.textsView}>
                                                  <Text
                                                      style = {cartListSmall.textName}
                                                      numberOfLines = {2}>
                                                      {prop?.products_name}
                                                  </Text>

                                                  <View style = {cartListSmall.viewPrice}>
                                                      <View style = {MyStyle.RowLeftBottom}>
                                                          <Text
                                                              style = {cartListSmall.textPrice}
                                                              numberOfLines = {1}
                                                          >
                                                              {MyConfig.Currency.MYR.symbol} {prop?.discount_price ? prop?.discount_price : prop?.products_price}
                                                          </Text>
                                                          <Text
                                                              style = {cartListSmall.textQuantity}
                                                              numberOfLines = {1}
                                                          >
                                                              x{prop?.products_quantity}
                                                          </Text>
                                                          {
                                                              prop?.discount_price &&
                                                              <Text
                                                                  style = {cartListSmall.textPriceDiscounted}
                                                                  numberOfLines = {1}
                                                              >
                                                                  {MyConfig.Currency.MYR.symbol} {prop?.products_price}
                                                              </Text>
                                                          }
                                                      </View>

                                                      <NumberFormat
                                                          value = {prop?.final_price}
                                                          defaultValue = {0}
                                                          displayType = {'text'}
                                                          thousandSeparator = {true}
                                                          decimalScale = {2}
                                                          fixedDecimalScale = {true}
                                                          decimalSeparator = {'.'}
                                                          renderText = {
                                                              (value: any) =>
                                                                  <Text style = {cartListSmall.textPriceTotal}>{MyConfig.Currency.MYR.symbol} {value}</Text>
                                                          }
                                                      />

                                                  </View>

                                                  <View style = {{marginVertical: 5}}>
                                                      {prop?.attributes?.length > 0 && prop.attributes.map(
                                                          (attribute: any, i: number) => (
                                                              <View key = {i}
                                                                    style = {[MyStyle.RowLeftCenter, {marginVertical: 2}]}
                                                              >
                                                                  <Text
                                                                      style = {[MyStyleSheet.textListItemSubTitle3Alt,
                                                                                {
                                                                                    marginRight: 6,
                                                                                    flexBasis  : '27%',
                                                                                    flexGrow   : 0,
                                                                                }
                                                                      ]}>
                                                                      {attribute.products_options}
                                                                  </Text>
                                                                  <View style = {[MyStyle.RowLeftCenter, {
                                                                      backgroundColor  : MyColor.Material.GREY["200"],
                                                                      paddingVertical  : 2,
                                                                      paddingHorizontal: 10,
                                                                      flexGrow         : 0,
                                                                  }]}>
                                                                      <Text style = {[MyStyleSheet.textListItemSubTitle3AltDark, {marginRight: 5}]}>
                                                                          {attribute.products_options_values}
                                                                      </Text>
                                                                      {
                                                                          (attribute.price_prefix && attribute.options_values_price) &&
                                                                          <Text style = {[MyStyleSheet.textListItemSubTitle3, {}]}>
                                                                              {attribute.price_prefix} {attribute.options_values_price}
                                                                          </Text>
                                                                      }
                                                                  </View>
                                                              </View>
                                                          ))
                                                      }

                                                      {Number(prop.gift_item?.item_id) > 0 &&
                                                       <View style = {[MyStyle.RowLeftCenter, {marginVertical: 6}]}>
                                                           <Text
                                                               style = {[MyStyleSheet.textListItemSubTitle3Alt,
                                                                         {
                                                                             marginRight: 6,
                                                                             flexBasis  : '27%',
                                                                             flexGrow   : 0,
                                                                         }
                                                               ]}
                                                           >
                                                               {MyLANG.GiftItem}
                                                           </Text>

                                                           <View
                                                               style = {[MyStyle.RowLeftCenter, {
                                                                   backgroundColor  : MyColor.Material.GREY["200"],
                                                                   paddingVertical  : 2,
                                                                   paddingHorizontal: 10,
                                                                   flexGrow         : 0,
                                                               }]}>
                                                               <Text style = {[MyStyleSheet.textListItemSubTitle3AltDark, {marginRight: 5}]}>{prop.gift_item?.item_name}</Text>
                                                           </View>
                                                       </View>
                                                      }

                                                      {prop?.addons?.length > 0 && prop.addons.map(
                                                          (addon: any, i: number) => {

                                                              isLinked[addon.addons_name] = ((isLinked[addon.addons_name] === 'print' || isLinked[addon.addons_name] === 'printed') ? 'printed' : ((isLinked[addon.addons_name] !== 'printed') ? 'print' : 'false'));

                                                              return (<View key = {i}
                                                                            style = {[MyStyle.ColumnCenterLeft, {marginVertical: 4}]}
                                                                  >
                                                                      {isLinked[addon.addons_name] === 'print' &&
                                                                       <Text style = {[MyStyleSheet.textListItemSubTitle3Alt, {
                                                                           marginTop   : 8,
                                                                           marginBottom: 5
                                                                       }]}>{addon.addons_name}</Text>
                                                                      }
                                                                      <View style = {[{
                                                                          backgroundColor  : MyColor.Material.GREY["200"],
                                                                          paddingVertical  : 4,
                                                                          paddingHorizontal: 12,
                                                                      }]}>
                                                                          <Text style = {[MyStyleSheet.textListItemSubTitle3AltDark, {}]}>
                                                                              {addon.addons_value_name}
                                                                          </Text>
                                                                          {
                                                                              (Number(addon.addons_value_price) > 0) &&
                                                                              <Text style = {[MyStyleSheet.textListItemSubTitle3, {}]}>
                                                                                  + {addon.addons_value_price}
                                                                              </Text>
                                                                          }
                                                                      </View>
                                                                  </View>
                                                              )
                                                          })
                                                      }
                                                  </View>
                                              </View>

                                          </MyMaterialRipple>
                                      )
                                  )}
                             </View>

                             <View style = {[MyStyleSheet.viewPageCard, {}]}>
                                 <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 15}]}>{MyLANG.DeliveryType}</Text>

                                 <View style = {[MyStyle.RowLeftCenter, {marginBottom: 5}]}>
                                     <MyIcon.SimpleLineIcons
                                         name = "handbag"
                                         size = {26}
                                         color = {MyColor.textDarkSecondary2}
                                         style = {{}}
                                     />
                                     <View style = {[MyStyle.ColumnCenterStart, {flex: 1, marginHorizontal: 14}]}>
                                         <Text style = {[MyStyleSheet.textListItemTitleDark]}>
                                             {order?.delivery_type_name}
                                         </Text>
                                     </View>
                                 </View>
                             </View>

                             {(order?.delivery_type === MyConfig.DeliveryType.PickUp.id) &&
                              <View style = {[MyStyleSheet.viewPageCard, {}]}>
                                  <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 15}]}>{MyLANG.PickupAddress}</Text>

                                  <View style = {[MyStyle.RowLeftCenter, {marginBottom: 5}]}>
                                      <MyIcon.Fontisto
                                          name = "shopping-store"
                                          size = {26}
                                          color = {MyColor.textDarkSecondary2}
                                          style = {{}}
                                      />
                                      <View style = {[MyStyle.ColumnCenterStart, {flex: 1, marginHorizontal: 14}]}>
                                          <Text style = {[MyStyleSheet.textListItemTitleDark]}>
                                              {order?.pickuppoints}
                                          </Text>
                                      </View>
                                  </View>
                              </View>
                             }
                             {(order?.delivery_type === MyConfig.DeliveryType.PickUp.id) &&
                              <View style = {[MyStyleSheet.viewPageCard, {}]}>
                                  <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 15}]}>{MyLANG.ReceiverDetails}</Text>

                                  <View style = {[MyStyle.RowLeftCenter, {marginBottom: 5}]}>
                                      <MyIcon.SimpleLineIcons
                                          name = "user"
                                          size = {26}
                                          color = {MyColor.textDarkSecondary2}
                                          style = {{}}
                                      />
                                      <View style = {[MyStyle.ColumnCenterStart, {flex: 1, marginHorizontal: 14}]}>
                                          <Text style = {MyStyleSheet.textListItemTitleDark}>
                                              {order?.receiver_name}
                                          </Text>
                                          <Text style = {MyStyleSheet.textListItemSubTitleAlt}>
                                              {order?.receiver_phone}
                                          </Text>
                                          <Text style = {MyStyleSheet.textListItemSubTitleAlt}>
                                              {order?.receiver_ic}
                                          </Text>
                                      </View>
                                  </View>
                              </View>
                             }

                             {(order?.delivery_type === MyConfig.DeliveryType.Courier.id) &&
                              <View style = {[MyStyleSheet.viewPageCard, {}]}>
                                  <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 10}]}>{MyLANG.DeliveryAddress}</Text>

                                  <View style = {[MyStyle.RowLeftCenter]}>
                                      <MyIcon.SimpleLineIcons
                                          name = "direction"
                                          size = {22}
                                          color = {MyColor.textDarkSecondary2}
                                          style = {{alignSelf: "flex-start", marginTop: 4, marginRight: 10}}
                                      />
                                      <View style = {[MyStyle.ColumnStart, {flex: 1}]}>
                                          {order.delivery_company ?
                                           <>
                                               <Text style = {[MyStyleSheet.textListItemTitleAltDark, {}]}>{order?.delivery_company}</Text>
                                               <Text style = {[MyStyleSheet.textListItemSubTitleAlt, {}]}>{order?.delivery_name}</Text>
                                           </>
                                                                  :
                                           <Text style = {[MyStyleSheet.textListItemTitleAltDark, {marginBottom: 2}]}>{order?.delivery_name}</Text>
                                          }
                                          {order?.customers_telephone ?
                                           <Text style = {[MyStyleSheet.textListItemSubTitleAlt, {marginBottom: 4}]}>{order.customers_telephone}</Text> : null
                                          }
                                          <Text style = {MyStyleSheet.textListItemSubTitleAlt}>{order?.delivery_street_address}</Text>
                                          <Text style = {MyStyleSheet.textListItemSubTitleAlt}>{order?.delivery_city}</Text>
                                          <Text style = {MyStyleSheet.textListItemSubTitleAlt}>{order?.delivery_state}</Text>
                                          <Text style = {MyStyleSheet.textListItemSubTitleAlt}>{order?.delivery_country}</Text>
                                          <Text style = {MyStyleSheet.textListItemSubTitleAlt}>{order?.delivery_postcode}</Text>
                                      </View>
                                  </View>
                              </View>
                             }

                             <View style = {[MyStyleSheet.viewPageCard, {}]}>
                                 <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 10}]}>{MyLANG.BillingAddress}</Text>

                                 <View style = {[MyStyle.RowLeftCenter]}>
                                     <MyIcon.SimpleLineIcons
                                         name = "envelope"
                                         size = {21}
                                         color = {MyColor.textDarkSecondary2}
                                         style = {{alignSelf: "flex-start", marginTop: 2, marginRight: 10}}
                                     />
                                     <View style = {[MyStyle.ColumnStart, {flex: 1}]}>
                                         {order.billing_company ?
                                          <>
                                              <Text style = {[MyStyleSheet.textListItemTitleAltDark, {}]}>{order?.billing_company}</Text>
                                              <Text style = {[MyStyleSheet.textListItemSubTitleAlt, {}]}>{order?.billing_name}</Text>
                                          </>
                                                                :
                                          <Text style = {[MyStyleSheet.textListItemTitleAltDark, {marginBottom: 2}]}>{order?.billing_name}</Text>
                                         }
                                         {order?.customers_telephone ?
                                          <Text style = {[MyStyleSheet.textListItemSubTitleAlt, {marginBottom: 4}]}>{order.customers_telephone}</Text> : null
                                         }
                                         <Text style = {MyStyleSheet.textListItemSubTitleAlt}>{order?.billing_street_address}</Text>
                                         <Text style = {MyStyleSheet.textListItemSubTitleAlt}>{order?.billing_city}</Text>
                                         <Text style = {MyStyleSheet.textListItemSubTitleAlt}>{order?.billing_state}</Text>
                                         <Text style = {MyStyleSheet.textListItemSubTitleAlt}>{order?.billing_country}</Text>
                                         <Text style = {MyStyleSheet.textListItemSubTitleAlt}>{order?.billing_postcode}</Text>
                                     </View>
                                 </View>
                             </View>

                             {(order?.delivery_type === MyConfig.DeliveryType.Courier.id) &&
                              <View style = {[MyStyleSheet.viewPageCard, {}]}>
                                  <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 15}]}>{MyLANG.DeliveryMethod}</Text>

                                  <View style = {[MyStyle.RowLeftCenter, {marginBottom: 5}]}>
                                      <MyIcon.SimpleLineIcons
                                          name = "handbag"
                                          size = {26}
                                          color = {MyColor.textDarkSecondary2}
                                          style = {{}}
                                      />
                                      <View style = {[MyStyle.ColumnCenterStart, {flex: 1, marginHorizontal: 14}]}>
                                          <Text style = {[MyStyleSheet.textListItemTitleDark]}>
                                              {order?.shipping_method}
                                          </Text>
                                          {/*<Text style = {[MyStyleSheet.textListItemSubTitle]}>
                                             {MyLANG.SelectedPaymentMethodDesc}
                                         </Text>*/}
                                      </View>
                                  </View>
                              </View>
                             }

                             <View style = {[MyStyleSheet.viewPageCard, {}]}>
                                 <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 15}]}>{MyLANG.PaymentMethod}</Text>

                                 <View style = {[MyStyle.RowLeftCenter, {marginBottom: 5}]}>
                                     <MyIcon.SimpleLineIcons
                                         name = "wallet"
                                         size = {26}
                                         color = {MyColor.textDarkSecondary2}
                                         style = {{}}
                                     />
                                     <View style = {[MyStyle.ColumnCenterStart, {flex: 1, marginHorizontal: 14}]}>
                                         <Text style = {[MyStyleSheet.textListItemTitleDark]}>
                                             {order?.payment_method}
                                         </Text>
                                     </View>
                                 </View>
                             </View>

                             {(order?.payment_method === MyConfig.PaymentMethod.Installment.name) &&
                              <View style = {[MyStyleSheet.viewPageCard, {}]}>
                                  <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 15}]}>{MyLANG.MembershipType}</Text>

                                  <View style = {[MyStyle.RowLeftCenter, {marginBottom: 5}]}>
                                      <MyIcon.SimpleLineIcons
                                          name = "people"
                                          size = {26}
                                          color = {MyColor.textDarkSecondary2}
                                          style = {{}}
                                      />
                                      <View style = {[MyStyle.ColumnCenterStart, {flex: 1, marginHorizontal: 14}]}>
                                          <Text style = {[MyStyleSheet.textListItemTitleDark]}>
                                              {order?.installment_membership_type_name}
                                          </Text>
                                      </View>
                                  </View>
                              </View>
                             }
                             {(order?.payment_method === MyConfig.PaymentMethod.Installment.name) &&
                              <View style = {[MyStyleSheet.viewPageCard, {}]}>
                                  <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 15}]}>{MyLANG.InstallmentPeriod}</Text>

                                  <View style = {[MyStyle.RowLeftCenter, {marginBottom: 5}]}>
                                      <MyIcon.SimpleLineIcons
                                          name = "calendar"
                                          size = {26}
                                          color = {MyColor.textDarkSecondary2}
                                          style = {{}}
                                      />
                                      <View style = {[MyStyle.ColumnCenterStart, {flex: 1, marginHorizontal: 14}]}>
                                          <Text style = {[MyStyleSheet.textListItemTitleDark]}>
                                              {order?.installment_period_name}
                                          </Text>
                                      </View>
                                  </View>
                              </View>
                             }

                             <View style = {[MyStyleSheet.viewPageCard, {}]}>
                                 <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 15}]}>{MyLANG.OrderNote}</Text>

                                 <View style = {[MyStyle.RowLeftCenter, {marginBottom: 5}]}>
                                     <View style = {[MyStyle.ColumnCenterStart, {flex: 1}]}>
                                         <Text style = {[MyStyleSheet.textListItemTitleDark]}>
                                             {order?.customer_comments}
                                         </Text>
                                     </View>
                                 </View>
                             </View>

                             <CartPageTotal
                                 cart = {{
                                     subtotal       : order?.subtotal,
                                     discount       : order?.discount,
                                     voucher        : order?.coupon_amount,
                                     delivery_charge: order?.shipping_cost,
                                     tax            : order?.total_tax,
                                     total          : order?.order_price,
                                 }}
                                 service_charge = {false}
                                 installment = {order?.payment_method === MyConfig.PaymentMethod.Installment.name ? {
                                     amount: order?.installment_amount,
                                     months: order?.installment_period_name,
                                 } : null}
                                 style = {{backgroundColor: MyColor.Material.WHITE, marginBottom: MyStyle.marginViewGapCard}}
                             />

                             {(order?.orders_status_id === MyConstant.OrderStatus.Pending && order?.payment_method === MyConfig.PaymentMethod.CashOnDelivery.name) &&
                              <MyMaterialRipple
                                  style = {[MyStyleSheet.viewPageCard, MyStyle.RowLeftCenter, {
                                      marginTop: MyStyle.marginVerticalPage / 2,
                                  }]}
                                  {...MyStyle.MaterialRipple.drawer}
                                  onPress = {() => onUploadReceipt()}
                              >
                                  <View style = {[MyStyle.ColumnCenterStart, {flex: 1}]}>
                                      <Text style = {[MyStyleSheet.textListItemTitleDark]}>
                                          {MyLANG.UploadReceipt}
                                      </Text>
                                      <Text style = {[MyStyleSheet.textListItemSubTitle]}>
                                          {MyLANG.UploadReceiptDesc}
                                      </Text>
                                  </View>
                                  <MyIcon.SimpleLineIcons
                                      name = "arrow-up-circle"
                                      size = {26}
                                      color = {MyColor.attentionDark}
                                      style = {{}}
                                  />
                              </MyMaterialRipple>
                             }

                             {
                                 order?.orders_status_id === MyConstant.OrderStatus.Pending &&
                                 <MyMaterialRipple
                                     style = {[MyStyleSheet.viewPageCard, MyStyle.RowLeftCenter, {
                                         marginTop   : MyStyle.marginVerticalPage / 2,
                                         marginBottom: MyStyle.marginVerticalPage
                                     }]}
                                     {...MyStyle.MaterialRipple.drawer}
                                     onPress = {() => onCancelOrder()}
                                 >
                                     <View style = {[MyStyle.ColumnCenterStart, {flex: 1}]}>
                                         <Text style = {[MyStyleSheet.textListItemTitleDark]}>
                                             {MyLANG.CancelOrder}
                                         </Text>
                                         <Text style = {[MyStyleSheet.textListItemSubTitle]}>
                                             {MyLANG.CancelOrderDesc}
                                         </Text>
                                     </View>
                                     <MyIcon.SimpleLineIcons
                                         name = "close"
                                         size = {26}
                                         color = {MyColor.attentionDark}
                                         style = {{}}
                                     />
                                 </MyMaterialRipple>
                             }

                             <MyMaterialRipple
                                 style = {[MyStyleSheet.viewPageCard, MyStyle.RowLeftCenter, {marginBottom: MyStyle.marginVerticalPage}]}
                                 {...MyStyle.MaterialRipple.drawer}
                                 onPress = {() => onReturnOrder()}
                             >
                                 <View style = {[MyStyle.ColumnCenterStart, {flex: 1}]}>
                                     <Text style = {[MyStyleSheet.textListItemTitleDark]}>
                                         {MyLANG.ReturnOrder}
                                     </Text>
                                     <Text style = {[MyStyleSheet.textListItemSubTitle]}>
                                         {MyLANG.ReturnOrderDesc}
                                     </Text>
                                 </View>
                                 <MyIcon.SimpleLineIcons
                                     name = "reload"
                                     size = {26}
                                     color = {MyColor.attentionDark}
                                     style = {{}}
                                 />
                             </MyMaterialRipple>

                         </ScrollView>

                     </>
                                   :
                     firstLoad ?
                     <ScrollView
                         contentInsetAdjustmentBehavior = "automatic"
                         contentContainerStyle = {{paddingTop: MyStyle.headerHeightAdjusted, flexGrow: 1}}
                     >
                         {OrderDetailsContentLoader(4)}
                     </ScrollView>
                               :
                     !firstLoad ?
                     <ListEmptyViewLottie
                         source = {MyImage.lottie_empty_lost}
                         message = {MyLANG.NoOrderDetailsFound}
                         style = {{view: {}, image: {}, text: {}}}
                     />
                                :
                     null
                    }

                </View>

                {
                    ((Array.isArray(order?.images) && order?.images?.length > 0) || order?.image?.length > 0) &&
                    <MyImageViewer
                        visible = {imageViewerVisible}
                        onRequestClose = {() => setImageViewerVisible(false)}
                        images = {order?.images?.length > 0 ? order?.images : [{image: order?.image}]}
                    />
                }

                {(order?.orders_status_id === MyConstant.OrderStatus.Pending && order?.payment_method === MyConfig.PaymentMethod.CashOnDelivery.name) &&
                 <MyModal
                     visible = {modalVisibleFileSource}
                     onRequestClose = {() => setModalVisibleFileSource(false)}
                     children = {
                         <ModalNotFullScreen
                             onRequestClose = {() => setModalVisibleFileSource(false)}
                             children = {
                                 <ModalRadioList
                                     title = {MyLANG.SelectFileSource}
                                     onItem = {(item: any) => onModalItem(item)}
                                     items = {MyConfig?.fileSourceProfilePhto}
                                     titleText = "title"
                                     bodyText = "bodyText"
                                     radio = {false}
                                 />
                             }
                         />
                     }
                 />
                }

            </SafeAreaView>
        </Fragment>
    )
}

OrderDetailsScreen.navigationOptions = {}

export default OrderDetailsScreen;

const cartListSmall = StyleSheet.create(
    {
        view     : {
            display       : 'flex',
            flexDirection : 'row',
            justifyContent: 'space-around',
            alignItems    : "flex-start",

            paddingVertical: 12,

            borderBottomWidth: 0.9,
            borderBottomColor: MyColor.dividerDark,
        },
        image    : {
            ...MyStyleSheet.imageListSmall,
        },
        textsView: {
            flex: 1,

            display       : 'flex',
            flexDirection : 'column',
            justifyContent: 'space-between',

            marginLeft: MyStyle.marginHorizontalTextsView,
        },
        textName : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 13,
            color     : MyColor.Material.BLACK,
        },

        viewPrice          : {
            display       : "flex",
            flexDirection : "row",
            justifyContent: "space-between",
            alignItems    : "baseline",
        },
        textPrice          : {
            fontFamily: MyStyle.fontFamilyPrice,
            fontSize  : 12,
            color     : MyColor.textDarkSecondary,

            marginTop  : 2,
            marginRight: 3,
        },
        textQuantity       : {
            fontFamily : MyStyle.FontFamily.OpenSans.semiBold,
            fontSize   : 12,
            color      : MyColor.Primary.first,
            marginRight: 7,
        },
        textPriceDiscounted: {
            fontFamily        : MyStyle.fontFamilyPrice,
            fontSize          : 11,
            color             : MyColor.textDarkSecondary2,
            textDecorationLine: "line-through",
        },
        textPriceTotal     : {
            textAlign: "right",

            fontFamily: MyStyle.fontFamilyPrice,
            fontSize  : 13,
            color     : MyColor.Primary.first,
        },
    }
);
