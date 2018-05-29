import React, { Component } from "react";
import PropTypes from "prop-types";
import { api } from "../../settings.json";

window.yandexApiDone = () => {
    const event = document.createEvent("Event");
    event.initEvent("yandexApiDone", true, true);
    document.dispatchEvent(event);
};

class YandexMap extends Component {
    static propTypes = {
        lang: PropTypes.string,
        mode: PropTypes.string
    }
    static defaultProps = {
        lang: "ru_RU",
        mode: "debug"
    }
    constructor(props) {
        super(props);
        this.state = {
            showMap: false
        };
    }
    componentWillMount() {
        const yandexApiDone = () => {
            this.renderMap();
            document.removeEventListener("yandexApiDone", yandexApiDone);
            delete window.yandexApiDone;
        };
        document.addEventListener("yandexApiDone", yandexApiDone);

        const yandexApi = document.createElement("script");
        const yandex = api["yandex-maps"];
        yandexApi.src = `${yandex.url}/${yandex.version}/`
            + `?lang=${this.props.lang}&mode=${this.props.mode}&ns=yandexApi`
            + "&onload=yandexApiDone";
        document.head.appendChild(yandexApi);
    }
    renderMap() {
        if(!this.mapContext) {
            return;
        }
        this.mapContext.style.height = "400px";
        this.map = new window.yandexApi.Map(this.mapContext, {
            center: [ 53.90, 27.68 ],
            zoom: 6,
            controls: [ "searchControl", "rulerControl" ]
        });
       /*  window.yandexApi.borders.load("BY").then(geoBY => {
            geoBY.features.forEach(feature => {
                const geoObject = new window.yandexApi.GeoObject(feature);
                this.map.geoObjects.add(geoObject);
            });
        }); */
    }
    render() {
        return (
            <div className="YandexMap" ref={ref => this.mapContext = ref}>
            </div>
        );
    }
};

export default YandexMap;
