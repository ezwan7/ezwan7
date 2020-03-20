import React from 'react';

import {Image, ImageBackground, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Component} from "react";
import FastImage from "react-native-fast-image";
import ContentLoader, {Rect} from "react-content-loader/native";
import LinearGradient from "react-native-linear-gradient";

import {MyStyle} from "../common/MyStyle";
import MyColor from "../common/MyColor";
import MyUtil from "../common/MyUtil";
import {MyConstant} from "../common/MyConstant";
import MyImage from "../shared/MyImage";
import {MyConfig, MyAPI} from "../shared/MyConfig";
import MyIcon from "../components/MyIcon";
import {DrawerContentScrollView, DrawerItemList} from "@react-navigation/drawer";
import MyLANG from "./MyLANG";

// const MaterialTopTabBarComponent = (props: any) => (<MaterialTopTabBar {...props} />);

const CustomDrawerContent = (props: any) => {
    return (
        <DrawerContentScrollView style = {customDrawer.scrollView} {...props}>
            <View>
                <Text>Hello</Text>
            </View>
            <DrawerItemList style = {customDrawer.itemList} {...props} />
        </DrawerContentScrollView>
    )
}

const ListItemSeparator = () => {
    return (
        <View style = {styles.itemSeparator}/>
    )
}

//
const CategoryListItem              = ({item, index}: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: CategoryListItem: ', {index, item});

    return (
        <TouchableOpacity activeOpacity = {0.7}
                          style = {[categoryList.touchable, {marginTop: (index === 0) ? MyStyle.HeaderHeight + 10 : null}]}
                          onPress = {() =>
                              MyUtil.reactNavigate(MyConfig.routeName.ProductList,
                                                   {'id': item?.id, 'item': item},
                                                   null
                              )
                          }
        >
            <ImageBackground source = {item['image'] ? {'uri': MyConfig.serverUrl + item['image']} : MyImage.defaultItem}
                             resizeMode = "cover"
                             style = {[categoryList.imageBackground]}
                             imageStyle = {{borderRadius: 8}}
            >
                <View style = {categoryList.tint}>
                    <Text style = {[categoryList.textTitle, {textAlign: (index % 2 === 0) ? 'right' : 'left'}]}>{item['categories_name']}</Text>
                    <Text style = {[categoryList.textCount, {textAlign: (index % 2 === 0) ? 'right' : 'left'}]}>{item['total_products']} {MyLANG.products}</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    )
}
const ContentLoaderCategoryListItem = (count: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: ContentLoaderCategoryListItem: ', '');

    return (
        <>
            {Array(count)
                .fill('')
                .map((prop, key) => (
                         <View key = {key}
                               style = {{marginTop: (key === 0) ? MyStyle.HeaderHeight : null}}>
                             <ContentLoader
                                 speed = {2}
                                 width = {MyStyle.screenWidth}
                                 height = {140}
                                 viewBox = {'0 ' + '0 ' + (MyStyle.screenWidth) + ' ' + (140)}
                                 backgroundColor = {MyColor.Material.GREY["200"]}
                                 foregroundColor = {MyColor.Material.GREY["400"]}
                                 style = {{marginVertical: 14, marginHorizontal: 12}}
                             >
                                 <Rect x = "0"
                                       y = "0"
                                       rx = "8"
                                       ry = "8"
                                       width = {MyStyle.screenWidth - 12 - 12}
                                       height = {140}/>

                             </ContentLoader>
                         </View>
                     )
                )
            }
        </>
    )

    // return ContentLoaderRestaurantItem(MyConfig.ListLimit.RestaurantHome);
}

