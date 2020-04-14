import  React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { IoIosInformationCircleOutline, IoIosSync, IoMdAddCircle, IoIosImage } from 'react-icons/io';
import {Link} from 'react-router-dom';
import Loading from '../../../Common/Loading/Loading';
import Page from '../../Page';
import { paxios, saxios } from '../../../Utilities/Utilities.js';
export default class Courses extends Component {
  constructor(){
    super();
    this.state={
     items:[],
     hasMore:true,
     page:1,
     itemsToLoad:5
    }
    this.loadMore = this.loadMore.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
 }
 onClickHandler(e){
    const CourseID = e.target.href.substring(37,e.target.href.length)
    const uri = `/api/user/courses/add`;
    saxios.post(uri,{
      userID: this.props.auth.id,
      courseID: CourseID
    })
    .then(
      ({data})=>{
      }
    )
    .catch(
      (err)=>{
        console.log(err);
      }
    )
 }
 loadMore(page){
    const items  = this.state.itemsToLoad;
    const uri = `/api/public/courses/${page}/${items}`;
    paxios.get(uri)
      .then(
        ({data})=>{
          //console.log(data);
          const { courses:apiItems, total} = data;
          const loadedItems = this.state.items;
          apiItems.map((e)=>loadedItems.push(e));
          if(total){
              this.setState({
                'items': loadedItems,
                'hasMore': (page * items < total)
               });
           } else {
             this.setState({
               'hasMore': false
             });
           }
         }
       )
       .catch(
         (err)=>{
           console.log(err);
         }
       );
   }
   render() {
    let link = "/subscription";
    let dsc ="";
    if(this.props.auth.isLogged){
      link="/course/classes/";
      dsc="Iniciar"
    }
    if(this.props.auth.isLogged===true && this.props.auth.type==="ADM"){
      link="/courses/updateCourse/";
      dsc="Modificar"
    }
    const uiItems = this.state.items.map(
      (item)=>{
        //console.log(item.courseName);
        return (
          <div className='listItem col-s-5 col-m-3 col-2' key={item._id}>
            <h1 className="main-color">{item.courseName} </h1>
            <br />
            <div className="line"></div>
            <br />
            <h2>Tiempo de Completación <br/> {item.courseHours} H</h2>
            <p>{item.courseDesc}</p>
            <br />
            <div className="line"></div>
            <br />
            {(this.props.auth.isLogged)? <Link className="button-3" onClick={this.onClickHandler} to={link+item._id}>{dsc}</Link>:
            <Link className="button-3" onClick={this.onClickHandler} to={link}>Registrar</Link> }
          </div>);
      }
    );
  
    if (!uiItems.length) uiItems.push(
      <div className="listItem" key="pbListAddOne">
        <span>No hay nada aquí</span>
      </div>);
  
    return (
      <Page pageURL="/courses " auth={this.props.auth}>
        <div className="page-courses">
        <InfiniteScroll
              pageStart={0}
              loadMore={this.loadMore}
              hasMore={this.state.hasMore}
              useWindow={false}
              threshold={108}
              getScrollParent={()=>this.scrollParentRef}
              loader={<Loading key="pbListLoading" className="listItem center col-s-5 col-offset-1 col-m-3 col-2"/>}
              className="list col-s-12 col-offset-m-1 col-m-11 col-9 col-offset-2"
              >
                {uiItems}
            </InfiniteScroll>
        </div>
            
      </Page>
     );
    }
  }
  