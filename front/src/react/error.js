import React, {Component} from "react";
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";

class Error401 extends Component{
    redirect (props) {
        setTimeout(function () {
            props.history.push('/');
        }, 2000)
    }
    render() {
        return (
            <React.Fragment>
                <h3>You are not authorized</h3>
                <h4>...Redirecting</h4>
                {this.redirect(this.props)}
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, null)(Error401))
