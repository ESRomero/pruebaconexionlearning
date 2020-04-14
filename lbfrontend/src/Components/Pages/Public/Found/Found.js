import React, { Component } from "react";
import Page from "../../Page";
import { IoIosCloseCircleOutline } from "react-icons/io";
export default class Found extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <Page pageURL="/404" auth={this.props.auth}>
        <section className="page-404">
          <h1>
            <IoIosCloseCircleOutline /> 404 Pagina no Encontrada
          </h1>
        </section>
      </Page>
    );
  }
}
