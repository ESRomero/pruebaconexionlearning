import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { paxios } from "../../../../Utilities/Utilities";
import Page from "../../../Page";
import Input from "../../../../Common/Input/Input";
import Select from "../../../../Common/Select/Select";
import Form from "../../../../Common/Form/Form";
import { emptyRegex } from "../../../../Common/Validators/Validators";
export default class NewPage extends Component {
  constructor() {
    super();
    this.state = {
      pageName: "",
      pageNameError: null,
      pageURL: "",
      pageURLError: null,
      pageClass: "MNU",
      redirect: false,
      modifying: false,
    };
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.validate = this.validate.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onSelectHandler = this.onSelectHandler.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  validate(state) {
    let nameErrors = null;
    let tmpErrors = [];
    const { pageName, pageURL } = state;
    if (pageName !== undefined) {
      if (emptyRegex.test(pageName)) {
        tmpErrors.push("Ingrese un nombre valido");
      }
      if (tmpErrors.length) {
        nameErrors = Object.assign({}, nameErrors, {
          pageNameError: tmpErrors,
        });
      }
    }
    if (pageURL !== undefined) {
      tmpErrors = [];
      if (emptyRegex.test(pageURL)) {
        tmpErrors.push("Ingrese un URL valido");
      }
      if (tmpErrors.length) {
        nameErrors = Object.assign({}, nameErrors, {
          pageURLError: tmpErrors.join(". "),
        });
      }
    }
    return nameErrors;
  }
  onSelectHandler(e) {
    let { value } = e.currentTarget;
    this.setState({ pageClass: value });
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
  onClick(e) {
    e.stopPropagation();
    e.preventDefault();
    let errors = this.validate(this.state);
    if (errors) {
      this.setState({ ...this.state, ...errors });
    } else {
      const { pageName, pageURL, pageClass, modifying } = this.state;
      if (!modifying) {
        paxios
          .post("/api/admin/access/newPage", {
            pageName: pageName,
            pageURL: pageURL,
            pageClass: pageClass,
          })
          .then((resp) => {
            console.log(resp.data);
            alert("Pagina creada correctamente");
            this.setState({ redirect: true });
          })
          .catch((error) => {
            console.log(error);
            alert("Ocurrio un Error");
          });
      } else {
        let id = this.props.match.params.id;
        paxios
          .put(`/api/admin/access/pages/modify/${id}`, {
            pageName: pageName,
            pageURL: pageURL,
            pageClass: pageClass,
          })
          .then((resp) => {
            console.log(resp.data);
            alert("Pagina Modificada correctamente");
            this.setState({ redirect: true });
          })
          .catch((error) => {
            console.log(error);
            alert("Ocurrio un Error");
          });
      }
      
    }
  }
  componentDidMount() {
    if (this.props.match.params.id !== undefined) {
      let pageId = this.props.match.params.id;
      paxios
        .get(`/api/admin/access/pages/${pageId}`)
        .then((resp) => {
          const { pageName, pageURL, pageClass } = resp.data[0];
          console.log(resp.data[0].pageName);
          this.setState({
            pageName: pageName,
            pageURL: pageURL,
            pageClass: pageClass,
            modifying: true,
          });
          console.log(this.state);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  render() {
    let action = "Nueva Pagina";
    if (this.state.modifying) action = "Modificando Pagina";
    const redirect = this.state.redirect;
    const pageClass = [
      { value: "MNU", dsc: "Menu" },
      { value: "PGE", dsc: "Pagina" },
    ];
    const formContent = [
      <Input
        name="pageName"
        caption="Nombre de la Pagina"
        value={this.state.pageName}
        onChange={this.onChangeHandler}
        error={this.state.pageNameError}
        className="col-s-12"
      />,
      <Input
        name="pageURL"
        caption="URL de la Pagina"
        value={this.state.pageURL}
        onChange={this.onChangeHandler}
        error={this.state.pageURLError}
        className="col-s-12"
      />,
      <Select
        name="pageClass"
        id="pageClass"
        item={pageClass}
        caption="Clase de Pagina"
        onChange={this.onSelectHandler}
      />,
    ];
    if (redirect) {
      return <Redirect to="/pages" auth={this.props.auth} />;
    }
    return (
      <Page pageURL="/pages/newPage" auth={this.props.auth}>
        <Form
          title={action}
          id="form-new-page"
          content={formContent}
          redirect="/pages"
          onClick={this.onClick}
        />
      </Page>
    );
  }
}
