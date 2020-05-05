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

let renderCount = 0;

const passwordForgotForm: any = {
    email: {
        ref           : {name: 'email'},
        value         : null,
        shouldValidate: true,
        validation    : {
            required : MyLANG.Email + ' ' + MyLANG.isRequired,
            minLength: {value: 4, message: MyLANG.Email + ' ' + MyLANG.mustBeMinimum + ' 4 ' + MyLANG.character},
            pattern  : {
                value  : MyConstant.Validation.email,
                message: MyLANG.InvalidEmail,
            }
        }
    },
};

const PasswordForgotScreen = ({}) => {
    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${PasswordForgotScreen.name}. renderCount: `, renderCount);
    }

    const {register, getValues, setValue, handleSubmit, formState, errors, reset, triggerValidation}: any = useForm(MyConfig.useFormDefault);

    useEffect(() => {
        // MyUtil.printConsole(true, 'log', `LOG: ${PasswordForgotScreen.name}. useEffect: `, 'register');
        for (const key of Object.keys(passwordForgotForm)) {
            if (passwordForgotForm[key]['ref']) {
                register(passwordForgotForm[key]['ref'], passwordForgotForm[key]['shouldValidate'] ? passwordForgotForm[key]['validation'] : null);
            }
        }
    }, [register]);

    const formSubmit = async (e: any) => {
        const formValue: any = await MyUtil.formProcess(e, getValues, handleSubmit, formState, errors);
        MyUtil.printConsole(true, 'log', 'LOG: formProcess: await-response: ', {'formValue': formValue});
        if (formValue && formValue.type === MyConstant.RESPONSE.TYPE.data && formValue.data) {
            MyAuth.passwordForgot({email: formValue.data.email},
                                  MyConstant.SHOW_MESSAGE.ALERT,
                                  MyLANG.PleaseWait + '...',
                                  MyConfig.routeName.PasswordReset,
                                  {
                                      email: formValue.data.email
                                  },
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

                    <ScrollView contentInsetAdjustmentBehavior = "automatic"
                                contentContainerStyle = {{paddingTop: MyStyle.paddingVerticalList}}
                    >

                        <View style = {[MyStyleSheet.viewPageLogin, {alignItems: "center"}]}>
                            <Image source = {MyImage.logo1024}
                                   resizeMode = "contain"
                                   style = {styles.imageLogo}
                            />
                            <Text style = {styles.textForgotPassword}>
                                {MyLANG.ForgotPassword}?
                            </Text>
                            <Text style = {styles.textForgotPasswordDescription}>
                                {MyLANG.ForgotPasswordDescription}
                            </Text>

                            <MyInput
                                floatingLabel = {MyLANG.EnterYourEmail}
                                onChangeText = {(text: any) => setValue('email', text, true)}
                                value = {getValues().email}
                                iconLeft = {{name: 'envelope'}}
                                helperText = {{message: errors.email?.message ? errors.email.message : null}}
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
                                              onPress = {
                                                  () =>
                                                      MyUtil.commonAction(false,
                                                                          null,
                                                                          MyConstant.CommonAction.navigate,
                                                                          MyConfig.routeName.PasswordReset,
                                                                          null,
                                                                          null
                                                      )
                                              }
                            >
                                <View style = {[MyStyle.RowCenter, {marginTop: 44}]}>
                                    <Text style = {styles.textAlreadyHaveCode}>
                                        {MyLANG.AlreadyHaveCode}
                                    </Text>
                                    <Text style = {styles.textResetNow}>
                                        {MyLANG.ResetNow}
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

PasswordForgotScreen.navigationOptions = {};

export default PasswordForgotScreen;

const styles = StyleSheet.create(
    {
        imageLogo                    : {
            width : MyStyle.screenWidth * 0.60,
            height: (MyStyle.screenWidth * 0.60) / (1024 / 249),

            marginTop: 24,
        },
        textForgotPassword           : {
            marginTop: 44,
            alignSelf: "flex-start",
            ...MyStyleSheet.headerPageLarge,
            fontSize : 32,
        },
        textForgotPasswordDescription: {
            marginTop   : 2,
            marginBottom: 24,
            alignSelf   : "flex-start",
            ...MyStyleSheet.subHeaderPage
        },
        textAlreadyHaveCode          : {
            ...MyStyleSheet.subHeaderPage,
            color: MyColor.textDarkPrimary,
        },
        textResetNow                 : {
            ...MyStyleSheet.subHeaderPage,
            paddingLeft: 5,
            fontFamily : MyStyle.FontFamily.Roboto.medium,
            color      : MyColor.attentionDark,
        },
    }
);

