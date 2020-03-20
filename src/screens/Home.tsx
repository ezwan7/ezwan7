import React, {Fragment, useCallback, useEffect, useLayoutEffect, useState} from 'react';

import {
    View,
    SafeAreaView,
    ScrollView,
    RefreshControl, Text, ImageBackground,
} from 'react-native';

import MyUtil from '../common/MyUtil';
import {MyStyle, MyStyleSheet} from '../common/MyStyle';
import MyColor from '../common/MyColor';
import MyImage from '../shared/MyImage';
import {MyAPI, MyConfig} from '../shared/MyConfig';
import MyLANG from '../shared/MyLANG';
import {MyConstant} from '../common/MyConstant';
import MyIcon from '../components/MyIcon';

import {
    ActivityIndicatorLarge,
    ListEmptyView, ListEmptyViewLottie,
    StatusBarDark,
    StatusBarLight
} from '../components/MyComponent';
import {
    BannerHorizontalListItem,
    CategoryHorizontalListItem, ContentLoaderBannerHorizontalList, ContentLoaderCategoryHorizontalListItem, ContentLoaderProductHorizontalListItem,
    ContentLoaderProductListItem,
    ListItemSeparator, ProductHorizontalListItem,
    ProductListItem,
} from "../shared/MyContainer";
import FastImage from "react-native-fast-image";

let renderCount = 0;

