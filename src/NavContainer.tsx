import React from 'react';

import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createDrawerNavigator} from "@react-navigation/drawer";

import {HeaderButtonLeft} from "./components/MyButton";
import {getImage, getMyIcon, HeaderGradientPrimary, HeaderGradientPrimaryLogo, MyHeaderBackButton} from "./components/MyComponent";
import {CustomDrawerContent, CartIconWithBadge} from "./shared/MyContainer";

import SplashScreen from './screens/Splash';

import IntroScreen from "./screens/Intro";

import SigninScreen from './screens/Signin';
import SignupScreen from './screens/Signup';
import SignupCompletedScreen from "./screens/SignupCompleted";
import PasswordForgotScreen from "./screens/PasswordForgot";
import PasswordResetScreen from "./screens/PasswordReset";

import HomeScreen from './screens/Home';
import CategoryListScreen from "./screens/CategoryList";
import SearchScreen from "./screens/Search";
import SettingsScreen from "./screens/Settings";

import ProductListScreen from "./screens/ProductList";
import ProductDetailsScreen from "./screens/ProductDetails";
import CartScreen from "./screens/Cart";
import ProductBuyScreen from "./screens/ProductBuy";
import ProductBuyPayment from "./screens/ProductBuyPayment";
import ProductBuySuccess from "./screens/ProductBuySuccess";

import EditProfile from './screens/EditProfile';
import MyAddress from "./screens/MyAddress";

import NotificationScreen from './screens/Notification';
import NotificationViewScreen from './screens/NotificationView';

import InfoPage from "./screens/InfoPage";
import GoogleMapScreen from './screens/GoogleMap';

import MyUtil from "./common/MyUtil";
import {MyConfig} from "./shared/MyConfig";
import MyLANG from "./shared/MyLANG";
import {MyConstant} from "./common/MyConstant";
import {MyStyle, MyStyleCommon} from "./common/MyStyle";
import MyColor from "./common/MyColor";
import MyImage from "./shared/MyImage";
import {View} from "react-native";
import MyAddressForm from "./screens/MyAddressForm";
import ReferAndEarn from "./screens/ReferAndEarn";
import OptionPage from "./screens/OptionPage";
import MyWebViewScreen from "./screens/MyWebView";


let lastTimeBackPress: number = 0;

// SPLASH
const SplashStack       = createStackNavigator();
const SplashStackScreen = () => {
    return (
        <SplashStack.Navigator screenOptions = {MyStyleCommon.StackScreenOptions.SplashStack}>
            <SplashStack.Screen
                name = {MyConfig.routeName.Splash}
                component = {SplashScreen}
            />
        </SplashStack.Navigator>
    );
}

// INTRO
const IntroStack       = createStackNavigator();
const IntroStackScreen = () => {
    return (
        <IntroStack.Navigator screenOptions = {MyStyleCommon.StackScreenOptions.IntroStack}>
            <IntroStack.Screen
                name = {MyConfig.routeName.Intro}
                component = {IntroScreen}
            />
        </IntroStack.Navigator>
    );
}

// LOGIN
const LoginStack       = createStackNavigator();
const LoginScreens     = <>
    <LoginStack.Screen
        name = {MyConfig.routeName.Login}
        component = {SigninScreen}
        options = {{
            title: "",
            ...MyStyleCommon.StackOptions.LoginStack,
        }}
    />
    <LoginStack.Screen
        name = {MyConfig.routeName.Signup}
        component = {SignupScreen}
        options = {{
            title: "",
            ...MyStyleCommon.StackOptions.LoginStack,
        }}
    />
    <LoginStack.Screen
        name = {MyConfig.routeName.SignupCompleted}
        component = {SignupCompletedScreen}
        options = {{
            title     : "",
            headerLeft: () => (
                <HeaderBackButton
                    onPress = {
                        () =>
                            MyUtil.commonAction(false,
                                                null,
                                                MyConstant.CommonAction.navigate,
                                                MyConfig.routeName.Login,
                                                {splash: false},
                                                null
                            )
                    }
                    tintColor = {MyColor.Material.BLACK}
                />
            ),
            ...MyStyleCommon.StackOptions.LoginStack,
        }}
    />
    <LoginStack.Screen
        name = {MyConfig.routeName.PasswordForgot}
        component = {PasswordForgotScreen}
        options = {{
            title: "",
            ...MyStyleCommon.StackOptions.LoginStack,
        }}
    />
    <LoginStack.Screen
        name = {MyConfig.routeName.PasswordReset}
        component = {PasswordResetScreen}
        options = {{
            title: "",
            ...MyStyleCommon.StackOptions.LoginStack,
        }}
    />
