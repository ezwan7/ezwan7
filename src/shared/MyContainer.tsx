import React from 'react';

import {
    Image,
    ImageBackground,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {Component} from "react";
import ContentLoader, {Rect} from "react-content-loader/native";
import LinearGradient from "react-native-linear-gradient";
import {DrawerContentScrollView, DrawerItemList} from "@react-navigation/drawer";

import MyAuth from "../common/MyAuth";
import {MyStyle, MyStyleSheet} from "../common/MyStyle";
import MyColor from "../common/MyColor";
import MyUtil from "../common/MyUtil";
import {MyConstant} from "../common/MyConstant";
import MyImage from "../shared/MyImage";
import {MyConfig, MyAPI} from "../shared/MyConfig";
import MyIcon from "../components/MyIcon";
import MyLANG from "./MyLANG";
import MyMaterialRipple from "../components/MyMaterialRipple";
import {getMyIcon, IconStar} from "../components/MyComponent";
import {MyFastImage} from "../components/MyFastImage";
import {store} from "../store/MyStore";

// const MaterialTopTabBarComponent = (props: any) => (<MaterialTopTabBar {...props} />);

const drawerItemOnPress = (loginRequired: boolean, navigation: any, actionType: string, routeName: any, params: any, navigationActions: any) => {
    MyUtil.printConsole(true, 'log', 'LOG: drawerItemOnPress: ', {
        'loginRequired'    : loginRequired,
        // 'navigation'       : navigation,
        'actionType'       : actionType,
        'routeName'        : routeName,
        'params'           : params,
        'navigationActions': navigationActions,
    });
    if (actionType) {
        switch (actionType) {
            case MyConstant.DrawerOnPress.Navigate:
                MyUtil.commonAction(loginRequired, navigation, MyConstant.CommonAction.navigate, routeName, params, null);
                break;
            case MyConstant.DrawerOnPress.DrawerJump:
                MyUtil.drawerAction(loginRequired, navigation, MyConstant.DrawerAction.jumpTo, routeName, null, null);
                break;
            case MyConstant.DrawerOnPress.TabJump:
                MyUtil.drawerAction(loginRequired, navigation, MyConstant.DrawerAction.closeDrawer, routeName, params, null);
                MyUtil.tabAction(loginRequired, MyConstant.TabAction.jumpTo, routeName, params, null, null);
                break;
            case MyConstant.DrawerOnPress.RateApp:
                MyUtil.drawerAction(loginRequired, navigation, MyConstant.DrawerAction.closeDrawer, routeName, params, null);
                MyUtil.linking(MyConstant.Linking.openURL, MyConfig.android_store_link, MyConstant.SHOW_MESSAGE.TOAST);
                break;
            case MyConstant.DrawerOnPress.ShareApp:
                MyUtil.share(MyConstant.SHARE.TYPE.open,
                             {
                                 message: MyLANG.ShareUs,
                                 subject: MyLANG.AppShare,
                                 url    : MyConfig.android_store_link,
                             },
                             false
                )
                break;
            case MyConstant.DrawerOnPress.PromptLogout:
                MyAuth.showLogoutConfirmation(MyConstant.SHOW_MESSAGE.ALERT,
                                              MyLANG.LogginOut + '...',
                                              true,
                                              null,
                                              MyConstant.NAVIGATION_ACTIONS.GO_BACK
                );
                break;
            default:
                break;
        }
    }
};

const CustomDrawerContent = ({props}: any) => {
    // console.log('test', props?.state?.routes[props?.state?.index].name);
    const user = store.getState().auth.user;
    MyUtil.printConsole(true, 'log', 'LOG: CustomDrawerContent: ', {props, user});

    let DrawerItem = [];
    if (user.id) {
        DrawerItem = [
            {
                gradient      : MyStyle.LGDrawerItem,
                gradientActive: MyStyle.LGDrawerItemActive,
                ripple        : MyStyle.MaterialRipple.drawer,
                image         : {src: MyImage.shop},
                icon          : null,
                text          : {text: MyLANG.Home},
                onPress       : {loginRequired: false, actionType: MyConstant.DrawerOnPress.Navigate, routeName: MyConfig.routeName.Home},
            },
            {
                gradient      : MyStyle.LGDrawerItem,
                gradientActive: MyStyle.LGDrawerItemActive,
                ripple        : MyStyle.MaterialRipple.drawer,
                image         : {src: MyImage.bag},
                icon          : null,
                text          : {text: MyLANG.Cart},
                onPress       : {loginRequired: false, actionType: MyConstant.DrawerOnPress.Navigate, routeName: MyConfig.routeName.CartPush},
            },
            {
                gradient      : MyStyle.LGDrawerItem,
                gradientActive: MyStyle.LGDrawerItemActive,
                ripple        : MyStyle.MaterialRipple.drawer,
                image         : {src: MyImage.monitor},
                icon          : null,
                text          : {text: MyLANG.MyOrders},
                onPress       : {loginRequired: true, actionType: MyConstant.DrawerOnPress.Navigate, routeName: MyConfig.routeName.MyOrders},
            },
            {
                gradient      : MyStyle.LGDrawerItem,
                gradientActive: MyStyle.LGDrawerItemActive,
                ripple        : MyStyle.MaterialRipple.drawer,
                image         : {src: MyImage.notification},
                icon          : null,
                text          : {text: MyLANG.Notifications},
                onPress       : {loginRequired: true, actionType: MyConstant.DrawerOnPress.Navigate, routeName: MyConfig.routeName.Notifications},
            },
            {
                gradient      : MyStyle.LGDrawerItem,
                gradientActive: MyStyle.LGDrawerItemActive,
                ripple        : MyStyle.MaterialRipple.drawer,
                image         : {src: MyImage.rate},
                icon          : null,
                text          : {text: MyLANG.RateApp},
                onPress       : {actionType: MyConstant.DrawerOnPress.RateApp},
            },
            {
                gradient      : MyStyle.LGDrawerItem,
                gradientActive: MyStyle.LGDrawerItemActive,
                ripple        : MyStyle.MaterialRipple.drawer,
                image         : {src: MyImage.phone},
                icon          : null,
                text          : {text: MyLANG.ContactUs},
                onPress       : {loginRequired: false, actionType: MyConstant.DrawerOnPress.Navigate, routeName: MyConfig.routeName.ContactUs},
            },
            {
                gradient      : MyStyle.LGDrawerItem,
                gradientActive: MyStyle.LGDrawerItemActive,
                ripple        : MyStyle.MaterialRipple.drawer,
                image         : {src: MyImage.info},
                icon          : null,
                text          : {text: MyLANG.AboutUs},
                onPress       : {loginRequired: false, actionType: MyConstant.DrawerOnPress.Navigate, routeName: MyConfig.routeName.AboutUs},
            },
            {
                gradient      : MyStyle.LGDrawerItem,
                gradientActive: MyStyle.LGDrawerItemActive,
                ripple        : MyStyle.MaterialRipple.drawer,
                image         : {src: MyImage.power_off},
                icon          : null,
                text          : {text: MyLANG.Logout},
                onPress       : {actionType: MyConstant.DrawerOnPress.PromptLogout},
            },
        ];
    } else {
        DrawerItem = [
            {
                gradient      : MyStyle.LGDrawerItem,
                gradientActive: MyStyle.LGDrawerItemActive,
                ripple        : MyStyle.MaterialRipple.drawer,
                image         : {src: MyImage.shop},
                icon          : null,
                text          : {text: MyLANG.Home},
                onPress       : {loginRequired: false, actionType: MyConstant.DrawerOnPress.Navigate, routeName: MyConfig.routeName.Home},
            },
            {
                gradient      : MyStyle.LGDrawerItem,
                gradientActive: MyStyle.LGDrawerItemActive,
                ripple        : MyStyle.MaterialRipple.drawer,
                image         : {src: MyImage.key},
                icon          : null,
                text          : {text: MyLANG.LoginRegister},
                onPress       : {
                    loginRequired: false,
                    actionType   : MyConstant.DrawerOnPress.Navigate,
                    routeName    : MyConfig.routeName.Login,
                    params       : {splash: false}
                },
            },
            {
                gradient      : MyStyle.LGDrawerItem,
                gradientActive: MyStyle.LGDrawerItemActive,
                ripple        : MyStyle.MaterialRipple.drawer,
                image         : {src: MyImage.bag},
                icon          : null,
                text          : {text: MyLANG.Cart},
                onPress       : {loginRequired: false, actionType: MyConstant.DrawerOnPress.Navigate, routeName: MyConfig.routeName.CartPush},
            },
            {
                gradient      : MyStyle.LGDrawerItem,
                gradientActive: MyStyle.LGDrawerItemActive,
                ripple        : MyStyle.MaterialRipple.drawer,
                image         : {src: MyImage.monitor},
                icon          : null,
                text          : {text: MyLANG.MyOrders},
                onPress       : {loginRequired: true, actionType: MyConstant.DrawerOnPress.Navigate, routeName: MyConfig.routeName.MyOrders},
            },
            {
                gradient      : MyStyle.LGDrawerItem,
                gradientActive: MyStyle.LGDrawerItemActive,
                ripple        : MyStyle.MaterialRipple.drawer,
                image         : {src: MyImage.notification},
                icon          : null,
                text          : {text: MyLANG.Notifications},
                onPress       : {loginRequired: true, actionType: MyConstant.DrawerOnPress.Navigate, routeName: MyConfig.routeName.Notifications},
            },
            {
                gradient      : MyStyle.LGDrawerItem,
                gradientActive: MyStyle.LGDrawerItemActive,
                ripple        : MyStyle.MaterialRipple.drawer,
                image         : {src: MyImage.rate},
                icon          : null,
                text          : {text: MyLANG.RateApp},
                onPress       : {actionType: MyConstant.DrawerOnPress.RateApp},
            },
            {
                gradient      : MyStyle.LGDrawerItem,
                gradientActive: MyStyle.LGDrawerItemActive,
                ripple        : MyStyle.MaterialRipple.drawer,
                image         : {src: MyImage.phone},
                icon          : null,
                text          : {text: MyLANG.ContactUs},
                onPress       : {loginRequired: false, actionType: MyConstant.DrawerOnPress.Navigate, routeName: MyConfig.routeName.ContactUs},
            },
            {
                gradient      : MyStyle.LGDrawerItem,
                gradientActive: MyStyle.LGDrawerItemActive,
                ripple        : MyStyle.MaterialRipple.drawer,
                image         : {src: MyImage.info},
                icon          : null,
                text          : {text: MyLANG.AboutUs},
                onPress       : {loginRequired: false, actionType: MyConstant.DrawerOnPress.Navigate, routeName: MyConfig.routeName.AboutUs},
            },
        ];
    }

    return (
        <DrawerContentScrollView
            style = {customDrawer.viewContentScrollView}
            {...props}
        >
            <View style = {customDrawer.viewMain}>
                <TouchableWithoutFeedback
                    onPress = {
                        () => {
                            MyUtil.commonAction(user.id ? true : false,
                                                props.navigation,
                                                MyConstant.CommonAction.navigate,
                                                user.id ? MyConfig.routeName.EditProfile : MyConfig.routeName.Login,
                                                {splash: false},
                                                null
                            );
                        }
                    }
                >
                    <View style = {customDrawer.viewProfileSection}>
                        <View style = {customDrawer.viewImageProfile}>
                            <Image
                                style = {customDrawer.imageProfile}
                                source = {MyImage.defaultAvatar}
                                resizeMode = "contain"
                            />
                        </View>
                        <Text
                            style = {customDrawer.textUserName}
                            numberOfLines = {1}
                        >
                            {user.id ? `${user?.customers_firstname} ${user?.customers_lastname}` : MyLANG.Guest}
                        </Text>
                        <Text
                            style = {customDrawer.textEmail}
                            numberOfLines = {1}
                        >
                            {user.id ? `${user?.email}` : MyLANG.LoginToManageProfile}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>

                <View style = {customDrawer.viewDrawerItemSection}>
                    {DrawerItem.map((prop: any, key: any) => (

                        <LinearGradient
                            key = {key}
                            style = {customDrawer.linearGradientStyles}
                            {...prop[prop.text?.text === 'Home' ? 'gradientActive' : 'gradient']}

                        >
                            <MyMaterialRipple
                                style = {customDrawer.materialRipple}
                                {...prop.ripple}
                                onPress = {() =>
                                    drawerItemOnPress(prop.onPress?.loginRequired,
                                                      props.navigation,
                                                      prop.onPress?.actionType,
                                                      prop.onPress?.routeName,
                                                      prop.onPress?.params,
                                                      prop.onPress?.navigationActions,
                                    )
                                }
                            >
                                <View style = {customDrawer.viewItem}>
                                    {prop.image?.src &&
                                     <Image
                                         source = {prop.image?.src || MyImage.defaultAvatar}
                                         resizeMode = "contain"
                                         style = {[customDrawer.imageItem, prop.image?.style]}
                                     />
                                    }
                                    {
                                        prop.icon?.name &&
                                        getMyIcon(
                                            {
                                                fontFamily: prop.icon?.fontFamily || MyConstant.VectorIcon.SimpleLineIcons,
                                                name      : prop.icon?.name,
                                                size      : prop.icon?.size || 28,
                                                style     : [customDrawer.iconItem, prop.icon?.style]
                                            }
                                        )
                                    }
                                    {
                                        prop.text?.text &&
                                        <Text
                                            style = {[customDrawer.textItem, prop.text?.style, prop.text?.text === 'Home' && customDrawer.textItemActive]}
                                            numberOfLines = {1}
                                        >
                                            {prop.text?.text}
                                        </Text>
                                    }
                                </View>
                            </MyMaterialRipple>
                        </LinearGradient>
                    ))
                    }
                </View>
            </View>
            {/*<DrawerItemList style = {customDrawer.itemList} {...props} />*/}
        </DrawerContentScrollView>
    )
}


const ListItemSeparator = () => {
    return (
        <View style = {styles.itemSeparator}/>
    )
}

// Page Layouts:
const CategoryListItem              = ({item, index}: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: CategoryListItem: ', {index, item});

    return (
        <TouchableOpacity
            activeOpacity = {0.7}
            style = {[categoryList.touchable]}
            onPress = {() =>
                MyUtil.commonAction(false,
                                    null,
                                    MyConstant.CommonAction.navigate,
                                    MyConfig.routeName.ProductList,
                                    {'id': item?.id, 'item': item},
                                    null
                )
            }
        >
            <ImageBackground
                source = {item?.image ? {'uri': item.image} : MyImage.defaultItem}
                resizeMode = "cover"
                style = {[categoryList.imageBackground]}
                imageStyle = {{borderRadius: MyStyle.borderRadiusImageListLarge}}
            >
                <View style = {categoryList.tint}>
                    <Text style = {[categoryList.textTitle, {textAlign: (index % 2 === 0) ? 'right' : 'left'}]}>{item['categories_name']}</Text>
                    <Text style = {[categoryList.textCount, {textAlign: (index % 2 === 0) ? 'right' : 'left'}]}>{item['total_products']} {MyLANG.products}</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    )
}
const CategoryListItemContentLoader = (count: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: CategoryListItemContentLoader: ', '');

    return (
        <>
            {Array(count)
                .fill('')
                .map((prop, key) => (
                         <View key = {key}>
                             <ContentLoader
                                 speed = {2}
                                 width = {MyStyle.screenWidth}
                                 height = {140}
                                 viewBox = {'0 ' + '0 ' + (MyStyle.screenWidth) + ' ' + (140)}
                                 backgroundColor = {MyColor.Material.GREY["200"]}
                                 foregroundColor = {MyColor.Material.GREY["400"]}
                                 style = {{marginVertical: MyStyle.marginVerticalList, marginHorizontal: MyStyle.marginHorizontalList}}
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

    // return RestaurantItemContentLoader(MyConfig.ListLimit.RestaurantHome);
}

const ProductListItem              = ({item, index}: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: ProductListItem: ', {index, item});

    return (
        <TouchableOpacity
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

                    <View style = {productList.viewRating}>
                        {
                            Array(5)
                                .fill('')
                                .map((rating: any, key: any) => (
                                         Number(key) < Number(item?.rating) ?
                                         <IconStar
                                             key = {key}
                                             size = {10}
                                             color = {MyColor.Material.YELLOW['600']}
                                             solid
                                             style = {{marginRight: 3}}
                                         /> :
                                         <IconStar
                                             key = {key}
                                             size = {10}
                                             color = {MyColor.Material.YELLOW['200']}
                                             style = {{marginRight: 3}}
                                         />
                                     )
                                )
                        }
                        <Text style = {productList.textRating}>{Number(item?.rating) > 0 ? item.rating : '0'}</Text>
                    </View>

                    <View style = {productList.viewStock}>
                        <MyIcon.SimpleLineIcons
                            name = "layers"
                            size = {12}
                            color = {MyColor.Material.GREY["600"]}
                            style = {{marginRight: 6}}
                        />
                        <Text style = {productList.textStock}>
                            {MyLANG.AvailableStock}&nbsp;
                            <Text style = {{fontFamily: MyStyle.FontFamily.Roboto.regular}}>
                                {Number(item?.products_quantity) > 0 ? item.products_quantity : '0'}
                            </Text>
                        </Text>
                    </View>

                    <View style = {productList.viewPrice}>
                        <MyIcon.MaterialCommunityIcons
                            name = "cash-usd"
                            size = {14}
                            color = {MyColor.Primary.first}
                            style = {{marginRight: 4}}
                        />
                        <Text style = {productList.textPrice}
                              numberOfLines = {1}>
                            {MyConfig.Currency.MYR.symbol}{item?.products_price}
                        </Text>
                    </View>

                </View>
            </View>
        </TouchableOpacity>
    )
}
const ProductListItemContentLoader = (count: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: ProductListItemContentLoader: ', '');

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
                                 style = {{marginVertical: MyStyle.marginVerticalList, marginHorizontal: MyStyle.marginHorizontalList}}
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

    // return RestaurantItemContentLoader(MyConfig.ListLimit.RestaurantHome);
}


// Home Page Layouts:
const CategoryHorizontalListItem              = ({item, index}: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: CategoryHorizontalListItem: ', {item});

    return (
        <>{item
            .map((prop: any, key: any) => (
                <TouchableOpacity
                    key = {key}
                    activeOpacity = {0.7}
                    style = {[categoryHorizontalList.touchable, {}]}
                    onPress = {() =>
                        MyUtil.commonAction(false,
                                            null,
                                            MyConstant.CommonAction.navigate,
                                            MyConfig.routeName.ProductList,
                                            {'id': prop?.id, 'item': prop},
                                            null
                        )
                    }
                >
                    <View style = {categoryHorizontalList.view}>
                        <View
                            style = {categoryHorizontalList.imageView}>
                            <MyFastImage
                                source = {[{'uri': prop?.icon}, MyImage.defaultItem]}
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
const CategoryHorizontalListItemContentLoader = (count: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: CategoryHorizontalListItemContentLoader: ', '');

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
                                 style = {{marginHorizontal: MyStyle.marginHorizontalList}}
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

const ImageSliderBanner              = ({item, index, style}: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: ImageSliderBanner: ', {item, index, style});

    return (
        <>{item
            .map((prop: any, key: any) => (
                <TouchableOpacity
                    key = {key}
                    activeOpacity = {0.9}
                    style = {[bannerHorizontalList.touchable, {}]}
                    onPress = {() =>
                        ''
                    }
                >
                    <ImageBackground
                        source = {prop?.image ? {'uri': prop.image} : MyImage.defaultItem}
                        // defaultSource = {MyImage.defaultItem}
                        resizeMode = "cover"
                        style = {[bannerHorizontalList.image, style]}
                        imageStyle = {{}}
                    >
                        {prop?.title &&
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
const ImageSliderBannerContentLoader = () => {
    // MyUtil.printConsole(true, 'log', 'LOG: ImageSliderBannerContentLoader: ', '');

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
                <TouchableOpacity
                    key = {key}
                    activeOpacity = {0.7}
                    style = {[productHorizontalList.touchable, {}]}
                    onPress = {() => MyUtil.commonAction(false,
                                                         null,
                                                         MyConstant.CommonAction.navigate,
                                                         MyConfig.routeName.ProductDetails,
                                                         {'id': prop?.id, 'item': prop},
                                                         null
                    )}

                >
                    <View style = {productHorizontalList.view}>
                        <MyFastImage
                            source = {[{'uri': prop?.image}, MyImage.defaultItem]}
                            style = {productHorizontalList.image}
                        />
                        <View style = {productHorizontalList.textsView}>
                            <Text
                                numberOfLines = {2}
                                style = {productHorizontalList.textName}>
                                {prop?.products_name}
                            </Text>
                            <Text
                                numberOfLines = {1}
                                style = {productHorizontalList.textPrice}>
                                {MyConfig.Currency.MYR.symbol}{prop?.products_price}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </>
    )
}
const ProductHorizontalListItemContentLoader = (count: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: ProductHorizontalListItemContentLoader: ', count);

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
                                 style = {{marginHorizontal: MyStyle.marginHorizontalList}}
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


// Product Details:
const ProductDetailsContentLoader = () => {
    // MyUtil.printConsole(true, 'log', 'LOG: ProductDetailsContentLoader: ', '');

    return (
        <>
            <View style = {{}}>
                <ContentLoader
                    speed = {2}
                    width = {MyStyle.screenWidth}
                    height = {(MyStyle.screenWidth / 1.5) + 20 + 6 + 22 + 10 + 26 + 22 + 28 + (MyStyle.screenWidth / 1.5)}
                    backgroundColor = {MyColor.Material.GREY["200"]}
                    foregroundColor = {MyColor.Material.GREY["400"]}
                    style = {{}}
                >
                    <Rect
                        x = "0"
                        y = "0"
                        rx = "0"
                        ry = "0"
                        width = {MyStyle.screenWidth}
                        height = {MyStyle.screenWidth / 1.5}
                    />
                    <Rect
                        x = {MyStyle.marginHorizontalPage}
                        y = {(MyStyle.screenWidth / 1.5) + 20}
                        rx = "4"
                        ry = "4"
                        width = {MyStyle.screenWidth - (MyStyle.marginHorizontalPage * 2)}
                        height = "22"
                    />
                    <Rect
                        x = {MyStyle.marginHorizontalPage * 4}
                        y = {(MyStyle.screenWidth / 1.5) + 20 + 6 + 22}
                        rx = "4"
                        ry = "4"
                        width = {MyStyle.screenWidth - (MyStyle.marginHorizontalPage * 8)}
                        height = "26"
                    />
                    <Rect
                        x = {MyStyle.marginHorizontalPage * 3}
                        y = {(MyStyle.screenWidth / 1.5) + 20 + 6 + 22 + 10 + 26}
                        rx = "4"
                        ry = "4"
                        width = {MyStyle.screenWidth - (MyStyle.marginHorizontalPage * 6)}
                        height = "22"
                    />
                    <Rect
                        x = "0"
                        y = {(MyStyle.screenWidth / 1.5) + 20 + 6 + 22 + 10 + 26 + 22 + 28}
                        rx = "0"
                        ry = "0"
                        width = {MyStyle.screenWidth}
                        height = {MyStyle.screenWidth / 1.5}
                    />
                </ContentLoader>
            </View>
        </>
    )
}

//
const RestaurantListItem          = ({item}: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: restaurantListItem: ', '');

    return (
        <View style = {restaurantItem.view}>
            <MyFastImage source = {[{'uri': MyAPI.imgRestaurant + item['photo']}, MyImage.defaultItem]}
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
const RestaurantItemContentLoader = (count: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: RestaurantItemContentLoader: ', '');

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
                                 style = {{marginVertical: MyStyle.marginVerticalList, marginHorizontal: MyStyle.marginHorizontalList}}
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

    // return RestaurantItemContentLoader(MyConfig.ListLimit.RestaurantHome);
}


export {
    CustomDrawerContent,
    ListItemSeparator,

    CategoryListItem,
    CategoryListItemContentLoader,
    ProductListItem,
    ProductListItemContentLoader,

    CategoryHorizontalListItem,
    CategoryHorizontalListItemContentLoader,
    ProductHorizontalListItem,
    ProductHorizontalListItemContentLoader,
    ImageSliderBanner,
    ImageSliderBannerContentLoader,

    ProductDetailsContentLoader,

    RestaurantListItem,
    RestaurantItemContentLoader,
};

const styles = StyleSheet.create(
    {
        itemSeparator: {
            height          : 1,
            width           : 'auto',
            marginHorizontal: MyStyle.marginHorizontalList,
            backgroundColor : MyColor.Material.GREY["250"]
        },
    }
);

const customDrawer = StyleSheet.create(
    {
        viewContentScrollView: {},
        viewMain             : {
            backgroundColor: MyColor.Material.WHITE,
        },

        viewProfileSection: {
            display       : "flex",
            flexDirection : "column",
            justifyContent: "center",
            alignItems    : "flex-start",
            marginVertical: 15,
            marginLeft    : 15,
        },
        viewImageProfile  : {
            width       : 60,
            height      : 60,
            borderRadius: 600,

            backgroundColor: MyColor.Material.GREY["100"],
            marginTop      : 10,
        },
        imageProfile      : {
            width : 60,
            height: 60,

            borderRadius: 600,
        },
        textUserName      : {
            fontFamily: MyStyle.FontFamily.OpenSans.bold,
            fontSize  : 20,
            color     : MyColor.textDarkPrimary,

            marginTop  : 15,
            marginRight: 15,
        },
        textEmail         : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 14,
            color     : MyColor.textDarkSecondary,

            marginTop  : 0,
            marginRight: 15,
        },

        viewDrawerItemSection: {
            marginVertical: 15,
            marginLeft    : 15,
        },
        linearGradientStyles : {
            marginVertical        : 4,
            borderTopLeftRadius   : 3,
            borderBottomLeftRadius: 3,
        },
        materialRipple       : {},

        viewItem      : {
            display       : "flex",
            flexDirection : "row",
            justifyContent: "flex-start",
            alignItems    : "center",

            flexWrap: "wrap",

            marginLeft : 12,
            marginRight: 15,

            paddingVertical: 11,
        },
        iconItem      : {
            color      : MyColor.Material.GREY["700"],
            marginRight: 26,
        },
        imageItem     : {
            width      : 26,
            height     : 26,
            marginRight: 30,
        },
        textItem      : {
            fontFamily: MyStyle.FontFamily.OpenSans.semiBold,
            fontSize  : 13,
            color     : MyColor.Material.GREY["700"],

            textTransform: "uppercase",
        },
        textItemActive: {
            color: MyColor.Material.BLACK,
        },
    }
);

// CUSTOM:
// HOME PAGE:
const categoryHorizontalList = StyleSheet.create(
    {
        touchable: {},
        view     : {
            display         : "flex",
            flexDirection   : "column",
            justifyContent  : "flex-start",
            alignItems      : "center",
            marginHorizontal: MyStyle.marginHorizontalList,
        },
        imageView: {
            display       : "flex",
            flexDirection : "column",
            justifyContent: "center",
            alignItems    : "center",

            ...MyStyleSheet.imageListSmall,
        },
        image    : {
            ...MyStyleSheet.imageListSmall,
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
const bannerHorizontalList   = StyleSheet.create(
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
const productHorizontalList  = StyleSheet.create(
    {
        touchable: {},
        view     : {
            display         : "flex",
            flexDirection   : "column",
            justifyContent  : "flex-start",
            alignItems      : "center",
            marginHorizontal: MyStyle.marginHorizontalList,
        },
        image    : {
            ...MyStyleSheet.imageListLarge,
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
            fontFamily       : MyStyle.fontFamilyPrice,
            fontSize         : 13,
            color            : MyColor.Primary.first,
        },
    }
);

// TAB:
const categoryList = StyleSheet.create(
    {
        touchable      : {
            height          : 140,
            marginHorizontal: MyStyle.marginHorizontalList,
            marginVertical  : MyStyle.marginVerticalList,
        },
        imageBackground: {
            flex           : 1,
            borderRadius   : MyStyle.borderRadiusImageListLarge,
            backgroundColor: MyColor.Material.GREY["100"],
        },
        tint           : {
            width            : '100%',
            flex             : 1,
            display          : "flex",
            flexDirection    : "column",
            justifyContent   : 'center',
            paddingHorizontal: 24,
            borderRadius     : MyStyle.borderRadiusImageListLarge,
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

// PRODUCT LIST PAGE:
const productList = StyleSheet.create(
    {
        touchable: {},
        view     : {
            display         : 'flex',
            flexDirection   : 'row',
            justifyContent  : 'flex-start',
            alignItems      : 'center',
            marginHorizontal: MyStyle.marginHorizontalList,
            marginVertical  : MyStyle.marginVerticalList,
        },
        image    : {
            ...MyStyleSheet.imageList,
        },
        textsView: {
            display       : 'flex',
            flexDirection : 'column',
            justifyContent: 'flex-start',

            flex: 1,

            marginHorizontal: MyStyle.marginHorizontalTextsView,
        },
        textName : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 13,
            color     : MyColor.Material.BLACK,
        },

        viewRating: {
            display       : "flex",
            flexDirection : "row",
            justifyContent: "flex-start",
            alignItems    : "center",
            marginTop     : 4,
        },
        textRating: {
            fontFamily: MyStyle.FontFamily.OpenSans.semiBold,
            fontSize  : 12,
            color     : MyColor.Material.GREY["700"],

            marginLeft: 5,
        },

        viewStock: {
            display       : "flex",
            flexDirection : "row",
            justifyContent: "flex-start",
            alignItems    : "center",
            marginTop     : 6,
        },
        textStock: {
            fontFamily: MyStyle.FontFamily.OpenSans.light,
            fontSize  : 12,
            color     : MyColor.Material.GREY["700"],
        },

        viewPrice: {
            display       : "flex",
            flexDirection : "row",
            justifyContent: "flex-start",
            alignItems    : "center",
            marginTop     : 6,
        },
        textPrice: {
            fontFamily: MyStyle.fontFamilyPrice,
            fontSize  : 13,
            color     : MyColor.Primary.first,
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
            ...MyStyleSheet.imageList,
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
