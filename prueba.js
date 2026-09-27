// ==========================
// CANVAS
// ==========================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


// ==========================
// IMAGEN DE FONDO
// ==========================

let imagenFondo = new Image();

// Imagen de prueba desde Internet
imagenFondo.src = "https://wallpaper.forfun.com/fetch/85/855b1135ca8998149c1976a0b8661fca.jpeg";


// ==========================
// DIBUJAR
// ==========================

imagenFondo.onload = function () {

    // Dibujamos la imagen
    ctx.drawImage(
        imagenFondo,
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Oscurecemos un poco la imagen
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // ==========================
    // TÍTULO
    // ==========================

    ctx.fillStyle = "white";

    ctx.font = "70px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        "BREAKOUT",
        canvas.width / 2,
        180
    );


    // ==========================
    // BOTONES
    // ==========================

    ctx.font = "40px Arial";

    ctx.fillText(
        "PLAY",
        canvas.width / 2,
        350
    );

    ctx.fillText(
        "RESTART",
        canvas.width / 2,
        430
    );

    ctx.fillText(
        "CONTINUE",
        canvas.width / 2,
        510
    );

};