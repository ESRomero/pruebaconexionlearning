import React, { Component } from "react";
import { Link } from "react-router-dom";
import Page from "../../Page";

export default class Subs extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <Page pageURL="/subscriptions" auth={this.props.auth}>
        <div className="page-subs">
          <div className="subs-cards">
            <div className="card col-s-12 center">
              <h1>Mensual</h1>
              <div className="line"></div>
              <p>Acceso a todos los Cursos</p>
              <br></br>
              <br/>
              <div className="prices"><h3 className="discount orange">$ 5.99</h3></div>
              <Link className="button-3 center" to="/register/1" price="5.99">Registrarme</Link>
            </div>
            <div className="card col-s-12 center">
              <h1>Trimestral</h1>
              <div className="line"></div>
              <p>Acceso a todos los Cursos</p>
              <p>25% de Descuento</p>
            <br/>
              <div className="prices">
                <span>$ 20.00</span> <h3 className="discount orange">$ 14.99</h3>
              </div>
              <Link className="button-3 center" to="/register/2" price="14.99">Registrarme</Link>
            </div>
            <div className="card col-s-12 center">
              <h1>Anual</h1>
              <div className="line"></div>
              <p>Acceso a todos los Cursos</p>
              <p>Promoción Limitada</p>
              <p>30% de Descuento</p>
              
              <div className="prices">
                <span>$ 85.00</span> <h3 className="discount orange">$ 59.99</h3>
              </div>
              <Link className="button-3 center" to="/register/3" price="59.99">Registrarme</Link>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}
