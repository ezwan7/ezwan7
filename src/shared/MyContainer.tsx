import React, {Fragment} from 'react';

import {
    Image,
    ImageBackground, SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text, TextInput,
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
import {IconStar, StatusBarLight} from "../components/MyComponent";
import {getMyIcon} from "../components/MyIcon";
import {MyFastImage} from "../components/MyFastImage";
import {store} from "../store/MyStore";
import {MyButton} from "../components/MyButton";
import {Shadow} from "react-native-neomorph-shadows";
import NumberFormat from 'react-number-format';
import {MyImageBackground} from "../components/MyImageBackground";
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import HTML from "react-native-render-html";
import {Checkbox} from "react-native-paper";
// const MaterialTopTabBarComponent = (props: any) => (<MaterialTopTabBar {...props} />);

const drawerItemOnPress = (loginRequired: boolean, navigation: any, actionType: string, routeName: any, params: any, navigationActions: any) => {
    MyUtil.printConsole(true, 'log', 'LOG: drawerItemOnPress: ', {
        'loginRequired': loginRequired,
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
                             false,
                             {
                                 message: MyLANG.ShareUs,
                                 subject: MyLANG.AppShare,
                                 url    : MyConfig.android_store_link,
                             },
                             false
                )
                break;
            case MyConstant.DrawerOnPress.PromptLogout:
                MyAuth.showLogoutConfirmation(MyConstant.SHOW_MESSAGE.TOAST,
                                              MyConstant.SHOW_MESSAGE.ALERT,
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
    const user     = store.getState().auth.user;
    const app_info = store.getState().app_info;
    // MyUtil.printConsole(true, 'log', 'LOG: CustomDrawerContent: ', {props, user});

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
                onPress       : {loginRequired: false, actionType: MyConstant.DrawerOnPress.Navigate, routeName: MyConfig.routeName.ProductBuy},
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
                // text          : {text: `${MyLANG.Notifications} ${Number(user?.unread_notifications) > 0 ? user?.unread_notifications : null}`},
                onPress: {loginRequired: true, actionType: MyConstant.DrawerOnPress.Navigate, routeName: MyConfig.routeName.Notifications},
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
                onPress       : {
                    actionType: MyConstant.DrawerOnPress.Navigate,
                    routeName : MyConfig.routeName.InfoPage,
                    params    : {title: MyLANG.ContactUs, text: app_info?.contact_us}
                },
            },
            {
                gradient      : MyStyle.LGDrawerItem,
                gradientActive: MyStyle.LGDrawerItemActive,
                ripple        : MyStyle.MaterialRipple.drawer,
                image         : {src: MyImage.info},
                icon          : null,
                text          : {text: MyLANG.AboutUs},
                onPress       : {
                    actionType: MyConstant.DrawerOnPress.Navigate,
                    routeName : MyConfig.routeName.InfoPage,
                    params    : {title: MyLANG.AboutUs, text: app_info?.about_us}
                },
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
                onPress       : {loginRequired: false, actionType: MyConstant.DrawerOnPress.Navigate, routeName: MyConfig.routeName.ProductBuy},
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
                onPress       : {
                    actionType: MyConstant.DrawerOnPress.Navigate,
                    routeName : MyConfig.routeName.InfoPage,
                    params    : {title: MyLANG.ContactUs, text: app_info?.contact_us}
                },
            },
            {
                gradient      : MyStyle.LGDrawerItem,
                gradientActive: MyStyle.LGDrawerItemActive,
                ripple        : MyStyle.MaterialRipple.drawer,
                image         : {src: MyImage.info},
                icon          : null,
                text          : {text: MyLANG.AboutUs},
                onPress       : {
                    loginRequired: false,
                    actionType   : MyConstant.DrawerOnPress.Navigate,
                    routeName    : MyConfig.routeName.InfoPage,
                    params       : {title: MyLANG.AboutUs, text: app_info?.about_us}
                },
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
                            <MyFastImage
                                source = {[user?.customers_picture?.length > 9 ? {'uri': user?.customers_picture} : MyImage.defaultAvatar, MyImage.defaultAvatar]}
                                style = {customDrawer.imageProfile}
                                resizeMode = "cover"
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

const CartIconWithBadge = (props: any) => {
    const cartCount = store.getState().cart.count;

    // MyUtil.printConsole(true, 'log', 'LOG: CustomDrawerContent: ', {props, user});
    return (
        <View>
            {getMyIcon(
                {
                    fontFamily: props.fontFamily,
                    name      : props.name,
                    color     : props.color,
                    size      : props.size,
                    style     : {}
                })
            }
            {cartCount > 0 && (
                <View
                    style = {{
                        position       : 'absolute',
                        right          : -10,
                        top            : -10,
                        backgroundColor: MyColor.Material.PINK["500"],
                        borderRadius   : 8,
                        width          : 15,
                        height         : 15,
                        justifyContent : 'center',
                        alignItems     : 'center',
                    }}
                >
                    <Text style = {{fontFamily: MyStyle.FontFamily.OpenSans.bold, fontSize: 9, color: MyColor.Material.WHITE}}>
                        {cartCount}
                    </Text>
                </View>
            )}
        </View>
    );

    /*function CartIconWithBadge(props) {
        // You should pass down the badgeCount in some other ways like React Context API, Redux, MobX or event emitters.
        return <IconWithBadge {...props} badgeCount = {3}/>;
    }*/
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
                                    {'title': item?.categories_name, 'id': item?.id, 'apiURL': MyAPI.product_by_category},
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
        <MyMaterialRipple
            style = {productList.materialRipple}
            {...MyStyle.MaterialRipple.drawer}
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
                                             color = {MyColor.Material.GREY['200']}
                                             solid
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
                                {Number(item?.current_stock) > 0 ? item.current_stock : '0'}
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
                              numberOfLines = {1}
                        >
                            {MyConfig.Currency.MYR.symbol} {item?.discount_price ? item?.discount_price : item?.products_price}
                        </Text>
                        {
                            item?.discount_price &&
                            <Text
                                numberOfLines = {1}
                                style = {productList.textPriceDiscounted}
                            >
                                {MyConfig.Currency.MYR.symbol} {item?.products_price}
                            </Text>
                        }
                    </View>

                </View>
            </View>
        </MyMaterialRipple>
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
                                            {'title': prop?.categories_name, 'id': prop?.id, 'apiURL': MyAPI.product_by_category},
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
                                 height = {(MyStyle.screenWidth * 0.16) + 10 + 5 + 4 + 6}
                                 backgroundColor = {MyColor.Material.GREY["200"]}
                                 foregroundColor = {MyColor.Material.GREY["400"]}
                                 style = {{marginHorizontal: MyStyle.marginHorizontalList / 1.7}}
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

const ImageSliderProduct             = ({item, style}: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: ImageSliderProduct: ', {item, style});

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
                    <MyImageBackground
                        source = {[{'uri': prop.image}, MyImage.defaultBanner]}
                        style = {[bannerHorizontalList.image, style]}
                        children = {
                            prop?.title &&
                            <Text
                                numberOfLines = {3}
                                style = {bannerHorizontalList.textName}
                            >
                                {prop?.title}
                            </Text>
                        }
                    />
                </TouchableOpacity>
            ))}
        </>
    )
}
const ImageSliderCounter             = ({count, imageSliderIndex}: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: ImageSliderBanner: ', {item, style});

    return (
        <View style = {[MyStyle.RowCenter, {
            zIndex  : 1000,
            position: "absolute",
            left    : 0,
            right   : 0,
            top     : (MyStyle.screenWidth / 1.5) - 18,
        }]}>
            {
                Number(count) > 0 ? Array(count).fill('').map(
                    (item: any, index: number) => (
                        <MyIcon.MaterialIcons
                            key = {index}
                            name = {index === imageSliderIndex ? "lens" : "panorama-fish-eye"}
                            size = {12}
                            color = {index === imageSliderIndex ? MyColor.Primary.first : MyColor.textDarkPrimary}
                            style = {{marginRight: 5}}
                        />
                    ))
                                  :
                <MyIcon.MaterialIcons
                    name = "lens"
                    size = {12}
                    color = {MyColor.Primary.first}
                    style = {{marginRight: 5}}
                />
            }
        </View>
    )
}
const ImageSliderBanner              = ({item, onPress, resizeMode, style}: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: ImageSliderBanner: ', {item, style});

    return (
        <>{item
            .map((prop: any, key: any) => (
                <TouchableOpacity
                    key = {key}
                    activeOpacity = {0.9}
                    style = {[bannerHorizontalList.touchable, {}]}
                    onPress = {() => onPress(prop)}
                >
                    <MyImageBackground
                        source = {[{'uri': prop.image}, MyImage.defaultBanner]}
                        resizeMode = {resizeMode || "cover"}
                        style = {[bannerHorizontalList.image, style]}
                        children = {
                            prop?.title &&
                            <Text
                                numberOfLines = {3}
                                style = {bannerHorizontalList.textName}
                            >
                                {prop?.title}
                            </Text>
                        }
                    />
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
        <>{
            // item
            //     .map((prop: any, key: any) => (
            <TouchableOpacity
                // key = {key}
                activeOpacity = {0.7}
                style = {[productHorizontalList.touchable, {}]}
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
                <View style = {productHorizontalList.view}>
                    <MyFastImage
                        source = {[{'uri': item?.image}, MyImage.defaultItem]}
                        style = {productHorizontalList.image}
                    />
                    <View style = {productHorizontalList.textsView}>
                        <Text
                            numberOfLines = {2}
                            style = {productHorizontalList.textName}>
                            {item?.products_name}
                        </Text>
                        <View style = {{paddingBottom: 2}}>
                            <Text
                                numberOfLines = {1}
                                style = {productHorizontalList.textPrice}>
                                {MyConfig.Currency.MYR.symbol} {item?.discount_price ? item?.discount_price : item?.products_price}
                            </Text>
                            <Text
                                numberOfLines = {1}
                                style = {productHorizontalList.textPriceDiscounted}
                            >
                                {item?.discount_price ? `${MyConfig.Currency.MYR.symbol} ${item?.products_price}` : ''}
                            </Text>
                        </View>

                    </View>

                </View>
            </TouchableOpacity>
            // ))
        }
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
                                 backgroundColor = {MyColor.Material.GREY["200"]}
                                 foregroundColor = {MyColor.Material.GREY["400"]}
                                 style = {{marginHorizontal: MyStyle.marginHorizontalList / 1.8}}
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
                    height = {(MyStyle.screenWidth / 1.5) + 20 + 6 + 22 + 10 + 26 + 22 + 28 + (MyStyle.screenWidth)}
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
                        height = {MyStyle.screenWidth}
                    />
                </ContentLoader>
            </View>
        </>
    )
}

// Cart Items:
const CartListItem          = (props: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: CartListItem: ', Object.keys(props?.items).length);

    let lastKey: string = Object.keys(props?.items)[Object.keys(props?.items)?.length - 1];

    const isLinked: any = [];

    return (
        <View style = {{marginTop: MyStyle.marginViewGapCardTop, backgroundColor: MyColor.Material.WHITE}}>
            {(props?.items && Object.keys(props?.items).length > 0 && props?.items.constructor === Object) &&
             Object.keys(props?.items)
                   .map((key: string) => (
                            <View
                                key = {key}
                                style = {[cartList.view, {borderBottomColor: key !== lastKey ? MyColor.dividerDark : MyColor.Material.TRANSPARENT}]}
                            >
                                <TouchableOpacity
                                    activeOpacity = {0.7}
                                    onPress = {
                                        () =>
                                            ''
                                    }
                                >
                                    <MyFastImage
                                        source = {[{'uri': props.items[key].item?.image}, MyImage.defaultItem]}
                                        style = {cartList.image}
                                    />
                                </TouchableOpacity>

                                <View style = {cartList.textsView}>
                                    <TouchableOpacity
                                        activeOpacity = {0.7}
                                        onPress = {
                                            () =>
                                                ''
                                        }
                                        style = {{marginBottom: 7}}
                                    >
                                        <Text
                                            style = {cartList.textName}
                                            numberOfLines = {2}>
                                            {props.items[key].item?.products_name}
                                        </Text>

                                        <View style = {MyStyle.RowLeftCenter}>
                                            <Text
                                                numberOfLines = {1}
                                                style = {cartList.textPrice}
                                            >
                                                {MyConfig.Currency.MYR.symbol} {props.items[key].item?.discount_price ? props.items[key].item?.discount_price : props.items[key].item?.products_price}
                                            </Text>
                                            {
                                                props.items[key].item?.discount_price &&
                                                <Text
                                                    numberOfLines = {1}
                                                    style = {cartList.textPriceDiscounted}
                                                >
                                                    {MyConfig.Currency.MYR.symbol} {props.items[key].item?.products_price}
                                                </Text>
                                            }
                                        </View>

                                    </TouchableOpacity>

                                    {props.items[key].item?.attributes?.length > 0 && props.items[key].item.attributes.map(
                                        (attribute: any, i: number) => (attribute?.values?.length > 0 && attribute.values.map(
                                            (item: any, j: number) => (item?.cart_selected === true && (
                                         <View key = {`${i}_${j}`}
                                               style = {[MyStyle.RowLeftCenter, {marginVertical: 2}]}
                                         >
                                             <Text
                                                 style = {[MyStyleSheet.textListItemSubTitle3Alt,
                                                           {
                                                               marginRight: 6,
                                                               flexBasis  : '30%',
                                                               flexGrow   : 0,
                                                           }
                                                 ]}
                                             >
                                                 {attribute.option?.name}
                                             </Text>
                                             <View style = {[MyStyle.RowLeftCenter, {
                                                 backgroundColor  : MyColor.Material.GREY["200"],
                                                 paddingVertical  : 2,
                                                 paddingHorizontal: 10,
                                                 flexGrow         : 0,
                                             }]}>
                                                 <Text style = {[MyStyleSheet.textListItemSubTitle3AltDark, {marginRight: 5}]}>{item.value}</Text>
                                                 {
                                                     (item.price_prefix && item.price) &&
                                                     <Text style = {[MyStyleSheet.textListItemSubTitle3, {}]}>{item.price_prefix} {item.price}</Text>
                                                 }
                                             </View>
                                         </View>
                                     )))))
                                    }

                                    {props.items[key].item?.giftitems?.length > 0 &&
                                     <View style = {[MyStyle.RowLeftCenter, {marginVertical: 6}]}>
                                         <Text
                                             style = {[MyStyleSheet.textListItemSubTitle3Alt,
                                                       {
                                                           marginRight: 6,
                                                           flexBasis  : '30%',
                                                           flexGrow   : 0,
                                                       }
                                             ]}
                                         >
                                             {MyLANG.GiftItem}
                                         </Text>

                                         {
                                             props.items[key].item?.giftitems.map((item: any, i: number) => (item?.cart_selected === true && (
                                                 <View
                                                     key = {`${i}`}
                                                     style = {[MyStyle.RowLeftCenter, {
                                                         backgroundColor  : MyColor.Material.GREY["200"],
                                                         paddingVertical  : 2,
                                                         paddingHorizontal: 10,
                                                         flexGrow         : 0,
                                                     }]}>
                                                     <Text style = {[MyStyleSheet.textListItemSubTitle3AltDark, {marginRight: 5}]}>{item.item_name}</Text>
                                                 </View>
                                             )))
                                         }
                                     </View>
                                    }

                                    {props.items[key].item?.linked?.length > 0 && props.items[key].item.linked.map(
                                        (addon: any, i: number) => (addon?.products?.length > 0 && addon.products.map(
                                            (item: any, j: number) => {

                                                if (isLinked[key]?.[i]) {
                                                } else {
                                                    isLinked[key]    = [];
                                                    isLinked[key][i] = 'false';
                                                }

                                                isLinked[key][i] = ((isLinked[key]?.[i] === 'print' || isLinked[key]?.[i] === 'printed') ? 'printed' : ((item?.cart_selected === true && isLinked[key]?.[i] !== 'printed') ? 'print' : 'false'));

                                                return (item?.cart_selected === true && (
                                                    <View key = {`${i}_${j}`}
                                                          style = {[MyStyle.ColumnCenterLeft, {marginVertical: 4}]}
                                                    >
                                                        {isLinked[key]?.[i] === 'print' &&
                                                         <Text style = {[MyStyleSheet.textListItemSubTitle3Alt, {
                                                             marginTop   : 8,
                                                             marginBottom: 5
                                                         }]}>{addon.subcat_name}</Text>
                                                        }

                                                        <View style = {[{
                                                            backgroundColor  : MyColor.Material.GREY["200"],
                                                            paddingVertical  : 4,
                                                            paddingHorizontal: 12,
                                                        }]}>
                                                            <Text style = {[MyStyleSheet.textListItemSubTitle3AltDark, {}]}>{item.products_name}</Text>
                                                            {
                                                                (Number(item.products_price) > 0) &&
                                                                <Text style = {[MyStyleSheet.textListItemSubTitle3, {}]}>
                                                                    + {MyConfig.Currency.MYR.symbol} {item.products_price}
                                                                </Text>
                                                            }
                                                        </View>
                                                    </View>
                                                ))
                                            }
                                        )))
                                    }

                                    <View style = {cartList.viewStock}>
                                        <View style = {cartList.viewStockText}>
                                            <Text style = {cartList.textStock}>
                                                {MyLANG.AvailableStock}
                                            </Text>
                                            <Text style = {cartList.textStockNumber}>
                                                {Number(props.items[key].item?.current_stock) > 0 ? props.items[key].item.current_stock : '0'}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            activeOpacity = {0.5}
                                            onPress = {() => props.onPressCartItemRemove(key)}
                                        >
                                            <MyIcon.SimpleLineIcons
                                                name = "trash"
                                                size = {18}
                                                color = {MyColor.Material.GREY["500"]}
                                                style = {{paddingHorizontal: 4, paddingVertical: 4}}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style = {cartList.viewStepper}>
                                    <TouchableOpacity
                                        activeOpacity = {0.5}
                                        onPress = {() => props.onPressQuantityIncrement(key)}
                                    >
                                        <MyIcon.AntDesign
                                            name = "caretup"
                                            size = {12}
                                            color = "#B7C4CC"
                                            style = {{paddingVertical: 9, paddingHorizontal: 5}}
                                        />
                                    </TouchableOpacity>

                                    <Text
                                        style = {cartList.textQuantity}
                                    >
                                        {props.items[key].quantity}
                                    </Text>
                                    <TouchableOpacity
                                        activeOpacity = {0.5}

                                        onPress = {() => props.onPressQuantityDecrement(key)}
                                    >
                                        <MyIcon.AntDesign
                                            name = "caretdown"
                                            size = {12}
                                            color = "#B7C4CC"
                                            style = {{paddingVertical: 9, paddingHorizontal: 5}}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                   )
            }
        </View>
    )
}
const CartPageHeader        = (props: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: CartPageHeader: ', props);

    return (
        <Shadow style = {MyStyle.neomorphShadow.header}>
            <LinearGradient
                {...MyStyle.LGHeaderPrimary}
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

                    // borderWidth      : 1.0,
                    // borderRadius     : 50,
                    // borderColor      : MyColor.Primary.transparent40,
                    // paddingVertical  : 4,
                    paddingHorizontal: 14,
                    // backgroundColor  : MyColor.Material.GREY["12"],
                }}>

                </View>
            </LinearGradient>
        </Shadow>
    )
}
const CartPageBottomButtons = (props: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: CartPageBottomButtons: ', props);

    return (
        <Shadow style = {MyStyle.neomorphShadow.buttonBottom}>
            <View
                style = {{
                    flexDirection  : "row",
                    justifyContent : "space-between",
                    alignItems     : "center",
                    backgroundColor: MyColor.Material.WHITE,
                }}
            >
                {props.textBackButton &&
                 <MyButton
                     shape = "square"
                     fill = "solid"
                     color = {MyColor.Material.WHITE}
                     shadow = "none"
                     title = {props.textBackButton}
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
                     onPress = {props.onPressBack}
                 />
                }
                {props.textNextButton &&
                 <MyButton
                     shape = "square"
                     shadow = "none"
                     title = {props.textNextButton}
                     textStyle = {{
                         fontFamily: MyStyle.FontFamily.Roboto.medium,
                         fontSize  : 14,
                     }}
                     onPress = {props.onPressNext}
                 />
                }
            </View>
        </Shadow>
    )
}
const CartPageTotal         = (props: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: CartPageTotal: ', props);

    return (
        <View style = {[cartPageTotal.view, props.style]}>
            <Text style = {[{...MyStyleSheet.headerPage, marginBottom: 8}]}>
                {props.header || MyLANG.PriceBreakdown}
            </Text>
            {
                props.subtotal !== false &&
                <View style = {cartPageTotal.textsView}>
                    <Text style = {cartPageTotal.textTitleBold2}>
                        {MyLANG.Subtotal}
                    </Text>
                    <NumberFormat
                        value = {props.subtotal || props?.cart?.subtotal}
                        defaultValue = {0}
                        displayType = {'text'}
                        thousandSeparator = {true}
                        decimalScale = {2}
                        fixedDecimalScale = {true}
                        decimalSeparator = {'.'}
                        renderText = {
                            (value: any) => <Text style = {cartPageTotal.textAmountBold2}>{MyConfig.Currency.MYR.symbol} {value}</Text>
                        }
                    />
                </View>
            }
            {
                props.discount !== false &&
                <View style = {cartPageTotal.textsView}>
                    <Text style = {cartPageTotal.textTitle}>
                        - {MyLANG.Discount}
                    </Text>
                    <NumberFormat
                        value = {props.discount || props?.cart?.discount}
                        defaultValue = {0}
                        displayType = {'text'}
                        thousandSeparator = {true}
                        decimalScale = {2}
                        fixedDecimalScale = {true}
                        decimalSeparator = {'.'}
                        renderText = {
                            (value: any) => <Text style = {cartPageTotal.textAmount}>{MyConfig.Currency.MYR.symbol} {value}</Text>
                        }
                    />
                </View>
            }
            {
                props.voucher !== false &&
                <View style = {cartPageTotal.textsView}>
                    <Text style = {cartPageTotal.textTitle}>
                        - {MyLANG.Voucher}
                    </Text>
                    <NumberFormat
                        value = {props.voucher || props?.cart?.voucher?.amount}
                        defaultValue = {0}
                        displayType = {'text'}
                        thousandSeparator = {true}
                        decimalScale = {2}
                        fixedDecimalScale = {true}
                        decimalSeparator = {'.'}
                        renderText = {
                            (value: any) => <Text style = {cartPageTotal.textAmount}>{MyConfig.Currency.MYR.symbol} {value}</Text>
                        }
                    />
                </View>
            }
            {
                props.service_charge !== false &&
                <View style = {cartPageTotal.textsView}>
                    <Text style = {cartPageTotal.textTitle}>
                        + {MyLANG.ServiceCharge}
                    </Text>
                    <NumberFormat
                        value = {props.service_charge || props?.cart?.service_charge}
                        defaultValue = {0}
                        displayType = {'text'}
                        thousandSeparator = {true}
                        decimalScale = {2}
                        fixedDecimalScale = {true}
                        decimalSeparator = {'.'}
                        renderText = {
                            (value: any) => <Text style = {cartPageTotal.textAmount}>{MyConfig.Currency.MYR.symbol} {value}</Text>
                        }
                    />
                </View>
            }
            {
                props.delivery_charge !== false &&
                <View style = {cartPageTotal.textsView}>
                    <Text style = {cartPageTotal.textTitle}>
                        + {MyLANG.DeliveryCharge}
                    </Text>
                    <NumberFormat
                        value = {props.delivery_charge || props?.cart?.delivery_charge}
                        defaultValue = {0}
                        displayType = {'text'}
                        thousandSeparator = {true}
                        decimalScale = {2}
                        fixedDecimalScale = {true}
                        decimalSeparator = {'.'}
                        renderText = {
                            (value: any) => <Text style = {cartPageTotal.textAmount}>{MyConfig.Currency.MYR.symbol} {value}</Text>
                        }
                    />
                </View>
            }
            {
                props.tax !== false &&
                <View style = {cartPageTotal.textsView}>
                    <Text style = {cartPageTotal.textTitle}>
                        + {MyLANG.Tax}
                    </Text>
                    <NumberFormat
                        value = {props.tax || props?.cart?.tax}
                        defaultValue = {0}
                        displayType = {'text'}
                        thousandSeparator = {true}
                        decimalScale = {2}
                        fixedDecimalScale = {true}
                        decimalSeparator = {'.'}
                        renderText = {
                            (value: any) => <Text style = {cartPageTotal.textAmount}>{MyConfig.Currency.MYR.symbol} {value}</Text>
                        }
                    />
                </View>
            }
            {
                props.total !== false &&
                <>
                    <View style = {cartPageTotal.divider}></View>
                    <View style = {cartPageTotal.textsView}>
                        <Text style = {cartPageTotal.textTitleBold}>
                            {MyLANG.Total}
                        </Text>
                        <NumberFormat
                            value = {props.total || props?.cart?.total}
                            defaultValue = {0}
                            displayType = {'text'}
                            thousandSeparator = {true}
                            decimalScale = {2}
                            fixedDecimalScale = {true}
                            decimalSeparator = {'.'}
                            renderText = {
                                (value: any) => <Text style = {cartPageTotal.textAmountBold}>{MyConfig.Currency.MYR.symbol} {value}</Text>
                            }
                        />
                    </View>
                </>
            }
            {
                props.installment &&
                <>
                    <View style = {cartPageTotal.textsView}>
                        <Text style = {cartPageTotal.textTitle}>
                            {MyLANG.EMI}
                        </Text>
                        {
                            (props.installment?.months && props.installment?.amount) &&
                            <View style = {MyStyle.RowRightCenter}>
                                <NumberFormat
                                    value = {props.installment?.amount}
                                    defaultValue = {0}
                                    displayType = {'text'}
                                    thousandSeparator = {true}
                                    decimalScale = {2}
                                    fixedDecimalScale = {true}
                                    decimalSeparator = {'.'}
                                    renderText = {
                                        (value: any) => <Text style = {cartPageTotal.textAmount}>{MyConfig.Currency.MYR.symbol} {value}</Text>
                                    }
                                />
                                <Text style = {[cartPageTotal.textTitle, {marginLeft: 5}]}>
                                    {MyLANG.for} {props.installment?.months}
                                </Text>
                            </View>
                        }
                    </View>
                </>
            }
        </View>
    )
}

const CartListItemSmall = (props: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: CartListItemSmall: ', Object.keys(props?.items).length);

    const isLinked: any = [];

    return (
        <>
            {
                (props?.items && Object.keys(props?.items).length > 0 && props?.items.constructor === Object) &&
                Object.keys(props?.items)
                      .map((key: string, index: number) => (
                               <View
                                   key = {key}
                                   style = {[cartListSmall.view, {borderBottomWidth: index === (Object.keys(props?.items).length - 1) ? 0 : 0.9}]}
                               >

                                   <MyFastImage
                                       source = {[{'uri': props.items[key].item?.image}, MyImage.defaultItem]}
                                       style = {cartListSmall.image}
                                   />

                                   <View style = {cartListSmall.textsView}>
                                       <Text
                                           style = {cartListSmall.textName}
                                           numberOfLines = {2}>
                                           {props.items[key].item?.products_name}
                                       </Text>

                                       <View style = {cartListSmall.viewPrice}>
                                           <View style = {MyStyle.RowLeftBottom}>
                                               <Text style = {cartListSmall.textPrice}
                                                     numberOfLines = {1}
                                               >
                                                   {MyConfig.Currency.MYR.symbol} {props.items[key].item?.discount_price ? props.items[key].item?.discount_price : props.items[key].item?.products_price}
                                               </Text>

                                               <Text style = {cartListSmall.textQuantity}
                                                     numberOfLines = {1}
                                               >
                                                   x{props.items[key]?.quantity}
                                               </Text>

                                               {
                                                   props.items[key].item?.discount_price &&
                                                   <Text
                                                       style = {cartListSmall.textPriceDiscounted}
                                                       numberOfLines = {1}
                                                   >
                                                       {MyConfig.Currency.MYR.symbol} {props.items[key].item?.products_price}
                                                   </Text>
                                               }
                                           </View>

                                           <NumberFormat
                                               value = {props.items[key]?.total}
                                               defaultValue = {0}
                                               displayType = {'text'}
                                               thousandSeparator = {true}
                                               decimalScale = {2}
                                               fixedDecimalScale = {true}
                                               decimalSeparator = {'.'}
                                               renderText = {
                                                   (value: any) => <Text style = {cartListSmall.textPriceTotal}>{MyConfig.Currency.MYR.symbol} {value}</Text>
                                               }
                                           />
                                       </View>

                                       <View style = {{marginTop: 5}}>

                                           {props.items[key].item?.attributes?.length > 0 && props.items[key].item.attributes.map(
                                               (attribute: any, i: number) => (attribute?.values?.length > 0 && attribute.values.map(
                                                   (item: any, j: number) => (item?.cart_selected === true && (
                                                <View key = {`${i}_${j}`}
                                                      style = {[MyStyle.RowLeftCenter, {marginVertical: 2}]}
                                                >
                                                    <Text style = {[MyStyleSheet.textListItemSubTitle3Alt,
                                                                    {
                                                                        marginRight: 6,
                                                                        flexBasis  : '27%',
                                                                        flexGrow   : 0,
                                                                    }
                                                    ]}>
                                                        {attribute.option?.name}
                                                    </Text>
                                                    <View style = {[MyStyle.RowLeftCenter, {
                                                        backgroundColor  : MyColor.Material.GREY["200"],
                                                        paddingVertical  : 2,
                                                        paddingHorizontal: 10,
                                                        flexGrow         : 0,
                                                    }]}>
                                                        <Text style = {[MyStyleSheet.textListItemSubTitle3AltDark, {marginRight: 5}]}>
                                                            {item.value}
                                                        </Text>
                                                        {
                                                            (item.price_prefix && item.price) &&
                                                            <Text style = {[MyStyleSheet.textListItemSubTitle3, {}]}>
                                                                {item.price_prefix} {item.price}
                                                            </Text>
                                                        }
                                                    </View>
                                                </View>
                                            )))))
                                           }

                                           {props.items[key].item?.giftitems?.length > 0 &&
                                            <View style = {[MyStyle.RowLeftCenter, {marginVertical: 6}]}>
                                                <Text
                                                    style = {[MyStyleSheet.textListItemSubTitle3Alt,
                                                              {
                                                                  marginRight: 6,
                                                                  flexBasis  : '27%',
                                                                  flexGrow   : 0,
                                                              }
                                                    ]}
                                                >
                                                    {MyLANG.GiftItem}
                                                </Text>

                                                {
                                                    props.items[key].item?.giftitems.map((item: any, i: number) => (item?.cart_selected === true && (
                                                        <View
                                                            key = {`${i}`}
                                                            style = {[MyStyle.RowLeftCenter, {
                                                                backgroundColor  : MyColor.Material.GREY["200"],
                                                                paddingVertical  : 2,
                                                                paddingHorizontal: 10,
                                                                flexGrow         : 0,
                                                            }]}>
                                                            <Text style = {[MyStyleSheet.textListItemSubTitle3AltDark, {marginRight: 5}]}>{item.item_name}</Text>
                                                        </View>
                                                    )))
                                                }
                                            </View>
                                           }

                                           {props.items[key].item?.linked?.length > 0 && props.items[key].item.linked.map(
                                               (addon: any, i: number) => (addon?.products?.length > 0 && addon.products.map(
                                                   (item: any, j: number) => {
                                                       if (isLinked[key]?.[i]) {
                                                       } else {
                                                           isLinked[key]    = [];
                                                           isLinked[key][i] = 'false';
                                                       }

                                                       isLinked[key][i] = ((isLinked[key]?.[i] === 'print' || isLinked[key]?.[i] === 'printed') ? 'printed' : ((item?.cart_selected === true && isLinked[key]?.[i] !== 'printed') ? 'print' : 'false'));

                                                       return (item?.cart_selected === true && (
                                                           <View key = {`${i}_${j}`}
                                                                 style = {[MyStyle.ColumnCenterLeft, {marginVertical: 4}]}
                                                           >
                                                               {isLinked[key]?.[i] === 'print' &&
                                                                <Text style = {[MyStyleSheet.textListItemSubTitle3Alt, {
                                                                    marginTop   : 8,
                                                                    marginBottom: 5
                                                                }]}>{addon.subcat_name}</Text>
                                                               }

                                                               <View style = {[{
                                                                   backgroundColor  : MyColor.Material.GREY["200"],
                                                                   paddingVertical  : 4,
                                                                   paddingHorizontal: 12,
                                                               }]}>
                                                                   <Text style = {[MyStyleSheet.textListItemSubTitle3AltDark, {}]}>{item.products_name}</Text>
                                                                   {
                                                                       (Number(item.products_price) > 0) &&
                                                                       <Text style = {[MyStyleSheet.textListItemSubTitle3, {}]}>
                                                                           + {MyConfig.Currency.MYR.symbol} {item.products_price}
                                                                       </Text>
                                                                   }
                                                               </View>
                                                           </View>
                                                       ))
                                                   }
                                               )))
                                           }
                                       </View>

                                   </View>

                               </View>
                           )
                      )
            }
        </>
    )
}


// Notification List:
const NotificationListItem              = ({item, index}: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: NotificationListItem: ', {index, item});

    return (
        <MyMaterialRipple
            style = {notificationList.materialRipple}
            {...MyStyle.MaterialRipple.drawer}
            onPress = {
                () =>
                    MyUtil.commonAction(false,
                                        null,
                                        MyConstant.CommonAction.navigate,
                                        MyConfig.routeName.NotificationView,
                                        {'title': item?.title, 'id': item?.id, 'item': item},
                                        null
                    )
            }
        >
            <View style = {[notificationList.view, {backgroundColor: item?.read_status === 1 ? MyColor.Material.WHITE : MyColor.Material.GREY["100"]}]}>
                <MyFastImage
                    source = {[item?.image?.length > 0 ? {'uri': item.image} : MyImage.icon_bg, MyImage.icon_bg]}
                    style = {notificationList.image}
                />
                <View style = {notificationList.textsView}>
                    <View>
                        <Text
                            style = {notificationList.textTitle}
                            numberOfLines = {2}>
                            {item?.title}
                        </Text>
                        <Text
                            style = {notificationList.textBody}
                            numberOfLines = {3}>
                            {item?.body}
                        </Text>
                    </View>
                    <Text
                        style = {notificationList.textTime}
                        numberOfLines = {1}>
                        {MyUtil.momentFormat(item?.created_on, MyConstant.MomentFormat["1st Jan, 1970 12:01 am"])}
                    </Text>

                </View>
            </View>
        </MyMaterialRipple>
    )
}
const NotificationListItemContentLoader = (count: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: NotificationListItemContentLoader: ', '');

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
                                 height = {(MyStyle.screenWidth * 0.16)}
                                 backgroundColor = {MyColor.Material.GREY["200"]}
                                 foregroundColor = {MyColor.Material.GREY["400"]}
                                 style = {{marginVertical: MyStyle.marginVerticalList, marginHorizontal: MyStyle.marginHorizontalList}}
                             >
                                 <Rect x = "0"
                                       y = "0"
                                       rx = "100"
                                       ry = "100"
                                       width = {MyStyle.screenWidth * 0.16}
                                       height = {MyStyle.screenWidth * 0.16}/>
                                 <Rect x = {(MyStyle.screenWidth * 0.16) + 10}
                                       y = {6}
                                       rx = "3"
                                       ry = "3"
                                       width = {MyStyle.screenWidth - ((MyStyle.screenWidth * 0.16) + 10 + 15 + 15 + 50)}
                                       height = "10"/>
                                 <Rect x = {(MyStyle.screenWidth * 0.16) + 10}
                                       y = {6 + 10 + 6}
                                       rx = "3"
                                       ry = "3"
                                       width = {MyStyle.screenWidth - ((MyStyle.screenWidth * 0.16) + 10 + 15 + 15 + 100)}
                                       height = "14"/>
                                 <Rect x = {MyStyle.screenWidth - ((MyStyle.screenWidth * 0.35) + 30)}
                                       y = {6 + 10 + 6 + 14 + 15}
                                       rx = "3"
                                       ry = "3"
                                       width = {MyStyle.screenWidth * 0.35}
                                       height = "9"/>
                             </ContentLoader>
                         </View>
                     )
                )
            }
        </>
    )

    // return RestaurantItemContentLoader(MyConfig.ListLimit.RestaurantHome);
}

