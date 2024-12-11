import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import AppComponent from "./AppComponent";

// /**
//  * This is the main entry point of the portlet.
//  *
//  * See https://tinyurl.com/js-ext-portlet-entry-point htmlFor the most recent
//  * information on the signature of this function.
//  *
//  * @param {Object}
//  *            params a hash with values of interest to the portlet
//  * @return {void}
//  */
export default function (elementId) {
  ReactDOM.render(
    <Router>
      <AppComponent />
    </Router>,
    document.getElementById(elementId)
  );
}
