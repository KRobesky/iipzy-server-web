import React from "react";
//import Spinner from "react-bootstrap/Spinner";
import Joi from "joi";
import Button from "@material-ui/core/Button";
//import Tooltip from "@material-ui/core/Tooltip";

import Defs from "iipzy-shared/src/defs";

import Navigator from "./navigator";
import Input from "./input";
import SpinnerPopup from "./spinnerPopup";

let app = null;

class UserForm extends React.Component {
  constructor(props) {
    super(props);

    console.log("UserForm.constructor");

    this.state = {
      errors: {},
      count: 0
      // showPopup: false
    };

    this.data = {
      userName: null,
      emailAddress: null,
      mobilePhoneNo: null,
      password: null,
      password2: null
    };

    app = this;

    this.schema = {
      userName: Joi.string()
        .required()
        .label("User Name")
        .min(5)
        .max(50),
      emailAddress: Joi.string()
        .required()
        .label("Email Address")
        .email(),
      mobilePhoneNo: Joi.string()
        .required()
        .label("Mobile Phone Number")
        .regex(/^\d{3}-\d{3}-\d{4}$/)
        .error(errors => {
          return {
            message: "Phone number must be of the form 123-456-7890"
          };
        }),
      password: Joi.string()
        .required()
        .label("Password")
        .min(5)
        .max(50),
      password2: Joi.string()
        .required()
        .label("Password Again")
        .min(5)
        .max(50)
    };
  }

  validateProperty(name, value) {
    console.log(
      "UserForm.validateProperty: name=" + name + ", value = " + value
    );
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);

    console.log("UserForm.validateProperty - had error = " + error);