const NotificationDetailsContentLoader = () => {
    // MyUtil.printConsole(true, 'log', 'LOG: NotificationDetailsContentLoader: ', '');

    return (
        <>
            <View style = {{}}>
                <ContentLoader
                    speed = {2}
                    width = {MyStyle.screenWidth}
                    height = {MyStyle.screenHeight * 0.85}
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
                        y = {(MyStyle.screenWidth / 1.5) + (MyStyle.marginHorizontalPage / 2)}
                        rx = "4"
                        ry = "4"
                        width = {MyStyle.screenWidth - (MyStyle.marginHorizontalPage * 2)}
                        height = "22"
                    />
                    <Rect
                        x = {MyStyle.marginHorizontalPage * 4}
                        y = {(MyStyle.screenWidth / 1.5) + (MyStyle.marginHorizontalPage / 2) + 22 + 10}
                        rx = "4"
                        ry = "4"
                        width = {MyStyle.screenWidth - (MyStyle.marginHorizontalPage * 8)}
                        height = "12"
                    />
                    <Rect
                        x = "0"
                        y = {(MyStyle.screenWidth / 1.5) + 20 + 6 + 22 + 10 + 26 + 20}
                        rx = "4"
                        ry = "4"
                        width = {MyStyle.screenWidth}
                        height = {(MyStyle.screenHeight * 0.50)}
                    />
                </ContentLoader>
            </View>
        </>
    )
}

