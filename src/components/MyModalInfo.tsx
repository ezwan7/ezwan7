import React, {useState} from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from "react-native";
import PropTypes from "prop-types";
import {MyStyle, MyStyleSheet} from "../common/MyStyle";

let renderCount = 0;

export const MyModalInfo = ({props}: any) => {

    if (__DEV__) {
        renderCount += 1;
        console.log(`LOG: ${MyModalInfo.name}. renderCount: `, {renderCount, props});
    }

    const [modalVisible, setModalVisible] = useState(props?.visible);

    const onError = (error: any) => {
        // console.log(`LOG: ${MyFastImage.name}. onError: `, error);
    }

    return (
        <Modal
            animationType = "slide"
            transparent = {true}
            visible = {modalVisible}
            onRequestClose = {() => {
            }}
        >
            <View style = {styles.centeredView}>
                <View style = {styles.modalView}>
                    <Text style = {styles.modalText}>Hello World!</Text>

                    <TouchableHighlight
                        style = {{...styles.openButton, backgroundColor: "#2196F3"}}
                        onPress = {() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <Text style = {styles.textStyle}>Hide Modal</Text>
                    </TouchableHighlight>
                </View>
            </View>
        </Modal>
    )
}

MyModalInfo.propTypes    = {
    source    : PropTypes.array,
    resizeMode: PropTypes.string,
    style     : PropTypes.object,
    onError   : PropTypes.func,
}
MyModalInfo.defaultProps = {
    source    : [],
    resizeMode: null,
    style     : {},
    onError   : null,
}
const styles             = StyleSheet.create(
    {
        centeredView: {
            flex          : 1,
            justifyContent: "center",
            alignItems    : "center",
            marginTop     : 22
        },
        modalView   : {
            margin         : 20,
            backgroundColor: "white",
            borderRadius   : 20,
            padding        : 35,
            alignItems     : "center",
            shadowColor    : "#000",
            shadowOffset   : {
                width : 0,
                height: 2
            },
            shadowOpacity  : 0.25,
            shadowRadius   : 3.84,
            elevation      : 5
        },
        openButton  : {
            backgroundColor: "#F194FF",
            borderRadius   : 20,
            padding        : 10,
            elevation      : 2
        },
        textStyle   : {
            color     : "white",
            fontWeight: "bold",
            textAlign : "center"
        },
        modalText   : {
            marginBottom: 15,
            textAlign   : "center"
        }
    });
