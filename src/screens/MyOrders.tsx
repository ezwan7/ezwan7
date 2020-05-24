import React, {useState, useEffect, Fragment, useCallback} from 'react';
import {ActivityIndicatorLarge, ListEmptyViewLottie, StatusBarLight} from '../components/MyComponent';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from "react-redux";

import {StyleSheet, View, Text, SafeAreaView, ScrollView, Image, FlatList, RefreshControl} from 'react-native';

import MyUtil from '../common/MyUtil';
import {MyStyle, MyStyleSheet} from '../common/MyStyle';
import MyColor from '../common/MyColor';
import MyImage from '../shared/MyImage';
import {MyAPI, MyConfig} from '../shared/MyConfig';
import MyLANG from '../shared/MyLANG';
import {MyConstant} from "../common/MyConstant";
import MyAuth from "../common/MyAuth";
import {ListItemSeparator, OrderListItem, OrderListItemContentLoader} from "../shared/MyContainer";

import {orderSave} from "../store/OrderRedux";


let renderCount = 0;

const MyOrdersScreen = ({}) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${MyOrdersScreen.name}. renderCount: `, {renderCount});
    }

    const dispatch = useDispatch();

    const user: any   = useSelector((state: any) => state.auth.user);
    const orders: any = useSelector((state: any) => state.orders);

    const [firstLoad, setFirstLoad]                                               = useState(true);
    const [loading, setLoading]                                                   = useState(true);
    const [refreshing, setRefreshing]                                             = useState(false);
    const [loadingMore, setLoadingMore]                                           = useState(false);
    const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(false);

    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${MyOrdersScreen.name}. useEffect: `, {user, orders});

        fetchData(0,
                  MyConfig.ListLimit.orderList,
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

        fetchData(0,
                  MyConfig.ListLimit.orderList,
                  false,
                  true,
                  {
                      'showMessage': MyConstant.SHOW_MESSAGE.TOAST,
                      'message'    : MyLANG.PageRefreshed
                  },
                  MyConstant.DataSetType.fresh
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onEndReached = () => {
        MyUtil.printConsole(true, 'log', 'LOG: onEndReached: ', {
            'loadingMore'                     : loadingMore,
            'onEndReachedCalledDuringMomentum': onEndReachedCalledDuringMomentum
        });

        if (!loadingMore && !onEndReachedCalledDuringMomentum) {

            setLoadingMore(true);

            fetchData(orders?.length > 0 ? orders.length : 0,
                      MyConfig.ListLimit.orderList,
                      false,
                      true,
                      false,
                      MyConstant.DataSetType.addToEndUnique
            );
        }
    }

    const ListEmptyComponent = () => {
        MyUtil.printConsole(true, 'log', 'LOG: ListEmptyComponent: ', {
            'orders.length': orders.length,
            'firstLoad'    : firstLoad,
        });

        if (firstLoad || (orders?.length > 0)) return null;

        return <ListEmptyViewLottie
            source = {MyImage.lottie_empty_lost}
            message = {MyLANG.NoOrderFound}
            style = {{view: {}, image: {}, text: {}}}
        />;
    }

    const ListFooterComponent = () => {
        MyUtil.printConsole(true, 'log', 'LOG: ListFooterComponent: ', {'loadingMore': loadingMore});

        if (!loadingMore) return null;

        return <ActivityIndicatorLarge/>;
    }

    const fetchData = async (skip: number = 0, take: number = MyConfig.ListLimit.orderList, showLoader: any = MyLANG.Loading + '...', setRefresh: boolean = false, showInfoMessage: any = false, DataSetType: string = MyConstant.DataSetType.fresh) => {

        setLoading(true);

        const response: any = await MyUtil
            .myHTTP({required: true, promptLogin: true}, MyConstant.HTTP_POST, MyAPI.orders,
                    {
                        'language_id': MyConfig.LanguageActive,

                        'customers_id': user?.id,
                        'skip'        : skip,
                        'take'        : take,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.orders, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data?.data?.data) {

            const data = response.data.data.data;
            dispatch(orderSave(data, DataSetType));

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
            MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message, false);
        }
    }


    return (
        <Fragment>
            <StatusBarLight/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView1}/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <View style = {[MyStyleSheet.SafeAreaView3, {backgroundColor: MyColor.backgroundGrey}]}>

                    {firstLoad && orders?.length === 0 ?
                     <ScrollView
                         contentInsetAdjustmentBehavior = "automatic"
                         contentContainerStyle = {{paddingTop: MyStyle.headerHeightAdjusted}}
                     >
                         {OrderListItemContentLoader(4)}
                     </ScrollView>
                                                       :
                     <FlatList
                         contentContainerStyle = {{paddingTop: MyStyle.headerHeightAdjusted, flexGrow: 1}}
                         refreshControl = {
                             <RefreshControl
                                 refreshing = {refreshing}
                                 onRefresh = {onRefresh}
                                 progressViewOffset = {MyStyle.headerHeightAdjusted}
                                 colors = {[MyColor.Primary.first]}
                             />
                         }
                         data = {orders}
                         renderItem = {({item, index}: any) =>
                             <OrderListItem
                                 item = {item}
                                 index = {index}
                             />
                         }
                         keyExtractor = {(item: any) => String(item?.id)}
                         // ItemSeparatorComponent = {ListItemSeparator}
                         ListEmptyComponent = {ListEmptyComponent}
                         ListFooterComponent = {ListFooterComponent}
                         onEndReachedThreshold = {0.2}
                         onEndReached = {onEndReached}
                         onMomentumScrollBegin = {() => {
                             setOnEndReachedCalledDuringMomentum(false);
                         }}
                     />
                    }

                </View>
            </SafeAreaView>
        </Fragment>
    )
}

MyOrdersScreen.navigationOptions = {}

export default MyOrdersScreen


