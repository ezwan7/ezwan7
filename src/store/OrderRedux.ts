import {MyConstant} from "../common/MyConstant";

const initialState: any = [];

const types = {
    SAVE_ORDER  : "SAVE_ORDER",
    PUSH_ORDER  : "PUSH_ORDER",
    REMOVE_ORDER: "REMOVE_ORDER",
    EMPTY_ORDER : "EMPTY_ORDER",
}

export const orderSave = (item: any, dataSetType: string) => {
    return {
        type   : types.SAVE_ORDER,
        payload: {item, dataSetType},
    }
}

export const orderEmpty = () => {
    return {
        type   : types.EMPTY_ORDER,
        payload: null,
    }
}

const OrderReducer = (state: any = initialState, action: any) => {
    switch (action.type) {

        case types.SAVE_ORDER:
            let data: any = [];
            switch (action.payload.dataSetType) {
                case MyConstant.DataSetType.addToEnd:
                    data = state.concat(data);
                    break;
                case MyConstant.DataSetType.addToStart:
                    data = (data.concat(state));
                    break;
                case MyConstant.DataSetType.addToEndUnique:
                    // const newData = order.concat(data.filter(({id}: any) => !order.find((f: any) => f.id == id)));
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

        case types.EMPTY_ORDER:
            return initialState;

        default:
            return state;
    }
}

export default OrderReducer;

