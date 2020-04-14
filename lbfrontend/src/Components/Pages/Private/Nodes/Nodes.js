import  React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import {Link} from 'react-router-dom';
import { IoIosInformationCircleOutline, IoIosSync, IoMdAddCircle, IoIosImage, IoMdPlay } from 'react-icons/io';

import Page from '../../Page';
import { saxios } from '../../../Utilities/Utilities';
export default class Nodes extends Component {
    constructor(){
        super();
        this.state={
            data:null,
            courseID:'',
            hasMore: false,
            page:1
        }
    }


    componentDidMount(){
        const courseID = this.props.match.params.id;
        this.setState({'courseID': courseID})
        const uri = `/api/user/course/nodes/${this.props.auth.id}/${courseID}`;
        saxios.get(uri)
        .then(
            ({data})=>{
                const alldata = [];
                data.map((e)=>alldata.push(e)); 
                this.setState({
                    'data': alldata,
                    'hasMore': false
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
    };

    render(){
        let txt='';
        var uiItems = [];
        if(this.state.data!==null){
            uiItems = this.state.data.map(
                (item)=>{
                    if(item.nodeCompletion===false){
                        txt = "No Completado";
                    }else{
                        txt = "Completado";
                    }
                    var uri = '';
                    if(item.completionType==="Regex"){
                        uri= `/course/class/r/${this.state.courseID}/${item.nodeNumber}`;
                    }
                    else if(item.completionType==="Drag"){
                        uri = `/course/class/d/${this.state.courseID}/${item.nodeNumber}`
                    }
                    else if(item.completionType==="Text"){
                        uri = `/course/class/t/${this.state.courseID}/${item.nodeNumber}`
                    }
                    else if(item.completionType==="Video"){
                        uri = `/course/class/v/${this.state.courseID}/${item.nodeNumber}`
                    }
                    else{
                        uri = `/course/class/notdefined/${this.state.courseID}/${item.nodeNumber}`
                    }
                    return(
                        <div className='item' key={item.nodeNumber}>
                            <span>{item.nodeName}</span>
                            <span>Estado: {txt}</span>
                            <span className='updateListItem'>
                                <Link to={uri}>
                                    <IoMdPlay size='1em' color="#000"/>
                                    Realizar clase
                                </Link></span>
                        </div>
                    );
                }
            );    
        }
        if(!uiItems.length) uiItems.push(
            <div className='list-items' key='pbListAddOne'>
                <span>No hay nada aquí</span>
            </div>
        );
        return(
            <Page pageTitle="Course classes" auth={this.props.auth}>
                <div ref={(ref)=> this.scrollParentRef = ref} className="page-list">
                        {uiItems}
                </div>
            </Page>
        );
    }
}