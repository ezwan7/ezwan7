import React, {Fragment, useCallback, useEffect, useState} from 'react';

import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    RefreshControl, TouchableOpacity, StyleSheet,
} from 'react-native';
import LinearGradient from "react-native-linear-gradient";

import MyUtil from '../common/MyUtil';
import {MyStyle, MyStyleSheet} from '../common/MyStyle';
import MyColor from '../common/MyColor';
import MyImage from '../shared/MyImage';
import {MyAPI, MyConfig} from '../shared/MyConfig';
import MyLANG from '../shared/MyLANG';
import {MyConstant} from '../common/MyConstant';
import MyIcon from '../components/MyIcon';

import {
    ActivityIndicatorLarge, IconStar,
    ListEmptyViewLottie,
    StatusBarLight
} from '../components/MyComponent';

import {MyButton} from "../components/MyButton";
import {ShadowBox} from "react-native-neomorph-shadows";
import {MyFastImage} from "../components/MyFastImage";

let renderCount = 0;

const ProductBuyScreen = ({route, navigation}: any) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${ProductBuyScreen.name}. renderCount: `, renderCount);
    }

    const [refreshing, setRefreshing] = useState(false);

    const [firstLoad, setFirstLoad] = useState(true);
    const [cart, setCart]: any      = useState([route?.params?.item]);

    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${ProductBuyScreen.name}. useEffect: `, cart);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRefresh = useCallback(() => {
        MyUtil.printConsole(true, 'log', 'LOG: onRefresh: ', {});

        setRefreshing(true);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onBack = () => {
        MyUtil.stackAction(false,
                           null,
                           MyConstant.StackAction.pop,
                           1,
                           {},
                           null
        )
    }

    return (
        <Fragment>
            <StatusBarLight/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView1}/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <View style = {[MyStyleSheet.SafeAreaView3, {paddingTop: 0, backgroundColor: MyColor.Material.WHITE}]}>

                    <ShadowBox
                        useSvg
                        style = {{
                            shadowOffset : {width: 0, height: 2},
                            shadowOpacity: 0.5,
                            shadowColor  : "#000000",
                            shadowRadius : 5,
                            width        : MyStyle.screenWidth,
                            height       : MyStyle.headerHeight,
                            zIndex       : 1000,
                        }}
                    >
                        <LinearGradient
                            start = {MyStyle.LGHeaderPrimary.start}
                            end = {MyStyle.LGHeaderPrimary.end}
                            locations = {MyStyle.LGHeaderPrimary.locations}
                            colors = {MyStyle.LGHeaderPrimary.colors}
                            style = {{
                                flex          : 1,
                                flexDirection : "row",
                                justifyContent: "center",
                                alignItems    : "flex-end",
                            }}
                        >
                            <View style = {{
                                flexGrow      : 1,
                                display       : "flex",
                                flexDirection : "row",
                                justifyContent: "flex-start",
                                alignItems    : "center",

                                marginHorizontal: MyStyle.marginHorizontalPage,
                                marginBottom    : 6,

                                borderWidth      : 1.0,
                                borderRadius     : 50,
                                borderColor      : MyColor.Primary.transparent40,
                                paddingVertical  : 4,
                                paddingHorizontal: 14,
                                backgroundColor  : MyColor.Material.GREY["12"],
                            }}>

                            </View>
                        </LinearGradient>
                    </ShadowBox>

                    <ScrollView
                        contentInsetAdjustmentBehavior = "automatic"
                        refreshControl = {
                            <RefreshControl
                                refreshing = {refreshing}
                                onRefresh = {onRefresh}
                                colors = {[MyColor.Primary.first]}
                            />
                        }
                    >

                        {cart
                            .map((item: any, key: any) => (
                                     <TouchableOpacity
                                         key = {key}
                                         activeOpacity = {0.7}
                                         style = {[productList.touchable, {}]}
                                         onPress = {
                                             () =>
                                                 MyUtil.commonAction(false,
                                                                     null,
                                                                     MyConstant.CommonAction.navigate,
                                                                     MyConfig.routeName.ProductDetails,
                                                                     {'id': item?.id, 'item': item},
                                                                     null
                                                 )
                                         }
                                     >
                                         <View style = {productList.view}>
                                             <MyFastImage
                                                 source = {[{'uri': item.image}, MyImage.defaultItem]}
                                                 style = {productList.image}
                                             />

                                             <View style = {productList.textsView}>
                                                 <Text
                                                     style = {productList.textName}
                                                     numberOfLines = {2}>
                                                     {item?.products_name}
                                                 </Text>
                                                 <View style = {productList.viewPrice}>
                                                     <Text style = {productList.textPrice}
                                                           numberOfLines = {1}>
                                                         {MyConfig.Currency.MYR.symbol}{item?.products_price}
                                                     </Text>
                                                 </View>
                                                 <View style = {productList.viewStock}>
                                                     <Text style = {productList.textStock}>
                                                         {MyLANG.AvailableStock}&nbsp;
                                                         <Text style = {{fontFamily: MyStyle.FontFamily.Roboto.regular}}>
                                                             {Number(item?.products_quantity) > 0 ? item.products_quantity : '0'}
                                                         </Text>
                                                     </Text>
                                                 </View>
                                             </View>

                                             <View style = {productList.viewStepper}>
                                                 <TouchableOpacity
                                                     activeOpacity = {0.5}
                                                 >
                                                     <MyIcon.AntDesign
                                                         name = "caretup"
                                                         size = {12}
                                                         color = "#B7C4CC"
                                                         style = {{}}
                                                     />
                                                 </TouchableOpacity>

                                                 <Text
                                                     style = {productList.textQuantity}
                                                 >
                                                     15
                                                 </Text>
                                                 <MyIcon.AntDesign
                                                     name = "caretdown"
                                                     size = {12}
                                                     color = "#B7C4CC"
                                                     style = {{}}
                                                 />
                                             </View>
                                         </View>
                                     </TouchableOpacity>
                                 )
                            )
                        }

                    </ScrollView>

                    <ShadowBox
                        useSvg
                        style = {{
                            shadowOffset : {width: 0, height: -1},
                            shadowOpacity: 0.2,
                            shadowColor  : "#000000",
                            shadowRadius : 2,
                            height       : 46,
                            width        : MyStyle.screenWidth,
                        }}
                    >
                        <View
                            style = {{
                                flexDirection  : "row",
                                justifyContent : "space-between",
                                alignItems     : "center",
                                backgroundColor: MyColor.Material.WHITE,
                            }}
                        >
                            <MyButton
                                shape = "square"
                                fill = "solid"
                                color = {MyColor.Material.WHITE}
                                shadow = "none"
                                title = {MyLANG.Back}
                                textStyle = {{
                                    fontFamily: MyStyle.FontFamily.Roboto.medium,
                                    fontSize  : 14,
                                    color     : MyColor.Material.GREY["900"]
                                }}
                                iconLeft = {{
                                    fontFamily: MyConstant.VectorIcon.AntDesign,
                                    name      : 'leftcircleo',
                                }}
                                iconLeftStyle = {{color: MyColor.Material.GREY["900"], fontSize: 16}}
                                onPress = {onBack}
                            />
                            <MyButton
                                shape = "square"
                                shadow = "none"
                                title = {MyLANG.NextStep}
                                textStyle = {{
                                    fontFamily: MyStyle.FontFamily.Roboto.medium,
                                    fontSize  : 14,
                                }}
                                onPress = {() => ''}
                            />
                        </View>
                    </ShadowBox>

                </View>
            </SafeAreaView>
        </Fragment>
    )
}

