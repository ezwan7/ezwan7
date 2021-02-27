import React from "react";
import {Alert, BackHandler, Linking, PermissionsAndroid, PixelRatio, Text} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import * as Keychain from 'react-native-keychain';
import NetInfo from '@react-native-community/netinfo';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import DeviceInfo from 'react-native-device-info';
import Snackbar from 'react-native-snackbar';
import Toast from 'react-native-tiny-toast'
import RNBottomActionSheet from 'react-native-bottom-action-sheet';
import Share from 'react-native-share';
import ImagePicker from 'react-native-image-picker';
import Moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob';
import * as mime from 'react-native-mime-types';
import DocumentPicker from 'react-native-document-picker';
import NavigationService from "./NavigationService";
import {DrawerActions, TabActions, StackActions, CommonActions} from '@react-navigation/native';
import Splash from "react-native-splash-screen";

import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import messaging from '@react-native-firebase/messaging';
// import {firebase} from '@react-native-firebase/messaging';
// import {Notification, NotificationResponse, Notifications, Registered, RegistrationError} from "react-native-notifications";
// import {NotificationCompletion} from "react-native-notifications/lib/dist/interfaces/NotificationCompletion";

import {store} from "../store/MyStore";
import {firebase_token_update} from "../store/AuthRedux";


import MyLANG from '../shared/MyLANG';
import MyImage from '../shared/MyImage';
import {MyConfig} from '../shared/MyConfig';
import {MyConstant} from '../common/MyConstant';
import MyColor from '../common/MyColor';
import {MyStyle} from '../common/MyStyle';
import MyIcon from "../components/MyIcon";

import {MyAlert} from "../components/MyAlert";


let lastTimeBackPress: number = 0;
const CancelToken             = axios.CancelToken;
let CancelTokenSource: any    = null;

const toast: any = {
    loading: null
}

