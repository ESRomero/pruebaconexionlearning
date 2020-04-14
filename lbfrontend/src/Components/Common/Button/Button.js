import React, {Component} from 'react';
import './Button.css'

export default ({children})=>{
    return(
        <fieldset>
            {children}
        </fieldset>
    );
}