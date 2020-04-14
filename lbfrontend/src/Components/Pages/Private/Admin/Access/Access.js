import React, { Component } from "react";
import { Link } from "react-router-dom";
import { saxios, paxios } from "../../../../Utilities/Utilities";
import { FaUserTimes, FaUserPlus, FaPlusCircle } from "react-icons/fa";
import Page from "../../../Page";
export default class Access extends Component {
  constructor() {
    super();
    this.state = {
      userTypes: [
        { cod: "1", dsc: "Administrador", url: "/access/level/ADM" },
        { cod: "2", dsc: "Cliente", url: "/access/level/CLI" },
      ]
    };
  }
  render() {
    const types = this.state.userTypes.map((type) => {
      return (
        <li className="list-item" key={type.dsc}>
          {type.dsc}{" "}
          <div className="buttons">
            <Link
              className="col-s-6 button-3 no-padding"
              to={type.url + "/DENY"}
            >
              <FaUserTimes />
            </Link>
            &nbsp;
            <Link
              className="col-s-6 button-3 no-padding"
              to={type.url + "/GRNT"}
            >
              <FaUserPlus />
            </Link>
          </div>
        </li>
      );
    });
    return (
      <Page pageURL="/Access" auth={this.props.auth}>
        <div className="page-list">
          <div className="action-title">
            <h1>Control de Accesos</h1>
          </div>
          <ul className="list">{types}</ul>
        </div>
      </Page>
    );
  }
}
