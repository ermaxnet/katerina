import styles from "../scss/cabinet.scss";
import jQuery from "jquery";
import Sight from "../../../models/sight";

(function($) {
    const getCookie = name => {
        var matches = document.cookie.match(
            new RegExp(
                "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"
            )
        );
        return matches ? decodeURIComponent(matches[1]) : null;
    };

    const createDataTable = data => {
        const table = $("#sights");
        if(!data || !data.length) {
            return;
        }
        data = data.map(sight => new Sight(sight));
        const tbody = $(`<tbody class="data-table__content"></tbody>`).appendTo(table);
        data.forEach(sight => {
            const coords = sight.coords || {};
            coords.lat = !coords.lat ? null : coords.lat.toFixed(2);
            coords.lon = !coords.lon ? null : coords.lon.toFixed(2);
            const tags = sight.tags.map(tag => {
                return `<a class="link" href="https://www.instagram.com/explore/tags/${tag.replace(/^#/i, "")}/">${tag}</a>`;
            }).join(" ");
            tbody.append(`
                <tr>
                    <td class="data-table__content_value">
                        <span>${sight.name}</span>
                    </td>
                    <td class="data-table__content_value number">
                        <span>${sight.existKey}</span>
                    </td>
                    <td class="data-table__content_value">
                        <span>lat: ${coords.lat}, lon: ${coords.lon}</span>
                    </td>
                    <td class="data-table__content_value">
                        ${tags}
                    </td>
                    <td class="data-table__content_value number">
                        <span>${sight.rate}</span>
                    </td>
                    <td class="data-table__content_value">
                        <a class="link" href="mailto:${sight.email}">${sight.email}</a>
                    </td>
                    <td class="data-table__content_value">
                        <span>${sight.updatedAt.format("DD.MM.YYYY")}</span>
                    </td>
                    <td class="data-table__content_value"></td>
                </tr>`
            );
        });
    };
      
    const onPageLoad = token => {
        $.ajax({
            method: "GET",
            url: "http://localhost:3000/api/admin/all-sights",
            dataType: "json",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).done(items => {
            createDataTable(items);
        });
    };

    $(document).ready(() => {
        const token = getCookie("kamin");
        if(!token) {
            return window.location.href = "/admin/home/index";
        }
        onPageLoad(token);
    });
})(jQuery);
