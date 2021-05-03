import {MyConstant} from "../common/MyConstant";

const initialState: any = [];

const types = {
    SAVE_CATEGORY  : "SAVE_CATEGORY",
    PUSH_CATEGORY  : "PUSH_CATEGORY",
    REMOVE_CATEGORY: "REMOVE_CATEGORY",
    EMPTY_CATEGORY : "EMPTY_CATEGORY",
}

export const categorySave = (item: any, dataSetType: string) => {
    return {
        type   : types.SAVE_CATEGORY,
        payload: {item, dataSetType},
    }
}

export const categoryEmpty = () => {
    return {
        type   : types.EMPTY_CATEGORY,
        payload: null,
    }
}

const CategoryReducer = (state: any = initialState, action: any) => {
    switch (action.type) {

        case types.SAVE_CATEGORY:
            let data: any = [];
            switch (action.payload.dataSetType) {
                case MyConstant.DataSetType.addToEnd:
                    data = state.concat(data);
                    break;
                case MyConstant.DataSetType.addToStart:
                    data = (data.concat(state));
                    break;
                case MyConstant.DataSetType.addToEndUnique:
                    // const newData = category.concat(data.filter(({id}: any) => !category.find((f: any) => f.id == id)));
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

        case types.EMPTY_CATEGORY:
            return initialState;

        default:
            return state;
    }
}

export default CategoryReducer;

