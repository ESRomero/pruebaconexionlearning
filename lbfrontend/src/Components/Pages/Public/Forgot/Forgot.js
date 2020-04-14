import React, { Component } from "react";
import Page from "../../Page";

import { paxios, setLocalStorage } from "../../../Utilities/Utilities";
import Loading from "../../../Common/Loading/Loading";
import Input from "../../../Common/Input/Input";
import Button_F from "../../../Common/Button/Button";
import { emailRegex, emptyRegex } from "../../../Common/Validators/Validators";
import img from "../Login/undraw_hacker_mindset_gjwq.svg";
import { Link } from "react-router-dom";
import { IoLogoWindows } from "react-icons/io";
export default class Forgot extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      emailError: null,
      emailSent: false,
      emailSending: false,
    };
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onClickForgot = this.onClickForgot.bind(this);
    this.validate = this.validate.bind(this);
  }
  validate(state) {
    let nameErrors = false;
    let tmpErrors = [];
    const { email } = state;
    if (email !== undefined) {
      if (!emailRegex.test(email) || emptyRegex.test(email)) {
        tmpErrors.push("Ingrese un correo con un formato válido");
      }
      if (tmpErrors.length) {
        nameErrors = Object.assign({}, nameErrors, { emailError: tmpErrors });
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
  onClickForgot(e) {
    e.preventDefault();
    e.stopPropagation();
    const errors = this.validate(this.state);
    if (errors) {
      this.setState({ ...this.setState, ...errors });
    } else {
      const { email } = this.state;
      this.setState({ emailSending: true });
     paxios.put("/api/user/token",{"email":email}).
     then((resp)=>{
        if(resp.data.error){
          //window.location.assign('http://localhost:3001/')
        }
        this.sendMail(resp.data.token);
     }).catch((error)=>{console.log(error)})
    }
  }
  sendMail(token){
    const { email } = this.state;
      
      paxios
        .post("/api/user/forgot", {
          to: email,
          subject: "Cambio de Contraseña",
          htmlBody: '<!DOCTYPE html>'
        +'<html>'
            +'<head>'
                +'<meta charset="UTF-8">'
                +'<link href="https://fonts.googleapis.com/css?family=Poppins&display=swap" rel="stylesheet">'
                +'<meta name="viewport" content="width=device-width, initial-scale=1.0">'
                +'<title>Food Service</title>'
                +'<style>'
                    +'* {'
                    +'font-family: "Poppins", sans-serif;'
                    +'}'
                    +'a{'
                    +'display:block;'
                    +'color: #fff !important; '
                    +'text-decoration: none;'
                    +'}'
                    +'.mail {'
                    +'background-color: #27b863;'
                    +'padding: 4em;'
                    +'}'
                    +'.action-title {'
                    +'background-color: #FFF;'
                    +'padding: 0.5em;'
                    +'margin: 1em 0px;'
                    +'border-radius: 9px;'
                    +'width: 200px;'
                    +'}'
        
                    +'.action-title h1 {'
                    +'text-align: center;'
                    +'opacity: 1;'
                    +'color: #27b863;'
                    +'font-size: 2em !important;'
                   +'}'
        
                    +'.content {'
                    +'border-radius: 9px;'
                    +'text-align: center;'
                    +'margin: 0em;'
                    +'background-color: #FFF;'
                    +'padding: 0.5em;'
                    +'width: 200px;'
                    +'}'
        
                    +'.content h2 {'
                    +'background-color: transparent;'
                    +'font-size: 2em;'
                    +'}'
                    +'.content .messages{'
                        +'padding: 1.5em;'
                        +'border-radius: 9px;'
                        +'background-color: #27b863;'
                    +'}'
                    +'.content .messages li {'
                        +'list-style: none;'
                    +'text-align: center;'
                    +'font-size: 1em;'
                    +'}'
                    +'.thanks{'
                        +'text-align: center;'
                        +'color: #fff;'
                        +'font-size: 1.2em;'
                        +'list-style: none;'
                    +'}'
                   +'@media (min-width: 1024px) {'
                   +'.action-title {'
                    +'background-color: #FFF;'
                    +'margin: 3em;'
                    +'width: 800px;'
                    +'}'
                    +'.mail {'
                        +'padding: 10em;'
                    +'}'
                   +'.content {'
                        +'width: 800px;'
                        +'padding: 3em;'
                        
                    +'}'
                    +'.content .messages{'
                        +'padding: 2em;'
                        +'border-radius: 9px;'
                        +'font-size: 1.5em;'
                        +'background-color: #27b863;'
                    +'}'
                    +'}'
                +'</style>'
            +'</head>'
            +'<body>'
                +'<div class="mail">'
                    +'<div class="action-title">'
                        +'<h1>Learning Basics</h1>'
                    +'</div>'
                    +'<div class="content">'
                    +'<ul class="messages"> '
                        +'<li><a href="http://localhost:3001/forgot/'+email+'/'+token+'"> Cambiar Contraseña</a></li> '
                    +'</ul>'                
                    +'</div>'
                +'</div>'
            +'</body>'
            +'</html>'
        })
        .then((resp) => {
          console.log(resp.data);
          if (resp.data.error) {
            alert(resp.data.error);
          } else {
            this.setState({
              ...this.state,
              emailSent: true,
              emailSending: false,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
  }
  render() {
    
    if (this.state.emailSending) {
        return (
            <Page pageURL="forgot">
              <section className="page-login">
                <div className="login-data col-s-12 col-m-4 col-4 col-l-3">
                  <h1 className="center">Cambion de Contraseña</h1>
                  <br />
                  <div className="center">
                    <Loading />
                  </div>
                  <h1 className="center main-color">Enviando</h1>
                  
                </div>
              </section>
            </Page>
          );
    }
    if (this.state.emailSent) {
      return (
        <Page pageURL="forgot">
          <section className="page-login">
            <div className="login-data col-s-12 col-m-4 col-4 col-l-3">
              <h1 className="center">Cambion de Contraseña</h1>
              <Link className="black center" to="/login">Regresar</Link>
              <br />
              <h1 className="center main-color">
                Correo enviado para realizar el cambio de Contraseña
              </h1>
            </div>
            <div className="login-background col-m-8 col-6 col-offset-1 col-offset-l-2 hide-s">
              <img
                src={img}
                alt="Imagen de Fondo"
                className="col-m-12 no-padding"
              />
            </div>
          </section>
        </Page>
      );
    }

    return (
      <Page pageURL="forgot">
        <section className="page-login">
          <div className="login-data col-s-12 col-m-4 col-4 col-l-3">
            <h1 className="center">Cambion de Contraseña</h1>
            <Link className="black center" to="/login">Regresar</Link>
            <br />
            <Input
              name="email"
              caption="Correo Electónico"
              value={this.state.email}
              onChange={this.onChangeHandler}
              error={this.state.emailError}
              className="col-s-12 col-m-12 col-12 input-1"
            />
            <Button_F>
              <button
                className="button-3 col-s-12"
                onClick={this.onClickForgot}
              >
                Enviar
              </button>
            </Button_F>
          </div>
          <div className="login-background col-m-8 col-6 col-offset-1 col-offset-l-2 hide-s">
            <img
              src={img}
              alt="Imagen de Fondo"
              className="col-m-12 no-padding"
            />
          </div>
        </section>
      </Page>
    );
  }
}
