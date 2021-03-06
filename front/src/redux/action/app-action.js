import {DISABLE_FIELD, ENABLE_FIELD, LOAD_USER, UPDATE_PROFILE, USER_ERROR} from "./types-action";
import env from "../../env";

export const updateProfileAction = (prev, id, i) => dispatch => {
    dispatch({
        ...prev,
        type: UPDATE_PROFILE,
        profileId: id,
        i: i,
    });
};

const imgCase = (prev, body, name, dispatch) =>  {
    let data = new FormData();
    data.append('file', body.file);
    let init = {
        method: "POST",
        body: data,
        headers : {
            'Authorization': localStorage.getItem('jwt'),
        },
    };
    fetch(env.api + '/img/' + name, init)
        .then(res => {
                switch (res.status) {
                    case 201:
                        res.json().then(json =>{
                        });
                        break;
                    case 200:
                        res.json().then(data =>{
                            dispatch({
                                ...prev,
                                type: LOAD_USER,
                                user: data.user.Properties,
                                tagList: data.tagList,
                            });
                        });
                        break;
                    default:
                        break
                }
            }
        )
};

export const userModifyAction = (prev, body, name) => dispatch => {
    if (Object.keys(body)[0] === 'file') {
        imgCase(prev, body, name, dispatch);
    } else {
        const jsonBody = JSON.stringify(body);
        let init = {
            method: 'PUT',
            headers: {
                'Authorization': localStorage.getItem('jwt'),
            },
            body: jsonBody,
        };
        fetch(env.api + '/user/' + name, init)
            .then(res => {
                    switch (res.status) {
                        case 201:
                            res.json().then(json =>{
                                    if (env.debug) {
                                        console.log(json);
                                    }
                                dispatch({
                                    ...prev,
                                    type: USER_ERROR,
                                    error: true,
                                    errMessage: json.err,
                                });
                                setTimeout(() => { dispatch({
                                    ...prev,
                                    type: DISABLE_FIELD,
                                    error: false,
                                    done: false,
                                })}, 3000)
                            });
                            break;
                        case 200:
                            res.json().then(data =>{
                                dispatch({
                                    ...prev,
                                    type: LOAD_USER,
                                    user: data.user.Properties,
                                    tagList: data.tagList,
                                    userTags: data.userTags,
                                });
                            });
                            break;
                        default:
                            break;
                    }
                }
            )
    }

};

export const userAction = (prev) => dispatch => {
    let init = {
        method: 'GET',
        headers:{
            'Authorization': localStorage.getItem('jwt'),
        }
    };
    fetch(env.api + '/user', init)
        .then(res => {
                switch (res.status) {
                    case 201:
                        break;
                    case 202:
                        break;
                    case 203:
                        break;
                    case 204:
                        break;
                    case 200:
                        res.json().then(data => {
                            dispatch({
                                ...prev,
                                type: LOAD_USER,
                                user: data.user.Properties,
                                tagList: data.tagList,
                                userTags: data.userTags,
                            });
                        });
                        break;
                    default:
                        break;
                }
            }
        )
};

export const enableFieldAction = (prev, field) => dispatch => {
    dispatch({
        ...prev,
        type: ENABLE_FIELD,
        field: field,
    });
};

export const disableFieldAction = (prev) => dispatch => {
    dispatch({
        ...prev,
        type: DISABLE_FIELD,
    });
};
