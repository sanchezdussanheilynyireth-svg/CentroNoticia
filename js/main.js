/* =====================================================
   CENTRO NOTICIAS HUILA
===================================================== */


/* =====================================================
   ELEMENTOS
===================================================== */

const pages =
    document.querySelectorAll(".page");

const pageButtons =
    document.querySelectorAll("[data-page]");

const navLinks =
    document.querySelectorAll(".nav-link");

const heroTrack =
    document.getElementById("heroTrack");

const heroSticky =
    document.getElementById("heroSticky");

const poster =
    document.getElementById("poster");

const navigation =
    document.getElementById("navigation");

const menuButton =
    document.getElementById("menuButton");


/* =====================================================
   CAMBIO DE PÁGINA
===================================================== */

function showPage(pageName, updateHistory = true) {


    /*
        BUSCAMOS LA PÁGINA

        (Primero verificamos que exista. Si no existe
        en este archivo, NO ocultamos nada; si no, en
        nosotros.html la página se quedaba en blanco.)
    */

    const selectedPage =
        document.getElementById(pageName);


    if (!selectedPage) {

        return;

    }


    /*
        OCULTAMOS TODAS
    */

    pages.forEach(page => {

        page.classList.remove("active");

    });


    /*
        MOSTRAMOS SOLO ESA
    */

    selectedPage.classList.add("active");


    /*
        ACTUALIZAMOS EL MENÚ
    */

    navLinks.forEach(link => {

        link.classList.remove("active");


        if (
            link.dataset.page === pageName
        ) {

            link.classList.add("active");

        }

    });


    /*
        CERRAR MENÚ MÓVIL
    */

    navigation.classList.remove("open");


    /*
        VOLVER ARRIBA
    */

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    /*
        CAMBIAR URL

        Ejemplo:

        #inicio
        #economia
        #cultura
        #contacto
    */

    /*
        Solo guardamos historial cuando el usuario
        hace clic. Si venimos de "atrás/adelante"
        o de la carga inicial, NO agregamos otra
        entrada (si no, el botón atrás se traba).
    */

    if (updateHistory) {

        history.pushState(
            null,
            "",
            "#" + pageName
        );

    }


    /*
        Al entrar a Inicio recalculamos el ancho
        y dejamos las mitades en su lugar.
    */

    if (pageName === "inicio") {

        resetParallax();

        requestParallax();

    }

}


/* =====================================================
   BOTONES
===================================================== */

pageButtons.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            const page =
                this.dataset.page;

            /*
                Si esa página no está en este archivo
                (por ejemplo, estamos en nosotros.html),
                vamos a index.html con esa sección.
            */

            if (!document.getElementById(page)) {

                /*
                    Páginas que viven en su propio archivo.
                */

                const externalPages = {
                    quienes: "nosotros.html",
                    servicios: "servicios.html"
                };

                window.location.href =
                    externalPages[page] ||
                    ("index.html#" + page);

                return;

            }

            showPage(page);

        }
    );

});


/* =====================================================
   MENÚ MÓVIL
===================================================== */

menuButton.addEventListener(
    "click",
    () => {

        navigation.classList.toggle(
            "open"
        );

    }
);


/* =====================================================
   PARALLAX POR PIEZAS
===================================================== */


/*
    El póster está partido en 6 capas + logo.

    - Al BAJAR: las capas se separan (y se desvanecen).
    - Al SUBIR: se juntan y vuelve a formarse el póster.
    - El logo y el mini mapa hacen ZOOM en vez de moverse.

    Todo depende de un solo número: --p
    0 = póster completo, 1 = totalmente separado.

    Las direcciones y distancias se cambian en el CSS
    (.layer-1, .layer-2 ... .layer-logo).
*/


/*
    SUAVIDAD (0.05 muy suave / lento ... 1 = sin suavizado)
*/

const SMOOTH = 0.14;


const reduceMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );


let currentP = 0;
let animating = false;


function setProgress(value) {

    if (!poster) {

        return;

    }

    poster.style.setProperty(
        "--p",
        value.toFixed(4)
    );

    /* lo usa el indicador "Desliza" */
    heroSticky.style.setProperty(
        "--scroll-p",
        value.toFixed(4)
    );

}


