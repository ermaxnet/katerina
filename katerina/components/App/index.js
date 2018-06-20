import React, { Component } from "react";
import YandexMap from "../YandexMap";

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="App__map">
                    <YandexMap />
                </div>
            </div>
        );
    }
};

export default App;