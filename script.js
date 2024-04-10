const num = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const vaa = ["C", "D", "H", "S"];
const cartas = [];
let jugador = { puntaje: { min: 0, max: 0 }, cartas: [] }; // Inicializar puntaje.min y puntaje.max
let computadora = { puntaje: { min: 0, max: 0 }, cartas: [] };
let puntajeJugador=0,puntajeComputadora=0;
const crearBaraja = () => {
    for (let i = 0; i < num.length; i++) {
        for (let j = 0; j < vaa.length; j++) {
            cartas.push(num[i] + vaa[j]);
        }
    }
};
const obtenerCartaAleatoria = () => {
    const index = Math.floor(Math.random() * cartas.length);
    const carta = cartas.splice(index, 1)[0];
    return carta;
};
const mostrarCarta = (carta, contenedorId) => {
    const contenedor = document.getElementById(contenedorId);
    const urlImagen = `Cartas/${carta}.png`;
    contenedor.innerHTML += `<div class="card"><img src="${urlImagen}" alt="${carta}"></div>`;
};
const calcularPuntaje = (jgdor) => {
    let puntajeMin = 0;
    let puntajeMax = 0;
    let tieneAs = false;
    let contadorAs = 0;
    jgdor.cartas.forEach((carta) => {
        const valorCarta = carta.slice(0, -1);
        if (valorCarta === "A") {
            tieneAs = true;
            contadorAs++;
            puntajeMin += 1;
            puntajeMax += 11;
            if (puntajeMax > 21) {
                puntajeMax -= 10;
            }
        } else {
            puntajeMin += isNaN(parseInt(valorCarta, 10)) ? 10 : parseInt(valorCarta, 10);
            puntajeMax += isNaN(parseInt(valorCarta, 10)) ? 10 : parseInt(valorCarta, 10);
        }
    });
    jgdor.puntaje.min = tieneAs && contadorAs > 1 && puntajeMax > 21 ? puntajeMin : puntajeMin;
    jgdor.puntaje.max = tieneAs && puntajeMax <= 21 ? puntajeMax : puntajeMin;
    return jgdor.puntaje;
};
const actualizarPuntaje = () => {
    puntajeJugador = calcularPuntaje(jugador);
    const puntajeComputadora = isNaN(parseInt(computadora.cartas[0], 10))? ["10", "J", "Q", "K"].includes(computadora.cartas[0].slice(0,-1)) ? 10 : 11 : computadora.cartas[0].slice(0,-1);
    document.getElementById("Jugador").innerText = `${puntajeJugador.min}/${puntajeJugador.max}`;
    document.getElementById("comp").innerText = `${puntajeComputadora}`;
    if(puntajeJugador.max == 21){
        document.getElementById("Jugador").innerText = `${puntajeJugador.max}`;
    }else if (puntajeJugador.max > 21) {
        document.getElementById("Jugador").innerText = `${puntajeJugador.min}`;
    }else if(puntajeJugador.max == puntajeJugador.min){
        document.getElementById("Jugador").innerText = `${puntajeJugador.min}`;
    }
    if (puntajeJugador.min > 21) { 
        pjugador();
        setTimeout(() => {alert("¡Ganó la computadora!");},500)
    }else if (puntajeJugador.min === 21 || puntajeJugador.max === 21) { 
        if(puntajeJugador.min === 21 ){
            document.getElementById("Jugador").innerText = `${puntajeJugador.min}`;
        }else{
            document.getElementById("Jugador").innerText = `${puntajeJugador.max}`;
        }
        pjugador();
        permanecer();
    }
};
const pjugador = ()=>{
    document.getElementById("Jugador").innerText = `${puntajeJugador.max}`;
    document.getElementById("hit").removeEventListener("click",pedircarta);
    document.getElementById("stay").removeEventListener("click",permanecer);
    document.getElementById("compcartas").removeChild(document.getElementById("compcartas").lastChild);
    mostrarCarta(computadora.cartas[1], "compcartas");
    let puntajeComputadora = calcularPuntaje(computadora).min;
    document.getElementById("comp").innerText = `${puntajeComputadora}`;
}
const iniciarJuego = () => {
    crearBaraja();
    document.getElementById("hit").addEventListener("click",pedircarta);
    document.getElementById("stay").addEventListener("click",permanecer);
    jugador.cartas = [obtenerCartaAleatoria(), obtenerCartaAleatoria()];
    computadora.cartas = [obtenerCartaAleatoria(), obtenerCartaAleatoria()];
    mostrarCarta(jugador.cartas[0], "jugadorcartas");
    mostrarCarta(jugador.cartas[1], "jugadorcartas");
    mostrarCarta(computadora.cartas[0], "compcartas");
    if (computadora.cartas[1].includes("D") || computadora.cartas[1].includes("H")) {
        mostrarCarta("red_back", "compcartas");
    } else {
        mostrarCarta("grey_back", "compcartas");
    }
    const sumaJugador = calcularPuntaje(jugador).max;
    const sumaComputadora = calcularPuntaje(computadora).max;
    if (sumaJugador === 21 && sumaComputadora === 21) {
        pjugador();
        setTimeout(() => {alert("¡Fue Empate, ambos jugadores tienen BLACKJACK!");},500);
        return;
    }else if(sumaComputadora === 21){
        pjugador();
        setTimeout(() => {alert("COMPUTADORA Ganó, tiene BLACKJACK!");},500);
    }else if(sumaJugador === 21){
        pjugador();
        document.getElementById("Jugador").innerText = `21`;
        setTimeout(() => {alert("JUGADOR Ganó, tiene BLACKJACK!");},500);
        return;
    }
    actualizarPuntaje();
};
const pedircarta = ()=>{
    jugador.cartas.push(obtenerCartaAleatoria());
    mostrarCarta(jugador.cartas[jugador.cartas.length - 1], "jugadorcartas");
    actualizarPuntaje();
}
const permanecer = ()=>{
    pjugador();
    let puntajeComputadora = calcularPuntaje(computadora);
    while (puntajeComputadora.min <= 16) {
        computadora.cartas.push(obtenerCartaAleatoria());
        mostrarCarta(computadora.cartas[computadora.cartas.length - 1], "compcartas");
        puntajeComputadora = calcularPuntaje(computadora);
    }
    if(puntajeComputadora.max == 21){
        document.getElementById("comp").innerText = `${puntajeComputadora.max}`;
    }else if (puntajeComputadora.max > 21) {
        document.getElementById("comp").innerText = `${puntajeComputadora.min}`;
    }else if(puntajeComputadora.max == puntajeComputadora.min){
        document.getElementById("comp").innerText = `${puntajeComputadora.min}`;
    }else{
        document.getElementById("comp").innerText = `${puntajeComputadora.min}/${puntajeComputadora.max}`;
    }
    setTimeout(() => {
        const pj = parseInt(document.getElementById("Jugador").textContent);
        const pc = parseInt(document.getElementById("comp").textContent);
        if(pj>21){
            alert("¡Ganó la COMPUTADORA, con un puntaje de "+pc+"!");
            return;
        }else if(pc>21){
            alert("¡Ganó el JUGADOR, con un puntaje de "+pj+"!");
            return;
        }
        if(pj>pc){
            alert("¡Ganó el JUGADOR, con un puntaje de "+pj+"!");
        }else if(pj<pc){
            alert("¡Ganó la COMPUTADORA, con un puntaje de "+pc+"!");
        }else{
            alert("¡Fue Empate, tuvieron el mismo puntaje!");
        }
    },500);
}
window.onload = () => {
    document.getElementById("nvojgo").addEventListener("click", () => {
        document.getElementById("compcartas").innerHTML = "";
        document.getElementById("jugadorcartas").innerHTML = "";
        iniciarJuego();
    });
    iniciarJuego();
};