// Address List:
const AddressListItem              = ({item, onPress, rippleStyle, iconLeft, address_title, phone}: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: AddressListItem: ', {item});

    return (
        <MyMaterialRipple
            style = {[MyStyle.RowLeftCenter, rippleStyle]}
            {...MyStyle.MaterialRipple.drawer}
            onPress = {onPress}
        >
            <MyIcon.SimpleLineIcons
                name = {iconLeft?.name || 'direction'}
                size = {iconLeft?.size || 22}
                color = {MyColor.textDarkSecondary2}
                style = {iconLeft?.style || {alignSelf: "flex-start", marginTop: 4, marginRight: 10, marginLeft: MyStyle.paddingVerticalList}}
            />
            <View style = {[MyStyle.ColumnStart, {flex: 1}]}>
                {address_title ?
                 <>
                     <Text style = {[MyStyleSheet.textListItemTitleAltDark, {}]}>{item?.company}</Text>
                     <Text style = {[MyStyleSheet.textListItemSubTitleAlt, {}]}>{item?.firstname} {item?.lastname}</Text>
                 </>
                               :
                 <Text style = {[MyStyleSheet.textListItemTitleAltDark, {marginBottom: 2}]}>{item?.firstname} {item?.lastname}</Text>
                }
                <Text style = {[MyStyleSheet.textListItemSubTitleAlt, {marginBottom: 4}]}>{phone}</Text>
                <Text style = {MyStyleSheet.textListItemSubTitleAlt}>{item?.street}</Text>
                <Text style = {MyStyleSheet.textListItemSubTitleAlt}>{item?.city_name}</Text>
                <Text style = {MyStyleSheet.textListItemSubTitleAlt}>{item?.zone_name}</Text>
                <Text style = {MyStyleSheet.textListItemSubTitleAlt}>{item?.country_name}</Text>
                <Text style = {MyStyleSheet.textListItemSubTitleAlt}>{item?.postcode}</Text>
            </View>
            <MyIcon.Entypo
                name = "chevron-right"
                size = {20}
                color = {MyColor.Material.GREY["800"]}
                style = {{marginRight: MyStyle.paddingVerticalList}}
            />
        </MyMaterialRipple>
    )
}
const AddressListItemContentLoader = (count: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: AddressListItemContentLoader: ', '');

    return (
        <>
            <ContentLoader
                speed = {2}
                width = {MyStyle.screenWidth}
                height = {50 + MyStyle.marginVerticalList}
                backgroundColor = {MyColor.Material.GREY["200"]}
                foregroundColor = {MyColor.Material.GREY["400"]}
                style = {{marginTop: MyStyle.marginViewGapCardTop}}
            >
                <Rect x = "0"
                      y = "0"
                      rx = "0"
                      ry = "0"
                      width = {MyStyle.screenWidth}
                      height = {50}/>
            </ContentLoader>
            {Array(count)
                .fill('')
                .map((prop, key) => (
                         <View key = {key}
                               style = {{marginBottom: MyStyle.marginViewGapCard}}>
                             <ContentLoader
                                 speed = {2}
                                 width = {MyStyle.screenWidth}
                                 height = {16 + 4 + 165}
                                 backgroundColor = {MyColor.Material.GREY["200"]}
                                 foregroundColor = {MyColor.Material.GREY["400"]}
                             >
                                 <Rect x = {MyStyle.marginHorizontalList}
                                       y = "0"
                                       rx = "3"
                                       ry = "3"
                                       width = {MyStyle.screenWidth * 0.20}
                                       height = "16"/>
                                 <Rect x = {0}
                                       y = {16 + 4}
                                       rx = "0"
                                       ry = "0"
                                       width = {MyStyle.screenWidth}
                                       height = {165}/>
                             </ContentLoader>
                         </View>
                     )
                )
            }
        </>
    )

    // return RestaurantItemContentLoader(MyConfig.ListLimit.RestaurantHome);
}

