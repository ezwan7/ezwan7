import React, {useState, useEffect, Fragment, useCallback} from 'react';
import {StyleSheet, View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, BackHandler} from 'react-native';
import {useFocusEffect} from "@react-navigation/native";
import {useForm} from 'react-hook-form';
import {useSelector} from "react-redux";
import LinearGradient from 'react-native-linear-gradient';
import Splash from "react-native-splash-screen";

import {MyStyle, MyStyleSheet} from '../common/MyStyle';
import MyColor from '../common/MyColor';
import MyImage from '../shared/MyImage';
import {MyConfig} from '../shared/MyConfig';
import MyLANG from '../shared/MyLANG';
import {MyConstant} from '../common/MyConstant';
import MyUtil from '../common/MyUtil';
import MyAuth from '../common/MyAuth';

import {StatusBarDark} from '../components/MyComponent';
import {MyInput} from "../components/MyInput";
import {MyButton} from "../components/MyButton";

import auth from '@react-native-firebase/auth';
import MyFunction from "../shared/MyFunction";
import MyIcon from "../components/MyIcon";


let renderCount = 0;

const signinForm: any = {
    email   : {
        ref           : {name: 'email'},
        value         : null,
        shouldValidate: true,
        validation    : {
            required : MyLANG.Email + ' ' + MyLANG.isRequired,
            minLength: {value: 4, message: MyLANG.Email + ' ' + MyLANG.mustBeMinimum + ' 4 ' + MyLANG.character},
            pattern  : {
                value  : MyConstant.Validation.email,
                message: MyLANG.InvalidEmail
            }
        }
    },
    password: {
        ref           : {name: 'password'},
        value         : null,
        shouldValidate: true,
        validation    : {
            required : MyLANG.Password + ' ' + MyLANG.isRequired,
            minLength: {value: 4, message: MyLANG.Password + ' ' + MyLANG.mustBeMinimum + ' 4 ' + MyLANG.character},
        },
    },
};

