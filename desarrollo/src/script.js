 //MEMORIA AL INICIAR, VA A IR CAMBIANDO 
let cantidad = 6;
let formato = "hsl";
let paleta = [];

//* SELECCION DE ELEMENTOS JS
const seccionPaleta = document.querySelector(".seccion-paleta");
const botonPrincipal = document.querySelector(".boton-principal");
const botonesCantidad = document.querySelectorAll("#seccion-cantidad .boton-seleccion");
const botonesFormato = document.querySelectorAll("#seccion-formato .boton-seleccion");
const alertaCopiado = document.querySelector("#alertaCopiado")


//* FUNCIONES COLORES ALEATORIOS
function colorAleatorioHsl() {
  return `hsl(${Math.floor(Math.random() * 360)}, 75%, 50%)`;
}

//*Funcion clave para pasar de formato sin reiniciar la paleta
function hslARgba(colorHsl) {
  const auxiliar = document.createElement("div");
  auxiliar.style.backgroundColor = colorHsl;
  const rgb = auxiliar.style.backgroundColor;
  return rgb.replace("rgb", "rgba").replace(")", ", 1)");
}


/*function colorAleatorioRgba() {  //!ESTA FUNCION TUVO QUE SER ELIMINADA, CADA VEZ QUE TOCABA EL FORMATO, SE GENERABA NUEVA PALETA
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b}, 1)`;
}*/

//*FUNCIONES PARA LA PALETA
//*Funcion que dibuja el html en el DOM
function dibujarPaleta() {
  let html = "";
  for (let i = 0; i < paleta.length; i++) {
    const colorHsl = paleta[i];
    const codigo = formato === "hsl" ? colorHsl : hslARgba(colorHsl);
    html += `<div class="seccion-paleta--color" style="background-color:${colorHsl}">${codigo}</div>`;
  }
  seccionPaleta.innerHTML = html;

  const coloresCreados = document.querySelectorAll(".seccion-paleta--color") //TODO: EVENTO PARA COPIAR EL CODIGO COLOR
  coloresCreados.forEach(color =>{
    color.addEventListener("click", function () {
      navigator.clipboard.writeText(color.textContent);
      mostrarAlerta();
    });
  }
  )
}

//*Funcion que permite reiniciar paleta, y vuelve a dibujar
function generarPaleta() {
  paleta = [];
  for (let i = 0; i < cantidad; i++) {
    paleta.push(colorAleatorioHsl());
  }
  dibujarPaleta();
}

//*PALETA INICIAL, se crea con los datos 
generarPaleta()

//*BOTON PRINCIPAL EVENTO
botonPrincipal.addEventListener("click", generarPaleta);

//*BOTON CANTIDAD Y FORMATO EVENTOS
//* funcion que actualiza la cantidad de colores
botonesCantidad.forEach(boton =>{
  boton.addEventListener("click", function () {

    // saco la clase a todos los botones
      botonesCantidad.forEach(function (b) {
      b.classList.remove("activo");
    });

    // se la pongo solo al que se clickeó
    boton.classList.add("activo");

    // actualizo la variable de estado, cantidad
    cantidad = Number(boton.textContent);
    generarPaleta();
  })
})

//* funcion que cambia el formato/codigo de los colores
botonesFormato.forEach(function (boton) {
  boton.addEventListener("click", function () {
    botonesFormato.forEach(function (b) {
      b.classList.remove("activo");
    });
    boton.classList.add("activo");
    formato = boton.textContent.toLowerCase();
    dibujarPaleta();
  });
});

//*FUNCION MICROFEEDBACK / COPIADO AL PORTAPAPELES
function mostrarAlerta() {
  alertaCopiado.classList.add("visible")
  setTimeout(function () {
    alertaCopiado.classList.remove("visible")
  },1000);
}

