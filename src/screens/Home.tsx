import React, {Fragment, useCallback, useEffect, useLayoutEffect, useState} from 'react';

import {View, SafeAreaView, ScrollView, RefreshControl, Text, BackHandler, TouchableOpacity} from 'react-native';
import {useFocusEffect} from "@react-navigation/native";

import MyUtil from '../common/MyUtil';
import {MyStyle, MyStyleSheet} from '../common/MyStyle';
import MyColor from '../common/MyColor';
import MyImage from '../shared/MyImage';
import {MyAPI, MyConfig} from '../shared/MyConfig';
import MyLANG from '../shared/MyLANG';
import {MyConstant} from '../common/MyConstant';
import MyIcon from '../components/MyIcon';

import {ListEmptyViewLottie, ListHeaderViewAll, StatusBarLight} from '../components/MyComponent';
import {
    CategoryHorizontalListItem,
    CategoryHorizontalListItemContentLoader,
    ImageSliderBanner,
    ImageSliderBannerContentLoader,
    ProductHorizontalListItem,
    ProductHorizontalListItemContentLoader,
} from "../shared/MyContainer";
import Splash from "react-native-splash-screen";
import {useDispatch, useSelector} from "react-redux";
import {categorySave} from "../store/CategoryRedux";

let renderCount = 0;

