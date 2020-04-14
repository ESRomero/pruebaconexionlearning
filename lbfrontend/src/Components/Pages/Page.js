import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
export default ({pageURL, children, auth})=>{
    return(
        <section>
            <Header auth={auth} title={pageURL||'Page'}></Header>
            <main>
                {children}
            </main>
            <Footer auth={auth}></Footer>
        </section>
    );
}