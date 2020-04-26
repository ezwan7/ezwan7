import React, {useState, useEffect, Fragment} from 'react';
import {StyleSheet, View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useForm} from 'react-hook-form';

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

import * as yup from 'yup';

let renderCount = 0;

const PasswordResetSchema: any = yup.object().shape(
    {
        code            : yup.string()
                             .required(MyLANG.Code + ' ' + MyLANG.isRequired)
                             .min(4, MyLANG.Code + ' ' + MyLANG.mustBeMinimum + ' 4 ' + MyLANG.character)
                             .max(8, MyLANG.Code + ' ' + MyLANG.mustBeMaximum + ' 8 ' + MyLANG.character),
        email           : yup.string()
                             .required(MyLANG.Email + ' ' + MyLANG.isRequired)
                             .min(2, MyLANG.Email + ' ' + MyLANG.mustBeMinimum + ' 2 ' + MyLANG.character)
                             .max(64, MyLANG.Email + ' ' + MyLANG.mustBeMaximum + ' 64 ' + MyLANG.character)
                             .email(MyLANG.InvalidEmail),
        password        : yup.string()
                             .required(MyLANG.Password + ' ' + MyLANG.isRequired)
                             .min(4, MyLANG.Code + ' ' + MyLANG.mustBeMinimum + ' 4 ' + MyLANG.character)
                             .max(24, MyLANG.Code + ' ' + MyLANG.mustBeMaximum + ' 24 ' + MyLANG.character),
        password_confirm: yup.string()
                             .required(MyLANG.ConfirmPassword + ' ' + MyLANG.isRequired)
                             .min(4, MyLANG.ConfirmPassword + ' ' + MyLANG.mustBeMinimum + ' 4 ' + MyLANG.character)
                             .max(24, MyLANG.ConfirmPassword + ' ' + MyLANG.mustBeMaximum + ' 24 ' + MyLANG.character)
                             .oneOf([yup.ref('password'), null], MyLANG.PasswordMustMatch),
    }
);

// const defaultValues: any = {};

const passwordResetForm: any = {
    code            : {
        ref           : {name: 'code'},
        value         : null,
        shouldValidate: true,
        validation    : {
            required : MyLANG.Code + ' ' + MyLANG.isRequired,
            minLength: {value: 4, message: MyLANG.Code + ' ' + MyLANG.mustBeMinimum + ' 4 ' + MyLANG.character},
            maxLength: {value: 8, message: MyLANG.Code + ' ' + MyLANG.mustBeMaximum + ' 8 ' + MyLANG.character},
        }
    },
    password        : {
        ref           : {name: 'password'},
        value         : null,
        shouldValidate: true,
        validation    : {
            required : MyLANG.Password + ' ' + MyLANG.isRequired,
            minLength: {value: 4, message: MyLANG.Password + ' ' + MyLANG.mustBeMinimum + ' 4 ' + MyLANG.character},
        },
    },
    password_confirm: {
        ref           : {name: 'password_confirm'},
        value         : null,
        shouldValidate: true,
        validation    : {
            required : MyLANG.ConfirmPassword + ' ' + MyLANG.isRequired,
            minLength: {value: 4, message: MyLANG.ConfirmPassword + ' ' + MyLANG.mustBeMinimum + ' 4 ' + MyLANG.character},
        },
    },
};

