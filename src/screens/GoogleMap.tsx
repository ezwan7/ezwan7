import React, {Fragment} from 'react';
import {StatusBarLight} from '../components/MyComponent';

import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid} from 'react-native';
import {Marker} from 'react-native-maps';

import {
    // SafeAreaView,
    StyleSheet,
    // ScrollView,
    View,
    Text,
    Dimensions, TouchableOpacity,
} from 'react-native';

import MyLANG from '../shared/MyLANG';
import MyUtil from '../common/MyUtil';
import {MyConstant} from '../common/MyConstant';
// import moment from 'moment';


const {width, height} = Dimensions.get('window');
const ASPECT_RATIO    = width / height;

let renderCount = 0;

class GoogleMapScreen extends React.Component {
    static navigationOptions = {
        title      : 'Google Map',
        headerShown: false,
    };

    private map: any;

    componentDidMount() {
        MyUtil.printConsole(true, 'log', 'LOG: componentDidMount: GoogleMapScreen: ', {});
        this.requestCameraPermission();
    }

    constructor(props: any) {
        super(props);
        MyUtil.printConsole(true, 'log', 'LOG: constructor: GoogleMapScreen: ', {});
    }

    state = {
        address: 'TEST',
        region : {
            latitude      : 37.78825,
            longitude     : -122.4324,
            latitudeDelta : 0.0922,
            longitudeDelta: 0.0922 * ASPECT_RATIO,
        },
    };

    requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title         : 'Cool Photo App Camera Permission',
                    message       :
                        'Cool Photo App needs access to your camera ' +
                        'so you can take awesome pictures.',
                    buttonNeutral : 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                MyUtil.printConsole(true, 'log', 'LOG: You can use the camera: ', {});
                Geolocation.getCurrentPosition(
                    (position) => {
                        MyUtil.printConsole(true, 'log', 'LOG: Geolocation.getCurrentPosition: ', {'position': position});
                        this.setState({
                            region: {
                                latitude      : position.coords.latitude,
                                longitude     : position.coords.longitude,
                                latitudeDelta : 0.0922,
                                longitudeDelta: 0.0922 * ASPECT_RATIO,
                            }
                        });
                        this.map.animateCamera({center: this.state.region});
                        /*myRegion = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0922 * ASPECT_RATIO,
                        }*/
                        // onRegionChange(region);
                    },
                    (error) => {
                        // See error code charts below.
                        MyUtil.printConsole(true, 'log', 'LOG: Geolocation.getCurrentPosition: ', {'error': error});
                    },
                    {enableHighAccuracy: true, timeout: 15000, maximumAge: 0, forceRequestLocation: true}
                );
            } else {
                MyUtil.printConsole(true, 'log', 'LOG: Camera permission denied: ', {});
            }
        } catch (err) {
            console.warn(err);
        }
    }

    onRegionChange = (region: any) => {
        this.setState({region});
        // let prevPos = {latitude: 30.420814, longitude: -120.081949};
        // let curPos = {latitude: 37.420814, longitude: -122.081949};
        // const curRot = getRotation(prevPos, curPos);
        // googleMap.animateCamera({heading: {curRot}, center: curPos, pitch: 90});
        // console.log('onRegionChange: region: ', this.state.region);
        // console.log('onRegionChange: myRegion: ', myRegion);
        MyUtil.printConsole(false, 'log', 'LOG: onRegionChange: region: ', {});
    }

    setAddress = () => {
        /*Geocoder.geocodePosition({
            lat: this.state.region.latitude,
            lng: this.state.region.longitude,
        })
            .then(res => {
                MyUtil.printConsole(false, 'log', 'LOG: Geocoder.geocodePosition: ', {'res': res});
                this.setState({address: res[0].formattedAddress});
            })
            .catch(err => {
                MyUtil.printConsole(true, 'log', 'LOG: Geocoder.geocodePosition: ', {'err': err});
                this.setState({address: 'No Address Found.'});
            })*/
    }

    render() {

        if (__DEV__) {
            renderCount += 1;
            // MyUtil.printConsole(true, 'log', `LOG: ${this.constructor.name}. renderCount: `, renderCount);
        }

        return (
            <>
                <StatusBarLight/>
                <View style={styles.container}>
                    <MapView
                        ref={el => (this.map = el)}
                        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                        style={styles.map}
                        initialRegion={this.state.region}
                        onRegionChange={this.onRegionChange}
                        onRegionChangeComplete={(region) => {
                            this.setAddress();
                        }}
                    >
                        <Marker
                            coordinate={this.state.region}
                        />
                    </MapView>
                    <View style={styles.buttonContainer2}>
                        <TouchableOpacity
                            onPress={() => this.requestCameraPermission()}
                            style={styles.bubble3}
                        >
                            <Text>{MyLANG.GetCurrentAddress}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainer1}>
                        <View style={styles.bubble1}>
                            <Text>Lat: {this.state.region.latitude.toPrecision(7)}</Text>
                        </View>
                        <View style={styles.bubble2}>
                            <Text>Long: {this.state.region.longitude.toPrecision(7)}</Text>
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={() => MyUtil.reactNavigate('Login', {}, null)}
                            style={styles.bubble}
                        >
                            <Text>{this.state.address}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </>
        );
    }
};


