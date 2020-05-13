import React, {Fragment, useCallback, useEffect, useState} from 'react';

import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    RefreshControl,
    SectionList, FlatList, BackHandler,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from "react-redux";

import MyUtil from '../common/MyUtil';
import {MyStyle, MyStyleSheet} from '../common/MyStyle';
import MyColor from '../common/MyColor';
import MyImage from '../shared/MyImage';
import {MyAPI, MyConfig} from '../shared/MyConfig';
import MyLANG from '../shared/MyLANG';
import {MyConstant} from '../common/MyConstant';
import MyIcon from '../components/MyIcon';

import {ActivityIndicatorLarge, ListEmptyViewLottie, StatusBarLight} from '../components/MyComponent';
import {MyButton} from "../components/MyButton";
import {
    AddressListItem,
    AddressListItemContentLoader,
    ListItemSeparator,
    NotificationListItem,
    ProductListItem,
    ProductListItemContentLoader
} from "../shared/MyContainer";
import {addressSave} from "../store/AddressRedux";
import MyFunction from "../shared/MyFunction";
import MyMaterialRipple from "../components/MyMaterialRipple";


let renderCount = 0;

const MyAddress = ({route, navigation}: any) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${MyAddress.name}. renderCount: `, {renderCount});
    }

    const dispatch = useDispatch();

    const user: any = useSelector((state: any) => state.auth.user);

    const [firstLoad, setFirstLoad]                                               = useState(true);
    const [loading, setLoading]                                                   = useState(true);
    const [refreshing, setRefreshing]                                             = useState(false);
    const [loadingMore, setLoadingMore]                                           = useState(false);
    const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(false);

    const [address, setAddress]: any = useState(null);

    const [firstNavigation, setFirstNavigation]: any = useState(null);

    useFocusEffect(
        useCallback(() => {

            MyUtil.printConsole(true, 'log', `LOG: ${MyAddress.name}. useFocusEffect: `, {firstNavigation, params: route?.params});

            if (route?.params?.fetchAddress === true) {
                fetchAddress(0,
                             MyConfig.ListLimit.addressList,
                             false,
                             false,
                             false,
                             MyConstant.DataSetType.fresh
                );
            }

            const onBackPress = () => {
                // Go back to Login page:
                MyUtil.commonAction(false,
                                    navigation,
                                    MyConstant.CommonAction.navigate,
                                    firstNavigation?.routeName,
                                    firstNavigation?.params,
                                    null,
                );
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [route.params, firstNavigation])
    );

    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${MyAddress.name}. useEffect: `, {user, address});

        setFirstNavigation(route?.params);

        fetchAddress(0,
                     MyConfig.ListLimit.addressList,
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

        fetchAddress(0,
                     MyConfig.ListLimit.addressList,
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

            fetchAddress(address?.length > 0 ? address.length : 0,
                         MyConfig.ListLimit.addressList,
                         false,
                         true,
                         false,
                         MyConstant.DataSetType.addToEndUnique
            );
        }
    }

    const ListHeaderComponent = () => {
        // MyUtil.printConsole(true, 'log', 'LOG: ListHeaderComponent: ', {});

        return <MyMaterialRipple
            style = {[MyStyle.RowBetweenCenter,
                      {
                          marginTop        : MyStyle.marginViewGapCardTop,
                          marginBottom     : MyStyle.marginViewGapCard,
                          paddingVertical  : MyStyle.paddingVerticalList,
                          paddingHorizontal: MyStyle.paddingHorizontalList,
                          backgroundColor  : MyColor.Material.WHITE,
                      }
            ]}
            {...MyStyle.MaterialRipple.drawer}
            onPress = {
                () =>
                    MyUtil.commonAction(false,
                                        navigation,
                                        MyConstant.CommonAction.navigate,
                                        MyConfig.routeName.MyAddressForm,
                                        {title: MyLANG.NewAddress, pageType: 'NEW'},
                                        null
                    )
            }
        >
            <Text style = {[MyStyleSheet.textListItemTitleDark]}>
                {MyLANG.AddANewAddress}
            </Text>
            <MyIcon.Entypo
                name = "plus"
                size = {20}
                color = {MyColor.Material.GREY["800"]}
                style = {{}}
            />
        </MyMaterialRipple>;
    }

    const SectionHeader = (title: any) => {
        // MyUtil.printConsole(true, 'log', 'LOG: SectionHeader: ', {title});

        return <Text style = {[MyStyleSheet.textListItemTitleDark, {marginLeft: MyStyle.marginHorizontalList}]}>
            {title}
        </Text>;
    }

    const ListEmptyComponent = () => {
        MyUtil.printConsole(true, 'log', 'LOG: ListEmptyComponent: ', {
            // 'address.length': address.length,
            'firstLoad': firstLoad,
        });

        if (firstLoad || (address?.length > 0)) return null;

        return <ListEmptyViewLottie
            source = {MyImage.lottie_empty_lost}
            message = {MyLANG.NoSavedAddressFound}
            style = {{view: {}, image: {}, text: {}}}
        />;
    }

    const ListFooterComponent = () => {
        MyUtil.printConsole(true, 'log', 'LOG: ListFooterComponent: ', {'loadingMore': loadingMore});

        if (!loadingMore) return null;

        return <ActivityIndicatorLarge/>;
    }

    const fetchAddress = async (skip: number = 0, take: number = MyConfig.ListLimit.addressList, showLoader: any = MyLANG.Loading + '...', setRefresh: boolean = false, showInfoMessage: any = false, DataSetType: string = MyConstant.DataSetType.fresh) => {

        setLoading(true);

        const response: any = await MyUtil
            .myHTTP({required: true, promptLogin: true}, MyConstant.HTTP_POST, MyAPI.user_addresses,
                    {
                        'language_id' : MyConfig.LanguageActive,
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
            'apiURL': MyAPI.user_addresses, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data.status === 200 && response.data?.data?.data) {

            const data = response.data.data.data;
            if (data.length > 0) {

                // REMOVE:
                const dataReduced = data.reduce((accumulator: any, item: any) => {
                    const addressText = MyUtil.generateAddress(null,
                                                               item?.street,
                                                               item?.city_name,
                                                               item?.zone_name,
                                                               item?.country_name,
                                                               item?.postcode
                    );
                    accumulator.push(
                        {
                            ...item,
                            addressText: `${item.firstname} ${item.lastname}\n${user?.customers_telephone}\n${addressText}`,
                        }
                    );
                    return accumulator;

                }, []);

                dispatch(addressSave(dataReduced, DataSetType));

                // Use 2 section
                prepareAddress(dataReduced, DataSetType);
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
            MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message, false);
        }
    }

    const prepareAddress = (dataToReduce: any, dataSetType: any) => {

        const data = dataToReduce.reduce((accumulator: any, item: any) => {

            accumulator.push({title: item.company, data: [item]});

            return accumulator;

        }, []);

        switch (dataSetType) {
            case MyConstant.DataSetType.addToEnd:
                setAddress(address.concat(data));
                break;
            case MyConstant.DataSetType.addToStart:
                setAddress(data.concat(address));
                break;
            case MyConstant.DataSetType.addToEndUnique:
                // const newData = product.concat(data.filter(({id}: any) => !product.find((f: any) => f.id == id)));
                const newData1: any = address;
                for (let i = 0; i < data.length; i++) {
                    if (address.some((item: any) => item?.id === data[i]?.id) === false) {
                        newData1.push(data[i]);
                    }
                }
                setAddress(newData1);
                break;
            case MyConstant.DataSetType.addToStartUnique:
                const newData2: any = address;
                for (let i = 0; i < data.length; i++) {
                    if (address.some((item: any) => item?.id === data[i]?.id) === false) {
                        newData2.unshift(data[i]);
                    }
                }
                setAddress(newData2);
                break;
            case MyConstant.DataSetType.fresh:
            default:
                setAddress(data);
                break;
        }

        MyUtil.printConsole(true, 'log', `LOG: ${MyAddress.name}. prepareAddress: `, {dataToReduce, data, address});

    }

    return (
        <Fragment>
            <StatusBarLight/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView1}/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <View style = {[MyStyleSheet.SafeAreaView3, {backgroundColor: MyColor.backgroundGrey}]}>

                    {(firstLoad && address === null) ?
                     <ScrollView
                         contentInsetAdjustmentBehavior = "automatic"
                         contentContainerStyle = {{paddingTop: MyStyle.headerHeightAdjusted, backgroundColor: MyColor.Material.WHITE}}
                     >
                         {AddressListItemContentLoader(4)}
                     </ScrollView>
                                                     :
                     <SectionList
                         contentContainerStyle = {{paddingTop: MyStyle.headerHeightAdjusted, flexGrow: 1}}
                         refreshControl = {
                             <RefreshControl
                                 refreshing = {refreshing}
                                 onRefresh = {onRefresh}
                                 progressViewOffset = {MyStyle.headerHeightAdjusted}
                                 colors = {[MyColor.Primary.first]}
                             />
                         }
                         sections = {address}
                         keyExtractor = {(item: any, index: any) => String(item?.id)}
                         renderItem = {({item}: any) =>
                             <AddressListItem
                                 item = {item}
                                 onPress = {
                                     () =>
                                         MyUtil.commonAction(false,
                                                             null,
                                                             MyConstant.CommonAction.navigate,
                                                             MyConfig.routeName.MyAddressForm,
                                                             {title: MyLANG.EditAddress, pageType: 'EDIT', item: item},
                                                             null
                                         )
                                 }
                                 rippleStyle = {{
                                     marginTop      : 5,
                                     marginBottom   : MyStyle.marginVerticalList,
                                     paddingVertical: MyStyle.paddingVerticalList,
                                     backgroundColor: MyColor.Material.WHITE
                                 }}
                                 phone = {user?.customers_telephone}
                             />
                         }
                         renderSectionHeader = {({section: {title}}) => SectionHeader(title)}
                         ItemSeparatorComponent = {ListItemSeparator}
                         ListHeaderComponent = {ListHeaderComponent}
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

MyAddress.navigationOptions = {}

export default MyAddress;

