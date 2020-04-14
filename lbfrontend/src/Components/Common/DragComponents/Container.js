import React from 'react';

function Container (props) {
    const drop = e =>{
        e.preventDefault();
        const card_id = e.dataTransfer.getData('card_id');

        var ans = document.getElementById("Container_Answer");

        const card = document.getElementById(card_id)
        card.style.dislpay = 'block';

        if(ans.children.length===0){
            ans.appendChild(card);
        }else{
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
            ans.appendChild(card);
        }

    }

    const dragOver = e =>{
        e.preventDefault();
    }

    return(
        <div
            id={props.id}
            onDrop={drop}
            onDragOver={dragOver}
            className={props.className}
            top={props.top}
            left={props.left}
        >
            {props.children}
        </div>
    )
}
export default Container