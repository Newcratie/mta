import {LOAD_PEOPLE} from "../action/types-action";

const initial = () => {

};

export function peopleReducer (state = initial, action) {
    switch (action.type) {
        case LOAD_PEOPLE:
            console.log("load people reducers");
            return ({
                data: action.data,
                filters: action.filters,
                isLoading: false,
                done: true,
            });
        default:
            return state
    }
}
