import React from "react";
import {Dimensions} from "react-native";
import {Platform} from "react-native";
import {getStatusBarHeight, getBottomSpace} from 'react-native-iphone-x-helper';
import {useForm} from "react-hook-form";

import LinearGradient from "react-native-linear-gradient";
import MyMaterialRipple from "../components/MyMaterialRipple";

import MyImage from "../shared/MyImage";
import {MyConstant} from "../common/MyConstant";
import MyLANG from "./MyLANG";

const primaryColor    = {
    first        : '#0e018d',
    second       : '#1301d8',
    thrid        : '#1401eb',
    transparent90: 'rgba(14,1,141,0.90)',
    transparent85: 'rgba(14,1,141,0.85)',
    transparent60: 'rgba(14,1,141,0.60)',
    transparent50: 'rgba(14,1,141,0.50)',
    transparent40: 'rgba(14,1,141,0.40)',

    transparent70: 'rgba(20,1,235,0.70)',
    transparent30: 'rgba(20,1,235,0.30)',
    transparent10: 'rgba(20,1,235,0.10)',
    fourth       : 'rgba(242,96,12,0.70)',
    accent       : 'rgba(242,96,12,0.70)',
};
const primaryGradient = {
    first     : ['#0e018d', '#1301d8'],
    second    : ['#0e018d', '#1301e6'],
    thrid     : ['#0e018d', '#1401ef'],
    drawerItem: ['#0e018d', '#1401ef', '#1401ef'],
};