// MyOrder List:
const OrderListItem              = ({item, index}: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: OrderListItem: ', {index, item});

    return (
        <MyMaterialRipple
            style = {[orderList.materialRipple, index === 0 && {marginTop: MyStyle.marginViewGapCardTop}]}
            {...MyStyle.MaterialRipple.drawer}
            onPress = {
                () =>
                    MyUtil.commonAction(false,
                                        null,
                                        MyConstant.CommonAction.navigate,
                                        MyConfig.routeName.OrderDetails,
                                        {'id': item?.id, 'item': item},
                                        null,
                    )
            }
        >

            <View style = {MyStyle.RowBetweenCenter}>
                <Text style = {MyStyleSheet.textListItemTitleDark}># {MyLANG.Order} {item.id}</Text>
                <Text style = {[MyStyleSheet.textListItemSubTitleAltDark]}>{item.orders_status || 'No Status'}</Text>
            </View>
            <View style = {MyStyle.RowLeftCenter}>
                <MyIcon.SimpleLineIcons
                    style = {optionList.iconSelected}
                    name = "event"
                    size = {13}
                    color = {MyColor.textDarkSecondary}
                />
                <Text style = {[MyStyleSheet.textListItemSubTitle, {marginLeft: 5, marginTop: 2}]}>
                    {MyLANG.PlacedOn} {MyUtil.momentFormat(item.date_purchased, MyConstant.MomentFormat["1st Jan, 1970 12:01 am"])}
                </Text>
            </View>

            <View style = {[orderList.viewCart]}>
                {item?.data?.map(
                    (prop: any, index: number) => (
                        <View
                            key = {index}
                            style = {[orderList.viewCartItem]}
                        >
                            <MyFastImage
                                source = {[prop?.products_image?.length > 9 ? {'uri': prop?.products_image} : MyImage.camera, MyImage.camera]}
                                style = {orderList.image}
                            />
                            <View style = {orderList.textsView}>
                                <Text
                                    style = {orderList.textName}
                                    numberOfLines = {2}>
                                    {prop?.products_name}
                                </Text>

                                <View style = {orderList.viewPrice}>
                                    <Text
                                        style = {orderList.textPrice}
                                        numberOfLines = {1}
                                    >
                                        {MyConfig.Currency.MYR.symbol} {prop?.products_price}
                                        &nbsp;
                                        <Text
                                            style = {orderList.textQuantity}
                                            numberOfLines = {1}
                                        >
                                            x{prop?.products_quantity}
                                        </Text>
                                    </Text>

                                    <NumberFormat
                                        value = {prop?.final_price}
                                        defaultValue = {0}
                                        displayType = {'text'}
                                        thousandSeparator = {true}
                                        decimalScale = {2}
                                        fixedDecimalScale = {true}
                                        decimalSeparator = {'.'}
                                        renderText = {
                                            (value: any) =>
                                                <Text style = {orderList.textPrice}>{MyConfig.Currency.MYR.symbol} {value}</Text>
                                        }
                                    />
                                </View>

                                {/*<View style = {{marginVertical: 7}}>
                                    {prop?.attributes?.length > 0 && prop.attributes.map(
                                        (attribute: any, i: number) => (
                                            <View key = {i}
                                                  style = {[MyStyle.RowLeftCenter, {marginVertical: 2}]}
                                            >
                                                <Text style = {[MyStyleSheet.textListItemSubTitle3Alt, {marginRight: 10}]}>{attribute.products_options}</Text>
                                                <View style = {[MyStyle.RowLeftCenter, {
                                                    backgroundColor  : MyColor.Material.GREY["200"],
                                                    paddingVertical  : 2,
                                                    paddingHorizontal: 10,
                                                    borderRadius     : 100,
                                                }]}>
                                                    <Text style = {[MyStyleSheet.textListItemSubTitle3Alt, {marginRight: 5}]}>
                                                        {attribute.products_options_values}
                                                    </Text>
                                                    {
                                                        (attribute.price_prefix && attribute.options_values_price) &&
                                                        <Text style = {[MyStyleSheet.textListItemSubTitle3, {}]}>
                                                            {attribute.price_prefix} {attribute.options_values_price}
                                                        </Text>
                                                    }
                                                </View>
                                            </View>
                                        ))
                                    }
                                </View>*/}

                            </View>

                        </View>
                    ))
                }
            </View>
            <View style = {[MyStyle.RowRightBottom, {}]}>
                <Text style = {[MyStyleSheet.textListItemSubTitleAlt, {marginRight: 8}]}>{MyLANG.OrderTotal}:</Text>
                <NumberFormat
                    value = {item.order_price}
                    defaultValue = {0}
                    displayType = {'text'}
                    thousandSeparator = {true}
                    decimalScale = {2}
                    fixedDecimalScale = {true}
                    decimalSeparator = {'.'}
                    renderText = {(value: any) =>
                        <Text style = {[orderList.textPriceTotal, MyStyleSheet.textPriceList]}>{MyConfig.Currency.MYR.symbol} {value}</Text>
                    }
                />
            </View>
            <View style = {[MyStyle.RowBetweenCenter, {marginTop: 10}]}>
                <View style = {MyStyle.RowLeftCenter}>
                    <MyIcon.SimpleLineIcons
                        style = {optionList.iconSelected}
                        name = "handbag"
                        size = {13}
                        color = {MyColor.textDarkSecondary}
                    />
                    <Text style = {[MyStyleSheet.textListItemSubTitle, {marginLeft: 5}]}>{item.shipping_method}</Text>
                </View>
                <View style = {MyStyle.RowLeftCenter}>
                    <MyIcon.SimpleLineIcons
                        style = {optionList.iconSelected}
                        name = "wallet"
                        size = {13}
                        color = {MyColor.textDarkSecondary}
                    />
                    <Text style = {[MyStyleSheet.textListItemSubTitle, {marginLeft: 5}]}>{item.payment_method}</Text>
                </View>
            </View>

        </MyMaterialRipple>
    )
}
const OrderListItemContentLoader = (count: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: OrderListItemContentLoader: ', '');

    return (
        <>
            {Array(count)
                .fill('')
                .map((prop, key) => (
                         <View key = {key}
                               style = {[{marginBottom: MyStyle.marginViewGapCard}, key === 0 && {marginTop: MyStyle.marginViewGapCardTop}]}
                         >
                             <ContentLoader
                                 speed = {2}
                                 width = {MyStyle.screenWidth}
                                 height = {200}
                                 backgroundColor = {MyColor.Material.GREY["200"]}
                                 foregroundColor = {MyColor.Material.GREY["400"]}
                             >
                                 <Rect x = "0"
                                       y = "0"
                                       rx = "0"
                                       ry = "0"
                                       width = {MyStyle.screenWidth}
                                       height = {200}/>
                             </ContentLoader>
                         </View>
                     )
                )
            }
        </>
    )

    // return RestaurantItemContentLoader(MyConfig.ListLimit.RestaurantHome);
}

