import {ActivityIndicator, Modal, View, Text} from "react-native";
import {Component} from "react";

class CustomProgressBar extends Component<{ visible: any }> {
    render() {
        let {visible} = this.props;
        return (
            <Modal onRequestClose = {() => null}
                   visible = {visible}>
                <View style = {{flex: 1, backgroundColor: '#dcdcdc', alignItems: 'center', justifyContent: 'center'}}>
                    <View style = {{borderRadius: 10, backgroundColor: 'white', padding: 25}}>
                        <Text style = {{fontSize: 20, fontWeight: '200'}}>Loading</Text>
                        <ActivityIndicator size = "large"/>
                    </View>
                </View>
            </Modal>
        );
    }
}
