// Creamos una variable para llamar al canvas
const canvas = document.getElementById("canvas");

// Creamos el lapiz
const ctx = canvas.getContext("2d")

// VARIABLES
const velocidadInicial = 400

// Pelota
let pelota = {
    x: 500,
    y: 560,
    radio: 10,
    velocidadPelota: velocidadInicial,
    velocidadx: 0,
    velocidady: 0
};

// Plataforma
let plataforma = {
    x: 450,
    y: 580,
    width: 100,
    height: 16,
    movimiento: 0,
    velocidad: 800
}

// Ladrillos
let ladrillos = [];

// Definimos cuando las teclas son pulsadas
let teclas = {};

//Game over 
let gameOver = false;

let imagenesGameOver = [
    "./images/gameover/avatar.jpg",
    "./images/gameover/awela.jpg",
    "./images/gameover/ayuwoki.jpg",
    "./images/gameover/chococrispi.jpg",
    "./images/gameover/dientes.png",
    "./images/gameover/emanen.jpg",
    "./images/gameover/fornite.jpg",
    "./images/gameover/gatonegro.jpg",
    "./images/gameover/illojuan.jpg",
    "./images/gameover/ke.jpg",
    "./images/gameover/negro.jpg",
    "./images/gameover/nonono.jpg",
    "./images/gameover/olaninio.jpg",
    "./images/gameover/OOoo.jpg",
    "./images/gameover/piedras-en-los-riñones.jpg"
]


let imagenGameOverElegida;
let imagenGameOverCargada;


//Victoria
victoria = false;

let imagenesWin = [
    "./images/win/boca.jpg",
    "./images/win/calle.jpg",
    "./images/win/cartulina.jpg",
    "./images/win/chulo.jpg",
    "./images/win/crepusculo.jpg",
    "./images/win/donal.jpg",
    "./images/win/down.jpg",
    "./images/win/draculo.jpg",
    "./images/win/keso.png",
    "./images/win/minion.jpg",
    "./images/win/moro.jpg",
    "./images/win/nano.jpg",
    "./images/win/pancrasio.jpg",
    "./images/win/pollo.jpg",
    "./images/win/queases.jpg"
]

let imagenWinElegida;
let imagenWinCargada;


//vidas
let vidas = 3;


// Captamos cuando se pulsa alguna tecla
document.addEventListener("keydown", (e) => {
    e.preventDefault()
    teclas[e.key] = true;

    if (e.key === "w" || e.key === "ArrowUp") {
        lanzarPelota()
    }
})
// Mientras que la tecla no es pulsada se mantiene en false
document.addEventListener("keyup", (e) => {
    e.preventDefault()
    teclas[e.key] = false;
})






// FUNCIONES

let previousTime = null;
const FPS = 60

const frameTime = 1000 / FPS

function gameLoop(timestamp) {


    if (previousTime === null) {
        previousTime = timestamp
        requestAnimationFrame(gameLoop)
        return
    }

    let deltatime = (timestamp - previousTime)
    if (deltatime >= frameTime) {

        previousTime = timestamp
        // console.log(timestamp /1000)

        let fps = 1000 / deltatime

        // console.log(`fps: ${fps.toFixed(0)}`)

        moverPlataforma()

        plataforma.x = plataforma.x + (plataforma.movimiento * (deltatime / 1000))


        let pelotaAnteriorY = pelota.y


        moverPelota(deltatime)
        colision(pelotaAnteriorY)
        colisionLadrillos()
        comprobarWin()





        if (pelota.velocidadx === 0 && pelota.velocidady === 0) {
            pelota.x = plataforma.x + plataforma.width / 2;
            pelota.y = plataforma.y - pelota.radio;
        }




        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (gameOver) {
            dibujarGameOver();
        } else if(victoria) {
            dibujarWin();
        } else {
            dibujarPlataforma()
            dibujarPelota()
            dibujarLadrillos()
            dibujarVidas()
        }
    }

    requestAnimationFrame(gameLoop)


}
crearLadrillo()
requestAnimationFrame(gameLoop)

