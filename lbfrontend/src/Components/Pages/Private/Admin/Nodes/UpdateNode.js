import React, { Component } from 'react';
import Page from '../../../Page';
import Input from '../../../../Common/Input/Input';
import Form from "../../../../Common/Form/Form";
import Select from '../../../../Common/Select/Select';
import { longStringRegex, emptyRegex, edadRegex } from '../../../../Common/Validators/Validators';
import { saxios } from '../../../../Utilities/Utilities';

export default class UpdateNode extends Component{
    constructor(){
        super();
        this.state ={
            number:'',
            name: '',
            nameError: null,
            desc: '',
            descError: null,
            dialogue:'',
            dialogueError: null,
            req:'',
            reqError: null,
            resp:'',
            respError:null,
            type: "Drag"
        }
        this.onClickUpdate = this.onClickUpdate.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.changeCMB = this.changeCMB.bind(this);
        this.validate = this.validate.bind(this);
    }

    componentDidMount(){
        const courseID = this.props.match.params.idc;
        const nodeNum = this.props.match.params.idn;
        const actualNum = nodeNum-1;
        const uri2 = `/api/admin/courses/nodes/all/${courseID}`;
        saxios.get(uri2)
        .then(
            ({data})=>{
                this.setState({
                    number: data.courseNodes[actualNum].nodeNumber,
                    name: data.courseNodes[actualNum].nodeName,
                    desc: data.courseNodes[actualNum].nodeDesc,
                    dialogue: data.courseNodes[actualNum].nodeDialogue,
                    type: data.courseNodes[actualNum].completionType,
                    resp: data.courseNodes[actualNum].rightAnswer,
                    req: data.courseNodes[actualNum].nodeRequest
                }, function(){
                    const comb = document.getElementById("type");
                    if(this.state.type==="Drag"){
                        comb.selectedIndex = 0;
                    }
                    else if(this.state.type==="Video"){
                        comb.selectedIndex = 1; 
                    }
                    else if(this.state.type==="Regex")
                    {
                        comb.selectedIndex = 2;
                    }else{
                        comb.selectedIndex = 3;
                    }
                });
            }
        )
        .catch(
            (err)=>{
                console.log(err);
            }
        );
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
                const courseID = this.props.match.params.idc;
                const nodeNum = this.props.match.params.idn;
                const uri = `/api/admin/courses/node/upd/${courseID}/${nodeNum}`;
                saxios.put(uri,{
                    name: this.state.name,
                    desc: this.state.desc,
                    dialogo: this.state.dialogue,
                    tipo: this.state.type,
                    respuesta: this.state.resp,
                    req: this.state.req
                })
                .then(
                    ({data})=>{
                        alert("Se ha modificado exitosamente la clase");
                    }
                )
                .catch(
                    (err)=>{
                        console.log(err);
                    }
                )
            }
        }
    }

    validate(state){
        let nameErrors = false;
        let tmpErrors = [];
        const { name,  desc, req, resp, dialogue} = state;
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
        if (req !== undefined) {
            let tmpErrors = [];
            if (emptyRegex.test(req)) {
              tmpErrors.push("No lo deje vacio");
            }
            if (tmpErrors.length) {
              nameErrors = Object.assign({}, nameErrors, { reqError: tmpErrors });
            }
        }
        if (resp !== undefined) {
            let tmpErrors = [];
            if (emptyRegex.test(resp)) {
              tmpErrors.push("No lo deje vacio");
            }
            if (tmpErrors.length) {
              nameErrors = Object.assign({}, nameErrors, { respError: tmpErrors });
            }
        }
        if (dialogue !== undefined) {
            let tmpErrors = [];
            if (emptyRegex.test(dialogue)) {
              tmpErrors.push("Ingrese una descripción en un formato válido (Mínimo 4 letras)");
            }
            if (tmpErrors.length) {
              nameErrors = Object.assign({}, nameErrors, { dialogueError: tmpErrors });
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
        this.setState({ type: e.target.value });
    }

    render(){
        const action ="Modificar Clase";
        const selectItems=[
            { value: "Drag", dsc: "Drag" },
            { value: "Video", dsc: "Video" },
            { value: "Regex", dsc: "Regex" },
            { value: "Text", dsc: "Text" }
        ];
        const formContent = [
            <Input
                name="name"
                caption="Nombre de la Clase"
                value={this.state.name}
                onChange={this.onChangeHandler}
                error={this.state.nameError}
                className="col-s-12"
            />,
            <Input
                name="desc"
                caption="Descripción de la clase"
                value={this.state.desc}
                onChange={this.onChangeHandler}
                error={this.state.descError}
                className="col-s-12"
            />,
            <Input
                name="dialogue"
                caption="Descripcion de lo que la clase va a enseñar"
                value={this.state.dialogue}
                onChange={this.onChangeHandler}
                error={this.state.dialogueError}
                className="col-s-12"
            />,
            <Input
                name="resp"
                caption="Respuesta correcta (Ya sea el regex, texto o draggable)"
                value={this.state.resp}
                onChange={this.onChangeHandler}
                error={this.state.respError}
                className="col-s-12"
            />,
            <Input
                name="req"
                caption="Opciones o Instrucciones para completar clase (o url del video)"
                value={this.state.req}
                onChange={this.onChangeHandler}
                error={this.state.reqError}
                className="col-s-12"
            />,
            <Select
                name="type"
                id="type"
                item={selectItems}
                caption="Activacion del Curso"
                onChange={this.changeCMB}
            />,
          ];
        return(
            <Page pageURL="UpdateCourse" auth={this.props.auth}>
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