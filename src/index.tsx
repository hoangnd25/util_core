import { globalCSS } from "@go1d/go1d";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

globalCSS();

ReactDOM.render(<App />, document.getElementById("root"));