function moverPlataforma() {
    if (teclas["ArrowLeft"] || teclas["a"]) {

        plataforma.movimiento = -plataforma.velocidad


    } else if (teclas["ArrowRight"] || teclas["d"]) {

        plataforma.movimiento = plataforma.velocidad


    } else {
        plataforma.movimiento = 0
    }

}

//Hacemos las colisiones





function dibujarPlataforma() {

    ctx.strokeStyle = "#3cff00";
    ctx.lineWidth = 2;
    ctx.fillStyle = "#1b3015"

    ctx.strokeRect(plataforma.x,
        plataforma.y,
        plataforma.width,
        plataforma.height
    )
    ctx.fillRect(plataforma.x,
        plataforma.y,
        plataforma.width,
        plataforma.height
    )
}




function dibujarPelota() {
    ctx.beginPath();

    ctx.arc(pelota.x, pelota.y, pelota.radio, 0, Math.PI * 2);

    ctx.fillStyle = "red";
    ctx.fill();
}



function dibujarLadrillos() {

    for (let ladrillo of ladrillos) {

        if (!ladrillo.vivo) {
            continue;
        }

        ctx.fillStyle = "#f2ff00";



        ctx.fillRect(
            ladrillo.x,
            ladrillo.y,
            ladrillo.width,
            ladrillo.height
        );

        ctx.strokeStyle = "black";
        ctx.lineWidth = 2

        ctx.strokeRect(
            ladrillo.x,
            ladrillo.y,
            ladrillo.width,
            ladrillo.height);
    }

};


function crearLadrillo() {
    for (let fila = 0; fila < 5; fila++) {
        for (let columna = 0; columna < 10; columna++) {
            let ladrillo = {
                x: 100 + columna * 90,
                y: 10 + fila * 30,
                width: 30,
                height: 30,
                vivo: true
            }
            ladrillos.push(ladrillo);
        }
    }
}

function colisionLadrillos() {
    for (let ladrillo of ladrillos) {
        if (!ladrillo.vivo) {
            continue;
        }
        if (
            pelota.x + pelota.radio >= ladrillo.x &&
            pelota.x - pelota.radio <= ladrillo.x + ladrillo.width &&
            pelota.y + pelota.radio >= ladrillo.y &&
            pelota.y - pelota.radio <= ladrillo.y + ladrillo.height
        ) {
            ladrillo.vivo = false;
            

            let distanciaIzquierda = Math.abs(
                (pelota.x + pelota.radio) - ladrillo.x
            );

            let distanciaDerecha = Math.abs(
                (pelota.x - pelota.radio) - (ladrillo.x + ladrillo.width)
            );

            let distanciaArriba = Math.abs(
                (pelota.y + pelota.radio) - ladrillo.y
            );

            let distanciaAbajo = Math.abs(
                (pelota.y - pelota.radio) - (ladrillo.y + ladrillo.height)
            );


            let menorDistancia = Math.min(
                distanciaIzquierda,
                distanciaDerecha,
                distanciaArriba,
                distanciaAbajo
            )

            if(
                menorDistancia === distanciaIzquierda ||
                menorDistancia === distanciaDerecha
            ){
                pelota.velocidadx = -pelota.velocidadx;
            } else {
                pelota.velocidady = -pelota.velocidady
            }
        }
    }
}


function moverPelota(deltatime) {
    pelota.x += pelota.velocidadx * (deltatime / 1000);
    pelota.y += pelota.velocidady * (deltatime / 1000);
}


