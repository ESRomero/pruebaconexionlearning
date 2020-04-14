import React, { Component } from "react";
import {getLocalStorage, setLocalStorage, removeLocalStorage } from '../../Utilities/Utilities';

class Option extends Component {
  constructor() {
    super();
    this.state = {
      left: "0px",
      top: "0px"
    };
    this.dragElementRef = React.createRef();
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleOnDrop = this.handleOnDrop(this);
  }

  componentDidMount(){
    var cont = "Container_"+this.props.id;
    var container = document.getElementById(cont);
    this.setState({
      left: container.style.left,
      top: container.style.top
    },function(){
      this.render();
    });
  }

  handleDragStart(e) {
    const target = e.target;

    e.dataTransfer.setData('card_id', target.id);

    //setTimeout(()=>{
     //   target.style.display="none"
    //},0);
  }

  handleTouchMove(e) {
    // grab the loaction of the touch
    var touchLocation = e.targetTouches[0];

    const target = e.target;

    setLocalStorage('card_id', target.id);

    this.setState({
      left: (touchLocation.pageX)+"px",
      top: (touchLocation.pageY)+"px"
    });
  }

  handleTouchEnd(e) {
    var x3 = document.getElementById("Container_Answer").getBoundingClientRect();
    var x2 = this.state.left;
    var y2 = this.state.top;

    var text_left = x2.substring(0,x2.length-2);
    var num_left = parseInt(text_left);
    var text_top = y2.substring(0,y2.length-2);
    var num_top = parseInt(text_top);
    var ans = document.getElementById("Container_Answer");
    const card_id = getLocalStorage('card_id');

    if(ans.childNodes.length===1){
      if(num_top >= x3.top && num_top<=(x3.top+40)&&num_left >= x3.left && num_left <=(x3.left+220)){
          var prev_ans = ans.children[0].id;
          var obj = document.getElementById(prev_ans);
          ans.removeChild(obj);
          var og = document.getElementById("Container_"+prev_ans);
          og.appendChild(obj);
          
          var cont_txt = "Container_"+prev_ans;
          var cont = document.getElementById(cont_txt);
          var rect = cont.getBoundingClientRect();
          obj.style.top = ((rect.top+15)+"px");
          obj.style.left = ((rect.left+15)+"px")
      }
    }

    if(ans.childNodes.length===0){
      if(num_top >= x3.top && num_top<=(x3.top+40)){
        if(num_left >= x3.left && num_left <=(x3.left+220)){
          removeLocalStorage('card_id');
          const card = document.getElementById(card_id)
          ans.appendChild(card);
        }
      }
    }
  }

  handleOnDrop(e){

  }

  render() {
    return (
          <div
            style={{ top: this.state.top, left: this.state.left }}
            className={this.props.className}
            id={this.props.id}
            ref={this.dragElementRef}
            draggable={this.props.draggable}
            onDragStart={this.handleDragStart}
            onTouchMove={this.handleTouchMove}
            onTouchEnd={this.handleTouchEnd}
            onDrop={this.handleOnDrop}
            title={this.props.title}
          >
            {this.props.children}
          </div>
    );
  }
}

export default Option;