ProductBuyScreen.navigationOptions = {};

const productList = StyleSheet.create(
    {
        touchable: {},
        view     : {
            display         : 'flex',
            flexDirection   : 'row',
            justifyContent  : 'flex-start',
            marginHorizontal: MyStyle.marginHorizontalList,
            marginVertical  : MyStyle.marginVerticalList,
        },
        image    : {
            ...MyStyleSheet.imageListMedium,
        },
        textsView: {
            display       : 'flex',
            flexDirection : 'column',
            justifyContent: 'flex-start',
            alignItems    : "flex-start",

            flex: 1,

            marginHorizontal: MyStyle.marginHorizontalTextsView,
        },
        textName : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 14,
            color     : MyColor.Material.BLACK,
        },

        viewPrice: {
            display       : "flex",
            flexDirection : "row",
            justifyContent: "flex-start",
            alignItems    : "center",
            marginTop     : 4,
        },
        textPrice: {
            fontFamily: MyStyle.fontFamilyPrice,
            fontSize  : 19,
            color     : MyColor.Primary.first,
        },

        viewStock: {
            display       : "flex",
            flexDirection : "row",
            justifyContent: "flex-start",
            alignItems    : "center",
            marginTop     : 8,
        },
        textStock: {
            fontFamily: MyStyle.FontFamily.OpenSans.light,
            fontSize  : 13,
            color     : MyColor.Material.GREY["700"],
        },

        viewStepper : {
            display       : 'flex',
            flexDirection : 'column',
            justifyContent: 'space-between',
            alignItems    : 'center',

            height           : MyStyle.screenWidth * 0.25,
            backgroundColor  : '#F7F8FA',
            borderWidth      : 1,
            borderColor      : '#D6DBDF',
            borderRadius     : 80 / 2,
            paddingVertical  : 7,
            paddingHorizontal: 5,
        },
        textQuantity: {
            fontFamily: MyStyle.FontFamily.OpenSans.semiBold,
            fontSize  : 14,
            color     : MyColor.Material.BLACK,
        }
    }
);
export default ProductBuyScreen;

