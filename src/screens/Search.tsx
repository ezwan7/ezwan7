import React, {Fragment, useCallback, useEffect, useLayoutEffect, useState} from 'react';

import {
    View,
    SafeAreaView,
    ScrollView,
    FlatList,
    RefreshControl,
    TextInput,
    Text,
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
    ListEmptyViewLottie,
    StatusBarDark,
    StatusBarLight,
    HeaderInputSearch,
} from '../components/MyComponent';
import {
    ListItemSeparator,
    ProductListItem,
} from "../shared/MyContainer";

import Slider from '@react-native-community/slider';

let renderCount = 0;

const SearchScreen = ({route, navigation}: any) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${SearchScreen.name}. renderCount: `, renderCount);
    }

    const [firstLoad, setFirstLoad]                                               = useState(true);
    const [loading, setLoading]                                                   = useState(false);
    const [loadingMore, setLoadingMore]                                           = useState(false);
    const [refreshing, setRefreshing]                                             = useState(false);
    const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(true);
    const [data, setData]: any                                                    = useState([]);
    const [count, setCount]: any                                                  = useState([]);

    const [searchText, setSearchText]: any = useState(null);

    const [showFilter, setShowFilter]: any = useState(false);
    const [price, setPrice]: any           = useState(0);

    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${SearchScreen.name}. useEffect: `, '');

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRefresh = useCallback(() => {
        MyUtil.printConsole(true, 'log', 'LOG: onRefresh: ', {searchText});

        if (searchText?.length > 1) {
            setRefreshing(true);
            fetchData(0, MyConfig.ListLimit.searchList, MyLANG.Loading + '...', true, {
                'showMessage': MyConstant.SHOW_MESSAGE.TOAST,
                'message'    : MyLANG.PageRefreshed
            }, MyConstant.DataSetType.fresh);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onEndReached = () => {
        MyUtil.printConsole(true, 'log', 'LOG: onEndReached: ', {
            'loadingMore'                     : loadingMore,
            'onEndReachedCalledDuringMomentum': onEndReachedCalledDuringMomentum
        });

        if (!loadingMore && !onEndReachedCalledDuringMomentum) {

            setLoadingMore(true);

            fetchData(data && data.length > 0 ? data.length : 0,
                      MyConfig.ListLimit.searchList,
                      false,
                      true,
                      false,
                      MyConstant.DataSetType.addToEndUnique
            );
        }
    }

    const ListFooter = () => {
        MyUtil.printConsole(true, 'log', 'LOG: ListFooter: ', {'loadingMore': loadingMore});

        if (!loadingMore) return null;

        return <ActivityIndicatorLarge/>;
    }

    const onSubmitEditing = async (text: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: onSubmitEditing: ', {});

        setData([]);
        if (searchText?.length > 1) {
            fetchData();
        }
    }

    // Refresh All existing on Component Visibile, Show Placeholder on start and loadmore, No Data Found Design
    const fetchData = async (skip: number = 0, take: number = MyConfig.ListLimit.searchList, showLoader: any = false, setRefresh: boolean = false, showInfoMessage: any = false, DataSetType: string = MyConstant.DataSetType.fresh) => {

        setLoading(true);

        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.search,
                    {
                        'language_id'  : MyConfig.LanguageActive,
                        'currency_code': 'USD',
                        'searchValue'  : searchText,

                        'skip': skip,
                        'take': take,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Short, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.search, 'response': response
        });

        setTimeout(() => {
            if (response.type === MyConstant.RESPONSE.TYPE.data && response?.data?.status === 200 && response?.data?.data?.product_data?.products) {

                const data = response.data.data.product_data.products;
                if (data.length > 0) {
                    setCount(response.data.data.total_record);
                    switch (DataSetType) {
                        case MyConstant.DataSetType.addToEnd:
                            setData(data.concat(data));
                            break;
                        case MyConstant.DataSetType.addToStart:
                            setData(data.concat(data));
                            break;
                        case MyConstant.DataSetType.addToEndUnique:
                            // const newData = data.concat(data.filter(({id}: any) => !data.find((f: any) => f.id == id)));
                            const newData1: any = data;
                            for (let i = 0; i < data.length; i++) {
                                if (data.some((item: any) => item?.id === data[i]?.id) === false) {
                                    newData1.push(data[i]);
                                }
                            }
                            setData(newData1);
                            break;
                        case MyConstant.DataSetType.addToStartUnique:
                            const newData2: any = data;
                            for (let i = 0; i < data.length; i++) {
                                if (data.some((item: any) => item?.id === data[i]?.id) === false) {
                                    newData2.unshift(data[i]);
                                }
                            }
                            setData(newData2);
                            break;
                        case MyConstant.DataSetType.fresh:
                        default:
                            setData(data);
                            break;
                    }
                }
            } else {
                setData(null);
                // MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT, response.errorMessage ? response.errorMessage : MyLANG.UnknownError, false);
            }

            setLoadingMore(false);
            setOnEndReachedCalledDuringMomentum(true);
            setLoading(false);
            if (setRefresh === true) {
                setRefreshing(false);
            }
            if (firstLoad === true) {
                setFirstLoad(false)
            }

            if (showInfoMessage !== false) {
                MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message, false);
            }

        }, MyConfig.dateSetDelay);
    }


    return (
        <Fragment>
            <StatusBarLight/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView1}/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <View style = {[MyStyleSheet.SafeAreaView3, {paddingTop: 0, backgroundColor: MyColor.Material.WHITE}]}>

                    <HeaderInputSearch
                        onChangeText = {(text: any) => {
                            setSearchText(text);
                            if (data === null || text?.length === 0) {
                                setData([])
                            }
                        }}
                        onSubmitEditing = {(text: any) => onSubmitEditing(text)}
                        value = {searchText}
                        onRightIcon = {() => setShowFilter(!showFilter)}
                    />

                    {/*<View>
                        <Slider
                            style = {{width: 200, height: 100}}
                            minimumValue = {0}
                            maximumValue = {5000}
                            step = {1}
                            thumbTintColor = {MyColor.Primary.first}
                            minimumTrackTintColor = {MyColor.Primary.first}
                            maximumTrackTintColor = {MyColor.Primary.first}
                            onValueChange = {(value: number) => setPrice(value)}
                        />
                        <Text>{price}</Text>
                    </View>*/}

                    {(data?.length === 0 && !loading) &&
                     <ListEmptyViewLottie
                         source = {MyImage.lottie_developer}
                         message = {MyLANG.TypeSomethingToSearch}
                         speed = {0.4}
                         style = {{view: {}, image: {}, text: {}}}
                     />
                    }
                    {(data?.length === 0 && loading) &&
                     <ListEmptyViewLottie
                         source = {MyImage.lottie_searching_file}
                         message = {MyLANG.WeAreSearching}
                         speed = {0.4}
                         style = {{view: {}, image: {}, text: {}}}
                     />
                    }

                    {(data?.length > 0 && !loading) ?
                     <>
                         <FlatList
                             contentContainerStyle = {{flexGrow: 1}}
                             refreshControl = {
                                 <RefreshControl
                                     refreshing = {refreshing}
                                     onRefresh = {onRefresh}
                                     progressViewOffset = {MyStyle.headerHeightAdjusted}
                                     colors = {[MyColor.Primary.first]}
                                 />
                             }
                             data = {data}
                             renderItem = {({item, index}: any) =>
                                 <ProductListItem
                                     item = {item}
                                     index = {index}/>
                             }
                             keyExtractor = {(item: any) => String(item?.id)}
                             ItemSeparatorComponent = {ListItemSeparator}
                             ListHeaderComponent = {
                                 <Text
                                     numberOfLines = {3}
                                     style = {{
                                         textAlign        : "center",
                                         paddingHorizontal: MyStyle.marginHorizontalPage,
                                         paddingVertical  : 5,
                                         backgroundColor  : MyColor.Material.GREY["300"],
                                         fontFamily       : MyStyle.FontFamily.Roboto.regular,
                                         fontSize         : 13,
                                         color            : MyColor.Material.GREY["900"],
                                     }}
                                 >
                                     {MyLANG.SearchOf}&nbsp;
                                     <Text style = {{fontFamily: MyStyle.FontFamily.Roboto.medium}}>{searchText}</Text>
                                     &nbsp;{MyLANG.returned} {count} {MyLANG.Results}
                                 </Text>
                             }
                             ListFooterComponent = {ListFooter}
                             onEndReachedThreshold = {0.2}
                             onEndReached = {onEndReached}
                             onMomentumScrollBegin = {() => {
                                 setOnEndReachedCalledDuringMomentum(false);
                             }}
                         />
                     </>
                                                    :
                     (data === null) ?
                     <ListEmptyViewLottie
                         source = {MyImage.lottie_empty_lost}
                         message = {MyLANG.NoDataFoundInSearch}
                         style = {{view: {}, image: {}, text: {}}}
                     />
                                     :
                     null
                    }
                </View>
            </SafeAreaView>
        </Fragment>
    )
}


SearchScreen.navigationOptions = {}

export default SearchScreen;

