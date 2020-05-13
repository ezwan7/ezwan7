import React, {Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';

import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    RefreshControl,
    Modal,
} from 'react-native';

import HTML from 'react-native-render-html';
import {Shadow} from "react-native-neomorph-shadows";
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
    StatusBarDark,
    StatusBarGradientPrimary,
    StatusBarLight
} from '../components/MyComponent';
import {
    ImageSliderBanner,
    ProductListItemContentLoader,
    ListItemSeparator,
    ProductListItem,
    ProductDetailsContentLoader, ImageSliderCounter,
} from "../shared/MyContainer";

import {cartEmpty, cartItemAdd, cartItemQuantityIncrement} from "../store/CartRedux";
import {MyImageViewer} from "../components/MyImageViewer";
import MyMaterialRipple from "../components/MyMaterialRipple";
import {MyFastImage} from "../components/MyFastImage";
import LinearGradient from "react-native-linear-gradient";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import NumberFormat from "react-number-format";
import {WebView} from 'react-native-webview';


let renderCount = 0;

const productFormSchema: any = yup.object().shape(
    {
        product: yup.object()
                    .required(MyLANG.Product + ' ' + MyLANG.isRequired),
        total  : yup.number()
                    .required(MyLANG.Price + ' ' + MyLANG.isRequired)
                    .min(0, MyLANG.Price + ' ' + MyLANG.mustBeMinimum + ' 0 ' + MyLANG.character)
                    .max(1000000, MyLANG.Price + ' ' + MyLANG.mustBeMaximum + ' 1000000 ' + MyLANG.character),
    }
);

