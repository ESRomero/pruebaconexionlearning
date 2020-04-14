import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Page from "../../Page";
import { saxios } from "../../../Utilities/Utilities";
import { DiCss3, DiHtml5, DiPhp } from "react-icons/di";
export default class LandingCourses extends Component {
  constructor() {
    super();
    this.state = {
      data: [
        "id" > 0,
        "courseName" > "blank",
        "courseDesc" > "blank",
        "courseHours" > "blank",
      ],
      courseID: "",
    };
  }
  componentDidMount() {
    const courseID = this.props.match.params.id;
    this.setState({ courseID: courseID });
    const uri = `/api/public/landingcourse/${courseID}`;

    saxios
      .get(uri)
      .then(({ data }) => {
        console.log({ data });
        this.setState(
          {
            data: data,
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

  render() {
    let link = "/subscription";
    let dsc = "";
    if (this.props.auth.isLogged) {
      link = "/course/classes/";
      dsc = "Iniciar";
    }
    var CourseInfo = [
      this.state.data._id,
      this.state.data.courseName,
      this.state.data.courseDesc,
      this.state.data.courseHours,
    ];
    let icon2use = <DiPhp className="col-offset-5 col-offset-l-7"/>;
    if (CourseInfo[0] === "5e93dbee6ddabd5ba4554503") icon2use = <DiHtml5 className="col-offset-5 col-offset-l-7"/>;

    if (CourseInfo[0] === "5e93dc176ddabd5ba4554504") icon2use = <DiCss3 className="col-offset-5 col-offset-l-7"/>;
    return (
      <Page pageURL="landingcourse" auth={this.props.auth}>
        <section className="page-landing-course">
          <div className="course-icon col-s-12 col-m-4 col-3">
            <span className="col-12">{icon2use}</span>
          </div>
          <div className="course-info col-s-12 col-m-8 col-9">
            <h1>{CourseInfo[1]}</h1>
            <div className="line"></div>
            <h2>
              Acerca del Curso: <br />
            </h2>
            <p>{CourseInfo[2]}</p>
            <br />
            <div className="line"></div>
            <h2>
              Tiempo de Completación: <br />
            </h2>
            <h3>{CourseInfo[3]} Hora(s)</h3>
            <div className="buttons col-offset-s-1">
              {this.props.auth.isLogged ? (
                <Link className="button-3 col-s-11 col-4 col-l-3 col-offset-4" to={link + CourseInfo[0]}>
                  {dsc}
                </Link>
              ) : (
                <Link className="button-3 col-s-11 col-4 col-l-3 col-offset-4" to={link}>
                  Registrar
                </Link>
              )}
            </div>
          </div>
        </section>
      </Page>
    );
  }
}
