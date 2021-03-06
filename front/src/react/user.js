import React from "react";
import {withRouter} from "react-router-dom"
import {connect} from "react-redux";
import {
    Divider,
    Segment,
    Container,
    Header,
    Input,
    Button,
    Dropdown,
    TextArea,
    Form,
    Grid,
    Image,
    Label, Message,
} from 'semantic-ui-react';
import {
    disableFieldAction,
    enableFieldAction,
    userModifyAction
} from "../redux/action/app-action";
import {days, genders, interest, months, years} from "./modules/options-dates";
import AddressForm from './components/address-form';

const errorMessage = {
    position: "sticky",
    width: "100%",
    height: "10vh",
    zIndex: "10",
    top: "40px",
};

const Tags = (props) => {
    if (props.app.user.tags) {
        return (
            props.app.user.tags.map(tag => (
                <div key={tag}>
                    <p>#{tag}</p>
                </div>
            ))
        )
    } else {
        return (null)
    }
};

const formatDate = (dateStr) => {
    let date = new Date(dateStr);
    let monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
};

const fields = [
    {
        name: "username",
        title: "Username",
        view: (props) => (<p>{props.app.user[props.field.name]}</p>),
        entries: [
            {type: (hc, s) => (
                    <Grid key={"grid_username"}>
                        <Grid.Column mobile={16} tablet={6} computer={6}>
                            <Grid.Row>
                                <Header as={'h4'}>Password</Header>
                            </Grid.Row>
                            <Grid.Row>
                                <Input fluid type={'password'} key={1} onChange={hc} name={"old_password"} value={s}/>
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={5} computer={5}>
                            <Grid.Row>
                                <Header as={'h4'}>New username</Header>
                            </Grid.Row>
                            <Grid.Row>
                                <Input fluid type={'text'} key={1} onChange={hc} name={"new_username"} value={s}/>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid>
                )}
        ],
        mobile : 16,
        tablet : 16,
        computer: 16,
    },
    {
        name: "firstname",
        title: "Firstname",
        view: (props) => (<p>{props.app.user[props.field.name]}</p>),
        entries: [
            {type: (hc, s) => (<Input fluid key={1} onChange={hc} name={"firstname"} value={s}/>)}
        ],
        mobile : 16,
        tablet : 16,
        computer: 8,
    },
    {
        name: "lastname",
        title: "Lastname",
        view: (props) => (<p>{props.app.user[props.field.name]}</p>),
        entries: [
            {type: (hc, s) => (<Input fluid key={1} onChange={hc} name={"lastname"} value={s}/>)}
        ],
        mobile : 16,
        tablet : 16,
        computer: 8,
    },
    {
        name: "biography",
        title: "Biography",
        view: (props) => (<p>{props.app.user[props.field.name]}</p>),
        entries: [
            {type: (hc, s) => (
                    <Form key={"form"}>
                        <TextArea key={1} onChange={hc} name={"biography"} value={s} placeholder='Tell us who you are'  style={{ minHeight: 100 }} />
                    </Form>
                )}
        ],
        mobile : 16,
        tablet : 16,
        computer: 16,
    },
    {
        name: "email",
        title: "Email",
        view: (props) => (<p>{props.app.user[props.field.name]}</p>),
        entries: [
            {type: (hc, s) => (
                    <Grid key={"grid_email"}>
                        <Grid.Column mobile={16} tablet={6} computer={6}>
                            <Grid.Row>
                                <Header as={'h4'}>Password</Header>
                            </Grid.Row>
                            <Grid.Row>
                                <Input fluid key={1} type={'password'} onChange={hc} name={"old_password"} value={s}/>
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={5} computer={5}>
                            <Grid.Row>
                                <Header as={'h4'}>New Email</Header>
                            </Grid.Row>
                            <Grid.Row>
                                <Input fluid key={2} type={'email'} onChange={hc} name={"new_email"} value={s}/>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid>
                )}
        ],
        mobile : 16,
        tablet : 16,
        computer: 16,
    },
    {
        name: "password",
        title: "Password",
        view: () => null,
        entries: [
            {type: (hc, s) => (
                    <Grid key={"grid_password"}>
                        <Grid.Column mobile={16} tablet={6} computer={6}>
                            <Grid.Row>
                                <Header as={'h4'}>Old Password</Header>
                            </Grid.Row>
                            <Grid.Row>
                                <Input fluid key={1} type={'password'}  onChange={hc} name={"old_password"} value={s}/>
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={5} computer={5}>
                            <Grid.Row>
                                <Header as={'h4'}>New Password</Header>
                            </Grid.Row>
                            <Grid.Row>
                                <Input fluid key={2} type={'password'} onChange={hc} name={"new_password"} value={s}/>
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={5} computer={5}>
                            <Grid.Row>
                                <Header as={'h4'}>Confirm Password</Header>
                            </Grid.Row>
                            <Grid.Row>
                                <Input fluid key={3} type={'password'} onChange={hc} name={"confirm"} value={s}/>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid>
                )}
        ],
        mobile : 16,
        tablet : 16,
        computer: 16,
    },
    {
        name: "location",
        title: "Location",
        view: () => (null),
        entries: [
            {type: (hc, s, props) => (<AddressForm hc={hc} {...props} key={"address-form"}/>)},
        ],
        mobile : 16,
        tablet : 16,
        computer: 16,
    },
    {
        name: "genre",
        title: "Gender",
        view: (props) => (<p>{props.app.user[props.field.name]}</p>),
        entries: [
            {type: (hc, s, props) => (
                    <Grid.Column key={"gender"} mobile={16} tablet={16} computer={8}>
                        <Form.Select
                            fluid
                            label={props.field.title}
                            options={genders}
                            placeholder='-'
                            name={props.field.name}
                            onChange={hc}
                        />
                    </Grid.Column>
                )},
        ],
        mobile : 16,
        tablet : 16,
        computer: 8,
    },
    {
        name: "interest",
        title: "Interest",
        view: (props) => (<p>{props.app.user[props.field.name]}</p>),
        entries: [
            {type: (hc, s, props) => (
                    <Grid.Column key={"interest"} mobile={16} tablet={16} computer={8}>
                        <Form.Select
                            fluid
                            label={props.field.title}
                            options={interest}
                            placeholder='-'
                            name={props.field.name}
                            onChange={hc}
                        />
                    </Grid.Column>
                )},
        ],
        mobile : 16,
        tablet : 16,
        computer: 8,
    },
    {
        name: "birthday",
        title: "Birthday",
        view: (props) => (<p>{formatDate(props.app.user.birthday)}</p>),
        entries: [
            {type: (hc) => (
                    <Form.Group label={"Birthday"} key={"birthday"}>
                        <Form.Select
                            defaultValue={1}
                            fluid label='Day'
                            options={days}
                            placeholder='01'
                            name="day"
                            onChange={hc}
                        />
                        <Form.Select
                            defaultValue={1}
                            width={16}
                            fluid label='Month'
                            options={months}
                            placeholder='01'
                            name="month"
                            onChange={hc}
                        />
                        <Form.Select
                            defaultValue={1900}
                            fluid label='Year'
                            options={years}
                            placeholder='1900'
                            name="year"
                            onChange={hc}
                        />
                    </Form.Group>
                )}
        ],
        mobile : 16,
        tablet : 16,
        computer: 16,
    },
    {
        name: "tag",
        title: "Add a new tag",
        view: () => (null),
        entries: [
            {type: (hc, s) => (<Input fluid key={1} onChange={hc} name={"tag"} value={s}/>)}
        ],
        mobile : 16,
        tablet : 16,
        computer: 16,
    },
    {
        name: "usertags",
        title: "Tags",
        view: (props) => (<Tags {...props}/>),
        entries: [
            {type: (hc, s, props, htc) => (
                    <Grid.Column key={"tags"} mobile={16} tablet={16} computer={8}>
                        <Dropdown
                            placeholder='Tags'
                            fluid
                            search
                            multiple
                            selection
                            options={props.app.tagList}
                            value={props.state.body.tags}
                            name={props.field.name}
                            onChange={htc}
                        />
                    </Grid.Column>
                )},
        ],
        mobile : 16,
        tablet : 16,
        computer: 16,
    },
    {
        name: "img1",
        title: "Profile Image",
        view: (props) => (<View {...props}/>),
        entries: [
            {type: (hc, s, props) => (
                    <Grid.Column key={"add_tag"} mobile={16} tablet={16} computer={8}>
                        <UploadImage hfc={props.hfc}/>
                    </Grid.Column>
                )},
        ],
        mobile : 16,
        tablet : 16,
        computer: 4,
    },
    {
        name: "img2",
        title: "Image 2",
        view: (props) => (<View {...props}/>),
        entries: [
            {type: (hc, s, props) => (
                    <Grid.Column key={"add_tag"} mobile={16} tablet={16} computer={8}>
                        <UploadImage hfc={props.hfc}/>
                    </Grid.Column>
                )},
        ],
        mobile : 16,
        tablet : 16,
        computer: 4,
    },
    {
        name: "img3",
        title: "Image 3",
        view: (props) => (<View {...props}/>),
        entries: [
            {type: (hc, s, props) => (
                    <Grid.Column key={"add_tag"} mobile={16} tablet={16} computer={8}>
                        <UploadImage hfc={props.hfc}/>
                    </Grid.Column>
                )},
        ],
        mobile : 16,
        tablet : 16,
        computer: 4,
    },
    {
        name: "img4",
        title: "Image 4",
        view: (props) => (<View {...props}/>),
        entries: [
            {type: (hc, s, props) => (
                    <Grid.Column key={"add_tag"} mobile={16} tablet={16} computer={8}>
                        <UploadImage hfc={props.hfc}/>
                    </Grid.Column>
                )},
        ],
        mobile : 16,
        tablet : 16,
        computer: 4,
    },
    {
        name: "img5",
        title: "Image 5",
        view: (props) => (<View {...props}/>),
        entries: [
            {type: (hc, s, props) => (
                    <Grid.Column key={"add_tag"} mobile={16} tablet={16} computer={8}>
                        <UploadImage hfc={props.hfc}/>
                    </Grid.Column>
                )},
        ],
        mobile : 16,
        tablet : 16,
        computer: 4,
    },
];