const MyUtil = {

    wait: (timeout: any) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });

        /*MyUtil.wait(2000)
            .then(() => {

            });*/
    },

    performTimeConsumingTask: async () => {
        return new Promise(
            (resolve) =>
                setTimeout(() => {
                    resolve(true)
                }, 1000)
        );
        // const data = await performTimeConsumingTask();
        // if (data !== null) {
        //     setIsLoading(false);
        //     console.log('useEffect: ', isLoading);
        // }
    },

    formProcess: async (e: any, getValues: any, handleSubmit: any, formState: any, errors: any) => {
        let response: any = {
            'type'        : MyConstant.RESPONSE.TYPE.error,
            'error'       : null,
            'errors'      : null,
            'errorMessage': null,
            'data'        : null,
        }

        try {

            // Runs only when the form is valid:
            await handleSubmit((data: any, e: any) => {
                MyUtil.printConsole(true, 'log', 'LOG: handleSubmit:', {
                    'e'        : e,
                    'data'     : data,
                    'formState': formState,
                    'errors'   : errors,
                    'getValues': getValues
                });

                // Do Form Valid Task:
                if (formState.isSubmitted === false && formState.isValid === false && formState.submitCount === 0) {
                    // FIRST TIME + FORM VALID
                    MyUtil.printConsole(true, 'log', 'LOG: handleSubmit-else:', 'VALID.');

                } else if (formState.isValid === true) {
                    // FORM VALID
                    MyUtil.printConsole(true, 'log', 'LOG: handleSubmit:', 'VALID.');

                } else {
                    MyUtil.printConsole(true, 'log', 'LOG: handleSubmit:', 'ATTENTION.'); // TODO:

                    // reject(errors);
                }

                // reset(defaultValues);
                // clearError(['firstName', 'lastName']);
                // setValue('firstName', 'bill');
                // triggerValidation('lastName');

                response = {
                    'type'        : MyConstant.RESPONSE.TYPE.data,
                    'error'       : null,
                    'errors'      : null,
                    'errorMessage': null,
                    'data'        : data,
                }

            })(e);

            MyUtil.printConsole(true, 'log', 'LOG: formProcess:', {
                'e'          : e,
                'formState'  : formState,
                'errors'     : errors,
                'getValues()': getValues(),
                'Object'     : Object.keys(errors).length,
            });

            // FIRST TIME + FORM INVALID (detect sometime valid))
            if (formState.isSubmitted === false && formState.isValid === false && formState.submitCount === 0) {
                if (Object.keys(errors).length > 0 && errors.constructor === Object) {
                    // Errors object contains data
                    throw new Error(JSON.stringify(errors));

                } else if (formState.dirty === false) { // If set form data, set dirty and other values.
                    // Not Touched, errors {}
                    // throw new Error(JSON.stringify(errors));

                } else {
                    // Touched, No errors {}, other fields have error
                    // throw new Error(errors);  // TODO:
                }
            } else if (formState.isValid === false) {
                // FORM INVALID
                throw new Error(JSON.stringify(errors));

            } else {
                // else
                // throw new Error(JSON.stringify(errors)); // TODO:
            }

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: formProcess: TRY-CATCH: ', {
                'error'    : error,
                'errors'   : JSON.parse(error.message),
                'getValues': getValues,
            });

            let errorMessage: string = '';
            let index                = 0;
            const errorMessages      = JSON.parse(error.message);
            if (Object.keys(errorMessages).length > 0) { // If Form Input Errors:
                for (const key of Object.keys(errorMessages)) {
                    if (errorMessages[key]['message']) { // If Form Input Error have Message:
                        errorMessage += (index > 0 ? '\n' : '') + errorMessages[key]['message'];
                        index++;
                    }
                }
            }

            response = {
                'type'        : MyConstant.RESPONSE.TYPE.error,
                'error'       : error,
                'errors'      : JSON.parse(error.message),
                'errorMessage': errorMessage,
                'data'        : null,
            }

        } finally {
            MyUtil.printConsole(true, 'log', 'LOG: formProcess: TRY-FINALY: ', {'response': response});

            return response;
        }

        /*const formValue: any = await MyUtil.formProcess(e, handleSubmit, formState, errors, getValues);
        MyUtil.printConsole(true, 'log', 'LOG: formProcess: await-response: ', {'formValue': formValue});
        if (formValue && formValue.type === MyConstant.RESPONSE.TYPE.data && formValue.data) {
        } else {
            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT, formValue.errorMessage ? formValue.errorMessage : MyLANG.FormInvalid, false);
        }*/
    },


    // Hardware Back Button Handler:
    onBackButtonPress: (navigation: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: onBackButtonPress: ', {navigation});
        if (navigation.canGoBack()) {
            return false;
        } else {
            if (new Date().getTime() - lastTimeBackPress < MyConfig.timePeriodToExit) {
                BackHandler.exitApp();
                return true;
            } else {
                MyUtil.showTinyToast(
                    MyLANG.ExitAppConfirmation,
                    MyConstant.TINY_TOAST.SHORT,
                    MyStyle.TinyToast.BOTTOM,
                    MyStyle.TinyToast.Black.containerStyle,
                    MyStyle.TinyToast.Black.textStyle,
                    MyStyle.TinyToast.Black.textColor,
                    null,
                    MyStyle.TinyToast.imageStyleSucess,
                    false,
                    false,
                    false,
                    0,
                    MyConstant.TINY_TOAST.HIDE_AND_SHOW,
                );

                lastTimeBackPress = new Date().getTime();

                return true;
            }
        }
    },


    showLoginRequired: async (showMessage: any, showLoader: any, doReRoute: any, routeTo: any, navigationActions: any) => {

        MyUtil.printConsole(true, 'log', 'LOG: showLoginRequired:', {
            'showMessage'      : showMessage,
            'showLoader'       : showLoader,
            'doReRoute'        : doReRoute,
            'routeTo'          : routeTo,
            'navigationActions': navigationActions,
        });

        MyUtil.showAlert(MyLANG.Attention, MyLANG.LoginRequired, false, [
            {
                text   : MyLANG.Cancel,
                style  : 'cancel',
                onPress: () => {
                    MyUtil.printConsole(true, 'log', 'LOG: showAlert: ', 'Cancel');
                },
            },
            {
                text   : MyLANG.LoginNow,
                onPress: () => {
                    MyUtil.printConsole(true, 'log', 'LOG: showAlert: ', 'OK');

                    MyUtil.commonAction(false, null, MyConstant.CommonAction.navigate, MyConfig.routeName.Login, {splash: false}, null);
                }
            },
        ])

        /*MyUtil.showLoginRequired(MyConstant.SHOW_MESSAGE.ALERT,
                                 MyLANG.PleaseWait + '...',
                                 true,
                                 null,
                                 MyConstant.NAVIGATION_ACTIONS.GO_BACK
        );*/
    },

    // COPY IN NAVIGATION ACTION
    commonAction: (loginRequired: boolean, navigation: any = null, actionType: string, routeName: any, params: any, navigationActions: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: commonAction: ', {
            'loginRequired'    : loginRequired,
            'navigation'       : navigation,
            'actionType'       : actionType,
            'routeName'        : routeName,
            'params'           : params,
            'navigationActions': navigationActions,
        });

        if (loginRequired === true) {
            const user = store.getState().auth.user;
            MyUtil.printConsole(true, 'log', 'LOG: commonAction: ', {'user': user});
            if (!user.id) {
                return MyUtil.showLoginRequired(MyConstant.SHOW_MESSAGE.ALERT,
                                                MyLANG.PleaseWait + '...',
                                                true,
                                                null,
                                                MyConstant.NAVIGATION_ACTIONS.GO_BACK
                );
            }
        }

        switch (actionType) {
            case MyConstant.CommonAction.navigate:
                navigation ?
                navigation.dispatch(CommonActions.navigate(routeName, params))
                           :
                NavigationService.commonAction(loginRequired, actionType, routeName, params);
                break;
            case MyConstant.CommonAction.reset:
                navigation ?
                navigation.dispatch(CommonActions.reset(routeName)) // state with index
                           :
                NavigationService.commonAction(loginRequired, actionType, routeName, params);
                break;
            case MyConstant.CommonAction.goBack:
                navigation ?
                navigation.dispatch(CommonActions.goBack())
                           :
                NavigationService.commonAction(loginRequired, actionType, routeName, params);
                break;
            case MyConstant.CommonAction.setParams:
                navigation ?
                navigation.dispatch(CommonActions.setParams(params))
                           :
                NavigationService.commonAction(loginRequired, actionType, routeName, params);
                break;
            default:
                break;
        }

        switch (navigationActions) {
            case MyConstant.NAVIGATION_ACTIONS.HIDE_SPLASH:
                Splash.hide();
                break;
            default:
                break;
        }

        // MyUtil.commonAction(navigation, MyConstant.CommonAction.navigate, routeName, params);
    },

    stackAction: (loginRequired: boolean, navigation: any, actionType: string, routeName: any, params: any, navigationActions: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: stackAction: ', {
            'loginRequired'    : loginRequired,
            'navigation'       : navigation,
            'actionType'       : actionType,
            'routeName'        : routeName,
            'params'           : params,
            'navigationActions': navigationActions,
        });

        if (loginRequired === true) {
            const user = store.getState().auth.user;
            MyUtil.printConsole(true, 'log', 'LOG: stackAction: ', {'user': user});
            if (!user.id) {
                return MyUtil.showLoginRequired(MyConstant.SHOW_MESSAGE.ALERT,
                                                MyLANG.PleaseWait + '...',
                                                true,
                                                null,
                                                MyConstant.NAVIGATION_ACTIONS.GO_BACK
                );
            }
        }

        switch (actionType) {
            case MyConstant.StackAction.replace:
                navigation ?
                navigation.dispatch(StackActions.replace(routeName, params))
                           :
                NavigationService.stackAction(loginRequired, actionType, routeName, params);
                break;
            case MyConstant.StackAction.push:
                navigation ?
                navigation.dispatch(StackActions.push(routeName, params))
                           :
                NavigationService.stackAction(loginRequired, actionType, routeName, params);
                break;
            case MyConstant.StackAction.pop:
                navigation ?
                navigation.dispatch(StackActions.pop(routeName))
                           :
                NavigationService.stackAction(loginRequired, actionType, routeName, params);
                break;
            case MyConstant.StackAction.popToTop:
                navigation ?
                navigation.dispatch(StackActions.popToTop())
                           :
                NavigationService.stackAction(loginRequired, actionType, routeName, params);
                break;
            default:
                break;
        }

        //  MyUtil.stackAction(navigation, MyConstant.StackAction.replace, routeName, params);
    },

    drawerAction: (loginRequired: boolean, navigation: any, actionType: string, routeName: any, params: any, navigationActions: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: drawerAction: ', {
            'loginRequired'    : loginRequired,
            // 'navigation': navigation,
            'actionType'       : actionType,
            'routeName'        : routeName,
            'params'           : params,
            'navigationActions': navigationActions,
        });

        if (loginRequired === true) {
            const user = store.getState().auth.user;
            MyUtil.printConsole(true, 'log', 'LOG: drawerAction: ', {'user': user});
            if (!user.id) {
                return MyUtil.showLoginRequired(MyConstant.SHOW_MESSAGE.ALERT,
                                                MyLANG.PleaseWait + '...',
                                                true,
                                                null,
                                                MyConstant.NAVIGATION_ACTIONS.GO_BACK
                );
            }
        }

        switch (actionType) {
            case MyConstant.DrawerAction.openDrawer:
                navigation ?
                navigation.dispatch(DrawerActions.openDrawer())
                           :
                NavigationService.drawerAction(loginRequired, actionType, routeName, params);
                break;
            case MyConstant.DrawerAction.closeDrawer:
                navigation ?
                navigation.dispatch(DrawerActions.closeDrawer())
                           :
                NavigationService.drawerAction(loginRequired, actionType, routeName, params);
                break;
            case MyConstant.DrawerAction.toggleDrawer:
                navigation ?
                navigation.dispatch(DrawerActions.toggleDrawer())
                           :
                NavigationService.drawerAction(loginRequired, actionType, routeName, params);
                break;
            case MyConstant.DrawerAction.jumpTo:
                navigation ?
                navigation.dispatch(DrawerActions.jumpTo(routeName, params))
                           :
                NavigationService.drawerAction(loginRequired, actionType, routeName, params);
                break;
            default:
                break;
        }

        //  MyUtil.drawerAction(navigation, MyConstant.DRAWER.JUMP_TO, routeName, params);
    },

    tabAction: (loginRequired: boolean, navigation: any, actionType: string, routeName: any, params: any, navigationActions: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: tabAction: ', {
            'loginRequired'    : loginRequired,
            // 'navigation': navigation,
            'actionType'       : actionType,
            'routeName'        : routeName,
            'params'           : params,
            'navigationActions': navigationActions,
        });

        if (loginRequired === true) {
            const user = store.getState().auth.user;
            MyUtil.printConsole(true, 'log', 'LOG: tabAction: ', {'user': user});
            if (!user.id) {
                return MyUtil.showLoginRequired(MyConstant.SHOW_MESSAGE.ALERT,
                                                MyLANG.PleaseWait + '...',
                                                true,
                                                null,
                                                MyConstant.NAVIGATION_ACTIONS.GO_BACK
                );
            }
        }

        switch (actionType) {
            case MyConstant.TabAction.jumpTo:
                navigation ?
                navigation.dispatch(TabActions.jumpTo(routeName, params))
                           :
                NavigationService.drawerAction(loginRequired, actionType, routeName, params);
                break;
            default:
                break;
        }

        // MyUtil.tabAction(navigation, MyConstant.TabAction.jumpTo, routeName, params);
    },

    //
    /*firebaseCheckPermission: async () => {
        const hasPermissions: boolean = await Notifications.isRegisteredForRemoteNotifications();
        MyUtil.printConsole(true, 'log', 'LOG: firebaseCheckPermission: ', {
            'hasPermissions': hasPermissions
        });
        return hasPermissions;

        // MyUtil.firebaseCheckPermission();
    },*/

    firebaseGetToken: async () => {

        try {
            // if (MyStyle.platformOS === "ios") {
            /*Notifications.ios.checkPermissions().then((currentPermissions) => {
                console.log('Badges enabled: ' + !!currentPermissions.badge);
                console.log('Sounds enabled: ' + !!currentPermissions.sound);
                console.log('Alerts enabled: ' + !!currentPermissions.alert);
            });*/
            // Notifications.registerRemoteNotifications();
            // }

            /*Notifications.events().registerRemoteNotificationsRegistered((registered: Registered) => {

                MyUtil.printConsole(true, 'log', 'LOG: Notification RemoteNotificationsRegistered: ', {'registered': registered});

                const firebaseToken = registered.deviceToken;

                if (firebaseToken?.length > 10) {

                    const firebase_token = store.getState().auth.firebase_token;
                    if (firebaseToken !== firebase_token) {

                        store.dispatch(firebase_token_update(firebaseToken));
                    }

                    MyUtil.firebaseNotificationListeners();
                }
            });

            Notifications.events().registerRemoteNotificationsRegistrationFailed((registrationError: RegistrationError) => {

                MyUtil.printConsole(true,
                                    'log',
                                    'LOG: Notification RemoteNotificationsRegistrationFailed: ',
                                    {'registrationError': registrationError}
                );

                MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.FirebaseTokenFailed, false);

            });*/


            const authStatus = await messaging().requestPermission(
                {
                    alert       : true,
                    announcement: false,
                    badge       : true,
                    carPlay     : false,
                    provisional : false,
                    sound       : true,
                });

            const enabled =
                      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled) {
                MyUtil.printConsole(true, 'log', 'LOG: Notification Authorization status: ', authStatus);

                const firebaseToken = await messaging().getToken();
                MyUtil.printConsole(true, 'log', 'LOG: Notification firebaseToken: ', firebaseToken);

                if (firebaseToken?.length > 10) {

                    const firebase_token = store.getState().auth.firebase_token;
                    if (firebaseToken !== firebase_token) {

                        store.dispatch(firebase_token_update(firebaseToken));
                    }

                    MyUtil.firebaseNotificationListeners();

                } else {

                    MyUtil.printConsole(true, 'log', 'LOG: Notification firebaseToken: ', "No token received");
                }
            }

            /*PushNotification.configure(
                {
                    senderID: '324398162611',
                    // (optional) Called when Token is generated (ios and Android)
                    onRegister: (token: any) => {
                        console.log("TOKEN:", token);
                    },

                    // (required) Called when a remote is received or opened, or local notification is opened
                    onNotification: (notification: any) => {
                        console.log("NOTIFICATION:", notification);

                        // process the notification

                        // (required) Called when a remote is received or opened, or local notification is opened
                        notification.finish(PushNotificationIOS.FetchResult.NoData);
                    },

                    // IOS ONLY (optional): default: all - Permissions to register.
                    permissions: {
                        alert: true,
                        badge: true,
                        sound: true,
                    },

                    // Should the initial notification be popped automatically
                    // default: true
                    popInitialNotification: true,

                    /!**
                     * (optional) default: true
                     * - Specified if permissions (ios) and token (android and ios) will requested or not,
                     * - if not, you must call PushNotificationsHandler.requestPermissions() later
                     * - if you are not using remote notification or do not have Firebase installed, use this:
                     *     requestPermissions: Platform.OS === 'ios'
                     *!/
                    requestPermissions: true,
                });*/

        } catch (error) {

            MyUtil.printConsole(true, 'log', 'LOG: Notification firebaseGetToken: TRY-CATCH: ', {'error': error});
        }
    },

    /*firebaseInitialNotification: async () => {

        return await Notifications.getInitialNotification();

        /!*MyUtil.firebaseInitialNotification()
            .then((notification) => {

                MyUtil.printConsole(true, 'log', 'LOG: firebaseInitialNotification-then: ', {'notification': notification});

            })
            .catch((error) => {
                MyUtil.printConsole(true, 'log', 'LOG: firebaseInitialNotification-catch: ', {'error': error});

            });*!/
    },*/

    firebaseSendLocal: (remoteMessage: any, title: any, body: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: Notification firebaseSendLocal:', {remoteMessage, title, body});

        try {

            PushNotification.localNotification(
                {
                    /* Android Only Properties */
                    // id                : remoteMessage?.id, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
                    // ticker            : "My Notification Ticker", // (optional)
                    autoCancel        : true, // (optional) default: true
                    largeIcon         : "ic_launcher", // (optional) default: "ic_launcher"
                    smallIcon         : "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
                    bigText           : body, // (optional) default: "message" prop
                    subText           : title, // (optional) default: none
                    color             : MyColor.Primary.first, // (optional) default: system default
                    vibrate           : true, // (optional) default: true
                    vibration         : 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
                    // tag               : "some_tag", // (optional) add tag to message
                    // group             : "group", // (optional) add group to message
                    ongoing           : false, // (optional) set whether this is an "ongoing" notification
                    priority          : "high", // (optional) set notification priority, default: high
                    visibility        : "private", // (optional) set notification visibility, default: private
                    importance        : "high", // (optional) set notification importance, default: high
                    // @ts-ignore
                    allowWhileIdle    : false, // (optional) set notification to work while on doze, default: false
                    // @ts-ignore
                    ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how ios notifications appear)

                    /* ios only properties */
                    alertAction: "view", // (optional) default: view
                    category   : "", // (optional) default: empty string
                    userInfo   : {}, // (optional) default: {} (using null throws a JSON value '<null>' error)

                    /* ios and Android properties */
                    title    : title, // (optional)
                    message  : body, // (required)
                    playSound: true, // (optional) default: true
                    soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
                    // number    : 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
                    // repeatType: "day", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
                    // actions   : '["Yes", "No"]', // (Android only) See the doc for notification actions to know more
                });
            // PushNotification.setApplicationIconBadgeNumber(0);
            /*let localNotification = Notifications.postLocalNotification(
                {
                    body: "Local notification!",
                    title: "Local Notification Title",
                    sound: "chime.aiff",
                    silent: false,
                    category: "SOME_CATEGORY",
                    userInfo: { }
                },
                id,
            );*/

        } catch (error) {

            MyUtil.printConsole(true, 'log', 'LOG: Notification firebaseSendLocal: TRY-CATCH: ', {'error': error});
        }
    },

    /*firebaseCheckPermission: async () => {
        /!*const enabled = await firebase.messaging().hasPermission();

         MyUtil.printConsole(true, 'log', 'LOG: checkPermission: ', {'hasPermission': enabled});

         if (enabled) {
         MyUtil.firebaseGetToken();
         } else {
         MyUtil.firebaseRequestPermission();
         }*!/
    },
    firebaseGetToken: async () => {
        /!*MyUtil.AsyncStorageGet(MyConstant.FIREBASE_TOEKN, false)
         .then((result: any) => {
         MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageGet: resolve-then: ', {'result': result});

         // const fcmToken = result;

         })
         .catch(async error => {
         MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageGet: reject-catch: ', {'error': error});

         const fcmToken = await firebase.messaging().getToken();

         if (fcmToken) {
         MyUtil.AsyncStorageSet(MyConstant.FIREBASE_TOEKN, fcmToken, MyConstant.SHOW_MESSAGE.TOAST)
         .then((result: any) => {
         MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageSet: resolve-then: ', {'result': result});
         })
         .catch((error: any) => {
         MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageSet: reject-catch: ', {'error': error});
         });
         }
         })*!/
    },
    firebaseRequestPermission: async () => {
        /!*try {
         await firebase.messaging().requestPermission();
         // User has authorised
         MyUtil.firebaseGetToken();
         } catch (error) {
         // User has rejected permissions
         MyUtil.printConsole(true, 'log', 'LOG: fireBaseRequestPermission: try-catch: ', {'error': error});

         MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.FirebaseTokenFailed, false);
         }*!/
    },*/

    // createNotificationListeners:
    firebaseNotificationListeners: () => {

        try {

            messaging().onMessage(async (remoteMessage: any) => {

                MyUtil.printConsole(true, 'log', 'LOG: Notification onMessage: ', {remoteMessage});

                const title: string = remoteMessage?.data?.notification?.title || remoteMessage?.notification?.title || remoteMessage?.data?.title || MyLANG.Error;
                const body: string  = remoteMessage?.data?.notification?.body || remoteMessage?.notification?.body || remoteMessage?.data?.body || MyLANG.Error;

                MyUtil.firebaseSendLocal(remoteMessage, title, body);

            });

            messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {

                MyUtil.printConsole(true, 'log', 'LOG: Notification setBackgroundMessageHandler: ', {remoteMessage});

                // if (MyStyle.platformOS === "ios") {
                //     MyUtil.firebaseSendLocal(remoteMessage);
                // }

            });

            messaging().onNotificationOpenedApp((remoteMessage: any) => {

                MyUtil.printConsole(true, 'log', 'LOG: Notification onNotificationOpenedApp: ', {remoteMessage});
            });

            // Check whether an initial notification is available
            messaging().getInitialNotification().then((remoteMessage: any) => {
                if (remoteMessage) {
                    MyUtil.printConsole(true, 'log', 'LOG: Notification getInitialNotification: ', {remoteMessage});
                }
            });

            // Notifications.cancelLocalNotification(id);
            // Notifications.removeAllDeliveredNotifications();

            /*Notifications.events().registerNotificationReceivedForeground((notification: Notification, completion: (response: NotificationCompletion) => void) => {

                MyUtil.printConsole(true, 'log', 'LOG: Notification Received - Foreground: ', {'notification': notification});

                // Calling completion on ios with `alert: true` will present the native ios inApp notification.
                completion({alert: true, sound: true, badge: false});
            });

            Notifications.events().registerNotificationReceivedBackground((notification: Notification, completion: (response: NotificationCompletion) => void) => {

                MyUtil.printConsole(true, 'log', 'LOG: Notification Received - Background: ', {'notification': notification});

                // Calling completion on ios with `alert: true` will present the native ios inApp notification.
                completion({alert: true, sound: true, badge: false});
            });

            Notifications.events().registerNotificationOpened((notification: Notification, completion: () => void) => {

                MyUtil.printConsole(true, 'log', 'LOG: Notification Opened: ', {'notification': notification});

                completion();
            });
*/

            MyUtil.printConsole(true, 'log', 'LOG: Notification firebaseNotificationListeners: ', {});


        } catch (error) {

            MyUtil.printConsole(true, 'log', 'LOG: Notification firebaseNotificationListeners: TRY-CATCH: ', {'error': error});
        }

    },


    // NetInfo Subscribe, Continues Watch
    /*subscribeNetInfo: NetInfo.addEventListener(state => {
        MyUtil.printConsole(true, 'log', 'LOG: subscribeNetInfo: ', {'state': state});
        // Unsubscribe
        // subscribeNetInfo();
    }),*/

    isInternetAvailable: async (showMessage: string): Promise<boolean> => {

        try {
            const state = await NetInfo.fetch();

            /*MyUtil.printConsole(true, 'log', 'LOG: isInternetAvailable: await: ', {
                'isConnected': state.isConnected,
                'state'      : state,
            });*/

            return state.isConnected;

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: isInternetAvailable: TRY-CATCH: ', {'error': error});

            MyUtil.showMessage(showMessage, MyLANG.NoConnection, false);

            return error;
        }

        // const internet: any = await MyUtil.isInternetAvailable(MyConstant.SHOW_MESSAGE.SNACKBAR);
        // if (await MyUtil.isInternetAvailable === true) {}

        // const netInfo = useNetInfo();
        // {netInfo.isConnected.toString()}
        // let hasNetwork = await NetInfo.isConnected.fetch();
    },


    GetDeviceInfo: async (getType: any, feature: any = null, returnType: any = 'string', askPermission: boolean = false, showLoader: any = false, showMessage: any = false) => {
        /*MyUtil.printConsole(true, 'log', 'LOG: GetDeviceInfo:', {
            'getType'      : getType,
            'feature'      : feature,
            'askPermission': askPermission,
            'showMessage'  : showMessage,
            'showLoader'   : showLoader,
        });*/

        let response: any = {
            'type' : MyConstant.RESPONSE.TYPE.error,
            'error': null,
            'data' : null,
        }

        try {
            if (showLoader !== false) {
                MyUtil.showTinyToast(showLoader && showLoader.length > 0 ? showLoader : MyLANG.PleaseWait,
                                     false,
                                     MyStyle.TinyToast.CENTER,
                                     MyStyle.TinyToast.Black.containerStyle,
                                     MyStyle.TinyToast.Black.textStyle,
                                     MyStyle.TinyToast.Black.textColor,
                                     null,
                                     MyStyle.TinyToast.imageStyleSucess,
                                     false,
                                     true,
                                     true,
                                     0,
                                     MyConstant.TINY_TOAST.SHOW
                );
            }

            let result: any = false;
            switch (getType) {

                case MyConstant.DeviceInfo.getAndroidId:
                    result = await DeviceInfo.getAndroidId();
                    break;

                case MyConstant.DeviceInfo.getApiLevel:
                    result = await DeviceInfo.getApiLevel();
                    break;

                case MyConstant.DeviceInfo.getApplicationName:
                    result = await DeviceInfo.getApplicationName();
                    break;

                case MyConstant.DeviceInfo.getAvailableLocationProviders:
                    result = await DeviceInfo.getAvailableLocationProviders();
                    break;

                case MyConstant.DeviceInfo.getBaseOs:
                    result = await DeviceInfo.getBaseOs();
                    break;

                case MyConstant.DeviceInfo.getBuildId:
                    result = await DeviceInfo.getBuildId();
                    break;

                case MyConstant.DeviceInfo.getBatteryLevel:
                    result = await DeviceInfo.getBatteryLevel();
                    break;

                case MyConstant.DeviceInfo.getBootloader:
                    result = await DeviceInfo.getBootloader();
                    break;

                case MyConstant.DeviceInfo.getBrand:
                    result = await DeviceInfo.getBrand();
                    break;

                case MyConstant.DeviceInfo.getBuildNumber:
                    result = await DeviceInfo.getBuildNumber();
                    break;

                case MyConstant.DeviceInfo.getBundleId:
                    result = await DeviceInfo.getBundleId();
                    break;

                case MyConstant.DeviceInfo.isCameraPresent:
                    result = await DeviceInfo.isCameraPresent();
                    break;

                case MyConstant.DeviceInfo.getCarrier:
                    result = await DeviceInfo.getCarrier();
                    break;

                case MyConstant.DeviceInfo.getCodename:
                    result = await DeviceInfo.getCodename();
                    break;

                case MyConstant.DeviceInfo.getDevice:
                    result = await DeviceInfo.getDevice();
                    break;

                case MyConstant.DeviceInfo.getDeviceId:
                    result = await DeviceInfo.getDeviceId();
                    break;

                case MyConstant.DeviceInfo.getDeviceType:
                    result = await DeviceInfo.getDeviceType();
                    break;

                case MyConstant.DeviceInfo.getDisplay:
                    result = await DeviceInfo.getDisplay();
                    break;

                case MyConstant.DeviceInfo.getDeviceName:
                    result = await DeviceInfo.getDeviceName();
                    break;

                case MyConstant.DeviceInfo.getDeviceToken:
                    result = await DeviceInfo.getDeviceToken();
                    break;

                case MyConstant.DeviceInfo.getFirstInstallTime:
                    result = await DeviceInfo.getFirstInstallTime();
                    break;

                case MyConstant.DeviceInfo.getFingerprint:
                    result = await DeviceInfo.getFingerprint();
                    break;

                case MyConstant.DeviceInfo.getFontScale:
                    result = await DeviceInfo.getFontScale();
                    break;

                case MyConstant.DeviceInfo.getFreeDiskStorage:
                    result = await DeviceInfo.getFreeDiskStorage();
                    break;

                case MyConstant.DeviceInfo.getHardware:
                    result = await DeviceInfo.getHardware();
                    break;

                case MyConstant.DeviceInfo.getHost:
                    result = await DeviceInfo.getHost();
                    break;

                case MyConstant.DeviceInfo.getIpAddress:
                    result = await DeviceInfo.getIpAddress();
                    break;

                case MyConstant.DeviceInfo.getIncremental:
                    result = await DeviceInfo.getIncremental();
                    break;

                case MyConstant.DeviceInfo.getInstallerPackageName:
                    result = await DeviceInfo.getInstallerPackageName();
                    break;

                case MyConstant.DeviceInfo.getInstallReferrer:
                    result = await DeviceInfo.getInstallReferrer();
                    break;

                case MyConstant.DeviceInfo.getInstanceId:
                    result = await DeviceInfo.getInstanceId();
                    break;

                case MyConstant.DeviceInfo.getLastUpdateTime:
                    result = await DeviceInfo.getLastUpdateTime();
                    break;

                case MyConstant.DeviceInfo.getMacAddress:
                    result = await DeviceInfo.getMacAddress();
                    break;

                case MyConstant.DeviceInfo.getManufacturer:
                    result = await DeviceInfo.getManufacturer();
                    break;

                case MyConstant.DeviceInfo.getMaxMemory:
                    result = await DeviceInfo.getMaxMemory();
                    break;

                case MyConstant.DeviceInfo.getModel:
                    result = await DeviceInfo.getModel();
                    break;

                case MyConstant.DeviceInfo.getPhoneNumber:
                    result = await DeviceInfo.getPhoneNumber();
                    break;

                case MyConstant.DeviceInfo.getPowerState:
                    result = await DeviceInfo.getPowerState();
                    break;

                case MyConstant.DeviceInfo.getProduct:
                    result = await DeviceInfo.getProduct();
                    break;

                case MyConstant.DeviceInfo.getPreviewSdkInt:
                    result = await DeviceInfo.getPreviewSdkInt();
                    break;

                case MyConstant.DeviceInfo.getReadableVersion:
                    result = await DeviceInfo.getReadableVersion();
                    break;

                case MyConstant.DeviceInfo.getSerialNumber:
                    result = await DeviceInfo.getSerialNumber();
                    break;

                case MyConstant.DeviceInfo.getSecurityPatch:
                    result = await DeviceInfo.getSecurityPatch();
                    break;

                case MyConstant.DeviceInfo.getSystemAvailableFeatures:
                    result = await DeviceInfo.getSystemAvailableFeatures();
                    break;

                case MyConstant.DeviceInfo.getSystemName:
                    result = await DeviceInfo.getSystemName();
                    break;

                case MyConstant.DeviceInfo.getSystemVersion:
                    result = await DeviceInfo.getSystemVersion();
                    break;

                case MyConstant.DeviceInfo.getTags:
                    result = await DeviceInfo.getTags();
                    break;

                case MyConstant.DeviceInfo.getType:
                    result = await DeviceInfo.getType();
                    break;

                case MyConstant.DeviceInfo.getTotalDiskCapacity:
                    result = await DeviceInfo.getTotalDiskCapacity();
                    break;

                case MyConstant.DeviceInfo.getTotalMemory:
                    result = await DeviceInfo.getTotalMemory();
                    break;

                case MyConstant.DeviceInfo.getUniqueId:
                    result = await DeviceInfo.getUniqueId();
                    break;

                case MyConstant.DeviceInfo.getUsedMemory:
                    result = await DeviceInfo.getUsedMemory();
                    break;

                case MyConstant.DeviceInfo.getUserAgent:
                    result = await DeviceInfo.getUserAgent();
                    break;

                case MyConstant.DeviceInfo.getVersion:
                    result = await DeviceInfo.getVersion();
                    break;

                case MyConstant.DeviceInfo.hasNotch:
                    result = await DeviceInfo.hasNotch();
                    break;

                case MyConstant.DeviceInfo.hasSystemFeature:
                    result = await DeviceInfo.hasSystemFeature(feature);
                    break;

                case MyConstant.DeviceInfo.isAirplaneMode:
                    result = await DeviceInfo.isAirplaneMode();
                    break;

                case MyConstant.DeviceInfo.isBatteryCharging:
                    result = await DeviceInfo.isBatteryCharging();
                    break;

                case MyConstant.DeviceInfo.isEmulator:
                    result = await DeviceInfo.isEmulator();
                    break;

                case MyConstant.DeviceInfo.isLandscape:
                    result = await DeviceInfo.isLandscape();
                    break;

                case MyConstant.DeviceInfo.isLocationEnabled:
                    result = await DeviceInfo.isLocationEnabled();
                    break;

                case MyConstant.DeviceInfo.isHeadphonesConnected:
                    result = await DeviceInfo.isHeadphonesConnected();
                    break;

                case MyConstant.DeviceInfo.isPinOrFingerprintSet:
                    result = await DeviceInfo.isPinOrFingerprintSet();
                    break;

                case MyConstant.DeviceInfo.isTablet:
                    result = await DeviceInfo.isTablet();
                    break;

                case MyConstant.DeviceInfo.supported32BitAbis:
                    result = await DeviceInfo.supported32BitAbis();
                    break;

                case MyConstant.DeviceInfo.supported64BitAbis:
                    result = await DeviceInfo.supported64BitAbis();
                    break;

                case MyConstant.DeviceInfo.supportedAbis:
                    result = await DeviceInfo.supportedAbis();
                    break;

                default:
                    throw new Error('Get Type Not Found!');
            }

            if (result !== false) {
                response = {
                    'type' : MyConstant.RESPONSE.TYPE.data,
                    'error': null,
                    'data' : result,
                }
            } else {
                throw result;
            }

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: GetDeviceInfo: TRY-CATCH: ', {'error': error});

            MyUtil.showMessage(showMessage, MyLANG.DeviceInfoFailed, false);

            response = {
                'type' : MyConstant.RESPONSE.TYPE.error,
                'error': error,
                'data' : null,
            }

        } finally {
            // MyUtil.printConsole(true, 'log', 'LOG: GetDeviceInfo: TRY-FINALY: ', {'response': response});

            if (showLoader !== false) {

                MyUtil.showTinyToast(showLoader && showLoader.length > 0 ? showLoader : MyLANG.PleaseWait,
                                     false,
                                     MyStyle.TinyToast.CENTER,
                                     MyStyle.TinyToast.Black.containerStyle,
                                     MyStyle.TinyToast.Black.textStyle,
                                     MyStyle.TinyToast.Black.textColor,
                                     null,
                                     MyStyle.TinyToast.imageStyleSucess,
                                     false,
                                     true,
                                     true,
                                     0,
                                     MyConstant.TINY_TOAST.HIDE
                );
            }

            if (returnType === 'string') {
                return response.data;

            } else {
                return response;

            }
        }

        /*const deviceInfo: any = await MyUtil.GetDeviceInfo(MyConstant.DeviceInfo.getApplicationName, MyConstant.SHOW_MESSAGE.TOAST);
        MyUtil.printConsole(true, 'log', 'LOG: GetDeviceInfo: await-response: ', {
            'type'      : MyConstant.DeviceInfo.getApplicationName,
            'deviceInfo': deviceInfo
        });
        if (deviceInfo) {}*/
    },

    androidPermissionCheck: async (Permission: any, showMessage: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: androidPermissionCheck:', {
            'Permission' : Permission,
            'showMessage': showMessage,
        });
        try {

            return await PermissionsAndroid.check(Permission);

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: androidPermissionCheck: TRY-CATCH: ', {'error': error});

            MyUtil.showMessage(showMessage, MyLANG.AndroidPermissionNotGranted, false);

            return error;
        }

        /*const permission: any = await MyUtil.androidPermissionCheck(MyConstant.PermissionsAndroid.ACCESS_FINE_LOCATION, MyConstant.SHOW_MESSAGE.TOAST);
        MyUtil.printConsole(true, 'log', 'LOG: androidPermissionCheck: await-response: ', {
            'PermissionsAndroid': MyConstant.PermissionsAndroid.ACCESS_FINE_LOCATION,
            'permission'        : permission
        });
        if (permission === true) {}*/
    },

    androidPermissionRequest: async (Permission: any, message: any, showMessage: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: requestAndroidPermission:', {
            'Permission' : Permission,
            'message'    : message,
            'showMessage': showMessage,
        });

        try {
            const granted = await PermissionsAndroid.request(
                Permission,
                {
                    title         : message.title,
                    message       : message.message,
                    buttonNeutral : String(MyLANG.AskMeLater),
                    buttonNegative: String(MyLANG.Cancel),
                    buttonPositive: String(MyLANG.Allow),
                },
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {

                return true;

            } else {

                return granted;
            }

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: androidPermissionRequest: TRY-CATCH: ', {'error': error});

            MyUtil.showMessage(showMessage, MyLANG.AndroidPermissionDenied, false);

            return error;
        }

        /*const permission: any = await MyUtil.androidPermissionRequest(
            MyConstant.PermissionsAndroid.ACCESS_FINE_LOCATION,
            {
                // @ts-ignore
                title  : MyLANG.Permission.title,
                // @ts-ignore
                message: MyLANG.Permission.location
            },
            MyConstant.SHOW_MESSAGE.TOAST);
        MyUtil.printConsole(true, 'log', 'LOG: androidPermissionRequest: await-response: ', {
            'PermissionsAndroid': MyConstant.PermissionsAndroid.ACCESS_FINE_LOCATION,
            'permission'        : permission
        });
        if (permission === true) {}*/
    },


    GetCurrentPosition: async (options: any, askPermission: boolean = true, showLoader: any = false, showMessage: any) => {

        MyUtil.printConsole(true, 'log', 'LOG: GetCurrentPosition:', {
            'options'      : options,
            'askPermission': askPermission,
            'showLoader'   : showLoader,
            'showMessage'  : showMessage,
        });

        let response: any = {
            'type' : MyConstant.RESPONSE.TYPE.error,
            'error': null,
            'data' : null,
        };

        let permission: any = false;

        try {

            if (showLoader !== false) {
                MyUtil.showTinyToast(showLoader && showLoader.length > 0 ? showLoader : MyLANG.PleaseWait,
                                     false,
                                     MyStyle.TinyToast.CENTER,
                                     MyStyle.TinyToast.Black.containerStyle,
                                     MyStyle.TinyToast.Black.textStyle,
                                     MyStyle.TinyToast.Black.textColor,
                                     null,
                                     MyStyle.TinyToast.imageStyleSucess,
                                     false,
                                     true,
                                     true,
                                     0,
                                     MyConstant.TINY_TOAST.SHOW
                )
            }

            if (askPermission === true) {

                if (MyStyle.platformOS === "android") {
                    permission = await MyUtil.androidPermissionRequest(
                        MyConstant.PermissionsAndroid.ACCESS_FINE_LOCATION,
                        {
                            title  : MyLANG?.Permission?.title,
                            message: MyLANG?.Permission?.location,
                        },
                        showMessage
                    );
                    MyUtil.printConsole(true, 'log', 'LOG: androidPermissionRequest: await-response: ', {
                        'PermissionsAndroid': MyConstant.PermissionsAndroid.ACCESS_FINE_LOCATION,
                        'permission'        : permission
                    });
                    if (permission !== true) {
                        throw new Error(MyLANG.LocationPermissionDenied);
                    }
                } else if (MyStyle.platformOS === "ios") {
                    permission = Geolocation.requestAuthorization();
                    MyUtil.printConsole(true, 'log', 'LOG: requestAuthorization: await-response: ', {
                        'permission': permission
                    });
                    if (permission !== 'granted') {
                        // throw new Error(MyLANG.LocationPermissionDenied);
                    }
                }
            }

            const currentPosition = new Promise((resolve, reject) => {
                if (MyStyle.platformOS === "ios") {
                    Geolocation.requestAuthorization();
                }
                Geolocation.getCurrentPosition(
                    (position: any) => {
                        resolve(position);
                    },
                    (error: any) => {
                        reject(error);
                    },
                    options
                );
            });

            await currentPosition
                .then((result: any) => {
                    response = {
                        'type' : MyConstant.RESPONSE.TYPE.data,
                        'error': null,
                        'data' : result,
                    }
                })
                .catch((error: any) => {
                    throw error;
                });

        } catch (error) {

            MyUtil.printConsole(true, 'log', 'LOG: GeocodePosition: TRY-CATCH: ', {'options': options, 'error': error});

            MyUtil.showMessage(showMessage, error?.message ? error.message : MyLANG.GPSFailed, false);

            response = {
                'type' : MyConstant.RESPONSE.TYPE.error,
                'error': error,
                'data' : null,
            }

        } finally {
            // MyUtil.printConsole(true, 'log', 'LOG: GeocodePosition: TRY-FINALY: ', {'response': response});

            if (showLoader !== false) {

                MyUtil.showTinyToast(showLoader && showLoader.length > 0 ? showLoader : MyLANG.PleaseWait,
                                     false,
                                     MyStyle.TinyToast.CENTER,
                                     MyStyle.TinyToast.Black.containerStyle,
                                     MyStyle.TinyToast.Black.textStyle,
                                     MyStyle.TinyToast.Black.textColor,
                                     null,
                                     MyStyle.TinyToast.imageStyleSucess,
                                     false,
                                     true,
                                     true,
                                     0,
                                     MyConstant.TINY_TOAST.HIDE
                )
            }

            return response;
        }

        /*const location: any = await MyUtil.GetCurrentPosition({
            enableHighAccuracy  : true,
            timeout             : 15000,
            maximumAge          : 0,
            forceRequestLocation: true
        }, MyConstant.SHOW_MESSAGE.ALERT);
        MyUtil.printConsole(true, 'log', 'LOG: GetCurrentPosition: await-response: ', {
            'location': location,
        });
        if (location && location.data.coords && location.data.coords.latitude && location.data.coords.longitude) {}*/
    },

    GeocodePosition: async (latitude: any, longitude: any, showMessage: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: GeocodePosition:', {
            'latitude'   : latitude,
            'longitude'  : longitude,
            'showMessage': showMessage,
        });

        try {
            // if (Geocoder.isInit() !== true) {
            // @ts-ignore
            Geocoder.init(MyConfig.google_map_api_key, {});
            // }
            // @ts-ignore
            const response = await Geocoder.from(
                {
                    latitude : latitude,
                    longitude: longitude
                }
            );

            return response;

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: GeocodePosition: TRY-CATCH: ', {
                'latitude' : latitude,
                'longitude': longitude,
                'error'    : error
            });

            MyUtil.showMessage(showMessage, MyLANG.GeocoderFailed, false);

            return error;
        }

        /*const position: any = await MyUtil.GeocodePosition(3.1466, 101.6958, MyConstant.SHOW_MESSAGE.TOAST);
        MyUtil.printConsole(true, 'log', 'LOG: GeocodePosition: await-response: ', {
            'position': position,
        });
        if (position && position.results && position.results[0] && position.results[0].address_components && position.results[0].address_components[0]) {}*/
    },

    GeocodeAddress: async (address: string, showLoader: any = false, showMessage: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: GeocodeAddress:', {
            'address'    : address,
            'showLoader' : showLoader,
            'showMessage': showMessage,
        });

        let response: any = {
            'type' : MyConstant.RESPONSE.TYPE.error,
            'error': null,
            'data' : null,
        };

        try {

            if (showLoader !== false) {
                MyUtil.showTinyToast(showLoader && showLoader.length > 0 ? showLoader : MyLANG.PleaseWait,
                                     false,
                                     MyStyle.TinyToast.CENTER,
                                     MyStyle.TinyToast.Black.containerStyle,
                                     MyStyle.TinyToast.Black.textStyle,
                                     MyStyle.TinyToast.Black.textColor,
                                     null,
                                     MyStyle.TinyToast.imageStyleSucess,
                                     false,
                                     true,
                                     true,
                                     0,
                                     MyConstant.TINY_TOAST.SHOW
                )
            }

            // if (Geocoder.isInit() !== true) {
            // @ts-ignore
            Geocoder.init(MyConfig.google_map_api_key, {});
            // }
            // @ts-ignore
            const geocoder: any = await Geocoder.from(address);

            if (geocoder?.results?.[0]?.geometry && geocoder?.results?.[0]?.geometry?.location?.lat && geocoder?.results?.[0]?.geometry?.location?.lng) {

                response = {
                    'type' : MyConstant.RESPONSE.TYPE.data,
                    'error': null,
                    'data' : geocoder,
                }

            } else {
                throw new Error(MyLANG.GeocoderComponentMissing);
            }

        } catch (error) {

            MyUtil.printConsole(true, 'log', 'LOG: GeocodeAddress: TRY-CATCH: ', {
                'address': address,
                'error'  : error
            });

            MyUtil.showMessage(showMessage, error?.message || MyLANG.GeocoderFailed, false);

            response = {
                'type' : MyConstant.RESPONSE.TYPE.error,
                'error': error,
                'data' : null,
            }

        } finally {
            // MyUtil.printConsole(true, 'log', 'LOG: GeocodeAddress: TRY-FINALY: ', {'response': response});

            if (showLoader !== false) {

                MyUtil.showTinyToast(showLoader && showLoader.length > 0 ? showLoader : MyLANG.PleaseWait,
                                     false,
                                     MyStyle.TinyToast.CENTER,
                                     MyStyle.TinyToast.Black.containerStyle,
                                     MyStyle.TinyToast.Black.textStyle,
                                     MyStyle.TinyToast.Black.textColor,
                                     null,
                                     MyStyle.TinyToast.imageStyleSucess,
                                     false,
                                     true,
                                     true,
                                     0,
                                     MyConstant.TINY_TOAST.HIDE
                )
            }

            return response;
        }

        /*const address: any = await MyUtil.GeocodeAddress('KLCC', MyConstant.SHOW_MESSAGE.TOAST);
        MyUtil.printConsole(true, 'log', 'LOG: GeocodeAddress: await-response: ', {
            'address': address,
        });
        */
    },

    /**
     * Get the value for a given key in address_components
     *
     * @param {Array} components address_components returned from Google maps autocomplete
     * @param type key for desired address component
     * @returns {String} value, if found, for given type (key)
     */
    extractFromAddress: (components: any, type: any) => {
        return components.filter((component: any) => component.types.indexOf(type) === 0).map((item: any) => item.long_name).pop() || null;
    },

    generateAddressFromComponent: (address_components: any) => {

        const street_number: any = MyUtil.extractFromAddress(address_components, 'street_number');
        const street: any        = MyUtil.extractFromAddress(address_components, 'route');
        const city: any          = MyUtil.extractFromAddress(address_components, 'locality');
        const state: any         = MyUtil.extractFromAddress(address_components, 'administrative_area_level_1');
        const country: any       = MyUtil.extractFromAddress(address_components, 'country');
        const postal_code: any   = MyUtil.extractFromAddress(address_components, 'postal_code');

        const address: string = MyUtil.generateAddress(street_number, street, city, state, country, postal_code);

        return address;
    },

    generateAddress: (street_number: any, street: any, city: any, state: any, country: any, postal_code: any) => {

        const address: string = `${street_number?.length ? (street_number + ', ') : ''}${street?.length ? (street + ', ') : ''}${city?.length ? (city + ', ') : ''}${state?.length ? (state + ', ') : ''}${country?.length ? (country + ', ') : ''}${postal_code?.length ? (postal_code) : ''}`;

        return address;
    },

    generateLocation: (geocodePosition: any, accuracy: any, latitude: any, longitude: any) => {

        const address: any            = geocodePosition.results[0];
        const address_components: any = address.address_components;

        const location: any = {
            accuracy : accuracy,
            latitude : latitude,
            longitude: longitude,

            address     : {
                street_number: MyUtil.extractFromAddress(address_components, 'street_number'),

                street     : MyUtil.extractFromAddress(address_components, 'route'), // CHECK
                city       : MyUtil.extractFromAddress(address_components, 'locality'),
                state      : MyUtil.extractFromAddress(address_components, 'administrative_area_level_1'),
                country    : MyUtil.extractFromAddress(address_components, 'country'),
                postal_code: MyUtil.extractFromAddress(address_components, 'postal_code'),
            },
            address_text: MyUtil.generateAddressFromComponent(address_components),

            plus_code         : geocodePosition.plus_code,
            address_components: address.address_components,
            formatted_address : address.formatted_address,
            geometry          : address.geometry,
            place_id          : address.place_id,
            types             : address.types,
        };

        return location;
    },

    myHTTP: async (loginRequired: any, httpMethod: any, apiURL: string, body: any, headers: any, asForm: boolean = false, responseType: any = MyConstant.HTTP_JSON, timeout: number = 0, showLoader: any = false, retry: any = false, cancelPrevious: boolean = true) => {

        /* MyUtil.printConsole(true, 'log', 'LOG: myHTTP: ', {
             'loginRequired'    : loginRequired,
             'httpMethod'       : httpMethod,
             'apiURL'           : apiURL,
             'body'             : body,
             'headers'          : headers,
             'responseType'     : responseType,
             'timeout'          : timeout,
             'showLoader'       : showLoader,
             'cancelPrevious'   : cancelPrevious,
             'CancelTokenSource': CancelTokenSource,
         });*/

        let response: any = {
            'type'        : MyConstant.RESPONSE.TYPE.error,
            'error'       : null,
            'errors'      : null,
            'errorMessage': null,
            'errorType'   : null,
            'data'        : null,
        }

        let auth_token = null;
        // Prepare data for API call:
        const formData = new FormData();

        try {

            if (showLoader !== false) {
                MyUtil.showTinyToast(showLoader && showLoader.length > 0 ? showLoader : MyLANG.PleaseWait,
                                     false,
                                     MyStyle.TinyToast.CENTER,
                                     MyStyle.TinyToast.Black.containerStyle,
                                     MyStyle.TinyToast.Black.textStyle,
                                     MyStyle.TinyToast.Black.textColor,
                                     null,
                                     MyStyle.TinyToast.imageStyleSucess,
                                     false,
                                     true,
                                     true,
                                     0,
                                     MyConstant.TINY_TOAST.SHOW
                );
            }

            let authReq: any = false;
            if (loginRequired !== false) {
                const user: any = store.getState().auth.user;
                MyUtil.printConsole(true, 'log', 'LOG: myHTTP: ', {'user': user});
                // if (user.id && user.token) {
                if (user.token) {
                    auth_token = user.token;
                } else {
                    auth_token         = null;
                    response.errorType = 'auth';
                    throw new Error(MyLANG.PleaseLoginFirst);
                }
            }


            const internet: any = await MyUtil.isInternetAvailable(MyConstant.SHOW_MESSAGE.SNACKBAR);
            if (internet !== true) {
                throw new Error(MyLANG.InternetConnectionNotAvailable);
            }

            const deviceInfo = store.getState().app_info.deviceInfo;

            if (asForm === true) {

                for (const key of Object.keys(body?.formFields)) {
                    if (key) {
                        formData.append(key, body?.formFields?.[key]);
                    }
                }
                for (const key of Object.keys(body?.formFiles)) {
                    if (key) {
                        const value: any = {
                            file: body.formFiles[key],
                            name: body.formFiles[key]?.fileName,
                            type: body.formFiles[key]?.type,
                            size: body.formFiles[key]?.fileSize,
                            uri : MyStyle.platformOS === "android" ? body.formFiles[key]?.uri : body.formFiles[key]?.uri.replace("file://", "")
                        };
                        formData.append(key, value);
                        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: formData: ', {key, value});
                    }
                }
                formData.append("device", deviceInfo);
                headers = {
                    'Accept'       : MyConstant.HTTP_APPLICATION_JSON,
                    'Content-Type' : MyConstant.HTTP_MULTIPART_FORM_DATA,
                    'Authorization': `Bearer ${auth_token}`,
                }

                /*for (let [key, value] of formData.entries()) {
                    MyUtil.printConsole(true, 'log', 'LOG: myHTTP: formData: ', {key, value});
                }*/

            } else {
                body.device = deviceInfo;
                headers     = {
                    'Accept'       : MyConstant.HTTP_APPLICATION_JSON,
                    'Content-Type' : MyConstant.HTTP_APPLICATION_JSON,
                    'Authorization': `Bearer ${auth_token}`,
                }
            }


            if (cancelPrevious === true && CancelTokenSource) {
                CancelTokenSource.cancel(MyLANG.OperationCanceledByUser); // cancel the request (the message parameter is optional);
            }

            // creates a new different token for upcomming request (overwrite the previous one)
            CancelTokenSource = CancelToken.source();

            const axiosResponse = await axios(apiURL, {
                cancelToken     : CancelTokenSource.token,
                method          : httpMethod,
                data            : asForm === true ? formData : body,
                responseType    : responseType,
                headers         : headers,
                timeout         : timeout > 0 ? timeout : 0,
                onUploadProgress: asForm === true ? (progressEvent: any) => {
                    const uploadPercentage: any = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log('percentCompleted: ', uploadPercentage, progressEvent);
                    if (uploadPercentage >= 100) {
                        // uploadPercentage = 'Done';
                    }
                } : () => {
                },
            });

            MyUtil.printConsole(true, 'log', 'LOG: myHTTP: request: ', {
                                    'apiURL'           : apiURL,
                                    'method'           : httpMethod,
                                    'data'             : asForm === true ? formData : body,
                                    'responseType'     : responseType,
                                    'headers'          : headers,
                                    'timeout'          : timeout,
                                    'CancelTokenSource': CancelTokenSource.token,
                                    'param'            : {
                                        'loginRequired'    : loginRequired,
                                        'httpMethod'       : httpMethod,
                                        'apiURL'           : apiURL,
                                        'body'             : body,
                                        'headers'          : headers,
                                        'responseType'     : responseType,
                                        'timeout'          : timeout,
                                        'showLoader'       : showLoader,
                                        'cancelPrevious'   : cancelPrevious,
                                        'CancelTokenSource': CancelTokenSource,
                                    }
                                }
            );

            response = {
                'type'        : MyConstant.RESPONSE.TYPE.data,
                'error'       : null,
                'errors'      : null,
                'errorMessage': axiosResponse?.data?.message || null,
                'errorType'   : null,
                'data'        : axiosResponse,
            }

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: myHTTP: TRY-CATCH: ', {
                'apiURL'           : apiURL,
                'method'           : httpMethod,
                'data'             : asForm === true ? formData : body,
                'responseType'     : responseType,
                'headers'          : headers,
                'timeout'          : timeout,
                'CancelTokenSource': CancelTokenSource.token,
                'error'            : error,
                'param'            : {
                    'loginRequired'    : loginRequired,
                    'httpMethod'       : httpMethod,
                    'apiURL'           : apiURL,
                    'body'             : body,
                    'headers'          : headers,
                    'responseType'     : responseType,
                    'timeout'          : timeout,
                    'showLoader'       : showLoader,
                    'cancelPrevious'   : cancelPrevious,
                    'CancelTokenSource': CancelTokenSource,
                },
            });

            const errors: any = [];

            if (error && error.isAxiosError === true) { // If Error is from Axios Request:
                if (axios.isCancel(error)) {  // unused in try-catch async-await method.
                    MyUtil.printConsole(true, 'log', 'LOG: myHTTP: catch: ', {'axios.isCancel': error});
                    errors.push(error.message['message']);

                } else if (error.response) {
                    MyUtil.printConsole(true, 'log', 'LOG: myHTTP: catch: ', {'error.response': error.response});

                    if (error.response.data && error.response.data.message) {
                        if (typeof error.response.data.message == 'string') {
                            errors.push(error.response.data.message);
                        } else if (typeof error.response.data.message == 'object') {
                            for (let prop in error.response.data.message) {
                                if (error.response.data.message.hasOwnProperty(prop)) {
                                    errors.push(error.response.data.message[prop]);
                                }
                            }
                        }
                    } else if (error.response.data && error.response.data.exception) {
                        errors.push(error.response.data.exception);
                    } else if (error.response.statusText) {
                        errors.push(error.response.statusText);
                    } else {
                        errors.push(MyLANG.ResponseNotFound);
                    }

                    if (error.response.status && error.response.status === 401) {
                        errors.push(MyLANG.SessionExpired);
                        // TODO: Logout
                    }

                } else if (error.request) {
                    MyUtil.printConsole(true, 'log', 'LOG: myHTTP: catch: ', {'error.request': error.request});
                    errors.push(error.message ? error.message : MyLANG.ErrorNotFound);
                } else {
                    MyUtil.printConsole(true,
                                        'log',
                                        'LOG: myHTTP: catch: ',
                                        {'error.else': error.message ? error.message : error}
                    );
                    errors.push(error.message ? error.message : MyLANG.ErrorNotFound);
                }

            } else if (error && error.message) {  // If try-catch thrown error:
                errors.push(error.message);

            } else {  // Unknonw errors:
                errors.push(MyLANG.RequestFailed);
            }

            let errorMessage: string = '';
            for (const [index, error] of errors.entries()) {
                errorMessage += (index > 0 ? '\n' : '') + error;
            }

            response = {
                'type'        : MyConstant.RESPONSE.TYPE.error,
                'error'       : error,
                'errors'      : errors,
                'errorMessage': errorMessage,
                'errorType'   : response.errorType,
                'data'        : null,
            }

            if (loginRequired?.required === true && loginRequired?.promptLogin === true && response.errorType === 'auth') {
                MyUtil.showLoginRequired(MyConstant.SHOW_MESSAGE.ALERT,
                                         MyLANG.PleaseWait + '...',
                                         true,
                                         null,
                                         MyConstant.NAVIGATION_ACTIONS.GO_BACK
                )
            }

        } finally {
            MyUtil.printConsole(true, 'log', 'LOG: myHTTP: TRY-FINALY: ', {
                'showLoader': showLoader,
                'apiURL'    : apiURL,
                'response'  : response
            });

            if (showLoader !== false) {

                MyUtil.showTinyToast(showLoader && showLoader.length > 0 ? showLoader : MyLANG.PleaseWait,
                                     false,
                                     MyStyle.TinyToast.CENTER,
                                     MyStyle.TinyToast.Black.containerStyle,
                                     MyStyle.TinyToast.Black.textStyle,
                                     MyStyle.TinyToast.Black.textColor,
                                     null,
                                     MyStyle.TinyToast.imageStyleSucess,
                                     false,
                                     true,
                                     true,
                                     0,
                                     MyConstant.TINY_TOAST.HIDE
                );

            }

            return response;
        }

        /*const response: any = await MyUtil
            .myHTTP(true, MyConstant.HTTP_POST, MyAPI.login,
                {

                    [MyConstant.PHONE]   : username,
                    [MyConstant.PASSWORD]: password,
                    "role"               : MyConfig.UserRole.customer,
                    "db_key"             : 'app_build_ver_android',
                    'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false);

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL'  : MyAPI.login,
            'response': response,
        });

        // Login Fully Successful, go for login data process:
        if (response && response.type === MyConstant.RESPONSE.TYPE.data && response.data.status === 200 && response.data.data && response.data.data.data && response.data.data.data.id && response.data.data.data.id > 0) {

            MyAuth.processLogin(username, password, response.data.data.data, false, false);

        } else {
            MyUtil.showMessage(showMessage, response.errorMessage ? response.errorMessage : MyLANG.UnknownError, false);
        }*/
    },


    fetchBlob: async (type: string, url: string, headers: any, fileType: any, showMessage: any, showLoader: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: fetchBlob:', {
            'type'       : type,
            'url'        : url,
            'headers'    : headers,
            'fileType'   : fileType,
            'showMessage': showMessage,
            'showLoader' : showLoader,
        });

        let response: any = {
            'type' : MyConstant.RESPONSE.TYPE.error,
            'error': null,
            'data' : null,
        }

        try {

            if (showLoader !== false) {
                MyUtil.showTinyToast(showLoader && showLoader.length > 0 ? showLoader : MyLANG.PleaseWait,
                                     false,
                                     MyStyle.TinyToast.CENTER,
                                     MyStyle.TinyToast.Black.containerStyle,
                                     MyStyle.TinyToast.Black.textStyle,
                                     MyStyle.TinyToast.Black.textColor,
                                     null,
                                     MyStyle.TinyToast.imageStyleSucess,
                                     false,
                                     true,
                                     true,
                                     0,
                                     MyConstant.TINY_TOAST.SHOW
                );
            }

            let res: any = null;

            switch (type) {

                case MyConstant.FetchBlobType.fetch:
                    res = await RNFetchBlob.fetch('GET', url, headers);
                    break;

                case MyConstant.FetchBlobType.fs:
                    res = await RNFetchBlob.fs.stat(RNFetchBlob.fs.asset(url));
                    break;

                default:
                    break;
            }


            MyUtil.printConsole(true, 'log', 'LOG: fetch: await-response: ', {
                'url' : url,
                'res' : res,
                'info': res.info(),
            });

            if (res.info().status === 200 && mime.lookup(url)) {
                switch (fileType) {
                    case MyConstant.FetchFileType.base64:
                        response = {
                            'type' : MyConstant.RESPONSE.TYPE.data,
                            'error': null,
                            'data' : `data:${mime.lookup(url)};base64,` + res.base64(),
                        }
                        break;
                    default:
                        response = {
                            'type' : MyConstant.RESPONSE.TYPE.data,
                            'error': null,
                            'data' : res.base64(),
                        }
                        break;
                }
            } else {
                throw new Error(MyLANG.FileFetchingFailed);
            }

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: fetchBlob: TRY-CATCH: ', {'url': url, 'error': error});

            MyUtil.showMessage(showMessage, MyLANG.FileFetchingFailed, false);

            response = {
                'type' : MyConstant.RESPONSE.TYPE.error,
                'error': error,
                'data' : null,
            }

        } finally {
            MyUtil.printConsole(true, 'log', 'LOG: fetchBlob: TRY-FINALY: ', {'response': response});

            if (showLoader !== false) {

                MyUtil.showTinyToast(showLoader && showLoader.length > 0 ? showLoader : MyLANG.PleaseWait,
                                     false,
                                     MyStyle.TinyToast.CENTER,
                                     MyStyle.TinyToast.Black.containerStyle,
                                     MyStyle.TinyToast.Black.textStyle,
                                     MyStyle.TinyToast.Black.textColor,
                                     null,
                                     MyStyle.TinyToast.imageStyleSucess,
                                     false,
                                     true,
                                     true,
                                     0,
                                     MyConstant.TINY_TOAST.HIDE
                );

            }

            return response;
        }

        /*const response: any = await MyUtil.fetchBlob(MyConstant.FetchBlobType.fetch,
                                                     product?.image,
                                                     {},
                                                     MyConstant.FetchFileType.base64,
                                                     MyConstant.SHOW_MESSAGE.TOAST,
                                                     true
        );
        MyUtil.printConsole(true, 'log', 'LOG: fetchBlob: await-response: ', {
            'response': response,
        });
        if (response?.type === MyConstant.RESPONSE.TYPE.data && response?.data) {

        }*/
    },

    linking: async (shareType: string, url: any, showMessage: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: linking:', {
            'shareType'  : shareType,
            'url'        : url,
            'showMessage': showMessage,
        });
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);

            } else {
                MyUtil.showMessage(showMessage, MyLANG.UnableToOpen, false);
            }

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: linking: TRY-CATCH: ', {'error': error});

            MyUtil.showMessage(showMessage, MyLANG.UnableToOpen, false);
        }
    },

    share: async (shareType: string, fetchBlob: any, options: any, showMessage: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: share:', {
            'shareType'  : shareType,
            'fetchBlob'  : fetchBlob,
            'options'    : options,
            'showMessage': showMessage,
        });

        // If both message and url are provided, url will be concatenated to the end of message to form the body of the message. If only one is provided it will be used.
        try {
            const shareOptions: any = options;
            // title  : title,
            // message: message,
            // subject: subject,
            // urls   : urls,
            // email  : email,
            // social : social.name,
            // whatsAppNumber: "9199999999",  // country code + phone number(currently only works on Android)
            // filename      : 'test', // only for base64 file in Android

            if (fetchBlob !== false) {
                const blob: any = await MyUtil.fetchBlob(MyConstant.FetchBlobType.fetch,
                                                         fetchBlob,
                                                         {},
                                                         MyConstant.FetchFileType.base64,
                                                         showMessage,
                                                         true
                );
                MyUtil.printConsole(true, 'log', 'LOG: fetchBlob: await-response: ', {
                    'blob': blob,
                });
                if (blob?.type === MyConstant.RESPONSE.TYPE.data && blob?.data) {
                    shareOptions.url = blob?.data;
                } else {
                    throw new Error(MyLANG.FileFetchingFailed);
                }
            }

            MyUtil.printConsole(true, 'log', 'LOG: share:', {
                'shareType'   : shareType,
                'fetchBlob'   : fetchBlob,
                'shareOptions': shareOptions,
                'showMessage' : showMessage,
            });

            await Share
                .open(shareOptions)
                .then((result: any) => {
                    // MyUtil.printConsole(true, 'log', 'LOG: share: resolve-then: ', {'result': result});
                })
                .catch((error: any) => {
                    throw error;
                });

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: share: TRY-CATCH: ', {'options': options, 'error': error});

            MyUtil.showMessage(showMessage, MyLANG.ShareFailed, false);
        }

        /*MyUtil
            .share(MyConstant.SHARE.TYPE.open,
                   {
                       title  : 'Test Share',
                       message: 'Test Share',
                       subject: 'Test Share',
                       urls   : ['https', 'http'],
                       email  : 'test@test.com',
                       social : {name: MyConstant.SHARE.SOCIAL.WHATSAPP}
                   },
                   MyConstant.SHOW_MESSAGE.TOAST
            )
            .then((result: any) => {
                MyUtil.printConsole(true, 'log', 'LOG: share: resolve-then: ', {'result': result});

            })
            .catch((error: any) => {
                MyUtil.printConsole(true, 'log', 'LOG: share: reject-catch: ', {'error': error});
            })*/
    },

    imagePicker: async (options: any, openType: any, showMessage: any) => {

        MyUtil.printConsole(true, 'log', 'LOG: imagePicker:', {
            'options'    : options,
            'openType'   : openType,
            'showMessage': showMessage
        });

        const response = new Promise(async (resolve, reject) => {
            switch (openType) {
                case MyConstant.IMAGE_PICKER.OPEN_TYPE.Camera:
                    await ImagePicker.launchCamera(options, (response) => {

                        if (response.didCancel) {

                            MyUtil.showMessage(showMessage, MyLANG.ImagePickerCanceled, false);

                            reject(response.didCancel);

                        } else if (response.error) {

                            MyUtil.showMessage(showMessage, MyLANG.ImagePickerError, false);

                            reject(response.error);

                        } else if (response.customButton) {
                            // console.log('User tapped custom button: ', response.customButton);

                        } else {

                            resolve(response);

                        }
                    });
                    break;

                case MyConstant.IMAGE_PICKER.OPEN_TYPE.ImageLibrary:
                    await ImagePicker.launchImageLibrary(options, (response) => {

                        if (response.didCancel) {

                            MyUtil.showMessage(showMessage, MyLANG.ImagePickerCanceled, false);

                            reject(response.didCancel);

                        } else if (response.error) {

                            MyUtil.showMessage(showMessage, MyLANG.ImagePickerError, false);

                            reject(response.error);

                        } else if (response.customButton) {
                            // console.log('User tapped custom button: ', response.customButton);

                        } else {

                            resolve(response);

                        }
                    });
                    break;

                case MyConstant.IMAGE_PICKER.OPEN_TYPE.ALL:
                default:
                    await ImagePicker.showImagePicker(options, (response) => {

                        // MyUtil.printConsole(true, 'log', 'LOG: imagePicker:', {'response': response});

                        if (response.didCancel) {

                            MyUtil.showMessage(showMessage, MyLANG.ImagePickerCanceled, false);

                            reject(response.didCancel);

                        } else if (response.error) {

                            MyUtil.showMessage(showMessage, MyLANG.ImagePickerError, false);

                            reject(response.error);

                        } else if (response.customButton) {
                            // console.log('User tapped custom button: ', response.customButton);

                        } else {

                            resolve(response);

                        }
                    });
                    break;
            }
        });

        return response
            .then((result: any) => {
                return {
                    'type' : MyConstant.RESPONSE.TYPE.data,
                    'error': null,
                    'data' : result,
                }

            })
            .catch((error: any) => {
                MyUtil.printConsole(true, 'log', 'LOG: imagePicker: TRY-CATCH: ', {'error': error});

                // MyUtil.showMessage(showMessage, MyLANG.DeviceInfoFailed, false);

                return {
                    'type' : MyConstant.RESPONSE.TYPE.error,
                    'error': error,
                    'data' : null,
                }
            });
        /*const response: any = await MyUtil.imagePicker(MyConfig.DefatulImagePickerOptions,
                                                       MyConstant.IMAGE_PICKER.OPEN_TYPE.ALL,
                                                       MyConstant.SHOW_MESSAGE.TOAST
        );

        MyUtil.printConsole(true, 'log', 'LOG: imagePicker: await-response: ', {'image': response});*/

    },

    documentPicker: async (options: any, openType: any, showMessage: any) => {

        MyUtil.printConsole(true, 'log', 'LOG: documentPicker:', {
            'options'    : options,
            'openType'   : openType,
            'showMessage': showMessage
        });

        let response: any = {
            'type' : MyConstant.RESPONSE.TYPE.error,
            'error': null,
            'data' : null,
        }

        try {
            const res = await DocumentPicker.pick(options);

            response = {
                'type' : MyConstant.RESPONSE.TYPE.data,
                'error': null,
                'data' : {
                    'fileSize': res.size,
                    'fileName': res.name,
                    'type'    : res.type,
                    'uri'     : res.uri,
                },
            }

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: documentPicker: TRY-CATCH: ', {'error': error});

            if (DocumentPicker.isCancel(error)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                MyUtil.showMessage(showMessage, MyLANG.FilePickerFailed, false);
            }

            response = {
                'type' : MyConstant.RESPONSE.TYPE.error,
                'error': error,
                'data' : null,
            }

        } finally {
            MyUtil.printConsole(true, 'log', 'LOG: documentPicker: TRY-FINALY: ', {'response': response});

            return response;
        }
    },

    showMessage: (showMessage: any, message: any, retry: boolean = false) => {
        switch (showMessage) {

            case MyConstant.SHOW_MESSAGE.ALERT:
                MyUtil.showAlert(message?.title ? message.title : MyLANG.Error, message?.message ? message.message : message, true, [
                    {
                        text: MyLANG.Ok,
                        // onPress: () => MyUtil.printConsole(true, 'log', 'LOG: showAlert: ', 'OK');
                    },
                ]);
                break;

            case MyConstant.SHOW_MESSAGE.TOAST:
                MyUtil.showTinyToast(message,
                                     MyConstant.TINY_TOAST.LONG,
                                     MyStyle.TinyToast.BOTTOM,
                                     MyStyle.TinyToast.White.containerStyle,
                                     MyStyle.TinyToast.White.textStyle,
                                     MyStyle.TinyToast.White.textColor,
                                     null,
                                     MyStyle.TinyToast.imageStyleSucess,
                                     true,
                                     false,
                                     false,
                                     0,
                                     MyConstant.TINY_TOAST.HIDE_AND_SHOW
                );
                break;

            case MyConstant.SHOW_MESSAGE.SNACKBAR:
                MyUtil.showSnackbar(message,
                                    MyConstant.SNACKBAR.LENGTH_LONG,
                                    MyColor.snackbarDark.color,
                                    MyColor.snackbarDark.background,
                                    undefined
                );
                break;

            case MyConstant.SHOW_MESSAGE.SNACKBAR_RETRY:
                MyUtil.showSnackbar(message,
                                    MyConstant.SNACKBAR.LENGTH_LONG,
                                    MyColor.snackbarWhite.color,
                                    MyColor.snackbarWhite.background,
                                    retry === true ? {
                                        title  : MyLANG.Retry,
                                        color  : MyColor.snackbarWhite.buttonColor,
                                        onPress: () => {
                                            MyUtil.printConsole(true, 'log', 'LOG: showSnackbar: onPress: ', {
                                                'title': MyLANG.Retry,
                                            });

                                        },
                                    } : undefined
                );
                break;

            default:
                break;
        }
    },

    showDropDownAlert(type: any, title: any, message: any, payload: any, interval: any) {

        MyUtil.printConsole(true, 'log', 'LOG: showDropDownAlert: ', {
            'type'    : type,
            'title'   : title,
            'message' : message,
            'payload' : payload,
            'interval': interval,
        });

        MyAlert.show(type, title, message, payload, interval);

        // MyUtil.showDropDownAlert(MyConstant.DROPDOWN_ALERT.TYPE.success, MyLANG.Attention, 'Looks good!ss!', {message:
        // 'HelloWorld'}, 3000);
    },

    showTinyToast: (message: any, duration: any, position: any, containerStyle: any, textStyle: any, textColor: string, imgSource: any, imgStyle: any, shadow: boolean, mask: boolean, loading: boolean, timeout: number, show: string, toastName: any = 'loading') => {
        /*MyUtil.printConsole(true, 'log', 'LOG: showTinyToast: ', {
            'message'       : message,
            'duration'      : duration,
            'position'      : position,
            'containerStyle': containerStyle,
            'textStyle'     : textStyle,
            'textColor'     : textColor,
            'imgSource'     : imgSource,
            'imgStyle'      : imgStyle,
            'shadow'        : shadow,
            'mask'          : mask,
            'loading'       : loading,
            'timeout'       : timeout,
            'show'          : show,
            'toastName'     : toastName,
        });*/

        if (show === MyConstant.TINY_TOAST.HIDE_AND_SHOW || show === MyConstant.TINY_TOAST.HIDE) {
            if (loading === true) {
                Toast.hide(toast.loading);
            } else {
                Toast.hide(toast.loading);
            }
        }

        if (show === MyConstant.TINY_TOAST.HIDE_AND_SHOW || show === MyConstant.TINY_TOAST.SHOW) {

            toast.loading = Toast.show(message, {
                duration      : timeout && timeout > 0 ? null : (duration === false ? null : duration),
                position      : position,
                containerStyle: containerStyle,
                textStyle     : textStyle,
                textColor     : textColor,
                shadow        : shadow,
                mask          : mask,
                loading       : loading,
                // maskStyle: {},
                imgSource     : imgSource,
                imgStyle      : imgStyle,
            });

            if (timeout && timeout > 0) {
                setTimeout(() => {
                    // Recommend
                    if (loading === true) {
                        Toast.hide(toast.loading);
                    } else {
                        Toast.hide(toast.loading);
                    }
                }, timeout);
            }
        }

        // If timeout is set it will run that duration, If duration is set to null, will run for indefinatly, otherwise run
        // for duration. MyUtil.showTinyToast(MyLANG.NoConnection, MyConstant.TINY_TOAST.LONG, MyStyle.TINY_TOAST.BOTTOM,
        // MyStyle.TINY_TOAST.containerStyleDark, MyStyle.TINY_TOAST.textStyleWhite, MyStyle.TINY_TOAST.textColorWhite,
        // MyImage.defaultAvatar, MyStyle.TINY_TOAST.imageStyleSucess, false, false, false, 0, MyConstant.TINY_TOAST.SHOW);
    },

    showSnackbar: (text: any, duration: any, textColor: any, backgroundColor: any, action: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: showSnackbar: ', {
            'text'           : text,
            'duration'       : duration,
            'textColor'      : textColor,
            'backgroundColor': backgroundColor,
            'action'         : action
        });

        switch (duration) {
            case 'LENGTH_INDEFINITE':
                duration = Snackbar.LENGTH_INDEFINITE;
            case 'LENGTH_LONG':
                duration = Snackbar.LENGTH_LONG;
            case 'LENGTH_SHORT':
                duration = Snackbar.LENGTH_SHORT;
                break;
            default:
                duration = Snackbar.LENGTH_SHORT;
                break;
        }

        Snackbar.show(
            {
                text           : text,
                duration       : Snackbar.LENGTH_INDEFINITE,
                textColor      : textColor,
                backgroundColor: backgroundColor,
                action         : action,
            }
        );

        /*MyUtil.showSnackbar(MyLANG.NoConnection, MyConstant.LENGTH_SHORT, MyColor.snackbarWhite.color, MyColor.snackbarWhite.background,  {
         title  : MyLANG.Retry,
         color  : MyColor.snackbarWhite.buttonColor,
         onPress: () => {
         MyUtil.printConsole(true, 'log', 'LOG: showSnackbar: ', {
         'title'  : MyLANG.Retry,
         'onPress': ''
         });
         },
         });*/
    },

    showAlert: (title: any, message: any, cancelable: boolean, buttons: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: showAlert: ', {
            'title'     : title,
            'message'   : message,
            'cancelable': cancelable,
            'buttons'   : buttons,
        });
        Alert.alert(
            title,
            message,
            buttons,
            {cancelable: cancelable},
        );
        /*MyUtil.showAlert(MyLANG.Attention, MyLANG.LoginRequired, false, [
            {
                text   : 'Cancel',
                style  : 'cancel',
                onPress: () => {
                    MyUtil.printConsole(true, 'log', 'LOG: showAlert: ', 'Cancel');
                },
            },
            {
                text   : 'OK',
                onPress: () => {
                    MyUtil.printConsole(true, 'log', 'LOG: showAlert: ', 'OK');
                }
            },
        ])*/
    },

    showAsyncAlert: async (title: string, message: string, buttons: any, options: any): Promise<any> => {
        return new Promise((resolve, reject) => {
            // We can't detect a cancellation, so make sure the Alert is not cancellable.
            options.cancellable = false
            buttons.forEach((button: any, index: number) => {
                let onPress    = button.onPress
                button.onPress = (option: any) => {
                    if (onPress) {
                        onPress(option)
                    }
                    resolve(index)
                }
            })
            Alert.alert(title, message, buttons, options)
        })
        // let option = await showAsyncAlert(title, message, buttons options)
        // if (option === 0) {}
    },

    showActionSheet: async (sheetType: string, title: any, theme: string, items: any, alert: any): Promise<any> => {
        MyUtil.printConsole(true, 'log', 'LOG: showActionSheet:', {
            'sheetType': sheetType,
            'title'    : title,
            'theme'    : theme,
            'items'    : items,
            'alert'    : alert,
        });

        let ActionSheet: any = null;
        switch (sheetType) {
            case MyConstant.ACTION_SHEET.TYPE.SHEET:
                ActionSheet = RNBottomActionSheet.SheetView;
                break;
            case MyConstant.ACTION_SHEET.TYPE.GRID:
                ActionSheet = RNBottomActionSheet.GridView;
                break;
            case MyConstant.ACTION_SHEET.TYPE.ALERT:
                ActionSheet = RNBottomActionSheet.AlertView;
                break;
            default:
                ActionSheet = RNBottomActionSheet.SheetView;
                break;
        }

        return new Promise(async (resolve, reject) => {

            ActionSheet.Show(
                {
                    title: title,
                    items: items,
                    theme: theme,

                    message                : alert.message,
                    positiveText           : MyLANG.OK,
                    positiveBackgroundColor: MyStyle.ActionSheetAlert.positiveBackgroundColor,
                    positiveTextColor      : MyStyle.ActionSheetAlert.positiveTextColor,
                    negativeText           : MyLANG.CANCEL,
                    negativeBackgroundColor: MyStyle.ActionSheetAlert.negativeBackgroundColor,
                    negativeTextColor      : MyStyle.ActionSheetAlert.negativeTextColor,

                    onSelection: (index: any, value: any) => {
                        resolve({index, value});
                    },
                    onCancel   : () => {
                        reject('cancel');
                    },
                    onPositive : () => {
                        resolve('ok');
                    },
                    onNegative : () => {
                        reject('cancel');
                    }
                }
            );
        })

        /*const facebook  = <MyIcon.SimpleLineIcons name = "people"
        color = {'#333333'}
        size = {16}/>;
        const instagram = <MyIcon.SimpleLineIcons name = "people"
        color = {'#333333'}
        size = {16}/>;
        let items       = [
            {title: 'Facebook', value: 'fb', subTitle: 'Facebook Description', icon: facebook},
            {title: 'Instagram', value: 'insta', subTitle: 'Instagram Description', icon: instagram},
        ];

        MyUtil.showActionSheet(MyConstant.ACTION_SHEET.TYPE.SHEET, 'Awesome5!', MyConstant.ACTION_SHEET.THEME.light, items, {
            message: 'Show This',
        })
              .then((result: any) => {

                  MyUtil.printConsole(true, 'log', 'LOG: showActionSheet: resolve-then: ', {
                      'result': result,
                  });

              })
              .catch((error: any) => {
                  MyUtil.printConsole(true, 'log', 'LOG: showActionSheet: reject-catch: ', {
                      'error': error,
                  });
              })*/
    },


    AsyncStorageSet: async (key: string, data: any, showMessage: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageSet:', {
            'key'        : key,
            'data'       : data,
            'showMessage': showMessage,
        });

        try {
            await AsyncStorage.setItem(key, data); // JSON.stringy()

            return true;

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageSet: TRY-CATCH: ', {
                'key'  : key,
                'data' : data,
                'error': error
            });

            MyUtil.showMessage(showMessage, MyLANG.StorageStoreFailed, false);

            return error;
        }

        /*const storage: any = await MyUtil.AsyncStorageSet('key', 'data', MyConstant.SHOW_MESSAGE.TOAST);
        MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageSet: await-response: ', {'key': '', 'storage': storage});
        if (storage === true) {}*/
    },

    AsyncStorageGet: async (key: string, showMessage: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageGet:', {'key': key, 'showMessage': showMessage});

        try {
            return await AsyncStorage.getItem(key);

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageGet: TRY-CATCH: ', {'key': key, 'error': error});

            MyUtil.showMessage(showMessage, MyLANG.StorageRetriveFailed, false);

            return error;
        }

        /*const storage: any = await MyUtil.AsyncStorageGet('key', MyConstant.SHOW_MESSAGE.TOAST);
        MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageGet: await-response: ', {
            'key'    : MyConfig.AsyncStorage.APP_FRESH_INSTALL,
            'storage': storage // JSON.parse()
        });
        if (storage && storage['key']) {}*/
    },

    AsyncStorageRemove: async (key: string, showMessage: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageRemove:', {
            'key'        : key,
            'showMessage': showMessage,
        });

        try {
            await AsyncStorage.removeItem(key);

            return true;

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageRemove: TRY-CATCH: ', {'key': key, 'error': error});

            MyUtil.showMessage(showMessage, MyLANG.StorageRemoveFailed, false);

            return error;
        }

        /*const storage: any = await MyUtil.AsyncStorageRemove(MyConfig.AsyncStorage.AUTH_TOEKN, MyConstant.SHOW_MESSAGE.TOAST);
        MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageRemove: await-response: ', {
            'key'    : MyConfig.AsyncStorage.AUTH_TOEKN,
            'storage': storage
        });
         if (storage === true) {}*/
    },

    AsyncStorageClear: async (showMessage: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageClear:', {
            'showMessage': showMessage,
        });

        try {
            await AsyncStorage.clear();

            return true;

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageClear: TRY-CATCH: ', {'error': error});

            MyUtil.showMessage(showMessage, MyLANG.StorageClearFailed, false);

            return error;
        }

        /*const storage: any = await MyUtil.AsyncStorageClear(MyConstant.SHOW_MESSAGE.TOAST);
        MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageClear: await-response: ', {'storage': storage});
        if (storage === true) {}*/
    },


    keychainGetBiometryType: async (showMessage: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: keychainGetBiometryType:', {'showMessage': showMessage});

        try {
            return await Keychain.getSupportedBiometryType();

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: keychainGetBiometryType: TRY-CATCH: ', {'error': error});

            MyUtil.showMessage(showMessage, MyLANG.KeyChainGetSupportedFailed, false);

            return error;
        }
    },

    keychainSet: async (username: string, password: string, service: string, showMessage: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: KeychainSet:', {
            'username'   : username,
            'password'   : password,
            'service'    : service,
            'showMessage': showMessage,
        });

        const biometryOption: any = {
            accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
            accessible   : Keychain.ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
            // authenticationPrompt: {title: MyLANG.PleaseVerifyForAuth},
            // accessGroup  : '',
            service      : MyStyle.platformOS === "ios" ? MyConfig.ios_app_id : MyConfig.android_package_name,
            // securityLevel: '',
        }

        try {
            await Keychain.setGenericPassword(username, password);

            return true;
        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: keychainSet: TRY-CATCH: ', {
                'username': username,
                'password': password,
                'error'   : error
            });

            MyUtil.showMessage(showMessage, MyLANG.KeyChainStoreFailed, false);

            return error;
        }

        /*const keychain: any = await MyUtil.keychainSet(username, password, MyConfig.android_package_name, MyConstant.SHOW_MESSAGE.TOAST);
        MyUtil.printConsole(true, 'log', 'LOG: keychainSet: await-response: ', {
            'android_package_name': MyConfig.android_package_name,
            'keychain'        : keychain
        });
        if (keychain === true) {}*/
    },

    keychainGet: async (showMessage: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: keychainGet:', {'showMessage': showMessage});

        try {
            return await Keychain.getGenericPassword();

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: keychainGet: TRY-CATCH: ', {'error': error});

            MyUtil.showMessage(showMessage, MyLANG.KeyChainRetriveFailed, false);

            return error;
        }

        // const keychain: any = await MyUtil.keychainGet(MyConstant.SHOW_MESSAGE.TOAST);
        // MyUtil.printConsole(true, 'log', 'LOG: keychainGet: await-response: ', {'keychain': keychain});
        // if (keychain && keychain[MyConstant.USERNAME] && keychain[MyConstant.PASSWORD]){}
    },

    keychainReset: async (showMessage: any) => {

        MyUtil.printConsole(true, 'log', 'LOG: keychainReset:', {'showMessage': showMessage});

        try {

            return await Keychain.resetGenericPassword();

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: keychainReset: TRY-CATCH: ', {'error': error});

            MyUtil.showMessage(showMessage, MyLANG.KeyChainResetFailed, false);

            return error;
        }

        /*const keychain: any = await MyUtil.keychainReset(MyConstant.SHOW_MESSAGE.TOAST);
        MyUtil.printConsole(true, 'log', 'LOG: keychainReset: await-response: ', {'keychain': keychain});
        if (keychain === true) {}*/
    },


    momentFormat: (date: any, format: any = null, parse: any = null) => {
        /*MyUtil.printConsole(true, 'log', 'LOG: momentFormat: ', {
            'date'  : date,
            'format': format,
            'parse' : parse,
            'Moment': Moment(date, parse).format(format)
        });*/
        const moment = Moment(date, parse).format(format);

        if (moment && moment !== 'Invalid date') {
            return moment;
        } else {
            return false;
        }

        // {MyUtil.momentFormat('2016-05-02T00:00:00', MyConstant.MomentFormat["1st Jan, 1970 12:01:01 am"])}
    },

    printConsole(show: boolean, type: string, title: string, message: any) {
        if (MyConfig.printConsole === true && show === true) {
            switch (type) {
                case 'log':
                    console.log(title, message);
                    break;
                case 'error':
                    console.error(title, message);
                    break;
                default:
                    console.log(title, message);
                    break;
            }
        }

        // MyUtil.printConsole(true, 'log', 'LOG: API_WEB_STARTUP: ', {'url': '', 'data': ''});
    },
}

export default MyUtil;
