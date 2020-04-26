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
import {MyButton} from "../components/MyButton";
import {ShadowBox} from "react-native-neomorph-shadows";
import NumberFormat from 'react-number-format';
import {MyImageBackground} from "../components/MyImageBackground";

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
                                {Number(item?.products_liked) > 0 ? item.products_liked : '0'}
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
                            {MyConfig.Currency.MYR.symbol} {item?.products_price}
                        </Text>
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
const ImageSliderBanner              = ({item, onPress, style}: any) => {
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
                        <Text
                            numberOfLines = {1}
                            style = {productHorizontalList.textPrice}>
                            {MyConfig.Currency.MYR.symbol} {item?.products_price}
                        </Text>
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

    return (
        <View style = {{
            /*shadowColor  : "#000",
            shadowOffset : {
                width : 0,
                height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius : 2.22,
            elevation    : 3,*/

            backgroundColor: MyColor.Material.WHITE,
            marginTop      : 1,
        }}>
            {(props?.items && Object.keys(props?.items).length > 0 && props?.items.constructor === Object) &&
             Object.keys(props?.items)
                   .map((key: string) => (
                            <View
                                key = {key}
                                style = {[cartList.view]}
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
                                    >
                                        <Text
                                            style = {cartList.textName}
                                            numberOfLines = {2}>
                                            {props.items[key].item?.products_name}
                                        </Text>

                                        <Text
                                            numberOfLines = {1}
                                            style = {cartList.textPrice}
                                        >
                                            {MyConfig.Currency.MYR.symbol} {props.items[key].item?.discount_price ? props.items[key].item?.discount_price : props.items[key].item?.products_price}
                                        </Text>
                                        {props.items[key].item?.discount_price &&
                                         <Text
                                             numberOfLines = {1}
                                             style = {cartList.textPriceDiscounted}
                                         >
                                             {MyConfig.Currency.MYR.symbol} {props.items[key].item?.products_price}
                                         </Text>
                                        }
                                    </TouchableOpacity>

                                    <View style = {cartList.viewStock}>
                                        <View style = {cartList.viewStockText}>
                                            <Text style = {cartList.textStock}>
                                                {MyLANG.AvailableStock}
                                            </Text>
                                            <Text style = {cartList.textStockNumber}>
                                                {Number(props.items[key].item?.products_liked) > 0 ? props.items[key].item.products_liked : '0'}
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

                    // borderWidth      : 1.0,
                    // borderRadius     : 50,
                    // borderColor      : MyColor.Primary.transparent40,
                    // paddingVertical  : 4,
                    paddingHorizontal: 14,
                    // backgroundColor  : MyColor.Material.GREY["12"],
                }}>

                </View>
            </LinearGradient>
        </ShadowBox>
    )
}
const CartPageBottomButtons = (props: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: CartPageBottomButtons: ', props);

    return (
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
        </ShadowBox>
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
        </View>
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
            <View style = {[notificationList.view, item?.read_status === 1 && {backgroundColor: MyColor.Material.WHITE}]}>
                <MyFastImage
                    source = {[item?.image?.length > 0 ? {'uri': item.image} : MyImage.defaultItem, MyImage.defaultItem]}
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
const AddressListItem              = ({item, onPress, rippleStyle, address_title, phone}: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: AddressListItem: ', {item});

    return (
        <MyMaterialRipple
            style = {[MyStyle.RowStartCenter, rippleStyle]}
            {...MyStyle.MaterialRipple.drawer}
            onPress = {onPress}
        >
            <MyIcon.SimpleLineIcons
                name = "direction"
                size = {22}
                color = {MyColor.textDarkSecondary2}
                style = {{alignSelf: "flex-start", marginTop: 4, marginRight: 10, marginLeft: 8}}
            />
            <View style = {[MyStyle.ColumnStart, {flex: 1}]}>
                {address_title ?
                 <>
                     <Text style = {[MyStyleSheet.textListItemTitleAlt, {}]}>{item?.company}</Text>
                     <Text style = {[MyStyleSheet.textListItemSubTitleAlt, {}]}>{item?.firstname} {item?.lastname}</Text>
                 </>
                               :
                 <Text style = {[MyStyleSheet.textListItemTitleAlt, {marginBottom: 2}]}>{item?.firstname} {item?.lastname}</Text>
                }
                <Text style = {[MyStyleSheet.textListItemSubTitleAlt, {marginBottom: 4}]}>{phone}</Text>
                <Text style = {MyStyleSheet.textListItemSubTitleAlt}>{item?.street}</Text>
                <Text style = {MyStyleSheet.textListItemSubTitleAlt}>{item?.city}</Text>
                <Text style = {MyStyleSheet.textListItemSubTitleAlt}>{item?.zone_name}</Text>
                <Text style = {MyStyleSheet.textListItemSubTitleAlt}>{item?.country_name}</Text>
                <Text style = {MyStyleSheet.textListItemSubTitleAlt}>{item?.postcode}</Text>
            </View>
            <MyIcon.Entypo
                name = "chevron-right"
                size = {20}
                color = {MyColor.Material.GREY["800"]}
                style = {{marginRight: 8}}
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
                height = {50 + (MyStyle.marginHorizontalList)}
                backgroundColor = {MyColor.Material.GREY["200"]}
                foregroundColor = {MyColor.Material.GREY["400"]}
                style = {{marginTop: MyStyle.marginVerticalList}}
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
                         <View key = {key}>
                             <ListItemSeparator/>
                             <ContentLoader
                                 speed = {2}
                                 width = {MyStyle.screenWidth}
                                 height = {10 + 6 + 140}
                                 backgroundColor = {MyColor.Material.GREY["200"]}
                                 foregroundColor = {MyColor.Material.GREY["400"]}
                                 style = {{marginVertical: MyStyle.marginVerticalList, marginHorizontal: MyStyle.marginHorizontalList}}
                             >
                                 <Rect x = {MyStyle.marginHorizontalList}
                                       y = "0"
                                       rx = "3"
                                       ry = "3"
                                       width = {MyStyle.screenWidth * 0.25}
                                       height = "10"/>
                                 <Rect x = {0}
                                       y = {10 + 6}
                                       rx = "0"
                                       ry = "0"
                                       width = {MyStyle.screenWidth - (MyStyle.marginHorizontalList * 2)}
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

// Modal Radio List:
const ModalRadioList = (props: any) => {
    MyUtil.printConsole(true, 'log', 'LOG: ModalRadioList: ', {props});

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
                    props?.items?.length > 0 &&
                    props?.items
                         .map((prop: any, index: any) =>
                                  (
                                      <MyMaterialRipple
                                          key = {index}
                                          {...MyStyle.MaterialRipple.drawer}
                                          style = {modalRadioList.viewItem}
                                          onPress = {() => props.onItem(prop)}
                                      >
                                          {/*<MyIcon.Fontisto
                                                style = {modalRadioList.iconSelectedLeft}
                                                name = "radio-btn-active"
                                                size = {18}
                                                color = {MyColor.attentionDark}
                                            />*/}
                                          {/*<MyFastImage
                                                source = {[user?.customers_picture?.length > 0 ? MyImage.defaultAvatar : MyImage.defaultAvatar, MyImage.defaultAvatar]}
                                                style = {modalRadioList.imageLeft}
                                            />*/}
                                          <View style = {modalRadioList.viewTexts}>

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
                                                   style = {[modalRadioList.textItemSubtitle, Number(prop?.id) === Number(props.selected) && {color: MyColor.Primary.first, fontFamily: MyStyle.FontFamily.OpenSans.semiBold}]}
                                               >
                                                   {prop[props.subTitleText]}
                                               </Text>
                                              }

                                              {props.bodyText &&
                                               <Text
                                                   numberOfLines = {5}
                                                   style = {modalRadioList.textItemBody}
                                               >
                                                   {prop[props.bodyText]}
                                               </Text>
                                              }

                                          </View>
                                          <MyIcon.Fontisto
                                              style = {modalRadioList.iconSelectedRight}
                                              name = {Number(prop?.id) === Number(props.selected) ? "radio-btn-active" : "radio-btn-passive"}
                                              size = {18}
                                              color = {Number(prop?.id) === Number(props.selected) ? MyColor.Primary.first : MyColor.Material.GREY["600"]}
                                          />
                                      </MyMaterialRipple>
                                  )
                         )

                }
            </View>
        </>
    )
}


//
const OrderListItem = (props: any) => {
    // MyUtil.printConsole(true, 'log', 'LOG: OrderListItem: ', Object.keys(props?.items).length);

    return (
        <>
            {
                (props?.items && Object.keys(props?.items).length > 0 && props?.items.constructor === Object) &&
                Object.keys(props?.items)
                      .map((key: string, index: number) => (
                               <View
                                   key = {key}
                                   style = {[orderList.view, {borderBottomWidth: index === (Object.keys(props?.items).length - 1) ? 0 : 0.9}]}
                               >

                                   <MyFastImage
                                       source = {[{'uri': props.items[key].item?.image}, MyImage.defaultItem]}
                                       style = {orderList.image}
                                   />

                                   <View style = {orderList.textsView}>
                                       <Text
                                           style = {orderList.textName}
                                           numberOfLines = {2}>
                                           {props.items[key].item?.products_name}
                                       </Text>

                                       <View style = {orderList.viewPrice}>
                                           <Text
                                               style = {orderList.textPrice}
                                               numberOfLines = {1}
                                           >
                                               {MyConfig.Currency.MYR.symbol} {props.items[key].item?.discount_price ? props.items[key].item?.discount_price : props.items[key].item?.products_price}
                                               &nbsp;
                                               <Text
                                                   style = {orderList.textQuantity}
                                                   numberOfLines = {1}
                                               >
                                                   x{props.items[key]?.quantity}
                                               </Text>
                                           </Text>

                                           <NumberFormat
                                               value = {props.items[key]?.total}
                                               defaultValue = {0}
                                               displayType = {'text'}
                                               thousandSeparator = {true}
                                               decimalScale = {2}
                                               fixedDecimalScale = {true}
                                               decimalSeparator = {'.'}
                                               renderText = {
                                                   (value: any) => <Text style = {orderList.textPriceTotal}>{MyConfig.Currency.MYR.symbol} {value}</Text>
                                               }
                                           />
                                       </View>

                                       {props.items[key].item?.discount_price &&
                                        <Text
                                            style = {orderList.textPriceDiscounted}
                                            numberOfLines = {1}
                                        >
                                            {MyConfig.Currency.MYR.symbol} {props.items[key].item?.products_price}
                                        </Text>
                                       }

                                   </View>

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

// CART LIST PAGE:
const cartList      = StyleSheet.create(
    {
        touchable          : {},
        view               : {
            display         : 'flex',
            flexDirection   : 'row',
            justifyContent  : 'space-around',
            marginHorizontal: MyStyle.marginHorizontalList,
            paddingVertical : MyStyle.paddingVerticalList,

            borderTopWidth: 0.9,
            borderTopColor: MyColor.dividerDark,
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
            fontFamily: MyStyle.fontFamilyPrice,
            fontSize  : 17,
            color     : MyColor.Primary.first,

            marginTop: 5,
        },
        textPriceDiscounted: {
            fontFamily        : MyStyle.fontFamilyPrice,
            fontSize          : 13,
            color             : MyColor.textDarkSecondary2,
            textDecorationLine: "line-through",
        },

        viewStock      : {
            alignSelf     : "stretch",
            display       : "flex",
            flexDirection : "row",
            justifyContent: "space-between",
            alignItems    : "flex-end",

            marginTop: 5,
        },
        viewStockText  : {
            flexDirection  : "row",
            justifyContent : "flex-start",
            alignItems     : "center",
            backgroundColor: MyColor.Material.GREY["100"],
            paddingLeft    : 6,
        },
        textStock      : {
            fontFamily: MyStyle.FontFamily.OpenSans.light,
            fontSize  : 12,
            color     : MyColor.Material.GREY["800"],
        },
        textStockNumber: {
            fontFamily       : MyStyle.FontFamily.Roboto.bold,
            color            : MyColor.Material.GREY["800"],
            fontSize         : 13,
            backgroundColor  : MyColor.Material.GREY["200"],
            paddingVertical  : 2,
            paddingHorizontal: 6,
            marginLeft       : 6,
        },

        viewStepper : {
            display       : 'flex',
            flexDirection : 'column',
            justifyContent: 'space-between',
            alignItems    : 'center',

            minWidth       : 28,
            minHeight      : MyStyle.screenWidth * 0.25,
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
            flex      : 1,
            marginLeft: MyStyle.paddingHorizontalModalItem,
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
        iconSelectedLeft : {
            paddingLeft: MyStyle.paddingHorizontalModalItem / 2,
            marginRight: 10,
        },
        iconSelectedRight: {
            marginLeft  : 6,
            paddingRight: MyStyle.paddingHorizontalModalItem / 1.5,
        },
    }
);


const orderList = StyleSheet.create(
    {
        view     : {
            display       : 'flex',
            flexDirection : 'row',
            justifyContent: 'space-around',
            alignItems    : "center",

            paddingVertical: 12,

            borderBottomWidth: 0.9,
            borderBottomColor: MyColor.dividerDark,
        },
        image    : {
            ...MyStyleSheet.imageListExtraSmall,
        },
        textsView: {
            flex: 1,

            display       : 'flex',
            flexDirection : 'column',
            justifyContent: 'space-between',

            marginLeft: MyStyle.marginHorizontalTextsView,
        },
        textName : {
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

            marginTop: 5,
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

    ProductDetailsContentLoader,
    CartPageHeader,
    CartListItem,
    CartPageBottomButtons,
    CartPageTotal,

    OptionList,
    ModalRadioList,

    OrderListItem,

    NotificationListItem,
    NotificationListItemContentLoader,
    NotificationDetailsContentLoader,

    AddressListItem,
    AddressListItemContentLoader,

    RestaurantListItem,
    RestaurantItemContentLoader,
};
