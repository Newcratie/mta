import React, { Component } from 'react';
import './MessageList.css';
import {withRouter} from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import {
    Input,
    Button,
    Grid,
} from 'semantic-ui-react';
import {incrementMessageAction} from "../../../redux/action/messenger-action";


class MessageInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            new: "",
        };
        this.send = this.send.bind(this);
        this.keyDown = this.keyDown.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    keyDown = (e) => {
        if (e.key === 'Enter') {
            this.send(e);
        }
    };
    send = (e) => {
        if (/\S/.test(this.state.new)) {
            const token = localStorage.getItem('jwt');
            const msg = {
                id: this.props.messenger.i + 1,
                token: token,
                msg: this.state.new,
                author: this.props.login.id,
                timestamp: new Date().getTime(),
                to: this.props.messenger.suitorId,
            };
            const json = JSON.stringify(msg);
            this.props.messenger.ws.send(json);
            this.props.dispatch(incrementMessageAction(this.props.messenger));
            this.setState({new: ""});
        }
    };
    handleChange = (e, data) => {
        this.setState({[data.name]: data.value});
    };
    render() {
        return(
            <Grid
                style={{
                    position:"fixed",
                    bottom: "0px",
                    width: "100%",
                }}
            >
                <Grid.Column>
                    <Button
                        style={{
                            position:"fixed",
                            bottom: "0px",
                            left: "0px",
                            width: "14%",
                        }}
                        icon={"caret left"}
                        onClick={e => this.props.toConvList(e)}
                    />
                </Grid.Column>
                <Grid.Column>
                    <Input
                        style={{
                            position:"fixed",
                            bottom: "0px",
                            width: "86%",
                            right: "0px",
                        }}
                        fluid
                        placeholder='Write your message here...'
                        type={"text"}
                        name={"new"}
                        value={this.state.new}
                        onChange={this.handleChange}
                        onKeyDown={e => this.keyDown(e)}
                        autoComplete={'off'}
                        label={{
                            color: "blue",
                            icon: "send",
                            onClick: e => this.send(e),
                            position: "right"
                        }}
                        labelPosition='right'
                    />
                </Grid.Column>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        people: state.people,
        login: state.login,
        messenger: state.messenger,
    };
};

export default withRouter(connect(mapStateToProps)(MessageInput))