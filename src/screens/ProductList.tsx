import React, {Fragment, useCallback, useEffect, useLayoutEffect, useState} from 'react';

import {
    View,
    SafeAreaView,
    ScrollView,
    FlatList,
    RefreshControl,
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
    ContentLoaderProductListItem,
    ListItemSeparator,
    ProductListItem,
} from "../shared/MyContainer";

let renderCount = 0;

const ProductListScreen = ({route, navigation}: any) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${ProductListScreen.name}. renderCount: `, renderCount);
    }
    const [firstLoad, setFirstLoad]                                               = useState(true);
    const [loading, setLoading]                                                   = useState(true);
    const [loadingMore, setLoadingMore]                                           = useState(false);
    const [refreshing, setRefreshing]                                             = useState(false);
    const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(true);
    const [product, setProduct]                                                   = useState([]);

    useLayoutEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${ProductListScreen.name}. useLayoutEffect: `, '');

        if (route?.params?.item?.categories_name) {
            navigation.setOptions(
                {
                    title: route?.params?.item?.categories_name,
                });
        }
    }, [navigation, route]);

    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${ProductListScreen.name}. useEffect: `, '');

        fetchProduct(product && product.length > 0 ? product.length : 0,
                     MyConfig.ListLimit.productList,
                     false,
                     false,
                     false,
                     MyConstant.DataSetType.fresh
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRefresh = useCallback(() => {
        MyUtil.printConsole(true, 'log', 'LOG: onRefresh: ', {});

        setRefreshing(true);

        fetchProduct(0, MyConfig.ListLimit.productList, MyLANG.Loading + '...', true, {
            'showError': MyConstant.SHOW_MESSAGE.TOAST,
            'message'  : MyLANG.PageRefreshed
        }, MyConstant.DataSetType.fresh);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onEndReached = () => {
        MyUtil.printConsole(true, 'log', 'LOG: onEndReached: ', {
            'loadingMore'                     : loadingMore,
            'onEndReachedCalledDuringMomentum': onEndReachedCalledDuringMomentum
        });

        if (!loadingMore && !onEndReachedCalledDuringMomentum) {

            setLoadingMore(true);

            fetchProduct(product && product.length > 0 ? product.length : 0,
                         MyConfig.ListLimit.productList,
                         false,
                         true,
                         false,
                         MyConstant.DataSetType.addToEndnCheck
            );
        }
    }

    const ListEmptyComponent = () => {
        MyUtil.printConsole(true, 'log', 'LOG: ListEmptyComponent: ', {
            'product.length': product.length,
            'firstLoad'     : firstLoad,
        });

        if (firstLoad || (product && product.length > 0)) return null;

        return <ListEmptyViewLottie source = {MyImage.emptyLostLottie}
                                    message = {MyLANG.NoProductFound}
                                    style = {{view: {}, image: {}, text: {}}}/>;
    }

    const ListFooter = () => {
        MyUtil.printConsole(true, 'log', 'LOG: ListFooter: ', {'loadingMore': loadingMore});

        if (!loadingMore) return null;

        return <ActivityIndicatorLarge/>;
    }

    // Refresh All existing on Component Visibile, Show Placeholder on start and loadmore, No Data Found Design
    const fetchProduct = async (offset: number = 0, limit: number = MyConfig.ListLimit.productList, showLoader: any = MyLANG.Loading + '...', setRefresh: boolean = false, showInfoMessage: any = false, DataSetType: string = MyConstant.DataSetType.fresh) => {

        setLoading(true);

        const response: any = await MyUtil
            .myHTTP(true, MyConstant.HTTP_POST, MyAPI.product_by_category,
                    {
                        'language_id'  : MyConfig.LanguageActive,
                        'categories_id': route?.params?.id,
                        'skip'         : offset,
                        'take'         : limit,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Short, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.categories, 'response': response
        });

        if (response && response.type === MyConstant.RESPONSE.TYPE.data && response.data.status === 200 && response.data.data && response.data.data.data && response.data.data.data.product) {

            const data = response.data.data.data.product;
            if (data.length > 0) {
                switch (DataSetType) {
                    case MyConstant.DataSetType.addToEnd:
                        setProduct(product.concat(data));
                        break;
                    case MyConstant.DataSetType.addToStart:
                        setProduct(data.concat(product));
                        break;
                    case MyConstant.DataSetType.addToEndnCheck:
                        // const newData = product.concat(data.filter(({id}: any) => !product.find((f: any) => f.id == id)));
                        const newData1: any = product;
                        for (let i = 0; i < data.length; i++) {
                            if (product.some((item: any) => item.id === data[i]['id']) === false) {
                                newData1.push(data[i]);
                            }
                        }
                        setProduct(newData1);
                        break;
                    case MyConstant.DataSetType.addToStartnCheck:
                        const newData2: any = product;
                        for (let i = 0; i < data.length; i++) {
                            if (product.some((item: any) => item.id === data[i]['id']) === false) {
                                newData2.unshift(data[i]);
                            }
                        }
                        setProduct(newData2);
                        break;
                    case MyConstant.DataSetType.fresh:
                    default:
                        setProduct(data);
                        break;
                }
            }
        } else {
            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT, response.errorMessage ? response.errorMessage : MyLANG.UnknownError, false);
        }

        setFirstLoad(false);
        setLoading(false);
        setLoadingMore(false);
        setOnEndReachedCalledDuringMomentum(true);
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
                <View style = {[MyStyleSheet.SafeAreaView3, {}]}>
                    {/*<StatusBarGradientPrimary/>*/}
                    {firstLoad && product && product.length === 0 &&
                     <ScrollView contentInsetAdjustmentBehavior = "automatic"
                                 style = {{flexGrow: 1}}>
                         {ContentLoaderProductListItem(8)}
                     </ScrollView>
                    }

                    <FlatList
                        contentContainerStyle = {{flexGrow: 1}}
                        refreshControl = {
                            <RefreshControl refreshing = {refreshing}
                                            onRefresh = {onRefresh}/>
                        }
                        data = {product}
                        renderItem = {({item, index}) =>
                            <ProductListItem item = {item}
                                             index = {index}/>
                        }
                        keyExtractor = {item => String(item['id'])}
                        ListEmptyComponent = {ListEmptyComponent}
                        ItemSeparatorComponent = {ListItemSeparator}
                        ListFooterComponent = {ListFooter}
                        onEndReachedThreshold = {0.2}
                        onEndReached = {onEndReached}
                        onMomentumScrollBegin = {() => {
                            setOnEndReachedCalledDuringMomentum(false);
                        }}
                    />
                </View>
            </SafeAreaView>
        </Fragment>
    )
}


ProductListScreen.navigationOptions = {}

export default ProductListScreen;

