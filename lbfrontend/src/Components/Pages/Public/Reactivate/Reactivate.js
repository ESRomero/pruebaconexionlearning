import React, { Component } from "react";
import Page from "../../Page";
import Input from "../../../Common/Input/Input";
import Select from "../../../Common/Select/Select";
import Button_F from "../../../Common/Button/Button";
import Loading from "../../../Common/Loading/Loading";
import { Link, Redirect } from "react-router-dom";
import { emailRegex, emptyRegex } from "../../../Common/Validators/Validators";
import { paxios, setLocalStorage } from "../../../Utilities/Utilities";
import img from "../Login/undraw_hacker_mindset_gjwq.svg";
export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      emailError: null,
      redirectTo: false,
      loading: false,
      id: undefined,
      plan: "0",
    };
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onClickLogin = this.onClickLogin.bind(this);
    this.validate = this.validate.bind(this);
    this.onSelectHandler = this.onSelectHandler.bind(this);
    this.onClickstartPayment = this.onClickstartPayment.bind(this);
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
  onSelectHandler(e) {
    let { value } = e.currentTarget;
    this.setState({ plan: value });
  }
  onClickLogin(e) {
    e.preventDefault();
    e.stopPropagation();
    const errors = this.validate(this.state);
    if (errors) {
      this.setState({ ...this.state, ...errors });
    } else {
      const { email } = this.state;
      this.setState({ loading: true });
      paxios
        .get(`/api/user/getByEmail/${email}`)
        .then((resp) => {
          this.setState({ ...this.state, id: resp.data, loading: false });
        })
        .catch((error) => {
          console.log(error);
          alert("No se encontro ningun correo electronico");
        });
      this.setState({ loading: false });
    }
  }
  onClickstartPayment() {
    const { id, plan } = this.state;
    if (id !== undefined) {
      let paymentData = {
        plan: "0",
        planDsc: "Mensual",
        price: "5.99",
        planFrequency: "",
      };
      if (plan === "2") {
        paymentData = {
          plan: "3",
          planDsc: "Trimestral",
          price: "14.99",
          planFrequency: "MONTH",
        };
      }
      if (plan === "3") {
        paymentData = {
          plan: "1",
          planDsc: "Anual",
          price: "59.99",
          planFrequency: "YEAR",
        };
      }
      this.setState({ loading: true });
      paxios
        .post(`/api/user/payment/${id}`, paymentData)
        .then((resp) => {
          console.log(resp.data);
          setLocalStorage("id", id);
          setLocalStorage("token", resp.data.token);
          window.location.replace(resp.data.redirect);
        })
        .catch((error) => {
          console.log(error);
          alert("ocurrio un error 1, vuelve a intentarlo");
        });
    } else {
      alert("ocurrio un error 2, vuelve a intentarlo");
    }
  }
  render() {
    const planArray = [
      { value: "0", dsc: "$ 5.99 Mensual" },
      { value: "2", dsc: "$ 14.99 Trimestral" },
      { value: "3", dsc: "$ 59.99 Anual" },
    ];
    if (this.state.id === undefined) {
      return (
        <Page pageURL="Login">
          <section className="page-login">
            <div className="login-data col-s-12 col-m-4 col-4 col-l-3">
              <form>
                <h1 className="center">Reactivación de Cuenta</h1>
                <br />
                <Link to="/login">Regresar</Link>
                <Input
                  name="email"
                  caption="Correo Electónico"
                  value={this.state.email}
                  onChange={this.onChangeHandler}
                  error={this.state.emailError}
                  className="col-s-12 col-m-12 col-12 input-1"
                />
                {this.state.loading && true ? (
                  <div className="loading center">
                    <Loading />{" "}
                  </div>
                ) : (
                  <Button_F>
                    <button
                      className="button-3 col-s-12"
                      type="button"
                      onClick={this.onClickLogin}
                    >
                      Buscar
                    </button>
                  </Button_F>
                )}
              </form>
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
    } else {
      return (
        <Page pageURL="Login">
          <section className="page-login">
            <div className="login-data col-s-12 col-m-4 col-4 col-l-3">
              <form>
                <h1 className="center">Reactivación de Cuenta</h1>
                <br />
                <Link to="/login">Regresar</Link>
                <Select
                  name="plan"
                  id="plan"
                  item={planArray}
                  caption="Escoge tu Plan"
                  onChange={this.onSelectHandler}
                />
                <br />
                {this.state.loading && true ? (
                  <div className="loading center">
                    <Loading />{" "}
                  </div>
                ) : (
                  <Button_F>
                    <button
                      className="button-3 col-s-12"
                      type="button"
                      onClick={this.onClickstartPayment}
                    >
                      Buscar
                    </button>
                  </Button_F>
                )}
              </form>
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
}
