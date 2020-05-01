import React, {Fragment, useCallback, useEffect, useLayoutEffect, useState} from 'react';

import {View, Text, SafeAreaView, ScrollView, RefreshControl, FlatList} from 'react-native';

import MyUtil from '../common/MyUtil';
import {MyStyle, MyStyleSheet} from '../common/MyStyle';
import MyColor from '../common/MyColor';
import MyImage from '../shared/MyImage';
import {MyAPI, MyConfig} from '../shared/MyConfig';
import MyLANG from '../shared/MyLANG';
import {MyConstant} from '../common/MyConstant';
import MyIcon from '../components/MyIcon';

import {ActivityIndicatorLarge, HeaderInputSearchOptionPage, StatusBarLight} from '../components/MyComponent';
import {ListItemSeparator, OptionList} from "../shared/MyContainer";


let renderCount = 0;

const OptionPage = ({route, navigation}: any) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${OptionPage.name}. renderCount: `, {renderCount});
    }

    const [refreshing, setRefreshing]                                             = useState(false);
    const [loadingMore, setLoadingMore]                                           = useState(false);
    const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(false);

    const [itemsParam]: any            = useState(route?.params?.items);
    const [itemsAll, setItemsAll]: any = useState(route?.params?.items);
    const [items, setItems]: any       = useState([]);

    const [searchText, setSearchText]: any = useState(null);

    useLayoutEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${OptionPage.name}. useLayoutEffect: `, '');

        if (route?.params?.title && route?.params?.allowSearch !== true) {
            navigation.setOptions(
                {
                    title: route?.params?.title,
                });
        }
    }, [navigation, route]);


    useEffect(() => {

        MyUtil.printConsole(true, 'log', `LOG: ${OptionPage.name}. useEffect: `, route?.params);

        setItems(itemsAll?.slice(0, route?.params?.listLimit));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /*const onRefresh = useCallback(() => {
        MyUtil.printConsole(true, 'log', 'LOG: onRefresh: ', {});

        setRefreshing(true);

        setItems(itemsParam?.slice(0, route?.params?.listLimit));

        setRefreshing(false);
        setOnEndReachedCalledDuringMomentum(true);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);*/

    const onEndReached = () => {
        /*MyUtil.printConsole(true, 'log', 'LOG: onEndReached: ', {
            'loadingMore'                     : loadingMore,
            'onEndReachedCalledDuringMomentum': onEndReachedCalledDuringMomentum,
        });*/

        if (!loadingMore) {

            setLoadingMore(true);

            const newData1: any = itemsAll?.slice(items?.length, items?.length + route?.params?.listLimit);
            setItems(items.concat(newData1));

            setLoadingMore(false);
            setOnEndReachedCalledDuringMomentum(true);
        }
    }

    const ListFooterComponent = () => {
        MyUtil.printConsole(true,
                            'log',
                            'LOG: ListFooterComponent: ',
                            {items}
        );

        if (itemsAll?.length === items?.length) {
            return <View style = {{backgroundColor: MyColor.backgroundGrey, paddingVertical: 10, paddingHorizontal: 15}}>
                <Text style = {[MyStyle.textPageInfo, {textAlign: 'center'}]}>
                    {MyLANG.AllItemsLoadedInTheList}
                </Text>
            </View>;
        } else if (!loadingMore) {
            return null;
        } else {
            return <ActivityIndicatorLarge/>;
        }
    }

    const onItem = (value: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: onItem: ', value);

        switch (route?.params?.onItem?.type) {

            case MyConstant.OptionPageOnItem.select_and_go_back:
                MyUtil.commonAction(false,
                                    navigation,
                                    MyConstant.CommonAction.navigate,
                                    route?.params?.onItem?.routeName,
                                    {
                                        setValue  : route?.params?.onItem?.setValue,
                                        resetValue: route?.params?.onItem?.resetValue,
                                        value     : value,
                                    },
                                    null
                )
                break;
            default:
                break;
        }
    }

    const searchItem = async (text: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: searchItem: ', text);

        if (text?.length > 0) {

            const search_text: string = text.toLowerCase().trim();
            const searchedItem: any   = itemsParam.filter((item: any) => {
                const paramItem = item?.countries_name?.toLowerCase().trim();
                if (paramItem.includes(search_text)) {
                    return true;
                }
            })

            MyUtil.printConsole(true, 'log', 'LOG: searchItem: ', searchedItem);

            setItems(searchedItem?.slice(0, route?.params?.listLimit));
            setItemsAll(searchedItem);

        } else {
            setItems(itemsParam?.slice(0, route?.params?.listLimit));
            setItemsAll(itemsParam);
        }
    }

    return (
        <Fragment>
            <StatusBarLight/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView1}/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <View style = {[MyStyleSheet.SafeAreaView3, {paddingTop: 0, backgroundColor: MyColor.Material.WHITE}]}>

                    <HeaderInputSearchOptionPage
                        allowSearch = {route?.params?.allowSearch}
                        onChangeText = {(text: any) => {
                            setSearchText(text);
                            searchItem(text);
                        }}
                        //onSubmitEditing = {(text: any) => searchItem(text)}
                        onClearIcon = {() => {
                            setSearchText(null);
                            searchItem('');
                        }}
                        value = {searchText}
                    />

                    <FlatList
                        contentContainerStyle = {{flexGrow: 1}}
                        data = {items}
                        renderItem = {({item, index}: any) =>
                            <OptionList
                                item = {item}
                                index = {index}
                                listShow = {route?.params?.listShow}
                                listSelected = {route?.params?.listSelected}
                                onItem = {(value: any) => onItem(value)}
                            />
                        }
                        keyExtractor = {(item: any) => String(item?.id)}
                        // ListEmptyComponent = {ListEmptyComponent}
                        ItemSeparatorComponent = {ListItemSeparator}
                        ListHeaderComponent = {
                            searchText?.length &&
                            <Text
                                numberOfLines = {2}
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
                                &nbsp;{MyLANG.returned} {itemsAll?.length} {MyLANG.Results}
                            </Text>
                        }
                        ListFooterComponent = {ListFooterComponent}
                        onEndReachedThreshold = {0.5}
                        onEndReached = {onEndReached}
                        /*onMomentumScrollBegin = {() => {
                            setOnEndReachedCalledDuringMomentum(false);
                        }}*/
                    />

                    {/*<ScrollView
                        contentInsetAdjustmentBehavior = "automatic"
                        contentContainerStyle = {{paddingTop: MyStyle.headerHeightAdjusted, flexGrow: 1}}
                    >
                        <View>
                            <OptionList
                                items = {items}
                                listShow = {route?.params?.listShow}
                                listSelected = {route?.params?.listSelected}
                                onItem = {(value: any) => onItem(value)}
                            />
                        </View>
                    </ScrollView>*/}

                </View>

            </SafeAreaView>
        </Fragment>
    )
}

OptionPage.navigationOptions = {}

export default OptionPage;

