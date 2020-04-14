import React from 'react';
import Page from '../../Page';
import {Link} from 'react-router-dom';
import { DiCss3,DiHtml5,DiPhp } from "react-icons/di";
export default ({auth})=>{
    return (
        <Page pageURL="WELCOME?" auth={auth}>
            <section className="page-landing">
                <div className="landing-photo col-s-12 col-m-9 col-10 no-padding">
                    <h2 className="col-s-12">Bienvenidos al Futuro del Aprendizaje</h2>
                    <Link className="button-3 col-s-8 col-m-5 col-3" to="/courses">Ver Cursos</Link>
                </div>
                <h2 className="col-s-12">Populares</h2>
                <section className="courses col-s-12 col-m-3 col-2 no-padding">
                    <h2 className="col-s-12">Populares</h2>
                    <Link className="info" to="/landingcourse/5e93dbee6ddabd5ba4554503"><span><DiHtml5/></span></Link>
                    <Link className="info" to="/landingcourse/5e93dc176ddabd5ba4554504"><span><DiCss3/></span></Link>
                    <Link className="info" to="/landingcourse/5e93dc3e6ddabd5ba4554505"><span><DiPhp/></span></Link>
                </section>
            </section>
        </Page>
    );
}