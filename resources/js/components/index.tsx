require("../bootstrap");

import { StrictMode } from "react";
import App from "./App";
import ReactDOM from "react-dom";
import "bulma/css/bulma.min.css";
import "../../css/app.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../store";

if (document.getElementById("root")) {
    ReactDOM.render(
        <StrictMode>
            <Provider store={store}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </Provider>
        </StrictMode>,
        document.getElementById("root")
    );
}
