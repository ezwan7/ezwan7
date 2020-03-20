import React, {Fragment, useCallback, useEffect, useState} from 'react';

import {
    StyleSheet,
    View,
    SafeAreaView,
    ScrollView,
    FlatList,
    RefreshControl,
} from 'react-native';

import {
    ActivityIndicatorLarge,
    ListEmptyView,
    StatusBarDark,
    StatusBarLight
} from '../components/MyComponent';

import MyUtil from '../common/MyUtil';
import {MyStyle, MyStyleSheet} from '../common/MyStyle';
import MyColor from '../common/MyColor';
import MyImage from '../shared/MyImage';
import {MyAPI, MyConfig} from '../shared/MyConfig';
import MyLANG from '../shared/MyLANG';
import {MyConstant} from '../common/MyConstant';
import MyIcon from '../components/MyIcon';
import {ContentLoaderRestaurantItem, ListItemSeparator, RestaurantListItem} from "../shared/MyContainer";

let renderCount = 0;

const TabRestaurantScreen = ({}) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${TabRestaurantScreen.name}. renderCount: `, renderCount);
    }

    const [firstLoad, setFirstLoad]                                               = useState(true);
    const [loading, setLoading]                                                   = useState(true);
    const [loadingMore, setLoadingMore]                                           = useState(false);
    const [refreshing, setRefreshing]                                             = useState(false);
    const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(true);
    const [restaurant, setRestaurant]                                             = useState([]);

    // const useMountEffect = (fun: React.EffectCallback) => React.useEffect(fun, []);
    // const useMountEffect = (fun: any) => React.useEffect(fun, []);

    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${TabRestaurantScreen.name}. useEffect: `, '');

        fetchRestaurant(restaurant && restaurant.length > 0 ? restaurant.length : 0,
                        MyConfig.ListLimit.RestaurantHome,
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

        fetchRestaurant(0, MyConfig.ListLimit.RestaurantHome, false, true, {
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

            fetchRestaurant(restaurant && restaurant.length > 0 ? restaurant.length : 0,
                            MyConfig.ListLimit.RestaurantHome,
                            false,
                            true,
                            false,
                            MyConstant.DataSetType.addToEndnCheck
            );
        }
    }

    const ListEmptyComponent = () => {
        MyUtil.printConsole(true, 'log', 'LOG: ListEmptyComponent: ', {
            'restaurant.length': restaurant.length,
            'firstLoad'        : firstLoad,
        });

        if (firstLoad || (restaurant && restaurant.length > 0)) return null;

        return <ListEmptyView source = {MyImage.defaultAvatar}
                              defaultSource = {MyImage.defaultSource}
                              message = {MyLANG.NoRestaurantFound}/>;
    }

    const ListFooter = () => {
        MyUtil.printConsole(true, 'log', 'LOG: ListFooter: ', {'loadingMore': loadingMore});

        if (!loadingMore) return null;

        return <ActivityIndicatorLarge/>;
    }

    // Refresh All existing on Component Visibile, Show Placeholder on start and loadmore, No Data Found Design
    const fetchRestaurant = async (offset: number = 0, limit: number = MyConfig.ListLimit.RestaurantHome, showLoader: any = MyLANG.Loading + '...', setRefresh: boolean = false, showInfoMessage: any = false, DataSetType: string = MyConstant.DataSetType.fresh) => {

        setLoading(true);

        const response: any = await MyUtil
            .myHTTP(true, MyConstant.HTTP_POST, MyAPI.RESTAURANTS,
                    {
                        'category_id'       : MyConfig.RestaurantCategory.Restaurant,
                        'type_id'           : null,
                        'offset'            : offset,
                        'limit'             : limit,
                        'order_by_column'   : 'id',
                        'order_by_direction': 'asc',
                        'latitude'          : 24.8481, // TODO
                        'longitude'         : 89.3730,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Short, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.RESTAURANTS, 'response': response
        });

        if (response && response.type === MyConstant.RESPONSE.TYPE.data && response.data.status === 200 && response.data.data && response.data.data.data) {

            if (response.data.data.data.length > 0) {
                switch (DataSetType) {
                    case MyConstant.DataSetType.addToEnd:
                        setRestaurant(restaurant.concat(response.data.data.data));
                        break;
                    case MyConstant.DataSetType.addToStart:
                        setRestaurant(response.data.data.data.concat(restaurant));
                        break;
                    case MyConstant.DataSetType.addToEndnCheck:
                        // const newRestaurant = restaurant.concat(response.data.data.data.filter(({id}: any) => !restaurant.find((f: any) => f.id == id)));
                        const newRestaurant1: any = restaurant;
                        for (let i = 0; i < response.data.data.data.length; i++) {
                            if (restaurant.some((item: any) => item.id === response.data.data.data[i]['id']) === false) {
                                newRestaurant1.push(response.data.data.data[i]);
                            }
                        }
                        setRestaurant(newRestaurant1);
                        break;
                    case MyConstant.DataSetType.addToStartnCheck:
                        const newRestaurant2: any = restaurant;
                        for (let i = 0; i < response.data.data.data.length; i++) {
                            if (restaurant.some((item: any) => item.id === response.data.data.data[i]['id']) === false) {
                                newRestaurant2.unshift(response.data.data.data[i]);
                            }
                        }
                        setRestaurant(newRestaurant2);
                        break;
                    case MyConstant.DataSetType.fresh:
                    default:
                        setRestaurant(response.data.data.data);
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
                <View style = {MyStyleSheet.SafeAreaView3}>

                    {firstLoad && restaurant && restaurant.length === 0 &&
                     <ScrollView contentInsetAdjustmentBehavior = "automatic"
                                 style = {{flexGrow: 1}}>
                         {ContentLoaderRestaurantItem(MyConfig.ListLimit.RestaurantHome)}
                     </ScrollView>
                    }

                    <FlatList
                        contentContainerStyle = {{flexGrow: 1}}
                        refreshControl = {
                            <RefreshControl refreshing = {refreshing}
                                            onRefresh = {onRefresh}/>
                        }
                        data = {restaurant}
                        renderItem = {({item}) => <RestaurantListItem item = {item}/>}
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


TabRestaurantScreen.navigationOptions = {}

export default TabRestaurantScreen

const styles = StyleSheet.create({
                                     //
                                 })

