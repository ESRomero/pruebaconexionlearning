import React, {Component} from 'react';
import {BrowserRouter as Router, Route,Switch,Redirect} from 'react-router-dom';
import {setJWTBearer, setLocalStorage, getLocalStorage, removeLocalStorage} from './Components/Utilities/Utilities';
import  PrivateRoute  from './Components/SecureRoutes/SecureRoutes';
/*--------------Public Routing------------------*/
import Home from './Components/Pages/Public/Home/Home';
import Login from './Components/Pages/Public/Login/Login';
import Reactivate from './Components/Pages/Public/Reactivate/Reactivate';
import Forgot from './Components/Pages/Public/Forgot/Forgot';
import AllCourses from './Components/Pages/Public/Courses/Courses';
import Register from './Components/Pages/Public/Register/Register';
import Subs from './Components/Pages/Public/Subscripciones/Subs';
import Canceled from './Components/Pages/Public/Canceled/Canceled';
import Change from './Components/Pages/Public/Forgot/Change/Change';
import LandingCourses from './Components/Pages/Public/LandingCourses/LandingCourses';
/*--------------Private Routing------------------*/
import MyCourses from './Components/Pages/Private/MyCourses/MyCourses';
import UpdateUser from './Components/Pages/Private/UpdateUser/UpdateUser';
import UpdatePassword from './Components/Pages/Private/UpdatePassword/UpdatePassword';
import Nodes from './Components/Pages/Private/Nodes/Nodes';
import NodeDrag from './Components/Pages/Private/Node/DragNode';
import NodeText from './Components/Pages/Private/Node/TextNode';
import NodeRegex from './Components/Pages/Private/Node/RegexNode';
import NodeVideo from './Components/Pages/Private/Node/VideoNode';
import CreateCourse from './Components/Pages/Private/Admin/Courses/CreateCourse';
import UpdateCourse from './Components/Pages/Private/Admin/Courses/UpdateCourse';
import CreateNode from './Components/Pages/Private/Admin/Nodes/CreateNode';
import UpdateNode from './Components/Pages/Private/Admin/Nodes/UpdateNode';
import Access from './Components/Pages/Private/Admin/Access/Access';
import Level from './Components/Pages/Private/Admin/Access/Level';
import NewPage from './Components/Pages/Private/Admin/Pages/NewPage';
import Approved from './Components/Pages/Public/Approved/Approved';
import Pages from './Components/Pages/Private/Admin/Pages/Pages';
import Deactivate from './Components/Pages/Private/Deactivate/Deactivate';
/*--------------Errors--------------------------*/
import Found from './Components/Pages/Public/Found/Found';
import './App.css';

class App extends Component{
  constructor(){
    super();
    this.state = {
      user: getLocalStorage('user')||{},
      jwt: getLocalStorage('jwt')||'',
      id: getLocalStorage('id')||'',
      type: getLocalStorage('type')||'',
      isLogged: false
    }
    if(this.state.jwt!==''){
      this.state.isLogged=true;
      setJWTBearer(this.state.jwt);
    }
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }
  login(user){
    const {jwt, ...fuser} = user;
    this.setState({
      ...this.state,
      isLogged:true,
      user: fuser,
      id: fuser.user._id,
      type:fuser.user.userType,
      jwt: jwt
    });
    setJWTBearer(jwt);
    setLocalStorage('jwt', jwt);
    setLocalStorage('user', fuser);
    setLocalStorage('id', this.state.id);
    setLocalStorage('type',this.state.type)
  }

  logout(){
    removeLocalStorage('jwt');
    removeLocalStorage('user');
    removeLocalStorage('id');
    this.setState({
      ...this.state,
      isLogged:false,
      user:{},
      jwt:''
    });
  }
  render(){
    const auth = {
      isLogged:this.state.isLogged,
      user:this.state.user,
      id: this.state.id,
      type:this.state.type,
      logout: this.logout,
    };
    console.log(this.state.type)
    return (
      <Router>
        <Switch>
          <Route render={(props) => { return (<Home {...props} auth={auth} />) }} path="/" exact />
          <Route render={(props) => { return (<Login {...props} auth={auth} login={this.login} />)}} path="/login" exact/>
          <Route render={(props) => { return (<Register {...props} auth={auth}/>) }} path="/register/:plan" component={Register}  exact/>
          <Route render={(props) => { return (<Forgot {...props} auth={auth}/>)}} path="/forgot" exact/>
          <Route render={(props) => { return (<AllCourses {...props} auth={auth} />) }} path="/courses" exact/>
          <Route render={(props) => { return (<LandingCourses {...props} auth={auth} />) }} path="/landingcourse/:id"/>
          <Route render={(props) => { return (<Subs {...props} auth={auth} />) }} path="/subscription" exact/>
          <Route render={(props) => { return (<Change {...props} auth={auth} />) }} path="/forgot/:email/:token" exact />
          <Route render={(props) => { return (<Canceled {...props} auth={auth} />) }} path="/canceled" exact />
          <Route render={(props) => { return (<Approved {...props} auth={auth} />) }} path="/approved" exact />
          <Route render={(props) => { return (<Reactivate {...props} auth={auth} />) }} path="/reactivate" exact />
          
          <Route render={(props) => { return (<Found {...props} auth={auth} />) }} path="/404" exact />
          <PrivateRoute component={MyCourses} path="/mycourses" exact auth={auth}/>
          <PrivateRoute component={Deactivate} path="/deactivate" exact auth={auth}/>
          
          <PrivateRoute component={UpdatePassword} path='/updatePass' exact auth={auth}/>
          <PrivateRoute component={UpdateUser} path="/update" exact auth={auth}/>
          <PrivateRoute component={Nodes} path='/course/classes/:id' auth={auth}/>
          <PrivateRoute component={NodeDrag} path='/course/class/d/:idc/:idn' auth={auth}/>
          <PrivateRoute component={NodeText} path='/course/class/t/:idc/:idn' auth={auth}/>
          <PrivateRoute component={NodeRegex} path='/course/class/r/:idc/:idn' auth={auth}/>
          <PrivateRoute component={NodeVideo} path='/course/class/v/:idc/:idn' auth={auth}/>
          <PrivateRoute component={CreateCourse} path='/courses/newCourse' auth={auth}/>

          <PrivateRoute component={UpdateCourse} path='/courses/updateCourse/:id' auth={auth}/>
          <PrivateRoute component={CreateNode} path='/courses/newNode/:idc' auth={auth}/>
          <PrivateRoute component={UpdateNode} path='/courses/updateNode/:idc/:idn' auth={auth}/>

          <PrivateRoute component={Access} path="/access" exact auth={auth}/>
          <PrivateRoute component={Level} path="/access/level/:userType/:op" exact auth={auth}/>
          <PrivateRoute component={Pages} path="/pages" exact auth={auth}/>
          <PrivateRoute component={NewPage} path="/pages/newPage" exact auth={auth}/>
          <PrivateRoute component={NewPage} path="/pages/modify/:id" exact auth={auth}/>
        <Redirect to="/404" auth={auth}/>
        </Switch>
      </Router>
      );  
  }
}

export default App;
