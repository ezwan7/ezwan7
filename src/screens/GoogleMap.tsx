import React, {Fragment, useEffect, useRef, useState} from 'react';
import {SafeAreaView, View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {Marker} from 'react-native-maps';

import MyLANG from '../shared/MyLANG';
import MyUtil from '../common/MyUtil';
import {MyConstant} from '../common/MyConstant';
import {MyConfig} from "../shared/MyConfig";
import {MyStyle, MyStyleSheet} from "../common/MyStyle";
import MyColor from "../common/MyColor";
import MyFunction from "../shared/MyFunction";
import {HeaderGoogleMapSearch, ListEmptyViewLottie, StatusBarLight} from '../components/MyComponent';
import {MyButton} from "../components/MyButton";
import MyImage from "../shared/MyImage";
import {useSelector} from "react-redux";

let renderCount = 0;

const GoogleMapScreen = ({route, navigation}: any) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${GoogleMapScreen.name}. renderCount: `, {renderCount});
    }

    const user_location: any = useSelector((state: any) => state.user_location);

    const mapRef: any                  = useRef();
    const [location, setLocation]: any = useState();

    useEffect(() => {

        MyUtil.printConsole(true, 'log', `LOG: ${GoogleMapScreen.name}. useEffect: `, route?.params);

        initMap();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /*useEffect(() => {

        MyUtil.printConsole(true, 'log', `LOG: ${GoogleMapScreen.name}. useEffect: location: `, {location});

        if (mapRef?.current) {
            // const prevPos = {latitude: mapRef.current?.props?.initialRegion?.latitude, longitude: mapRef.current?.props?.initialRegion?.longitude};
            // const curPos  = {latitude: location.region?.latitude, longitude: location.region?.longitude};
            // const curRot  = getRotation(prevPos, curPos);
            // mapRef.current.animateCamera({heading: {curRot}, center: curPos, pitch: 90});
            mapRef.current.animateCamera({center: location?.region});
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);*/

    const initMap = async () => {
        switch (route?.params?.mapPageSource) {

            case MyConstant.MapPageSource.current_location:
                getCurrentLocation();
                break;

            case MyConstant.MapPageSource.user_location:

                if (user_location?.latitude && user_location?.longitude && user_location?.formatted_address) {
                    const updatedLocation: any = {
                        region      : {
                            latitude      : user_location.latitude,
                            longitude     : user_location.longitude,
                            latitudeDelta : 0.0922,
                            longitudeDelta: 0.0922 * MyStyle.screenAspectRatio,
                        },
                        address_text: user_location.formatted_address,
                        location    : user_location,
                    }
                    setLocation(updatedLocation);
                }
                break;

            case MyConstant.MapPageSource.params:

                if (route?.params?.location?.latitude && route?.params?.location?.longitude) {

                    const latitude  = route?.params?.location?.latitude;
                    const longitude = route?.params?.location?.longitude;

                    getGeocodePosition({latitude, longitude});

                } else if (route?.params?.location?.formatted_address) {

                    getGeocodeAddress(route.params.location.formatted_address);

                }

                break;

            default:
                break;
        }
    }

    const onSubmit = () => {

        MyUtil.printConsole(true, 'log', 'LOG: onSubmit: ', location);

        switch (route?.params?.onSubmit?.type) {

            case MyConstant.MapPageOnSubmit.store:

                break;

            case MyConstant.MapPageOnSubmit.select_and_GO_BACK:
                MyUtil.commonAction(false,
                                    navigation,
                                    MyConstant.CommonAction.navigate,
                                    route?.params?.onSubmit.routeName,
                                    location,
                                    null
                )
                break;

            default:
                break;
        }
    }

    const onMapReady = () => {
    }

    const onPress = async (event: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: onPress: ', event.nativeEvent.coordinate);

        const {latitude, longitude} = event.nativeEvent.coordinate;

        const geocodePosition: any = await MyUtil.GeocodePosition(latitude, longitude, MyConstant.SHOW_MESSAGE.TOAST);
        MyUtil.printConsole(true, 'log', 'LOG: GeocodePosition: await-response: ', {'geocodePosition': geocodePosition});

        if (geocodePosition?.results?.[0]?.address_components?.[0]) {

            const location: any = MyUtil.generateLocation(geocodePosition, 0, latitude, longitude);

            MyUtil.printConsole(true, 'log', 'LOG: onPress: ', {location});
            if (location?.latitude && location?.longitude && location?.formatted_address) {
                const updatedLocation: any = {
                    region      : {
                        latitude      : location?.latitude,
                        longitude     : location?.longitude,
                        latitudeDelta : 0.0922,
                        longitudeDelta: 0.0922 * MyStyle.screenAspectRatio,
                    },
                    address_text: location?.formatted_address,
                    location    : location,
                }
                setLocation(updatedLocation);
            }
        }

    }

    const getCurrentLocation = async () => {
        const location: any = await MyFunction.getUserLocation(MyConstant.GeolocationFetchType.return,
                                                               MyStyle.platformOS === "ios" ? MyConfig.geoLocationOptionSilent : MyConfig.geoLocationOption,
                                                               true,
                                                               false,
                                                               MyConstant.SHOW_MESSAGE.ALERT
        );
        MyUtil.printConsole(true, 'log', 'LOG: getUserLocation: await-response: ', {'location': location});
        if (location?.latitude && location?.longitude && location?.formatted_address) {
            const updatedLocation: any = {
                region      : {
                    latitude      : location?.latitude,
                    longitude     : location?.longitude,
                    latitudeDelta : 0.0922,
                    longitudeDelta: 0.0922 * MyStyle.screenAspectRatio,
                },
                address_text: location?.formatted_address,
                location    : location,
            }
            setLocation(updatedLocation);

            mapMoveCamera(updatedLocation);
        }
    };

    const getGeocodePosition = async (region: any) => {

        const geocodePosition: any = await MyUtil.GeocodePosition(region?.latitude, region?.longitude, MyConstant.SHOW_MESSAGE.TOAST);
        MyUtil.printConsole(true, 'log', 'LOG: GeocodePosition: await-response: ', {'geocodePosition': geocodePosition});

        if (geocodePosition?.results?.[0]?.address_components?.[0]) {

            const location: any = MyUtil.generateLocation(geocodePosition, 0, region?.latitude, region?.longitude);

            MyUtil.printConsole(true, 'log', 'LOG: generateLocation: ', {region, location});

            if (location?.latitude && location?.longitude && location?.formatted_address) {
                const updatedLocation: any = {
                    region      : {
                        latitude      : location?.latitude,
                        longitude     : location?.longitude,
                        latitudeDelta : 0.0922,
                        longitudeDelta: 0.0922 * MyStyle.screenAspectRatio,
                    },
                    address_text: location?.formatted_address,
                    location    : location,
                }
                setLocation(updatedLocation);

                mapMoveCamera(updatedLocation);
            }
        }
    };

    const getGeocodeAddress = async (formatted_address: any) => {

        const geocodeAddress: any = await MyUtil.GeocodeAddress(formatted_address, MyLANG.PleaseWait + '...', MyConstant.SHOW_MESSAGE.TOAST);
        MyUtil.printConsole(true, 'log', 'LOG: GeocodeAddress: await-response: ', {'geocodeAddress': geocodeAddress});

        if (geocodeAddress?.type === MyConstant.RESPONSE.TYPE.data && geocodeAddress.data) {

            const location: any = MyUtil.generateLocation(geocodeAddress.data,
                                                          0,
                                                          geocodeAddress.data?.results?.[0].geometry?.location.lat,
                                                          geocodeAddress.data?.results?.[0].geometry?.location.lng
            );

            MyUtil.printConsole(true, 'log', 'LOG: getGeocodeAddress: ', {location});

            if (location?.latitude && location?.longitude && location?.formatted_address) {
                const updatedLocation: any = {
                    region      : {
                        latitude      : location?.latitude,
                        longitude     : location?.longitude,
                        latitudeDelta : 0.0922,
                        longitudeDelta: 0.0922 * MyStyle.screenAspectRatio,
                    },
                    address_text: location?.formatted_address,
                    location    : location,
                }
                setLocation(updatedLocation);

                mapMoveCamera(updatedLocation);
            }
        }
    };

    const mapMoveCamera = async (updatedLocation: any) => {
        if (mapRef?.current && updatedLocation?.region?.latitude && updatedLocation?.region?.longitude) {
            // const prevPos = {latitude: mapRef.current?.props?.initialRegion?.latitude, longitude: mapRef.current?.props?.initialRegion?.longitude};
            // const curPos  = {latitude: location.region?.latitude, longitude: location.region?.longitude};
            // const curRot  = getRotation(prevPos, curPos);
            // mapRef.current.animateCamera({heading: {curRot}, center: curPos, pitch: 90});
            mapRef.current.animateCamera({center: updatedLocation.region});
        }
        // Add Debounce:
        // getGeocodePosition(region);
    }


    return (
        <Fragment>
            <HeaderGoogleMapSearch
                onSearch = {() => getCurrentLocation()}
                onMarker = {() => getCurrentLocation()}
                onBack = {
                    () =>
                        MyUtil.stackAction(false,
                                           null,
                                           MyConstant.StackAction.pop,
                                           1,
                                           null,
                                           null
                        )
                }
            />
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <View style = {[MyStyleSheet.SafeAreaView3, {paddingTop: 0, backgroundColor: MyColor.backgroundGrey}]}>

                    {
                        (location?.region) ?
                        <View style = {styles.container}>

                            <MapView
                                ref = {mapRef}
                                provider = {PROVIDER_GOOGLE}
                                onMapReady = {onMapReady}
                                initialRegion = {location.region}
                                /*onRegionChange = {getGeocodePosition}
                                onRegionChangeComplete = {(region: any) => {
                                    setAddress();
                                }}*/
                                onPress = {onPress}
                                moveOnMarkerPress = {false}
                                style = {styles.map}
                            >
                                <Marker
                                    coordinate = {location.region}
                                    // tracksViewChanges = {true}
                                    // onPress = {() => console.log('Marker pressed')}
                                />
                            </MapView>

                            {/*<View style = {styles.buttonContainer2}>
                            <TouchableOpacity
                                onPress = {() => getCurrentLocation()}
                                style = {styles.bubble3}
                            >
                                <Text>{MyLANG.GetCurrentAddress}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style = {styles.buttonContainer1}>
                            <View style = {styles.bubble1}>
                                <Text>Lat: {location?.region?.latitude?.toPrecision(7)}</Text>
                            </View>
                            <View style = {styles.bubble2}>
                                <Text>Long: {location?.region?.longitude?.toPrecision(7)}</Text>
                            </View>
                        </View>*/}
                            <View style = {styles.viewAddress}>
                                <Text
                                    numberOfLines = {2}
                                    style = {styles.textAddress}>
                                    {location?.address_text ? location?.address_text : '...'}
                                </Text>
                                <MyButton
                                    fill = "solid"
                                    color = {MyColor.Material.INDIGO["A700"]}
                                    display = "block"
                                    viewStyle = {styles.buttonAddress}
                                    touchableStyle = {{}}
                                    iconLeft = {{fontFamily: MyConstant.VectorIcon.Fontisto, name: 'check'}}
                                    onPress = {onSubmit}
                                />
                            </View>
                        </View>
                                           :
                        <ListEmptyViewLottie
                            source = {MyImage.lottie_map_marker}
                            style = {{view: {}, image: {}, text: {}}}
                        />
                    }

                </View>
            </SafeAreaView>
        </Fragment>
    );
};


const getRotation = (prevPos: any, curPos: any) => {
    if (!prevPos) {
        return 0;
    }
    const xDiff = curPos.latitude - prevPos.latitude;
    const yDiff = curPos.longitude - prevPos.longitude;
    return (Math.atan2(yDiff, xDiff) * 180.0) / Math.PI;
}

const styles = StyleSheet.create(
    {
        container: {
            position      : 'absolute',
            top           : 0,
            left          : 0,
            right         : 0,
            bottom        : 0,
            justifyContent: 'flex-end',
            alignItems    : 'center',
        },
        map      : {
            position: 'absolute',
            top     : 0,
            left    : 0,
            right   : 0,
            bottom  : 0,
        },

        viewAddress  : {
            flexDirection  : 'row',
            justifyContent : 'flex-start',
            alignItems     : 'center',
            backgroundColor: 'rgba(255,255,255,1)',
            borderRadius   : 100,
            marginBottom   : 32,
            marginStart    : 10,
            marginEnd      : 10,

            shadowColor  : "#000",
            shadowOffset : {
                width : 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius : 3.84,
            elevation    : 5,
        },
        textAddress  : {
            flex: 1,

            fontFamily: MyStyle.FontFamily.Roboto.regular,
            fontSize  : 14,
            color     : MyColor.textDarkPrimary,

            paddingLeft    : 20,
            paddingRight   : 10,
            paddingVertical: 8,

        },
        buttonAddress: {
            flex          : 0,
            justifyContent: 'center',

            height: 52,
        },


        buttonContainer1: {
            flexDirection  : 'row',
            justifyContent : 'space-between',
            marginBottom   : 10,
            backgroundColor: 'transparent',
        },
        buttonContainer2: {
            flexDirection  : 'row',
            justifyContent : 'center',
            marginBottom   : 10,
            backgroundColor: 'transparent',
        },
        bubble1         : {
            flex             : 0.5,
            backgroundColor  : 'rgba(255,255,255,0.7)',
            paddingHorizontal: 18,
            paddingVertical  : 12,
            borderRadius     : 20,
            marginStart      : 10,
            marginEnd        : 10
        },
        bubble2         : {
            flex             : 0.5,
            backgroundColor  : 'rgba(255,255,255,0.7)',
            paddingHorizontal: 18,
            paddingVertical  : 12,
            borderRadius     : 20,
            marginStart      : 10,
            marginEnd        : 10
        },
        bubble3         : {
            backgroundColor  : 'rgba(255,255,255,0.7)',
            paddingHorizontal: 18,
            paddingVertical  : 12,
            borderRadius     : 20,
            marginStart      : 10,
            marginEnd        : 10
        },
    });

export default GoogleMapScreen;