const OrderDetailsContentLoader = (count: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: OrderDetailsContentLoader: ', '');

    return (
        <>
            {Array(count)
                .fill('')
                .map((prop, key) => (
                         <View
                             key = {key}
                             style = {[{marginBottom: MyStyle.marginViewGapCard}, key === 0 && {marginTop: MyStyle.marginViewGapCardTop}]}
                         >
                             <ContentLoader
                                 speed = {2}
                                 width = {MyStyle.screenWidth}
                                 height = {200}
                                 backgroundColor = {MyColor.Material.GREY["200"]}
                                 foregroundColor = {MyColor.Material.GREY["400"]}
                             >
                                 <Rect x = "0"
                                       y = "0"
                                       rx = "0"
                                       ry = "0"
                                       width = {MyStyle.screenWidth}
                                       height = {200}/>
                             </ContentLoader>
                         </View>
                     )
                )
            }
        </>
    )

    // return RestaurantItemContentLoader(MyConfig.ListLimit.RestaurantHome);
}


// Option Page:
const OptionList = ({item, index, listShow, listSelected, onItem}: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: OptionList: ', {index, item, listShow, listSelected});

    return (
        <LinearGradient
            style = {[optionList.linearGradientStyles, {}]}
            {...MyStyle.LGDrawerItem}
        >
            <MyMaterialRipple
                style = {optionList.materialRipple}
                {...MyStyle.MaterialRipple.drawer}
                onPress = {() => onItem(item)}
            >
                <View style = {optionList.view}>
                    {listShow.image &&
                     <MyFastImage
                         source = {[{'uri': item?.[listShow.image]}, MyImage.defaultItem]}
                         style = {optionList.image}
                     />
                    }
                    <View style = {optionList.textsView}>
                        {listShow.title &&
                         <Text
                             style = {optionList.textTitle}
                             numberOfLines = {2}>
                             {item?.[listShow.title]}
                         </Text>
                        }
                        {listShow.subTitle &&
                         <Text
                             style = {optionList.textSubtitle}
                             numberOfLines = {5}>
                             {item?.[listShow.subTitle]}
                         </Text>
                        }
                    </View>
                    <View>
                        {listSelected === item.id &&
                         <MyIcon.FontAwesome
                             style = {optionList.iconSelected}
                             name = "check"
                             size = {18}
                             color = {MyColor.attentionDark}
                         />
                        }
                    </View>
                </View>
            </MyMaterialRipple>
        </LinearGradient>
    )
}

// ModalNotFullScreen:
const ModalNotFullScreen = (props: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: ModalNotFullScreen: ', {props});

    return (
        <TouchableOpacity
            style = {{
                flex          : 1,
                justifyContent: 'center',
                alignItems    : "center",

                backgroundColor: 'rgba(0,0,0,0.6)',
            }}
            onPressOut = {props.onRequestClose}
        >

            <View style = {props?.viewMain || {
                marginVertical: MyStyle.screenHeight * 0.08,
                width         : MyStyle.screenWidth * 0.85,

                backgroundColor: '#f9f9f9',
                borderRadius   : 4,
            }}>
                <ScrollView contentInsetAdjustmentBehavior = "automatic">
                    <TouchableOpacity
                        activeOpacity = {1}
                        onPress = {() => ''}
                        style = {props?.viewTouchable || {}}
                    >
                        <>
                            {props.children}
                        </>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </TouchableOpacity>
    )
}

// ModalNotFullScreen:
const ModalNotFullScreenHeaderFooter = (props: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: ModalNotFullScreenHeaderFooter: ', {props});

    return (
        <TouchableOpacity
            activeOpacity = {1}
            style = {{
                flex          : 1,
                justifyContent: 'center',
                alignItems    : "center",

                backgroundColor: 'rgba(0,0,0,0.6)',
            }}
        >
            <View style = {props?.viewMain || {
                marginVertical: MyStyle.screenHeight * 0.08,
                width         : MyStyle.screenWidth * 0.85,

                backgroundColor: '#f9f9f9',
                borderRadius   : 4,
            }}>

                {props.children}

            </View>
        </TouchableOpacity>
    )
}

// ModalFullScreenPage:
const ModalFullScreenPage = (props: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: ModalFullscreenPage: ', {props});

    return (
        <Fragment>
            <Shadow style = {MyStyle.neomorphShadow.headerModal}>
                <LinearGradient
                    {...MyStyle.LGHeaderPrimary}
                    style = {{
                        flex          : 1,
                        flexDirection : "row",
                        justifyContent: "flex-start",
                        alignItems    : "center",
                        paddingTop    : MyStyle.platformOS === "ios" ? (MyStyle.headerHeight / 2) : 0,
                    }}
                >
                    {
                        props.backButton !== false &&
                        <MyMaterialRipple
                            style = {{marginLeft: 6}}
                            {...MyStyle.MaterialRipple.drawerRounded}
                            onPress = {props.onBackPress}
                        >
                            <MyIcon.Feather
                                name = "arrow-left"
                                size = {23}
                                color = {MyColor.Material.WHITE}
                                style = {{paddingVertical: 7, paddingHorizontal: 8}}
                            />
                        </MyMaterialRipple>
                    }

                    {
                        props.title &&
                        <Text style = {{
                            fontFamily      : MyStyle.FontFamily.OpenSans.semiBold,
                            fontSize        : 18,
                            color           : MyColor.Material.WHITE,
                            marginHorizontal: 27,
                        }}>
                            {props.title}
                        </Text>
                    }
                </LinearGradient>
            </Shadow>

            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <View style = {[MyStyleSheet.SafeAreaView3, {paddingTop: 0}]}>
                    <ScrollView
                        contentInsetAdjustmentBehavior = "automatic"
                        contentContainerStyle = {props.contentContainerStyle || {flexGrow: 1, backgroundColor: MyColor.Material.WHITE}}
                    >

                        {props.children}

                    </ScrollView>

                    {props.footer && props.footer}

                </View>
            </SafeAreaView>

        </Fragment>
    )
}

