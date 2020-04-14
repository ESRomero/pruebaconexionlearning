import  React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { IoIosInformationCircleOutline, IoIosSync, IoMdAddCircle, IoIosImage, IoMdPlay } from 'react-icons/io';
import {getLocalStorage} from '../../../Utilities/Utilities';
import {Link} from 'react-router-dom';

import Page from '../../Page';
import { saxios } from '../../../Utilities/Utilities';
export default class MyCourses extends Component {
    constructor(){
        super();
        this.state={
            items:[],
            hasMore:true,
            page:1,
            itemsToLoad:20,
            user: (getLocalStorage('user')||{})
        }
        this.loadMore = this.loadMore.bind(this);
    }

        loadMore(page){
            const items = this.state.itemsToLoad;
            const uri = `api/user/mycourses/${this.props.auth.id}/${page}/${items}`;
            saxios.get(uri)
            .then(
                ({data})=>{
                    const {allcourses, total} = data;
                    const loadedItems = this.state.items;
                    allcourses.map((e)=>loadedItems.push(e));
                    if(total){
                        this.setState({
                            'items':loadedItems,
                            'hasMore':(page * items < total)
                        });
                    }else{
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
            )
        };

    render(){
        const uiItems = this.state.items.map(
            (item)=>{
                return(
                    <div className='list-item' key={item._id}>
                        <span>{item.courseName}</span>
                        <span>Average Hours: {item.courseHours}</span>
                        <span className='updateListItem'>
                            <Link to={`/course/classes/${item._id}`}>
                            <IoMdPlay size='1em' color='#000'/>
                            </Link></span>
                    </div>
                );
            }
        );

        if(!uiItems.length) uiItems.push(
            <div className='list-items' key='pbListAddOne'>
                <span>No hay nada aquí</span>
            </div>
        );

        return(
            <Page pageURL="MyCourses" auth={this.props.auth}>
                    <div ref={(ref)=> this.scrollParentRef = ref} className="page-list">
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={this.loadMore}
                            hasMore={this.state.hasMore}
                            useWindow={false}
                            threshold={108}
                            getScrollParent={()=>this.scrollParentRef}
                            loader={<div key="pbListLoading" ><IoIosSync/></div>}
                            className="list"
                            >
                            {uiItems}
                        </InfiniteScroll>
                    </div>
            </Page>
        );
    }
}