const getRotation = (prevPos: any, curPos: any) => {
    if (!prevPos) {
        return 0;
    }
    const xDiff = curPos.latitude - prevPos.latitude;
    const yDiff = curPos.longitude - prevPos.longitude;
    return (Math.atan2(yDiff, xDiff) * 180.0) / Math.PI;
}

const styles = StyleSheet.create({
    container       : {
        position      : 'absolute',
        top           : 0,
        left          : 0,
        right         : 0,
        bottom        : 0,
        justifyContent: 'flex-end',
        alignItems    : 'center',
    },
    map             : {
        position: 'absolute',
        top     : 0,
        left    : 0,
        right   : 0,
        bottom  : 0,
    },
    buttonContainer2: {
        flexDirection  : 'row',
        justifyContent : 'center',
        marginBottom   : 10,
        backgroundColor: 'transparent',
    },
    bubble3         : {
        backgroundColor  : 'rgba(255,255,255,0.7)',
        paddingHorizontal: 18,
        paddingVertical  : 12,
        borderRadius     : 20,
        marginStart      : 10,
        marginEnd        : 10
    },
    buttonContainer1: {
        flexDirection  : 'row',
        justifyContent : 'space-between',
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
    buttonContainer : {
        flexDirection  : 'row',
        marginBottom   : 30,
        backgroundColor: 'transparent',
    },
    bubble          : {
        flex             : 1,
        backgroundColor  : 'rgba(255,255,255,0.7)',
        paddingHorizontal: 18,
        paddingVertical  : 12,
        borderRadius     : 20,
        marginStart      : 10,
        marginEnd        : 10
    },
    latlng          : {
        width     : 200,
        alignItems: 'stretch',
    },
    button          : {
        width            : 80,
        paddingHorizontal: 12,
        alignItems       : 'center',
        marginHorizontal : 10,
        // },
        // scrollView: {
        //     backgroundColor: Colors.lighter,
        // },
        // engine: {
        //     position: 'absolute',
        //     right: 0,
        // },
        // body: {
        //     backgroundColor: Colors.white,
        // },
        // sectionContainer: {
        //     marginTop: 32,
        //     paddingHorizontal: 24,
        // },
        // sectionTitle: {
        //     fontSize: 24,
        //     fontWeight: '600',
        //     color: Colors.black,
        // },
        // sectionDescription: {
        //     marginTop: 8,
        //     fontSize: 18,
        //     fontWeight: '400',
        //     color: Colors.dark,
        // },
        // highlight: {
        //     fontWeight: '700',
        // },
        // footer: {
        //     color: Colors.dark,
        //     fontSize: 12,
        //     fontWeight: '600',
        //     padding: 4,
        //     paddingRight: 12,
        //     textAlign: 'right',
    },
});

export default GoogleMapScreen;


