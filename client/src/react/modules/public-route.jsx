import React, {Component} from 'react';
import {Route, Redirect} from  'react-router-dom';

function logged (props) {
    return false
}

const PublicRoute= ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            !logged(props) ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: "/",
                        state: { from: props.location }
                    }}
                />
            )
        }
    />
);

const mapStateToProps = (state) => {
    return {
        login: state.login,
    };
};

import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
export default PublicRoute