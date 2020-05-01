import React, {Fragment, useCallback, useEffect, useState} from 'react';

import {
    View, SafeAreaView, ScrollView, Image, Text, StyleSheet, TouchableWithoutFeedback, RefreshControl,
} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import LinearGradient from "react-native-linear-gradient";

import MyUtil from '../common/MyUtil';
import {MyStyle, MyStyleSheet} from '../common/MyStyle';
import MyColor from '../common/MyColor';
import MyImage from '../shared/MyImage';
import {MyAPI, MyConfig} from '../shared/MyConfig';
import MyLANG from '../shared/MyLANG';
import {MyConstant} from '../common/MyConstant';
import MyIcon from '../components/MyIcon';

import {getMyIcon, StatusBarLight} from '../components/MyComponent';
import MyMaterialRipple from "../components/MyMaterialRipple";

import MyAuth from "../common/MyAuth";
import {appInfoUpdate} from "../store/AppInfoRedux";
import MyFunction from "../shared/MyFunction";
import {MyFastImage} from "../components/MyFastImage";

let renderCount = 0;

const SettingsScreen = ({route, navigation}: any) => {
    // const dispatch = useDispatch();
    // const addNote    = (note: any) => dispatch(addnote(note));
    // const deleteNote = (id: any) => dispatch(deletenote(id));
    // const deleteNote = (id: any) => dispatch({type: TOGGLE, payload: 'My payload'});

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${SettingsScreen.name}. renderCount: `, renderCount);
    }

    const dispatch = useDispatch();

    const app_info: any = useSelector((state: any) => state.app_info);

    const user: any                    = useSelector((state: any) => state.auth.user);
    const [settings, setSettings]: any = useState([]);

    useEffect(() => {

        MyUtil.printConsole(true, 'log', `LOG: ${SettingsScreen.name}. useEffect: `, {user, app_info});

        if (user.id) {
            const settingsItem = [
                /*{
                    gradient : MyStyle.LGDrawerItem,
                    ripple   : MyStyle.MaterialRipple.drawer,
                    imageLeft: null,
                    iconLeft : null,
                    textLeft : {text: MyLANG.DummyProfile},
                    textRight: {text: MyLANG.DummyPoints},
                    iconRight: {name: 'arrow-right'},
                    onPress  : {loginRequired: true, actionType: MyConstant.DrawerOnPress.Navigate, routeName: MyConfig.routeName.MyPoints},
                },*/
                {
                    gradient : MyStyle.LGDrawerItem,
                    ripple   : MyStyle.MaterialRipple.drawer,
                    imageLeft: null,
                    iconLeft : null,
                    textLeft : {text: MyLANG.MyOrders},
                    textRight: null,
                    iconRight: {name: 'arrow-right'},
                    onPress  : {loginRequired: true, actionType: MyConstant.DrawerOnPress.Navigate, routeName: MyConfig.routeName.MyOrders},
                },
                {
                    gradient : MyStyle.LGDrawerItem,
                    ripple   : MyStyle.MaterialRipple.drawer,
                    imageLeft: null,
                    iconLeft : null,
                    textLeft : {text: MyLANG.MyAddress},
                    textRight: null,
                    iconRight: {name: 'arrow-right'},
                    onPress  : {
                        loginRequired: true,
                        actionType   : MyConstant.DrawerOnPress.Navigate,
                        routeName    : MyConfig.routeName.MyAddress,
                        params       : {routeName: MyConfig.routeName.Settings, params: null}
                    },
                },
                {
                    gradient : MyStyle.LGDrawerItem,
                    ripple   : MyStyle.MaterialRipple.drawer,
                    imageLeft: null,
                    iconLeft : null,
                    textLeft : {text: MyLANG.Notifications},
                    textRight: {
                        text : Number(user?.unread_notifications) > 0 ? user?.unread_notifications : null,
                        style: {
                            fontFamily       : MyStyle.FontFamily.OpenSans.semiBold,
                            fontSize         : 11,
                            color            : MyColor.Material.WHITE,
                            backgroundColor  : MyColor.Material.PINK["500"],
                            borderRadius     : 100,
                            paddingHorizontal: 5,
                            paddingVertical  : 3
                        }
                    },
                    iconRight: {name: 'arrow-right'},
                    onPress  : {loginRequired: true, actionType: MyConstant.DrawerOnPress.Navigate, routeName: MyConfig.routeName.Notifications},
                },
                {
                    gradient : MyStyle.LGDrawerItem,
                    ripple   : MyStyle.MaterialRipple.drawer,
                    imageLeft: null,
                    iconLeft : null,
                    textLeft : {text: MyLANG.MyWishList},
                    textRight: null,
                    iconRight: {name: 'arrow-right'},
                    onPress  : {
                        loginRequired: true,
                        actionType   : MyConstant.DrawerOnPress.Navigate,
                        routeName    : MyConfig.routeName.ProductList,
                        params       : {'title': MyLANG.MyWishList, 'id': null, 'apiURL': MyAPI.wishlist, 'user_id': user?.id, 'type': 'wishlist'},
                    },
                },
                {
                    gradient : MyStyle.LGDrawerItem,
                    ripple   : MyStyle.MaterialRipple.drawer,
                    imageLeft: null,
                    iconLeft : null,
                    textLeft : {text: MyLANG.ReferAndEarn},
                    textRight: null,
                    iconRight: {name: 'arrow-right'},
                    onPress  : {loginRequired: true, actionType: MyConstant.DrawerOnPress.Navigate, routeName: MyConfig.routeName.ReferAndEarn},
                },
                {
                    gradient : MyStyle.LGDrawerItem,
                    ripple   : MyStyle.MaterialRipple.drawer,
                    imageLeft: null,
                    iconLeft : null,
                    textLeft : {text: MyLANG.RateApp},
                    textRight: null,
                    iconRight: {name: 'arrow-right'},
                    onPress  : {actionType: MyConstant.DrawerOnPress.RateApp},
                },
                {
                    gradient : MyStyle.LGDrawerItem,
                    ripple   : MyStyle.MaterialRipple.drawer,
                    imageLeft: null,
                    iconLeft : null,
                    textLeft : {text: MyLANG.ShareUs},
                    textRight: null,
                    iconRight: {name: 'arrow-right'},
                    onPress  : {actionType: MyConstant.DrawerOnPress.ShareApp},
                },
                {
                    gradient : MyStyle.LGDrawerItem,
                    ripple   : MyStyle.MaterialRipple.drawer,
                    imageLeft: null,
                    iconLeft : null,
                    textLeft : {text: MyLANG.ContactUs},
                    textRight: null,
                    iconRight: {name: 'arrow-right'},
                    onPress  : {
                        actionType: MyConstant.DrawerOnPress.Navigate,
                        routeName : MyConfig.routeName.InfoPage,
                        params    : {title: MyLANG.ContactUs, text: app_info?.contact_us}
                    },
                },
                {
                    gradient : MyStyle.LGDrawerItem,
                    ripple   : MyStyle.MaterialRipple.drawer,
                    imageLeft: null,
                    iconLeft : null,
                    textLeft : {text: MyLANG.AboutUs},
                    textRight: null,
                    iconRight: {name: 'arrow-right'},
                    onPress  : {
                        loginRequired: false,
                        actionType   : MyConstant.DrawerOnPress.Navigate,
                        routeName    : MyConfig.routeName.InfoPage,
                        params       : {title: MyLANG.AboutUs, text: app_info?.about_us}
                    },
                },
                {
                    gradient : MyStyle.LGDrawerItem,
                    ripple   : MyStyle.MaterialRipple.drawer,
                    imageLeft: null,
                    iconLeft : null,
                    textLeft : {text: MyLANG.TermsAndCondition},
                    textRight: null,
                    iconRight: {name: 'arrow-right'},
                    onPress  : {
                        loginRequired: false,
                        actionType   : MyConstant.DrawerOnPress.Navigate,
                        routeName    : MyConfig.routeName.InfoPage,
                        params       : {title: MyLANG.TermsAndCondition, text: app_info?.term_services}
                    },
                },
                {
                    gradient : MyStyle.LGDrawerItem,
                    ripple   : MyStyle.MaterialRipple.drawer,
                    imageLeft: null,
                    iconLeft : null,
                    textLeft : {text: MyLANG.RefundPolicy},
                    textRight: null,
                    iconRight: {name: 'arrow-right'},
                    onPress  : {
                        loginRequired: false,
                        actionType   : MyConstant.DrawerOnPress.Navigate,
                        routeName    : MyConfig.routeName.InfoPage,
                        params       : {title: MyLANG.RefundPolicy, text: app_info?.refund_policy}
                    },
                },
                {
                    gradient : MyStyle.LGDrawerItem,
                    ripple   : MyStyle.MaterialRipple.drawer,
                    imageLeft: null,
                    iconLeft : null,
                    textLeft : {text: MyLANG.AppVersion},
                    textRight: {text: MyConfig.app_version},
                    iconRight: {name: 'arrow-right'},
                    onPress  : {
                        actionType: MyConstant.DrawerOnPress.AppUpdateCheck,
                    },
                },
                {
                    gradient : MyStyle.LGDrawerItem,
                    ripple   : MyStyle.MaterialRipple.drawer,
                    imageLeft: null,
                    iconLeft : null,
                    textLeft : {text: MyLANG.Logout},
                    textRight: null,
                    iconRight: null,
                    onPress  : {actionType: MyConstant.DrawerOnPress.PromptLogout},
                },
            ];
            setSettings(settingsItem);
        } else {
            const settingsItem = [
                {
                    gradient : MyStyle.LGDrawerItem,
                    ripple   : MyStyle.MaterialRipple.drawer,
                    imageLeft: null,
                    iconLeft : null,
                    textLeft : {text: MyLANG.MyOrders},
                    textRight: null,
                    iconRight: {name: 'arrow-right'},
                    onPress  : {loginRequired: true, actionType: MyConstant.DrawerOnPress.Navigate, routeName: MyConfig.routeName.MyOrders},
                },
                {
                    gradient : MyStyle.LGDrawerItem,
                    ripple   : MyStyle.MaterialRipple.drawer,
                    imageLeft: null,
                    iconLeft : null,
                    textLeft : {text: MyLANG.MyAddress},
                    textRight: null,
                    iconRight: {name: 'arrow-right'},
                    onPress  : {
                        loginRequired: true,
                        actionType   : MyConstant.DrawerOnPress.Navigate,
                        routeName    : MyConfig.routeName.MyAddress,
                        params       : {routeName: MyConfig.routeName.Settings, params: null}
                    },
                },
                {
                    gradient : MyStyle.LGDrawerItem,
                    ripple   : MyStyle.MaterialRipple.drawer,
                    imageLeft: null,
                    iconLeft : null,
                    textLeft : {text: MyLANG.Notifications},
                    textRight: {
                        text : Number(user?.unread_notifications) > 0 ? user?.unread_notifications : null,
                        style: {
                            fontFamily       : MyStyle.FontFamily.OpenSans.semiBold,
                            fontSize         : 11,
                            color            : MyColor.Material.WHITE,
                            backgroundColor  : MyColor.Material.PINK["500"],
                            borderRadius     : 100,
                            paddingHorizontal: 5,
                            paddingVertical  : 3
                        }
                    },
                    iconRight: {name: 'arrow-right'},
                    onPress  : {loginRequired: true, actionType: MyConstant.DrawerOnPress.Navigate, routeName: MyConfig.routeName.Notifications},
                },
                {
                    gradient : MyStyle.LGDrawerItem,
                    ripple   : MyStyle.MaterialRipple.drawer,
                    imageLeft: null,
                    iconLeft : null,
                    textLeft : {text: MyLANG.MyWishList},
                    textRight: null,
                    iconRight: {name: 'arrow-right'},
                    onPress  : {
                        loginRequired: true,
                        actionType   : MyConstant.DrawerOnPress.Navigate,
                        routeName    : MyConfig.routeName.ProductList,
                        params       : {'title': MyLANG.MyWishList, 'id': null, 'apiURL': MyAPI.wishlist, 'user_id': user?.id, 'type': 'wishlist'},
                    },
                },
                {
                    gradient : MyStyle.LGDrawerItem,
                    ripple   : MyStyle.MaterialRipple.drawer,
                    imageLeft: null,
                    iconLeft : null,
                    textLeft : {text: MyLANG.ReferAndEarn},
                    textRight: null,
                    iconRight: {name: 'arrow-right'},
                    onPress  : {loginRequired: true, actionType: MyConstant.DrawerOnPress.Navigate, routeName: MyConfig.routeName.ReferAndEarn},
                },
                {
                    gradient : MyStyle.LGDrawerItem,
                    ripple   : MyStyle.MaterialRipple.drawer,
                    imageLeft: null,
                    iconLeft : null,
                    textLeft : {text: MyLANG.RateApp},
                    textRight: null,
                    iconRight: {name: 'arrow-right'},
                    onPress  : {actionType: MyConstant.DrawerOnPress.RateApp},
                },
                {
                    gradient : MyStyle.LGDrawerItem,
                    ripple   : MyStyle.MaterialRipple.drawer,
                    imageLeft: null,
                    iconLeft : null,
                    textLeft : {text: MyLANG.ShareUs},
                    textRight: null,
                    iconRight: {name: 'arrow-right'},
                    onPress  : {actionType: MyConstant.DrawerOnPress.ShareApp},
                },
                {
                    gradient : MyStyle.LGDrawerItem,
                    ripple   : MyStyle.MaterialRipple.drawer,
                    imageLeft: null,
                    iconLeft : null,
                    textLeft : {text: MyLANG.ContactUs},
                    textRight: null,
                    iconRight: {name: 'arrow-right'},
                    onPress  : {
                        actionType: MyConstant.DrawerOnPress.Navigate,
                        routeName : MyConfig.routeName.InfoPage,
                        params    : {title: MyLANG.ContactUs, text: app_info?.contact_us}
                    },
                },
                {
                    gradient : MyStyle.LGDrawerItem,
                    ripple   : MyStyle.MaterialRipple.drawer,
                    imageLeft: null,
                    iconLeft : null,
                    textLeft : {text: MyLANG.AboutUs},
                    textRight: null,
                    iconRight: {name: 'arrow-right'},
                    onPress  : {
                        actionType: MyConstant.DrawerOnPress.Navigate,
                        routeName : MyConfig.routeName.InfoPage,
                        params    : {title: MyLANG.AboutUs, text: app_info?.about_us}
                    },
                },
                {
                    gradient : MyStyle.LGDrawerItem,
                    ripple   : MyStyle.MaterialRipple.drawer,
                    imageLeft: null,
                    iconLeft : null,
                    textLeft : {text: MyLANG.TermsAndCondition},
                    textRight: null,
                    iconRight: {name: 'arrow-right'},
                    onPress  : {
                        loginRequired: false,
                        actionType   : MyConstant.DrawerOnPress.Navigate,
                        routeName    : MyConfig.routeName.InfoPage,
                        params       : {title: MyLANG.TermsAndCondition, text: app_info?.term_services}
                    },
                },
                {
                    gradient : MyStyle.LGDrawerItem,
                    ripple   : MyStyle.MaterialRipple.drawer,
                    imageLeft: null,
                    iconLeft : null,
                    textLeft : {text: MyLANG.RefundPolicy},
                    textRight: null,
                    iconRight: {name: 'arrow-right'},
                    onPress  : {
                        loginRequired: false,
                        actionType   : MyConstant.DrawerOnPress.Navigate,
                        routeName    : MyConfig.routeName.InfoPage,
                        params       : {title: MyLANG.RefundPolicy, text: app_info?.refund_policy}
                    },
                },
                {
                    gradient : MyStyle.LGDrawerItem,
                    ripple   : MyStyle.MaterialRipple.drawer,
                    imageLeft: null,
                    iconLeft : null,
                    textLeft : {text: MyLANG.AppVersion},
                    textRight: {text: MyConfig.app_version},
                    iconRight: {name: 'arrow-right'},
                    onPress  : {
                        actionType: MyConstant.DrawerOnPress.AppUpdateCheck,
                    },
                },
            ];
            setSettings(settingsItem);
        }

    }, [user, app_info]);

    useEffect(() => {

        MyFunction.fetchAppData(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <Fragment>
            <StatusBarLight/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView1}/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <View style = {[MyStyleSheet.SafeAreaView3, {backgroundColor: MyColor.backgroundGrey}]}>

                    <ScrollView
                        contentInsetAdjustmentBehavior = "automatic"
                        contentContainerStyle = {{paddingTop: MyStyle.headerHeightAdjusted}}
                    >
                        <View style = {settingsItem.viewProfileSection}>

                            <View style = {settingsItem.viewImageProfile}>
                                <MyFastImage
                                    source = {[user?.customers_picture?.length > 9 ? {'uri': user?.customers_picture} : MyImage.defaultAvatar, MyImage.defaultAvatar]}
                                    style = {settingsItem.imageProfile}
                                />
                            </View>
                            <TouchableWithoutFeedback
                                onPress = {
                                    () => {
                                        MyUtil.commonAction(user.id ? true : false,
                                                            navigation,
                                                            MyConstant.CommonAction.navigate,
                                                            user.id ? MyConfig.routeName.EditProfile : MyConfig.routeName.Login,
                                                            {splash: false},
                                                            null
                                        );
                                    }
                                }
                            >
                                <View style = {settingsItem.viewTextProfile}>
                                    <Text
                                        style = {settingsItem.textUserName}
                                        numberOfLines = {1}
                                    >
                                        {user.id ? `${user?.customers_firstname} ${user?.customers_lastname}` : MyLANG.Guest}
                                    </Text>
                                    <View style = {settingsItem.viewEditProfile}>
                                        <Text
                                            style = {settingsItem.textEditProfile}
                                            numberOfLines = {1}
                                        >
                                            {user.id ? MyLANG.EditProfile : MyLANG.LoginRegister}
                                        </Text>
                                        <MyIcon.SimpleLineIcons
                                            name = "arrow-right"
                                            size = {10}
                                            color = {MyColor.Material.GREY["700"]}
                                            style = {{marginLeft: 10, paddingTop: 2}}
                                        />
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>

                        <View style = {settingsItem.viewSettingsSection}>
                            {settings.map((prop: any, key: any) => (

                                <LinearGradient
                                    key = {key}
                                    style = {settingsItem.linearGradientStyles}
                                    {...prop.gradient}
                                >
                                    <MyMaterialRipple
                                        style = {settingsItem.materialRipple}
                                        {...prop.ripple}
                                        onPress = {
                                            () =>
                                                settingsItemOnPress(prop.onPress?.loginRequired,
                                                                    navigation,
                                                                    prop.onPress?.actionType,
                                                                    prop.onPress?.routeName,
                                                                    prop.onPress?.params,
                                                                    prop.onPress?.navigationActions,
                                                )
                                        }
                                    >
                                        <View style = {[settingsItem.viewItem, {borderBottomWidth: key === (settings.length - 1) ? 0 : 0.9}]}>
                                            <View style = {settingsItem.viewLeftItem}>
                                                {prop.imageLeft?.src &&
                                                 <Image
                                                     source = {prop.imageLeft?.src || MyImage.defaultAvatar}
                                                     resizeMode = "contain"
                                                     style = {[settingsItem.imageLeft, prop.imageLeft?.style]}
                                                 />
                                                }
                                                {prop.iconLeft?.name &&
                                                 getMyIcon(
                                                     {
                                                         fontFamily: prop.iconLeft?.fontFamily || MyConstant.VectorIcon.SimpleLineIcons,
                                                         name      : prop.iconLeft?.name,
                                                         size      : prop.iconLeft?.size || 20,
                                                         style     : [settingsItem.iconLeft, prop.iconLeft?.style]
                                                     }
                                                 )
                                                }
                                                {prop.textLeft?.text &&
                                                 <View style = {MyStyle.ColumnCenterStart}>
                                                     <Text
                                                         style = {[settingsItem.textLeft, prop.textLeft?.style]}
                                                         numberOfLines = {1}
                                                     >
                                                         {prop.textLeft?.text}
                                                     </Text>
                                                     {prop.textLeft?.subText &&
                                                      <Text
                                                          style = {[settingsItem.subTextLeft, prop.subTextLeft?.style]}
                                                          numberOfLines = {1}
                                                      >
                                                          {prop.textLeft?.subText}
                                                      </Text>
                                                     }
                                                 </View>
                                                }
                                            </View>
                                            <View style = {settingsItem.viewRightItem}>
                                                {prop.textRight?.text &&
                                                 <Text
                                                     style = {[settingsItem.textRight, prop.textRight?.style]}
                                                     numberOfLines = {1}
                                                 >
                                                     {prop.textRight?.text}
                                                 </Text>
                                                }
                                                {prop.iconRight?.name &&
                                                 getMyIcon(
                                                     {
                                                         fontFamily: prop.iconRight?.fontFamily || MyConstant.VectorIcon.SimpleLineIcons,
                                                         name      : prop.iconRight?.name,
                                                         size      : prop.iconRight?.size || 11,
                                                         style     : [settingsItem.iconRight, prop.iconRight?.style]
                                                     }
                                                 )
                                                }
                                            </View>
                                        </View>
                                    </MyMaterialRipple>
                                </LinearGradient>
                            ))
                            }
                        </View>
                    </ScrollView>

                </View>
            </SafeAreaView>
        </Fragment>
    )
}

const settingsItemOnPress = (loginRequired: boolean, navigation: any, actionType: string, routeName: any, params: any, navigationActions: any) => {
    MyUtil.printConsole(true, 'log', 'LOG: settingsItemOnPress: ', {
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
                MyUtil.drawerAction(loginRequired, navigation, MyConstant.DrawerAction.jumpTo, routeName, params, null);
                break;
            case MyConstant.DrawerOnPress.TabJump:
                MyUtil.tabAction(loginRequired, navigation, MyConstant.TabAction.jumpTo, routeName, params, null);
                break;
            case MyConstant.DrawerOnPress.RateApp:
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
            case MyConstant.DrawerOnPress.AppUpdateCheck:
                MyFunction.appUpdateCheck(true, MyLANG.PleaseWait + '...', {
                    'showMessage': MyConstant.SHOW_MESSAGE.TOAST,
                    'message'    : MyLANG.YourAppIsUptoDate
                });
                break;
            case MyConstant.DrawerOnPress.ShowModal:

                break;
            default:
                break;
        }
    }
};


SettingsScreen.navigationOptions = {}

const settingsItem = StyleSheet.create(
    {
        viewProfileSection: {
            display       : "flex",
            flexDirection : "row",
            justifyContent: "flex-start",
            alignItems    : "center",

            backgroundColor: MyColor.Material.WHITE,

            marginTop   : MyStyle.marginVerticalList / 2,
            marginBottom: MyStyle.marginViewGapCard,

            paddingVertical  : MyStyle.paddingVerticalPage,
            paddingHorizontal: MyStyle.paddingHorizontalList,
        },
        viewImageProfile  : {
            width       : 90,
            height      : 90,
            borderRadius: 600,

            backgroundColor: MyColor.Material.GREY["100"],
        },
        imageProfile      : {
            width       : 90,
            height      : 90,
            borderRadius: 600,
        },
        viewTextProfile   : {
            display       : "flex",
            flexDirection : "column",
            justifyContent: "center",
            alignItems    : "flex-start",

            marginLeft: 15,
        },
        textUserName      : {
            fontFamily: MyStyle.FontFamily.OpenSans.bold,
            fontSize  : 20,
            color     : MyColor.textDarkPrimary,
        },

        viewEditProfile: {
            display       : "flex",
            flexDirection : "row",
            justifyContent: "flex-start",
            alignItems    : "center",

            marginTop: 5,
        },
        textEditProfile: {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 14,
            color     : MyColor.textDarkSecondary,
        },

        viewSettingsSection : {
            paddingBottom: MyStyle.marginVerticalPage,
        },
        linearGradientStyles: {},
        materialRipple      : {},

        viewItem      : {
            display       : "flex",
            flexDirection : "row",
            justifyContent: "space-between",
            alignItems    : "center",

            flexWrap: "wrap",

            marginHorizontal : 14,
            paddingHorizontal: 6,
            paddingVertical  : 21,

            borderBottomColor: MyColor.dividerDark
        },
        viewLeftItem  : {
            display       : "flex",
            flexDirection : "row",
            justifyContent: "flex-start",
            alignItems    : "center",

            paddingRight: 3,
        },
        viewRightItem : {
            display       : "flex",
            flexDirection : "row",
            justifyContent: "flex-end",
            alignItems    : "center",

            paddingLeft: 3,
        },
        iconLeft      : {
            color      : MyColor.Material.GREY["600"],
            marginRight: 14,
            paddingTop : 2,
        },
        imageLeft     : {
            width      : 14,
            height     : 14,
            marginRight: 10,
        },
        textLeft      : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 14,
            color     : MyColor.Material.GREY["965"],

            textTransform: "capitalize",

            // paddingBottom: 2,
        },
        subTextLeft   : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 12,
            color     : MyColor.Material.GREY["965"],

            textTransform: "capitalize",

            // paddingBottom: 2,
        },
        textRight     : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 14,
            color     : MyColor.Material.GREY["965"],

            textTransform: "capitalize",

            marginRight: 8,

            // marginBottom: 2,
        },
        iconRight     : {
            color     : MyColor.Material.GREY["400"],
            paddingTop: 2,
        },
        textItemActive: {
            color: MyColor.Material.BLACK,
        },
    }
);


export default SettingsScreen;