const View = (props) => (<Image src={props.app.user[props.field.name]} size={"medium"}/>);

const UploadImage = (props) => (
    <>
        <Label
            as="label"
            basic
            htmlFor="upload"
        >
            <Button
                icon="upload"
                label={{
                    basic: true,
                    content: 'Select file(s)'
                }}
                labelPosition="right"
            />
            <input
                accept="image/x-png,image/gif,image/jpeg"
                hidden
                id="upload"
                multiple
                type="file"
                onChange={props.hfc}
            />
        </Label>
    </>
);
const Field = (props) => (
    <>
        <Segment>
            <Grid>
                <Grid.Column mobile={8} tablet={10} computer={9}>
                    <Header as={'h3'}>{props.field.title}</Header>
                </Grid.Column>
                <Grid.Column mobile={8} tablet={6} computer={7}>
                    <Button fluid onClick={e => props.modify(e, props.field.name)}>Modify</Button>
                </Grid.Column>
            </Grid>
            <Divider/>
            {props.app.field === props.field.name ?
                <>
                    {props.field.entries.map((entry) => (
                        entry.type(props.handleChange, props.field.state, props, props.htc)
                    ))}
                    <Divider/>
                    <Button fluid basic color={"green"} onClick={e => props.save(e, props.field.name)}>Save</Button>
                </>
                :
                <>
                    {props.field.view(props)}
                </>
            }
        </Segment>
    </>
);

