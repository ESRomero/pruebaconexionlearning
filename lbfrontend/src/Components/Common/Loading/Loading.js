import React, { Component } from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
export default class Loading extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Loader
        type="TailSpin"
        color="#27b863"
        height={100}
        width={100}
        timeout={0}
      />
    );
  }
}
