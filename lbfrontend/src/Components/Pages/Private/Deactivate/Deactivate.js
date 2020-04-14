import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { paxios ,getLocalStorage} from "../../../Utilities/Utilities";
import Page from "../../Page";
import Form from "../../../Common/Form/Form";
export default class NewPage extends Component {
  constructor() {
    super();
    this.state = {
      redirect: false,
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    e.stopPropagation();
    e.preventDefault();
    var userId = getLocalStorage("id");
    paxios
      .put(`/api/user/subscription/deactivate/${userId}`)
      .then((resp) => {
        console.log(resp.data);
        alert("Cuenta desactivada correctamente");
        this.props.auth.logout();
        this.setState({ redirect: true });
      })
      .catch((error) => {
        console.log(error);
        alert("Ocurrio un Error");
      });
  }
  render() {
    let action = "Nueva Pagina";
    const redirect = this.state.redirect;
    const formContent = [<h1 className="center orange">Si desactiva la subscripción no se reembolazará el monto realizado</h1>];
    if (redirect) {
      return <Redirect to="/"/>;
    }
    return (
      <Page pageURL="/deactivate" auth={this.props.auth}>
        <Form
          title={action}
          id="form-deactivate-page"
          content={formContent}
          redirect="/"
          onClick={this.onClick}
        />
      </Page>
    );
  }
}
