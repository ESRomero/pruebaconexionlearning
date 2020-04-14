import React, { Component } from "react";
import { Link } from "react-router-dom";
import { paxios, saxios } from "../../../../Utilities/Utilities";
import Page from "../../../Page";
export default class Level extends Component {
  constructor() {
    super();
    this.state = {
      access: [],
      userType: "",
      act: "",
      dsc: "",
      action: "",
    };
    this.getName = this.getName.bind(this);
  }
  componentDidMount() {
    const userType = this.props.match.params.userType;
    const act = this.props.match.params.op;
    this.setState({ userType: userType });
    if (act == "GRNT") {
      this.setState({
        act: "Accesos Garantizados de " + userType,
        dsc: "Denegar",
        action: act,
      });
      saxios
        .get(`/api/admin/access/hasAccess/${userType}`)
        .then((resp) => {
          this.setState({ access: resp.data });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.setState({
        act: "Accesos Denegados de " + userType,
        dsc: "Garantizar",
        action: act,
      });
      saxios
        .get(`/api/admin/access/deniedAccess/${userType}`)
        .then((resp) => {
          this.setState({ access: resp.data });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  getName(id, type, act) {
    if (act.act == "GRNT") {
      saxios
        .put(`/api/admin/access/deny/${id}`, type)
        .then((resp) => {
          alert("Acceso Denegado Correctamente");
        })
        .catch((error) => {
          alert("Ocurrio un Error");
          console.log(error);
        });
    } else {
      saxios
        .put(`/api/admin/access/give/${id}`, type)
        .then((resp) => {
          alert("Acceso Garantizado Correctamente");
        })
        .catch((error) => {
          alert("Ocurrio un Error");
          console.log(error);
        });
    }
    this.componentDidMount();
  }
  render() {
    const type = this.state.userType;
    const actionDsc = this.state.dsc;
    const action = this.state.act;
    const act = this.state.action;
    const pages = [];
    if (this.state.access.length > 0) {
      this.state.access.map((page) => {
        pages.push(
          <li className="list-item" key={page._id}>
            <p className="col-s-10">{page.pageName}</p>
            <div className="buttons">
              <button
                onClick={() => {
                  this.getName(page._id, { type }, { act });
                }}
                id={type}
                className="col-s-12 button-3"
                name={page._id}
              >
                {actionDsc}
              </button>
            </div>
          </li>
        );
      });
    } else {
      pages.push(<li className="list-item">Pagina Vacia</li>);
    }

    return (
      <Page pageURL="/access/level" auth={this.props.auth}>
        <div className="page-list">
          <div className="action-title center">
            <h1>
              {action}{" "}
              <Link to="/access" className="col-s-12 no-padding">
                Regresar
              </Link>
            </h1>
          </div>
          <ul className="list">{pages}</ul>
        </div>
      </Page>
    );
  }
}
