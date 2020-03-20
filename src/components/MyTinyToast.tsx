import React, {Component} from 'react';
import RootSiblings from 'react-native-root-siblings';
// import ToastContainer, {position, duration} from './MyTinyToastContainer'
/*
class Toast extends Component {
    static propTypes = ToastContainer.propTypes;
    static position  = position;
    static duration  = duration;

    static showSuccess(message: any, options: any = {}) {
        this.show(message, {
            containerStyle: {
                minWidth       : 105,
                minHeight      : 105,
                backgroundColor: 'rgba(30,30,30,.85)'
            },
            imgStyle      : {
                width : 45,
                height: 45
            },
            textStyle     : {
                marginTop: 10
            },
            position      : this.position.CENTER,
            imgSource     : require("../../src/images/logo_1024_colored.png"),
            ...options
        })
    }

    static showLoading(message: any, options = {}) {
        this.show(message, {
            containerStyle: {
                minWidth       : 90,
                minHeight      : 80,
                backgroundColor: 'rgba(30,30,30,.85)'
            },
            textStyle     : {
                fontSize: 14,
                top     : 6
            },
            mask          : true,
            duration      : 0,
            loading       : true,
            position      : this.position.CENTER,
            ...options
        })
    }

    static show(message: any, options: any = {}) {
        let onHidden     = options.onHidden;
        let toast: any;
        options.onHidden = () => {
            toast && toast.destroy()
            onHidden && onHidden()
        }
        toast            = new RootSiblings(
            <ToastContainer
                {...options}
                visible = {true}
                showText = {!!message}>
                {message}
            </ToastContainer>)
        this.toast       = toast;
        return toast;
    }

    static hide(toast: any) {
        if (toast instanceof RootSiblings) {
            toast.destroy()
        } else if (this.toast instanceof RootSiblings) {
            this.toast.destroy()
        }
    }

    toast: any = null;

    componentWillMount() {
        this.toast = new RootSiblings(
            <ToastContainer
                {...this.props}
                duration = {0}
            />)
    };

    componentDidUpdate(nextProps: any) {
        this.toast.update(
            <ToastContainer
                {...nextProps}
                duration = {0}/>)
    }

    componentWillUnmount() {
        this.toast.destroy()
    }

    render() {
        return null
    }
}

export {
    RootSiblings as Manager
}
export default Toast
*/