const ProductDetailsScreen = ({route, navigation}: any) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${ProductDetailsScreen.name}. renderCount: `, {renderCount});
    }

    const dispatch = useDispatch();

    const user: any = useSelector((state: any) => state.auth.user);
    const cart: any = useSelector((state: any) => state.cart);

    const [refreshing, setRefreshing] = useState(false);
    const [firstLoad, setFirstLoad]   = useState(true);

    const [imageViewerVisible, setImageViewerVisible] = useState(false);

    const scrollRef: any                  = useRef();
    const [segmentIndex, setSegmentIndex] = useState(0);

    const [imageSliderIndex, setImageSliderIndex] = useState(0);

    const videoRef: any = useRef();

    const {register, getValues, setValue, handleSubmit, formState, errors, reset, triggerValidation, watch}: any = useForm(
        {
            mode                : 'onSubmit',
            reValidateMode      : 'onChange',
            // defaultValues       : defaultValues,
            validationSchema    : productFormSchema,
            validateCriteriaMode: 'all',
            submitFocusError    : true,
        }
    );

    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${ProductDetailsScreen.name}. useEffect: register: `, {product, total});

        for (const key of Object.keys(productFormSchema['fields'])) {
            if (key) {
                register({name: key});
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [register]);

    const values           = getValues();
    const {product, total} = watch(['product', 'total']);

    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${ProductDetailsScreen.name}. useEffect: `, {user, cart, product, total});

        fetchProduct(false, false, false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRefresh = useCallback(() => {
        MyUtil.printConsole(true, 'log', 'LOG: onRefresh: ', {});

        setRefreshing(true);

        fetchProduct(false, true, {
            'showMessage': MyConstant.SHOW_MESSAGE.TOAST,
            'message'    : MyLANG.PageRefreshed
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchProduct = async (showLoader: any = MyLANG.Loading + '...', setRefresh: boolean = false, showInfoMessage: any = false) => {
        if (route?.params?.id) {
            const response: any = await MyUtil
                .myHTTP(false, MyConstant.HTTP_POST, MyAPI.product,
                        {
                            'language_id' : MyConfig.LanguageActive,
                            'products_id' : route?.params?.id,
                            'customers_id': user?.id,

                            'app_ver'      : MyConfig.app_version,
                            'app_build_ver': MyConfig.app_build_version,
                            'platform'     : MyConfig.app_platform,
                            'device'       : null,
                        }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
                );

            MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
                'apiURL': MyAPI.product, 'response': response
            });

            if (response.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data?.data?.product_data[0]) {

                const data = response.data.data.product_data[0];
                if (data.id > 0) {
                    setValue('product', data, true);

                    calculateTotal(data, false);
                }

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

    const segmentChange = (index: number, width: number) => {
        // MyUtil.printConsole(true, 'log', 'LOG: segmentChange: ', {index, width});

        setSegmentIndex(index);

        scrollRef?.current?.scrollTo(
            {
                x        : index * width,
                animation: true,
            });
    }

    const calculateTotal = (item: any, updateProduct: boolean) => {

        try {
            const discounted_price: number = Number(item?.discount_price) > 0 ? Number(item?.discount_price) : 0;
            const product_price: number    = Number(item?.products_price) > 0 ? Number(item?.products_price) : 0;
            let calculated_total: number   = discounted_price > 0 ? discounted_price : product_price;

            let calculated_attribute: number = 0;

            if (item?.attributes?.length > 0) {
                for (const [i, attribute] of item?.attributes?.entries()) {
                    if (attribute?.values?.length > 0) {
                        for (const [i, value] of attribute?.values?.entries()) {
                            if (value?.cart_selected === true && Number.isFinite(Number(value?.price))) {
                                if (value?.price_prefix === '+') {
                                    calculated_attribute += Number(value?.price);
                                } else if (value?.price_prefix === '-') {
                                    calculated_attribute -= Number(value?.price);
                                }
                            }
                        }
                    }
                }
            }

            if (Number.isFinite(calculated_attribute)) {
                calculated_total = calculated_total + calculated_attribute;
            }

            let calculated_addon: number = 0;

            if (item?.linked?.length > 0) {
                for (const [i, addon] of item?.linked?.entries()) {
                    if (addon?.products?.length > 0) {
                        for (const [i, value] of addon?.products?.entries()) {
                            if (value?.cart_selected === true && Number.isFinite(Number(value?.products_price))) {
                                calculated_addon += Number(value?.products_price);
                            }
                        }
                    }
                }
            }

            if (Number.isFinite(calculated_addon)) {
                calculated_total = calculated_total + calculated_addon;
            }

            setValue('total', calculated_total, true);

            if (updateProduct) {
                setValue('product', item, true);
            }

            MyUtil.printConsole(true, 'log', 'LOG: calculateTotal: ', {item, product, total, calculated_total, calculated_attribute, updateProduct});

        } catch (e) {
            MyUtil.printConsole(true, 'log', 'LOG: calculateTotal: ', {item, e});

            calculateTotalFallback(item);
        }

    }

    // TODO
    const calculateTotalFallback = (item: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: calculateTotalFallback: ', {item, product, total});

        // Reset Attribute Selection and update product:
        /*const updatedProduct = {
            ...product,
            // isLiked: likeUnlike,
        }
        setValue('product', updatedProduct, true);*/

        let calculated_total: number = Number(item?.products_price) > 0 ? Number(item?.products_price) : 0;

        if (Number(calculated_total) > 0) {

        } else {
            let calculated_total: number = Number(product?.products_price) > 0 ? Number(product?.products_price) : 0;
        }

        if (Number(calculated_total) > 0) {
            setValue('total', calculated_total, true);
        } else {
            // go back or refresh
        }
    }

    const onAttribute = (item: any, i: number, j: number) => {

        const selected_option: any = item?.attributes?.[i]?.values?.[j];

        const cart_selected: boolean = selected_option?.cart_selected === true ? false : true;

        const updated_values: any = [];

        for (const [k, value] of item?.attributes?.[i]?.values?.entries()) {
            if (k === j) {
                updated_values[k] = {...value, cart_selected: cart_selected};
            } else {
                updated_values[k] = {...value, cart_selected: false};
            }
        }

        const updated_attribute: any = [...item?.attributes];
        updated_attribute[i]         = {...item?.attributes?.[i], values: updated_values};

        const updatedProduct: any = {
            ...item,
            attributes: updated_attribute
        }

        MyUtil.printConsole(true, 'log', 'LOG: onAttribute: ', {item, i, j, product, total, selected_option, cart_selected, updatedProduct});

        calculateTotal(updatedProduct, true);

    }

    const onAddOn = (item: any, i: number, j: number) => {

        const selected_option: any = item?.linked?.[i]?.products?.[j];

        const cart_selected: boolean = selected_option?.cart_selected === true ? false : true;

        const updated_products: any = [];

        for (const [k, prod] of item?.linked?.[i]?.products?.entries()) {
            if (k === j) {
                updated_products[k] = {...prod, cart_selected: cart_selected};
            } else {
                updated_products[k] = {...prod, cart_selected: false};
            }
        }

        const updated_addon: any = [...item?.linked];
        updated_addon[i]         = {...item?.linked?.[i], products: updated_products};

        const updatedProduct: any = {
            ...item,
            linked: updated_addon
        }

        MyUtil.printConsole(true, 'log', 'LOG: onAttribute: ', {item, i, j, total, selected_option, cart_selected, updatedProduct});

        calculateTotal(updatedProduct, true);

    }

    const onBuyNow = () => {

        if (product?.attributes?.length > 0) {

            let message: any = undefined;

            for (const [i, attribute] of product.attributes.entries()) {
                if (attribute?.values?.length > 0) {
                    for (const [j, value] of attribute.values.entries()) {
                        if (value?.cart_selected === true) {
                            message = null;
                        } else {
                            if (message === undefined) {
                                message = attribute?.option?.name || 'ITEM';
                            }
                        }
                    }
                    if (message?.length > 0) {
                        return MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, `${MyLANG.PleaseSelect} ${message}`, false);
                    }
                    message = undefined;
                }
            }
        }

        const itemId: string = '_' + product?.id;
        // MyUtil.printConsole(true, 'log', 'LOG: onBuyNow: ', {itemId, product});
        if (cart?.items[itemId]) {
            if (Number(product?.current_stock) > Number(cart?.items[itemId]?.quantity)) {
                dispatch(cartItemAdd(product));
            } else {
                MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.OutOfStock, false);
            }
            MyUtil.commonAction(false,
                                navigation,
                                MyConstant.CommonAction.navigate,
                                MyConfig.routeName.ProductBuy,
                                {item: product},
                                null
            )
        } else {
            if (Number(product?.current_stock) > 0) {
                dispatch(cartItemAdd(product));
                MyUtil.commonAction(false,
                                    navigation,
                                    MyConstant.CommonAction.navigate,
                                    MyConfig.routeName.ProductBuy,
                                    {item: product},
                                    null
                )
            } else {
                MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.OutOfStock, false);
            }
        }
    };

    const onProductLikeUnlike = async () => {

        const likeUnlike: any = await MyFunction.productLikeUnlike(product?.isLiked, product?.id, user?.id, false, false);

        if (likeUnlike !== false) {
            const updatedProduct = {
                ...product,
                isLiked: likeUnlike,
            }
            setValue('product', updatedProduct, true);
        }
    }


    return (
        <Fragment>
            <StatusBarGradientPrimary/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView1}/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <View style = {[MyStyleSheet.SafeAreaView3, {paddingTop: 0, backgroundColor: MyColor.Material.WHITE}]}>

                    {product?.id > 0 ?
                     <>
                         <ScrollView
                             contentInsetAdjustmentBehavior = "automatic"
                             contentContainerStyle = {{flexGrow: 1}}
                             refreshControl = {
                                 <RefreshControl
                                     refreshing = {refreshing}
                                     onRefresh = {onRefresh}
                                     progressViewOffset = {MyStyle.headerHeightAdjusted}
                                     colors = {[MyColor.Primary.first]}
                                 />
                             }
                         >

                             <ScrollView
                                 horizontal = {true}
                                 pagingEnabled = {true}
                                 decelerationRate = "fast"
                                 snapToInterval = {MyStyle.screenWidth}
                                 snapToAlignment = "center"
                                 showsHorizontalScrollIndicator = {false}
                                 onMomentumScrollEnd = {(event: any) =>
                                     setImageSliderIndex(Math.round(event.nativeEvent.contentOffset.x / MyStyle.screenWidth))
                                 }
                             >
                                 <ImageSliderBanner
                                     item = {(Array.isArray(product?.images) && product?.images?.length > 0) ? product?.images : [{image: product?.image}]}
                                     onPress = {(prop: any) => prop?.image?.length ? setImageViewerVisible(true) : null}
                                     resizeMode = {'contain'}
                                     style = {{height: MyStyle.screenWidth / 1.5}}
                                 />
                             </ScrollView>

                             <ImageSliderCounter
                                 count = {(Array.isArray(product?.images) && product?.images?.length > 0) ? product.images.length : 1}
                                 imageSliderIndex = {imageSliderIndex}
                             />

                             <View style = {MyStyleSheet.viewPageCard}>
                                 <Text
                                     numberOfLines = {2}
                                     style = {[MyStyleSheet.textPageTitle, {
                                         textAlign       : 'center',
                                         marginHorizontal: MyStyle.marginHorizontalPage,
                                         marginTop       : 2
                                     }]}
                                 >
                                     {product?.products_name}
                                 </Text>

                                 <View style = {{marginTop: 13, ...MyStyle.RowBetweenTop}}>

                                     <View style = {MyStyle.ColumnTopLeft}>
                                         <View style = {MyStyle.RowLeftCenter}>
                                             {Array(5).fill('').map(
                                                 (rating: any, key: any) => (
                                                     Number(key) < Number(product?.rating) ?
                                                     <IconStar
                                                         key = {key}
                                                         solid
                                                         style = {{marginRight: 3}}
                                                     /> :
                                                     <IconStar
                                                         key = {key}
                                                         solid
                                                         color = {MyColor.Material.GREY["200"]}
                                                         style = {{marginRight: 3}}
                                                     />
                                                 ))
                                             }
                                             <Text
                                                 style = {[MyStyleSheet.textListItemTitle2, {marginLeft: 5}]}>
                                                 {product?.rating > 0 ? product?.rating : '0'}
                                             </Text>
                                         </View>
                                         <Text style = {[MyStyleSheet.textListItemSubTitleAlt, {marginTop: 2}]}>
                                             {product?.reviewed_customers?.length > 0 ? `${product?.reviewed_customers?.length}` : '0'} {MyLANG['Review(s)']}
                                         </Text>
                                         <View style = {[MyStyle.RowLeft, {marginTop: 10}]}>
                                             <MyIcon.SimpleLineIcons
                                                 name = "handbag"
                                                 size = {15}
                                                 color = {MyColor.textDarkPrimary}
                                                 style = {{marginRight: 5}}
                                             />
                                             <Text style = {[MyStyleSheet.textListItemTitle2Dark, {}]}>
                                                 {product?.products_ordered > 0 ? product?.products_ordered : '0'} {MyLANG.Sold}
                                             </Text>
                                         </View>
                                     </View>

                                     <View style = {MyStyle.ColumnTopRight}>
                                         <View style = {MyStyle.ColumnTopRight}>
                                             <Text style = {[MyStyleSheet.textPricePage, {lineHeight: 25}]}>
                                                 {MyConfig.Currency.MYR.symbol} {product?.discount_price ? product?.discount_price : product?.products_price}
                                             </Text>
                                             {product?.discount_price &&
                                              <Text style = {[MyStyleSheet.textPriceDiscountedPage, {lineHeight: 16}]}>
                                                  {MyConfig.Currency.MYR.symbol} {product?.products_price}
                                              </Text>
                                             }
                                         </View>
                                         {product?.current_stock > 0 ?
                                          <View style = {[MyStyle.RowLeftBottom, {marginTop: 10}]}>
                                              <MyIcon.SimpleLineIcons
                                                  name = "check"
                                                  size = {15}
                                                  color = {MyColor.Material.GREEN["600"]}
                                                  style = {{marginRight: 4}}
                                              />
                                              <Text style = {[MyStyleSheet.textListItemTitle2Dark, {color: MyColor.Material.GREEN["600"]}]}>
                                                  {MyLANG.InStock}
                                              </Text>
                                          </View>
                                                                     :
                                          <View style = {[MyStyle.RowLeftBottom, {marginTop: 7}]}>
                                              <MyIcon.SimpleLineIcons
                                                  name = "close"
                                                  size = {15}
                                                  color = {MyColor.Material.RED["600"]}
                                                  style = {{marginRight: 4}}
                                              />
                                              <Text style = {[MyStyleSheet.textListItemTitle2Dark, {color: MyColor.Material.RED["600"]}]}>
                                                  {MyLANG.OutOfStock}
                                              </Text>
                                          </View>
                                         }
                                         {/*<View style = {[MyStyle.RowLeftBottom, {marginTop: 5}]}>
                                             <MyIcon.SimpleLineIcons
                                                 name = "layers"
                                                 size = {15}
                                                 color = {MyColor.textDarkPrimary}
                                                 style = {{marginRight: 5}}
                                             />
                                             <Text style = {[MyStyleSheet.textListItemTitle2Dark]}>
                                                 {MyLANG.AvailableStock} {product?.current_stock > 0 ? product?.current_stock : '0'}
                                             </Text>
                                         </View>*/}
                                     </View>

                                 </View>

                             </View>

                             <View style = {MyStyleSheet.viewGap}></View>

                             {product?.attributes?.length > 0 && product.attributes.map(
                                 (attribute: any, i: number) => (
                                     <View key = {i}>
                                         <View style = {[MyStyleSheet.viewPageCard, MyStyle.ColumnStart, {paddingVertical: MyStyle.paddingVerticalPage / 2}]}>
                                             <Text style = {[MyStyleSheet.textListItemTitleDark, {paddingVertical: 10}]}>
                                                 {MyLANG.Available} {attribute.option?.name}
                                             </Text>
                                             <View style = {[MyStyle.RowLeftCenter, {flexWrap: "wrap"}]}>
                                                 {attribute?.values?.length > 0 && attribute.values.map(
                                                     (item: any, j: number) => (
                                                         <LinearGradient
                                                             key = {j}
                                                             style = {[MyStyle.ColumnStart, MyStyleSheet.LGButtonProductPage]}
                                                             {...
                                                                 item?.cart_selected === true ? {...MyStyle.LGButtonPrimary} : {...MyStyle.LGGrey}
                                                             }
                                                         >
                                                             <MyMaterialRipple
                                                                 style = {MyStyleSheet.MRButtonProductPage}
                                                                 {...MyStyle.MaterialRipple.drawerRounded}
                                                                 onPress = {() => onAttribute(product, i, j)}
                                                             >
                                                                 <Text style = {[MyStyleSheet.textListItemTitle2Dark, item?.cart_selected === true && {
                                                                     color: MyColor.textLightPrimary,
                                                                 }]}>
                                                                     {item.value}
                                                                 </Text>
                                                                 {/*{
                                                                     (item.price_prefix && item.price) &&
                                                                     <Text style = {[MyStyleSheet.textListItemSubTitle2, item?.cart_selected === true && {
                                                                         color: MyColor.textLightPrimary2,
                                                                     }]}>
                                                                         {item.price_prefix} {item.price}
                                                                     </Text>
                                                                 }*/}
                                                             </MyMaterialRipple>
                                                         </LinearGradient>
                                                     ))
                                                 }
                                             </View>
                                         </View>
                                         <View style = {MyStyleSheet.viewGap}></View>
                                     </View>
                                 ))
                             }

                             {product?.linked?.length > 0 && product.linked.map(
                                 (addon: any, i: number) => (
                                     <View key = {i}>
                                         <View style = {[MyStyleSheet.viewPageCard, MyStyle.ColumnStart, {paddingVertical: MyStyle.paddingVerticalPage / 2}]}>
                                             <Text style = {[MyStyleSheet.textListItemTitleDark, {paddingVertical: 10}]}>
                                                 {addon.subcat_name}
                                             </Text>
                                             <View style = {[MyStyle.RowLeftCenter, {flexWrap: "wrap"}]}>
                                                 {addon?.products?.length > 0 && addon.products.map(
                                                     (item: any, j: number) => (
                                                         <LinearGradient
                                                             key = {j}
                                                             style = {[MyStyle.ColumnStart, MyStyleSheet.LGButtonProductPage]}
                                                             {...
                                                                 item?.cart_selected === true ? {...MyStyle.LGButtonPrimary} : {...MyStyle.LGGrey}
                                                             }
                                                         >
                                                             <MyMaterialRipple
                                                                 style = {MyStyleSheet.MRButtonProductPage}
                                                                 {...MyStyle.MaterialRipple.drawerRounded}
                                                                 onPress = {() => onAddOn(product, i, j)}
                                                             >
                                                                 <Text style = {[MyStyleSheet.textListItemTitle2Dark, item?.cart_selected === true && {
                                                                     color: MyColor.textLightPrimary,
                                                                 }]}>
                                                                     {item.products_name}
                                                                 </Text>
                                                                 {/*{
                                                                     (Number(item.products_price) > 0) &&
                                                                     <Text style = {[MyStyleSheet.textListItemSubTitle2, item?.cart_selected === true && {
                                                                         color: MyColor.textLightPrimary2,
                                                                     }]}>
                                                                         + {item.products_price}
                                                                     </Text>
                                                                 }*/}
                                                             </MyMaterialRipple>
                                                         </LinearGradient>
                                                     ))
                                                 }
                                             </View>
                                         </View>
                                         <View style = {MyStyleSheet.viewGap}></View>
                                     </View>
                                 ))
                             }

                             <View style = {MyStyleSheet.viewGap}></View>

                             <View>

                                 <ScrollView
                                     horizontal = {true}
                                     showsHorizontalScrollIndicator = {false}
                                     contentContainerStyle = {[MyStyle.RowLeftCenter, {
                                         flexGrow       : 1,
                                         backgroundColor: MyColor.backgroundGrey,
                                     }]}
                                 >
                                     {MyConfig?.productDetailsSegments.map(
                                         (prop: any, index: any) => (
                                             <MyMaterialRipple
                                                 key = {index}
                                                 style = {[
                                                     index === 0 && {paddingLeft: MyStyle.marginHorizontalPage},
                                                     index === segmentIndex && {backgroundColor: MyColor.Material.WHITE},
                                                     {
                                                         paddingVertical  : MyStyle.marginVerticalList,
                                                         paddingHorizontal: MyStyle.marginHorizontalList,
                                                     }
                                                 ]}
                                                 {...MyStyle.MaterialRipple.drawer}
                                                 onPress = {() => segmentChange(index, MyStyle.screenWidth)}
                                             >
                                                 <Text style = {[MyStyleSheet.textListItemTitle2Dark, {}]}>
                                                     {prop.name}{prop.key === 'Review' ? product?.reviewed_customers?.length > 0 ? ` (${product?.reviewed_customers?.length})` : ' (0)' : ''}
                                                 </Text>
                                             </MyMaterialRipple>
                                         ))
                                     }

                                 </ScrollView>

                                 <ScrollView
                                     ref = {scrollRef}
                                     horizontal = {true}
                                     pagingEnabled = {true}
                                     decelerationRate = "fast"
                                     snapToInterval = {MyStyle.screenWidth}
                                     snapToAlignment = "center"
                                     showsHorizontalScrollIndicator = {false}
                                     contentContainerStyle = {{}}
                                     onMomentumScrollEnd = {(event: any) =>
                                         setSegmentIndex(Math.round(event.nativeEvent.contentOffset.x / MyStyle.screenWidth))
                                     }
                                 >
                                     <View style = {[{width: MyStyle.screenWidth, paddingVertical: MyStyle.marginVerticalPage}]}>
                                         <Text style = {[MyStyleSheet.textListItemTitle2Dark, {marginHorizontal: MyStyle.marginHorizontalPage}]}>
                                             {product?.products_short_description || MyLANG.NoDescriptionFound}
                                         </Text>
                                     </View>
                                     <View style = {{width: MyStyle.screenWidth, paddingVertical: MyStyle.marginVerticalPage}}>
                                         <HTML
                                             html = {product?.products_description ? product.products_description : MyLANG.NoInformationFound}
                                             tagsStyles = {MyStyle.textHTMLBody}
                                             ignoredTags = {MyStyle.IGNORED_TAGS}
                                             containerStyle = {{marginHorizontal: MyStyle.marginHorizontalPage}}
                                             textSelectable = {true}
                                         />
                                     </View>
                                     <View style = {{width: MyStyle.screenWidth, paddingVertical: MyStyle.marginVerticalPage}}>
                                         <Text style = {[MyStyleSheet.textListItemTitle2Dark, {marginHorizontal: MyStyle.marginHorizontalPage}]}>
                                             {product?.products_warranty || MyLANG.NoInformationFound}
                                         </Text>
                                     </View>
                                     <View style = {{width: MyStyle.screenWidth}}>
                                         {(product?.products_video && product?.products_video?.slice(product.products_video.indexOf('watch?v=') + 'watch?v='.length)) ?
                                          <WebView
                                              style = {{width: MyStyle.screenWidth, maxHeight: MyStyle.screenWidth}}
                                              javaScriptEnabled = {true}
                                              domStorageEnabled = {true}
                                              source = {{
                                                  uri: 'https://www.youtube.com/embed/mm6E_JEb-JI'
                                              }}
                                          />
                                                                                                                                                                      :
                                          <Text style = {[MyStyleSheet.textListItemTitle2Dark, {
                                              paddingVertical : MyStyle.marginVerticalPage,
                                              marginHorizontal: MyStyle.marginHorizontalPage,
                                          }]}>
                                              {MyLANG.NoVideoAvailable}
                                          </Text>
                                         }
                                     </View>
                                     <View style = {{width: MyStyle.screenWidth}}>
                                         {
                                             product?.reviewed_customers?.length > 0 ?
                                             <ScrollView
                                                 contentContainerStyle = {{
                                                     marginHorizontal: MyStyle.marginHorizontalPage,
                                                     // flexGrow    : 0
                                                 }}
                                             >
                                                 {product.reviewed_customers.map(
                                                     (item: any, index: any) => (
                                                         <View
                                                             key = {index}
                                                             style = {[MyStyle.RowLeftCenter, {
                                                                 marginVertical   : MyStyle.marginVerticalPage,
                                                                 borderBottomColor: MyColor.dividerDark,
                                                                 borderBottomWidth: index === (product.reviewed_customers?.length - 1) ? 0 : 0.9,
                                                             }]}
                                                         >
                                                             <MyFastImage
                                                                 source = {[item?.customers_picture?.length > 9 ? {'uri': item?.customers_picture} : MyImage.defaultAvatar, MyImage.defaultAvatar]}
                                                                 style = {[MyStyleSheet.imageListSmall, {borderRadius: 100}]}
                                                             />
                                                             <View style = {[MyStyle.ColumnBetween, {marginHorizontal: MyStyle.marginHorizontalTextsView}]}>
                                                                 <Text style = {MyStyleSheet.textListItemTitle2Dark}>
                                                                     {item?.customers_name}
                                                                 </Text>
                                                                 <View style = {[MyStyle.RowLeftCenter, {marginVertical: 2}]}>
                                                                     {Array(5).fill('').map(
                                                                         (rating: any, key: any) => (
                                                                             Number(key) < Number(item?.reviews_rating) ?
                                                                             <IconStar
                                                                                 key = {key}
                                                                                 size = {10}
                                                                                 color = {MyColor.Material.YELLOW['600']}
                                                                                 solid
                                                                                 style = {{marginRight: 3}}
                                                                             /> :
                                                                             <IconStar
                                                                                 key = {key}
                                                                                 size = {10}
                                                                                 color = {MyColor.Material.GREY['200']}
                                                                                 solid
                                                                                 style = {{marginRight: 3}}
                                                                             />
                                                                         )
                                                                     )}
                                                                     <Text style = {[MyStyleSheet.textListItemSubTitle, {marginLeft: 4}]}>
                                                                         {Number(item?.reviews_rating) > 0 ? item.reviews_rating : '0'}
                                                                     </Text>
                                                                 </View>
                                                                 <Text style = {[MyStyleSheet.textListItemSubTitle2, {alignSelf: "flex-end"}]}>
                                                                     {MyUtil.momentFormat(item?.last_modified,
                                                                                          MyConstant.MomentFormat["1st Jan, 1970 12:01 am"]
                                                                     )}
                                                                 </Text>
                                                             </View>
                                                         </View>
                                                     )
                                                 )}

                                             </ScrollView>
                                                                                     :
                                             <Text style = {[MyStyleSheet.textListItemTitle2Dark, {
                                                 paddingVertical : MyStyle.marginVerticalPage,
                                                 marginHorizontal: MyStyle.marginHorizontalPage
                                             }]}>
                                                 {MyLANG.NoReviewsYet}
                                             </Text>
                                         }
                                     </View>
                                 </ScrollView>
                             </View>

                             <View style = {MyStyleSheet.viewGap}></View>

                         </ScrollView>

                         <Shadow style = {MyStyle.neomorphShadow.buttonBottom}>
                             <View
                                 style = {{
                                     flexDirection  : "row",
                                     justifyContent : "space-between",
                                     alignItems     : "center",
                                     backgroundColor: MyColor.Material.WHITE,
                                 }}
                             >
                                 <View
                                     style = {{
                                         flex          : 0.50,
                                         flexDirection : "row",
                                         justifyContent: "space-around",
                                         alignItems    : "center",
                                     }}
                                 >
                                     <MyButton
                                         shape = "square"
                                         fill = "solid"
                                         color = {MyColor.Material.WHITE}
                                         shadow = "none"
                                         iconLeft = {{name: 'share'}}
                                         iconLeftStyle = {{color: MyColor.Material.BLACK}}
                                         onPress = {
                                             () =>
                                                 MyUtil.share(MyConstant.SHARE.TYPE.open,
                                                              product?.image,
                                                              {
                                                                  message: `${product?.products_name}\n${product?.image}`,
                                                                  url    : product?.image,
                                                              },
                                                              false
                                                 )
                                         }
                                     />
                                     <MyButton
                                         shape = "square"
                                         fill = "solid"
                                         color = {MyColor.Material.WHITE}
                                         shadow = "none"
                                         iconLeft = {
                                             {
                                                 fontFamily: product?.isLiked === '1' ? MyConstant.VectorIcon.FontAwesome : MyConstant.VectorIcon.SimpleLineIcons,
                                                 name      : 'heart',
                                             }
                                         }
                                         iconLeftStyle = {
                                             {
                                                 color   : product?.isLiked === '1' ? MyColor.Material.RED["A400"] : MyColor.Material.BLACK,
                                                 fontSize: product?.isLiked === '1' ? 18 : 17,
                                             }
                                         }
                                         onPress = {onProductLikeUnlike}
                                     />
                                     <MyButton
                                         shape = "square"
                                         fill = "solid"
                                         color = {MyColor.Material.WHITE}
                                         shadow = "none"
                                         iconLeft = {{name: 'handbag'}}
                                         iconLeftStyle = {{color: MyColor.Material.BLACK}}
                                         onPress = {
                                             () =>
                                                 MyUtil.commonAction(false,
                                                                     null,
                                                                     MyConstant.CommonAction.navigate,
                                                                     MyConfig.routeName.ProductBuy,
                                                                     {},
                                                                     null
                                                 )
                                         }
                                     />
                                 </View>

                                 <LinearGradient
                                     style = {[MyStyle.ColumnCenter, {flex: 0.50, height: 46}]}
                                     {...MyStyle.LGButtonPrimary}
                                 >
                                     <MyMaterialRipple
                                         style = {[MyStyle.ColumnCenterRight, {height: 46, paddingHorizontal: MyStyle.paddingHorizontalPage}]}
                                         {...MyStyle.MaterialRipple.drawer}
                                         onPress = {() => onBuyNow()}
                                     >
                                         <NumberFormat
                                             value = {total}
                                             defaultValue = {0}
                                             displayType = {'text'}
                                             thousandSeparator = {true}
                                             decimalScale = {2}
                                             fixedDecimalScale = {true}
                                             decimalSeparator = {'.'}
                                             renderText = {
                                                 (value: any) => <Text style = {{
                                                     fontFamily: MyStyle.FontFamily.Roboto.regular,
                                                     fontSize  : 16,
                                                     color     : MyColor.textLightPrimary,
                                                 }}>
                                                     {MyConfig.Currency.MYR.symbol} {value}
                                                 </Text>
                                             }
                                         />

                                         <Text style = {{
                                             fontFamily   : MyStyle.FontFamily.Roboto.regular,
                                             fontSize     : 12,
                                             color        : MyColor.textLightSecondary,
                                             lineHeight   : 13,
                                             textTransform: "uppercase",
                                         }}>
                                             {MyLANG.BuyNow}
                                         </Text>
                                     </MyMaterialRipple>
                                 </LinearGradient>

                             </View>
                         </Shadow>

                     </>
                                     :
                     firstLoad ?
                     <ScrollView
                         contentInsetAdjustmentBehavior = "automatic"
                         contentContainerStyle = {{flexGrow: 1}}
                     >
                         {<ProductDetailsContentLoader/>}
                     </ScrollView>
                               :
                     !firstLoad ?
                     <ListEmptyViewLottie
                         source = {MyImage.lottie_empty_lost}
                         message = {MyLANG.NoProductDetailsFound}
                         style = {{view: {}, image: {}, text: {}}}
                     />
                                :
                     null
                    }

                </View>

                {
                    ((Array.isArray(product?.images) && product?.images?.length > 0) || product?.image?.length > 0) &&
                    <MyImageViewer
                        visible = {imageViewerVisible}
                        onRequestClose = {() => setImageViewerVisible(false)}
                        images = {product?.images?.length > 0 ? product?.images : [{image: product?.image}]}
                    />
                }

            </SafeAreaView>
        </Fragment>
    )
}

ProductDetailsScreen.navigationOptions = {}

export default ProductDetailsScreen;

