import React, {Fragment, useCallback, useEffect, useLayoutEffect, useState} from 'react';

import {
    View,
    SafeAreaView,
    ScrollView,
    FlatList,
    RefreshControl,
    TextInput,
    Text, BackHandler,
} from 'react-native';
import * as yup from "yup";

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
    HeaderInputSearch, ButtonPageFotter,
} from '../components/MyComponent';
import {ListItemSeparator, ModalFilter, ModalFullScreenPage, ProductListItem,} from "../shared/MyContainer";

import {MyModal} from "../components/MyModal";
import {useForm} from "react-hook-form";
import {useSelector} from "react-redux";
import {useFocusEffect} from "@react-navigation/native";

let renderCount = 0;

const filterFormSchema: any = yup.object().shape(
    {
        searchText     : yup.string()
                            .required(MyLANG.SearchQueryText + ' ' + MyLANG.isRequired)
                            .min(1, MyLANG.SearchQueryText + ' ' + MyLANG.mustBeMinimum + ' 1 ' + MyLANG.character)
                            .max(256, MyLANG.SearchQueryText + ' ' + MyLANG.mustBeMaximum + ' 256 ' + MyLANG.character),
        price_min      : yup.number()
                            .min(
                                MyConfig.FilterRange.price[0],
                                `${MyLANG.Price} ${MyLANG.mustBeMinimum} ${MyConfig.FilterRange.price[0]}`
                            )
                            .max(MyConfig.FilterRange.price[1] - 1,
                                 `${MyLANG.Price} ${MyLANG.mustBeMaximum} ${MyConfig.FilterRange.price[0] - 1}`
                            ),
        price_max      : yup.number()
                            .min(
                                MyConfig.FilterRange.price[0] + 1,
                                `${MyLANG.Price} ${MyLANG.mustBeMinimum} ${MyConfig.FilterRange.price[0] + 1}`
                            )
                            .max(MyConfig.FilterRange.price[1],
                                 `${MyLANG.Price} ${MyLANG.mustBeMaximum} ${MyConfig.FilterRange.price[1]}`
                            ),
        category_option: yup.object(),
        filter_option  : yup.object(),
    }
);

let defaultValues: any = {
    searchText     : null,
    price_min      : MyConfig.FilterRange.price[0],
    price_max      : MyConfig.FilterRange.price[1],
    category_option: {},
    filter_option  : {},
}