const SigninScreen = ({route, navigation}: any) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${SigninScreen.name}. renderCount: `, renderCount);
    }

    const user: any = useSelector((state: any) => state.auth.user);

    const {register, getValues, setValue, handleSubmit, formState, errors, reset, triggerValidation}: any = useForm(MyConfig.useFormDefault);

    useFocusEffect(
        useCallback(() => {

            const onBackPress = () => {
                return MyUtil.onBackButtonPress(navigation);
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${SigninScreen.name}. useEffect: `, {user: user});

        if (route?.params?.splash !== false) { // If splash param is not false then hide splash:
            MyUtil.printConsole(true, 'log', `LOG: ${SigninScreen.name}. route?.params?.splash: `, route?.params?.splash);
            Splash.hide();
        }

        for (const key of Object.keys(signinForm)) {
            if (signinForm[key]['ref']) {
                register(signinForm[key]['ref'], signinForm[key]['shouldValidate'] ? signinForm[key]['validation'] : null);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [register]);

    //TODO:
    const phoneLogin = async () => {
        /* try {
             const confirmation = await auth().signInWithPhoneNumber('+601121277006');

             await confirmation.confirm('123456'); // User entered code
             // Successful login - onAuthStateChanged is triggered
             console.log('Successful login');
         } catch (e) {
             console.error(e); // Invalid code
         }
         // [Android] Handle Auto Verification
         auth().onAuthStateChanged(user => {
             console.log('onAuthStateChanged: ', user);
             if (user) {
                 // Stop the login flow / Navigate to next page
             }
         });*/
        try {
            const confirmation = auth()
                .verifyPhoneNumber('+601121277006')
                .on('state_changed', (phoneAuthSnapshot: any) => {
                    // How you handle these state events is entirely up to your ui flow and whether
                    // you need to support both ios and android. In short: not all of them need to
                    // be handled - it's entirely up to you, your ui and supported platforms.

                    // E.g you could handle android specific events only here, and let the rest fall back
                    // to the optionalErrorCb or optionalCompleteCb functions
                    console.log('state_changed: ', phoneAuthSnapshot);
                    /*switch (phoneAuthSnapshot.state) {
                        // ------------------------
                        //  IOS AND ANDROID EVENTS
                        // ------------------------
                        case FirebaseAuthTypes.PhoneAuthState.CODE_SENT: // or 'sent'
                            console.log('code sent');
                            // on ios this is the final phone auth state event you'd receive
                            // so you'd then ask for user input of the code and build a credential from it
                            // as demonstrated in the `signInWithPhoneNumber` example above
                            break;
                        case firebase.auth.PhoneAuthState.ERROR: // or 'error'
                            console.log('verification error');
                            console.log(phoneAuthSnapshot.error);
                            break;

                        // ---------------------
                        // ANDROID ONLY EVENTS
                        // ---------------------
                        case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
                            console.log('auto verify on android timed out');
                            // proceed with your manual code input flow, same as you would do in
                            // CODE_SENT if you were on IOS
                            break;
                        case firebase.auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
                            // auto verified means the code has also been automatically confirmed as correct/received
                            // phoneAuthSnapshot.code will contain the auto verified sms code - no need to ask the user for input.
                            console.log('auto verified on android');
                            console.log(phoneAuthSnapshot);
                            // Example usage if handling here and not in optionalCompleteCb:
                            // const { verificationId, code } = phoneAuthSnapshot;
                            // const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);

                            // Do something with your new credential, e.g.:
                            // firebase.auth().signInWithCredential(credential);
                            // firebase.auth().currentUser.linkWithCredential(credential);
                            // etc ...
                            break;
                    }*/
                }/*, (error) => {
                    // optionalErrorCb would be same logic as the ERROR case above,  if you've already handed
                    // the ERROR case in the above observer then there's no need to handle it here
                    console.log(error);
                    // verificationId is attached to error if required
                    console.log(error.verificationId);
                }, (phoneAuthSnapshot: any) => {
                    // optionalCompleteCb would be same logic as the AUTO_VERIFIED/CODE_SENT switch cases above
                    // depending on the platform. If you've already handled those cases in the observer then
                    // there's absolutely no need to handle it here.

                    // Platform specific logic:
                    // - if this is on IOS then phoneAuthSnapshot.code will always be null
                    // - if ANDROID auto verified the sms code then phoneAuthSnapshot.code will contain the verified sms code
                    //   and there'd be no need to ask for user input of the code - proceed to credential creating logic
                    // - if ANDROID auto verify timed out then phoneAuthSnapshot.code would be null, just like ios, you'd
                    //   continue with user input logic.
                    console.log('phoneAuthSnapshot: ', phoneAuthSnapshot);
                }*/).then((phoneAuthSnapshot) => {
                    console.log('phoneAuthSnapshot-then', phoneAuthSnapshot);
                }, (error) => {
                    console.log('phoneAuthSnapshot-error', error);
                });
        } catch (e) {
            console.error(e); // Invalid code
        }
    }

    const formSubmit = async (e: any) => {
        const formValue: any = await MyUtil.formProcess(e, getValues, handleSubmit, formState, errors);
        MyUtil.printConsole(true, 'log', 'LOG: formProcess: await-response: ', {'formValue': formValue});
        if (formValue?.type === MyConstant.RESPONSE.TYPE.data && formValue?.data) {
            MyAuth.login({
                             mode    : MyConstant.LOGIN_MODE.EMAIL,
                             email   : formValue.data.email,
                             password: formValue.data.password,
                         },
                         MyConstant.SHOW_MESSAGE.TOAST,
                         MyConstant.SHOW_MESSAGE.ALERT,
                         MyLANG.Login + '...',
                         false,
                         null,
                         MyConstant.NAVIGATION_ACTIONS.POP_TO_ROOT
            );
        } else {
            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT,
                               formValue.errorMessage ? formValue.errorMessage : MyLANG.FormInvalid,
                               false
            );
        }
    }

    return (
        <Fragment>
            <StatusBarDark/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView1}/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <LinearGradient style = {[MyStyleSheet.SafeAreaView3, {}]}
                                start = {MyStyle.LGWhitish.start}
                                end = {MyStyle.LGWhitish.end}
                                locations = {MyStyle.LGWhitish.locations}
                                colors = {MyStyle.LGWhitish.colors}>
                    <ScrollView contentInsetAdjustmentBehavior = "automatic">

                        <View style = {[MyStyleSheet.viewPageLogin, {alignItems: "center", marginTop: MyStyle.headerHeightAdjusted}]}>
                            <Image source = {MyImage.logo1024}
                                   resizeMode = "contain"
                                   style = {styles.imageLogo}
                            />
                            <Text style = {styles.textLogin}>
                                {MyLANG.Login}
                            </Text>
                            <Text style = {styles.textLoginDescription}>
                                {MyLANG.LoginTitleDescription}
                            </Text>

                            <MyInput
                                floatingLabel = {MyLANG.EnterYourEmail}
                                onChangeText = {(text: any) => setValue('email', text, true)}
                                value = {getValues().email}
                                iconLeft = {{name: 'envelope'}}
                                helperText = {{message: errors.email?.message ? errors.email.message : null}}
                            />

                            <MyInput
                                floatingLabel = {MyLANG.EnterYourPassword}
                                inputProps = {{secureTextEntry: true}}
                                onChangeText = {(text: any) => setValue('password', text, true)}
                                value = {getValues().password}
                                iconLeft = {{name: 'lock'}}
                                iconRight = {{name: 'eye'}}
                                iconRightOnPress = {{type: MyConstant.InputIconRightOnPress.secureTextEntry}}
                                helperText = {{message: errors.password?.message ? errors.password.message : null}}
                            />

                            <TouchableOpacity activeOpacity = {0.7}
                                              onPress = {
                                                  () =>
                                                      MyUtil.commonAction(false,
                                                                          null,
                                                                          MyConstant.CommonAction.navigate,
                                                                          MyConfig.routeName.PasswordForgot,
                                                                          null,
                                                                          null
                                                      )
                                              }
                                              style = {{alignSelf: "flex-end"}}>
                                <Text style = {styles.textForgetPassword}>
                                    {MyLANG.ForgotYourPassword}
                                </Text>
                            </TouchableOpacity>

                            <MyButton
                                color = {MyStyle.LGButtonPrimary}
                                title = {MyLANG.Login}
                                linearGradientStyle = {{marginTop: 32}}
                                onPress = {(e: any) => {
                                    formSubmit(e);
                                }}
                            />

                            {
                                // If already logged in using any kind of method, check which id available, disable auto ask, call the id, hide if none
                                // Icon change based on available biometry type
                                <TouchableOpacity
                                    activeOpacity = {0.7}
                                    onPress = {
                                        () =>
                                            MyAuth.biometricLogin(MyConstant.SHOW_MESSAGE.TOAST,
                                                                  MyConstant.SHOW_MESSAGE.ALERT,
                                                                  MyLANG.PleaseWait + '...',
                                                                  false,
                                                                  null,
                                                                  MyConstant.NAVIGATION_ACTIONS.POP_TO_ROOT,
                                            )
                                    }
                                    style = {{marginTop: 40}}
                                >
                                    <MyIcon.Ionicons
                                        name = "md-finger-print"
                                        size = {40}
                                        color = {MyColor.textDarkPrimary2}
                                        style = {{textAlign: "center"}}
                                    />
                                    <Text style = {styles.textTouchID}>
                                        {MyLANG.LoginUsingFingerPrint}
                                    </Text>
                                </TouchableOpacity>
                            }

                            <Text style = {styles.textOrConnectUsing}>
                                {MyLANG.OrConnectUsing}
                            </Text>
                            <View style = {[MyStyle.RowCenter, {marginTop: 7}]}>
                                <MyButton
                                    color = {MyStyle.LGButtonFacebook}
                                    textTransform = "capitalize"
                                    iconLeft = {{fontFamily: MyConstant.VectorIcon.Fontisto, name: 'facebook'}}
                                    linearGradientStyle = {{marginRight: 7}}
                                    title = {MyLANG.Facebook}
                                    onPress = {MyFunction.loginFacebook}
                                />
                                <MyButton
                                    color = {MyStyle.LGButtonGoogle}
                                    textTransform = "capitalize"
                                    iconLeft = {{fontFamily: MyConstant.VectorIcon.Fontisto, name: 'google'}}
                                    linearGradientStyle = {{marginLeft: 7}}
                                    title = {MyLANG.Google}
                                    onPress = {MyFunction.loginGoogle}
                                />
                            </View>

                            <TouchableOpacity
                                activeOpacity = {0.7}
                                onPress = {
                                    () =>
                                        MyUtil.commonAction(false,
                                                            null,
                                                            MyConstant.CommonAction.navigate,
                                                            MyConfig.routeName.Signup,
                                                            null,
                                                            null
                                        )
                                }
                            >
                                <View style = {[MyStyle.RowCenter, {marginTop: 44}]}>
                                    <Text style = {styles.textDontHaveAccount}>
                                        {MyLANG.DontHaveAnAccount}
                                    </Text>
                                    <Text style = {styles.textSignUp}>
                                        {MyLANG.SignUp}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </LinearGradient>
            </SafeAreaView>
        </Fragment>
    );
};

