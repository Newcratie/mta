import React from "react";
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import {
    Segment,
    Container,
    Header,
    Button,
    Grid,
    Icon,
    Image, Message,
} from 'semantic-ui-react';
import {distance, getAge, report, timeSince} from "./modules/utils";
import {block, dislike, like} from "../redux/action/types-action";
import env from "../env";

const Online = (props) => (
    <>
        {props.online ? (
            <div style={{display: "inline"}}>
                <p><Icon name={"circle"} color={'teal'}/> Online</p>
            </div>
        ) : (
            <>
                <p>Last seen: {timeSince(props.lastConn)} ago</p>
            </>
        )}
    </>
);

class Suitor extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            loaded: true,
            profile : props.suitor.Properties,
            action : false,
        };
        this.do = this.do.bind(this);
        this.report = this.report.bind(this);
    }
    componentDidMount() {
        const url = "ws://localhost:8181/api/online/websocket/" + this.props.suitor.NodeIdentity;
        const socket = new WebSocket(url);
        const self = this;
        socket.onopen = () => {
            socket.onmessage = ({data}) => {
                data = JSON.parse(data);
                self.setState({
                    profile: {...self.state.profile, online: data}
                });
            };
        };
        this.setState({socket: socket})
    }
    componentWillUnmount() {
        if(this.state.socket) {
            this.state.socket.close()
        }
    }
    action = (id, action) => {
        let init = {
            method: 'PUT',
            body: {},
            headers:{
                'Authorization': localStorage.getItem('jwt'),
            }
        };
        fetch(env.api + '/people/' + id + "/" + action, init);
        setTimeout(() => {
            this.setState({action : false});
            this.props.next();
        }, 300);
    };
    do = (action) => {
        this.setState({action : true});
        setTimeout(() => {
            this.action(this.props.suitor.NodeIdentity, action)
        }, 600)
    };
    report (e, username) {
        report(username)
    }
    render () {
        const profile = this.props.suitor.Properties;
        return (
            this.state.loaded ? (
                <Container className={"profile"}>
                    <Grid>
                        <Grid.Column mobile={16} tablet={16} computer={16}>
                            <Segment>
                                <Grid>
                                    <Grid.Column  style={{padding: "3px"}} mobile={4} tablet={1} computer={2}>
                                        <Button onClick={this.props.toggle}><Icon name={'search'}/></Button>
                                    </Grid.Column>
                                    <Grid.Column style={{padding: "3px"}} mobile={16} tablet={6} computer={5}>
                                        <p>{profile.ilike ? "Vous a déjà liké" : ""}</p>
                                    </Grid.Column>
                                    <Grid.Column  style={{padding: "3px"}} mobile={16} tablet={6} computer={5}>
                                        <Header as={"h3"}>Score {profile.rating}/100</Header>
                                    </Grid.Column>
                                    <Grid.Column  style={{padding: "3px"}} mobile={12} tablet={3} computer={4}>
                                        <Online online={profile.online} lastConn={profile.last_conn}/>
                                    </Grid.Column>
                                </Grid>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={8} computer={4}>
                            <Image circular size={"medium"} src={profile.img1} />
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={8} computer={8}>
                            <Segment>
                                <Grid>
                                    <Grid.Row mobile={16} tablet={16} computer={16}>
                                        <Grid.Column mobile={16} tablet={8} computer={8}>
                                            <Header as={"h2"}>{profile.name}</Header>
                                        </Grid.Column>
                                        <Grid.Column mobile={16} tablet={4} computer={5}>
                                            <Header as={"h3"}>{profile.firstname} {profile.lastname}</Header>
                                        </Grid.Column>
                                        <Grid.Column mobile={16} tablet={4} computer={3}>
                                            <Header as={"h4"}>{getAge(profile.birthday)} years</Header>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row mobile={16} tablet={16} computer={16}>
                                        <p>{Math.round(distance(this.props.app.user.latitude, this.props.app.user.longitude, profile.latitude, profile.longitude, "K"))} km</p>
                                    </Grid.Row>
                                    <Grid.Row mobile={16} tablet={16} computer={16}>
                                        {this.state.action ?
                                            <Message floating>Done!</Message> :
                                            <Button.Group fluid>
                                                <Button
                                                    disabled={profile.relation === block}
                                                    color={"red"}
                                                    onClick={() => this.do(block)}
                                                ><Icon name={"ban"}/></Button>
                                                <Button.Or />
                                                <Button
                                                    disabled={profile.relation === dislike}
                                                    color={"yellow"}
                                                    onClick={() => this.do(dislike)}
                                                ><Icon name={"thumbs down"}/></Button>
                                                <Button.Or />
                                                <Button
                                                    disabled={profile.relation === like}
                                                    color={"green"}
                                                    onClick={() => this.do(like)}
                                                ><Icon name={"heart"}/></Button>
                                            </Button.Group>
                                        }
                                    </Grid.Row>
                                    <Grid.Row mobile={16} tablet={16} computer={16}>
                                        <Grid.Column mobile={16} tablet={8} computer={8}>
                                            <Header as={"h3"}>{profile.genre}</Header>
                                        </Grid.Column>
                                        <Grid.Column mobile={16} tablet={4} computer={5}>
                                            <Header as={"h3"}>{profile.interest} </Header>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={8} computer={4}>
                            <p>{profile.biography}</p>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={8} computer={4}>
                            {profile.tags.map(tag => (
                                <p key={tag}>#{tag}</p>
                            ))}
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={16} computer={16}>
                            <Segment>
                                <Grid>
                                    <Grid.Column mobile={16} tablet={8} computer={4}>
                                        <Image size={"big"} src={profile.img2} />
                                    </Grid.Column>
                                    <Grid.Column mobile={16} tablet={8} computer={4}>
                                        <Image size={"big"} src={profile.img3} />
                                    </Grid.Column>
                                    <Grid.Column mobile={16} tablet={8} computer={4}>
                                        <Image size={"big"} src={profile.img4} />
                                    </Grid.Column>
                                    <Grid.Column mobile={16} tablet={8} computer={4}>
                                        <Image size={"big"} src={profile.img5} />
                                    </Grid.Column>
                                </Grid>
                            </Segment>
                        </Grid.Column>
                    </Grid>
                    <Segment>
                        <Button onClick={e => this.report(e, profile.username)} fluid color={"red"} >Signaler le profil</Button>
                    </Segment>
                </Container>
            ):(null)
        )
    }
}

const mapStateToProps = (state) => {
    return {
        login: state.login,
        app: state.app,
        people: state.people,
    };
};

export default withRouter(connect(mapStateToProps)(Suitor))
