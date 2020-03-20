import React from "react";
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import * as Keychain from 'react-native-keychain';
import NetInfo from '@react-native-community/netinfo';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import DeviceInfo from 'react-native-device-info';
import Snackbar from 'react-native-snackbar';
import Toast from 'react-native-tiny-toast'
import {Alert, PermissionsAndroid, PixelRatio, Text} from 'react-native';
import RNBottomActionSheet from 'react-native-bottom-action-sheet';
import Share from 'react-native-share';
import ImagePicker from 'react-native-image-picker';
import Splash from "react-native-splash-screen";
import Moment from 'moment';
import NavigationService from "./NavigationService";
import {DrawerActions} from '@react-navigation/native';

// import {firebase} from '@react-native-firebase/messaging';

import MyLANG from '../shared/MyLANG';
import MyImage from '../shared/MyImage';
import {MyConfig} from '../shared/MyConfig';
import {MyConstant} from '../common/MyConstant';
import MyColor from '../common/MyColor';
import {MyStyle} from '../common/MyStyle';
import MyIcon from "../components/MyIcon";

import {
    Notification,
    NotificationResponse,
    Notifications,
    Registered,
    RegistrationError
} from "react-native-notifications";
import {NotificationCompletion} from "react-native-notifications/lib/dist/interfaces/NotificationCompletion";
import {MyAlert} from "../components/MyAlert";


