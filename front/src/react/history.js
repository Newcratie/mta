import React from "react";
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import {Container, Segment} from "semantic-ui-react";
import env from "../env";

class Comp extends React.Component {
    constructor (props) {
        super(props);
        this.state = {events: []};
        let init = {
            method: 'GET',
            headers:{
                'Authorization': localStorage.getItem('jwt'),
            }
        };
        fetch(env.api + '/events/history/' + this.props.login.id , init)
            .then(res => {
                    switch (res.status) {
                        case 201:
                            break;
                        case 202:
                            localStorage.removeItem('jwt');
                            res.json().then(json =>{
                            });
                            break;
                        case 200:
                            res.json().then(data => {
                                this.setState({
                                    events: data
                                })
                            });
                            break;
                        default:
                            break;
                    }
                }
            )
    }
    render () {
        return (
            <Container>
                <Segment>
                {this.state.events.map((e, i) => (
                       <div key={i}>{e.message}</div>
                ))}
                </Segment>
            </Container>
            )
    }
}

const mapStateToProps = (state) => {
    return {
        login: state.login,
        people: state.people,
    };
};

export default withRouter(connect(mapStateToProps)(Comp))