</>;
const LoginStackScreen = () => {
    return (
        <LoginStack.Navigator
            initialRouteName = {MyConfig.routeName.Login}
            screenOptions = {MyStyleCommon.StackScreenOptions.LoginStack}
        >

            {LoginScreens}

        </LoginStack.Navigator>
    );
}

// TAB STACKS:
const HomeStack   = createStackNavigator();
const HomeScreens =
          <>
              <HomeStack.Screen
                  name = {MyConfig.routeName.Home}
                  component = {HomeScreen}
                  options = {({route, navigation}: any) => ({
                      title           : "",
                      headerLeft      : () =>
                          <HeaderButtonLeft
                              icon = {{name: 'menu'}}
                              onPress = {
                                  () => MyUtil.drawerAction(false,
                                                            null,
                                                            MyConstant.DrawerAction.toggleDrawer,
                                                            null,
                                                            null,
                                                            null
                                  )
                              }
                          />,
                      headerBackground: HeaderGradientPrimaryLogo,
                      ...MyStyleCommon.StackOptions.BottomTabStack,
                  })}
              />
              <HomeStack.Screen
                  name = {MyConfig.routeName.CategoryList}
                  component = {CategoryListScreen}
                  options = {({route, navigation}: any) => ({
                      title           : "",
                      headerLeft      : () =>
                          <HeaderButtonLeft
                              icon = {{name: 'menu'}}
                              onPress = {
                                  () => MyUtil.drawerAction(false,
                                                            null,
                                                            MyConstant.DrawerAction.toggleDrawer,
                                                            null,
                                                            null,
                                                            null
                                  )
                              }
                          />,
                      headerBackground: HeaderGradientPrimaryLogo,
                      ...MyStyleCommon.StackOptions.BottomTabStack,
                  })}
              />
              <HomeStack.Screen
                  name = {MyConfig.routeName.Search}
                  component = {SearchScreen}
                  options = {({route, navigation}: any) => ({
                      title                    : "",
                      /*header: ({scene, previous, navigation}) => {
                          const {options} = scene.descriptor;
                          const title     = "";
                          return (
                              <MyHeaderSearch
                                  title = {title}
                                  style = {options.headerStyle}
                              />
                          );
                      },*/
                      ...MyStyleCommon.StackOptions.BottomTabStack,
                      headerTitleContainerStyle: { // important
                          // right: 0,
                      },
                  })}
              />
              <HomeStack.Screen
                  name = {MyConfig.routeName.Cart}
                  component = {CartScreen}
                  options = {({route, navigation}: any) => ({
                      title           : "",
                      headerLeft      : (props: any) =>
                          /* route?.params?.NAVIGATION_PARAMS_ACTION === MyConstant.NAVIGATION_PARAMS_ACTION.NO_HEADER_LEFT_PUSH ?
                           <HeaderBackButton {...props}/>*/
                          <HeaderButtonLeft
                              icon = {{name: 'menu'}}
                              onPress = {
                                  () => MyUtil.drawerAction(false,
                                                            null,
                                                            MyConstant.DrawerAction.toggleDrawer,
                                                            null,
                                                            null,
                                                            null
                                  )
                              }
                          />,
                      headerBackground: HeaderGradientPrimaryLogo,
                      ...MyStyleCommon.StackOptions.BottomTabStack,
                  })}
              />
              <HomeStack.Screen
                  name = {MyConfig.routeName.Settings}
                  component = {SettingsScreen}
                  options = {({route, navigation}: any) => ({
                      title           : "",
                      headerLeft      : () =>
                          <HeaderButtonLeft
                              icon = {{name: 'menu'}}
                              onPress = {
                                  () => MyUtil.drawerAction(false,
                                                            null,
                                                            MyConstant.DrawerAction.toggleDrawer,
                                                            null,
                                                            null,
                                                            null
                                  )
                              }
                          />,
                      headerBackground: HeaderGradientPrimaryLogo,
                      ...MyStyleCommon.StackOptions.BottomTabStack,
                  })}
              />

              <HomeStack.Screen
                  name = {MyConfig.routeName.ProductList}
                  component = {ProductListScreen}
                  options = {{
                      title           : MyLANG.Product,
                      headerBackground: HeaderGradientPrimary,
                      ...MyStyleCommon.StackOptions.BottomTabStack
                  }}
              />
              <HomeStack.Screen
                  name = {MyConfig.routeName.ProductDetails}
                  component = {ProductDetailsScreen}
                  options = {{
                      title          : "",
                      // headerBackground: HeaderGradientPrimary,
                      headerLeft     : (props: any) => <MyHeaderBackButton  {...props}/>,
                      ...MyStyleCommon.StackOptions.BottomTabStack,
                      headerTintColor: MyColor.Material.BLACK,
                  }}
              />
              <HomeStack.Screen
                  name = {MyConfig.routeName.ProductBuy}
                  component = {ProductBuyScreen}
                  options = {{
                      title           : MyLANG.Cart,
                      headerBackground: HeaderGradientPrimary,
                      ...MyStyleCommon.StackOptions.BottomTabStack,
                  }}
              />
              <HomeStack.Screen
                  name = {MyConfig.routeName.ProductBuyPayment}
                  component = {ProductBuyPayment}
                  options = {{
                      title           : MyLANG.Payment,
                      headerBackground: HeaderGradientPrimary,
                      ...MyStyleCommon.StackOptions.BottomTabStack,
                  }}
              />
              <HomeStack.Screen
                  name = {MyConfig.routeName.ProductBuySuccess}
                  component = {ProductBuySuccess}
                  options = {{
                      title          : "",
                      headerLeft     : () => (
                          <HeaderBackButton
                              onPress = {
                                  () =>
                                      MyUtil.commonAction(false,
                                                          null,
                                                          MyConstant.CommonAction.navigate,
                                                          MyConfig.routeName.Home,
                                                          null,
                                                          null,
                                      )
                              }
                              tintColor = {MyColor.Material.BLACK}
                          />
                      ),
                      ...MyStyleCommon.StackOptions.BottomTabStack,
                      headerTintColor: MyColor.Material.BLACK,
                  }}
              />

              <HomeStack.Screen
                  name = {MyConfig.routeName.EditProfile}
                  component = {EditProfile}
                  options = {{
                      title          : "",
                      // headerBackground: HeaderGradientPrimary,
                      ...MyStyleCommon.StackOptions.BottomTabStack,
                      headerTintColor: MyColor.Material.BLACK,
                  }}
              />
              <HomeStack.Screen
                  name = {MyConfig.routeName.MyPoints}
                  component = {NotificationViewScreen}
                  options = {{
                      title           : MyLANG.MyPoints,
                      headerBackground: HeaderGradientPrimary,
                      ...MyStyleCommon.StackOptions.BottomTabStack,
                  }}
              />
              <HomeStack.Screen
                  name = {MyConfig.routeName.MyOrders}
                  component = {NotificationViewScreen}
                  options = {{
                      title           : MyLANG.MyOrders,
                      headerBackground: HeaderGradientPrimary,
                      ...MyStyleCommon.StackOptions.BottomTabStack,
                  }}
              />
              <HomeStack.Screen
                  name = {MyConfig.routeName.MyAddress}
                  component = {MyAddress}
                  options = {{
                      title           : MyLANG.MyAddress,
                      headerBackground: HeaderGradientPrimary,
                      ...MyStyleCommon.StackOptions.BottomTabStack,
                  }}
              />
              <HomeStack.Screen
                  name = {MyConfig.routeName.MyAddressForm}
                  component = {MyAddressForm}
                  options = {{
                      title           : '',
                      headerBackground: HeaderGradientPrimary,
                      ...MyStyleCommon.StackOptions.BottomTabStack,
                  }}
              />
              <HomeStack.Screen
                  name = {MyConfig.routeName.Notifications}
                  component = {NotificationScreen}
                  options = {{
                      title           : MyLANG.Notifications,
                      headerBackground: HeaderGradientPrimary,
                      ...MyStyleCommon.StackOptions.BottomTabStack,
                  }}
              />
              <HomeStack.Screen
                  name = {MyConfig.routeName.NotificationView}
                  component = {NotificationViewScreen}
                  options = {{
                      title           : MyLANG.NotificationsDetails,
                      headerBackground: HeaderGradientPrimary,
                      ...MyStyleCommon.StackOptions.BottomTabStack,
                  }}
              />
              <HomeStack.Screen
                  name = {MyConfig.routeName.ReferAndEarn}
                  component = {ReferAndEarn}
                  options = {{
                      title          : "",
                      // headerBackground: HeaderGradientPrimary,
                      ...MyStyleCommon.StackOptions.BottomTabStack,
                      headerTintColor: MyColor.Material.BLACK,
                  }}
              />
              <HomeStack.Screen
                  name = {MyConfig.routeName.ContactUs}
                  component = {NotificationViewScreen}
                  options = {{
                      title           : MyLANG.ContactUs,
                      headerBackground: HeaderGradientPrimary,
                      ...MyStyleCommon.StackOptions.BottomTabStack,
                  }}
              />
              <HomeStack.Screen
                  name = {MyConfig.routeName.AboutUs}
                  component = {NotificationViewScreen}
                  options = {{
                      title           : MyLANG.AboutUs,
                      headerBackground: HeaderGradientPrimary,
                      ...MyStyleCommon.StackOptions.BottomTabStack,
                  }}
              />
              <HomeStack.Screen
                  name = {MyConfig.routeName.TermsAndCondition}
                  component = {NotificationViewScreen}
                  options = {{
                      title           : MyLANG.TermsAndCondition,
                      headerBackground: HeaderGradientPrimary,
                      ...MyStyleCommon.StackOptions.BottomTabStack,
                  }}
              />

              <HomeStack.Screen
                  name = {MyConfig.routeName.InfoPage}
                  component = {InfoPage}
                  options = {{
                      title           : MyLANG.Information,
                      headerBackground: HeaderGradientPrimary,
                      ...MyStyleCommon.StackOptions.BottomTabStack,
                  }}
              />
              <HomeStack.Screen
                  name = {MyConfig.routeName.GoogleMap}
                  component = {GoogleMapScreen}
                  options = {{
                      title                    : "",
                      // headerBackground: HeaderGradientPrimary,
                      headerLeft               : null,
                      ...MyStyleCommon.StackOptions.BottomTabStack,
                      headerTintColor          : MyColor.Material.BLACK,
                      headerTitleContainerStyle: { // important
                          // right: 0,
                      },
                  }}
              />

              <HomeStack.Screen
                  name = {MyConfig.routeName.OptionPage}
                  component = {OptionPage}
                  options = {{
                      title                    : "",
                      // headerBackground: HeaderGradientPrimary,
                      ...MyStyleCommon.StackOptions.BottomTabStack,
                      headerTitleContainerStyle: { // important
                          // right: 0,
                      },
                  }}
              />
              <HomeStack.Screen
                  name = {MyConfig.routeName.MyWebViewPage}
                  component = {MyWebViewScreen}
                  options = {{
                      title                    : "",
                      // headerBackground: HeaderGradientPrimary,
                      headerLeft               : null,
                      ...MyStyleCommon.StackOptions.BottomTabStack,
                      headerTintColor          : MyColor.Material.BLACK,
                      headerTitleContainerStyle: { // important
                          // right: 0,
                      },
                  }}
              />
          </>;