const CancelToken          = axios.CancelToken;
let CancelTokenSource: any = null;

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

    formProcess: async (e: any, handleSubmit: any, formState: any, errors: any, getValues: any) => {
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
                    throw new Error(JSON.stringify(errors));

                } else {
                    // Touched, No errors {}, other fields have error
                    throw new Error(errors);  // TODO:
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
                for (var key of Object.keys(errorMessages)) {
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

    onImageError: (error: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: onImageError: ', {'error': error});
    },

    /**
     * getName user
     * @user
     */
    // @ts-ignore
    getName: (user) => {
        if (user != null) {
            if (
                typeof user.last_name !== 'undefined' ||
                typeof user.first_name !== 'undefined'
            ) {
                const first = user.first_name != null ? user.first_name : "";
                const last  = user.last_name != null ? user.last_name : "";
                return `${first} ${last}`;
            } else if (typeof user.name !== 'undefined' && user.name != null) {
                return user.name;
            }
            return MyLANG.Guest;
        }
        return MyLANG.Guest;
    },

    /**
     * getAvatar
     * @user
     */
    // @ts-ignore
    getAvatar: (user) => {
        if (user) {
            if (user.avatar_url) {
                return {
                    uri: user.avatar_url,
                };
            } else if (user.picture) {
                return {
                    uri: user.picture.data.url,
                };
            }
            // return MyImage.defaultAvatar;
        }

        // return MyImage.defaultAvatar;
    },


    reactNavigate: (routeName: any, params: any, navigationActions: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: reactNavigate: ', {
            'routeName'        : routeName,
            'params'           : params,
            'navigationActions': navigationActions,
        });

        NavigationService.navigate(routeName, params);

        switch (navigationActions) {
            case MyConstant.NAVIGATION_ACTIONS.HIDE_SPLASH:
                Splash.hide();
                break;
            default:
                break;
        }

        // MyUtil.reactNavigate(MyConfig.routeName.HomeNavigator, {}, null, null, MyConstant.LOGIN_REDIRECT.ROUTE_TO_HOME);
    },

    reactNavigateBack: (params: any, navigationActions: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: reactNavigateBack: ', {
            'params'           : params,
            'navigationActions': navigationActions,
        });
        NavigationService.goBack();

        switch (navigationActions) {
            default:
                break;
        }

        // MyUtil.reactNavigateBack(MyConfig.routeName.HomeNavigator, {}, null, null,
        // MyConstant.LOGIN_REDIRECT.ROUTE_TO_HOME);
    },

    reactNavigateReset: (index: any, routes: any, navigationActions: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: reactNavigateReset: ', {
            'index'            : index,
            'routes'           : routes,
            'navigationActions': navigationActions,
        });
        NavigationService.reset(index, routes);

        switch (navigationActions) {
            default:
                break;
        }

        // MyUtil.reactNavigateReset(MyConfig.routeName.HomeNavigator, {}, null, null,
    },

    reactNavigateSetParams: (params: any, navigationActions: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: reactNavigateSetParams: ', {
            'params'           : params,
            'navigationActions': navigationActions,
        });
        NavigationService.setParams(params);

        switch (navigationActions) {
            default:
                break;
        }

        // MyUtil.reactNavigateSetParams(MyConfig.routeName.HomeNavigator, {}, null, null,
    },

    drawerAction: (actionType: string, navigation: any, routeName: any, params: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: drawerAction: ', {
            'actionType': actionType,
            'routeName' : routeName,
            'params'    : params,
        });

        switch (actionType) {
            case MyConstant.DRAWER.OPEN:
                navigation.dispatch(DrawerActions.openDrawer());
                break;
            case MyConstant.DRAWER.CLOSE:
                navigation.dispatch(DrawerActions.closeDrawer());
                break;
            case MyConstant.DRAWER.TOGGLE:
                navigation.dispatch(DrawerActions.toggleDrawer());
                break;
            case MyConstant.DRAWER.JUMP_TO:
                navigation.dispatch(DrawerActions.jumpTo(routeName, params));
                break;
            default:
                break;
        }
    },


    firebaseCheckPermission: async () => {
        const hasPermissions: boolean = await Notifications.isRegisteredForRemoteNotifications();
        MyUtil.printConsole(true, 'log', 'LOG: firebaseCheckPermission: ', {
            'hasPermissions': hasPermissions
        });
        return hasPermissions;

        // MyUtil.firebaseCheckPermission();
    },

    firebaseGetToken: async () => {

        Notifications.registerRemoteNotifications();

        Notifications.events().registerRemoteNotificationsRegistered((registered: Registered) => {

            MyUtil.printConsole(true, 'log', 'LOG: RemoteNotificationsRegistered: ', {
                'registered': registered
            });

            const deviceToken = registered.deviceToken;

            MyUtil.AsyncStorageSet(MyConfig.AsyncStorage.FIREBASE_TOEKN, deviceToken, MyConstant.SHOW_MESSAGE.TOAST)
                  .then(result => {
                      MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageSet: resolve-then: ', {
                          'key' : MyConfig.AsyncStorage.FIREBASE_TOEKN,
                          'data': deviceToken
                      });

                      MyUtil.firebaseNotificationListeners();

                  })
                  .catch(error => {
                      MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageSet: reject-catch: ', {
                          'key'  : MyConfig.AsyncStorage.FIREBASE_TOEKN,
                          'error': error
                      });
                  });
        });

        Notifications.events().registerRemoteNotificationsRegistrationFailed((registrationError: RegistrationError) => {

            MyUtil.printConsole(true,
                                'log',
                                'LOG: RemoteNotificationsRegistrationFailed: ',
                                {'registrationError': registrationError}
            );

            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.FirebaseTokenFailed, false);

        });

        // MyUtil.firebaseGetToken();
    },

    firebaseInitialNotification: async () => {
        return await Notifications.getInitialNotification();

        /*MyUtil.firebaseInitialNotification()
            .then((notification) => {

                MyUtil.printConsole(true, 'log', 'LOG: firebaseInitialNotification-then: ', {'notification': notification});

            })
            .catch((error) => {
                MyUtil.printConsole(true, 'log', 'LOG: firebaseInitialNotification-catch: ', {'error': error});

            });*/
    },

    firebaseSendLocal: async (title: string, body: string, id: number) => {
        MyUtil.printConsole(true, 'log', 'LOG: firebaseSendLocal:', {
            'id'   : id,
            'title': title,
            'body' : body,
        });

        let localNotification = Notifications.postLocalNotification(
            {
                title     : title,
                body      : body,
                // extra     : "data",
                sound     : "chime.aiff",
                // silent    : false,
                // category  : "SOME_CATEGORY",
                badge     : 0,
                identifier: "",
                payload   : {},
                thread    : "",
                type      : "",
            },
            id
        );
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
         .then(result => {
         MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageGet: resolve-then: ', {'result': result});

         // const fcmToken = result;

         })
         .catch(async error => {
         MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageGet: reject-catch: ', {'error': error});

         const fcmToken = await firebase.messaging().getToken();

         if (fcmToken) {
         MyUtil.AsyncStorageSet(MyConstant.FIREBASE_TOEKN, fcmToken, MyConstant.SHOW_MESSAGE.TOAST)
         .then(result => {
         MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageSet: resolve-then: ', {'result': result});
         })
         .catch(error => {
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

        // Notifications.cancelLocalNotification(id);
        // Notifications.removeAllDeliveredNotifications();

        Notifications.events().registerNotificationReceivedForeground((notification: Notification, completion: (response: NotificationCompletion) => void) => {

            MyUtil.printConsole(true, 'log', 'LOG: Notification Received - Foreground: ', {'notification': notification});

            // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
            completion({alert: true, sound: true, badge: false});
        });

        Notifications.events().registerNotificationReceivedBackground((notification: Notification, completion: (response: NotificationCompletion) => void) => {

            MyUtil.printConsole(true, 'log', 'LOG: Notification Received - Background: ', {'notification': notification});

            // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
            completion({alert: true, sound: true, badge: false});
        });

        Notifications.events().registerNotificationOpened((response: NotificationResponse, completion: () => void) => {

            MyUtil.printConsole(true, 'log', 'LOG: Notification Opened: ', {'response': response});

            completion();
        });
        /*Notifications.events().registerNotificationOpened((notification: Notification, completion: () => void, action: NotificationActionResponse) => {
         console.log("Notification opened by device user", notification.payload);
         console.log(`Notification opened with an action identifier: ${action.identifier} and response text: ${action.text}`);
         completion();
         });*/
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

            MyUtil.printConsole(true, 'log', 'LOG: isInternetAvailable: await: ', {
                'isConnected': state.isConnected,
                'state'      : state,
            });

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


    GetDeviceInfo: async (getType: any, showError: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: GetDeviceInfo:', {
            'getType'  : getType,
            'showError': showError,
        });

        let response: any = {
            'type' : MyConstant.RESPONSE.TYPE.error,
            'error': null,
            'data' : null,
        }

        try {
            const deviceInfo = new Promise((resolve, reject) => {
                switch (getType) {
                    case MyConstant.DeviceInfo.getAndroidId:
                        DeviceInfo.getAndroidId()
                                  .then(data => {
                                      resolve(data);
                                  })
                                  .catch(error => {
                                      reject(error);
                                  });
                        break;
                    case MyConstant.DeviceInfo.getApplicationName:
                        resolve(DeviceInfo.getApplicationName());
                        break;
                    case MyConstant.DeviceInfo.hasNotch:
                        resolve(DeviceInfo.hasNotch());
                        break;
                    default:
                        reject('Get Type Not Found!');
                        break;
                }
            });

            await deviceInfo
                .then(result => {
                    response = {
                        'type' : MyConstant.RESPONSE.TYPE.data,
                        'error': null,
                        'data' : result,
                    }
                })
                .catch(error => {
                    throw error;
                });

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: GetDeviceInfo: TRY-CATCH: ', {'error': error});

            MyUtil.showMessage(showError, MyLANG.DeviceInfoFailed, false);

            response = {
                'type' : MyConstant.RESPONSE.TYPE.error,
                'error': error,
                'data' : null,
            }

        } finally {
            MyUtil.printConsole(true, 'log', 'LOG: GetDeviceInfo: TRY-FINALY: ', {'response': response});

            return response;
        }

        /*const deviceInfo: any = await MyUtil.GetDeviceInfo(MyConstant.DeviceInfo.getApplicationName, MyConstant.SHOW_MESSAGE.TOAST);
        MyUtil.printConsole(true, 'log', 'LOG: GetDeviceInfo: await-response: ', {
            'type'      : MyConstant.DeviceInfo.getApplicationName,
            'deviceInfo': deviceInfo
        });
        if (deviceInfo) {}*/
    },

    androidPermissionCheck: async (Permission: any, showError: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: androidPermissionCheck:', {
            'Permission': Permission,
            'showError' : showError,
        });
        try {

            return await PermissionsAndroid.check(Permission);

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: androidPermissionCheck: TRY-CATCH: ', {'error': error});

            MyUtil.showMessage(showError, MyLANG.AndroidPermissionNotGranted, false);

            return error;
        }

        /*const permission: any = await MyUtil.androidPermissionCheck(MyConstant.PermissionsAndroid.ACCESS_FINE_LOCATION, MyConstant.SHOW_MESSAGE.TOAST);
        MyUtil.printConsole(true, 'log', 'LOG: androidPermissionCheck: await-response: ', {
            'PermissionsAndroid': MyConstant.PermissionsAndroid.ACCESS_FINE_LOCATION,
            'permission'        : permission
        });
        if (permission === true) {}*/
    },

    androidPermissionRequest: async (Permission: any, message: any, showError: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: requestAndroidPermission:', {
            'Permission': Permission,
            'message'   : message,
            'showError' : showError,
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

            MyUtil.showMessage(showError, MyLANG.AndroidPermissionDenied, false);

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


    GetCurrentPosition: async (options: any, showError: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: GetCurrentPosition:', {'options': options, 'showError': showError});

        let response: any = {
            'type' : MyConstant.RESPONSE.TYPE.error,
            'error': null,
            'data' : null,
        }

        try {
            const permission: any = await MyUtil.androidPermissionRequest(
                MyConstant.PermissionsAndroid.ACCESS_FINE_LOCATION,
                {
                    // @ts-ignore
                    title  : MyLANG.Permission.title,
                    // @ts-ignore
                    message: MyLANG.Permission.location
                },
                showError
            );
            MyUtil.printConsole(true, 'log', 'LOG: androidPermissionRequest: await-response: ', {
                'PermissionsAndroid': MyConstant.PermissionsAndroid.ACCESS_FINE_LOCATION,
                'permission'        : permission
            });

            if (permission === true) {
                const currentPosition = new Promise((resolve, reject) => {
                    Geolocation.getCurrentPosition(
                        (position: any) => {
                            console.log('test 1', position);
                            resolve(position);
                        },
                        (error: any) => {
                            console.log('test 2', error);
                            reject(error);
                        },
                        options
                    );
                });

                await currentPosition
                    .then(result => {
                        response = {
                            'type' : MyConstant.RESPONSE.TYPE.data,
                            'error': null,
                            'data' : result,
                        }
                    })
                    .catch(error => {
                        throw error;
                    });

            } else {

                MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT, MyLANG.GPSPermissionRequest, false);

                throw new Error('Location Permission Denied!');
            }

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: GeocodePosition: TRY-CATCH: ', {'options': options, 'error': error});

            MyUtil.showMessage(showError, MyLANG.GPSFailed, false);

            response = {
                'type' : MyConstant.RESPONSE.TYPE.error,
                'error': error,
                'data' : null,
            }

        } finally {
            MyUtil.printConsole(true, 'log', 'LOG: GeocodePosition: TRY-FINALY: ', {'response': response});

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

    GeocodePosition: async (latitude: any, longitude: any, showError: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: GeocodePosition:', {
            'latitude' : latitude,
            'longitude': longitude,
            'showError': showError,
        });

        try {
            // if (Geocoder.isInit() !== true) {
            Geocoder.init(MyConfig.google_map_api_key, {});
            // }
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

            MyUtil.showMessage(showError, MyLANG.GeocoderFailed, false);

            return error;
        }

        /*const position: any = await MyUtil.GeocodePosition(3.1466, 101.6958, MyConstant.SHOW_MESSAGE.TOAST);
        MyUtil.printConsole(true, 'log', 'LOG: GeocodePosition: await-response: ', {
            'position': position,
        });
        if (position && position.results && position.results[0] && position.results[0].address_components && position.results[0].address_components[0]) {}*/
    },

    GeocodeAddress: async (address: string, showError: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: GeocodeAddress:', {
            'address'  : address,
            'showError': showError,
        });

        try {
            // if (Geocoder.isInit() !== true) {
            Geocoder.init(MyConfig.google_map_api_key, {});
            // }
            const response = await Geocoder.from(address);

            return response;

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: GeocodeAddress: TRY-CATCH: ', {
                'address': address,
                'error'  : error
            });

            MyUtil.showMessage(showError, MyLANG.GeocoderFailed, false);

            return error;
        }

        /*const address: any = await MyUtil.GeocodeAddress('KLCC', MyConstant.SHOW_MESSAGE.TOAST);
        MyUtil.printConsole(true, 'log', 'LOG: GeocodeAddress: await-response: ', {
            'address': address,
        });
        if (address && address.results && address.results[0] && address.results[0].geometry && address.results[0].geometry.location && address.results[0].geometry.location.lat && address.results[0].geometry.location.lng) {}*/
    },


    myHTTP: async (loginReq: any, httpMethod: any, apiURL: string, body: any, headers: any, asForm: boolean = false, responseType: any = MyConstant.HTTP_JSON, timeout: number = 0, showLoader: any = false, retry: any = false, cancelPrevious: boolean = true) => {

        let response: any = {
            'type'        : MyConstant.RESPONSE.TYPE.error,
            'error'       : null,
            'errors'      : null,
            'errorMessage': null,
            'data'        : null,
        }

        try {

            MyUtil.printConsole(true, 'log', 'LOG: myHTTP: ', {
                'loginReq'         : loginReq,
                'httpMethod'       : httpMethod,
                'apiURL'           : apiURL,
                'body'             : body,
                'headers'          : headers,
                'responseType'     : responseType,
                'timeout'          : timeout,
                'showLoader'       : showLoader,
                'cancelPrevious'   : cancelPrevious,
                'CancelTokenSource': CancelTokenSource,
            });

            if (showLoader !== false) {
                MyUtil.showTinyToast(showLoader && showLoader.length > 0 ? showLoader : MyLANG.PleaseWait,
                                     false,
                                     MyStyle.TinyToast.CENTER,
                                     MyStyle.TinyToast.containerStyleDark,
                                     MyStyle.TinyToast.textStyleWhite,
                                     MyStyle.TinyToast.textColorWhite,
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
            if (loginReq === true) {
                /*authReq = await MyUtil.performTimeConsumingTask();
                if (authReq !== false) {
                    throw new Error('User Not Logged In.');
                }*/
            }


            const internet: any = await MyUtil.isInternetAvailable(MyConstant.SHOW_MESSAGE.SNACKBAR);
            if (internet !== true) {
                throw new Error('Internet Connection Not Available.');
            }

            // Prepare data for API call:
            let axiosData: any = null;

            if (asForm === true) {
                /*let formData = new FormData();
                 for (let field in body) {
                 if (files.hasOwnProperty(field)) {
                 formData.append(field + '[]', files[i]);
                 body[field] = null;
                 }
                 }
                 formData.append('data', JSON.stringify(body));
                 data = formData;
                 const uploadPercentage = null;
                 headers = {
                 'content-type': 'multipart/form-data',
                 }*/
                // console.log('onModalFormSubmit: ', JSON.parse(formData.getAll('data')),
                // JSON.parse(formData.getAll('dbInsert')), JSON.parse(formData.getAll('dbQuery')));
            } else {
                axiosData = body ? body : [];
                headers   = {
                    'content-type': MyConstant.HTTP_APPLICATION_JSON
                }
            }

            if (cancelPrevious === true && CancelTokenSource) {
                CancelTokenSource.cancel(MyLANG.OperationCanceledByUser); // cancel the request (the message parameter is
                                                                          // optional);
            }

            // creates a new different token for upcomming request (overwrite the previous one)
            CancelTokenSource = CancelToken.source();

            const axiosResponse = await axios(apiURL, {
                cancelToken : CancelTokenSource.token,
                method      : httpMethod,
                data        : axiosData,
                responseType: responseType,
                headers     : {
                    // 'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
                timeout     : timeout > 0 ? timeout : 0,
                /*onUploadProgress: (progressEvent) => {
                 const uploadPercentage = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                 console.log('percentCompleted: ', uploadPercentage, progressEvent);
                 if (uploadPercentage >= 100) {
                 uploadPercentage = 'Done';
                 }
                 }*/
            });

            response = {
                'type'        : MyConstant.RESPONSE.TYPE.data,
                'error'       : null,
                'errors'      : null,
                'errorMessage': null,
                'data'        : axiosResponse,
            }

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: myHTTP: TRY-CATCH: ', {'apiURL': apiURL, 'error': error});

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
                'data'        : null,
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
                                     MyStyle.TinyToast.containerStyleDark,
                                     MyStyle.TinyToast.textStyleWhite,
                                     MyStyle.TinyToast.textColorWhite,
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
            .myHTTP(true, MyConstant.HTTP_POST, MyAPI.LOGIN,
                {
                    "app_ver"            : MyConfig.app_version,
                    "app_build_ver"      : MyConfig.app_build_version,
                    "platform"           : MyConstant.APP_PLATFORM,
                    "device"             : null,
                    [MyConstant.PHONE]   : username,
                    [MyConstant.PASSWORD]: password,
                    "role"               : MyConfig.UserRole.customer,
                    "db_key"             : 'app_build_ver_android',
                }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Short, showLoader, true, false);

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL'  : MyAPI.LOGIN,
            'response': response,
        });

        // Login Fully Successful, go for login data process:
        if (response && response.type === MyConstant.RESPONSE.TYPE.data && response.data.status === 200 && response.data.data && response.data.data.data && response.data.data.data.id && response.data.data.data.id > 0) {

            MyAuth.processLogin(username, password, response.data.data.data, false, false);

        } else {
            MyUtil.showMessage(showError, response.errorMessage ? response.errorMessage : MyLANG.UnknownError, false);
        }*/
    },


    share: async (shareType: string, title: string, message: string, subject: string, urls: any, email: string, social: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: share:', {
            'shareType': shareType,
            'title'    : title,
            'message'  : message,
            'subject'  : subject,
            'urls'     : urls,
            'email'    : email,
            'social'   : social,
        });

        // If both message and url are provided, url will be concatenated to the end of message to form the body of the
        // message. If only one is provided it will be used.

        return new Promise(async (resolve, reject) => {
            const shareOptions = {
                title  : title,
                message: message,
                subject: subject,
                urls   : urls,
                email  : email,
                // social : social.name,
                // whatsAppNumber: "9199999999",  // country code + phone number(currently only works on Android)
                // filename      : 'test', // only for base64 file in Android
            };
            Share.open(shareOptions)
                 .then((res) => {
                     resolve(res);
                 })
                 .catch((err) => {
                     reject(err);
                 });
        })

        /*MyUtil.share(MyConstant.SHARE.TYPE.open, 'Test Share', 'Test Share', 'Test Share', ['https', 'http'], 'test@test.com', {name: MyConstant.SHARE.SOCIAL.WHATSAPP})
         .then(result => {

         MyUtil.printConsole(true, 'log', 'LOG: share: resolve-then: ', {
         'result': result,
         });

         })
         .catch(error => {
         MyUtil.printConsole(true, 'log', 'LOG: share: reject-catch: ', {
         'error': error,
         });
         });*/
    },

    imagePicker: async (options: any, openType: string, showError: any): Promise<any> => {

        MyUtil.printConsole(true, 'log', 'LOG: imagePicker:', {
            'options'  : options,
            'openType' : openType,
            'showError': showError
        });

        return new Promise(async (resolve, reject) => {
            switch (openType) {
                case MyConstant.IMAGE_PICKER.OPEN_TYPE.Camera:
                    await ImagePicker.launchCamera(options, (response) => {

                        if (response.didCancel) {

                            MyUtil.showMessage(showError, MyLANG.ImagePickerCanceled, false);

                            reject({'didCancel': response.didCancel});

                        } else if (response.error) {

                            MyUtil.showMessage(showError, MyLANG.ImagePickerError, false);

                            reject({'error': response.error});

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

                            MyUtil.showMessage(showError, MyLANG.ImagePickerCanceled, false);

                            reject({'didCancel': response.didCancel});

                        } else if (response.error) {

                            MyUtil.showMessage(showError, MyLANG.ImagePickerError, false);

                            reject({'error': response.error});

                        } else if (response.customButton) {
                            // console.log('User tapped custom button: ', response.customButton);

                        } else {

                            resolve(response);

                        }
                    });
                    break;

                case MyConstant.IMAGE_PICKER.OPEN_TYPE.ALL:
                default:
                    // @ts-ignore
                    await ImagePicker.showImagePicker(options, (response) => {

                        // MyUtil.printConsole(true, 'log', 'LOG: imagePicker:', {'response': response});

                        if (response.didCancel) {

                            MyUtil.showMessage(showError, MyLANG.ImagePickerCanceled, false);

                            reject({'didCancel': response.didCancel});

                        } else if (response.error) {

                            MyUtil.showMessage(showError, MyLANG.ImagePickerError, false);

                            reject({'error': response.error});

                        } else if (response.customButton) {
                            // console.log('User tapped custom button: ', response.customButton);

                        } else {

                            resolve(response);

                        }
                    });
                    break;
            }
        })

        /*MyUtil.imagePicker(MyConfig.DefatulImagePickerOptions, MyConstant.IMAGE_PICKER.OPEN_TYPE.Camera, MyConstant.SHOW_MESSAGE.TOAST)
            .then(result => {

                MyUtil.printConsole(true, 'log', 'LOG: imagePicker: resolve-then: ', {
                    'result': result,
                    'uri'   : result.uri,
                    'base64': 'data:image/jpeg;base64,' + result.data
                });

            })
            .catch(error => {
                MyUtil.printConsole(true, 'log', 'LOG: imagePicker: reject-catch: ', {
                    'error': error,
                });
            });*/
    },


    showMessage: (showError: any, message: any, retry: boolean = false) => {
        switch (showError) {
            case MyConstant.SHOW_MESSAGE.ALERT:
                MyUtil.showAlert(MyLANG.Error, message, true, [
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
                                     MyStyle.TinyToast.containerStyleDark,
                                     MyStyle.TinyToast.textStyleWhite,
                                     MyStyle.TinyToast.textColorWhite,
                                     null,
                                     MyStyle.TinyToast.imageStyleSucess,
                                     false,
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
        MyUtil.printConsole(true, 'log', 'LOG: showTinyToast: ', {
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
        });

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

    showActionSheet: async (sheetType: string, title: string, theme: string, items: any, alert: any): Promise<any> => {
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

        /*const facebook = <MyIcon.SimpleLineIcons name='people' color={'#333333'} size={16}/>;
         const instagram = <MyIcon.SimpleLineIcons name='people' color={'#333333'} size={16}/>;
         let items = [
         {title: 'Facebook', value: 'fb', subTitle: 'Facebook Description', icon: facebook},
         {title: 'Instagram', value: 'insta', subTitle: 'Instagram Description', icon: instagram},
         ];

         MyUtil.showActionSheet(MyConstant.ACTION_SHEET.TYPE.GRID, 'Awesome5!', MyConstant.ACTION_SHEET.THEME.light, items, {
         message: 'Show This',
         })
         .then(result => {

         MyUtil.printConsole(true, 'log', 'LOG: showActionSheet: resolve-then: ', {
         'result': result,
         });

         })
         .catch(error => {
         MyUtil.printConsole(true, 'log', 'LOG: showActionSheet: reject-catch: ', {
         'error': error,
         });
         })*/
    },


    AsyncStorageSet: async (key: string, data: any, showError: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageSet:', {
            'key'      : key,
            'data'     : data,
            'showError': showError,
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

            MyUtil.showMessage(showError, MyLANG.StorageStoreFailed, false);

            return error;
        }

        /*const storage: any = await MyUtil.AsyncStorageSet('key', 'data', MyConstant.SHOW_MESSAGE.TOAST);
        MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageSet: await-response: ', {'key': '', 'storage': storage});
        if (storage === true) {}*/
    },

    AsyncStorageGet: async (key: string, showError: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageGet:', {'key': key, 'showError': showError});

        try {
            return await AsyncStorage.getItem(key);

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageGet: TRY-CATCH: ', {'key': key, 'error': error});

            MyUtil.showMessage(showError, MyLANG.StorageRetriveFailed, false);

            return error;
        }

        /*const storage: any = await MyUtil.AsyncStorageGet('key', MyConstant.SHOW_MESSAGE.TOAST);
        MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageGet: await-response: ', {
            'key'    : MyConfig.AsyncStorage.APP_FRESH_INSTALL,
            'storage': storage // JSON.parse()
        });
        if (storage && storage['key']) {}*/
    },

    AsyncStorageRemove: async (key: string, showError: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageRemove:', {
            'key'      : key,
            'showError': showError,
        });

        try {
            await AsyncStorage.removeItem(key);

            return true;

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageRemove: TRY-CATCH: ', {'key': key, 'error': error});

            MyUtil.showMessage(showError, MyLANG.StorageRemoveFailed, false);

            return error;
        }

        /*const storage: any = await MyUtil.AsyncStorageRemove(MyConfig.AsyncStorage.AUTH_TOEKN, MyConstant.SHOW_MESSAGE.TOAST);
        MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageRemove: await-response: ', {
            'key'    : MyConfig.AsyncStorage.AUTH_TOEKN,
            'storage': storage
        });
         if (storage === true) {}*/
    },

    AsyncStorageClear: async (showError: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageClear:', {
            'showError': showError,
        });

        try {
            await AsyncStorage.clear();

            return true;

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageClear: TRY-CATCH: ', {'error': error});

            MyUtil.showMessage(showError, MyLANG.StorageClearFailed, false);

            return error;
        }

        /*const storage: any = await MyUtil.AsyncStorageClear(MyConstant.SHOW_MESSAGE.TOAST);
        MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageClear: await-response: ', {'storage': storage});
        if (storage === true) {}*/
    },


    keychainSet: async (username: string, password: string, service: string, showError: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: KeychainSet:', {
            'username' : username,
            'password' : password,
            'service'  : service,
            'showError': showError,
        });
        try {
            return await Keychain.setGenericPassword(username, password);

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: keychainSet: TRY-CATCH: ', {
                'username': username,
                'password': password,
                'error'   : error
            });

            MyUtil.showMessage(showError, MyLANG.KeyChainStoreFailed, false);

            return error;
        }

        /*const keychain: any = await MyUtil.keychainSet(username, password, MyConfig.android_package_name, MyConstant.SHOW_MESSAGE.TOAST);
        MyUtil.printConsole(true, 'log', 'LOG: keychainSet: await-response: ', {
            'android_package_name': MyConfig.android_package_name,
            'keychain'        : keychain
        });
        if (keychain === true) {}*/
    },

    keychainGet: async (showError: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: keychainGet:', {'showError': showError});

        try {
            return await Keychain.getGenericPassword();

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: keychainGet: TRY-CATCH: ', {'error': error});

            MyUtil.showMessage(showError, MyLANG.KeyChainRetriveFailed, false);

            return error;
        }

        // const keychain: any = await MyUtil.keychainGet(MyConstant.SHOW_MESSAGE.TOAST);
        // MyUtil.printConsole(true, 'log', 'LOG: keychainGet: await-response: ', {'keychain': keychain});
        // if (keychain && keychain[MyConstant.USERNAME] && keychain[MyConstant.PASSWORD]){}
    },

    keychainReset: async (showError: any) => {

        MyUtil.printConsole(true, 'log', 'LOG: keychainReset:', {'showError': showError});

        try {

            return await Keychain.resetGenericPassword();

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: keychainReset: TRY-CATCH: ', {'error': error});

            MyUtil.showMessage(showError, MyLANG.KeyChainResetFailed, false);

            return error;
        }

        /*const keychain: any = await MyUtil.keychainReset(MyConstant.SHOW_MESSAGE.TOAST);
        MyUtil.printConsole(true, 'log', 'LOG: keychainReset: await-response: ', {'keychain': keychain});
        if (keychain === true) {}*/
    },


    momentFormat: (date: any, format: string, parse: any = null) => {
        MyUtil.printConsole(true, 'log', 'LOG: momentFormat: ', {
            'date'  : date,
            'format': format,
            'parse' : parse,
            'Moment': Moment(date, parse).format(format)
        });
        return Moment(date, parse).format(format);

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
