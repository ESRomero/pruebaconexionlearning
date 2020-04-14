import React, { Component } from "react";
import Page from "../../Page";
import { paxios, getLocalStorage } from "../../../Utilities/Utilities";
import Loading from "../../../Common/Loading/Loading";
export default class Approved extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
    };
    this.activateSubscription = this.activateSubscription.bind(this);
  }
  componentDidMount() {
    const token = getLocalStorage("token") || undefined;
    if (token !== undefined) {
      paxios
        .post(`/api/user/payment/execute/${token}`)
        .then((resp) => {
          console.log(resp.data);
          this.activateSubscription(resp.data.id);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert("Ocurrio un error");
      window.location.replace("http://localhost:3001/");
    }
  }
  activateSubscription(billingId) {
    const id = getLocalStorage("id") || undefined;
    if (id !== undefined) {
      paxios
        .put(`/api/user/subscription/activate/${id}`,{billingId:billingId})
        .then((resp) => {
          console.log(resp.data);
          this.setState({ loading: false });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert("Ocurrio un error");
      window.location.replace("http://localhost:3001/");
    }
  }
  render() {
    if (this.state.loading) {
      return (
        <Page pageURL="/approved" auth={this.props.auth}>
          <section className="page-approved">
            <div className="approved-text main-color col-9">
              <Loading />
            </div>
          </section>
        </Page>
      );
    } else {
      return (
        <Page pageURL="/approved" auth={this.props.auth}>
          <section className="page-approved">
            <div className="approved-text main-color col-9">
              <h2>Tu transaccion fue aprovada exitosamente</h2>
              <h2>Ya puedes Iniciar Sesión con tus credenciales </h2>
            </div>
          </section>
        </Page>
      );
    }
  }
}