const ProductListItem              = ({item, index}: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: ProductListItem: ', {index, item});

    return (
        <TouchableOpacity activeOpacity = {0.7}
                          style = {[productList.touchable, {marginTop: (index === 0) ? MyStyle.HeaderHeight : null}]}
                          onPress = {() => ''}
        >
            <View style = {productList.view}>
                <FastImage source = {item['products_image'] ? {'uri': item['products_image']} : MyImage.defaultItem}
                           resizeMode = {FastImage.resizeMode.contain}
                           style = {productList.image}
                />
                <View style = {productList.textsView}>
                    <Text style = {productList.textName}
                          numberOfLines = {2}>{item['products_name']}</Text>

                    <View style = {{
                        display       : "flex",
                        flexDirection : "row",
                        justifyContent: "flex-start",
                        alignItems    : "center",
                        marginTop     : 4,
                    }}>
                        <MyIcon.FontAwesome
                            name = "star"
                            size = {12}
                            color = {MyColor.Material.YELLOW['600']}
                            style = {{marginRight: 6}}
                        />
                        <Text style = {productList.textRating}>{item['rating'] > 0 ? item['rating'] : '0'}</Text>
                    </View>

                    <View style = {{
                        display       : "flex",
                        flexDirection : "row",
                        justifyContent: "flex-start",
                        alignItems    : "center",
                        marginTop     : 6,
                    }}>
                        <MyIcon.SimpleLineIcons
                            name = "drawer"
                            size = {12}
                            color = {MyColor.Material.GREY["600"]}
                            style = {{marginRight: 6}}
                        />
                        <Text style = {productList.textQuantity}>
                            Available Stock {item['products_quantity'] > 0 ? item['products_quantity'] : '0'}
                        </Text>
                    </View>

                    <View style = {{
                        display       : "flex",
                        flexDirection : "row",
                        justifyContent: "flex-start",
                        alignItems    : "center",
                        marginTop     : 6,
                    }}>
                        <MyIcon.MaterialCommunityIcons
                            name = "cash-usd"
                            size = {14}
                            color = {MyColor.Primary.first}
                            style = {{marginRight: 4}}
                        />
                        <Text style = {productList.textPrice}
                              numberOfLines = {1}>
                            {MyConfig.Currency.MYR.symbol} {item['products_price']}
                        </Text>
                    </View>

                </View>
            </View>
        </TouchableOpacity>
    )
}
const ContentLoaderProductListItem = (count: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: ContentLoaderProductListItem: ', '');

    return (
        <>
            {Array(count)
                .fill('')
                .map((prop, key) => (
                         <View key = {key}
                               style = {{marginTop: (key === 0) ? MyStyle.HeaderHeight : null}}>
                             <ListItemSeparator/>
                             <ContentLoader
                                 speed = {2}
                                 width = {MyStyle.screenWidth}
                                 height = {MyStyle.screenWidth * 0.22}
                                 viewBox = {'0 ' + '0 ' + (MyStyle.screenWidth) + ' ' + (MyStyle.screenWidth * 0.22)}
                                 backgroundColor = {MyColor.Material.GREY["200"]}
                                 foregroundColor = {MyColor.Material.GREY["400"]}
                                 style = {{marginVertical: 12, marginHorizontal: 14}}
                             >
                                 <Rect x = "0"
                                       y = "0"
                                       rx = "3"
                                       ry = "3"
                                       width = {MyStyle.screenWidth * 0.22}
                                       height = {MyStyle.screenWidth * 0.22}/>
                                 <Rect x = {(MyStyle.screenWidth * 0.22) + 10}
                                       y = {6}
                                       rx = "3"
                                       ry = "3"
                                       width = {MyStyle.screenWidth - ((MyStyle.screenWidth * 0.22) + 10 + 8 + 24 + 20)}
                                       height = "12"/>
                                 <Rect x = {(MyStyle.screenWidth * 0.22) + 10}
                                       y = {6 + 12 + 10}
                                       rx = "3"
                                       ry = "3"
                                       width = {MyStyle.screenWidth - ((MyStyle.screenWidth * 0.22) + 10 + 8 + 16 + 40 + 50)}
                                       height = "9"/>
                                 <Rect x = {(MyStyle.screenWidth * 0.22) + 10}
                                       y = {6 + 12 + 10 + 9 + 12}
                                       rx = "3"
                                       ry = "3"
                                       width = {MyStyle.screenWidth - ((MyStyle.screenWidth * 0.22) + 10 + 8 + 16 + 60 + 70)}
                                       height = "10"/>
                                 <Rect x = {(MyStyle.screenWidth * 0.22) + 10}
                                       y = {6 + 12 + 10 + 9 + 12 + 12 + 12}
                                       rx = "3"
                                       ry = "3"
                                       width = {MyStyle.screenWidth - ((MyStyle.screenWidth * 0.22) + 10 + 8 + 16 + 24 + 40)}
                                       height = "10"/>
                             </ContentLoader>
                         </View>
                     )
                )
            }
        </>
    )

    // return ContentLoaderRestaurantItem(MyConfig.ListLimit.RestaurantHome);
}


