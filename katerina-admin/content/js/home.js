import styles from "../scss/home.scss";
import background from "../images/background.jpg";
import $ from "jquery";

const RAINBOW = {
    1: "#D50000",
    2: "#FF6D00",
    3: "#FFD600",
    4: "#00C853",
    5: "#0091EA",
    6: "#2962FF",
    7: "#AA00FF"
};

const random = (min = 1, max = 7) => {
    return Math.floor((Math.random() * (max - min + 1)) + 1)
};

const rainbowText = context => {
    const letters = context.text();
    context.text("");
    const lettersContext = $(`<div class="letters-context"></div>`)
        .appendTo(context);
    for (let i = 0; i < letters.length; i++) {
        const color = random();
        $(`<span>${letters[i]}</span>`)
            .css("color", RAINBOW[color])
            .appendTo(lettersContext);  
    }
};

const makeLogo = context => {
    context.find(".admin-mark").remove();
    const width = context.width();
    const height = context.height();
    const actualWidth = context.find(".letters-context").width();
    const letterHeight = context.find("span:eq(0)").height();
    const color = random();
    $(`<mark class="admin-mark">admin</mark>`)
        .css({
            "right": (width - actualWidth) / 2,
            "bottom": (height - letterHeight) / 2 - 10,
            "color": RAINBOW[color]
        })
        .appendTo(context);
};

function debounce(func, ms) {
    let timer = null;
    return function (...args) {
        const onComplete = () => {
            func.apply(this, args);
            timer = null;
        }
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(onComplete, ms);
    };
};

const activeTextField = field => {
    if(field.val() || field.is(":-webkit-autofill")) {
        field.addClass("on-full");
    } else {
        field.removeClass("on-full");
    }
};

const initTextField = field => {
    const wrapper = field.closest(".field-wrapper");
    field.on("focus", () => {
        wrapper.addClass("on-focus");
    }).on("blur", () => {
        wrapper.removeClass("on-focus");
        activeTextField(field);
    });
    activeTextField(field);
};

const onPageLoad = context => {
    const header = context.find(".page-header");
    const loginContext = context.find("#login");
    loginContext.css({
        "margin-top": header.height() + 30
    });
    loginContext.css("visibility", "visible");
    loginContext.find(".field").each(
        (idx, element) => initTextField($(element))
    );
};

$(document).ready(() => {
    const appName = $(".app-name");
    rainbowText(appName);
    makeLogo(appName);
    $(window).on("resize", debounce(() => makeLogo(appName), 20));

    onPageLoad($(".page"));
});