const MyConfig: any = {

    app_name         : 'DirectD',
    app_version      : '0.3.6',
    app_build_version: 1,
    app_platform     : 'android_customer',

    app_email    : 'directd@gmail.com',
    app_phone    : '01888065565',
    app_copyright: 'directd',
    app_website  : 'https://www.directd.com.my/',

    android_store_link  : 'market://details?id=com.directd',
    iOS_store_link      : 'itms-apps://itunes.apple.com/us/app/id${APP_STORE_LINK_ID}?mt=8',
    android_package_name: 'com.directd',
    ios_app_id          : 'id1111111',

    google_map_api_key      : 'AIzaSyB9iP58dJwjx7BcZA7kRnhIqKn9L3hVoZ0',
    google_web_api_key      : 'AIzaSyC3I4LeHLLwCclW6AeNkIF8_4_S2vQEe9Y',
    google_web_client_id    : '324398162611-hq18dt1vpm68iefc4289io037gkdg0lc.apps.googleusercontent.com',
    google_web_client_secret: 'gOhKdVBAs36LtHsT-6lfUpxE',

    facebook_app_id: '241236920251156',

    // apiUrl : 'http://192.168.0.101:8500/',
    // apiUrl   : 'https://smddeveloper.com/directd_merge/public/api/',
    // serverUrl: 'https://smddeveloper.com/directd_merge/',
    apiUrl   : 'https://smdtechno.com/demo/DirectD/public/api/',
    serverUrl: 'https://smdtechno.com/demo/DirectD/',

    api_version: '',
    api_auth   : 'auth/',

    appNavigation: {
        'SplashStackScreen': 'SplashStackScreen',
        'IntroStackScreen' : 'IntroStackScreen',
        'LoginStackScreen' : 'LoginStackScreen',
        'HomeNavigator'    : 'HomeNavigator',
    },

    routeName: {
        Splash: 'Splash',

        Intro: 'Intro',

        Login          : 'Login',
        Signup         : 'Signup',
        SignupCompleted: 'SignupCompleted',
        PasswordForgot : 'PasswordForgot',
        PasswordReset  : 'PasswordReset',

        BottomTab1: 'BottomTab1',
        BottomTab2: 'BottomTab2',
        BottomTab3: 'BottomTab3',
        BottomTab4: 'BottomTab4',
        BottomTab5: 'BottomTab5',

        Home        : 'Home',
        CategoryList: 'CategoryList',
        Search      : 'Search',
        Cart        : 'Cart',
        Settings    : 'Settings',

        ProductList       : 'ProductList',
        ProductDetails    : 'ProductDetails',
        ProductBuy        : 'ProductBuy',
        ProductBuyDelivery: 'ProductBuyDelivery',
        ProductBuyPayment : 'ProductBuyPayment',
        ProductBuySuccess : 'ProductBuySuccess',

        EditProfile      : 'EditProfile',
        MyOrders         : 'MyOrders',
        MyAddress        : 'MyAddress',
        MyPoints         : 'MyPoints',
        Notifications    : 'Notifications',
        NotificationView : 'NotificationView',
        ContactUs        : 'ContactUs',
        AboutUs          : 'AboutUs',
        TermsAndCondition: 'TermsAndCondition',

        InfoPage: 'InfoPage',

        GoogleMap: 'GoogleMap',

        DrawerOne: 'DrawerOne',

        MaterialTopTab: 'MaterialTopTab',
    },

    primaryColor   : primaryColor,
    primaryGradient: primaryGradient,

    // Default theme loading, this could able to change from the user profile (reserve feature)
    Theme: {
        isDark: false,
    },

    SplashScreen: {
        Duration: 0,
    },

    printConsole      : true,
    loginRequired     : false,
    registrationAction: MyConstant.RegistrationAction.auto_login,
    showStatusBar     : true,
    timePeriodToExit  : 2000,
    dateSetDelay      : 2500,

    Language: "en", // ar, en. Default to set redux. Only use first time

    AsyncStorage: {
        AUTH_TOEKN: 'token',

        FIREBASE_TOEKN: 'FIREBASE_TOEKN',

        APP_FRESH_INSTALL: 'APP_FRESH_INSTALL',
    },

    UserRole: {
        admin      : 2,
        deliveryMan: 5,
        customer   : 6,
        restaurant : 7,
    },

    RestaurantCategory: {
        Restaurant: 1,
        Sweet     : 2,
        Cake      : 3,
        Homemade  : 4,
        Catering  : 5,
    },

    ListLimit     : {
        categoryList         : 50,
        productList          : 16,
        productListHorizontal: 5,
        searchList           : 16,
        RestaurantHome       : 10,
    },
    LimitAddToCart: 10,

    LanguageActive: 1,

    defaultUseForm: {
        mode                : 'onSubmit',
        reValidateMode      : 'onChange',
        // defaultValues       : defaultValues,
        // validationResolver    : SignupSchema,
        validateCriteriaMode: 'all',
        submitFocusError    : true,
    },

    Currency: {
        MYR: {
            symbol     : "RM",
            name       : "Malaysian Ringgit",
            code       : "MYR",
            name_plural: "MYR",
            name_short : "RM",
            decimal    : ".",
            thousand   : ",",
            precision  : 2,
            format     : "%s%v", // %s is the symbol and %v is the value
        },
        BDT: {
            symbol     : "৳",
            name       : "Bangladeshi Taka",
            code       : "BDT",
            name_plural: "Taka",
            name_short : "Tk.",
            decimal    : ".",
            thousand   : ",",
            precision  : 2,
            format     : "%s%v", // %s is the symbol and %v is the value
        },
        USD: {
            symbol     : "$",
            name       : "US Dollar",
            code       : "USD",
            name_plural: "US dollars",
            name_short : "US dollars",
            decimal    : ".",
            thousand   : ",",
            precision  : 2,
            format     : "%s%v", // %s is the symbol and %v is the value
        },
    },

    DefaultCurrency: {
        symbol     : "$",
        name       : "US Dollar",
        code       : "USD",
        name_plural: "US dollars",
        name_short : "US dollars",
        decimal    : ".",
        thousand   : ",",
        precision  : 2,
        format     : "%s%v", // %s is the symbol and %v is the value
    },

    DefaultCountry: {
        code           : "en",
        RTL            : false,
        language       : "English",
        countryCode    : "US",
        hideCountryList: false, // when this option is try we will hide the country list from the checkout page, default
                                // select by the above 'countryCode'
    },

    DefatulImagePickerOptions: {
        title         : MyLANG.SelectImage,
        // customButtons : [{name: 'fb', title: 'Choose Photo from Facebook'}],
        storageOptions: {
            skipBackup: true,
            path      : 'images',
        },
        tintColor     : '#ffffff',
        cameraType    : 'front', // 'front' or 'back'
        mediaType     : 'photo', // 'photo', 'video', or 'mixed'
        maxWidth      : 500,
        maxHeight     : 500,
        rotation      : 0,
        quality       : 0.7,
        videoQuality  : 'high', // 'low', 'medium', or 'high' on iOS, 'low' or 'high' on Android
        durationLimit : 3,
        allowsEditing : false,
        noData        : false,
    },

    Intro: [
        {
            key            : 'first',
            title          : 'Welcome to DirectD',
            text           : 'BUY WITH CONFIDENCE! All Smartphones, Tablets, Smartwatches and Notebook Sold at DirectD are 100% original set.',
            icon           : 'ios-images',
            image          : MyImage.logo_white,
            backgroundColor: primaryColor.first,
            start          : {x: 1.0, y: 0.0},
            end            : {x: 0.0, y: 1.0},
            locations      : [0.0, 1.0],
            colors         : primaryGradient.first,
        },
        {
            key            : 'second',
            title          : 'Secure Payment',
            text           : 'All your payment infomation is top safety and protected.',
            icon           : 'ios-options',
            image          : MyImage.logo_white,
            backgroundColor: primaryColor.first,
            start          : {x: 1.0, y: 0.0},
            end            : {x: 0.0, y: 1.0},
            locations      : [0.0, 1.0],
            colors         : ['#438627', '#65c234'],
        },
        {
            key            : 'thrid',
            title          : 'High Performance',
            text           : 'Saving your value time and buy product with ease.',
            icon           : 'ios-options',
            image          : MyImage.logo_white,
            backgroundColor: primaryColor.first,
            start          : {x: 1.0, y: 0.0},
            end            : {x: 0.0, y: 1.0},
            locations      : [0.0, 1.0],
            colors         : ['#333333', '#dd1818'],
        },
    ],

    token: null,
};

