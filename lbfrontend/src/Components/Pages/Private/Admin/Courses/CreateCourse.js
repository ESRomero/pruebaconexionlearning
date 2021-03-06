import React, { Component } from 'react';
import Page from '../../../Page';
import Input from '../../../../Common/Input/Input';
import Form from "../../../../Common/Form/Form";
import Select from '../../../../Common/Select/Select';
import { longStringRegex, emptyRegex, edadRegex } from '../../../../Common/Validators/Validators';
import { saxios } from '../../../../Utilities/Utilities';

export default class CreateCourse extends Component{
    constructor(){
        super();
        this.state ={
            name: '',
            nameError: null,
            desc: '',
            descError: null,
            chours:'',
            choursError: null,
            req:'',
            reqError:'',
            act: "false"
        }
        this.onClickUpdate = this.onClickUpdate.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.changeCMB = this.changeCMB.bind(this);
        this.validate = this.validate.bind(this);
    }

    onClickUpdate(e){
        e.preventDefault();
        e.stopPropagation();
        const errors = this.validate(this.state);
        if (errors) {
          this.setState({ ...this.state, ...errors });
        } else{
            const { name,  desc, chours, req} = this.state;
            const cHours = parseInt(chours);
            if(cHours===0 || cHours>500){
                alert("Ingrese una cantidad de horas realista");
            }
            else{
                const uri = '/api/admin/courses/new';
                saxios.post(uri,{
                    name: this.state.name,
                    desc: this.state.desc,
                    chours: this.state.chours,
                    req: this.state.req,
                    act: this.state.act
                })
                .then(({ data }) => {
                    alert("Ha sido ingresado correctamente el curso");
                })
                .catch((err) => {
                    console.log(err);
                    alert("Ha ocurrido un error. Intente nuevamente");
                });
            }
        }
    }

    validate(state){
        let nameErrors = false;
        let tmpErrors = [];
        const { name,  desc, chours, req} = state;
        if (name !== undefined) {
          if (!longStringRegex.test(name) || emptyRegex.test(name)) {
            tmpErrors.push("Ingrese un nombre en un formato válido (Mínimo 4 letras)");
          }
          if (tmpErrors.length) {
            nameErrors = Object.assign({}, nameErrors, { nameError: tmpErrors });
          }
        }
        if (desc !== undefined) {
            let tmpErrors = [];
            if (!longStringRegex.test(desc) || emptyRegex.test(desc)) {
              tmpErrors.push("Ingrese una descripción en un formato válido (Mínimo 4 letras)");
            }
            if (tmpErrors.length) {
              nameErrors = Object.assign({}, nameErrors, { descError: tmpErrors });
            }
        }
        if (chours !== undefined) {
            let tmpErrors = [];
            if (!edadRegex.test(chours) || emptyRegex.test(chours)) {
              tmpErrors.push("Ingrese una cantidad de horas en un formato válido (numérico)");
            }
            if (tmpErrors.length) {
              nameErrors = Object.assign({}, nameErrors, { choursError: tmpErrors });
            }
        }
        if (req !== undefined) {
            let tmpErrors = [];
            if (!longStringRegex.test(req) || emptyRegex.test(req)) {
              tmpErrors.push("Ingrese una cantidad de horas en un formato válido (Mínimo 4 letras)");
            }
            if (tmpErrors.length) {
              nameErrors = Object.assign({}, nameErrors, { reqError: tmpErrors });
            }
        }

        return nameErrors;
    }

    onChangeHandler(e){
        const {name, value} = e.currentTarget;
        let errors = this.validate({[name]:value});
        if(!errors){
            errors = {[name+"Error"]:''};
        }
        this.setState({
            ...this.state,
            [name]:value,
            ...errors
        })
    }

    changeCMB(e){
        this.setState({ act: e.target.value });
    }

    render(){
        const action ="Crear Curso";
        const selectItems=[
            { value: "false", dsc: "Inactivo" },
            { value: "true", dsc: "Activo" }
        ]
        const formContent = [
            <Input
                name="name"
                caption="Nombre del Curso"
                value={this.state.name}
                onChange={this.onChangeHandler}
                error={this.state.nameError}
                className="col-s-12"
            />,
            <Input
                name="desc"
                caption="Descripción del Curso"
                value={this.state.desc}
                onChange={this.onChangeHandler}
                error={this.state.descError}
                className="col-s-12"
            />,
            <Input
                name="chours"
                caption="Horas aproximadas para completar el curso"
                value={this.state.chours}
                onChange={this.onChangeHandler}
                error={this.state.choursError}
                className="col-s-12"
            />,
            <Input
                name="req"
                caption="Requerimientos para el Curso"
                value={this.state.req}
                onChange={this.onChangeHandler}
                error={this.state.reqError}
                className="col-s-12"
            />,
            <Select
              name="act"
              id="act"
              item={selectItems}
              caption="Activacion del Curso"
              onChange={this.changeCMB}
            />,
          ];
        return(
            <Page pageURL="CreateCourse" auth={this.props.auth}>
                <Form
                    title={action}
                    id="form-update-user"
                    content={formContent}
                    redirect="/"
                    onClick={this.onClickUpdate}
                />
            </Page>
        )
    }
}