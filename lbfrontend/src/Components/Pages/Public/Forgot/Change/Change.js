import React, { Component } from "react";
import Page from "../../../Page";
import Input from "../../../../Common/Input/Input";
import Form from "../../../../Common/Form/Form";
import {
  passwordRegex,
  emptyRegex,
} from "../../../../Common/Validators/Validators";
import { saxios, paxios,setLocalStorage,getLocalStorage,removeLocalStorage} from "../../../../Utilities/Utilities";
import { Redirect } from "react-router-dom";
export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      newPassword: "",
      newPasswordError: null,
      confirmPassword: "",
      confirmPasswordError: null,
      data: null,
    };
    this.onClickUpdate = this.onClickUpdate.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.validate = this.validate.bind(this);
  }
  componentDidMount(){
      var {email, token} = this.props.match.params;
      if((email || token) === undefined){
          return <Redirect to="/"/>
      }
      paxios.get(`/api/user/forgotpswd/${email}/${token}`)
      .then((resp)=>{
            setLocalStorage("id",resp.data.id);
      })
      .catch((error)=>{
        alert("Ocurrio un error");
        window.location.assign("http://localhost:3001/")
      })
   // /forgotpswd/:email/:token
  }
  validate(state) {
    let nameErrors = false;
    let tmpErrors = [];
    const {newPassword, confirmPassword } = state;
    if (newPassword !== undefined) {
      tmpErrors = [];
      if (!passwordRegex.test(newPassword) || emptyRegex.test(newPassword)) {
        tmpErrors.push("Ingrese una contraseña con un formato válido");
        tmpErrors.push(
          "(Iniciar con mayúscula, contener un número, una minúscula, mínimo 8 caracteres y máximo 20)"
        );
      }
      if (tmpErrors.length) {
        nameErrors = Object.assign({}, nameErrors, {
          newPasswordError: tmpErrors.join(". "),
        });
      }
    }
    if (confirmPassword !== undefined) {
      tmpErrors = [];
      if (
        !passwordRegex.test(confirmPassword) ||
        emptyRegex.test(confirmPassword)
      ) {
        tmpErrors.push("Ingrese una contraseña con un formato válido");
        tmpErrors.push(
          "(Iniciar con mayúscula, contener un número, una minúscula, mínimo 8 caracteres y máximo 20)"
        );
      }
      if (tmpErrors.length) {
        nameErrors = Object.assign({}, nameErrors, {
          confirmPasswordError: tmpErrors.join(". "),
        });
      }
    }

    return nameErrors;
  }

  onChangeHandler(e) {
    const { name, value } = e.currentTarget;
    let errors = this.validate({ [name]: value });
    if (!errors) {
      errors = { [name + "Error"]: "" };
    }
    this.setState({
      ...this.state,
      [name]: value,
      ...errors,
    });
  }

  onClickUpdate(e) {
    e.preventDefault();
    e.stopPropagation();
    const errors = this.validate(this.state);
    if (errors) {
      this.setState({ ...this.state, ...errors });
    } else {
      const { oldPassword, newPassword, confirmPassword } = this.state;
      if (
        newPassword === "Password1" ||
        newPassword === "Password123" ||
        newPassword === "Password123456789" ||
        newPassword === "Password1234567890"
      ) {
        alert("Favor use una contraseña mas segura");
      } else if (newPassword !== confirmPassword) {
        alert("Favor revisar la contraseña nueva y su confirmación");
      } else if (oldPassword === newPassword) {
        alert(
          "Si desea cambiar la contraseña, se le pide que sea una distinta a la actual"
        );
      } else {
        const uri = `/api/user/forgotpswd`;
        paxios
          .put(uri, {
            id: getLocalStorage("id"),
            newpass: this.state.newPassword,
          })
          .then((info) => {
            alert(info.data.msg);
            window.location.assign("http://localhost:3001/")
            
          })
          .catch((err) => {
            console.log(err);
            alert("Ocurrio un Error");
            window.location.assign("http://localhost:3001/")
          });
      }
    }
  }

  render() {
    const action = "Actualizando contraseña";
    const formContent = [
      <Input
        name="newPassword"
        caption="Contraseña Nueva"
        type="password"
        value={this.state.newPassword}
        onChange={this.onChangeHandler}
        error={this.state.newPasswordError}
        className="col-s-12"
      />,
      <Input
        name="confirmPassword"
        caption="Confirme Nueva Contraseña"
        type="password"
        value={this.state.confirmPassword}
        onChange={this.onChangeHandler}
        error={this.state.confirmPasswordError}
        className="col-s-12"
      />,
    ];
    return (
      <Page
        pageURL="/forgot/change"
      >
        <Form
          title={action}
          id="form-forgot-password"
          content={formContent}
          redirect="/"
          onClick={this.onClickUpdate}
        />
      </Page>
    );
  }
}