const HomeScreen = ({}) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${HomeScreen.name}. renderCount: `, renderCount);
    }

    const [refreshing, setRefreshing] = useState(false);

    const [firstLoadCategory, setFirstLoadCategory] = useState(true);
    const [category, setCategory]                   = useState([]);
    const [firstLoadBanner, setFirstLoadBanner]     = useState(true);
    const [banner, setBanner]                       = useState([]);
    const [firstLoadProduct, setFirstLoadProduct]   = useState(true);
    const [product, setProduct]                     = useState([]);
    const [firstLoadProduct2, setFirstLoadProduct2] = useState(true);
    const [product2, setProduct2]                   = useState([]);

    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${HomeScreen.name}. useEffect: `, '');

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
            'showError': MyConstant.SHOW_MESSAGE.TOAST,
            'message'  : MyLANG.PageRefreshed
        });
        fetchBanner(false, true, {
            'showError': MyConstant.SHOW_MESSAGE.TOAST,
            'message'  : MyLANG.PageRefreshed
        });
        fetchProduct(false, true, {
            'showError': MyConstant.SHOW_MESSAGE.TOAST,
            'message'  : MyLANG.PageRefreshed
        });
        fetchProduct2(false, true, {
            'showError': MyConstant.SHOW_MESSAGE.TOAST,
            'message'  : MyLANG.PageRefreshed
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // TODO
    const ListEmptyComponent = () => {
        MyUtil.printConsole(true, 'log', 'LOG: ListEmptyComponent: ', {
            'product.length': category.length,
            'firstLoad'     : firstLoadCategory,
        });

        if (firstLoadCategory || (category && category.length > 0)) return null;

        return <ListEmptyViewLottie source = {MyImage.emptyLostLottie}
                                    message = {MyLANG.NoProductFound}
                                    style = {{view: {}, image: {}, text: {}}}
        />;
    }

    // Refresh All existing on Component Visibile, Show Placeholder on start and loadmore, No Data Found Design
    const fetchCategory = async (showLoader: any = MyLANG.Loading + '...', setRefresh: boolean = false, showInfoMessage: any = false) => {

        const response: any = await MyUtil
            .myHTTP(true, MyConstant.HTTP_POST, MyAPI.categories,
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
            if (data.length > 0) {
                setCategory(data);
            }
        } else {
            MyUtil.showMessage(showInfoMessage.showError, response.errorMessage ? response.errorMessage : MyLANG.UnknownError, false);
        }

        setFirstLoadCategory(false);
        if (setRefresh === true) {
            setRefreshing(false);
        }

        if (showInfoMessage !== false) {
            MyUtil.showMessage(showInfoMessage.showError, showInfoMessage.message, false);
        }
    }
    const fetchBanner   = async (showLoader: any = MyLANG.Loading + '...', setRefresh: boolean = false, showInfoMessage: any = false) => {

        const response: any = await MyUtil
            .myHTTP(true, MyConstant.HTTP_POST, MyAPI.banner,
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
            if (data.length > 0) {
                setBanner(data);
            }
        } else {
            MyUtil.showMessage(showInfoMessage.showError, response.errorMessage ? response.errorMessage : MyLANG.UnknownError, false);
        }

        setFirstLoadBanner(false);
        if (setRefresh === true) {
            setRefreshing(false);
        }

        if (showInfoMessage !== false) {
            MyUtil.showMessage(showInfoMessage.showError, showInfoMessage.message, false);
        }
    }
    const fetchProduct  = async (showLoader: any = MyLANG.Loading + '...', setRefresh: boolean = false, showInfoMessage: any = false) => {

        const response: any = await MyUtil
            .myHTTP(true, MyConstant.HTTP_POST, MyAPI.product_by_category,
                    {
                        'language_id'  : MyConfig.LanguageActive,
                        'categories_id': 1,
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

            const data = response.data.data.data.product;
            if (data.length > 0) {
                setProduct(data);
            }
        } else {
            MyUtil.showMessage(showInfoMessage.showError, response.errorMessage ? response.errorMessage : MyLANG.UnknownError, false);
        }

        setFirstLoadProduct(false);
        if (setRefresh === true) {
            setRefreshing(false);
        }

        if (showInfoMessage !== false) {
            MyUtil.showMessage(showInfoMessage.showError, showInfoMessage.message, false);
        }
    }
    const fetchProduct2 = async (showLoader: any = MyLANG.Loading + '...', setRefresh: boolean = false, showInfoMessage: any = false) => {

        const response: any = await MyUtil
            .myHTTP(true, MyConstant.HTTP_POST, MyAPI.product_by_category,
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

            const data = response.data.data.data.product;
            if (data.length > 0) {
                setProduct2(data);
            }
        } else {
            MyUtil.showMessage(showInfoMessage.showError, response.errorMessage ? response.errorMessage : MyLANG.UnknownError, false);
        }

        setFirstLoadProduct2(false);
        if (setRefresh === true) {
            setRefreshing(false);
        }

        if (showInfoMessage !== false) {
            MyUtil.showMessage(showInfoMessage.showError, showInfoMessage.message, false);
        }
    }

    return (
        <Fragment>
            <StatusBarLight/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView1}/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <View style = {[MyStyleSheet.SafeAreaView3, {marginTop: MyStyle.HeaderHeight}]}>

                    {!firstLoadCategory && !firstLoadBanner && !firstLoadProduct && !firstLoadProduct2 && category && category.length === 0 && banner && banner.length === 0 && product && product.length === 0 && product2 && product2.length === 0 ?
                     <ListEmptyViewLottie source = {MyImage.emptyLostLottie}
                                          message = {MyLANG.NoHomeItemsFound}
                                          style = {{view: {}, image: {}, text: {}}}
                     /> :
                     <ScrollView contentInsetAdjustmentBehavior = "automatic"
                                 refreshControl = {
                                     <RefreshControl refreshing = {refreshing}
                                                     onRefresh = {onRefresh}/>
                                 }
                                 style = {{paddingTop: 12}}
                     >

                         <ScrollView horizontal
                                     showsHorizontalScrollIndicator = {false}
                                     style = {{flexGrow: 0, marginVertical: 15}}>
                             {firstLoadCategory && category && category.length === 0 && ContentLoaderCategoryHorizontalListItem(7)}
                             <CategoryHorizontalListItem item = {category}/>
                         </ScrollView>

                         <ScrollView horizontal
                                     showsHorizontalScrollIndicator = {false}
                                     decelerationRate = {0}
                                     snapToInterval = {MyStyle.screenWidth}
                                     snapToAlignment = "center"
                                     style = {{flexGrow: 0, marginVertical: 15}}>
                             {firstLoadBanner && banner && banner.length === 0 && <ContentLoaderBannerHorizontalList/>}
                             <BannerHorizontalListItem item = {banner}/>
                         </ScrollView>

                         <View style = {{marginHorizontal: 12, marginTop: 15}}>
                             <Text style = {{
                                 fontFamily: MyStyle.FontFamily.OpenSans.regular,
                                 fontSize  : 16,
                                 color     : MyColor.Material.BLACK,
                             }}>
                                 {MyLANG.FeaturedProducts}
                             </Text>
                         </View>
                         <ScrollView horizontal
                                     showsHorizontalScrollIndicator = {false}
                                     style = {{flexGrow: 0, marginVertical: 15}}>
                             {firstLoadProduct && product && product.length === 0 && ContentLoaderProductHorizontalListItem(5)}
                             <ProductHorizontalListItem item = {product}/>
                         </ScrollView>

                         <View style = {{marginHorizontal: 12, marginTop: 15}}>
                             <Text style = {{
                                 fontFamily: MyStyle.FontFamily.OpenSans.regular,
                                 fontSize  : 16,
                                 color     : MyColor.Material.BLACK,
                             }}>
                                 {MyLANG.NewArrivals}
                             </Text>
                         </View>
                         <ScrollView horizontal
                                     showsHorizontalScrollIndicator = {false}
                                     style = {{flexGrow: 0, marginVertical: 15}}>
                             {firstLoadProduct2 && product2 && product2.length === 0 && ContentLoaderProductHorizontalListItem(5)}
                             <ProductHorizontalListItem item = {product2}/>
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