// Modal Radio List:
const ModalRadioList = (props: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: ModalRadioList: ', {props});

    return (
        <>
            {/*<LinearGradient
                style = {styles.linearGradientStyles}
                start = {MyStyle.LGWhitish.start}
                end = {MyStyle.LGWhitish.end}
                locations = {MyStyle.LGWhitish.locations}
                colors = {MyStyle.LGWhitish.colors}
            >*/}
            {props.title && <Text style = {modalRadioList.textTitle}>{props.title}</Text>}
            {props.subTitle && <Text style = {modalRadioList.textSubtitle}>{props.subTitle}</Text>}
            {/* </LinearGradient>*/}

            <View style = {modalRadioList.viewItemList}>
                {
                    props?.items?.length > 0 && props?.items.map(
                        (prop: any, index: number) => (

                            <MyMaterialRipple
                                key = {index}
                                {...MyStyle.MaterialRipple.drawer}
                                style = {modalRadioList.viewItem}
                                onPress = {() => props.onItem(prop)}
                            >

                                {props.iconLeft &&
                                 getMyIcon(
                                     {
                                         fontFamily: props.iconLeft?.[index]?.fontFamily || MyConstant.VectorIcon.SimpleLineIcons,
                                         name      : props.iconLeft?.[index]?.name,
                                         color     : props.iconLeft?.[index]?.color || MyColor.textDarkPrimary2,
                                         size      : props.iconLeft?.[index]?.size || 18,
                                         style     : [modalRadioList.iconLeft, props.iconLeft?.[index]?.style, Number(prop?.id) === Number(props.selected) && modalRadioList.iconLeftSelected]
                                     }
                                 )
                                }

                                {prop.iconLeft &&
                                 getMyIcon(
                                     {
                                         fontFamily: prop.iconLeft?.fontFamily || MyConstant.VectorIcon.SimpleLineIcons,
                                         name      : prop.iconLeft?.name,
                                         color     : prop.iconLeft?.color || MyColor.textDarkPrimary2,
                                         size      : prop.iconLeft?.size || 18,
                                         style     : [modalRadioList.iconLeft, props.iconLeft?.style, Number(prop?.id) === Number(props.selected) && modalRadioList.iconLeftSelected]
                                     }
                                 )
                                }

                                {/*<MyFastImage
                                                source = {[user?.customers_picture?.length > 0 ? MyImage.defaultAvatar : MyImage.defaultAvatar, MyImage.defaultAvatar]}
                                                style = {modalRadioList.imageLeft}
                                            />*/}
                                <View style = {[modalRadioList.viewTexts, {marginLeft: props.iconLeft ? MyStyle.paddingHorizontalModalItem / 2 : MyStyle.paddingHorizontalModalItem}]}>

                                    {props.titleText &&
                                     <Text
                                         numberOfLines = {2}
                                         style = {[modalRadioList.textItemTitle, Number(prop?.id) === Number(props.selected) && {color: MyColor.Primary.first}]}
                                     >
                                         {prop[props.titleText]}
                                     </Text>
                                    }

                                    {props.subTitleText &&
                                     <Text
                                         numberOfLines = {2}
                                         style = {[modalRadioList.textItemSubtitle, Number(prop?.id) === Number(props.selected) && {
                                             color     : MyColor.Primary.first,
                                             fontFamily: MyStyle.FontFamily.OpenSans.semiBold
                                         }]}
                                     >
                                         {prop[props.subTitleText]}
                                     </Text>
                                    }

                                    {(props.bodyText && prop[props.bodyText]) &&
                                     <Text
                                         numberOfLines = {5}
                                         style = {modalRadioList.textItemBody}
                                     >
                                         {prop[props.bodyText]}
                                     </Text>
                                    }

                                    {props.footerText &&
                                     <Text
                                         numberOfLines = {5}
                                         style = {modalRadioList.textItemBody}
                                     >
                                         {prop[props.footerText]}
                                     </Text>
                                    }

                                </View>

                                {
                                    props.radio !== false &&
                                    <MyIcon.Fontisto
                                        style = {modalRadioList.iconRight}
                                        name = {Number(prop?.id) === Number(props.selected) ? "radio-btn-active" : "radio-btn-passive"}
                                        size = {18}
                                        color = {Number(prop?.id) === Number(props.selected) ? MyColor.Primary.first : MyColor.Material.GREY["600"]}
                                    />
                                }

                            </MyMaterialRipple>
                        )
                    )

                }
            </View>
        </>
    )
}

// Modal Checkbox Multi List:
const ModalMultiList = (props: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: ModalMultiList: ', {props});

    return (
        <TouchableOpacity
            activeOpacity = {1}
            style = {{
                flex          : 1,
                justifyContent: 'center',
                alignItems    : "center",

                backgroundColor: 'rgba(0,0,0,0.6)',
            }}
        >
            <View style = {props?.viewMain || {
                marginTop   : MyStyle.screenHeight * 0.14,
                marginBottom: MyStyle.screenHeight * 0.10,
                width       : MyStyle.screenWidth * 0.85,

                backgroundColor: '#f9f9f9',
                borderRadius   : 4,
            }}>

                <View
                    style = {{
                        borderTopLeftRadius : 4,
                        borderTopRightRadius: 4,

                        shadowColor    : "#000000",
                        shadowOffset   : {
                            width : 0,
                            height: 1,
                        },
                        shadowOpacity  : 0.22,
                        shadowRadius   : 2.22,
                        elevation      : 3,
                        backgroundColor: "#ffffff",
                    }}
                >
                    {props.title && <Text style = {[modalRadioList.textTitle, {paddingTop: 14, paddingBottom: 14}]}>{props.title}</Text>}
                    {props.subTitle && <Text style = {modalRadioList.textSubtitle}>{props.subTitle}</Text>}

                </View>

                <View
                    style = {{
                        flexDirection  : 'row',
                        justifyContent : 'space-between',
                        paddingLeft    : MyStyle.paddingHorizontalModal,
                        paddingRight   : MyStyle.paddingHorizontalModalItem / 1.5,
                        paddingVertical: 8,
                        backgroundColor: "#ffffff",
                    }}>
                    <TouchableOpacity
                        activeOpacity = {0.8}
                        onPress = {() => props.onDeselectAll()}
                    >
                        <Text style = {MyStyleSheet.linkTextList}>
                            {MyLANG.DeselectAll}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity = {0.8}
                        onPress = {() => props.onSelectAll()}
                    >
                        <Text style = {MyStyleSheet.linkTextList}>
                            {MyLANG.SelectAll}
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentInsetAdjustmentBehavior = "automatic">
                    <View style = {modalRadioList.viewItemList}>
                        {
                            props?.items?.length > 0 && props.items.map(
                                (prop: any, index: number) => (

                                    <MyMaterialRipple
                                        key = {index}
                                        {...MyStyle.MaterialRipple.drawer}
                                        style = {[modalRadioList.viewItem, {paddingLeft: MyStyle.paddingHorizontalModal}]}
                                        onPress = {() => props.onItem(prop, index)}
                                    >

                                        <View style = {[modalRadioList.viewTexts, {}]}>

                                            {(props.bodyText && prop[props.bodyText]) &&
                                             <Text
                                                 numberOfLines = {3}
                                                 style = {[modalRadioList.textItemBody, {color: prop.cart_selected ? MyColor.textDarkPrimary2 : MyColor.textDarkSecondary}]}
                                             >
                                                 {prop[props.bodyText]}
                                             </Text>
                                            }

                                            {props.priceText &&
                                             <Text
                                                 numberOfLines = {2}
                                                 style = {[modalRadioList.textItemPrice, {color: prop.cart_selected ? MyColor.textDarkPrimary2 : MyColor.textDarkSecondary}]}
                                             >
                                                 + {MyConfig.Currency.MYR.symbol} {prop[props.priceText]}
                                             </Text>
                                            }
                                        </View>

                                        {
                                            props.checkbox !== false &&
                                            <MyIcon.AntDesign
                                                style = {modalRadioList.iconRightCheckBox}
                                                name = {prop.cart_selected ? "checkcircle" : "checkcircleo"}
                                                size = {18}
                                                color = {prop.cart_selected ? MyColor.Primary.first : MyColor.Material.GREY["400"]}
                                            />
                                        }
                                    </MyMaterialRipple>
                                )
                            )

                        }
                    </View>
                </ScrollView>

                <View
                    style = {{
                        flexDirection : 'row',
                        justifyContent: 'space-around',

                        borderBottomLeftRadius : 4,
                        borderBottomRightRadius: 4,

                        shadowColor    : "#000000",
                        shadowOffset   : {width: 0, height: -1},
                        shadowOpacity  : 0.22,
                        shadowRadius   : 2.22,
                        elevation      : 3,
                        backgroundColor: "#ffffff",
                    }}
                >
                    <MyButton
                        fill = "transparent"
                        color = {MyColor.Material.GREY["900"]}
                        shadow = "none"
                        shape = "square"
                        title = {MyLANG.Cancel}
                        textTransform = "capitalize"
                        textStyle = {{fontFamily: MyStyle.FontFamily.OpenSans.regular}}
                        onPress = {() => props.onCancel()}
                    />
                    <MyButton
                        fill = "transparent"
                        color = {MyColor.attentionDark}
                        shadow = "none"
                        shape = "square"
                        title = {MyLANG.OK}
                        textStyle = {{fontFamily: MyStyle.FontFamily.OpenSans.semiBold}}
                        onPress = {() => props.onOk()}
                    />
                </View>
            </View>

        </TouchableOpacity>
    )
}

// Modal Info:
const ModalInfo = (props: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: ModalInfo: ', {props});

    return (
        <>
            {props.title && <Text style = {modalRadioList.textTitle}>{props.title}</Text>}
            {props.subTitle && <Text style = {modalRadioList.textSubtitle}>{props.subTitle}</Text>}

            <View style = {{
                paddingHorizontal: MyStyle.paddingHorizontalModal,
                marginTop        : MyStyle.paddingVerticalModal / 2,
                marginBottom     : MyStyle.paddingVerticalModal,
                backgroundColor  : '#f9f9f9',
            }}>

                {props.bodyText &&
                 <Text
                     style = {modalRadioList.textItemBody}
                 >
                     {props.bodyText}
                 </Text>
                }

                {props.bodyHTML &&
                 <HTML
                     html = {props.bodyHTML || MyLANG.NoInformationFound}
                     tagsStyles = {MyStyle.textHTMLBody}
                     ignoredTags = {MyStyle.IGNORED_TAGS}
                     containerStyle = {{}}
                     textSelectable = {true}
                 />
                }

            </View>
        </>
    )
}