    return error ? error.details[0].message : null;
  }

  validate() {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.data, this.schema, options);
    if (!error) return null;

    console.log("UserForm.validate - had error");

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  }

  componentDidMount() {
    console.log("UserForm.componentDidMount");

    this.data = this.props.getUserData();

    const count = this.state.count + 1;
    this.setState({ count });
  }

  componentWillUnmount() {
    console.log("UserForm.componentWillUnmount");

    this.props.setUserData(this.data);
  }

  isValidUserName() {
    return this.data.userName != null && this.data.userName.length > 5;
  }

  isValidMobilePhoneNo() {
    return (
      this.data.mobilePhoneNo != null && this.data.mobilePhoneNo.length > 9
    );
  }

  isValidEmailAddress() {
    return this.data.emailAddress != null && this.data.emailAddress.length > 5;
  }

  isValidPassword() {
    return this.data.password != null && this.data.password.length > 5;
  }

  getButton1Label() {
    return this.props.button1Label;
  }

  getButton2Label() {
    return this.props.button2Label;
  }

  isValidInput() {
    return (
      this.props.getButtonsEnabled() &&
      this.isValidUserName() &&
      this.isValidMobilePhoneNo() &&
      this.isValidEmailAddress() &&
      this.isValidPassword() &&
      this.data.password === this.data.password2
    );
  }

  handleChange(ev) {
    const name = ev.target.name;
    const value = ev.target.value;

    console.log(
      "UserForm.handleChange: name = " + name + ", value = " + this.data[name]
    );

    const errors = this.state.errors;
    const errorMessage = this.validateProperty(name, value);
    if (errorMessage) errors[name] = errorMessage;
    else delete errors[name];

    const data = this.data;
    data[name] = value;

    this.setState({ data, errors });
  }

  handlePassword2Change(ev) {
    const name = ev.target.name;
    const value = ev.target.value;

    console.log(
      "UserForm.handlePassword2Change: name=" +
        name +
        ", value=" +
        this.data[name]
    );

    if (this.data.password !== value) {
      const errors = this.state.errors;
      errors[name] = "passwords don't match";

      const data = this.data;
      data[name] = value;

      this.setState({ data, errors });

      return;
    }

    return this.handleChange(ev);
  }

  handleButtonClick(ev) {
    console.log("UserForm.handleButtonClick");
    console.log("userName=" + this.data.userName);
    console.log("mobilePhoneNo=" + this.data.mobilePhoneNo);
    console.log("emailAddress=" + this.data.emailAddress);

    ev.preventDefault();

    const errors = this.validate();

    if (errors)
      console.log(
        "UserForm.handleButtonClick: errors = " + Object.values(errors)
      );

    this.setState({ errors: errors || {} });
    if (errors) return;

    this.props.setButtonsEnabled(false);

    this.props.onSubmit(this.data);
  }

  handleButton2Click(ev) {
    this.props.setButtonsEnabled(false);

    this.props.onSubmit2(this.data);
  }

  renderInput(
    name,
    label,
    type = "text",
    autofocus = false,
    disabled = false,
    onChange = null
  ) {
    const { errors } = this.state;
    const data = this.data;

    const onChange_ = this.handleChange;

    return (
      <Input
        type={type}
        name={name}
        label={label}
        value={data[name]}
        error={errors[name]}
        autofocus={autofocus}
        disabled={disabled}
        onChange={onChange}
      />
    );
  }

  render() {
    console.log("UserForm.render");

    const buttonsEnabled = this.props.getButtonsEnabled();
    const button1MarginRight = this.props.onSubmit2 ? 20 : 0;
    const showSpinner = !buttonsEnabled;

    return (
      <div>
        <Navigator />
        <div style={{ marginLeft: 20, textAlign: "left" }}>
          <p style={{ fontSize: "140%" }}>{this.props.title}</p>
        </div>
        {showSpinner && <SpinnerPopup />}
        {this.renderInput(
          "userName",
          "User Name",
          "text",
          true,
          this.props.userNameDisabled,
          ev => this.handleChange(ev)
        )}
        {this.renderInput(
          "emailAddress",
          "Email Address",
          "text",
          false,
          !this.isValidUserName(),
          ev => this.handleChange(ev)
        )}
        {this.renderInput(
          "mobilePhoneNo",
          "Mobile Phone Number",
          "text",
          false,
          !this.isValidEmailAddress(),
          ev => this.handleChange(ev)
        )}
        {this.renderInput(
          "password",
          "Password",
          "password",
          false,
          !this.isValidMobilePhoneNo(),
          ev => this.handleChange(ev)
        )}
        {this.renderInput(
          "password2",
          "Password Again",
          "password",
          false,
          !this.isValidPassword(),
          ev => this.handlePassword2Change(ev)
        )}
        <table align="center">
          <tbody>
            <tr>
              <td>
                <div
                  style={{
                    textAlign: "center",
                    marginRight: button1MarginRight
                  }}
                >
                  <Button
                    type="button"
                    variant="contained"
                    disabled={!this.isValidInput()}
                    style={{
                      width: "130px",
                      color: "#0000b0"
                    }}
                    autoFocus
                    onClick={ev => this.handleButtonClick(ev)}
                  >
                    {this.getButton1Label()}
                  </Button>
                </div>
              </td>
              {this.props.onSubmit2 && (
                <td>
                  <div style={{ textAlign: "center", marginLeft: 20 }}>
                    <Button
                      type="button"
                      variant="contained"
                      disabled={!buttonsEnabled}
                      style={{
                        width: "130px",
                        color: "#0000b0"
                      }}
                      autoFocus
                      onClick={ev => this.handleButton2Click(ev)}
                    >
                      {this.getButton2Label()}
                    </Button>
                  </div>
                </td>
              )}
            </tr>
            {/*             <tr>
              {showSpinner ? (
                <td>
                  <div style={{ marginLeft: "-60px" }}>
                    <Spinner animation="border" role="status">
                      <span className="sr-only">Loading...</span>
                    </Spinner>
                  </div>
                </td>
              ) : null}
            </tr> */}
          </tbody>
        </table>
      </div>
    );
  }
}

export default UserForm;
