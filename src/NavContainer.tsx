import React from 'react';

import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {BackHandler} from 'react-native';
import {getImage, getMyIcon, HeaderGradientPrimary, HeaderGradientPrimaryLogo} from "./components/MyComponent";

import SplashScreen from './screens/Splash';
import LoginScreen from './screens/Login';
import SignupScreen from './screens/Signup';
import HomeScreen from './screens/Home';
import NotificationScreen from './screens/Notification';
import GoogleMapScreen from './screens/GoogleMap';
import NotificationViewScreen from './screens/NotificationView';
import TabRestaurantScreen from "./screens/TabRestaurant";
import TabFoodItemScreen from "./screens/TabFoodItem";
import IntroScreen from "./screens/Intro";

import MyUtil from "./common/MyUtil";
import {MyConfig} from "./shared/MyConfig";
import MyLANG from "./shared/MyLANG";
import {MyConstant} from "./common/MyConstant";
import {MyStyle, MyStyleCommon} from "./common/MyStyle";
import MyColor from "./common/MyColor";
import {CustomDrawerContent} from "./shared/MyContainer";
import MyImage from "./shared/MyImage";
import {HeaderCartButton} from "./components/MyButton";
import CategoryListScreen from "./screens/CategoryList";
import ProductListScreen from "./screens/ProductList";
import SearchScreen from "./screens/Search";
import CartScreen from "./screens/Cart";
import SettingsScreen from "./screens/Settings";

let lastTimeBackPress: number = 0;

const SplashStack       = createStackNavigator();
const SplashStackScreen = () => {
    return (
        <SplashStack.Navigator
            screenOptions = {{}}
        >
            <SplashStack.Screen
                name = {MyConfig.routeName.Splash}
                component = {SplashScreen}
            />
        </SplashStack.Navigator>
    );
}

const IntroStack       = createStackNavigator();
const IntroStackScreen = () => {
    return (
        <IntroStack.Navigator
            screenOptions = {MyStyleCommon.screenOptions.IntroStack}
        >
            <IntroStack.Screen
                name = {MyConfig.routeName.Intro}
                component = {IntroScreen}
            />
        </IntroStack.Navigator>
    );
}

const LoginStack       = createStackNavigator();
const LoginStackScreen = () => {
    return (
        <LoginStack.Navigator
            initialRouteName = {MyConfig.routeName.Login}
            screenOptions = {{}}
        >
            <LoginStack.Screen
                name = {MyConfig.routeName.Login}
                component = {LoginScreen}
            />
            <LoginStack.Screen
                name = {MyConfig.routeName.Signup}
                component = {SignupScreen}
            />
        </LoginStack.Navigator>
    );
}

const Drawer          = createDrawerNavigator();
const DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            initialRouteName = {MyConfig.routeName.DrawerHome}
            backBehavior = "history"
            drawerPosition = "left"
            drawerType = "front"
            drawerStyle = {{
                backgroundColor: MyColor.Material.WHITE,
            }}
            drawerContent = {props => <CustomDrawerContent {...props} />}
            drawerContentOptions = {{
                activeTintColor      : MyColor.Primary.first,
                activeBackgroundColor: MyColor.Material.GREY["200"],
                inactiveTintColor    : MyColor.Material.GREY["700"],
                itemStyle            : {},
                labelStyle           : {
                    fontSize  : 14,
                    fontFamily: MyStyle.FontFamily.OpenSans.regular,
                },
                contentContainerStyle: {},
                style                : {},
            }}
        >
            <Drawer.Screen
                name = {MyConfig.routeName.DrawerHome}
                component = {Tab1StackScreen}
                options = {{
                    drawerLabel: MyLANG.Home,
                    drawerIcon : ({focused: boolean, color: string, size: number}) => getImage(
                        {
                            source       : MyImage.customer_service_2,
                            defaultSource: MyImage.defaultDrawer,
                            resizeMode   : 'contain',
                            style        : {
                                width : 24,
                                height: 24,
                            }
                        }
                    )
                }}
            />
            <Drawer.Screen
                name = {MyConfig.routeName.DrawerNotification}
                component = {HomeScreen}
                options = {{
                    drawerLabel: MyLANG.Notifications,
                    drawerIcon : ({focused: boolean, color: string, size: number}) => getImage(
                        {
                            source       : MyImage.customer_service_2,
                            defaultSource: MyImage.defaultDrawer,
                            resizeMode   : 'contain',
                            style        : {
                                width : 24,
                                height: 24,
                            }
                        }
                    )
                }}
            />
        </Drawer.Navigator>
    );
}

