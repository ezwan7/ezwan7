import React, {Fragment, useCallback, useEffect, useLayoutEffect, useState} from 'react';

import {View, SafeAreaView, ScrollView, RefreshControl, Text, BackHandler, TouchableOpacity, FlatList} from 'react-native';
import {useFocusEffect} from "@react-navigation/native";

import MyUtil from '../common/MyUtil';
import {MyStyle, MyStyleSheet} from '../common/MyStyle';
import MyColor from '../common/MyColor';
import MyImage from '../shared/MyImage';
import {MyAPI, MyConfig} from '../shared/MyConfig';
import MyLANG from '../shared/MyLANG';
import {MyConstant} from '../common/MyConstant';
import MyIcon from '../components/MyIcon';

import {ActivityIndicatorLarge, ListEmptyViewLottie, ListHeaderViewAll, StatusBarLight} from '../components/MyComponent';
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
import {categoryEmpty, categorySave} from "../store/CategoryRedux";
import {Colors} from "react-native/Libraries/NewAppScreen";
import MyFunction from "../shared/MyFunction";

declare var global: { HermesInternal: null | {} };
// const isHermes = () => global.HermesInternal != null;

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

    const [firstLoadBanner, setFirstLoadBanner] = useState(true);
    const [banner, setBanner]: any              = useState([]);

    const [firstLoadFeatured, setFirstLoadFeatured]                                               = useState(true);
    const [featured, setFeatured]: any                                                            = useState([]);
    const [loadingMoreFeatured, setLoadingMoreFeatured]                                           = useState(false);
    const [onEndReachedCalledDuringMomentumFeatured, setOnEndReachedCalledDuringMomentumFeatured] = useState(true);

    const [firstLoadNewArrival, setFirstLoadNewArrival]                                               = useState(true);
    const [newArrival, setNewArrival]: any                                                            = useState([]);
    const [loadingMoreNewArrival, setLoadingMoreNewArrival]                                           = useState(false);
    const [onEndReachedCalledDuringMomentumNewArrival, setOnEndReachedCalledDuringMomentumNewArrival] = useState(true);


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
        fetchFeatured(featured?.length > 0 ? featured.length : 0,
                      MyConfig.ListLimit.productListHorizontal,
                      false,
                      false,
                      false,
                      MyConstant.DataSetType.fresh
        );
        fetchNewArrival(newArrival?.length > 0 ? newArrival.length : 0,
                        MyConfig.ListLimit.productListHorizontal,
                        false,
                        false,
                        false,
                        MyConstant.DataSetType.fresh
        );

        MyFunction.appUpdateCheck();
        // MyFunction.fetchAppData(false); // in settings page
        MyFunction.fetchFilterMethod(false);
        MyFunction.fetchCountries(); // in address page
        // MyFunction.fetchNotification(false);
        MyFunction.updateDeviceInfo();

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
        fetchFeatured(0,
                      MyConfig.ListLimit.productListHorizontal,
                      false,
                      true,
                      {
                          'showMessage': MyConstant.SHOW_MESSAGE.TOAST,
                          'message'    : MyLANG.PageRefreshed
                      },
                      MyConstant.DataSetType.fresh
        );
        fetchNewArrival(0,
                        MyConfig.ListLimit.productListHorizontal,
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

    const onEndReachedFeatured = () => {
        MyUtil.printConsole(true, 'log', 'LOG: onEndReachedFeatured: ', {
            'loadingMoreFeatured'                     : loadingMoreFeatured,
            'onEndReachedCalledDuringMomentumFeatured': onEndReachedCalledDuringMomentumFeatured
        });

        if (!loadingMoreFeatured && !onEndReachedCalledDuringMomentumFeatured) {

            setLoadingMoreFeatured(true);

            fetchFeatured(featured?.length > 0 ? featured.length : 0,
                          MyConfig.ListLimit.productListHorizontal,
                          false,
                          true,
                          false,
                          MyConstant.DataSetType.addToEndUnique
            );
        }
    }
    const ListFooterFeatured   = () => {
        MyUtil.printConsole(true, 'log', 'LOG: ListFooterFeatured: ', {'loadingMoreFeatured': loadingMoreFeatured});

        if (!loadingMoreFeatured) return null;

        return <ActivityIndicatorLarge style = {{flex: 1}}/>;
    }

    const onEndReachedNewArrival = () => {
        MyUtil.printConsole(true, 'log', 'LOG: onEndReachedNewArrival: ', {
            'loadingMoreNewArrival'                     : loadingMoreNewArrival,
            'onEndReachedCalledDuringMomentumNewArrival': onEndReachedCalledDuringMomentumNewArrival
        });

        if (!loadingMoreNewArrival && !onEndReachedCalledDuringMomentumNewArrival) {

            setLoadingMoreNewArrival(true);

            fetchNewArrival(newArrival?.length > 0 ? newArrival.length : 0,
                            MyConfig.ListLimit.productListHorizontal,
                            false,
                            true,
                            false,
                            MyConstant.DataSetType.addToEndUnique
            );
        }
    }
    const ListFooterNewArrival   = () => {
        MyUtil.printConsole(true, 'log', 'LOG: ListFooterNewArrival: ', {'loadingMoreNewArrival': loadingMoreNewArrival});

        if (!loadingMoreNewArrival) return null;

        return <ActivityIndicatorLarge style = {{flex: 1}}/>;
    }

    const fetchCategory   = async (showLoader: any = MyLANG.Loading + '...', setRefresh: boolean = false, showInfoMessage: any = false) => {

        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.categories,
                    {
                        'language_id': MyConfig.LanguageActive,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.categories, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data.status === 200 && response.data.data && response.data.data.data) {

            const data = response.data.data.data;
            if (data?.length > 0) {
                dispatch(categorySave(data, MyConstant.DataSetType.fresh));
            } else {
                dispatch(categoryEmpty());
            }
        } else {
            dispatch(categoryEmpty());
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
    const fetchBanner     = async (showLoader: any = MyLANG.Loading + '...', setRefresh: boolean = false, showInfoMessage: any = false) => {

        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.banner,
                    {
                        'language_id': MyConfig.LanguageActive,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.banner, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data?.data?.data) {

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
    const fetchFeatured   = async (skip: number = 0, take: number = MyConfig.ListLimit.productListHorizontal, showLoader: any = MyLANG.Loading + '...', setRefresh: boolean = false, showInfoMessage: any = false, DataSetType: string = MyConstant.DataSetType.fresh) => {

        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.featured_products,
                    {
                        'language_id': MyConfig.LanguageActive,
                        'skip'       : skip,
                        'take'       : take,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.featured_products, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data.status === 200 && response.data?.data?.data?.product) {

            const data = response.data.data.data.product;
            if (data?.length > 0) {
                switch (DataSetType) {
                    case MyConstant.DataSetType.addToEnd:
                        setFeatured(featured.concat(data));
                        break;
                    case MyConstant.DataSetType.addToStart:
                        setFeatured(data.concat(featured));
                        break;
                    case MyConstant.DataSetType.addToEndUnique:
                        // const newData = product.concat(data.filter(({id}: any) => !product.find((f: any) => f.id == id)));
                        const newData1: any = featured;
                        for (let i = 0; i < data.length; i++) {
                            if (featured.some((item: any) => item?.id === data[i]?.id) === false) {
                                newData1.push(data[i]);
                            }
                        }
                        setFeatured(newData1);
                        break;
                    case MyConstant.DataSetType.addToStartUnique:
                        const newData2: any = featured;
                        for (let i = 0; i < data.length; i++) {
                            if (featured.some((item: any) => item?.id === data[i]?.id) === false) {
                                newData2.unshift(data[i]);
                            }
                        }
                        setFeatured(newData2);
                        break;
                    case MyConstant.DataSetType.fresh:
                    default:
                        setFeatured(data);
                        break;
                }
            }

        } else {
            MyUtil.showMessage(showInfoMessage.showMessage, response.errorMessage ? response.errorMessage : MyLANG.UnknownError, false);
        }

        setFirstLoadFeatured(false);
        setLoadingMoreFeatured(false);
        setOnEndReachedCalledDuringMomentumFeatured(true);
        if (setRefresh === true) {
            setRefreshing(false);
        }

        if (showInfoMessage !== false) {
            MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message, false);
        }
    }
    const fetchNewArrival = async (skip: number = 0, take: number = MyConfig.ListLimit.productListHorizontal, showLoader: any = MyLANG.Loading + '...', setRefresh: boolean = false, showInfoMessage: any = false, DataSetType: string = MyConstant.DataSetType.fresh) => {

        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.new_arrival_products,
                    {
                        'language_id': MyConfig.LanguageActive,
                        'skip'       : skip,
                        'take'       : take,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.new_arrival_products, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data.status === 200 && response.data?.data?.data?.product) {

            const data = response.data.data.data.product;
            if (data?.length > 0) {
                switch (DataSetType) {
                    case MyConstant.DataSetType.addToEnd:
                        setNewArrival(newArrival.concat(data));
                        break;
                    case MyConstant.DataSetType.addToStart:
                        setNewArrival(data.concat(newArrival));
                        break;
                    case MyConstant.DataSetType.addToEndUnique:
                        // const newData = product.concat(data.filter(({id}: any) => !product.find((f: any) => f.id == id)));
                        const newData1: any = newArrival;
                        for (let i = 0; i < data.length; i++) {
                            if (newArrival.some((item: any) => item?.id === data[i]?.id) === false) {
                                newData1.push(data[i]);
                            }
                        }
                        setNewArrival(newData1);
                        break;
                    case MyConstant.DataSetType.addToStartUnique:
                        const newData2: any = newArrival;
                        for (let i = 0; i < data.length; i++) {
                            if (newArrival.some((item: any) => item?.id === data[i]?.id) === false) {
                                newData2.unshift(data[i]);
                            }
                        }
                        setNewArrival(newData2);
                        break;
                    case MyConstant.DataSetType.fresh:
                    default:
                        setNewArrival(data);
                        break;
                }
            }

        } else {
            MyUtil.showMessage(showInfoMessage.showMessage, response.errorMessage ? response.errorMessage : MyLANG.UnknownError, false);
        }

        setFirstLoadNewArrival(false);
        setLoadingMoreNewArrival(false);
        setOnEndReachedCalledDuringMomentumNewArrival(true);
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

                    {(!firstLoadCategory && !firstLoadBanner && !firstLoadFeatured && !firstLoadNewArrival && category?.length === 0 && banner?.length === 0 && featured?.length === 0 && newArrival?.length === 0) ?
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

                         {/*{global.HermesInternal == null ? (
                             <View style = {{}}>
                                 <Text style = {{
                                     color       : Colors.dark,
                                     fontSize    : 12,
                                     fontWeight  : '600',
                                     padding     : 4,
                                     paddingRight: 12,
                                     textAlign   : 'right',
                                 }}>
                                     Engine: No Hermes
                                 </Text>
                             </View>
                         ) : (
                              <View style = {{}}>
                                  <Text style = {{
                                      color       : Colors.dark,
                                      fontSize    : 12,
                                      fontWeight  : '600',
                                      padding     : 4,
                                      paddingRight: 12,
                                      textAlign   : 'right',
                                  }}>
                                      Engine: Hermes
                                  </Text>
                              </View>
                          )}*/}

                         <ScrollView
                             contentContainerStyle = {{
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
                             snapToInterval = {MyStyle.screenWidth}
                             snapToAlignment = "center"
                             showsHorizontalScrollIndicator = {false}
                             style = {{marginVertical: MyStyle.marginVerticalList}}
                         >
                             {firstLoadBanner && banner?.length === 0 && <ImageSliderBannerContentLoader/>}
                             <ImageSliderBanner
                                 item = {banner}
                                 onPress = {(prop: any) =>
                                     prop?.type === 'category' ?
                                     MyUtil.commonAction(false,
                                                         null,
                                                         MyConstant.CommonAction.navigate,
                                                         MyConfig.routeName.ProductList,
                                                         {'title': prop?.title, 'id': Number(prop?.url), 'apiURL': MyAPI.product_by_category},
                                                         null
                                     ) :
                                     prop?.type === 'product' ?
                                     MyUtil.commonAction(false,
                                                         null,
                                                         MyConstant.CommonAction.navigate,
                                                         MyConfig.routeName.ProductDetails,
                                                         {'id': Number(prop?.url), 'item': prop},
                                                         null
                                     ) : null
                                 }
                                 style = {{}}
                             />
                         </ScrollView>

                         <ListHeaderViewAll
                             textLeft = {MyLANG.FeaturedProducts}
                             textRight = {MyLANG.ViewAll}
                             onPress = {
                                 () =>
                                     MyUtil.commonAction(false,
                                                         navigation,
                                                         MyConstant.CommonAction.navigate,
                                                         MyConfig.routeName.ProductList,
                                                         {'title': MyLANG.FeaturedProducts, 'id': null, 'apiURL': MyAPI.featured_products},
                                                         null
                                     )
                             }
                         />
                         {
                             featured?.length > 0 ?
                             <FlatList
                                 contentContainerStyle = {{marginVertical: MyStyle.marginVerticalList}}
                                 horizontal = {true}
                                 data = {featured}
                                 renderItem = {({item, index}: any) =>
                                     <ProductHorizontalListItem
                                         item = {item}
                                         index = {index}
                                     />
                                 }
                                 keyExtractor = {(item: any) => String(item?.id)}
                                 ListFooterComponent = {ListFooterFeatured}
                                 onEndReachedThreshold = {0.2}
                                 onEndReached = {onEndReachedFeatured}
                                 onMomentumScrollBegin = {() => {
                                     setOnEndReachedCalledDuringMomentumFeatured(false);
                                 }}
                             />
                                                  :
                             firstLoadFeatured ?
                             <ScrollView
                                 horizontal
                                 style = {{flexGrow: 0, marginVertical: MyStyle.marginVerticalList}}
                             >
                                 {ProductHorizontalListItemContentLoader(MyConfig.ListLimit.productListHorizontal)}
                             </ScrollView>
                                               :
                             null
                         }
                         {/*<ScrollView
                             horizontal
                             showsHorizontalScrollIndicator = {false}
                             style = {{flexGrow: 0, marginVertical: MyStyle.marginVerticalList}}
                         >
                             {
                                 featured?.length > 0 ? <ProductHorizontalListItem item = {featured}/>
                                                      :
                                 firstLoadFeatured ? ProductHorizontalListItemContentLoader(5)
                                                   : null
                             }
                         </ScrollView>*/}

                         <ListHeaderViewAll
                             textLeft = {MyLANG.NewArrivals}
                             textRight = {MyLANG.ViewAll}
                             onPress = {
                                 () =>
                                     MyUtil.commonAction(false,
                                                         navigation,
                                                         MyConstant.CommonAction.navigate,
                                                         MyConfig.routeName.ProductList,
                                                         {'title': MyLANG.NewArrivals, 'id': null, 'apiURL': MyAPI.new_arrival_products},
                                                         null
                                     )
                             }
                         />
                         {
                             newArrival?.length > 0 ?
                             <FlatList
                                 contentContainerStyle = {{marginVertical: MyStyle.marginVerticalList}}
                                 horizontal = {true}
                                 data = {newArrival}
                                 renderItem = {({item, index}: any) =>
                                     <ProductHorizontalListItem
                                         item = {item}
                                         index = {index}
                                     />
                                 }
                                 keyExtractor = {(item: any) => String(item?.id)}
                                 ListFooterComponent = {ListFooterNewArrival}
                                 onEndReachedThreshold = {0.2}
                                 onEndReached = {onEndReachedNewArrival}
                                 onMomentumScrollBegin = {() => {
                                     setOnEndReachedCalledDuringMomentumNewArrival(false);
                                 }}
                             />
                                                    :
                             firstLoadNewArrival ?
                             <ScrollView
                                 horizontal
                                 style = {{flexGrow: 0, marginVertical: MyStyle.marginVerticalList}}
                             >
                                 {ProductHorizontalListItemContentLoader(MyConfig.ListLimit.productListHorizontal)}
                             </ScrollView>
                                                 :
                             null
                         }
                         {/*<ScrollView
                             horizontal
                             showsHorizontalScrollIndicator = {false}
                             style = {{flexGrow: 0, marginVertical: MyStyle.marginVerticalList}}
                         >
                             {
                                 newArrival?.length > 0 ? <ProductHorizontalListItem item = {newArrival}/>
                                                        :
                                 firstLoadNewArrival ? ProductHorizontalListItemContentLoader(5)
                                                     : null
                             }
                         </ScrollView>*/}

                     </ScrollView>
                    }

                </View>
            </SafeAreaView>
        </Fragment>
    )
}


HomeScreen.navigationOptions = {}

export default HomeScreen;

