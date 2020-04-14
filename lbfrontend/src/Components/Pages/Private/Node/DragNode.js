import React, {Component} from 'react';
import Page from '../../Page';
import Input from '../../../Common/Input/Input';
import Button_F from '../../../Common/Button/Button';
import { Link, Redirect } from 'react-router-dom';
import { saxios, getLocalStorage, setLocalStorage, removeLocalStorage } from '../../../Utilities/Utilities';
import Container from '../../../Common/DragComponents/Container';
import Option from '../../../Common/DragComponents/Option';
import './Node.css';
export default class DragNode extends Component{
    constructor(){
        super();
        this.state = {
            data: null,
            redirectTo: false,
            data: {
                nodeName: '',
                nodeDesc: '',
                nodeDialogue: '',
                nodeRequest: '',
                rightAnswer: ''
            },
            opt: []
        }
        this.onClickSubmit = this.onClickSubmit.bind(this);
        this.dragElementRef = React.createRef();
    }

    componentDidMount(){
        var x=1;
        for(x=1;x<=4;x++){
            var id="Container_Option_"+x;
            var option = "Option_"+x
            var cont = document.getElementById(id);
            var opt = document.getElementById(option);
            cont.appendChild(opt);
            var rect = cont.getBoundingClientRect();
            //console.log(rect.top, rect.right, rect.bottom, rect.left);
            cont.style.top = (rect.top+"px");
            cont.style.left = (rect.left+"px");
            this.render();
            cont.childNodes.style = cont.style;
        }
        const nodeID = this.props.match.params.idn;
        this.setState({'nodeNumber': nodeID})
        const courseID = this.props.match.params.idc;
        this.setState({'courseID': courseID})
        const uri = `/api/user/course/nodes/${this.props.auth.id}/${courseID}`;
        saxios.get(uri)
        .then(
            ({data})=>{
                var a, b, c, d = 0;
                for (a=0;a<data[nodeID-1].nodeRequest.length;a++){
                    if(data[nodeID-1].nodeRequest[a]==='B' && data[nodeID-1].nodeRequest[a+1]===':'){
                        b = a;
                    }
                    if(data[nodeID-1].nodeRequest[a]==='C' && data[nodeID-1].nodeRequest[a+1]===':'){
                        c = a;
                    }
                    if(data[nodeID-1].nodeRequest[a]==='D' && data[nodeID-1].nodeRequest[a+1]===':'){
                        d = a;
                    }
                }
                this.setState({
                    data: data[nodeID-1],
                    opt: [
                        data[nodeID-1].nodeRequest.substring(0,b),
                        data[nodeID-1].nodeRequest.substring(b,c),
                        data[nodeID-1].nodeRequest.substring(c,d),
                        data[nodeID-1].nodeRequest.substring(d,(data[nodeID-1].nodeRequest.length-1)),
                    ]
                }, function(){
                    this.render();
                });
            }
        )
        .catch(
            (err)=>{
                console.log(err);
            }
        )
    }

    onClickSubmit(e){
        var id = document.getElementById("Container_Answer");
        if(id.children.length===1){
            const courseID = this.props.match.params.idc;
            const nodeNum = this.props.match.params.idn;
            const uri = `/api/user/course/class/${courseID}`;
            saxios.put(uri,{
                NodeNumber: nodeNum,
                answer: id.children[0].title,
                userid: this.props.auth.id
            })
            .then((info) => {
                alert(info.data.Resultado);
                if(info.data.Resultado==="La respuesta es correcta"){
                    this.setState({
                        ...this.state,
                        redirectTo: true
                    });
                }
              })
              .catch((err) => {
                console.log(err);
              });
        }else{
            alert("Favor elija una opción antes de continuar");
        }
    }



    render(){
        if(this.state.redirectTo){
            var location = '/course/classes/'+this.props.match.params.idc;
            return (<Redirect to={location}/>);
        }
        return(
            <Page pageURL="Class" auth={this.props.auth}>
                <br/><br/><br/>
                <div>
                    <h2>{this.state.data.nodeName || ''}</h2>
                    <h4>{this.state.data.nodeDesc || ''}</h4>
                    <p>{this.state.data.nodeDialogue || ''}</p>
                    <ul>
                        <li>{this.state.opt[0]||''}</li>
                        <li>{this.state.opt[1]||''}</li>
                        <li>{this.state.opt[2]||''}</li>
                        <li>{this.state.opt[3]||''}</li>
                    </ul>
                </div>
                <div className="Options">
                    <Container id="Container_Option_1" className="col-offset-m-1">
                        <Option id="Option_1" draggable="true" title="draggable1" className="Option" >
                            {this.state.firstPossibleAnswer || "A"}
                        </Option>
                    </Container>
                    <Container id="Container_Option_2" className="col-offset-m-1">
                        <Option id="Option_2" draggable="true" title="draggable2" className="Option" >
                        {this.state.secondPossibleAnswer || "B"}
                        </Option>
                    </Container>
                    <Container id="Container_Option_3" className="col-offset-m-1">
                        <Option id="Option_3" draggable="true" title="draggable3" className="Option" >
                            {this.state.thirdPossibleAnswer || "C"}
                        </Option>
                    </Container>
                    <Container id="Container_Option_4" className="col-offset-m-1">
                        <Option id="Option_4" draggable="true" title="draggable4" className="Option" >
                            {this.state.fourthPossibleAnswer || "D"}
                        </Option>
                    </Container>
                </div>
                <br/><br/><br/>
                <p style={{textAlign: "center"}}>Drag Answer Here</p>
                <div className="Ans">
                    <Container id="Container_Answer" className="Answer">
                    </Container>
                </div>
                <Button_F>
                    <button className="button-3 col-s-11" onClick={this.onClickSubmit} >Verificar Respuesta</button>
                </Button_F> 
            </Page>
        )
    }
}