// TAB STACKS:
const Tab1Stack       = createStackNavigator();
const Tab1StackScreen = () => {
    return (
        <Tab1Stack.Navigator
            screenOptions = {{}}
            // headerMode = "none"
        >
            <Tab1Stack.Screen
                name = {MyConfig.routeName.Home}
                component = {HomeScreen}
                options = {{
                    title            : "",
                    // headerShown: false,
                    headerTintColor  : MyColor.Material.WHITE,
                    headerTransparent: true,
                    headerBackground : HeaderGradientPrimaryLogo,
                    headerStyle      : {
                        height: MyStyle.HeaderHeight,
                    },
                    headerTitleStyle : {
                        color     : MyColor.Material.WHITE,
                        fontSize  : 18,
                        fontFamily: MyStyle.FontFamily.OpenSans.semiBold,
                    }
                }}
            />
            <Tab2Stack.Screen
                name = {MyConfig.routeName.ProductList}
                component = {ProductListScreen}
                options = {{
                    title            : MyLANG.Product,
                    // headerShown: false,
                    headerTintColor  : MyColor.Material.WHITE,
                    headerTransparent: true,
                    headerBackground : HeaderGradientPrimary,
                    headerStyle      : {
                        height: MyStyle.HeaderHeight,
                    },
                    headerTitleStyle : {
                        color     : MyColor.Material.WHITE,
                        fontSize  : 18,
                        fontFamily: MyStyle.FontFamily.OpenSans.semiBold,
                    },
                }}
            />
        </Tab1Stack.Navigator>
    );
}

const Tab2Stack       = createStackNavigator();
const Tab2StackScreen = () => {
    return (
        <Tab2Stack.Navigator
            screenOptions = {{}}
            // headerMode = "none"
        >
            <Tab2Stack.Screen
                name = {MyConfig.routeName.CategoryList}
                component = {CategoryListScreen}
                options = {{
                    title            : "",
                    // headerShown: false,
                    headerTintColor  : MyColor.Material.WHITE,
                    headerTransparent: true,
                    headerBackground : HeaderGradientPrimaryLogo,
                    headerStyle      : {
                        height: MyStyle.HeaderHeight,
                    },
                    headerTitleStyle : {
                        color     : MyColor.Material.WHITE,
                        fontSize  : 18,
                        fontFamily: MyStyle.FontFamily.OpenSans.semiBold,
                    }
                }}
            />
            <Tab2Stack.Screen
                name = {MyConfig.routeName.ProductList}
                component = {ProductListScreen}
                options = {{
                    title            : MyLANG.Product,
                    // headerShown: false,
                    headerTintColor  : MyColor.Material.WHITE,
                    headerTransparent: true,
                    headerBackground : HeaderGradientPrimary,
                    headerStyle      : {
                        height: MyStyle.HeaderHeight,
                    },
                    headerTitleStyle : {
                        color     : MyColor.Material.WHITE,
                        fontSize  : 18,
                        fontFamily: MyStyle.FontFamily.OpenSans.semiBold,
                    },
                }}
            />
        </Tab2Stack.Navigator>
    );
}

const Tab3Stack       = createStackNavigator();
const Tab3StackScreen = () => {
    return (
        <Tab3Stack.Navigator
            screenOptions = {{}}
            // headerMode = "none"
        >
            <Tab3Stack.Screen
                name = {MyConfig.routeName.Search}
                component = {SearchScreen}
                options = {{
                    title            : "",
                    // headerShown: false,
                    headerTintColor  : MyColor.Material.WHITE,
                    headerTransparent: true,
                    headerBackground : HeaderGradientPrimaryLogo,
                    headerStyle      : {
                        height: MyStyle.HeaderHeight,
                    },
                    headerTitleStyle : {
                        color     : MyColor.Material.WHITE,
                        fontSize  : 18,
                        fontFamily: MyStyle.FontFamily.OpenSans.semiBold,
                    }
                }}
            />
        </Tab3Stack.Navigator>
    );
}

const Tab4Stack       = createStackNavigator();
const Tab4StackScreen = () => {
    return (
        <Tab4Stack.Navigator
            screenOptions = {{}}
            // headerMode = "none"
        >
            <Tab4Stack.Screen
                name = {MyConfig.routeName.Cart}
                component = {CartScreen}
                options = {{
                    title            : "",
                    // headerShown: false,
                    headerTintColor  : MyColor.Material.WHITE,
                    headerTransparent: true,
                    headerBackground : HeaderGradientPrimaryLogo,
                    headerStyle      : {
                        height: MyStyle.HeaderHeight,
                    },
                    headerTitleStyle : {
                        color     : MyColor.Material.WHITE,
                        fontSize  : 18,
                        fontFamily: MyStyle.FontFamily.OpenSans.semiBold,
                    }
                }}
            />
        </Tab4Stack.Navigator>
    );
}

const Tab5Stack       = createStackNavigator();
const Tab5StackScreen = () => {
    return (
        <Tab5Stack.Navigator
            screenOptions = {{}}
            // headerMode = "none"
        >
            <Tab5Stack.Screen
                name = {MyConfig.routeName.Settings}
                component = {SettingsScreen}
                options = {{
                    title            : "",
                    // headerShown: false,
                    headerTintColor  : MyColor.Material.WHITE,
                    headerTransparent: true,
                    headerBackground : HeaderGradientPrimaryLogo,
                    headerStyle      : {
                        height: MyStyle.HeaderHeight,
                    },
                    headerTitleStyle : {
                        color     : MyColor.Material.WHITE,
                        fontSize  : 18,
                        fontFamily: MyStyle.FontFamily.OpenSans.semiBold,
                    }
                }}
            />
        </Tab5Stack.Navigator>
    );
}