const ModalFilter = (props: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: ModalFilterPage: ', {props});

    return (
        <View style = {modalFilterPage.view}>

            {
                props?.category?.length > 0 &&
                <View>
                    <Text style = {MyStyleSheet.headerPage}>{MyLANG.Category}</Text>

                    <View style = {[MyStyle.RowLeftCenter, {
                        flexWrap    : "wrap",
                        marginTop   : MyStyle.marginVerticalList / 2,
                        marginBottom: MyStyle.marginVerticalPage * 1.5,
                    }]}>
                        {props?.category?.map((value: any, i: number) => (
                            <LinearGradient
                                key = {i}
                                style = {[{
                                    marginBottom: 7,
                                    marginRight : 7,
                                    borderRadius: 100,
                                }]} {...
                                props?.watchValues?.category_option?.[value?.categories_id] ? {...MyStyle.LGButtonPrimary} : {...MyStyle.LGGrey}
                                }
                            >
                                <MyMaterialRipple
                                    style = {{paddingHorizontal: 17, paddingVertical: 6}}
                                    {...MyStyle.MaterialRipple.drawerRounded}
                                    onPress = {() => props.onFilterItem('category', value, i)}
                                >
                                    <Text style = {[MyStyleSheet.textListItemTitle2AltDark, props?.watchValues?.category_option?.[value?.categories_id] && {
                                        color: MyColor.textLightPrimary,
                                    }]}>
                                        {value?.categories_name}
                                    </Text>
                                </MyMaterialRipple>
                            </LinearGradient>
                        ))}
                    </View>
                </View>
            }

            {props?.filter_method?.length > 0 && props?.filter_method.map((filter: any, i: number) => (
                <View key = {i}>
                    <Text style = {MyStyleSheet.headerPage}>{filter?.option?.name}</Text>

                    <View style = {[MyStyle.RowLeftCenter, {
                        flexWrap    : "wrap",
                        marginTop   : MyStyle.marginVerticalList / 2,
                        marginBottom: MyStyle.marginVerticalPage * 1.5,
                    }]}>
                        {filter?.values?.length > 0 && filter?.values.map((value: any, j: number) => (
                            <LinearGradient
                                key = {j}
                                style = {[{
                                    marginBottom: 7,
                                    marginRight : 7,
                                    borderRadius: 100,
                                }]} {...
                                props?.watchValues?.filter_option?.[value?.value_id] ? {...MyStyle.LGButtonPrimary} : {...MyStyle.LGGrey}
                                }
                            >
                                <MyMaterialRipple
                                    style = {{paddingHorizontal: 17, paddingVertical: 6}}
                                    {...MyStyle.MaterialRipple.drawerRounded}
                                    onPress = {() => props.onFilterItem('filter', filter, j)}
                                >
                                    <Text style = {[MyStyleSheet.textListItemTitle2AltDark, props?.watchValues?.filter_option?.[value?.value_id] && {
                                        color: MyColor.textLightPrimary,
                                    }]}>
                                        {value?.value}
                                    </Text>
                                </MyMaterialRipple>
                            </LinearGradient>
                        ))}
                    </View>
                </View>
            ))}

            <View style = {{
                flex          : 1,
                flexDirection : 'column',
                justifyContent: 'center',
                marginBottom  : MyStyle.marginVerticalPage,
            }}>
                <Text style = {MyStyleSheet.headerPage}>{MyLANG.Price}</Text>
                <MultiSlider
                    values = {[
                        props?.watchValues?.price_min,
                        props?.watchValues?.price_max,
                    ]}
                    sliderLength = {280}
                    onValuesChange = {props.nonCollidingMultiSliderValuesChange}
                    min = {MyConfig.FilterRange.price[0]}
                    max = {MyConfig.FilterRange.price[1]}
                    step = {MyConfig.FilterRange.price[2]}
                    allowOverlap = {false}
                    snapped
                    minMarkerOverlapDistance = {5}
                    // customMarker = {CustomMarker}
                    // customLabel = {CustomLabel}
                    containerStyle = {{
                        flex     : 1,
                        alignSelf: "center",
                    }}
                    selectedStyle = {{
                        backgroundColor: MyColor.Primary.first,
                    }}
                    markerStyle = {{
                        backgroundColor: MyColor.Primary.first,
                    }}
                />
                <View style = {[MyStyle.RowBetweenCenter]}>
                    <NumberFormat
                        value = {props?.watchValues?.price_min}
                        defaultValue = {0}
                        displayType = {'text'}
                        thousandSeparator = {true}
                        decimalScale = {0}
                        fixedDecimalScale = {true}
                        decimalSeparator = {'.'}
                        renderText = {
                            (value: any) =>
                                <Text style = {[MyStyleSheet.textListItemTitleDark, {marginLeft: MyStyle.marginHorizontalPage}]}>{MyConfig.Currency.MYR.symbol} {value}</Text>
                        }
                    />
                    <NumberFormat
                        value = {props?.watchValues?.price_max}
                        defaultValue = {0}
                        displayType = {'text'}
                        thousandSeparator = {true}
                        decimalScale = {0}
                        fixedDecimalScale = {true}
                        decimalSeparator = {'.'}
                        renderText = {
                            (value: any) =>
                                <Text style = {[MyStyleSheet.textListItemTitleDark, {marginRight: MyStyle.marginHorizontalPage}]}>{MyConfig.Currency.MYR.symbol} {value}</Text>
                        }
                    />
                </View>
            </View>

        </View>
    )
}


//
const RestaurantListItem          = ({item}: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: restaurantListItem: ', '');

    return (
        <View style = {restaurantItem.view}>
            <MyFastImage
                source = {[{'uri': MyAPI.imgRestaurant + item['photo']}, MyImage.defaultItem]}
                style = {restaurantItem.image}
            />
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
            marginHorizontal: MyStyle.marginHorizontalList / 1.7,
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
            fontSize         : 10,
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
        touchable          : {},
        view               : {
            display         : "flex",
            flexDirection   : "column",
            justifyContent  : "flex-start",
            alignItems      : "center",
            marginHorizontal: MyStyle.marginHorizontalList / 1.8,
        },
        image              : {
            ...MyStyleSheet.imageListLarge,
        },
        textsView          : {},
        textName           : {
            width            : MyStyle.screenWidth * 0.35,
            paddingTop       : 5,
            paddingBottom    : 3,
            paddingHorizontal: 2,
            fontFamily       : MyStyle.FontFamily.OpenSans.regular,
            fontSize         : 12,
            color            : MyColor.Material.BLACK,

            height: 40,
        },
        textPrice          : {
            width            : MyStyle.screenWidth * 0.35,
            paddingBottom    : 2,
            paddingHorizontal: 2,
            fontFamily       : MyStyle.fontFamilyPrice,
            fontSize         : 13,
            color            : MyColor.Primary.first,
        },
        textPriceDiscounted: {
            width             : MyStyle.screenWidth * 0.35,
            paddingBottom     : 2,
            paddingHorizontal : 2,
            fontFamily        : MyStyle.fontFamilyPrice,
            fontSize          : 11,
            color             : MyColor.textDarkSecondary2,
            textDecorationLine: "line-through",
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
        materialRipple: {},
        view          : {
            display         : 'flex',
            flexDirection   : 'row',
            justifyContent  : 'flex-start',
            alignItems      : 'center',
            marginHorizontal: MyStyle.marginHorizontalList,
            marginVertical  : MyStyle.marginVerticalList,
        },
        image         : {
            ...MyStyleSheet.imageList,
        },
        textsView     : {
            display       : 'flex',
            flexDirection : 'column',
            justifyContent: 'flex-start',

            flex: 1,

            marginHorizontal: MyStyle.marginHorizontalTextsView,
        },
        textName      : {
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

        viewPrice          : {
            display       : "flex",
            flexDirection : "row",
            justifyContent: "flex-start",
            alignItems    : "center",
            marginTop     : 6,
        },
        textPrice          : {
            fontFamily: MyStyle.fontFamilyPrice,
            fontSize  : 13,
            color     : MyColor.Primary.first,
        },
        textPriceDiscounted: {
            fontFamily        : MyStyle.fontFamilyPrice,
            fontSize          : 12,
            color             : MyColor.textDarkSecondary2,
            textDecorationLine: "line-through",

            marginLeft: 7,
        },
    }
);

// CART LIST PAGE:
const cartList = StyleSheet.create(
    {
        touchable          : {},
        view               : {
            display       : 'flex',
            flexDirection : 'row',
            justifyContent: 'space-around',

            marginHorizontal: MyStyle.marginHorizontalList / 2,
            paddingVertical : MyStyle.paddingVerticalList,

            borderBottomWidth: 0.9,
        },
        image              : {
            ...MyStyleSheet.imageList,
        },
        textsView          : {
            display       : 'flex',
            flexDirection : 'column',
            justifyContent: 'space-between',
            alignItems    : "flex-start",

            flex: 1,

            marginLeft : MyStyle.marginHorizontalTextsView,
            marginRight: 20,
        },
        textName           : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 13,
            color     : MyColor.Material.BLACK,

            textAlign: "justify"
        },
        textPrice          : {
            fontFamily: MyStyle.fontFamilyPriceSemiBold,
            fontSize  : 15,
            color     : MyColor.Primary.first,

            marginTop: 1,
        },
        textPriceDiscounted: {
            fontFamily        : MyStyle.fontFamilyPrice,
            fontSize          : 12,
            color             : MyColor.textDarkSecondary2,
            textDecorationLine: "line-through",

            marginLeft: 7,
        },

        viewStock      : {
            alignSelf     : "stretch",
            display       : "flex",
            flexDirection : "row",
            justifyContent: "space-between",
            alignItems    : "flex-end",

            marginTop: 10,
        },
        viewStockText  : {
            flexDirection  : "row",
            justifyContent : "flex-start",
            alignItems     : "center",
            backgroundColor: MyColor.Material.GREY["100"],
            paddingLeft    : 10,
            borderRadius   : 100,
        },
        textStock      : {
            fontFamily: MyStyle.FontFamily.OpenSans.light,
            fontSize  : 12,
            color     : MyColor.Material.GREY["800"],
        },
        textStockNumber: {
            fontFamily     : MyStyle.FontFamily.Roboto.bold,
            color          : MyColor.Material.GREY["800"],
            fontSize       : 13,
            backgroundColor: MyColor.Material.GREY["200"],
            paddingVertical: 2,
            paddingLeft    : 7,
            paddingRight   : 9,
            marginLeft     : 6,

            borderTopRightRadius   : 100,
            borderBottomRightRadius: 100,
        },

        viewStepper : {
            display       : 'flex',
            flexDirection : 'column',
            justifyContent: 'space-between',
            alignItems    : 'center',

            minWidth       : 28,
            minHeight      : MyStyle.screenWidth * 0.25,
            maxHeight      : MyStyle.screenWidth * 0.25,
            backgroundColor: '#F7F8FA',
            borderWidth    : 1,
            borderColor    : '#D6DBDF',
            borderRadius   : 80 / 2,
        },
        textQuantity: {
            fontFamily       : MyStyle.FontFamily.OpenSans.semiBold,
            fontSize         : 14,
            color            : MyColor.Material.BLACK,
            paddingHorizontal: 5,
        }
    }
);


const cartListSmall = StyleSheet.create(
    {
        view     : {
            display       : 'flex',
            flexDirection : 'row',
            justifyContent: 'space-between',
            // alignItems    : "flex-start",

            paddingVertical: MyStyle.paddingVerticalList / 2,

            borderBottomWidth: 0.9,
            borderBottomColor: MyColor.dividerDark,
        },
        image    : {
            ...MyStyleSheet.imageListSmall,
        },
        textsView: {
            flex: 1,

            display       : 'flex',
            flexDirection : 'column',
            justifyContent: 'flex-start',

            marginLeft: MyStyle.marginHorizontalTextsView,
        },
        textName : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 13,
            color     : MyColor.Material.BLACK,
        },

        viewPrice          : {
            display       : "flex",
            flexDirection : "row",
            justifyContent: "space-between",
            alignItems    : "baseline",
        },
        textPrice          : {
            fontFamily: MyStyle.fontFamilyPrice,
            fontSize  : 12,
            color     : MyColor.textDarkSecondary,

            marginTop  : 2,
            marginRight: 3,
        },
        textQuantity       : {
            fontFamily : MyStyle.FontFamily.OpenSans.semiBold,
            fontSize   : 12,
            color      : MyColor.Primary.first,
            marginRight: 7,
        },
        textPriceDiscounted: {
            fontFamily        : MyStyle.fontFamilyPrice,
            fontSize          : 11,
            color             : MyColor.textDarkSecondary2,
            textDecorationLine: "line-through",
        },
        textPriceTotal     : {
            textAlign: "right",

            fontFamily: MyStyle.fontFamilyPrice,
            fontSize  : 13,
            color     : MyColor.Primary.first,
        },
    }
);

