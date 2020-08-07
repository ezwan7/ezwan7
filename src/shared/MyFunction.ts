import MyLANG from "./MyLANG";
import {MyAPI, MyConfig} from "../shared/MyConfig";
import MyAuth from "../common/MyAuth";
import {MyConstant} from "../common/MyConstant";
import MyUtil from "../common/MyUtil";

import {store} from "../store/MyStore";
import {appInfoUpdate} from "../store/AppInfoRedux";
import {appInputUpdate} from "../store/AppInputRedux";
import {userLocationUpdate} from "../store/UserLocation";
import {updateUser} from "../store/AuthRedux";
import {switchAppNavigator} from "../store/AppRedux";
import {addressSave} from "../store/AddressRedux";
import {notificationSave} from "../store/NotificationRedux";
import {cartUpdateTax} from "../store/CartRedux";
import messaging from "@react-native-firebase/messaging";


const MyFunction = {

    updateBiometryType: async (storeInRedux: boolean = true, showLoader: any = false, showInfoMessage: any = false, showErrorMessage: any = false) => {

        const biometryType: any = await MyUtil.keychainGetBiometryType(showErrorMessage);
        MyUtil.printConsole(true, 'log', 'LOG: keychainGetBiometryType: await-response: ', {'biometryType': biometryType});

        if (storeInRedux === true) {
            store.dispatch(appInfoUpdate(biometryType, 'biometryType'));
        }
    },

    updateDeviceInfo: async (type: string = 'ALL', storeInRedux: boolean = true, updateBackend: boolean = true, askPermission: boolean = true, showLoader: any = false, showErrorMessage: any = false) => {

        // const device: any = await MyUtil.GetDeviceInfo(MyConstant.DeviceInfo.getDeviceToken);

        const deviceInfo: any = {
            systemName     : await MyUtil.GetDeviceInfo(MyConstant.DeviceInfo.getSystemName),
            systemVersion  : await MyUtil.GetDeviceInfo(MyConstant.DeviceInfo.getSystemVersion),
            apiLevel       : await MyUtil.GetDeviceInfo(MyConstant.DeviceInfo.getApiLevel),
            model          : await MyUtil.GetDeviceInfo(MyConstant.DeviceInfo.getModel),
            manufacturer   : await MyUtil.GetDeviceInfo(MyConstant.DeviceInfo.getManufacturer),
            deviceId       : await messaging().getToken(),
            uniqueId       : await MyUtil.GetDeviceInfo(MyConstant.DeviceInfo.getUniqueId),
            applicationName: await MyUtil.GetDeviceInfo(MyConstant.DeviceInfo.getApplicationName),
            buildNumber    : await MyUtil.GetDeviceInfo(MyConstant.DeviceInfo.getBuildNumber),
            bundleId       : await MyUtil.GetDeviceInfo(MyConstant.DeviceInfo.getBundleId),
            totalMemory    : await MyUtil.GetDeviceInfo(MyConstant.DeviceInfo.getTotalMemory),
            userAgent      : await MyUtil.GetDeviceInfo(MyConstant.DeviceInfo.getUserAgent),
        }
        MyUtil.printConsole(true, 'log', 'LOG: GetDeviceInfo: await-response: ', {'deviceInfo': deviceInfo});

        if (storeInRedux === true) {
            store.dispatch(appInfoUpdate(deviceInfo, 'deviceInfo'));
        }

        if (updateBackend) {

            const user          = store.getState().auth.user;
            const user_location = store.getState().user_location;

            const response: any = await MyUtil
                .myHTTP(true, MyConstant.HTTP_POST, MyAPI.register_device,
                        {
                            'language_id' : MyConfig.LanguageActive,
                            'device_type' : deviceInfo.systemName,
                            'ram'         : deviceInfo.totalMemory,
                            'processor'   : null,
                            'device_os'   : deviceInfo.systemName,
                            'device_model': deviceInfo.model,
                            'manufacturer': deviceInfo.manufacturer,

                            'customers_id': user?.id,
                            'device_id'   : deviceInfo.deviceId,
                            'location'    : user_location?.formatted_address,

                            'app_ver'      : MyConfig.app_version,
                            'app_build_ver': MyConfig.app_build_version,
                            'platform'     : MyConfig.app_platform,
                            'device'       : null,
                        }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
                );

            MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
                'apiURL': MyAPI.register_device, 'response': response
            });

            if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data?.data?.success === '1') {

                // MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, response.data?.data?.message || MyLANG.Success, false);

            } else {

                if (showErrorMessage !== false) {
                    MyUtil.showMessage(showErrorMessage.showMessage, showErrorMessage.message, false);
                }
            }
        }
    },

    getUserLocation: async (type: string, options: any, askPermission: boolean = true, showLoader: any = false, showMessage: any) => {

        const position: any = await MyUtil.GetCurrentPosition(options, askPermission, showLoader, showMessage);
        MyUtil.printConsole(true, 'log', 'LOG: GetCurrentPosition: await-response: ', {
            'position': position,
        });
        if (position?.type === MyConstant.RESPONSE.TYPE.data && position.data?.coords?.latitude && position.data?.coords?.longitude) {

            const accuracy  = position.data?.coords?.accuracy;
            const latitude  = position.data?.coords?.latitude;
            const longitude = position.data?.coords?.longitude;

            const geocodePosition: any = await MyUtil.GeocodePosition(latitude, longitude, showMessage);
            MyUtil.printConsole(true, 'log', 'LOG: GeocodePosition: await-response: ', {
                'geocodePosition': geocodePosition,
            });
            if (geocodePosition?.results?.[0]?.address_components?.[0]) {

                const user_location: any = MyUtil.generateLocation(geocodePosition, accuracy, latitude, longitude);

                switch (type) {
                    case  MyConstant.GeolocationFetchType.store:
                        store.dispatch(userLocationUpdate(user_location, 'all'));
                        break;
                    case  MyConstant.GeolocationFetchType.return:
                        return user_location;
                    default:
                        return user_location;
                }
            }
        }

        return false;

        /*const location: any = await MyFunction.getUserLocation(MyConstant.GeolocationFetchType.return,
                                                               MyConfig.geoLocationOption,
                                                               true,
                                                               MyLANG.PleaseWait + '...',
                                                               MyConstant.SHOW_MESSAGE.ALERT
        );*/
    },

    loginFacebook: async () => {
        const facebookLogin: any = await MyAuth.loginFacebook(MyConstant.SHOW_MESSAGE.TOAST);
        MyUtil.printConsole(true, 'log', 'LOG: facebookLogin: await-response: ', {
            'facebookLogin': facebookLogin
        });
        if (facebookLogin?.type === MyConstant.RESPONSE.TYPE.data && facebookLogin?.data) {
            MyAuth.login({
                             mode       : MyConstant.LOGIN_MODE.FACEBOOK,
                             facebook_id: facebookLogin?.data?.id,
                             email      : facebookLogin?.data?.email,
                             name       : facebookLogin?.data?.name,
                             first_name : facebookLogin?.data?.first_name,
                             last_name  : facebookLogin?.data?.last_name,
                             photo      : facebookLogin?.data?.picture?.data?.url,
                         },
                         MyConstant.SHOW_MESSAGE.TOAST,
                         MyConstant.SHOW_MESSAGE.ALERT,
                         MyLANG.Login + '...',
                         false,
                         null,
                         MyConstant.NAVIGATION_ACTIONS.POP_TO_ROOT
            );
        }
    },

    loginGoogle: async () => {
        const googleSignin: any = await MyAuth.loginGoogle(MyConstant.SHOW_MESSAGE.TOAST);
        MyUtil.printConsole(true, 'log', 'LOG: googleSignin: await-response: ', {
            'googleSignin': googleSignin
        });
        if (googleSignin?.user) {
            MyAuth.login({
                             mode      : MyConstant.LOGIN_MODE.GOOGLE,
                             google_id : googleSignin?.user?.id,
                             email     : googleSignin?.user?.email,
                             name      : googleSignin?.user?.name,
                             first_name: googleSignin?.user?.givenName,
                             last_name : googleSignin?.user?.familyName,
                             photo     : googleSignin?.user?.photo,
                         },
                         MyConstant.SHOW_MESSAGE.TOAST,
                         MyConstant.SHOW_MESSAGE.ALERT,
                         MyLANG.Login + '...',
                         false,
                         null,
                         MyConstant.NAVIGATION_ACTIONS.POP_TO_ROOT
            );
        }
    },

    loginApple: async () => {
        const appleSignin: any = await MyAuth.loginApple(MyConstant.SHOW_MESSAGE.TOAST);
        MyUtil.printConsole(true, 'log', 'LOG: appleSignin: await-response: ', {
            'appleSignin': appleSignin
        });
        if (appleSignin?.user) {
            MyAuth.login({
                             mode      : MyConstant.LOGIN_MODE.APPLE,
                             google_id : appleSignin?.user,
                             email     : appleSignin?.email,
                             name      : appleSignin?.fullName?.givenName,
                             first_name: appleSignin?.fullName?.givenName,
                             last_name : appleSignin?.fullName?.familyName,
                             // photo     : appleSignin?.user?.photo,
                         },
                         MyConstant.SHOW_MESSAGE.TOAST,
                         MyConstant.SHOW_MESSAGE.ALERT,
                         MyLANG.Login + '...',
                         false,
                         null,
                         MyConstant.NAVIGATION_ACTIONS.POP_TO_ROOT
            );
        }
    },

    appUpdateCheck: async (promptAlert: boolean = true, showLoader: any = false, showInfoMessage: any = false, showErrorMessage: any = false) => {
        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.app_update_check,
                    {
                        'language_id': MyConfig.LanguageActive,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.app_update_check, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data?.data?.success) {

            const data = response.data.data.success;

            if (data === '0' && promptAlert === true) {
                MyUtil.showAlert(MyLANG.Attention, MyLANG.UpdateAlert, false, [
                    {
                        text   : MyLANG.Later,
                        style  : 'cancel',
                        onPress: () => {
                            MyUtil.printConsole(true, 'log', 'LOG: showAlert: ', 'Cancel');
                        },
                    },
                    {
                        text   : MyLANG.UpdateNow,
                        onPress: () => {
                            MyUtil.printConsole(true, 'log', 'LOG: showAlert: ', 'OK');

                            MyUtil.linking(MyConstant.Linking.openURL, MyConfig.android_store_link, MyConstant.SHOW_MESSAGE.TOAST);

                        }
                    },
                ])

            } else if (showInfoMessage !== false) {

                MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message || response.data?.data?.message, false);
            }

        } else {
            if (showInfoMessage !== false) {
                MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, response.errorMessage ? response.errorMessage : showInfoMessage.message, false);
            }
        }
    },

    fetchAppData: async (showLoader: any = MyLANG.PleaseWait + '...', showInfoMessage: any = false, showErrorMessage: any = false) => {
        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.app_info,
                    {
                        'language_id': MyConfig.LanguageActive,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.app_info, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data?.data?.pages_data?.[0]) {

            const data     = response.data.data.pages_data;
            const app_info = {
                about_us      : data.find((e: any) => e.slug === 'about-us')?.description,
                contact_us    : data.find((e: any) => e.slug === 'contact-us')?.description,
                privacy_policy: data.find((e: any) => e.slug === 'privacy-policy')?.description,
                term_services : data.find((e: any) => e.slug === 'term-services')?.description,
                refund_policy : data.find((e: any) => e.slug === 'refund-policy')?.description,
                payment_terms : data.find((e: any) => e.slug === 'paymentmethods')?.description,
            }

            store.dispatch(appInfoUpdate(app_info?.about_us, 'about_us'));
            store.dispatch(appInfoUpdate(app_info?.contact_us, 'contact_us'));
            store.dispatch(appInfoUpdate(app_info?.privacy_policy, 'privacy_policy'));
            store.dispatch(appInfoUpdate(app_info?.term_services, 'term_services'));
            store.dispatch(appInfoUpdate(app_info?.refund_policy, 'refund_policy'));
            store.dispatch(appInfoUpdate(app_info?.payment_terms, 'payment_terms'));

        } else {
            if (showInfoMessage !== false) {
                MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message || response.data?.data?.message, false);
            }
        }
    },

    fetchCountries: async (showLoader: any = MyLANG.PleaseWait + '...', showInfoMessage: any = false, showErrorMessage: any = false) => {
        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.countries,
                    {
                        'language_id': MyConfig.LanguageActive,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.countries, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200) {

            const data = response.data?.data?.data;
            if (data.length > 0) {

                store.dispatch(appInputUpdate(data, 'countries'));

            } else {

                if (showInfoMessage !== false) {
                    MyUtil.showMessage(showInfoMessage.showMessage, MyLANG.GetDataError, false);
                }
            }

        } else {

            if (showErrorMessage !== false) {
                MyUtil.showMessage(showErrorMessage.showMessage, showErrorMessage.message, false);
            }
        }
    },

    fetchStates: async (country_id: number, showLoader: any = MyLANG.PleaseWait + '...', showInfoMessage: any = false, showErrorMessage: any = false) => {
        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.states,
                    {
                        'language_id'    : MyConfig.LanguageActive,
                        'zone_country_id': country_id,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.states, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data?.data?.data?.length > 0) {

            return response.data.data.data;

        } else {

            if (showErrorMessage !== false) {
                MyUtil.showMessage(showErrorMessage.showMessage, showErrorMessage.message, false);
            }
        }

        return false;
    },

    fetchCities: async (state_id: number, showLoader: any = MyLANG.PleaseWait + '...', showInfoMessage: any = false, showErrorMessage: any = false) => {
        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.cities,
                    {
                        'language_id': MyConfig.LanguageActive,
                        'zone_id'    : state_id,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.cities, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data?.data?.data?.length > 0) {

            return response.data.data.data;

        } else {

            if (showErrorMessage !== false) {
                MyUtil.showMessage(showErrorMessage.showMessage, showErrorMessage.message, false);
            }
        }

        return false;
    },

    fetchPickUpAddress: async (showLoader: any = MyLANG.PleaseWait + '...', showInfoMessage: any = false, showErrorMessage: any = false) => {
        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.pickup_address,
                    {
                        'language_id': MyConfig.LanguageActive,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.pickup_address, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data?.data?.success === '1' && response.data.data.data) {

            const data = response.data.data.data;

            const dataReduced = data.reduce((accumulator: any, item: any) => {
                accumulator.push(
                    {
                        ...item,
                        addressText: `${item.points_address}\n${item.points_city}\n${item.points_state}\n${item.country_name}\n${item.points_zip}`,
                        footerText : `${MyLANG.OpeningHours}: ${item.points_opening_hours}\n${MyLANG.PickupFee}: ${MyConfig.Currency.MYR.symbol} ${item.points_pickup_fee}`,
                    }
                );
                return accumulator;

            }, []);

            store.dispatch(appInputUpdate(dataReduced, 'pickup_address'));

            if (showInfoMessage !== false) {
                MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message || response.data?.data?.message, false);
            }

        } else {

            if (showErrorMessage !== false) {
                MyUtil.showMessage(showErrorMessage.showMessage, showErrorMessage.message, false);
            }
        }
    },

    fetchTax: async (showLoader: any = MyLANG.PleaseWait + '...', showInfoMessage: any = false, showErrorMessage: any = false) => {
        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.tax_rate,
                    {
                        'language_id': MyConfig.LanguageActive,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.tax_rate, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data.data?.success === '1' && response.data.data.data?.rates?.[0]) {

            const data = response.data.data.data?.rates?.[0];

            store.dispatch(appInputUpdate(data, 'tax_rate'));

            if (Number.isFinite(Number(data?.tax_rate))) {
                store.dispatch(cartUpdateTax(Number(data?.tax_rate)));
            }

            if (showInfoMessage !== false) {
                MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message || response.data?.data?.message, false);
            }

        } else {

            if (showErrorMessage !== false) {
                MyUtil.showMessage(showErrorMessage.showMessage, showErrorMessage.message, false);
            }
        }
    },

    fetchPaymentMethod: async (formParam: any, showLoader: any = MyLANG.PleaseWait + '...', showInfoMessage: any = false, showErrorMessage: any = false) => {
        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.payment_methods,
                    {
                        'language_id': MyConfig.LanguageActive,

                        ...formParam,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.payment_methods, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data?.data) {

            const data = response.data?.data;

            store.dispatch(appInputUpdate(data, 'payment_method'));

            if (showInfoMessage !== false) {
                MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message || response.data?.data?.message, false);
            }

        } else {

            if (showErrorMessage !== false) {
                MyUtil.showMessage(showErrorMessage.showMessage, showErrorMessage.message, false);
            }
        }
    },

    fetchDeliveryType: async (showLoader: any = MyLANG.PleaseWait + '...', showInfoMessage: any = false, showErrorMessage: any = false) => {
        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.delivery_type,
                    {
                        'language_id': MyConfig.LanguageActive,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.delivery_type, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data.data) {

            const data = response.data.data;

            store.dispatch(appInputUpdate(data, 'delivery_type'));

            if (showInfoMessage !== false) {
                MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message || response.data?.data?.message, false);
            }

        } else {

            if (showErrorMessage !== false) {
                MyUtil.showMessage(showErrorMessage.showMessage, showErrorMessage.message, false);
            }
        }

        return false;
    },

    fetchDeliveryMethod: async (formParam: any, showLoader: any = MyLANG.PleaseWait + '...', showInfoMessage: any = false, showErrorMessage: any = false) => {
        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.delivery_method,
                    {
                        'language_id': MyConfig.LanguageActive,

                        ...formParam,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.delivery_method, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data.data?.success === '1') {

            if (formParam?.delivery_type === MyConfig.DeliveryType.Courier.id) {
                const data = response.data?.data?.data;
                if (data.length > 0) {
                    const dataReduced = data.reduce((accumulator: any, item: any) => {
                        accumulator.push(
                            {
                                ...item,
                                priceText  : Number(item.price) > 0 ? `${MyLANG.DeliveryCost} ${MyConfig.Currency.MYR.symbol} ${item.price}` : null,
                                description: item.description || null,
                            }
                        );
                        return accumulator;

                    }, []);

                    return dataReduced;
                }

            } else {
                const data        = response.data.data.data?.[0]?.data;
                const dataReduced = data.reduce((accumulator: any, item: any) => {
                    accumulator.push(
                        {
                            ...item,
                            addressText: `${item.points_address}\n${item.points_city}\n${item.points_state}\n${item.country_name}\n${item.points_zip}`,
                            footerText : `${MyLANG.OpeningHours}: ${item.points_opening_hours}\n${MyLANG.PickupFee}: ${MyConfig.Currency.MYR.symbol} ${item.points_pickup_fee}`,
                        }
                    );
                    return accumulator;

                }, []);

                store.dispatch(appInputUpdate(dataReduced, 'pickup_address'));

                return true;
            }

        } else {

            if (showErrorMessage !== false) {
                MyUtil.showMessage(showErrorMessage.showMessage, showErrorMessage.message, false);
            }
        }

        return false;
    },

    fetchInstallmentAmount: async (formParam: any, showLoader: any = MyLANG.PleaseWait + '...', showInfoMessage: any = false, showErrorMessage: any = false) => {
        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.installment_amount,
                    {
                        'language_id': MyConfig.LanguageActive,

                        ...formParam,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.installment_amount, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data.data?.success === '1' && response.data.data.data) {

            return response.data.data;

        } else {

            if (showErrorMessage !== false) {
                MyUtil.showMessage(showErrorMessage.showMessage, showErrorMessage.message, false);
            }
        }

        return false;
    },

    InstallmentData: async (showLoader: any = MyLANG.PleaseWait + '...', showInfoMessage: any = false, showErrorMessage: any = false) => {
        const response_membership_type: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.installment_membership_type,
                    {
                        'language_id': MyConfig.LanguageActive,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.installment_membership_type, 'response': response_membership_type
        });
        if (response_membership_type?.type === MyConstant.RESPONSE.TYPE.data && response_membership_type.data?.status === 200 && response_membership_type.data.data) {
            const data = response_membership_type.data.data;
            store.dispatch(appInputUpdate(data, 'installment_membership_type'));
            if (showInfoMessage !== false) {
                MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message || response_membership_type.data?.data?.message, false);
            }
        } else {
            if (showErrorMessage !== false) {
                MyUtil.showMessage(showErrorMessage.showMessage, showErrorMessage.message, false);
            }
        }

        const response_installment_period: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.installment_period,
                    {
                        'language_id': MyConfig.LanguageActive,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.installment_period, 'response': response_installment_period
        });
        if (response_installment_period?.type === MyConstant.RESPONSE.TYPE.data && response_installment_period.data?.status === 200 && response_installment_period.data.data) {
            const data = response_installment_period.data.data;
            store.dispatch(appInputUpdate(data, 'installment_period'));
            if (showInfoMessage !== false) {
                MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message || response_installment_period.data?.data?.message, false);
            }
        } else {
            if (showErrorMessage !== false) {
                MyUtil.showMessage(showErrorMessage.showMessage, showErrorMessage.message, false);
            }
        }

        const response_installment_plans: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.installment_plans,
                    {
                        'language_id': MyConfig.LanguageActive,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.installment_plans, 'response': response_installment_plans
        });
        if (response_installment_plans?.type === MyConstant.RESPONSE.TYPE.data && response_installment_plans.data?.status === 200 && response_installment_plans.data.data) {
            const data = response_installment_plans.data.data;
            store.dispatch(appInputUpdate(data, 'installment_plans'));
            if (showInfoMessage !== false) {
                MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message || response_installment_plans.data?.data?.message, false);
            }
        } else {
            if (showErrorMessage !== false) {
                MyUtil.showMessage(showErrorMessage.showMessage, showErrorMessage.message, false);
            }
        }
    },

    fetchFilterMethod: async (showLoader: any = MyLANG.PleaseWait + '...', showInfoMessage: any = false, showErrorMessage: any = false) => {
        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.filter,
                    {
                        'language_id': MyConfig.LanguageActive,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.filter, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data?.data?.success === '1' && response.data?.data?.filters) {

            const data = response.data?.data?.filters;

            store.dispatch(appInputUpdate(data, 'filter_method'));

            if (showInfoMessage !== false) {
                MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message || response.data?.data?.message, false);
            }

        } else {

            if (showErrorMessage !== false) {
                MyUtil.showMessage(showErrorMessage.showMessage, showErrorMessage.message, false);
            }
        }
    },

    placeOrder: async (formParam: any, showLoader: any = MyLANG.PleaseWait + '...', showInfoMessage: any = false, showErrorMessage: any = false) => {
        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.order_place,
                    {
                        'language_id': MyConfig.LanguageActive,

                        ...formParam,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.ExtraHigh, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.order_place, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data.data?.success === '1' && response.data.data.data?.orders_data?.[0].orders_id) {

            const data = response.data.data.data.orders_data[0];

            return data;

        } else {

            if (showErrorMessage !== false) {
                MyUtil.showMessage(showErrorMessage.showMessage, showErrorMessage.message, false);
            }
        }

        return false;
    },

    fetchNotification: async (user_id: number, showLoader: any = MyLANG.PleaseWait + '...', showInfoMessage: any = false, showErrorMessage: any = false) => {
        const response: any = await MyUtil
            .myHTTP(true, MyConstant.HTTP_POST, MyAPI.notifications,
                    {
                        'language_id': MyConfig.LanguageActive,

                        'customers_id': user_id,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.notifications, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data?.data?.success === '1') {

            const data = response.data?.data?.data;
            store.dispatch(notificationSave(data, MyConstant.DataSetType.fresh));

        } else {

            if (showErrorMessage !== false) {
                MyUtil.showMessage(showErrorMessage.showMessage, showErrorMessage.message, false);
            }
        }
    },

    productLikeUnlike: async (isLiked: string, product_id: number, user_id: number, showLoader: any = false, showErrorMessage: any = false) => {

        MyUtil.printConsole(true, 'log', 'LOG: productLikeUnlike: ', {
            'isLiked'         : isLiked,
            'product_id'      : product_id,
            'user_id'         : user_id,
            'showLoader'      : showLoader,
            'showErrorMessage': showErrorMessage,
        });

        const apiUrl = isLiked === '1' ? MyAPI.product_unlike : MyAPI.product_like;

        const response: any = await MyUtil
            .myHTTP({required: true, promptLogin: true}, MyConstant.HTTP_POST, apiUrl,
                    {
                        'language_id'       : MyConfig.LanguageActive,
                        'liked_products_id' : product_id,
                        'liked_customers_id': user_id,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, false, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': apiUrl, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200) {

            const data = response.data?.data?.success;
            if (data === '1') {

                return isLiked === '1' ? '0' : '1';

            } else {

                if (showErrorMessage !== false) {
                    MyUtil.showMessage(showErrorMessage.showMessage, showErrorMessage.message ? showErrorMessage.message : MyLANG.Error, false);
                }
            }
        } else {

            if (showErrorMessage !== false) {
                MyUtil.showMessage(showErrorMessage.showMessage, showErrorMessage.message ? showErrorMessage.message : MyLANG.Error, false);
            }
        }

        return false;
    },

    cancelOrder: async (formParam: any, showLoader: any = MyLANG.PleaseWait + '...',
                        showInfoMessage: any            = {
                            showMessage: MyConstant.SHOW_MESSAGE.TOAST,
                            message    : MyLANG.OrderCancelledSuccessfully,
                        },
                        showErrorMessage: any           = false) => {

        MyUtil.printConsole(true, 'log', 'LOG: productLikeUnlike: ', {
            'formParam'       : formParam,
            'showLoader'      : showLoader,
            'showInfoMessage' : showInfoMessage,
            'showErrorMessage': showErrorMessage,
        });

        const response: any = await MyUtil
            .myHTTP({required: true, promptLogin: true}, MyConstant.HTTP_POST, MyAPI.order_cancel,
                    {
                        'language_id': MyConfig.LanguageActive,

                        'user_id'         : formParam.user_id,
                        'orders_id'       : formParam.orders_id,
                        'orders_status_id': formParam.orders_status_id,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, false, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.order_cancel, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data?.data?.success === '1') {

            if (showInfoMessage !== false) {
                MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message || response.data?.data?.message, false);
            }

            const data = response.data.data.data?.[0];
            return true;

        } else {

            if (showErrorMessage !== false) {
                MyUtil.showMessage(showErrorMessage.showMessage, showErrorMessage.message ? showErrorMessage.message : MyLANG.Error, false);
            }
        }

        return false;
    },

    fetchAddress: async (user_id: number, phone: any, showLoader: any = false, showInfoMessage: any = false, showErrorMessage: any = false) => {
        const response: any = await MyUtil
            .myHTTP(true, MyConstant.HTTP_POST, MyAPI.user_addresses,
                    {
                        'language_id' : MyConfig.LanguageActive,
                        'customers_id': user_id,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.user_addresses, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data?.data?.data) {

            const data = response.data.data.data;
            if (data.length > 0) {

                // REMOVE:
                const dataReduced = data.reduce((accumulator: any, item: any) => {
                    const addressText = MyUtil.generateAddress(null,
                                                               item?.street,
                                                               item?.city_name,
                                                               item?.zone_name,
                                                               item?.country_name,
                                                               item?.postcode
                    );
                    accumulator.push(
                        {
                            ...item,
                            addressText: `${item.firstname} ${item.lastname}\n${phone}\n${addressText}`,
                        }
                    );
                    return accumulator;

                }, []);

                store.dispatch(addressSave(dataReduced, MyConstant.DataSetType.fresh));
            }

            if (showInfoMessage !== false) {
                MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message || response.data?.data?.message, false);
            }

        } else {

            if (showErrorMessage !== false) {
                MyUtil.showMessage(showErrorMessage.showMessage, showErrorMessage.message, false);
            }
        }
    },

    saveAddress: async (formParam: any, showLoader: any = false, showInfoMessage: any = false, showErrorMessage: any = false, navigationActions: any = false) => {

        MyUtil.printConsole(true, 'log', 'LOG: saveAddress: ', {
            'formParam'        : formParam,
            'showLoader'       : showLoader,
            'showInfoMessage'  : showInfoMessage,
            'showErrorMessage' : showErrorMessage,
            'navigationActions': navigationActions,
        });

        const response: any = await MyUtil
            .myHTTP({required: true, promptLogin: true}, MyConstant.HTTP_POST, formParam?.apiUrl,
                    {
                        'language_id': MyConfig.LanguageActive,

                        'customers_id'        : formParam?.user_id,
                        'entry_firstname'     : formParam?.full_name?.split(" ")?.[0] || '',
                        'entry_lastname'      : formParam?.full_name?.split(" ")?.[1] || '',
                        'entry_street_address': formParam?.street_address,
                        'entry_suburb'        : formParam?.city,
                        'entry_postcode'      : formParam?.postal_code,
                        'entry_city_id'       : formParam?.city,
                        'entry_zone_id'       : formParam?.state,
                        'entry_country_id'    : formParam?.country,
                        'entry_company'       : formParam?.address_title,
                        'is_default'          : formParam?.is_default === true ? 1 : 0,
                        'entry_latitude'      : formParam?.latitude,
                        'entry_longitude'     : formParam?.longitude,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': formParam?.apiUrl, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data?.data?.success === '1') {

            if (showInfoMessage !== false) {
                MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message || response.data?.data?.message, false);
            }

            if (navigationActions !== false) {
                MyFunction.handleNavigationActions(navigationActions);
            }

        } else {

            if (showErrorMessage !== false) {
                MyUtil.showMessage(showErrorMessage.showMessage, showErrorMessage.message ? showErrorMessage.message : MyLANG.Error, false);
            }
        }
    },

    updateAddress: async (formParam: any, showLoader: any = false, showInfoMessage: any = false, showErrorMessage: any = false, navigationActions: any = false) => {

        MyUtil.printConsole(true, 'log', 'LOG: updateAddress: ', {
            'formParam'        : formParam,
            'showLoader'       : showLoader,
            'showInfoMessage'  : showInfoMessage,
            'showErrorMessage' : showErrorMessage,
            'navigationActions': navigationActions,
        });

        const response: any = await MyUtil
            .myHTTP({required: true, promptLogin: true}, MyConstant.HTTP_POST, formParam?.apiUrl,
                    {
                        'language_id': MyConfig.LanguageActive,

                        'address_id'          : formParam?.id,
                        'customers_id'        : formParam?.user_id,
                        'entry_firstname'     : formParam?.full_name?.split(" ")?.[0],
                        'entry_lastname'      : formParam?.full_name?.split(" ")?.[1],
                        'entry_street_address': formParam?.street_address,
                        'entry_suburb'        : formParam?.city,
                        'entry_postcode'      : formParam?.postal_code,
                        'entry_city_id'       : formParam?.city,
                        'entry_zone_id'       : formParam?.state,
                        'entry_country_id'    : formParam?.country,
                        'entry_company'       : formParam?.address_title,
                        'is_default'          : formParam?.is_default === true ? 1 : 0,
                        'entry_latitude'      : formParam?.latitude,
                        'entry_longitude'     : formParam?.longitude,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': formParam?.apiUrl, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data?.data?.success === '1') {

            if (showInfoMessage !== false) {
                MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message || response.data?.data?.message, false);
            }

            if (navigationActions !== false) {
                MyFunction.handleNavigationActions(navigationActions);
            }

        } else {

            if (showErrorMessage !== false) {
                MyUtil.showMessage(showErrorMessage.showMessage, showErrorMessage.message ? showErrorMessage.message : MyLANG.Error, false);
            }
        }
    },

    deleteAddress: async (formParam: any, showLoader: any = false, showInfoMessage: any = false, showErrorMessage: any = false, navigationActions: any = false) => {

        MyUtil.printConsole(true, 'log', 'LOG: deleteAddress: ', {
            'formParam'        : formParam,
            'showLoader'       : showLoader,
            'showInfoMessage'  : showInfoMessage,
            'showErrorMessage' : showErrorMessage,
            'navigationActions': navigationActions,
        });

        const response: any = await MyUtil
            .myHTTP({required: true, promptLogin: true}, MyConstant.HTTP_POST, formParam?.apiUrl,
                    {
                        'language_id': MyConfig.LanguageActive,

                        'address_book_id': formParam?.id,
                        'customers_id'   : formParam?.user_id,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': formParam?.apiUrl, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data?.data?.success === '1') {

            if (showInfoMessage !== false) {
                MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message || response.data?.data?.message, false);
            }

            if (navigationActions !== false) {
                MyFunction.handleNavigationActions(navigationActions);
            }

        } else {

            if (showErrorMessage !== false) {
                MyUtil.showMessage(showErrorMessage.showMessage, showErrorMessage.message ? showErrorMessage.message : MyLANG.Error, false);
            }
        }

    },

    uploadFile: async (formParam: any, showLoader: any = MyLANG.PleaseWait + '...', showInfoMessage: any = false, showErrorMessage: any = false) => {
        const response: any = await MyUtil
            .myHTTP(true, MyConstant.HTTP_POST, formParam?.apiUrl,
                    {
                        'language_id': MyConfig.LanguageActive,

                        formFields: {
                            'customers_id': formParam?.user_id,
                        },
                        formFiles : {
                            'customers_picture': formParam?.file,
                        },

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, true, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': formParam?.apiUrl, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data?.data?.length > 0) {

            if (showInfoMessage !== false) {
                MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message || response.data?.data?.message, false);
            }

            return true;

        } else {

            if (showErrorMessage !== false) {
                MyUtil.showMessage(showErrorMessage.showMessage, showErrorMessage.message, false);
            }
        }

        return false;
    },

    handleNavigationActions: (navigationActions: any) => {
        switch (navigationActions?.actionType) {
            case MyConstant.NAVIGATION_ACTIONS.SWITCH_APP_NAVIGATOR:
                store.dispatch(switchAppNavigator(MyConfig.appNavigation.HomeNavigator));
                break;
            case MyConstant.NAVIGATION_ACTIONS.POP_TO_ROOT:
                MyUtil.stackAction(navigationActions?.loginRequired,
                                   navigationActions?.navigation,
                                   MyConstant.StackAction.popToTop,
                                   navigationActions?.routeName,
                                   navigationActions?.params,
                                   null
                );
                break;
            case MyConstant.NAVIGATION_ACTIONS.NAVIGATE:
                MyUtil.commonAction(navigationActions?.loginRequired,
                                    navigationActions?.navigation,
                                    MyConstant.CommonAction.navigate,
                                    navigationActions?.routeName,
                                    navigationActions?.params,
                                    null
                );
                break;
            case MyConstant.NAVIGATION_ACTIONS.GO_BACK:
                MyUtil.stackAction(navigationActions?.loginRequired,
                                   navigationActions?.navigation,
                                   MyConstant.StackAction.pop,
                                   navigationActions?.routeName,
                                   navigationActions?.params,
                                   null
                );
                break;
            default:
                break;
        }
    },

    getName: (user: any) => {
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

    getAvatar: (user: any) => {
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
}

export default MyFunction;
