import {MyConstant} from "../common/MyConstant";

const initialState: any = [];

const types = {
    SAVE_NOTIFICATION  : "SAVE_NOTIFICATION",
    PUSH_NOTIFICATION  : "PUSH_NOTIFICATION",
    REMOVE_NOTIFICATION: "REMOVE_NOTIFICATION",
    EMPTY_NOTIFICATION : "EMPTY_NOTIFICATION",
}

export const notificationSave = (item: any, dataSetType: string) => {
    return {
        type   : types.SAVE_NOTIFICATION,
        payload: {item, dataSetType},
    }
}

export const notificationEmpty = () => {
    return {
        type   : types.EMPTY_NOTIFICATION,
        payload: null,
    }
}

const NotificationReducer = (state: any = initialState, action: any) => {
    switch (action.type) {

        case types.SAVE_NOTIFICATION:
            let data: any = [];
            switch (action.payload.dataSetType) {
                case MyConstant.DataSetType.addToEnd:
                    data = state.concat(data);
                    break;
                case MyConstant.DataSetType.addToStart:
                    data = (data.concat(state));
                    break;
                case MyConstant.DataSetType.addToEndUnique:
                    // const newData = notification.concat(data.filter(({id}: any) => !notification.find((f: any) => f.id == id)));
                    const newData1: any = state;
                    for (let i = 0; i < data.length; i++) {
                        if (state.some((item: any) => item?.id === data[i]?.id) === false) {
                            newData1.push(data[i]);
                        }
                    }
                    data = newData1;
                    break;
                case MyConstant.DataSetType.addToStartUnique:
                    const newData2: any = state;
                    for (let i = 0; i < data.length; i++) {
                        if (state.some((item: any) => item?.id === data[i]?.id) === false) {
                            newData2.unshift(data[i]);
                        }
                    }
                    data = newData2;
                    break;
                case MyConstant.DataSetType.fresh:
                default:
                    data = action.payload.item;
                    break;
            }

            return data;

        case types.EMPTY_NOTIFICATION:
            return initialState;

        default:
            return state;
    }
}

export default NotificationReducer;