const PasswordResetScreen = ({route, navigation}: any) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${PasswordResetScreen.name}. renderCount: `, renderCount);
    }

    const {register, getValues, setValue, handleSubmit, formState, errors, reset, triggerValidation}: any = useForm(
        {
            mode                : 'onSubmit',
            reValidateMode      : 'onChange',
            // defaultValues       : defaultValues,
            validationSchema    : PasswordResetSchema,
            validateCriteriaMode: 'all',
            submitFocusError    : true,
        });

    useEffect(() => {
        // MyUtil.printConsole(true, 'log', `LOG: ${PasswordResetScreen.name}. useEffect: `, 'register');
        for (const key of Object.keys(PasswordResetSchema['fields'])) {
            if (key) {
                register({name: key});
            }
        }
    }, [register]);

    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${PasswordResetScreen.name}. useEffect: `, route?.params);

        if (route?.params?.email) {
            setValue('email', route?.params?.email, true);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const resendCode = async () => {
        if (route?.params?.email) {
            MyAuth.passwordForgot({email: route?.params?.email},
                                  MyConstant.SHOW_MESSAGE.ALERT,
                                  MyLANG.PleaseWait + '...',
                                  null,
                                  {},
                                  null
            );
        } else {
            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT, MyLANG.PleaseEnterEmailAddress, false);
        }
    };

    const formSubmit = async (e: any) => {
        const formValue: any = await MyUtil.formProcess(e, getValues, handleSubmit, formState, errors);
        MyUtil.printConsole(true, 'log', 'LOG: formProcess: await-response: ', {'formValue': formValue});
        if (formValue && formValue.type === MyConstant.RESPONSE.TYPE.data && formValue.data) {
            MyAuth.passwordReset({
                                     code    : formValue.data.code,
                                     email   : formValue.data.email,
                                     password: formValue.data.password,
                                 },
                                 MyConstant.SHOW_MESSAGE.ALERT,
                                 MyLANG.PleaseWait + '...',
                                 MyConfig.routeName.Login,
                                 null,
                                 null
            );
        } else {
            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT,
                               formValue.errorMessage ? formValue.errorMessage : MyLANG.FormInvalid,
                               false
            );
        }
    };

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
                            <Text style = {styles.textResetPassword}>
                                {MyLANG.ResetPassword}
                            </Text>
                            <Text style = {styles.textResetPasswordDescription}>
                                {MyLANG.ResetPasswordDescription}
                            </Text>

                            <MyInput
                                floatingLabel = {MyLANG.EnterResetCode}
                                onChangeText = {(text: any) => setValue('code', text, true)}
                                value = {getValues().code}
                                iconLeft = {{name: 'key'}}
                                helperText = {{message: errors.code?.message ? errors.code.message : null}}
                            />
                            <MyInput
                                floatingLabel = {MyLANG.EnterYourEmail}
                                onChangeText = {(text: any) => setValue('email', text, true)}
                                value = {getValues().email}
                                iconLeft = {{name: 'envelope'}}
                                helperText = {{message: errors.email?.message ? errors.email.message : null}}
                            />
                            <MyInput
                                floatingLabel = {MyLANG.EnterYourNewPassword}
                                inputProps = {{secureTextEntry: true}}
                                onChangeText = {(text: any) => setValue('password', text, true)}
                                value = {getValues().password}
                                iconLeft = {{name: 'lock'}}
                                iconRight = {{name: 'eye'}}
                                iconRightOnPress = {{type: MyConstant.InputIconRightOnPress.secureTextEntry}}
                                helperText = {{message: errors.password?.message ? errors.password.message : null}}
                            />
                            <MyInput
                                floatingLabel = {MyLANG.EnterYourNewConfirmPassword}
                                inputProps = {{secureTextEntry: true}}
                                onChangeText = {(text: any) => setValue('password_confirm', text, true)}
                                value = {getValues().password_confirm}
                                iconLeft = {{name: 'lock'}}
                                iconRight = {{name: 'eye'}}
                                iconRightOnPress = {{type: MyConstant.InputIconRightOnPress.secureTextEntry}}
                                helperText = {{message: errors.password_confirm?.message ? errors.password_confirm.message : null}}
                            />

                            <MyButton
                                color = {MyStyle.LGButtonPrimary}
                                title = {MyLANG.Submit}
                                linearGradientStyle = {{marginTop: MyStyle.marginButtonTop}}
                                onPress = {(e: any) => {
                                    formSubmit(e);
                                }}
                            />

                            <TouchableOpacity activeOpacity = {0.7}
                                              onPress = {resendCode}>
                                <View style = {[MyStyle.RowCenter, {marginTop: 44}]}>
                                    <Text style = {styles.textAlreadyHaveCode}>
                                        {MyLANG.DidnotReceivedCode}
                                    </Text>
                                    <Text style = {styles.textResetNow}>
                                        {MyLANG.ResendNow}
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

PasswordResetScreen.navigationOptions = {};

export default PasswordResetScreen;

const styles = StyleSheet.create(
    {
        imageLogo                   : {
            width : MyStyle.screenWidth * 0.60,
            height: (MyStyle.screenWidth * 0.60) / (1024 / 249),

            marginTop: 24,
        },
        textResetPassword           : {
            marginTop: 44,
            alignSelf: "flex-start",
            ...MyStyleSheet.headerPageLarge,
            fontSize : 32,
        },
        textResetPasswordDescription: {
            marginTop   : 2,
            marginBottom: 24,
            alignSelf   : "flex-start",
            ...MyStyleSheet.subHeaderPage
        },
        textAlreadyHaveCode         : {
            ...MyStyleSheet.subHeaderPage,
            color: MyColor.textDarkPrimary,
        },
        textResetNow                : {
            ...MyStyleSheet.subHeaderPage,
            paddingLeft: 5,
            fontFamily : MyStyle.FontFamily.Roboto.medium,
            color      : MyColor.attentionDark,
        },
    }
);