// TAB 1-2-3 STACKS:
const Tab1Stack       = createStackNavigator();
const Tab1StackScreen = () => {
    return (
        <Tab1Stack.Navigator initialRouteName = {MyConfig.routeName.Home}>
            {HomeScreens}
            {LoginScreens}
        </Tab1Stack.Navigator>
    );
}

const Tab2Stack       = createStackNavigator();
const Tab2StackScreen = () => {
    return (
        <Tab2Stack.Navigator initialRouteName = {MyConfig.routeName.CategoryList}>
            {HomeScreens}
            {LoginScreens}
        </Tab2Stack.Navigator>
    );
}

const Tab3Stack       = createStackNavigator();
const Tab3StackScreen = () => {
    return (
        <Tab3Stack.Navigator initialRouteName = {MyConfig.routeName.Search}>
            {HomeScreens}
            {LoginScreens}
        </Tab3Stack.Navigator>
    );
}

const Tab4Stack       = createStackNavigator();
const Tab4StackScreen = () => {
    return (
        <Tab4Stack.Navigator initialRouteName = {MyConfig.routeName.Cart}>
            {HomeScreens}
            {LoginScreens}
        </Tab4Stack.Navigator>
    );
}

const Tab5Stack       = createStackNavigator();
const Tab5StackScreen = () => {
    return (
        <Tab5Stack.Navigator initialRouteName = {MyConfig.routeName.Settings}>
            {HomeScreens}
            {LoginScreens}
        </Tab5Stack.Navigator>
    );
}

