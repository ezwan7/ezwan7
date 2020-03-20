import React, {Fragment, useCallback, useEffect, useState} from 'react';

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
    ContentLoaderCategoryListItem,
    ListItemSeparator,
    CategoryListItem,
} from "../shared/MyContainer";


let renderCount = 0;

const SettingsScreen = ({}) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${SettingsScreen.name}. renderCount: `, renderCount);
    }

    const [firstLoad, setFirstLoad]                                               = useState(true);
    const [loading, setLoading]                                                   = useState(true);
    const [loadingMore, setLoadingMore]                                           = useState(false);
    const [refreshing, setRefreshing]                                             = useState(false);
    const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(true);
    const [category, setCategory]                                                 = useState([]);

    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${SettingsScreen.name}. useEffect: `, '');

        fetchCategory(category && category.length > 0 ? category.length : 0,
                      MyConfig.ListLimit.categoryList,
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

        fetchCategory(0, MyConfig.ListLimit.categoryList, MyLANG.Loading + '...', true, {
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

            fetchCategory(category && category.length > 0 ? category.length : 0,
                          MyConfig.ListLimit.categoryList,
                          false,
                          true,
                          false,
                          MyConstant.DataSetType.addToEndnCheck
            );
        }
    }

    const ListEmptyComponent = () => {
        MyUtil.printConsole(true, 'log', 'LOG: ListEmptyComponent: ', {
            'category.length': category.length,
            'firstLoad'      : firstLoad,
        });

        if (firstLoad || (category && category.length > 0)) return null;

        return <ListEmptyViewLottie source = {MyImage.busLottie}
                                    message = {MyLANG.ComingSoon}
                                    style = {{view: {}, image: {width: MyStyle.screenWidth}, text: {}}}/>;
    }

    const ListFooter = () => {
        MyUtil.printConsole(true, 'log', 'LOG: ListFooter: ', {'loadingMore': loadingMore});

        if (!loadingMore) return null;

        return <ActivityIndicatorLarge/>;
    }

    // Refresh All existing on Component Visibile, Show Placeholder on start and loadmore, No Data Found Design
    const fetchCategory = async (offset: number = 0, limit: number = MyConfig.ListLimit.categoryList, showLoader: any = MyLANG.Loading + '...', setRefresh: boolean = false, showInfoMessage: any = false, DataSetType: string = MyConstant.DataSetType.fresh) => {

        setLoading(true);

        const response: any = await MyUtil
            .myHTTP(true, MyConstant.HTTP_POST, MyAPI.categories + '1',
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

            if (response.data.data.data.length > 0) {
                switch (DataSetType) {
                    case MyConstant.DataSetType.addToEnd:
                        setCategory(category.concat(response.data.data.data));
                        break;
                    case MyConstant.DataSetType.addToStart:
                        setCategory(response.data.data.data.concat(category));
                        break;
                    case MyConstant.DataSetType.addToEndnCheck:
                        // const newData = category.concat(response.data.data.data.filter(({id}: any) => !category.find((f: any) => f.id == id)));
                        const newData1: any = category;
                        for (let i = 0; i < response.data.data.data.length; i++) {
                            if (category.some((item: any) => item.id === response.data.data.data[i]['id']) === false) {
                                newData1.push(response.data.data.data[i]);
                            }
                        }
                        setCategory(newData1);
                        break;
                    case MyConstant.DataSetType.addToStartnCheck:
                        const newData2: any = category;
                        for (let i = 0; i < response.data.data.data.length; i++) {
                            if (category.some((item: any) => item.id === response.data.data.data[i]['id']) === false) {
                                newData2.unshift(response.data.data.data[i]);
                            }
                        }
                        setCategory(newData2);
                        break;
                    case MyConstant.DataSetType.fresh:
                    default:
                        setCategory(response.data.data.data);
                        break;
                }
            }
        } else {
            // MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT, response.errorMessage ? response.errorMessage : MyLANG.UnknownError, false);
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
                    {firstLoad && category && category.length === 0 &&
                     <ScrollView contentInsetAdjustmentBehavior = "automatic"
                                 style = {{flexGrow: 1}}>
                         {ContentLoaderCategoryListItem(4)}
                     </ScrollView>
                    }

                    <FlatList
                        contentContainerStyle = {{flexGrow: 1}}
                        refreshControl = {
                            <RefreshControl refreshing = {refreshing}
                                            onRefresh = {onRefresh}/>
                        }
                        data = {category}
                        renderItem = {({item, index}) =>
                            <CategoryListItem item = {item}
                                                 index = {index}/>
                        }
                        keyExtractor = {item => String(item['id'])}
                        ListEmptyComponent = {ListEmptyComponent}
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


SettingsScreen.navigationOptions = {}

export default SettingsScreen;

