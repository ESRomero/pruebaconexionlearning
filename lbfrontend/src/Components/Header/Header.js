import React, {Component} from 'react';
import { Link } from 'react-router-dom'; 
import {IoIosSettings,IoIosCloseCircleOutline,IoMdLogOut} from 'react-icons/io';
import img from './logoLearningBasics.png';
import {getLocalStorage} from '../Utilities/Utilities';
import { saxios,paxios } from '../Utilities/Utilities';
export default class Header extends Component{
    
    constructor(){
        super();
        this.logoutOnClick = this.logoutOnClick.bind(this);
        this.state = {
            open : false,
            display: false,
            userType : getLocalStorage('type')||'UKN',
            menu:[]
        }
    }
    componentDidMount(){
        const type = this.state.userType;      
        paxios.post('/api/admin/access/makeMenu',{userType:type}).
        then((resp)=>{
            if(resp){
                this.setState({...this.state,menu:resp.data});
            }
        }).
        catch((err)=>{
            if(err){
                console.log(err);
            }
        })
    }
    logoutOnClick(e){
        e.preventDefault();
        e.stopPropagation();
        this.props.auth.logout();
    }
    render(){
        
        const userMenu = [];
        if(this.state.menu.length >= 0){
            this.state.menu.map((menus)=>{
                userMenu.push(<li key={menus.pageURL}><Link to={menus.pageURL}>{menus.pageName}</Link></li>)
            })
        }
        const shown = this.state.open;
        console.log(shown);
        const displaying = this.state.display;
        if(this.props.auth && this.props.auth.isLogged && true){
            return(
                <header className="col-s-12">
                <div className="title col-s-7 col-m-5 col-12 no-margin no-padding">
                    <Link to="/"><img src={img} alt="Logo Learning Basics" width="200"/></Link>
                    
                </div>
                <div onClick={ ()=>{this.setState({open: !shown})}} className={displaying ? "hide":"burger"} id="hmb">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className={displaying ? "close":"hidden"}>
                <IoIosCloseCircleOutline onClick={ ()=>{this.setState({display: !displaying})}}/>
                </div>     
                <ul className={(shown && true) ? "nav-links open col-s-12 col-m-5 col-7 col-l-6 no-margin center": "nav-links col-s-12 col-m-5 col-7 col-l-6 no-margin center" }>
                    <li><Link to="/courses">Todos los Cursos</Link></li>
                    <li><Link to="/mycourses">Cursos Registrados</Link></li>
                    <li className="user-menu" onClick={ ()=>{this.setState({display: !displaying})}}><IoIosSettings/></li>
                </ul>
                <ul className={displaying ? "menu-links open col-s-12 col-m-5 col-3 col-l-3 no-margin center no-padding": 
                "menu-links col-s-12 col-m-5 col-3 col-l-3 no-margin center no-padding" }>
                    <li><h2>Bienvenido</h2></li>
                    {userMenu}
                    <li><a onClick={this.logoutOnClick}><IoMdLogOut/> Cerrar Sesión</a></li>
                </ul>
            </header>
            );       
        }
        else{
            return(   
            <header className="col-s-12">
                <div className="title col-s-7 col-m-5 col-12 no-margin no-padding">
                    <Link to="/"><img src={img} alt="Logo Learning Basics" width="200"/></Link>
                    
                </div>
                <div onClick={ ()=>{this.setState({open: !shown})}} className="burger" id="hmb">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>     
                <ul className={ shown ? "nav-links open col-s-12 col-m-5 col-5 col-l-4 no-margin center": "nav-links col-s-12 col-m-5 col-5 col-l-4 no-margin center" }>
                    <li><Link to="/courses">Cursos</Link></li>
                    <li><Link to="/subscription">Subscripciones</Link></li>
                    <li><Link to="/login">Inicia Sesión</Link></li>
                </ul>
            </header>
            );       
        }
    }
}