import React, {Component} from 'react';
import Page from '../../Page';
import Input from '../../../Common/Input/Input';
import Button_F from '../../../Common/Button/Button';
import Loading from "../../../Common/Loading/Loading";
import { Link, Redirect } from 'react-router-dom';
import {emailRegex, emptyRegex, passwordRegex} from '../../../Common/Validators/Validators';
import { paxios, setLocalStorage } from '../../../Utilities/Utilities';
import img from './undraw_hacker_mindset_gjwq.svg';
export default class Login extends Component{
    constructor(){
        super();
        this.state = {
            email: '',
            emailError: null,
            password: '',
            passwordError: null,
            redirectTo: false,
            loading:false
        }
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onClickLogin = this.onClickLogin.bind(this);
        this.validate = this.validate.bind(this);
    }

    validate(state){
        let nameErrors = false;
        let tmpErrors = [];
        const {email, password} = state;
        if(email !== undefined){
            if((!(emailRegex.test(email)))||(emptyRegex.test(email))){
                tmpErrors.push("Ingrese un correo con un formato válido");
            }  
            if(tmpErrors.length){
                nameErrors = Object.assign({}, nameErrors, {emailError: tmpErrors});
            }
        }
        if(password !== undefined){
            tmpErrors = [];
            if(!(passwordRegex.test(password))||(emptyRegex.test(password))){
                tmpErrors.push("Ingrese una contraseña con un formato válido"); 
                tmpErrors.push("(Iniciar con mayúscula, contener un número, una minúscula, mínimo 8 caracteres y máximo 20)");
            }
            if(tmpErrors.length){
                nameErrors = Object.assign({}, nameErrors, {passwordError: tmpErrors.join('. ')});
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

    onClickLogin(e){
        e.preventDefault();
        e.stopPropagation();
        const errors = this.validate(this.state);
        if(errors){
            this.setState({...this.state, ...errors});
        }else{
            const {email, password} = this.state;
            this.setState({loading:true})
            paxios.post(
                "/api/user/login",
                {
                    userEmail: email,
                    userPassword: password
                }
            )
            .then((resp)=>{
                console.log(resp.data);
                if(resp.data.msg){
                    alert(resp.data.msg);
                }else{
                    this.props.login(resp.data);
                    this.setState({...this.state, redirectTo: true});    
                }
                
            })
            .catch((error)=>{
                console.log(error);
            })
            this.setState({loading:false})
        }

    }

    render(){
        if(this.state.redirectTo){
            const redirect = (this.props.location.state) ? this.props.location.state.from.pathname : '/';
            return (<Redirect to={redirect} />);
        }
        return(
            <Page pageURL="Login">
                <section className="page-login">
                    <div className="login-data col-s-12 col-m-4 col-4 col-l-3">
                        <form>
                        <h1 className="center">Iniciar Sesión</h1>
                        <br/>
                        <Input 
                            name="email"
                            caption="Correo Electónico"
                            value={this.state.email}
                            onChange={this.onChangeHandler}
                            error={this.state.emailError} 
                            className="col-s-12 col-m-12 col-12 input-1"   
                        />
                        <Link className="black" to="/forgot">¿Olvidaste tu contraseña? </Link>
                        
                        <Input
                            name="password"
                            caption="Contraseña"
                            value={this.state.password}
                            onChange={this.onChangeHandler} 
                            type="password"
                            error={this.state.passwordError}
                            className="col-s-12 col-m-12 col-12 input-1"   
                        />
                        {(this.state.loading && true)? <div className="loading center">
                        <Loading />    </div>:(<Button_F>
                            <button className="button-3 col-s-12" type="button" onClick={this.onClickLogin}>Entrar</button>
                        </Button_F>)  }
                        <br />
                        <div className="line"></div>
                        <br />
                        <h1 className="center">Reactivación de Usuario</h1>
                        <br />
                        
                        <Link className="button-3 center" to="/reactivate">Reactivar Usuario</Link>
                        </form>
                              
                    </div>
                    <div className="login-background col-m-8 col-6 col-offset-1 col-offset-l-2 hide-s">
                        <img src={img} alt="Imagen de Fondo"  className="col-m-12 no-padding"/>
                    </div>
                </section>
            </Page>
        );    
    }
}