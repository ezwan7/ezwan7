import React, {Fragment, useCallback, useEffect, useLayoutEffect, useState} from 'react';

import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    RefreshControl,
    Modal,
} from 'react-native';

import HTML from 'react-native-render-html';
import {ShadowBox} from "react-native-neomorph-shadows";
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
    getMyIcon,
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
    ProductDetailsContentLoader,
} from "../shared/MyContainer";

import {cartEmpty, cartItemAdd, cartItemQuantityIncrement} from "../store/CartRedux";
import {MyImageViewer} from "../components/MyImageViewer";
import MyMaterialRipple from "../components/MyMaterialRipple";


let renderCount = 0;

const ProductDetailsScreen = ({route, navigation}: any) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${ProductDetailsScreen.name}. renderCount: `, {renderCount});
    }

    const dispatch = useDispatch();

    const user: any          = useSelector((state: any) => state.auth.user);
    const app_input: any     = useSelector((state: any) => state.app_input);
    const cart: any          = useSelector((state: any) => state.cart);
    const user_location: any = useSelector((state: any) => state.user_location);

    const [refreshing, setRefreshing] = useState(false);
    const [firstLoad, setFirstLoad]   = useState(true);
    const [product, setProduct]: any  = useState([]);

    const [imageViewerVisible, setImageViewerVisible] = useState(false);

    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${ProductDetailsScreen.name}. useEffect: `, {user, user_location, cart, app_input});

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
                    setProduct(data);
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

    const onBuyNow = () => {
        const itemId: string = '_' + product?.id;
        // MyUtil.printConsole(true, 'log', 'LOG: onBuyNow: ', {itemId, product});
        if (cart?.items[itemId]) {
            if (Number(product?.products_liked) > Number(cart?.items[itemId]?.quantity)) {
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
            if (Number(product?.products_liked) > 0) {
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
            setProduct(updatedProduct);
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

                             <View>
                                 <ScrollView
                                     horizontal = {true}
                                     pagingEnabled = {true}
                                     decelerationRate = "fast"
                                     snapToInterval = {MyStyle.screenWidth}
                                     snapToAlignment = "center"
                                 >
                                     <ImageSliderBanner
                                         item = {(Array.isArray(product?.images) && product?.images?.length > 0) ? product?.images : [{image: product?.image}]}
                                         onPress = {(prop: any) => prop?.image?.length ? setImageViewerVisible(true) : null}
                                         style = {{height: MyStyle.screenWidth / 1.5}}
                                     />
                                 </ScrollView>

                                 <Text
                                     numberOfLines = {2}
                                     style = {[MyStyleSheet.textPageTitle, {
                                         textAlign       : 'center',
                                         marginHorizontal: MyStyle.marginHorizontalPage,
                                         marginTop       : 15,
                                     }]}
                                 >
                                     {product?.products_name}
                                 </Text>

                                 <View
                                     style = {{
                                         marginHorizontal: MyStyle.marginHorizontalPage,
                                         marginTop       : 5,
                                         ...MyStyle.RowCenter
                                     }}
                                 >
                                     {product?.discount_price &&
                                      <Text numberOfLines = {1}
                                            style = {[MyStyleSheet.textPriceDiscountedPage, {marginRight: 5}]}
                                      >
                                          {MyConfig.Currency.MYR.symbol} {product?.products_price}
                                      </Text>
                                     }
                                     <Text numberOfLines = {1}
                                           style = {[MyStyleSheet.textPricePage, {}]}
                                     >
                                         {MyConfig.Currency.MYR.symbol} {product?.discount_price ? product?.discount_price : product?.products_price}
                                     </Text>
                                 </View>

                                 <View style = {{
                                     marginHorizontal: MyStyle.marginHorizontalPage,
                                     marginTop       : 10,
                                     ...MyStyle.RowCenter
                                 }}>
                                     {Array(5)
                                         .fill('')
                                         .map((rating: any, key: any) => (
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
                                              )
                                         )
                                     }
                                     <Text
                                         style = {{
                                             fontFamily: MyStyle.FontFamily.OpenSans.semiBold,
                                             fontSize  : 15,
                                             color     : MyColor.Material.GREY["800"],
                                             marginLeft: 5,
                                         }}
                                     >
                                         {product?.rating > 0 ? product?.rating : '0'}
                                     </Text>
                                 </View>

                                 <View style = {{...MyStyle.RowStartCenter}}>
                                     <Text
                                         style = {{
                                             fontFamily: MyStyle.FontFamily.Roboto.medium,
                                             fontSize  : 16,
                                             color     : MyColor.textDarkPrimary,

                                             paddingVertical  : 10,
                                             paddingHorizontal: 10,
                                             backgroundColor  : MyColor.backgroundGrey,
                                         }}
                                     >
                                         Color
                                     </Text>
                                     <View style = {{flexDirection: "row", justifyContent: "flex-start", flexWrap: "wrap"}}>

                                         <MyMaterialRipple
                                             style = {MyStyleSheet.MRButtonProductPage}
                                             {...MyStyle.MaterialRipple.drawer}
                                             onPress = {''}
                                         >
                                             <Text style = {MyStyleSheet.textButtonProductPage}>
                                                 Red
                                             </Text>
                                         </MyMaterialRipple>
                                         <MyMaterialRipple
                                             style = {MyStyleSheet.MRButtonProductPage}
                                             {...MyStyle.MaterialRipple.drawer}
                                             onPress = {''}
                                         >
                                             <Text style = {MyStyleSheet.textButtonProductPageSelected}>
                                                 Green
                                             </Text>
                                         </MyMaterialRipple>
                                         <MyMaterialRipple
                                             style = {MyStyleSheet.MRButtonProductPage}
                                             {...MyStyle.MaterialRipple.drawer}
                                             onPress = {''}
                                         >
                                             <Text style = {MyStyleSheet.textButtonProductPage}>
                                                 Yellow
                                             </Text>
                                         </MyMaterialRipple>
                                     </View>
                                 </View>

                                 <ScrollView
                                     horizontal = {true}
                                     pagingEnabled = {true}
                                     decelerationRate = "fast"
                                     snapToInterval = {MyStyle.screenWidth}
                                     snapToAlignment = "center"
                                     showsHorizontalScrollIndicator = {false}
                                     contentContainerStyle = {{
                                         marginVertical : MyStyle.marginVerticalPage,
                                         paddingVertical: MyStyle.marginVerticalPage,
                                         backgroundColor: MyColor.Material.GREY["150"]
                                     }}
                                 >
                                     <View style = {{width: MyStyle.screenWidth}}>
                                         <HTML
                                             html = {product?.products_description ? product.products_description : MyLANG.NoText}
                                             tagsStyles = {MyStyle.textHTMLBody}
                                             ignoredTags = {MyStyle.IGNORED_TAGS}
                                             containerStyle = {{marginHorizontal: MyStyle.marginHorizontalPage}}
                                         />
                                     </View>
                                     <View style = {{width: MyStyle.screenWidth}}>
                                         <HTML
                                             html = {product?.products_description ? product.products_description : MyLANG.NoText}
                                             tagsStyles = {MyStyle.textHTMLBody}
                                             ignoredTags = {MyStyle.IGNORED_TAGS}
                                             containerStyle = {{marginHorizontal: MyStyle.marginHorizontalPage}}
                                             textSelectable = {true}
                                         />
                                     </View>
                                 </ScrollView>

                             </View>
                         </ScrollView>

                         <ShadowBox
                             useSvg
                             style = {{
                                 shadowOffset : {width: 0, height: -1},
                                 shadowOpacity: 0.2,
                                 shadowColor  : "#000000",
                                 shadowRadius : 2,
                                 height       : 46,
                                 width        : MyStyle.screenWidth,
                             }}
                         >
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
                                         flex          : 1,
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
                                 <View style = {{flex: 1}}>
                                     <MyButton
                                         shape = "square"
                                         shadow = "none"
                                         title = {MyLANG.BuyNow}
                                         textStyle = {{
                                             fontFamily: MyStyle.FontFamily.Roboto.medium,
                                             fontSize  : 14,
                                         }}
                                         onPress = {onBuyNow}
                                     />
                                 </View>
                             </View>
                         </ShadowBox>

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