function computeTarget() {

    if (!heroTrack || !heroSticky) {

        return 0;

    }

    if (
        !document
            .getElementById("inicio")
            .classList
            .contains("active")
    ) {

        return 0;

    }

    if (reduceMotion.matches) {

        return 0;

    }

    /*
        Cuánto se puede recorrer mientras el
        escenario está pegado (sticky).
    */

    const stickyTop =
        parseFloat(
            getComputedStyle(heroSticky).top
        ) || 0;

    const distance =
        heroTrack.offsetHeight -
        heroSticky.offsetHeight;

    if (distance <= 0) {

        return 0;

    }

    const scrolled =
        stickyTop -
        heroTrack.getBoundingClientRect().top;

    return Math.min(
        Math.max(scrolled / distance, 0),
        1
    );

}


function frame() {

    const target = computeTarget();

    const diff = target - currentP;

    if (Math.abs(diff) < 0.0005) {

        currentP = target;

        setProgress(currentP);

        animating = false;

        return;

    }

    currentP += diff * SMOOTH;

    setProgress(currentP);

    window.requestAnimationFrame(frame);

}


function requestParallax() {

    if (!animating) {

        animating = true;

        window.requestAnimationFrame(frame);

    }

}


window.addEventListener(
    "scroll",
    requestParallax,
    {
        passive: true
    }
);


window.addEventListener(
    "resize",
    requestParallax
);


/* =====================================================
   REINICIAR PARALLAX
===================================================== */

function resetParallax() {

    currentP = 0;

    setProgress(0);

}


/* =====================================================
   WHATSAPP
===================================================== */


/*
    CAMBIA ESTE NÚMERO.

    IMPORTANTE:

    Para Colombia debe comenzar
    con 57.

    Ejemplo:

    573001234567
*/


const whatsappNumber =
    "573000000000";


const whatsappMessage =
    encodeURIComponent(
        "Hola, Centro Noticias Huila. Me gustaría comunicarme con ustedes."
    );


const whatsappURL =
    "https://wa.me/" +
    whatsappNumber +
    "?text=" +
    whatsappMessage;


const whatsappLink =
    document.getElementById(
        "whatsappLink"
    );


const footerWhatsapp =
    document.getElementById(
        "footerWhatsapp"
    );


if (whatsappLink) {

    whatsappLink.href =
        whatsappURL;

}


if (footerWhatsapp) {

    footerWhatsapp.href =
        whatsappURL;

}


/*
    Botones con data-whatsapp="mensaje":
    abren WhatsApp con ese mensaje ya escrito.
*/

document
    .querySelectorAll("[data-whatsapp]")
    .forEach(link => {

        link.href =
            "https://wa.me/" +
            whatsappNumber +
            "?text=" +
            encodeURIComponent(link.dataset.whatsapp);

    });


/* =====================================================
   CÓDIGO QR
===================================================== */

const qrContainer =
    document.getElementById(
        "qrcode"
    );


if (
    qrContainer &&
    typeof QRCode !== "undefined"
) {

    new QRCode(
        qrContainer,
        {

            text: whatsappURL,

            width: 190,

            height: 190,

            colorDark:
                "#034d1d",

            colorLight:
                "#ffffff",

            correctLevel:
                QRCode.CorrectLevel.H

        }
    );

}


/* =====================================================
   LEER URL
===================================================== */

function loadPageFromURL() {


    let pageName =
        window.location.hash
            .replace("#", "");


    /*
        Si no existe página,
        abrimos Inicio.
    */

    if (
        !pageName ||
        !document.getElementById(pageName)
    ) {

        pageName = "inicio";

    }


    showPage(pageName, false);


    /*
        Reiniciamos parallax
        cuando volvemos a Inicio.
    */

    if (
        pageName === "inicio"
    ) {

        resetParallax();

        requestParallax();

    }

}


/* =====================================================
   BOTÓN ATRÁS / ADELANTE
===================================================== */

window.addEventListener(
    "popstate",
    loadPageFromURL
);


/* =====================================================
   INICIAR
===================================================== */

window.addEventListener(
    "load",
    loadPageFromURL
);