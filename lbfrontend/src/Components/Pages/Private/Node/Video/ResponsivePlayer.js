import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import './responsive-player.css';
export default(props) => {
  return (
    <div className='player-wrapper'>
      <ReactPlayer
        className='react-player'
        url={props.url}
        width='100%'
        height='100%'
        volume= '0.10'
        controls = {true}
        onProgress={props.onProgress}
       
      />
    </div>
  )
}