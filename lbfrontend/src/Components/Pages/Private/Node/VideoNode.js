import React, { Component, useState } from "react";
import Page from "../../Page";
import Input from "../../../Common/Input/Input";
import Button_F from "../../../Common/Button/Button";
import { Link, Redirect } from "react-router-dom";
import { paxios, setLocalStorage } from "../../../Utilities/Utilities";
import { saxios } from "../../../Utilities/Utilities";
import ResponsivePlayer from "./Video/ResponsivePlayer";
import "./Video/marker.css";
export default class VideoNode extends Component {
  constructor() {
    super();
    this.state = {
      data: {
        nodeRequest: ""
      },
      courseID: "",
    };
    this.onClickSubmit = this.onClickSubmit.bind(this);
  }

  componentDidMount() {
    const nodeID = this.props.match.params.idn;
    this.setState({ nodeNumber: nodeID });
    const courseID = this.props.match.params.idc;
    this.setState({ courseID: courseID });
    const uri = `/api/user/course/nodes/${this.props.auth.id}/${courseID}`;

    saxios
      .get(uri)
      .then(({ data }) => {
        this.setState(
          {
            data: data[nodeID - 1],
            "WatchComplete,setWatchComplete": false,
          },
          function () {
            this.render();
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onClickSubmit(e) {
    const courseID = this.props.match.params.idc;
    this.setState({ courseID: courseID });
    const nodeID = this.props.match.params.idn;
    this.setState({ nodeNumber: nodeID });
    const uri = `/api/user/course/class/${courseID}`;
    saxios
      .put(uri, {
        answer: this.state.data.rightAnswer,
        userid: this.props.auth.id,
        NodeNumber: nodeID,
      })
      .then(({ data }) => {
        console.log({ data });
        this.setState({ ...this.state, redirectTo: true });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    if (this.state.redirectTo) {
      var location = "/course/classes/" + this.props.match.params.idc;
      return <Redirect to={location} />;
    }

    if (this.state.data === null) {
      var NodeInfo = [
        "nodeNumber" > 0,
        "nodeName" > "blank",
        "nodeDesc" > "blank",
        "nodeDialogue" > "blank",
        "completionType" > "blank",
        "rightAnswer" > "blank",
        "nodeCompletion" > "blank",
        "nodeRequest" > "blank"
      ];
    } else {
      var NodeInfo = [
        this.state.data.nodeNumber,
        this.state.data.nodeName,
        this.state.data.nodeDesc,
        this.state.data.nodeDialogue,
        this.state.data.completionType,
        this.state.data.rightAnswer,
        this.state.data.nodeCompletion,
        this.state.data.nodeRequest,
      ]; //No imprime booolean completion
    }

    const handleWatchComplete = ({ played }) => {
      if (played >= 0.7 && !this.state.WatchComplete) {
        this.setState({ WatchComplete: true });
      }
    };

    return (
      <Page pageURL="Class" auth={this.props.auth}>
        <br />
        <br />
        <br />
        <br />
        <span>
          <ul>
            <li>
              <b>Titulo: </b> {NodeInfo[1]}
            </li>
            <li>
              <b>Descripción: </b> {NodeInfo[2]}
            </li>
            <li>
              <b>Instrucciones: </b> {NodeInfo[3]}
            </li>
          </ul>
        </span>

        <div>
          <ResponsivePlayer
            url={NodeInfo[7]}
            onProgress={handleWatchComplete}
          />
        </div>

        <button
          className={
            this.state.WatchComplete
              ? "button-3 col-s-11 marker marker--Is-Complete"
              : "button-4 col-s-11 marker marker--Not-Complete"
          }
          disabled={!this.state.WatchComplete}
          onClick={this.onClickSubmit}
        >
          Completar y continuar
        </button>
      </Page>
    );
  }
}
