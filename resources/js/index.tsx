require('./bootstrap');
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./store";
import App from "./components/App";
import "bulma/css/bulma.min.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";

if (document.getElementById("root")) {
    ReactDOM.render(
        <React.StrictMode>
            <Provider store={store}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </Provider>
        </React.StrictMode>,
        document.getElementById("root")
    );
}