SigninScreen.navigationOptions = {};

export default SigninScreen;

const styles = StyleSheet.create(
    {
        imageLogo           : {
            width : MyStyle.screenWidth * 0.60,
            height: (MyStyle.screenWidth * 0.60) / (1024 / 249),

            marginTop: 15,
        },
        textLogin           : {
            marginTop: 44,
            alignSelf: "flex-start",
            ...MyStyleSheet.headerPageLarge
        },
        textLoginDescription: {
            marginTop   : 2,
            marginBottom: 24,
            alignSelf   : "flex-start",
            ...MyStyleSheet.subHeaderPage
        },
        textForgetPassword  : {
            fontFamily: MyStyle.FontFamily.Roboto.medium,
            fontSize  : 13,
            color     : MyColor.attentionDark,
        },
        textTouchID         : {
            ...MyStyleSheet.textListItemSubTitle
        },
        textOrConnectUsing  : {
            marginTop   : 40,
            marginBottom: 7,
            ...MyStyleSheet.subHeaderPage
        },
        textDontHaveAccount : {
            ...MyStyleSheet.subHeaderPage,
            color: MyColor.textDarkPrimary,
        },
        textSignUp          : {
            ...MyStyleSheet.subHeaderPage,
            paddingLeft: 5,
            fontFamily : MyStyle.FontFamily.Roboto.medium,
            color      : MyColor.Primary.first,
        },
    }
);

