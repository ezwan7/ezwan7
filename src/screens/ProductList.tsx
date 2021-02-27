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
    ActivityIndicatorLarge, ButtonPageFotter, HeaderGradientPrimary, HeaderInputProductSearch, HeaderInputSearch, HeaderInputSearchOptionPage,
    ListEmptyViewLottie,
    StatusBarDark,
    StatusBarLight
} from '../components/MyComponent';
import {
    ProductListItemContentLoader,
    ListItemSeparator,
    ProductListItem, ModalFullScreenPage, ModalFilter, ModalNotFullScreen, ModalRadioList,
} from "../shared/MyContainer";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {MyModal} from "../components/MyModal";
import {useSelector} from "react-redux";

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
        filters        : yup.array(),
        sorting        : yup.object(),
    }
);

let defaultValues: any = {
    searchText     : null,
    price_min      : MyConfig.FilterRange.price[0],
    price_max      : MyConfig.FilterRange.price[1],
    category_option: {},
    filter_option  : {},
    filters        : [],
    sorting        : null,
}

const ProductListScreen = ({route, navigation}: any) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${ProductListScreen.name}. renderCount: `, renderCount);
    }

    const category: any      = useSelector((state: any) => state.category);
    const filter_method: any = useSelector((state: any) => state.app_input?.filter_method);

    const [firstLoad, setFirstLoad]                                               = useState(true);
    const [loading, setLoading]                                                   = useState(true);
    const [refreshing, setRefreshing]                                             = useState(false);
    const [loadingMore, setLoadingMore]                                           = useState(false);
    const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(false);

    const [ApiUrl, setApiUrl]: any   = useState(route?.params?.apiURL || MyAPI.product_by_category);
    const [product, setProduct]: any = useState([]);
    const [count, setCount]: any     = useState([]);

    const [modalVisibleFilter, setModalVisibleFilter]   = useState(false);
    const [modalVisibleSorting, setModalVisibleSorting] = useState(false);


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
        MyUtil.printConsole(true, 'log', `LOG: ${ProductListScreen.name}. useEffect: `, 'register');

        for (const key of Object.keys(filterFormSchema['fields'])) {
            if (key) {
                register({name: key});
            }
        }
    }, [register]);

    const values                                                                                    = getValues();
    const {searchText, price_min, price_max, category_option, filter_option, filters, sorting}: any = watch(['searchText', 'price_min', 'price_max', 'category_option', 'filter_option', 'filters', 'sorting']);

    useLayoutEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${ProductListScreen.name}. useLayoutEffect: `, '');

        if (route?.params?.apiURL === MyAPI.wishlist) {
            navigation.setOptions(
                {
                    title: route?.params?.title,
                    // headerBackground: HeaderGradientPrimary,
                });
        } else {
            navigation.setOptions(
                {
                    title                 : null,
                    headerBackTitleVisible: false,
                });
        }
    }, [navigation, route]);

    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${ProductListScreen.name}. useEffect: `, {params: route?.params, category, filter_method, product});

        fetchData(0,
                  MyConfig.ListLimit.productList,
                  false,
                  false,
                  false,
                  MyConstant.DataSetType.fresh,
                  ApiUrl,
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRefresh = useCallback(() => {
        MyUtil.printConsole(true, 'log', 'LOG: onRefresh: ', {});

        setRefreshing(true);

        fetchData(0,
                  MyConfig.ListLimit.productList,
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

            fetchData(product?.length > 0 ? product.length : 0,
                      MyConfig.ListLimit.productList,
                      false,
                      true,
                      false,
                      MyConstant.DataSetType.addToEndUnique,
                      ApiUrl,
            );
        }
    }

    const ListEmptyComponent = () => {
        MyUtil.printConsole(true, 'log', 'LOG: ListEmptyComponent: ', {
            'product.length': product?.length,
            'firstLoad'     : firstLoad,
        });

        if (firstLoad || (product?.length > 0)) return null;

        return <ListEmptyViewLottie
            source = {MyImage.lottie_empty_lost}
            message = {MyLANG.NoProductFound}
            style = {{view: {}, image: {}, text: {}}}
        />;
    }

    const ListFooterComponent = () => {
        MyUtil.printConsole(true, 'log', 'LOG: ListFooterComponent: ', {'loadingMore': loadingMore});

        if (!loadingMore) return null;

        return <ActivityIndicatorLarge/>;
    }

    const fetchData = async (skip: number = 0, take: number = MyConfig.ListLimit.productList, showLoader: any = MyLANG.Loading + '...', setRefresh: boolean = false, showInfoMessage: any = false, DataSetType: string = MyConstant.DataSetType.fresh, apiUrl: string = ApiUrl, sort: any = sorting, filter: any = filters) => {

        setLoading(true);

        let formData: any = null;

        if (apiUrl === MyAPI.search || apiUrl === MyAPI.filter_product) {
            formData = {
                'language_id'  : MyConfig.LanguageActive,
                'currency_code': 'USD',

                'searchValue': apiUrl === MyAPI.filter_product ? undefined : searchText,

                'categories_id': route?.params?.id,
                'minprice'     : price_min,
                'maxprice'     : price_max,
                'filters'      : filter,

                'skip': skip,
                'take': take,

                'sort_by'       : apiUrl === MyAPI.filter_product ? 'products_id' : sort?.name_key || 'products_id',
                'sort_direction': apiUrl === MyAPI.filter_product ? 'DESC' : sort?.direction_key || 'DESC',

                'app_ver'      : MyConfig.app_version,
                'app_build_ver': MyConfig.app_build_version,
                'platform'     : MyConfig.app_platform,
                'device'       : null,
            }
        } else {
            formData = {
                'language_id': MyConfig.LanguageActive,

                'type'        : route?.params?.type,
                'customers_id': route?.params?.user_id,

                'categories_id': route?.params?.id,

                'skip': skip,
                'take': take,

                'sort_by'       : apiUrl === MyAPI.featured_products || apiUrl === MyAPI.new_arrival_products ? 'products_id' : sort?.name_key || 'products_id',
                'sort_direction': sort?.direction_key || 'DESC',

                'app_ver'      : MyConfig.app_version,
                'app_build_ver': MyConfig.app_build_version,
                'platform'     : MyConfig.app_platform,
                'device'       : null,
            }
        }

        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, apiUrl,
                    formData, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': apiUrl, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data.status === 200) {

            let data: any = null;

            if ((apiUrl === MyAPI.search || apiUrl === MyAPI.filter_product) && response.data.data?.product_data?.products) {
                data = response.data.data.product_data.products;
            } else if (response.data?.data?.data?.product) {
                data = response.data.data.data.product;
            } else {
                // setProduct(null); // Needed
            }

            if (data?.length > 0) {
                setCount(response.data.data.total_record || 0);
                switch (DataSetType) {
                    case MyConstant.DataSetType.addToEnd:
                        setProduct(product.concat(data));
                        break;
                    case MyConstant.DataSetType.addToStart:
                        setProduct(data.concat(product));
                        break;
                    case MyConstant.DataSetType.addToEndUnique:
                        // const newData = product.concat(data.filter(({id}: any) => !product.find((f: any) => f.id == id)));
                        const newData1: any = product;
                        for (let i = 0; i < data.length; i++) {
                            if (product.some((item: any) => item?.id === data[i]?.id) === false) {
                                newData1.push(data[i]);
                            }
                        }
                        setProduct(newData1);
                        break;
                    case MyConstant.DataSetType.addToStartUnique:
                        const newData2: any = product;
                        for (let i = 0; i < data.length; i++) {
                            if (product.some((item: any) => item?.id === data[i]?.id) === false) {
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
            MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message, false);
        }
    }

    const onChangeText = (text: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: onChangeText: ', text);

        setValue('searchText', text, true);

        if (text?.length === 0) {
            fetchData(0,
                      MyConfig.ListLimit.productList,
                      false,
                      false,
                      false,
                      MyConstant.DataSetType.fresh,
                      route?.params?.apiURL || MyAPI.product_by_category,
            );
        }
    }

    const onClearIcon = () => {
        MyUtil.printConsole(true, 'log', 'LOG: onClearIcon: ', '');

        setValue('searchText', null, true);

        if (ApiUrl === MyAPI.search || ApiUrl === MyAPI.filter_product) {
            fetchData(0,
                      MyConfig.ListLimit.productList,
                      false,
                      false,
                      false,
                      MyConstant.DataSetType.fresh,
                      route?.params?.apiURL || MyAPI.product_by_category,
            );
        }

        setApiUrl(route?.params?.apiURL || MyAPI.product_by_category);
    }

    const onSubmitEditing = async (text: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: onSubmitEditing: ', {});

        if (searchText?.length > 0) {

            setProduct([]);

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

    const onModalVisible = (key: string) => {
        switch (key) {
            case 'filter':
                setModalVisibleFilter(true);
                break;
            case 'sorting':
                setModalVisibleSorting(true);
                break;
            default:
                break;
        }
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

        setProduct([]);

        setApiUrl(MyAPI.filter_product);

        setValue('searchText', 'FILTER ON', true);

        setModalVisibleFilter(false);

        var numeric_array = new Array();
        for (var items in filter_option) {
            numeric_array.push(filter_option[items]);
        }

        setValue('filters', numeric_array, true);

        fetchData(0,
                  MyConfig.ListLimit.searchList,
                  false,
                  true,
                  false,
                  MyConstant.DataSetType.fresh,
                  MyAPI.filter_product,
                  null,
                  numeric_array,
        );
    }

    const onModalItem = (item: any, key: string) => {

        switch (key) {
            case 'sorting':
                setModalVisibleSorting(false);

                fetchData(0,
                          MyConfig.ListLimit.productList,
                          MyLANG.PleaseWait + '...',
                          true,
                          false,
                          MyConstant.DataSetType.fresh,
                          ApiUrl,
                          item
                );
                break;

            default:
                break;
        }

        setValue(key, item, false);
    }

    return (
        <Fragment>
            <HeaderInputProductSearch
                allowSearch = {ApiUrl === MyAPI.wishlist ? false : true}
                showBackButton = {ApiUrl === MyAPI.wishlist ? false : true}
                title = {ApiUrl === MyAPI.wishlist ? null : route.params.title}
                onChangeText = {(text: any) => onChangeText(text)}
                onSubmitEditing = {(text: any) => onSubmitEditing(text)}
                value = {searchText}
                onClearIcon = {() => onClearIcon()}
                onRightIcon = {() => onModalVisible('filter')}
                iconRight = {ApiUrl === MyAPI.wishlist ? null : {fontFamily: 'FontAwesome', name: 'unsorted', style: {}}}
                onIconRight = {() => onModalVisible('sorting')}
                onBack = {() => {
                    MyUtil.stackAction(false,
                                       navigation,
                                       MyConstant.StackAction.pop,
                                       1,
                                       null,
                                       null,
                    );
                }}
            />
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <View style = {[MyStyleSheet.SafeAreaView3, {paddingTop: 0, backgroundColor: MyColor.Material.WHITE}]}>

                    {firstLoad && product?.length === 0 &&
                     <ScrollView
                         contentInsetAdjustmentBehavior = "automatic"
                         contentContainerStyle = {{}}
                     >
                         {ProductListItemContentLoader(8)}
                     </ScrollView>
                    }
                    {
                        (!firstLoad && product?.length === 0 && loading) ?
                        <ListEmptyViewLottie
                            source = {MyImage.lottie_searching_file}
                            message = {MyLANG.WeAreSearching}
                            speed = {0.4}
                            style = {{view: {}, image: {}, text: {}}}
                        />
                                                                         :
                        (!firstLoad) ?
                        <FlatList
                            contentContainerStyle = {{flexGrow: 1}}
                            refreshControl = {
                                <RefreshControl
                                    refreshing = {refreshing}
                                    onRefresh = {onRefresh}
                                    colors = {[MyColor.Primary.first]}
                                />
                            }
                            data = {product}
                            renderItem = {({item, index}: any) =>
                                <ProductListItem
                                    item = {item}
                                    index = {index}
                                />
                            }
                            keyExtractor = {(item: any) => String(item?.id)}
                            ListEmptyComponent = {ListEmptyComponent}
                            ItemSeparatorComponent = {ListItemSeparator}
                            ListFooterComponent = {ListFooterComponent}
                            onEndReachedThreshold = {0.2}
                            onEndReached = {onEndReached}
                            onMomentumScrollBegin = {() => {
                                setOnEndReachedCalledDuringMomentum(false);
                            }}
                        />
                                     :
                        (product === null && (ApiUrl === MyAPI.search || ApiUrl === MyAPI.filter_product)) ?
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
                                    category = {null}
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
                <MyModal
                    visible = {modalVisibleSorting}
                    onRequestClose = {() => setModalVisibleSorting(false)}
                    children = {
                        <ModalNotFullScreen
                            onRequestClose = {() => setModalVisibleSorting(false)}
                            children = {
                                <ModalRadioList
                                    title = {MyLANG.SelectSortType}
                                    selected = {sorting?.id}
                                    onItem = {(item: any) => onModalItem(item, 'sorting')}
                                    items = {MyConfig.sortingTypes}
                                    titleText = "name"
                                    bodyText = "direction"
                                />
                            }
                        />
                    }
                />
            </SafeAreaView>
        </Fragment>
    )
}


ProductListScreen.navigationOptions = {}

export default ProductListScreen;

