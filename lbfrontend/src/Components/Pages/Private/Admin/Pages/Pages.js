import React, { Component } from "react";
import { Link } from "react-router-dom";
import { saxios, paxios } from "../../../../Utilities/Utilities";
import { IoMdAddCircle,IoIosBuild} from "react-icons/io";
import Page from "../../../Page";
export default class Access extends Component {
  constructor() {
    super();
    this.state = {
      pages: [],
    };
  }
  componentDidMount() {
    paxios
    .get(`/api/admin/access/pages`)
    .then((resp) => {
      this.setState({ pages: resp.data });
    })
    .catch((error) => {
      console.log(error);
    });
  }
  render() {
    let items = this.state.pages
    if (this.state.pages.length === 0) {
        items.push(<li className="list-item">Pagina Vacia</li>);
    } else {
      items = this.state.pages.map((page) => {
        return (
          <li className="list-item" key={page._id}>
            {page.pageName}
            <div className="buttons">
              <Link
                className="col-s-12 button-3 no-padding"
                to={"/pages/modify/"+page._id}
              >
                <IoIosBuild />
              </Link>
            </div>
          </li>
        );
      });
    }
    return (
      <Page pageURL="/Access" auth={this.props.auth}>
        <div className="page-list">
          <div className="action-title">
            <h1>Control de Paginas</h1>
            <br />
            <Link
              to="/pages/newPage"
              className="col-s-12 no-padding center orange"
            >
              <IoMdAddCircle /> &nbsp; Nueva Pagina
            </Link>
          </div>
          <ul className="list">{items}</ul>
        </div>
      </Page>
    );
  }
}
