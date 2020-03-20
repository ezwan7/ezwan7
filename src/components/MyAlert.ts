
export class MyAlert {
    static dropDown: any;
    static onClose: any;

    static setDropDown(dropDown: any) {
        this.dropDown = dropDown;
    }

    static show(type: any, title: any, message: any, payload: any, interval: any) {
        if (this.dropDown) {
            this.dropDown.alertWithType(type, title, message);
        }
    }

    static setOnClose(onClose: any) {
        this.onClose = onClose;
    }

    static invokeOnClose() {
        if (typeof this.onClose === 'function') {
            this.onClose();
        }
    }
}
// import {AlertHelper} from "../components/DropDownAlert";
// import DropdownAlert from "react-native-dropdownalert";
// AlertHelper.show('info', 'Info', 'Looks good!!', { message: 'HelloWorld', source: ReactNativeLogo }, 3000);

/*<DropdownAlert
    // defaultContainer={{ padding: 8, paddingTop: StatusBar.currentHeight, flexDirection: 'row' }}
    inactiveStatusBarStyle="dark-content"
    inactiveStatusBarBackgroundColor="transparent"
    translucent={true}
    ref={ref => AlertHelper.setDropDown(ref)}
    onClose={() => AlertHelper.invokeOnClose()}
/>*/

// AlertHelper.setOnClose(() => { alert('Hi, I am onClose') });


// DropDownHolder.alert('error', 'Title', 'error message');
// DropDownHolder.dropDown.alertWithType('error', 'Error', 'Error message');
// DropDownAlert.alert('error', 'Error', 'ErrorMessage');

/*export class DropDownHolder {
    static dropDown;

    static setDropDown(dropDown) {
        this.dropDown = dropDown;
    }

    static getDropDown() {
        return this.dropDown;
    }
}*/

/*type AlertType = 'info' | 'warn' | 'error' | 'success'

export type DropdownType = {
    alertWithType: (type: AlertType, title: string, message: string) => void
}

export class DropDownHolder {
    static dropDown: DropdownType

    static setDropDown(dropDown: DropdownType) {
        this.dropDown = dropDown
    }

    static alert(type: AlertType, title: string, message: string) {
        this.dropDown.alertWithType(type, title, message)
    }
}*/

/*let dropDownAlert: any;

function setDropDownAlert(ref: any) {
    dropDownAlert = ref;
}

function alert(type: string, title: string, message: string) {
    dropDownAlert.alertWithType(type, title, message);
}

export default {
    dropDownAlert,
    alert,
    setDropDownAlert,
}*/

