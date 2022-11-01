//Seletores
let pantalla = document.querySelector("canvas");
let botonNuevoJuego = document.getElementById("new-game").style.display = "none"
let btnSalirDesaparecer = document.getElementById("salir").style.display = "none"
let divAgregarPalabra = document.getElementById("add").style.display = 'none';
let btnNuevoJuego = document.getElementById("new-game");
let btnSalir = document.getElementById("salir");
let btnCancelar = document.getElementById("cancelar");


var palabras = ['NARUTO', 'FULLMETAL', 'BLEACH', 'FATESTAY', 'POKEMON', 'DIGIMON', 'TOKYOGHOUL', 'JOJOS', 'GINTAMA', 'MONOGATARI', 'INUYASHA', 'SAILORMOON', 'TORADORA', 'CLANNAD','KIMINOTODOKE','DEATHNOTE','DRAGONBALL','HUNTER', 'ANGELBEATS', 'KIMETSU', 'SHINGEKI', 'SPYFAMILY', 'EVANGELION', 'SLAMDUNK', 'ANOHANA', 'ONEPIECE', 'KONOSUBA', 'FRUITSBASKET', 'JUJUTSUKAISEN', 'ELFENLIED'];
var tablero = document.getElementById('horca').getContext('2d');
var palabraSecreta = "";
var letras = [];
var palabraCorrecta = "";
var errores = 8;
let letrasIncorrectas = [];
let numeroDeErrores = 8;
let letraElegida = [];



// captura el id "play" en el click y direcciona el program al método que inicia el juego
document.getElementById("play").onclick = () => {
  iniciarJuego();
}
// captura el id "save", guarda la palabra e inicia el juego
document.getElementById("save").onclick = () => {
  guardarPalabra();
}
//actualiza la pantalla cuando el usuario hace click en el botón "nuevo juego"
btnNuevoJuego.addEventListener("click", function () {
  location.reload();
});
//actualiza la pantalla cuando el usuario hace click en el botón "salir"
btnSalir.addEventListener("click", function () {
  location.reload();
});
//actualiza la pantalla cuando el usuario hace click en el botón "cancelar"
btnCancelar.addEventListener("click", function () {
  location.reload();
});


// Funciones

//elige al azar la palabra que será usada en el ahorcado
function escojerPalabraSecreta() {
  let palabra = palabras[Math.floor(Math.random() * palabras.length)]
  palabraSecreta = palabra
  return palabra
}
// verifica cual es la letra que el usuario presionó
function verificarLetraClicada(key) {
  if (letras.length < 1 || letras.indexOf(key) < 0) {
    letras.push(key)
    return false 
  }
  else {
    letras.push(key)
    return true
  }
}
function agregarLetraCorrecta(i) {
  palabraCorrecta += palabraSecreta[i].toUpperCase()
}
function agregarLetraIncorrecta(letter) {
  if (palabraSecreta.indexOf(letter) <= 0) {
    errores -= 1
  }
}
function verificarFinJuego(letra) {
  //verifica si la letra ha se incluyó en el array de  las letras correctas o incorrectas
  if(letraElegida.length < palabraSecreta.length) { 
    //incluye las letras digitadas al array
    letrasIncorrectas.push(letra);
    //valida se el usuário cometió el maximo de errores permitidos
    if (letrasIncorrectas.length > numeroDeErrores) {
      perdiste()
    }
    else if(letraElegida.length < palabraSecreta.length) {
      agregarLetraIncorrecta(letra)
      escribirLetraIncorrecta(letra, errores)
    }
  }
} 
//Verifica si el usuario ganó
function verificarVencedor(letra) {
  letraElegida.push(letra.toUpperCase());
  if (letraElegida.length == palabraSecreta.length) {
    ganaste()
  }
}
//impide que teclas como shift y otras, sean consideradas errores y sean escritas
function verificarLetra(keyCode) {
  if (typeof keyCode === "number" && keyCode >= 65 && keyCode <= 90) {
    return true;
  } else {
    return false;
  }
}
//hace que aparezcan los botones para agregar palabras y desaparece los de iniciar el juego
function agregarPalabra() {
  document.getElementById("desaparece").style.display = 'none';
  document.getElementById("add").style.display = "block";
}
// guarda la palabra que el usuario quiere agregar
function guardarPalabra() { 
  //captura lo que el usuario ha digitado
  let nuevaPalabra = document.getElementById('texto-recibido').value;
  // incluye la palabra que el usuario digitó en el array de las palabras 
  if(nuevaPalabra !== ""){
    palabras.push(nuevaPalabra.toUpperCase());
    alert('La palabra fue guardada');
    // hace desaparecer todo lo referente a agregar palabra
    document.getElementById("add").style.display = "none";
    iniciarJuego();
  }
  else{
    alert("No hay escrito ninguna palabra")
  }
}
//inicia el juego
function iniciarJuego() {
  // quita los botones de iniciar juego
  document.getElementById("desaparece").style.display = 'none';
  //llama la función que dibuja el tablero del ahorcado
  dibujarCanvas();
  //llama la función que sortea la palabra  
  escojerPalabraSecreta();
  //llama la función que dibuja las líneas donde el usuario escribirá
  dibujarLinea();
  //trae los botones de nuevo juego y salir 
  document.getElementById("new-game").style.display = "block"
  document.getElementById("salir").style.display = "block"
  // captura la letra que el usuario escribió
  document.onkeydown = (e) => {
    //transformas las letras mayúsculas
    let letra = e.key.toUpperCase()
    //verifica si el usuario todavia no ha perdido
    if (letrasIncorrectas.length <= numeroDeErrores) {
      if (!verificarLetraClicada(e.key) && verificarLetra(e.keyCode)) {
        if (palabraSecreta.includes(letra)) {
          agregarLetraCorrecta(palabraSecreta.indexOf(letra))
          for (let i = 0; i < palabraSecreta.length; i++) {
            if (palabraSecreta[i] === letra) {
              escribirLetraCorrecta(i);
              verificarVencedor(letra);
            }
          }
        }
        /*si el usuario cometió más errores de los que son permitidos, 
        llama las funciones que dibujan el ahorcado y exhibe el mensaje de game over*/
        else {
          if (!verificarLetraClicada(e.key) && !verificarVencedor(letra)) return
          dibujarAhorcado(errores);
          verificarFinJuego(letra);
        }
      }
    }
    else {
      alert('Has llegado al límite de letras incorrectas')
    }
  };
}
