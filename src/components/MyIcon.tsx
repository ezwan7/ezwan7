import React from 'react';

import AntDesignI from 'react-native-vector-icons/AntDesign'
import EntypoI from 'react-native-vector-icons/Entypo'
import EvilIconsI from 'react-native-vector-icons/EvilIcons'
import FeatherI from 'react-native-vector-icons/Feather'
import FontAwesomeI from 'react-native-vector-icons/FontAwesome'
import FontAwesome5I from 'react-native-vector-icons/FontAwesome5'
import FontistoI from 'react-native-vector-icons/Fontisto'
import FoundationI from 'react-native-vector-icons/Foundation'
import IoniconsI from 'react-native-vector-icons/Ionicons'
import MaterialIconsI from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIconsI from 'react-native-vector-icons/MaterialCommunityIcons'
import OcticonsI from 'react-native-vector-icons/Octicons'
import ZocialI from 'react-native-vector-icons/Zocial'
import SimpleLineIconsI from 'react-native-vector-icons/SimpleLineIcons'
import {MyConstant} from "../common/MyConstant";


const AntDesign              = (props: any) => <AntDesignI {...props} />
const Entypo                 = (props: any) => <EntypoI {...props} />
const EvilIcons              = (props: any) => <EvilIconsI {...props} />
const Feather                = (props: any) => <FeatherI {...props} />
const FontAwesome            = (props: any) => <FontAwesomeI {...props} />
const FontAwesome5           = (props: any) => <FontAwesome5I {...props} />
const Fontisto               = (props: any) => <FontistoI {...props} />
const Foundation             = (props: any) => <FoundationI {...props} />
const Ionicons               = (props: any) => <IoniconsI {...props} />
const MaterialIcons          = (props: any) => <MaterialIconsI {...props} />
const MaterialCommunityIcons = (props: any) => (<MaterialCommunityIconsI {...props} />)
const Octicons               = (props: any) => <OcticonsI {...props} />
const Zocial                 = (props: any) => <ZocialI {...props} />
const SimpleLineIcons        = (props: any) => <SimpleLineIconsI {...props} />

export const getMyIcon = (props: any) => {
    switch (props.fontFamily) {
        case MyConstant.VectorIcon.AntDesign:
            return (<AntDesign {...props}/>);
        case MyConstant.VectorIcon.Entypo:
            return (<Entypo {...props}/>);
        case MyConstant.VectorIcon.EvilIcons:
            return (<EvilIcons {...props}/>);
        case MyConstant.VectorIcon.Feather:
            return (<Feather {...props}/>);
        case MyConstant.VectorIcon.FontAwesome:
            return (<FontAwesome {...props}/>);
        case MyConstant.VectorIcon.FontAwesome5:
            return (<FontAwesome5 {...props}/>);
        case MyConstant.VectorIcon.Fontisto:
            return (<Fontisto {...props}/>);
        case MyConstant.VectorIcon.Foundation:
            return (<Foundation {...props}/>);
        case MyConstant.VectorIcon.Ionicons:
            return (<Ionicons {...props}/>);
        case MyConstant.VectorIcon.MaterialIcons:
            return (<MaterialIcons {...props}/>);
        case MyConstant.VectorIcon.MaterialCommunityIcons:
            return (<MaterialCommunityIcons {...props}/>);
        case MyConstant.VectorIcon.Octicons:
            return (<Octicons {...props}/>);
        case MyConstant.VectorIcon.Zocial:
            return (<Zocial {...props}/>);
        case MyConstant.VectorIcon.SimpleLineIcons:
            return (<SimpleLineIcons {...props}/>);
        default:
            return (<FontAwesome {...props}/>);
    }
}


export default {
    AntDesign,
    Entypo,
    EvilIcons,
    Feather,
    FontAwesome,
    FontAwesome5,
    Fontisto,
    Foundation,
    Ionicons,
    MaterialIcons,
    MaterialCommunityIcons,
    Octicons,
    Zocial,
    SimpleLineIcons,


    getMyIcon,
}


// import MyIcon from '../components/MyIcon';
// <MyIcon.SimpleLineIcons name='people' color={'#333333'} size={16}/>

