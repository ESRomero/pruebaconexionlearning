import React, { Component } from "react";
import Page from "../../Page";
import {
  paxios,
  getLocalStorage,
  removeLocalStorage,
} from "../../../Utilities/Utilities";
import Loading from "../../../Common/Loading/Loading";
export default class Approved extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
    };
  }
  componentDidMount() {
    const id = getLocalStorage("id") || undefined;
    if (id !== undefined) {
      paxios
        .delete(`/api/user/unsubscribe/${id}`)
        .then((resp) => {
          console.log(resp.data);
          removeLocalStorage("jwt");
          removeLocalStorage("id");
          this.setState({ loading: false });
          this.props.auth.logout();
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
        <Page pageURL="/approved">
          <section className="page-approved">
            <div className="approved-text main-color col-9">
              <Loading />
            </div>
          </section>
        </Page>
      );
    } else {
      return (
        <Page pageURL="/approved">
          <section className="page-approved">
            <div className="approved-text main-color col-9">
              <h2>Ocurrio un error con tu transaccion</h2>
            </div>
          </section>
        </Page>
      );
    }
  }
}