const MyAPI = {

    avatarServer : MyConfig.apiUrl + 'uploads/avatars/',
    mediaServer  : MyConfig.apiUrl + 'uploads/',
    imgRestaurant: MyConfig.apiUrl + 'uploads/restaurant/avatar/',

    intro_slides   : MyConfig.apiUrl + MyConfig.api_version + 'intropage',
    login          : MyConfig.apiUrl + MyConfig.api_version + 'processlogin',
    login_facebook : MyConfig.apiUrl + MyConfig.api_version + 'facebookregistration',
    login_google   : MyConfig.apiUrl + MyConfig.api_version + 'googleregistration',
    login_sms      : MyConfig.apiUrl + MyConfig.api_version + '',
    signup         : MyConfig.apiUrl + MyConfig.api_version + 'processregistration',
    password_forgot: MyConfig.apiUrl + MyConfig.api_version + 'processforgotpassword',

    app_update_check    : MyConfig.apiUrl + MyConfig.api_version + 'appupdate',
    app_data            : MyConfig.apiUrl + MyConfig.api_version + 'getallpages',
    payment_methods     : MyConfig.apiUrl + MyConfig.api_version + 'getpaymentmethods',
    featured_products   : MyConfig.apiUrl + MyConfig.api_version + 'getfeaturedproducts',
    new_arrival_products: MyConfig.apiUrl + MyConfig.api_version + 'getnewarrivalproducts',
    categories          : MyConfig.apiUrl + MyConfig.api_version + 'allcategories',
    product_by_category : MyConfig.apiUrl + MyConfig.api_version + 'productsbycategory',
    product             : MyConfig.apiUrl + MyConfig.api_version + 'getallproducts',
    search              : MyConfig.apiUrl + MyConfig.api_version + 'getsearchdata',
    filter              : MyConfig.apiUrl + MyConfig.api_version + 'getfilters',
    banner              : MyConfig.apiUrl + MyConfig.api_version + 'getbanners',
    coupon_apply        : MyConfig.apiUrl + MyConfig.api_version + 'getcoupon',

    // RESTAURANTS: MyConfig.apiUrl + MyConfig.api_version + MyConfig.api_auth + 'restaurants-get' + MyConfig.API_FILE_EXTENSION,
    //`https://graph.facebook.com/${result.id}/picture`
}

export {MyConfig, MyAPI};