function colision(pelotaAnteriorY) {

    if (pelota.y - pelota.radio > canvas.height && !gameOver) {

        vidas--;

        if(vidas <= 0){
            gameOver = true;
            elegirImagenGameOver();
        }else{

            pelota.velocidadx = 0;
            pelota.velocidady = 0;

            pelota.x = plataforma.x + plataforma.width /2;
            pelota.y = plataforma.y - pelota.radio;
        }
    }

    //Pared derecha
    if (pelota.x + pelota.radio >= canvas.width) {
        pelota.velocidadx = -pelota.velocidadx;
    }

    //Pared izquierda
    if (pelota.x - pelota.radio <= 0) {
        pelota.velocidadx = -pelota.velocidadx
    }

    //Pared superior

    if (pelota.y - pelota.radio <= 0) {
        pelota.velocidady = -pelota.velocidady;
    }

    //Plataforma
    if (pelota.velocidady > 0 &&
        pelotaAnteriorY + pelota.radio < plataforma.y &&
        pelota.y + pelota.radio >= plataforma.y &&
        pelota.x + pelota.radio >= plataforma.x &&
        pelota.x - pelota.radio <= plataforma.x + plataforma.width
    ) {
        pelota.y = plataforma.y - pelota.radio;

        if (pelota.velocidadPelota < 800) {
            pelota.velocidadPelota += 50
        }


        apuntar()

    }

    //limites de la plataforma
    if (plataforma.x <= 0) {
        plataforma.x = 0;
    } else if (plataforma.x + plataforma.width >= canvas.width) {
        plataforma.x = canvas.width - plataforma.width
    }
}

function apuntar() {
    //Esto es para saber si la pelota rebota en el centro de la plataforma
    let centroPlataforma = plataforma.x + plataforma.width / 2

    //Distancia entre la pelota y el centro 
    let diferencia = pelota.x - centroPlataforma;

    //Cambiamos la direccion
    let direccion = diferencia / (plataforma.width / 2);

    direccion = Math.max(-1, Math.min(1, direccion));

    //Calculamos velocidad X
    pelota.velocidadx = direccion * pelota.velocidadPelota;

    //Calculamos velocidadY
    pelota.velocidady = -Math.sqrt(
        pelota.velocidadPelota ** 2 - pelota.velocidadx ** 2
    );

    if (Math.abs(pelota.velocidady) < 50) {
        pelota.velocidady = -50;

        pelota.velocidadx = Math.sqrt(
            pelota.velocidadPelota ** 2 - pelota.velocidady ** 2
        ) * Math.sign(pelota.velocidadx);
    }
}

function lanzarPelota() {

    if (pelota.velocidadx === 0 && pelota.velocidady === 0) {
        pelota.velocidadx = 0;
        pelota.velocidady = - velocidadInicial;
    }
}

function elegirImagenGameOver() {
    let num = Math.floor(Math.random() * imagenesGameOver.length);

    imagenGameOverElegida = new Image();

    imagenGameOverElegida.onload = function () {
        imagenGameOverCargada = true;
    };

    imagenGameOverElegida.src = imagenesGameOver[num];
}


function dibujarGameOver() {

    if (!imagenGameOverCargada) {
        return;
    }

    ctx.drawImage(
        imagenGameOverElegida,
        0,
        0,
        canvas.width,
        canvas.height
    );
}


function dibujarVidas() {
    ctx.fillStyle = "red"
    ctx.font = "25px Arial";

    ctx.fillText("VIDAS: " + vidas, 20, 30)
};



function elegirImagenWin(){
    let num = Math.floor(Math.random() * imagenesWin.length);

    imagenWinElegida = new Image();

    imagenWinElegida.onload = function () {
        imagenWinCargada = true;
    };

    imagenWinElegida.src = imagenesWin[num];
}


function comprobarWin(){
    for(let ladrillo of ladrillos){
        if(ladrillo.vivo){
            return;
        }
    }

    if(!victoria) {
        victoria = true;
        elegirImagenWin()
    }
}

function dibujarWin(){
    if(!imagenWinCargada) {
        return;
    }

    ctx.drawImage(
        imagenWinElegida,
        0,
        0,
        canvas.width,
        canvas.height
    );
}