const cartPageTotal = StyleSheet.create(
    {
        view     : {
            display       : "flex",
            flexDirection : "column",
            justifyContent: "flex-start",

            paddingHorizontal: MyStyle.marginHorizontalPage,
            paddingVertical  : MyStyle.marginVerticalList,
        },
        textsView: {
            marginVertical: 5,
            display       : "flex",
            flexDirection : "row",
            justifyContent: "space-between",
            alignItems    : "center",
        },

        textTitleBold2 : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 16,
            color     : MyColor.textDarkPrimary,
        },
        textAmountBold2: {
            fontFamily: MyStyle.fontFamilyPrice,
            fontSize  : 15,
            color     : MyColor.textDarkPrimary,
        },

        textTitle : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 13,
            color     : MyColor.textDarkSecondary,
        },
        textAmount: {
            fontFamily: MyStyle.fontFamilyPrice,
            fontSize  : 13,
            color     : MyColor.textDarkSecondary,
        },

        textTitleBold : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 16,
            color     : MyColor.textDarkPrimary,
        },
        textAmountBold: {
            fontFamily: MyStyle.fontFamilyPriceBold,
            fontSize  : 16,
            color     : MyColor.textDarkPrimary,
        },

        divider: {
            marginTop      : 8,
            marginBottom   : 4,
            height         : 0.5,
            backgroundColor: MyColor.Material.GREY["800"]
        },
    }
);

// NOTIFICATION LIST PAGE:
const notificationList = StyleSheet.create(
    {
        materialRipple: {},
        view          : {
            display          : 'flex',
            flexDirection    : 'row',
            justifyContent   : 'flex-start',
            paddingHorizontal: MyStyle.paddingHorizontalList,
            paddingVertical  : MyStyle.paddingVerticalList,
        },
        image         : {
            ...MyStyleSheet.imageListSmall,

            borderRadius: 100,
        },
        textsView     : {
            display       : 'flex',
            flexDirection : 'column',
            justifyContent: 'space-between',

            flex: 1,

            marginHorizontal: MyStyle.marginHorizontalTextsView,
        },
        textTitle     : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 14,
            color     : MyColor.textDarkPrimary,
        },
        textBody      : {
            fontFamily: MyStyle.FontFamily.Roboto.regular,
            fontSize  : 13,
            color     : MyColor.textDarkSecondary,

            marginTop: 1,
        },
        textTime      : {
            fontFamily: MyStyle.FontFamily.Roboto.regular,
            fontSize  : 12,
            color     : MyColor.textDarkSecondary,

            alignSelf: "flex-end",

            marginTop: 4,
        },
    }
);

// ORDER LIST PAGE:
const orderList = StyleSheet.create(
    {
        materialRipple: {
            display       : 'flex',
            flexDirection : 'column',
            justifyContent: 'flex-start',

            paddingVertical  : MyStyle.paddingVerticalList,
            paddingHorizontal: MyStyle.paddingHorizontalList,

            marginBottom: MyStyle.marginViewGapCard,

            backgroundColor: MyColor.Material.WHITE,
        },

        viewCart: {
            marginVertical  : 10,
            marginHorizontal: 15,
        },

        viewCartItem: {
            display       : 'flex',
            flexDirection : 'row',
            justifyContent: 'space-around',
            alignItems    : "center",

            marginVertical: 4,
        },
        image       : {
            ...MyStyleSheet.imageListExtraSmall,
        },
        textsView   : {
            flex: 1,

            display       : 'flex',
            flexDirection : 'column',
            justifyContent: 'space-between',

            marginLeft: MyStyle.marginHorizontalTextsView,
        },
        textName    : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 13,
            color     : MyColor.Material.BLACK,
        },

        viewPrice   : {
            display       : "flex",
            flexDirection : "row",
            justifyContent: "space-between",
            // alignItems    : "center",
        },
        textPrice   : {
            fontFamily: MyStyle.fontFamilyPrice,
            fontSize  : 12,
            color     : MyColor.textDarkSecondary,
        },
        textQuantity: {
            fontFamily: MyStyle.FontFamily.OpenSans.semiBold,
            fontSize  : 12,
            color     : MyColor.Primary.first,
        },

        textPriceDiscounted: {
            fontFamily        : MyStyle.fontFamilyPrice,
            fontSize          : 11,
            color             : MyColor.textDarkSecondary2,
            textDecorationLine: "line-through",
        },
        textPriceTotal     : {
            fontFamily: MyStyle.fontFamilyPrice,
            fontSize  : 13,
            color     : MyColor.textDarkPrimary,
        },
    }
);

// OPTION PAGE:
const optionList = StyleSheet.create(
    {
        linearGradientStyles: {},
        materialRipple      : {},
        view                : {
            display       : 'flex',
            flexDirection : 'row',
            justifyContent: 'space-around',
            alignItems    : "center",

            marginHorizontal: MyStyle.marginHorizontalList,
            paddingVertical : MyStyle.paddingVerticalList,
        },
        image               : {
            ...MyStyleSheet.imageListExtraSmall,
        },
        textsView           : {
            display       : 'flex',
            flexDirection : 'column',
            justifyContent: 'center',
            alignItems    : "flex-start",

            flex: 1,

            marginLeft : MyStyle.marginHorizontalTextsView,
            marginRight: 20,
        },
        textTitle           : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 15,
            color     : MyColor.textDarkPrimary,
        },
        textSubtitle        : {
            fontFamily: MyStyle.FontFamily.Roboto.regular,
            fontSize  : 13,
            color     : MyColor.textDarkSecondary,

            marginTop: 2,
        },

        iconSelected: {},
    }
);

// MODAL RADIO LIST:
const modalRadioList = StyleSheet.create(
    {
        textTitle   : {
            fontFamily: MyStyle.FontFamily.Roboto.bold,
            fontSize  : 21,
            color     : MyColor.textDarkPrimary,

            paddingTop       : MyStyle.paddingVerticalModal,
            paddingHorizontal: MyStyle.paddingHorizontalModal,
        },
        textSubtitle: {
            fontFamily: MyStyle.FontFamily.Roboto.regular,
            fontSize  : 15,
            color     : MyColor.textDarkSecondary,

            marginTop        : 2,
            paddingBottom    : MyStyle.paddingVerticalModal / 2,
            paddingHorizontal: MyStyle.paddingHorizontalModal,
        },

        viewItemList     : {
            display       : "flex",
            flexDirection : "column",
            justifyContent: "flex-start",

            marginTop      : MyStyle.paddingVerticalModal / 2,
            marginBottom   : MyStyle.paddingVerticalModal,
            backgroundColor: '#f9f9f9',
        },
        viewItem         : {
            display       : "flex",
            flexDirection : "row",
            justifyContent: "flex-start",
            alignItems    : "center",

            paddingVertical: MyStyle.paddingVerticalModalItem,
        },
        imageLeft        : {
            width          : MyStyle.screenWidth * 0.08,
            height         : MyStyle.screenWidth * 0.08,
            backgroundColor: MyColor.Material.GREY["100"],

            marginLeft : MyStyle.paddingHorizontalModalItem / 2,
            marginRight: 10,
        },
        viewTexts        : {
            flex: 1,
        },
        textItemTitle    : {
            fontFamily: MyStyle.FontFamily.OpenSans.semiBold,
            fontSize  : 16,
            color     : MyColor.textDarkPrimary2,
        },
        textItemSubtitle : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 16,
            color     : MyColor.textDarkPrimary,
        },
        textItemBody     : {
            fontFamily: MyStyle.FontFamily.Roboto.regular,
            fontSize  : 14,
            color     : MyColor.textDarkSecondary,
        },
        iconLeft         : {
            marginLeft: MyStyle.paddingHorizontalModalItem,
        },
        iconLeftSelected : {
            color: MyColor.Primary.first,
        },
        iconRight        : {
            marginLeft  : 15,
            paddingRight: MyStyle.paddingHorizontalModalItem / 1.5,
        },
        iconRightSelected: {
            marginLeft  : 6,
            paddingRight: MyStyle.paddingHorizontalModalItem / 1.5,
        },

        iconRightCheckBox: {
            marginLeft  : 10,
            paddingRight: MyStyle.paddingHorizontalModalItem / 1.5,
        },
        textItemPrice    : {
            fontFamily: MyStyle.FontFamily.Roboto.regular,
            fontSize  : 12,
            color     : MyColor.textDarkSecondary,

            marginTop: 3,
        },
    }
);

// MODAL FILTER PAGE:
const modalFilterPage = StyleSheet.create(
    {
        view: {
            marginHorizontal: MyStyle.marginHorizontalPage,
            marginVertical  : MyStyle.marginVerticalList,
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

export {
    CustomDrawerContent,
    CartIconWithBadge,

    ListItemSeparator,

    CategoryListItem,
    CategoryListItemContentLoader,
    ProductListItem,
    ProductListItemContentLoader,

    CategoryHorizontalListItem,
    CategoryHorizontalListItemContentLoader,
    ProductHorizontalListItem,
    ProductHorizontalListItemContentLoader,
    ImageSliderProduct,
    ImageSliderBanner,
    ImageSliderBannerContentLoader,
    ImageSliderCounter,

    ProductDetailsContentLoader,
    CartPageHeader,
    CartListItem,
    CartPageBottomButtons,
    CartPageTotal,

    OptionList,
    ModalInfo,
    ModalRadioList,
    ModalMultiList,

    ModalNotFullScreen,
    ModalNotFullScreenHeaderFooter,
    ModalFullScreenPage,
    ModalFilter,

    CartListItemSmall,

    NotificationListItem,
    NotificationListItemContentLoader,
    NotificationDetailsContentLoader,

    AddressListItem,
    AddressListItemContentLoader,

    OrderListItem,
    OrderListItemContentLoader,
    OrderDetailsContentLoader,

    RestaurantListItem,
    RestaurantItemContentLoader,
};