// BOTTOM TAB:
const BottomTab          = createBottomTabNavigator();
const BottomTabNavigator = () => {
    return (
        <BottomTab.Navigator
            initialRouteName = {MyConfig.routeName.BottomTab1}
            screenOptions = {({route}) => ({
                tabBarIcon: ({focused, color}) => {
                    let fontFamily = MyConstant.VectorIcon.SimpleLineIcons;
                    let size       = 22;
                    let name;

                    switch (route.name) {
                        case MyConfig.routeName.BottomTab1:
                            name = focused ? 'home' : 'home';
                            break;
                        case MyConfig.routeName.BottomTab2:
                            name = focused ? 'grid' : 'grid';
                            break;
                        case MyConfig.routeName.BottomTab3:
                            name = focused ? 'magnifier' : 'magnifier';
                            break;
                        case MyConfig.routeName.BottomTab4:
                            name = focused ? 'basket' : 'basket';
                            return (
                                <CartIconWithBadge
                                    fontFamily = {fontFamily}
                                    name = {name}
                                    color = {color}
                                    size = {size}
                                    style = {{}}
                                />
                            );
                        case MyConfig.routeName.BottomTab5:
                            name = focused ? 'user' : 'user';
                            break;
                        default:
                            name = focused ? 'home' : 'home';
                            break;
                    }

                    return getMyIcon(
                        {
                            fontFamily: fontFamily,
                            name      : name,
                            color     : color,
                            size      : size,
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
            <BottomTab.Screen
                name = {MyConfig.routeName.BottomTab1}
                component = {Tab1StackScreen}
                options = {({route}: any) => ({
                    tabBarLabel  : MyLANG.Home,
                    tabBarVisible: route?.state?.index > 0 ? false : true,
                })}
            />
            <BottomTab.Screen
                name = {MyConfig.routeName.BottomTab2}
                component = {Tab2StackScreen}
                options = {({route}: any) => ({
                    tabBarLabel  : MyLANG.Category,
                    tabBarVisible: route?.state?.index > 0 ? false : true,
                })}
            />
            <BottomTab.Screen
                name = {MyConfig.routeName.BottomTab3}
                component = {Tab3StackScreen}
                options = {({route}: any) => ({
                    tabBarLabel  : MyLANG.Search,
                    tabBarVisible: route?.state?.index > 0 ? false : true,
                })}
            />
            <BottomTab.Screen
                name = {MyConfig.routeName.BottomTab4}
                component = {Tab4StackScreen}
                options = {({route}: any) => ({
                    tabBarLabel  : MyLANG.Cart,
                    tabBarVisible: route?.state?.index > 0 ? false : true,
                })}
            />
            <BottomTab.Screen
                name = {MyConfig.routeName.BottomTab5}
                component = {Tab5StackScreen}
                options = {({route}: any) => ({
                    tabBarLabel  : MyLANG.Settings,
                    tabBarVisible: route?.state?.index > 0 ? false : true,
                })}
            />
        </BottomTab.Navigator>
    );
}

// DRAWER:
const Drawer          = createDrawerNavigator();
const DrawerNavigator = () => {

    return (
        <Drawer.Navigator
            initialRouteName = {MyConfig.routeName.DrawerOne}
            backBehavior = "history"
            drawerPosition = "left"
            drawerType = "front"
            drawerStyle = {{
                backgroundColor: MyColor.Material.WHITE,
            }}
            drawerContent = {props => <CustomDrawerContent props = {props}/>}
            drawerContentOptions = {{
                contentContainerStyle: {backgroundColor: MyColor.Primary.first},
                style                : {},
            }}
            /*drawerContentOptions = {{
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
            }}*/
        >
            <Drawer.Screen
                name = {MyConfig.routeName.DrawerOne}
                component = {BottomTabNavigator}
                /*options = {{
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
                }}*/
            />
        </Drawer.Navigator>
    );
}

export {SplashStackScreen, IntroStackScreen, LoginStackScreen, DrawerNavigator};
