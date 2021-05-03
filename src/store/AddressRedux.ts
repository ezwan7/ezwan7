import {MyConstant} from "../common/MyConstant";

const initialState: any = [];

const types = {
    SAVE_ADDRESS  : "SAVE_ADDRESS",
    PUSH_ADDRESS  : "PUSH_ADDRESS",
    REMOVE_ADDRESS: "REMOVE_ADDRESS",
    EMPTY_ADDRESS : "EMPTY_ADDRESS",
}

export const addressSave = (item: any, dataSetType: string) => {
    return {
        type   : types.SAVE_ADDRESS,
        payload: {item, dataSetType},
    }
}

export const addressEmpty = () => {
    return {
        type   : types.EMPTY_ADDRESS,
        payload: null,
    }
}

const AddressReducer = (state: any = initialState, action: any) => {
    switch (action.type) {

        case types.SAVE_ADDRESS:
            let data: any = [];
            switch (action.payload.dataSetType) {
                case MyConstant.DataSetType.addToEnd:
                    data = state.concat(data);
                    break;
                case MyConstant.DataSetType.addToStart:
                    data = (data.concat(state));
                    break;
                case MyConstant.DataSetType.addToEndUnique:
                    // const newData = address.concat(data.filter(({id}: any) => !address.find((f: any) => f.id == id)));
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

        case types.EMPTY_ADDRESS:
            return initialState;

        default:
            return state;
    }
}

export default AddressReducer;

