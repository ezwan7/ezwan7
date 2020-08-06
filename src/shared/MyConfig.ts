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

const platformOS = Platform.OS;

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
    app_version      : '0.99',
    app_build_version: 99,
    app_platform     : platformOS,

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
    google_server_key       : 'AAAAhbY8x4A:APA91bEL4zQUpFQ2idIEBL1BVJLV6nvby6MDKH2hsXgoTVdUdygFCevlI95dhVcaUlt05ZDMupBV0ZJ1YfDqOXC8UmPkLrsSKMB379VW6lNnkEkA3Z7-x-L5PcfG1mkB0awg09ryOT9Z',

    facebook_app_id: '241236920251156',

    // apiUrl : 'http://192.168.0.101:8500/',
    // apiUrl   : 'https://smddeveloper.com/directd_merge/public/api/',
    // serverUrl: 'https://smddeveloper.com/directd_merge/',
    apiUrl   : 'https://directd.caribpayintl.com/public/api/',
    serverUrl: 'https://directd.caribpayintl.com/',

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

        ProductList      : 'ProductList',
        ProductDetails   : 'ProductDetails',
        ProductBuy       : 'ProductBuy',
        ProductBuyPayment: 'ProductBuyPayment',
        ProductBuySuccess: 'ProductBuySuccess',

        EditProfile      : 'EditProfile',
        MyPoints         : 'MyPoints',
        MyOrders         : 'MyOrders',
        OrderDetails     : 'OrderDetails',
        MyAddress        : 'MyAddress',
        MyAddressForm    : 'MyAddressForm',
        Notifications    : 'Notifications',
        NotificationView : 'NotificationView',
        MyWishList       : 'MyWishList',
        ReferAndEarn     : 'ReferAndEarn',
        ContactUs        : 'ContactUs',
        AboutUs          : 'AboutUs',
        TermsAndCondition: 'TermsAndCondition',

        InfoPage     : 'InfoPage',
        GoogleMap    : 'GoogleMap',
        OptionPage   : 'OptionPage',
        MyWebViewPage: 'MyWebViewPage',

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
    autoLogin         : true,
    preLogin          : false,
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

    DeliveryType: {
        PickUp : {
            id  : 1,
            name: 'PickUp'
        },
        Courier: {
            id  : 2,
            name: 'Courier'
        },
    },

    PaymentMethod: {
        CashOnDelivery: {
            id  : 6,
            name: 'Cash on Delivery'
        },
        CreditCard    : {
            id  : 26,
            name: 'Credit Card'
        },
        Grabpay       : {
            id  : 27,
            name: 'Grabpay'
        },
        DirectBank    : {
            id  : 28,
            name: 'Direct Bank'
        },
        Installment   : {
            id  : 29,
            name: 'Installment'
        },
    },

    RestaurantCategory: {
        Restaurant: 1,
        Sweet     : 2,
        Cake      : 3,
        Homemade  : 4,
        Catering  : 5,
    },

    FilterRange: {
        price: [0, 25000, 5],
    },

    ListLimit     : {
        categoryList         : 50,
        productList          : 16,
        productListHorizontal: 5,
        notificationList     : 20,
        orderList            : 15,
        searchList           : 16,
        addressList          : 15,
        optionList           : 32,
        countryList          : 20,
    },
    LimitAddToCart: 10,

    LanguageActive: 1,

    useFormDefault: {
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
        title         : MyLANG.SelectSource,
        // customButtons : [{name: 'fb', title: 'Choose Photo from Facebook'}],
        storageOptions: {
            skipBackup: true,
            // path      : 'images',
        },
        tintColor     : '#333333',
        cameraType    : 'back', // 'front' or 'back'
        mediaType     : 'photo', // 'photo', 'video', or 'mixed'
        maxWidth      : 1000,
        maxHeight     : 1000,
        rotation      : 0,
        quality       : 0.7,
        videoQuality  : 'high', // 'low', 'medium', or 'high' on iOS, 'low' or 'high' on Android
        durationLimit : 3,
        allowsEditing : true,
        noData        : false,
    },

    DefatulFilePickerOptions: {
        type       : MyConstant.DocumentPickerType.allFiles,
        readContent: false,
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

    productDetailsSegments: [
        {
            id  : 1,
            key : 'Description',
            name: MyLANG.Description,
        },
        {
            id  : 2,
            key : 'Specification',
            name: MyLANG.Specification,
        },
        {
            id  : 3,
            key : 'Warranty',
            name: MyLANG.Warranty,
        },
        {
            id  : 4,
            key : 'Video',
            name: MyLANG.Video,
        },
        {
            id  : 5,
            key : 'Review',
            name: MyLANG.Review,
        },
    ],

    genderList: [
        {
            id  : 0,
            name: MyLANG.Male,
        },
        {
            id  : 1,
            name: MyLANG.Female,
        },
        {
            id  : 2,
            name: MyLANG.Other,
        },
    ],

    deliveryTypes: [
        {
            id   : 1,
            icon : 'shopping-store',
            title: MyLANG.SelfPickup,
        },
        {
            id   : 2,
            icon : 'truck',
            title: MyLANG.CourierService,
        },
    ],

    fileSource: [
        {
            id      : 1,
            key     : 'Camera',
            title   : MyLANG.Camera,
            bodyText: MyLANG.CameraSelectionDescription,
            iconLeft: {
                name: 'camera',
                size: 27,
            }
        },
        {
            id      : 2,
            key     : 'Gallery',
            title   : MyLANG.Gallery,
            bodyText: MyLANG.GallerySelectionDescription,
            iconLeft: {
                name: 'picture',
                size: 27,
            }
        },
        {
            id      : 3,
            key     : 'Other',
            icon    : 'truck',
            title   : MyLANG.OtherFiles,
            bodyText: MyLANG.OtherFilesSelectionDescription,
            iconLeft: {
                name: 'folder',
                size: 27,
            }
        },
    ],

    fileSourceProfilePhto: [
        {
            id      : 1,
            key     : 'Camera',
            title   : MyLANG.Camera,
            bodyText: MyLANG.CameraSelectionDescription,
            iconLeft: {
                name: 'camera',
                size: 27,
            }
        },
        {
            id      : 2,
            key     : 'Gallery',
            title   : MyLANG.Gallery,
            bodyText: MyLANG.GallerySelectionDescription,
            iconLeft: {
                name: 'picture',
                size: 27,
            }
        }
    ],

    geoLocationOption      : {
        enableHighAccuracy   : true,
        timeout              : 10000,
        maximumAge           : 0,
        forceRequestLocation : true,
        useSignificantChanges: false,
        showLocationDialog   : true,
    },
    geoLocationOptionSilent: {
        enableHighAccuracy   : true,
        timeout              : 10000,
        maximumAge           : 0,
        forceRequestLocation : false,
        useSignificantChanges: false,
        showLocationDialog   : false,
    },

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
    password_reset : MyConfig.apiUrl + MyConfig.api_version + 'resetotppassword',

    register_device            : MyConfig.apiUrl + MyConfig.api_version + 'registerdevices',
    app_update_check           : MyConfig.apiUrl + MyConfig.api_version + 'appupdate',
    app_info                   : MyConfig.apiUrl + MyConfig.api_version + 'getallpages',
    countries                  : MyConfig.apiUrl + MyConfig.api_version + 'getcountries',
    states                     : MyConfig.apiUrl + MyConfig.api_version + 'getzones',
    cities                     : MyConfig.apiUrl + MyConfig.api_version + 'getcities',
    installment_membership_type: MyConfig.apiUrl + MyConfig.api_version + 'getmembershiptypes',
    installment_period         : MyConfig.apiUrl + MyConfig.api_version + 'getinstallmentperiod',
    installment_plans          : MyConfig.apiUrl + MyConfig.api_version + 'getemiplans',
    installment_amount         : MyConfig.apiUrl + MyConfig.api_version + 'gettotalemiamount',
    payment_methods            : MyConfig.apiUrl + MyConfig.api_version + 'getpaymentmethods',
    pickup_address             : MyConfig.apiUrl + MyConfig.api_version + 'pickuppoints',
    featured_products          : MyConfig.apiUrl + MyConfig.api_version + 'getfeaturedproducts',
    new_arrival_products       : MyConfig.apiUrl + MyConfig.api_version + 'getnewarrivalproducts',
    categories                 : MyConfig.apiUrl + MyConfig.api_version + 'allcategories',
    product_by_category        : MyConfig.apiUrl + MyConfig.api_version + 'productsbycategory',
    product                    : MyConfig.apiUrl + MyConfig.api_version + 'getallproducts',
    search                     : MyConfig.apiUrl + MyConfig.api_version + 'getsearchdata',
    filter                     : MyConfig.apiUrl + MyConfig.api_version + 'getfilters',
    filter_product             : MyConfig.apiUrl + MyConfig.api_version + 'getfilterproducts',
    banner                     : MyConfig.apiUrl + MyConfig.api_version + 'getbanners',

    coupon_apply          : MyConfig.apiUrl + MyConfig.api_version + 'getcoupon',
    wishlist              : MyConfig.apiUrl + MyConfig.api_version + 'getwishlist',
    tax_rate              : MyConfig.apiUrl + MyConfig.api_version + 'getrate',
    delivery_type         : MyConfig.apiUrl + MyConfig.api_version + 'getdeliverytype',
    delivery_method       : MyConfig.apiUrl + MyConfig.api_version + 'getshippingmethods',
    update_profile        : MyConfig.apiUrl + MyConfig.api_version + 'updatecustomerinfo',
    password_change       : MyConfig.apiUrl + MyConfig.api_version + 'updatepassword',
    upload_profile_photo  : MyConfig.apiUrl + MyConfig.api_version + 'uploadprofilephoto',
    upload_payment_receipt: MyConfig.apiUrl + MyConfig.api_version + 'updatepaymentreceipt',
    user_addresses        : MyConfig.apiUrl + MyConfig.api_version + 'getalladdress',
    user_address_add      : MyConfig.apiUrl + MyConfig.api_version + 'addshippingaddress',
    user_address_edit     : MyConfig.apiUrl + MyConfig.api_version + 'updateshippingaddress',
    user_address_delete   : MyConfig.apiUrl + MyConfig.api_version + 'deleteshippingaddress',
    product_like          : MyConfig.apiUrl + MyConfig.api_version + 'likeproduct',
    product_unlike        : MyConfig.apiUrl + MyConfig.api_version + 'unlikeproduct',
    notifications         : MyConfig.apiUrl + MyConfig.api_version + 'getnotifications',
    notification          : MyConfig.apiUrl + MyConfig.api_version + 'getsinglenotification',
    notification_read     : MyConfig.apiUrl + MyConfig.api_version + 'markasread',
    order_place           : MyConfig.apiUrl + MyConfig.api_version + 'addtoorder',
    orders                : MyConfig.apiUrl + MyConfig.api_version + 'getorders',
    order                 : MyConfig.apiUrl + MyConfig.api_version + 'getorders',
    order_cancel          : MyConfig.apiUrl + MyConfig.api_version + 'updatestatus',

    payment_gateway: 'https://admin.helpy.my/payment/request?user_id=',

    // RESTAURANTS: MyConfig.apiUrl + MyConfig.api_version + MyConfig.api_auth + 'restaurants-get' + MyConfig.API_FILE_EXTENSION,
    //`https://graph.facebook.com/${result.id}/picture`
}

export {MyConfig, MyAPI};