const CategoryHorizontalListItem              = ({item, index}: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: CategoryHorizontalListItem: ', {item});

    return (
        <>{item
            .map((prop: any, key: any) => (
                <TouchableOpacity activeOpacity = {0.7}
                                  style = {[categoryHorizontalList.touchable, {}]}
                                  onPress = {() =>
                                      MyUtil.reactNavigate(MyConfig.routeName.ProductList,
                                                           {'id': prop?.id, 'item': prop},
                                                           null
                                      )
                                  }
                                  key = {key}
                >
                    <View style = {categoryHorizontalList.view}>
                        <View
                            style = {categoryHorizontalList.imageView}>
                            <FastImage source = {prop['icon'] ? {'uri': prop['icon']} : MyImage.defaultItem}
                                       resizeMode = {FastImage.resizeMode.contain}
                                       style = {categoryHorizontalList.image}
                            />
                        </View>
                        <Text
                            numberOfLines = {1}
                            style = {categoryHorizontalList.textName}>
                            {prop['categories_name']}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}
        </>
    )
}
const ContentLoaderCategoryHorizontalListItem = (count: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: ContentLoaderCategoryHorizontalListItem: ', '');

    return (
        <>
            {Array(count)
                .fill('')
                .map((prop, key) => (
                         <View key = {key}
                               style = {{}}>
                             <ContentLoader
                                 speed = {2}
                                 width = {MyStyle.screenWidth * 0.16}
                                 height = {(MyStyle.screenWidth * 0.16) + 10 + 5 + 4 + 7}
                                 viewBox = {'0 ' + '0 ' + (MyStyle.screenWidth * 0.16) + ' ' + ((MyStyle.screenWidth * 0.16) + 10 + 5 + 4 + 7)}
                                 backgroundColor = {MyColor.Material.GREY["200"]}
                                 foregroundColor = {MyColor.Material.GREY["400"]}
                                 style = {{marginHorizontal: 12}}
                             >
                                 <Rect x = "0"
                                       y = "0"
                                       rx = "4"
                                       ry = "4"
                                       width = {MyStyle.screenWidth * 0.16}
                                       height = {MyStyle.screenWidth * 0.16}/>
                                 <Rect x = "4"
                                       y = {(MyStyle.screenWidth * 0.16) + 5 + 4}
                                       rx = "3"
                                       ry = "3"
                                       width = {(MyStyle.screenWidth * 0.16) - 8}
                                       height = "8"/>
                             </ContentLoader>
                         </View>
                     )
                )
            }
        </>
    )
}

const BannerHorizontalListItem          = ({item, index}: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: BannerHorizontalListItem: ', {item});

    return (
        <>{item
            .map((prop: any, key: any) => (
                <TouchableOpacity activeOpacity = {0.8}
                                  style = {[bannerHorizontalList.touchable, {}]}
                                  onPress = {() => ''}
                                  key = {key}
                >
                    <ImageBackground
                        source = {prop['image'] ? {'uri': MyConfig.serverUrl + prop['image']} : MyImage.defaultItem}
                        resizeMode = "cover"
                        style = {bannerHorizontalList.image}
                        imageStyle = {{}}
                    >
                        {prop && prop.title &&
                         <Text
                             numberOfLines = {3}
                             style = {bannerHorizontalList.textName}
                         >
                             {prop?.title}
                         </Text>
                        }
                    </ImageBackground>
                </TouchableOpacity>
            ))}
        </>
    )
}
const ContentLoaderBannerHorizontalList = () => {
    // MyUtil.printConsole(true, 'log', 'LOG: ContentLoaderBannerHorizontalList: ', '');

    return (
        <>
            <View style = {{}}>
                <ContentLoader
                    speed = {2}
                    width = {MyStyle.screenWidth}
                    height = {MyStyle.screenWidth / 2}
                    viewBox = {'0 ' + '0 ' + (MyStyle.screenWidth) + ' ' + (MyStyle.screenWidth / 2)}
                    backgroundColor = {MyColor.Material.GREY["200"]}
                    foregroundColor = {MyColor.Material.GREY["400"]}
                    style = {{}}
                >
                    <Rect x = "0"
                          y = "0"
                          rx = "0"
                          ry = "0"
                          width = {MyStyle.screenWidth}
                          height = {MyStyle.screenWidth / 2}/>
                </ContentLoader>
            </View>
        </>
    )
}

const ProductHorizontalListItem              = ({item, index}: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: ProductHorizontalListItem: ', {item});

    return (
        <>{item
            .map((prop: any, key: any) => (
                <TouchableOpacity activeOpacity = {0.7}
                                  style = {[productHorizontalList.touchable, {}]}
                                  onPress = {() => ''}
                                  key = {key}
                >
                    <View style = {productHorizontalList.view}>
                        <FastImage source = {prop['products_image'] ? {'uri': prop['products_image']} : MyImage.defaultItem}
                                   resizeMode = {FastImage.resizeMode.contain}
                                   style = {productHorizontalList.image}
                        />
                        <View style = {productHorizontalList.textsView}>
                            <Text
                                numberOfLines = {2}
                                style = {productHorizontalList.textName}>
                                {prop['products_name']}
                            </Text>
                            <Text
                                numberOfLines = {1}
                                style = {productHorizontalList.textPrice}>
                                {MyConfig.Currency.MYR.symbol} {prop['products_price']}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </>
    )
}
const ContentLoaderProductHorizontalListItem = (count: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: ContentLoaderProductHorizontalListItem: ', count);

    return (
        <>
            {Array(count)
                .fill('')
                .map((prop, key) => (
                         <View key = {key}
                               style = {{}}>
                             <ContentLoader
                                 speed = {2}
                                 width = {MyStyle.screenWidth * 0.35}
                                 height = {(MyStyle.screenWidth * 0.35) + 5 + 20 + 3 + 13 + 5 + 10}
                                 viewBox = {'0 ' + '0 ' + (MyStyle.screenWidth * 0.35) + ' ' + ((MyStyle.screenWidth * 0.35) + 5 + 20 + 3 + 13 + 5 + 10)}
                                 backgroundColor = {MyColor.Material.GREY["200"]}
                                 foregroundColor = {MyColor.Material.GREY["400"]}
                                 style = {{marginHorizontal: 12}}
                             >
                                 <Rect x = "0"
                                       y = "0"
                                       rx = "4"
                                       ry = "4"
                                       width = {MyStyle.screenWidth * 0.35}
                                       height = {MyStyle.screenWidth * 0.35}/>
                                 <Rect x = "4"
                                       y = {(MyStyle.screenWidth * 0.35) + 5}
                                       rx = "3"
                                       ry = "3"
                                       width = {(MyStyle.screenWidth * 0.35) - 8}
                                       height = "20"/>
                                 <Rect x = "6"
                                       y = {(MyStyle.screenWidth * 0.35) + 5 + 20 + 3 + 10}
                                       rx = "3"
                                       ry = "3"
                                       width = {(MyStyle.screenWidth * 0.35) - 18}
                                       height = "13"/>
                             </ContentLoader>
                         </View>
                     )
                )
            }
        </>
    )
}


//
const RestaurantListItem          = ({item}: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: restaurantListItem: ', '');

    return (
        <View style = {restaurantItem.view}>
            <FastImage source = {item['photo'] ? {'uri': MyAPI.imgRestaurant + item['photo']} : MyImage.defaultItem}
                       resizeMode = {FastImage.resizeMode.contain}
                       style = {restaurantItem.image}/>
            <View style = {restaurantItem.textsView}>
                <Text style = {restaurantItem.textName}
                      numberOfLines = {1}>{item['name']}</Text>
                <Text style = {restaurantItem.textAddress}
                      numberOfLines = {1}>{item['address']}</Text>

                <View style = {restaurantItem.descView}>

                    <View style = {{
                        display       : "flex",
                        flexDirection : "row",
                        justifyContent: "space-between",
                        alignItems    : "center"
                    }}>
                        <MyIcon.FontAwesome
                            name = "star"
                            size = {12}
                            color = {MyColor.Material.YELLOW['600']}
                            style = {{marginRight: 4}}
                        />
                        <Text style = {restaurantItem.textRating}>{item['rating_text'] > 0 ? item['rating_text'] : '0'}</Text>
                        {/*<NumberFormat value={item['rating']} defaultValue={0} displayType={'text'} thousandSeparator={true}
                                          decimalScale={1} fixedDecimalScale={true} decimalSeparator={'.'}
                                          renderText={value => <Text style={restaurantItem.textRating}>{value}</Text>}
                            />*/}
                    </View>

                    <View style = {{
                        flexDirection : "row",
                        justifyContent: "space-between",
                        alignItems    : "center"
                    }}>
                        <MyIcon.AntDesign
                            name = "clockcircleo"
                            size = {12}
                            color = {MyColor.Material.GREY["950"]}
                            style = {{marginRight: 4}}
                        />
                        <Text style = {restaurantItem.textDuration}>
                            {item['duration']}
                        </Text>

                        <MyIcon.Octicons
                            name = "primitive-dot"
                            size = {6}
                            color = {MyColor.Material.GREY["950"]}
                            style = {{marginRight: 4, marginLeft: 6}}
                        />
                        <Text style = {restaurantItem.textDuration}>
                            {item['distance']}
                        </Text>
                    </View>

                    <View style = {{
                        flexDirection : "row",
                        justifyContent: "space-between",
                        alignItems    : "center"
                    }}>
                        <MyIcon.FontAwesome
                            name = "motorcycle"
                            size = {12}
                            color = {MyColor.Material.GREY["950"]}
                            style = {{marginRight: 4}}
                        />
                        <Text
                            style = {restaurantItem.textDeliveryCharge}>{MyConfig.Currency.BDT.symbol} {item['delivery_charge']}
                        </Text>
                        {/*<NumberFormat value={item['delivery_charge']} displayType={'text'} thousandSeparator={true}
                                          decimalScale={2} fixedDecimalScale={true} decimalSeparator={'.'}
                                          renderText={value => <Text
                                              style={restaurantItem.textDeliveryCharge}>{MyConfig.Currency.BDT.symbol} {value}</Text>}
                            />*/}
                    </View>

                </View>
                <View style = {restaurantItem.timesView}>
                    {/*<Text style={restaurantItem.textOpeningTime}>{MyUtil.momentFormat(item['opening_time'], MyConstant.MomentFormat["08:30pm"], MyConstant.MomentFormat["23:00:00"])}</Text>*/}
                    <Text style = {restaurantItem.textOpeningTime}>{item['opening_time_text']}</Text>
                    <Text style = {restaurantItem.textTimeDash}>-</Text>
                    <Text style = {restaurantItem.textClosingTime}>{item['closing_time_text']}</Text>
                </View>

                {/*<View style={{
                        flexDirection : "row",
                        justifyContent: "flex-start",
                        alignItems    : "center",
                        marginTop     : 6,
                    }}>
                        <MyIcon.SimpleLineIcons
                            name='tag'
                            size={12}
                            color={MyColor.Material.RED['A200']}
                            style={{marginRight: 4}}
                        />
                        <Text style={restaurantItem.textDiscount} numberOfLines={1}>15% Discounts on All Times, Only for
                            Today and Tomorrow and Day After Tomorrow</Text>
                    </View>*/}

            </View>
        </View>
    )
}
const ContentLoaderRestaurantItem = (count: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: ContentLoaderRestaurantItem: ', '');

    return (
        <>
            {Array(count)
                .fill('')
                .map((prop, key) => (
                         <View key = {key}>
                             <ListItemSeparator/>
                             <ContentLoader
                                 speed = {2}
                                 width = {MyStyle.screenWidth}
                                 height = {MyStyle.screenWidth * 0.22}
                                 viewBox = {'0 ' + '0 ' + (MyStyle.screenWidth) + ' ' + (MyStyle.screenWidth * 0.22)}
                                 backgroundColor = {MyColor.Material.GREY["200"]}
                                 foregroundColor = {MyColor.Material.GREY["400"]}
                                 style = {{marginVertical: 12, marginHorizontal: 16}}
                             >
                                 <Rect x = "0"
                                       y = "0"
                                       rx = "3"
                                       ry = "3"
                                       width = {MyStyle.screenWidth * 0.22}
                                       height = {MyStyle.screenWidth * 0.22}/>
                                 <Rect x = {(MyStyle.screenWidth * 0.22) + 10}
                                       y = {6}
                                       rx = "3"
                                       ry = "3"
                                       width = {MyStyle.screenWidth - ((MyStyle.screenWidth * 0.22) + 10 + 8 + 24)}
                                       height = "12"/>
                                 <Rect x = {(MyStyle.screenWidth * 0.22) + 10}
                                       y = {6 + 12 + 10}
                                       rx = "3"
                                       ry = "3"
                                       width = {MyStyle.screenWidth - ((MyStyle.screenWidth * 0.22) + 10 + 8 + 16 + 40)}
                                       height = "9"/>
                                 <Rect x = {(MyStyle.screenWidth * 0.22) + 10}
                                       y = {6 + 12 + 10 + 9 + 12}
                                       rx = "3"
                                       ry = "3"
                                       width = {MyStyle.screenWidth - ((MyStyle.screenWidth * 0.22) + 10 + 8 + 16 + 60)}
                                       height = "10"/>
                                 <Rect x = {(MyStyle.screenWidth * 0.22) + 10}
                                       y = {6 + 12 + 10 + 9 + 12 + 12 + 12}
                                       rx = "3"
                                       ry = "3"
                                       width = {MyStyle.screenWidth - ((MyStyle.screenWidth * 0.22) + 10 + 8 + 16 + 24)}
                                       height = "10"/>
                             </ContentLoader>
                         </View>
                     )
                )
            }
        </>
    )

    // return ContentLoaderRestaurantItem(MyConfig.ListLimit.RestaurantHome);
}


export {
    CustomDrawerContent,
    ListItemSeparator,

    CategoryListItem,
    ContentLoaderCategoryListItem,
    ProductListItem,
    ContentLoaderProductListItem,

    CategoryHorizontalListItem,
    ContentLoaderCategoryHorizontalListItem,
    ProductHorizontalListItem,
    ContentLoaderProductHorizontalListItem,
    BannerHorizontalListItem,
    ContentLoaderBannerHorizontalList,

    RestaurantListItem,
    ContentLoaderRestaurantItem,
};

const styles = StyleSheet.create(
    {
        itemSeparator: {
            height         : 1,
            width          : 'auto',
            marginLeft     : 16,
            marginRight    : 16,
            backgroundColor: MyColor.Material.GREY["250"]
        },
    }
);

const customDrawer = StyleSheet.create(
    {
        scrollView: {
            paddingTop: 20,
        },
        itemList  : {}
    }
);

// CUSTOM:
const categoryList = StyleSheet.create(
    {
        touchable      : {
            height          : 140,
            marginVertical  : 14,
            marginHorizontal: 12,
        },
        imageBackground: {
            flex           : 1,
            borderRadius   : 8,
            backgroundColor: MyColor.Material.GREY["100"],
        },
        tint           : {
            width            : '100%',
            flex             : 1,
            display          : "flex",
            flexDirection    : "column",
            justifyContent   : 'center',
            paddingHorizontal: 24,
            borderRadius     : 8,
            backgroundColor  : 'rgba(0,0,0,0.35)',
        },
        textTitle      : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 21,
            color     : MyColor.Material.WHITE,
        },
        textCount      : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 12,
            color     : MyColor.Material.WHITE,

            marginTop: 2,
        },
    }
);

const productList = StyleSheet.create(
    {
        touchable   : {},
        view        : {
            display         : 'flex',
            flexDirection   : 'row',
            justifyContent  : 'flex-start',
            alignItems      : 'center',
            marginVertical  : 12,
            marginHorizontal: 14,
        },
        image       : {
            width       : MyStyle.screenWidth * 0.22,
            height      : MyStyle.screenWidth * 0.22,
            borderRadius: 3,

            backgroundColor: MyColor.Material.GREY["100"],
        },
        textsView   : {
            display       : 'flex',
            flexDirection : 'column',
            justifyContent: 'flex-start',

            flex: 1,

            marginLeft : 10,
            marginRight: 8,
        },
        textName    : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 13,
            color     : MyColor.Material.BLACK,
        },
        textRating  : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 12,
            color     : MyColor.Material.GREY["700"],
        },
        textQuantity: {
            fontFamily: MyStyle.FontFamily.Exo2.light,
            fontSize  : 12,
            color     : MyColor.Material.GREY["700"],
        },
        textPrice   : {
            fontFamily: MyStyle.FontFamily.TitilliumWeb.semiBold,
            fontSize  : 13,
            color     : MyColor.Primary.first,
        },
    }
);

const categoryHorizontalList = StyleSheet.create(
    {
        touchable: {},
        view     : {
            display         : "flex",
            flexDirection   : "column",
            justifyContent  : "flex-start",
            alignItems      : "center",
            marginHorizontal: 12,
        },
        imageView: {
            display       : "flex",
            flexDirection : "column",
            justifyContent: "center",
            alignItems    : "center",

            width          : MyStyle.screenWidth * 0.16,
            height         : MyStyle.screenWidth * 0.16,
            borderRadius   : 4,
            backgroundColor: MyColor.Material.GREY["100"],
        },
        image    : {
            width       : (MyStyle.screenWidth * 0.16) - 0,
            height      : (MyStyle.screenWidth * 0.16) - 0,
            borderRadius: 4,
        },
        textName : {
            width            : MyStyle.screenWidth * 0.16,
            paddingHorizontal: 4,
            paddingVertical  : 5,
            fontFamily       : MyStyle.FontFamily.OpenSans.regular,
            fontSize         : 11,
            color            : MyColor.Material.BLACK,
            textAlign        : "center",
        },
    }
);

const productHorizontalList = StyleSheet.create(
    {
        touchable: {},
        view     : {
            display         : "flex",
            flexDirection   : "column",
            justifyContent  : "flex-start",
            alignItems      : "center",
            marginHorizontal: 12,
        },
        image    : {
            width          : MyStyle.screenWidth * 0.35,
            height         : MyStyle.screenWidth * 0.35,
            borderRadius   : 4,
            backgroundColor: MyColor.Material.GREY["100"],
        },
        textsView: {},
        textName : {
            width            : MyStyle.screenWidth * 0.35,
            paddingTop       : 5,
            paddingBottom    : 3,
            paddingHorizontal: 2,
            fontFamily       : MyStyle.FontFamily.OpenSans.regular,
            fontSize         : 12,
            color            : MyColor.Material.BLACK,

            height: 40,
        },
        textPrice: {
            width            : MyStyle.screenWidth * 0.35,
            paddingBottom    : 5,
            paddingHorizontal: 2,
            fontFamily       : MyStyle.FontFamily.TitilliumWeb.semiBold,
            fontSize         : 13,
            color            : MyColor.Primary.first,
        },
    }
);

const bannerHorizontalList = StyleSheet.create(
    {
        touchable: {},
        view     : {},
        image    : {
            display       : "flex",
            flexDirection : "column",
            justifyContent: "flex-end",
            alignItems    : "flex-end",

            width          : MyStyle.screenWidth,
            height         : MyStyle.screenWidth / 2,
            backgroundColor: MyColor.Material.GREY["100"],
        },
        textName : {
            width            : MyStyle.screenWidth * 0.45,
            paddingVertical  : 20,
            paddingHorizontal: 20,
            fontFamily       : MyStyle.FontFamily.OpenSans.semiBold,
            fontSize         : 15,
            color            : MyColor.Material.WHITE,
            textAlign        : "right",
        },
    }
);

//
const restaurantItem = StyleSheet.create(
    {
        view     : {
            display         : 'flex',
            flexDirection   : 'row',
            justifyContent  : 'flex-start',
            marginVertical  : 12,
            marginHorizontal: 16,
        },
        image    : {
            width       : MyStyle.screenWidth * 0.22,
            height      : MyStyle.screenWidth * 0.22,
            borderRadius: 3,

            backgroundColor: MyColor.Material.GREY["100"],
        },
        textsView: {
            display       : 'flex',
            flexDirection : 'column',
            justifyContent: 'flex-start',

            flex: 1,

            marginLeft : 10,
            marginRight: 8,
        },
        descView : {
            display       : 'flex',
            flexDirection : 'row',
            justifyContent: 'space-between',

            marginTop: 8,
        },
        timesView: {
            display       : 'flex',
            flexDirection : 'row',
            justifyContent: 'flex-start',

            marginTop: 8,
        },

        textName   : {
            fontFamily: MyStyle.FontFamily.OpenSans.bold,
            fontSize  : 15,
            color     : MyColor.Material.GREY["950"],
        },
        textAddress: {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 11,
            color     : MyColor.Material.GREY["550"],

            marginTop: 1,
        },

        textRating        : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 12,
            color     : MyColor.Material.GREY["950"],
        },
        textDuration      : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 12,
            color     : MyColor.Material.GREY["950"],
        },
        textDistance      : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 12,
            color     : MyColor.Material.GREY["950"],
        },
        textDeliveryCharge: {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 12,
            color     : MyColor.Material.GREY["950"],
        },

        textOpeningTime: {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 11,
            color     : MyColor.Material.GREY["700"],
        },
        textTimeDash   : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 11,
            color     : MyColor.Material.GREY["700"],

            marginLeft : 5,
            marginRight: 5,
        },
        textClosingTime: {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 11,
            color     : MyColor.Material.GREY["600"],
        },

        textDiscount: {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 11,
            color     : MyColor.Material.GREY["950"],
        },
    }
);