//BOTTOM TAB:
const HomeBottomTab          = createBottomTabNavigator();
const HomeBottomTabNavigator = () => {
    return (
        <HomeBottomTab.Navigator
            initialRouteName = {MyConfig.routeName.Tab1}
            screenOptions = {({route}) => ({
                tabBarIcon: ({focused, color}) => {
                    let fontFamily = MyConstant.VectorIcon.SimpleLineIcons;
                    let iconSize   = 22;
                    let iconName;

                    switch (route.name) {
                        case MyConfig.routeName.Tab1:
                            iconName = focused ? 'home' : 'home';
                            break;
                        case MyConfig.routeName.Tab2:
                            iconName = focused ? 'grid' : 'grid';
                            break;
                        case MyConfig.routeName.Tab3:
                            iconName = focused ? 'magnifier' : 'magnifier';
                            break;
                        case MyConfig.routeName.Tab4:
                            iconName = focused ? 'basket' : 'basket';
                            break;
                        case MyConfig.routeName.Tab5:
                            iconName = focused ? 'user' : 'user';
                            break;
                        default:
                            iconName = focused ? 'home' : 'home';
                            break;
                    }

                    return getMyIcon(
                        {
                            fontFamily: fontFamily,
                            name      : iconName,
                            color     : color,
                            size      : iconSize,
                            style     : {}
                        }
                    );
                },
            })}
            tabBarOptions = {{
                activeTintColor  : MyColor.Primary.thrid,
                // activeBackgroundColor: MyColor.Material.GREY["200"],
                inactiveTintColor: MyColor.Material.GREY["550"],
                showLabel        : false,
                showIcon         : true,
            }}
        >
            <HomeBottomTab.Screen
                name = {MyConfig.routeName.Tab1}
                component = {Tab1StackScreen}
                options = {{
                    tabBarLabel: MyLANG.Home,
                }}
            />
            <HomeBottomTab.Screen
                name = {MyConfig.routeName.Tab2}
                component = {Tab2StackScreen}
                options = {{
                    tabBarLabel: MyLANG.Category
                }}
            />
            <HomeBottomTab.Screen
                name = {MyConfig.routeName.Tab3}
                component = {Tab3StackScreen}
                options = {{
                    tabBarLabel: MyLANG.Search
                }}
            />
            <HomeBottomTab.Screen
                name = {MyConfig.routeName.Tab4}
                component = {Tab4StackScreen}
                options = {{
                    tabBarLabel: MyLANG.Cart
                }}
            />
            <HomeBottomTab.Screen
                name = {MyConfig.routeName.Tab5}
                component = {Tab5StackScreen}
                options = {{
                    tabBarLabel: MyLANG.Settings
                }}
            />
        </HomeBottomTab.Navigator>
    );
}

// Back Button
/*const router                                         = {
    type: 'tab',
    getStateForAction(state: any, action: any) {
        if (state && state.index === 0 && action.type === MyConstant.NAVIGATION_ACTION.GO_BACK) {
            MyUtil.printConsole(true, 'log', 'LOG: BackHandler: ', {
                action: action,
                state : state,
            });

            if (new Date().getTime() - lastTimeBackPress < MyConfig.TimePeriodToExit) {
                BackHandler.exitApp();
                return null;
            } else {
                MyUtil.showTinyToast(
                    MyLANG.ExitAppConfirmation,
                    MyConstant.TINY_TOAST.SHORT,
                    MyStyle.TinyToast.BOTTOM,
                    MyStyle.TinyToast.containerStyleDark,
                    MyStyle.TinyToast.textStyleWhite,
                    MyStyle.TinyToast.textColorWhite,
                    null,
                    MyStyle.TinyToast.imageStyleSucess,
                    false,
                    false,
                    false,
                    0,
                    MyConstant.TINY_TOAST.HIDE_AND_SHOW,
                );

                lastTimeBackPress = new Date().getTime();

                return null;
            }
        }

        return BaseRouter.getStateForAction(state, action);
    }
}*/

const RootStack       = createStackNavigator();
const RootStackScreen = () => {
    return (
        <RootStack.Navigator
            screenOptions = {{}}
        >
            <RootStack.Screen
                name = {MyConfig.routeName.IntroStack}
                component = {IntroStackScreen}
            />
            <RootStack.Screen
                name = {MyConfig.routeName.LoginStack}
                component = {LoginStackScreen}
            />
            <RootStack.Screen
                name = {MyConfig.routeName.HomeNavigator}
                component = {HomeBottomTabNavigator}
            />
        </RootStack.Navigator>
    );
}
// if config set login required and not logged in: go to login stack, otherwise go to home stack:

const AppContainer = () => <HomeBottomTabNavigator/>;

export default AppContainer;