const HomeScreen = ({route, navigation}: any) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${HomeScreen.name}. renderCount: `, renderCount);
    }

    const dispatch = useDispatch();

    const user: any     = useSelector((state: any) => state.auth.user);
    const category: any = useSelector((state: any) => state.category);

    const [refreshing, setRefreshing] = useState(false);

    const [firstLoadCategory, setFirstLoadCategory] = useState(true);

    const [firstLoadBanner, setFirstLoadBanner]     = useState(true);
    const [banner, setBanner]: any                  = useState([]);
    const [firstLoadProduct, setFirstLoadProduct]   = useState(true);
    const [product, setProduct]: any                = useState([]);
    const [firstLoadProduct2, setFirstLoadProduct2] = useState(true);
    const [product2, setProduct2]: any              = useState([]);


    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                return MyUtil.onBackButtonPress(navigation);
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${HomeScreen.name}. useEffect: `, {user: user, category: category});

        if (route?.params?.splash !== false) { // If splash param is not false then hide splash:
            MyUtil.printConsole(true, 'log', `LOG: ${HomeScreen.name}. route?.params?.splash: `, route?.params?.splash);
            Splash.hide();
        }

        fetchCategory(false, false, false);
        fetchBanner(false, false, false);
        fetchProduct(false, false, false);
        fetchProduct2(false, false, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRefresh = useCallback(() => {
        MyUtil.printConsole(true, 'log', 'LOG: onRefresh: ', {});

        setRefreshing(true);

        fetchCategory(false, true, {
            'showMessage': MyConstant.SHOW_MESSAGE.TOAST,
            'message'    : MyLANG.PageRefreshed
        });
        fetchBanner(false, true, {
            'showMessage': MyConstant.SHOW_MESSAGE.TOAST,
            'message'    : MyLANG.PageRefreshed
        });
        fetchProduct(false, true, {
            'showMessage': MyConstant.SHOW_MESSAGE.TOAST,
            'message'    : MyLANG.PageRefreshed
        });
        fetchProduct2(false, true, {
            'showMessage': MyConstant.SHOW_MESSAGE.TOAST,
            'message'    : MyLANG.PageRefreshed
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Refresh All existing on Component Visibile, Show Placeholder on start and loadmore, No Data Found Design
    const fetchCategory = async (showLoader: any = MyLANG.Loading + '...', setRefresh: boolean = false, showInfoMessage: any = false) => {

        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.categories,
                    {
                        'language_id': MyConfig.LanguageActive,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Short, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.categories, 'response': response
        });

        if (response && response.type === MyConstant.RESPONSE.TYPE.data && response.data.status === 200 && response.data.data && response.data.data.data) {

            const data = response.data.data.data;
            if (data?.length > 0) {
                dispatch(categorySave(data, MyConstant.DataSetType.fresh));
            }
        } else {
            MyUtil.showMessage(showInfoMessage.showMessage, response.errorMessage ? response.errorMessage : MyLANG.UnknownError, false);
        }

        setFirstLoadCategory(false);
        if (setRefresh === true) {
            setRefreshing(false);
        }

        if (showInfoMessage !== false) {
            MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message, false);
        }
    }
    const fetchBanner   = async (showLoader: any = MyLANG.Loading + '...', setRefresh: boolean = false, showInfoMessage: any = false) => {

        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.banner,
                    {
                        'language_id': MyConfig.LanguageActive,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Short, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.banner, 'response': response
        });

        if (response && response.type === MyConstant.RESPONSE.TYPE.data && response.data.status === 200 && response.data.data && response.data.data.data) {

            const data = response.data.data.data;
            if (data?.length > 0) {
                setBanner(data);
            }
        } else {
            MyUtil.showMessage(showInfoMessage.showMessage, response.errorMessage ? response.errorMessage : MyLANG.UnknownError, false);
        }

        setFirstLoadBanner(false);
        if (setRefresh === true) {
            setRefreshing(false);
        }

        if (showInfoMessage !== false) {
            MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message, false);
        }
    }
    const fetchProduct  = async (showLoader: any = MyLANG.Loading + '...', setRefresh: boolean = false, showInfoMessage: any = false) => {

        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.product_by_category,
                    {
                        'language_id'  : MyConfig.LanguageActive,
                        'categories_id': 32,
                        'skip'         : 0,
                        'take'         : MyConfig.ListLimit.productListHorizontal,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Short, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.product_by_category, 'response': response
        });

        if (response && response.type === MyConstant.RESPONSE.TYPE.data && response.data.status === 200 && response.data.data && response.data.data.data) {

            const data = response.data.data.data;
            if (data?.product?.length > 0) {
                setProduct(data);
            }
        } else {
            MyUtil.showMessage(showInfoMessage.showMessage, response.errorMessage ? response.errorMessage : MyLANG.UnknownError, false);
        }

        setFirstLoadProduct(false);
        if (setRefresh === true) {
            setRefreshing(false);
        }

        if (showInfoMessage !== false) {
            MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message, false);
        }
    }
    const fetchProduct2 = async (showLoader: any = MyLANG.Loading + '...', setRefresh: boolean = false, showInfoMessage: any = false) => {

        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.product_by_category,
                    {
                        'language_id'  : MyConfig.LanguageActive,
                        'categories_id': 30,
                        'skip'         : 0,
                        'take'         : MyConfig.ListLimit.productListHorizontal2,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Short, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.product_by_category, 'response': response
        });

        if (response && response.type === MyConstant.RESPONSE.TYPE.data && response.data.status === 200 && response.data.data && response.data.data.data) {

            const data = response.data.data.data;
            if (data?.product?.length > 0) {
                setProduct2(data);
            }
        } else {
            MyUtil.showMessage(showInfoMessage.showMessage, response.errorMessage ? response.errorMessage : MyLANG.UnknownError, false);
        }

        setFirstLoadProduct2(false);
        if (setRefresh === true) {
            setRefreshing(false);
        }

        if (showInfoMessage !== false) {
            MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message, false);
        }
    }

    return (
        <Fragment>
            <StatusBarLight/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView1}/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <View style = {[MyStyleSheet.SafeAreaView3, {backgroundColor: MyColor.Material.WHITE}]}>

                    {!firstLoadCategory && !firstLoadBanner && !firstLoadProduct && !firstLoadProduct2 && category?.length === 0 && banner?.length === 0 && !product?.product && !product2?.product ?
                     <ListEmptyViewLottie
                         source = {MyImage.lottie_empty_lost}
                         message = {MyLANG.NoHomeItemsFound}
                         style = {{view: {}, image: {}, text: {}}}
                     />
                                                                                                                                                                                                    :

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

                         <ScrollView
                             style = {{
                                 marginTop   : MyStyle.marginVerticalList + MyStyle.marginVerticalList,
                                 marginBottom: MyStyle.marginVerticalList,
                                 flexGrow    : 0
                             }}
                             horizontal
                             showsHorizontalScrollIndicator = {false}
                         >
                             {
                                 category?.length > 0 ?
                                 <CategoryHorizontalListItem item = {category}/>
                                                      :
                                 CategoryHorizontalListItemContentLoader(7)
                             }

                         </ScrollView>

                         <ScrollView
                             horizontal = {true}
                             pagingEnabled = {true}
                             decelerationRate = "fast"
                             showsHorizontalScrollIndicator = {false}
                             style = {{marginVertical: MyStyle.marginVerticalList}}
                         >
                             {firstLoadBanner && banner?.length === 0 && <ImageSliderBannerContentLoader/>}
                             <ImageSliderBanner item = {banner}  style = {{}}/>
                         </ScrollView>

                         <ListHeaderViewAll
                             textLeft = {MyLANG.FeaturedProducts}
                             textRight = {MyLANG.ViewAll}
                             onPress = {() =>
                                 MyUtil.commonAction(false,
                                                     navigation,
                                                     MyConstant.CommonAction.navigate,
                                                     MyConfig.routeName.ProductList,
                                                     {'id': product?.categories_id, 'item': product},
                                                     null
                                 )
                             }
                         />
                         <ScrollView
                             horizontal
                             showsHorizontalScrollIndicator = {false}
                             style = {{flexGrow: 0, marginVertical: MyStyle.marginVerticalList}}
                         >
                             {
                                 product?.product?.length > 0 ? <ProductHorizontalListItem item = {product.product}/>
                                                              :
                                 firstLoadProduct ? ProductHorizontalListItemContentLoader(5)
                                                  : null
                             }
                         </ScrollView>

                         <ListHeaderViewAll
                             textLeft = {MyLANG.NewArrivals}
                             textRight = {MyLANG.ViewAll}
                             onPress = {() =>
                                 MyUtil.commonAction(false,
                                                     navigation,
                                                     MyConstant.CommonAction.navigate,
                                                     MyConfig.routeName.ProductList,
                                                     {'id': product2?.categories_id, 'item': product2},
                                                     null
                                 )
                             }
                         />
                         <ScrollView
                             horizontal
                             showsHorizontalScrollIndicator = {false}
                             style = {{flexGrow: 0, marginVertical: MyStyle.marginVerticalList}}
                         >
                             {
                                 product2?.product?.length > 0 ? <ProductHorizontalListItem item = {product2.product}/>
                                                               :
                                 firstLoadProduct2 ? ProductHorizontalListItemContentLoader(5)
                                                   : null
                             }
                         </ScrollView>

                     </ScrollView>
                    }

                </View>
            </SafeAreaView>
        </Fragment>
    )
}


HomeScreen.navigationOptions = {}

export default HomeScreen;

