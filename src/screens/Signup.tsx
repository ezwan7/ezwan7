import React, {useState, useEffect, Fragment} from 'react';
import {StyleSheet, View, Text, SafeAreaView, ScrollView, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import MyUtil from '../common/MyUtil';
import {MyStyle, MyStyleSheet} from '../common/MyStyle';
import {StatusBarDark, StatusBarLight} from '../components/MyComponent';
import MyColor from '../common/MyColor';
import MyImage from '../shared/MyImage';
import {MyConfig} from '../shared/MyConfig';
import MyLANG from '../shared/MyLANG';
import {TextInput, Button} from 'react-native';


import {useForm, ErrorMessage} from 'react-hook-form';
import {MyConstant} from "../common/MyConstant";


let renderCount = 0;


const defaultValues = {
    firstName: 'bill',
    lastName : 'luo'
};

const signUpForm = {
    firstName: {
        ref           : {name: 'firstName'},
        validation    : {
            required : 'firstName Field is REquired.',
            minLength: {value: 2, message: 'Minimum Length is 2'}
        },
        shouldValidate: false,
        TextInput     : {
            icon        : '',
            label       : 'First name',
            placeholder : 'Enter First Name',
            keyboardType: 'numeric',
            multiline   : false
        }
    },
    lastName : {
        ref       : {name: 'lastName'},
        validation: {
            required : 'lastName Field is REquired.',
            minLength: {value: 2, message: 'Minimum Length is 2'}
        },

    }
};

const SignupScreen = ({}) => {
    // const [isLoading, setIsLoading] = useState(true);

    const {register, getValues, setValue, handleSubmit, formState, errors, reset, triggerValidation} = useForm(
        {
            // validationSchemaOption: undefined,
            mode                : 'onSubmit',
            reValidateMode      : 'onChange',
            // defaultValues       : defaultValues,
            // validationSchema    : SignupSchema,
            validateCriteriaMode: 'all',
            submitFocusError    : true
        }); // initialise the hook

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        // MyUtil.printConsole(true, 'log', 'LOG: SplashScreen: useEffect: ', {isLoading});
        register(signUpForm.firstName.ref, signUpForm.firstName.validation);
        register(signUpForm.lastName.ref, signUpForm.lastName.validation);
    }, [register])

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${SignupScreen.name}. renderCount: `, renderCount);
    }

    /*const handleOnChangeText = (formFieldName: string, text: any, shouldValidate: boolean) => {
        setValue('firstName', text, true);
    }*/

    // const values: any = watch();

    const formSubmit = (e: any) => {

    }

    // console.log(errors, getValues(), formState.isValid);

    return (
        <Fragment>
            <StatusBarDark/>
            <SafeAreaView>
                <LinearGradient start = {MyStyle.LGWhite.start}
                                end = {MyStyle.LGWhite.end}
                                locations = {MyStyle.LGWhite.locations}
                                colors = {MyStyle.LGWhite.colors}>
                    <View style = {MyStyleSheet.layoutView1}>
                        <ScrollView contentInsetAdjustmentBehavior = "automatic">
                            <View style = {MyStyleSheet.layoutView2}>

                                <View style = {MyStyleSheet.layoutView3}>
                                    <Image
                                        source = {MyImage.logo512}
                                        style = {styles.logoStyle}
                                        resizeMode = "contain"
                                    />
                                    <Text style = {styles.textStyle}>
                                        {MyLANG.AppName}
                                    </Text>

                                    <View style = {styles.inputs}>

                                        <TextInput
                                            keyboardType = "numeric"
                                            placeholder = "lastName"
                                            multiline = {false}
                                            secureTextEntry = {false}
                                            onChangeText = {(text) => setValue('lastName', text, true)}
                                        />
                                        <ErrorMessage errors = {errors}
                                                      name = "lastName"
                                                      as = {<Text/>}/>

                                        <Button title = "Press me"
                                                onPress = {(e) => {
                                                    formSubmit(e);
                                                }}/>
                                    </View>

                                </View>

                            </View>
                        </ScrollView>
                    </View>
                </LinearGradient>
            </SafeAreaView>
        </Fragment>
    )
}

SignupScreen.navigationOptions = {
    title: 'Login',
}

export default SignupScreen

const styles = StyleSheet.create({
                                     logoStyle: {
                                         alignSelf: 'center',
                                         width    : MyStyle.screenWidth * 0.3,
                                         height   : MyStyle.screenWidth * 0.3,
                                     },
                                     textStyle: {
                                         color     : MyColor.Primary.first,
                                         fontSize  : 40,
                                         fontWeight: 'bold',
                                         alignSelf : 'center',
                                     },
                                     inputs   : {
                                         display       : 'flex',
                                         flexDirection : 'column',
                                         justifyContent: 'flex-start',
                                         width         : MyStyle.screenWidth,
                                     },
                                 })