class User extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            name: null,
            body: {
                tags: props.app.user.userTags,
            },
            done: false,
            error: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.save = this.save.bind(this);
        this.modify = this.modify.bind(this);
    }
    save = () => {
        this.props.dispatch(userModifyAction(this.props.app, this.state.body, this.state.name, this.handleChange));
    };
    modify = (e, field) => {
        this.setState({body: {tags: this.props.app.user.tags}, name: field});
        if (this.props.app.field === field) {
            this.props.dispatch(disableFieldAction(this.props.app));
        } else {
            this.props.dispatch(enableFieldAction(this.props.app, field));
        }
    };
    componentWillReceiveProps() {
        const tags = [];
        if (this.props.user) {
            this.props.app.user.userTags.map(tag => {
                tags.push(tag.key);
                return tag
            });
            this.setState({body: {tags: tags}});
        }
    }
    handleChange = (e, data) => {
        this.setState({body: {...this.state.body, [data.name]: data.value}});
    };
    handleFileChange = (e) => {
        this.setState({body: {file: e.target.files[0]}});
    };
    handleTagChange = (e, data) => {
        this.setState({body: {tags: data.value}});
    };
    error = (error, message) => {
        return (error ? <>
            <div style={errorMessage}>
                <Message color={'red'}>
                    <p>
                        {message}
                    </p>
                </Message>
            </div>
        </> : null);
    };
    render () {
        return (
            <>
                {this.error(this.props.app.error, this.props.app.errMessage)}
                <Container className={"user"}>
                    <Grid>
                        {fields.map((field) => (
                            <Grid.Column
                                key={field.name}
                                mobile={field.mobile}
                                tablet={field.tablet}
                                computer={field.computer}
                            >
                                <Field
                                    {...this.props}
                                    handleChange={this.handleChange}
                                    hfc={this.handleFileChange}
                                    htc={this.handleTagChange}
                                    save={this.save}
                                    modify={this.modify}
                                    state={this.state}
                                    field={field}
                                />
                            </Grid.Column>
                        ))}
                    </Grid>
                </Container>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        login: state.login,
        people: state.people,
        app: state.app,
    };
};

export default withRouter(connect(mapStateToProps)(User))