const SearchScreen = ({route, navigation}: any) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${SearchScreen.name}. renderCount: `, renderCount);
    }

    const category: any      = useSelector((state: any) => state.category);
    const filter_method: any = useSelector((state: any) => state.app_input?.filter_method);

    const [firstLoad, setFirstLoad]                                               = useState(true);
    const [loading, setLoading]                                                   = useState(false);
    const [loadingMore, setLoadingMore]                                           = useState(false);
    const [refreshing, setRefreshing]                                             = useState(false);
    const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(false);

    const [ApiUrl, setApiUrl]: any = useState(null);
    const [data, setData]: any     = useState([]);
    const [count, setCount]: any   = useState([]);

    const [modalVisibleFilter, setModalVisibleFilter] = useState(false);


    const {register, getValues, setValue, handleSubmit, formState, errors, reset, triggerValidation, watch}: any = useForm(
        {
            mode                : 'onSubmit',
            reValidateMode      : 'onChange',
            defaultValues       : defaultValues,
            validationSchema    : filterFormSchema,
            validateCriteriaMode: 'all',
            submitFocusError    : true,
        }
    );

    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${SearchScreen.name}. useEffect: `, 'register');

        for (const key of Object.keys(filterFormSchema['fields'])) {
            if (key) {
                register({name: key});
            }
        }
    }, [register]);

    const values                                                                  = getValues();
    const {searchText, price_min, price_max, category_option, filter_option}: any = watch(['searchText', 'price_min', 'price_max', 'category_option', 'filter_option']);

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
        MyUtil.printConsole(true, 'log', `LOG: ${SearchScreen.name}. useEffect: `, {category, filter_method, data});

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRefresh = useCallback(() => {
        MyUtil.printConsole(true, 'log', 'LOG: onRefresh: ', {searchText, values});

        setRefreshing(true);

        fetchData(0,
                  MyConfig.ListLimit.searchList,
                  false,
                  true,
                  {
                      'showMessage': MyConstant.SHOW_MESSAGE.TOAST,
                      'message'    : MyLANG.PageRefreshed
                  },
                  MyConstant.DataSetType.fresh,
                  ApiUrl,
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

            fetchData(data && data.length > 0 ? data.length : 0,
                      MyConfig.ListLimit.searchList,
                      false,
                      true,
                      false,
                      MyConstant.DataSetType.addToEndUnique,
                      ApiUrl,
            );
        }
    }

    const ListFooterComponent = () => {
        MyUtil.printConsole(true, 'log', 'LOG: ListFooterComponent: ', {'loadingMore': loadingMore});

        if (!loadingMore) return null;

        return <ActivityIndicatorLarge/>;
    }

    const fetchData = async (skip: number = 0, take: number = MyConfig.ListLimit.searchList, showLoader: any = false, setRefresh: boolean = false, showInfoMessage: any = false, DataSetType: string = MyConstant.DataSetType.fresh, apiUrl: string = ApiUrl) => {

        setLoading(true);

        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, apiUrl,
                    {
                        'language_id'  : MyConfig.LanguageActive,
                        'currency_code': 'USD',

                        'searchValue': searchText,

                        'categories_id': category_option?.[Object.keys(category_option)?.[0]]?.id,
                        'minprice'     : price_min,
                        'maxprice'     : price_max,

                        'skip': skip,
                        'take': take,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': apiUrl, 'response': response,
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

                setData(null); // Needed

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

    const onChangeText = (text: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: onChangeText: ', text);

        setValue('searchText', text, true);

        if (data === null || text?.length === 0) {
            setData([]);
        }
    }

    const onClearIcon = () => {
        MyUtil.printConsole(true, 'log', 'LOG: onClearIcon: ', '');

        setValue('searchText', null, true);

        setData([]);
    }

    const onSubmitEditing = async (text: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: onSubmitEditing: ', {});

        if (searchText?.length > 0) {

            setData([]);

            setApiUrl(MyAPI.search);

            fetchData(0,
                      MyConfig.ListLimit.searchList,
                      false,
                      true,
                      false,
                      MyConstant.DataSetType.fresh,
                      MyAPI.search
            );
        }
    }

    const onModalVisible = () => {
        setModalVisibleFilter(true);
    }

    const onFilterItem = (key: string, filter: any, j: number) => {

        if (key === 'category') {
            const category_option_current: any = category_option;

            const id: number = filter?.id;

            if (id > 0 && category_option_current[id]) {
                delete category_option_current[id];
            } else {
                const name: string          = filter?.categories_name;
                category_option_current[id] = {
                    id   : id,
                    name : name,
                    value: name,
                }
            }
            setValue('category_option', category_option_current, true);

        } else if (key === 'filter') {
            const filter_option_current: any = filter_option;

            const id: number = filter?.values?.[j]?.value_id;

            if (id > 0 && filter_option_current[id]) {
                delete filter_option_current[id];
            } else {
                const name: string        = filter?.option?.name;
                const value: any          = filter?.values?.[j]?.value;
                filter_option_current[id] = {
                    id   : id,
                    name : name,
                    value: value,
                }
            }
            setValue('filter_option', filter_option_current, true);
        }

        MyUtil.printConsole(true, 'log', `LOG: onFilterItem: `, {filter, category_option, filter_option});
    }

    const nonCollidingMultiSliderValuesChange = (value: any) => {

        setValue('price_min', value?.[0], true);
        setValue('price_max', value?.[1], true);

        // MyUtil.printConsole(true, 'log', `LOG: nonCollidingMultiSliderValuesChange: `, {value, price_min, price_max, filter_option});
    }

    const onFilterSubmit = () => {

        MyUtil.printConsole(true, 'log', `LOG: onFilterItem: `, {});

        if (category_option?.[Object.keys(category_option)?.[0]]?.id) {

            setData([]);

            setApiUrl(MyAPI.filter_product);

            setValue('searchText', null, true);

            setModalVisibleFilter(false);

            fetchData(0,
                      MyConfig.ListLimit.searchList,
                      false,
                      true,
                      false,
                      MyConstant.DataSetType.fresh,
                      MyAPI.filter_product,
            );

        } else {

            setModalVisibleFilter(false);

            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.FilterCategoryRequired, false);
        }
    }

    return (
        <Fragment>
            <StatusBarLight/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView1}/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <View style = {[MyStyleSheet.SafeAreaView3, {paddingTop: 0, backgroundColor: MyColor.Material.WHITE}]}>

                    <HeaderInputSearch
                        onChangeText = {(text: any) => onChangeText(text)}
                        onSubmitEditing = {(text: any) => onSubmitEditing(text)}
                        value = {searchText}
                        onClearIcon = {() => onClearIcon()}
                        onRightIcon = {onModalVisible}
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

                    {(data?.length === 0 && !loading) ?
                     <ListEmptyViewLottie
                         source = {MyImage.lottie_developer}
                         message = {MyLANG.TypeSomethingToSearch}
                         speed = {0.4}
                         style = {{view: {}, image: {}, text: {}}}
                     />
                                                      :
                     (data?.length === 0 && loading) ?
                     <ListEmptyViewLottie
                         source = {MyImage.lottie_searching_file}
                         message = {MyLANG.WeAreSearching}
                         speed = {0.4}
                         style = {{view: {}, image: {}, text: {}}}
                     />
                                                     :
                     (data?.length > 0) ?
                     <FlatList
                         contentContainerStyle = {{flexGrow: 1}}
                         /*refreshControl = {
                             <RefreshControl
                                 refreshing = {refreshing}
                                 onRefresh = {onRefresh}
                                 progressViewOffset = {MyStyle.headerHeightAdjusted}
                                 colors = {[MyColor.Primary.first]}
                             />
                         }*/
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
                                 {ApiUrl === MyAPI.search ? `${MyLANG.SearchOf} ` : `${MyLANG.Filter} `}
                                 {ApiUrl === MyAPI.search && <Text style = {{fontFamily: MyStyle.FontFamily.Roboto.medium}}>{searchText} </Text>}
                                 {MyLANG.returned} {count} {MyLANG.Results}
                             </Text>
                         }
                         ListFooterComponent = {ListFooterComponent}
                         onEndReachedThreshold = {0.2}
                         onEndReached = {onEndReached}
                         onMomentumScrollBegin = {() => {
                             setOnEndReachedCalledDuringMomentum(false);
                         }}
                     />
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

                <MyModal
                    visible = {modalVisibleFilter}
                    animationType = "slide"
                    statusBarTranslucent = {false}
                    onRequestClose = {() => setModalVisibleFilter(false)}
                    viewTouchable = {{
                        width          : MyStyle.screenWidth,
                        height         : MyStyle.screenHeight,
                        backgroundColor: MyColor.Material.WHITE,
                    }}
                    children = {
                        <ModalFullScreenPage
                            title = {MyLANG.Filters}
                            onBackPress = {() => setModalVisibleFilter(false)}
                            children = {
                                <ModalFilter
                                    category = {category}
                                    filter_method = {filter_method}
                                    watchValues = {{price_min, price_max, category_option, filter_option}}
                                    nonCollidingMultiSliderValuesChange = {(value: any) => nonCollidingMultiSliderValuesChange(value)}
                                    onFilterItem = {(key: string, filter: any, j: number) => onFilterItem(key, filter, j)}
                                />
                            }
                            footer = {
                                <ButtonPageFotter
                                    title = {MyLANG.Submit}
                                    onPress = {() => onFilterSubmit()}
                                />
                            }
                        />
                    }
                    /*children = {
                        <ModalPageLike
                            title = {MyLANG.Filters}
                            onBackPress = {() => setModalVisibleFilter(false)}
                            children = {
                                <ModalFilterPage
                                    items = {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]}
                                    selected = {5}
                                    onItem = {(item: any) => onModalItem(item)}
                                />
                            }
                        />
                    }*/
                />

            </SafeAreaView>
        </Fragment>
    )
}


SearchScreen.navigationOptions = {}

export default SearchScreen;

