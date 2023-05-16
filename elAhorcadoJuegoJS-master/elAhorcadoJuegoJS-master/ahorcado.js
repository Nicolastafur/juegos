var lienzo;
var palabras = [
   'fuera',
   'bajo',
   'grandes',
   'nuestra',
   'ejemplo',
   'acuerdo',
   'usted',
   'estados',
   'hizo',
   'nadie',
   'horas',
   'posible',
   'tarde',
   'ley',
   'cambio',
   'mano',
   'eran',
   'estar',
   'san',
   'sociedad',
   'unas',
   'centro',
   'padre',
   'gente',
   'final',
   'cuerpo',
   'obra',
   'incluso',
   'madre',
   'mis',
   'modo'
]



var Tablero = function(con, img, x, y)
{
    this.contexto = con;
    this.intentos = 0;
    this.maximo = 5;
    this.letrasUsadas = ['0','1','2','3','4','5','6','7','8','9'];
    this.imagenURL = img;
    this.imagenOK = false;
    this.imagen = new Image();
    this.imagen.src = this.imagenURL;
    this.imagen.onload = this.confirmarFondo();
    this.correctas = 0;
    this.x = x;
    this.y = y;
}

Tablero.prototype.confirmarFondo = function()
{
    this.imagenOK = true;
}

Tablero.prototype.dibujar = function()
{
    if (this.imagenOK) {
        this.contexto.drawImage(this.imagen,this.x,this.y);
    };
}

Tablero.prototype.resetGame = function() {
    document.location.reload(true)
}

Tablero.prototype.mostrarBtn = function(inputWord,btn) {
    inputWord.addEventListener('input',function() {
        if (inputWord.value){
            btn.style.display = "inline-block";
        }else{
            btn.style.display = "none";
        }
    });
}

/*Aleatoriamente Selecciona Una Palabra del arreglo 'palabras'
y genera un string que representa los campos que contiene dicha
palabra mediante guines bajos*/
Tablero.prototype.chooseRandomWord = function (aleatorio) {

    this.tamanioPalabra = palabras[aleatorio].length;
    var palabraAdivinar = '';

    for (var i = 1; i <=  this.tamanioPalabra; i++) {
        palabraAdivinar = palabraAdivinar.concat('_ ');
    };

    return palabraAdivinar;
}

Tablero.prototype.checkWorks = function(inputWord,aleatorio,panelLetrasUsadas) {
        var fin = this.letrasUsadas.length;
        var noUsada = true;
        for (var i = 0; i <= fin ; i++) {
            if (this.letrasUsadas[i]==inputWord.value) {
                this.advertencias("advertencias","Ingrese un caracter valido / que no haya sido ya ingresado");
                noUsada = false;
            }
        };
        if (noUsada) {
            this.ahorcado(inputWord.value, aleatorio, this.correctas);
            this.letrasUsadas.push(inputWord.value);
        };
        cleanInput(inputWord);
        this.AppendWordToPanel(panelLetrasUsadas,this.letrasUsadas);
};

Tablero.prototype.ahorcado = function(letra, aleatorio, correctas) {
    this.letraIngresada = letra;
    this.tamanioPalabra = palabras[aleatorio].length;
    this.palabraFormar = '';
    this.acertada = 0;
    this.correctas = correctas;

    for (var i = 0; i <= this.tamanioPalabra; i++) {
        this.letraPalabra = palabras[aleatorio].charAt(i);

        if(this.letraPalabra == this.letraIngresada){
            this.palabraFormar = this.palabraFormar.concat(this.letraPalabra+' ');
            this.acertada=this.acertada+1;
        }else{
            this.palabraFormar = this.palabraFormar.concat('    ');
        }
    };

    if (this.acertada==0)
    {
        this.intentos = this.intentos+1;
        if (this.intentos>0)
        {
            poste.dibujar();
            if(this.intentos>1)
            {
                cabeza.dibujar();
                if(this.intentos>2)
                {
                    torso.dibujar();
                    if(this.intentos>3)
                    {
                        brazos.dibujar();
                        cabeza = new Tablero(this.contexto,"cabeza-x.png",150,110);
                        if(this.intentos>4)
                        {
                            cabeza.dibujar();
                            piernas.dibujar();
                            this.aviso("aviso","aviso-titulo", "Lo Siento Perdiste :(");
                        }
                    }
                }
            }
        }
    }
    palabra = new Texto(this.contexto,this.palabraFormar,350,440);
    palabra.dibujar();

    if (this.acertada==1) {
        this.correctas = this.correctas+1;
    };

    if (this.correctas==this.tamanioPalabra) {
         this.aviso("aviso","aviso-titulo", "Felicidades Ganaste!!! :)");
    };
}

Tablero.prototype.aviso = function(idcontent,idtitle, msg) {
   this.contenedor = document.getElementById(idcontent);
   this.titulo = document.getElementById(idtitle);

   this.contenedor.style.display = "block";
   this.titulo.innerHTML = msg;
}

Tablero.prototype.advertencias = function(idcontent, msg) {
   this.advertencia = document.getElementById(idcontent);

   this.advertencia.style.display = "block";
   this.advertencia.innerHTML = msg;

   setTimeout(function(){
        lienzo.advertencia.style.display = "none";
   }, 7000);
}

Tablero.prototype.AppendWordToPanel = function(panelLetrasUsadas, letrasUsadas) {
    panelLetrasUsadas.innerHTML = "";
    for(var letra in letrasUsadas){
        panelLetrasUsadas.innerHTML += "<span>"+letrasUsadas[letra]+"</span>";
    }
};

var Texto = function(cont, text, x, y, color)
{
    this.contexto = cont;
    this.contexto.font ="2em Georgia";
    this.contexto.fillStyle = "#8b4f11";
    this.texto = text;
    this.x = x;
    this.y = y;
}

Texto.prototype.dibujar = function ()
{
    this.contexto.fillText(this.texto,this.x,this.y);
}

function iniciar()
{
    var panelLetrasUsadas = document.getElementById("letras-usadas");
    var randomNumber = getRandom(0, palabras.length);
    var inputWord = document.getElementById("letra");
    cleanInput(inputWord);
    var btn = document.getElementById("btn-aceptar");
    var btnAviso = document.getElementById("aviso-btn");

    var canvas = document.getElementById("lienzo");
    canvas.width = 694;
    canvas.height = 490;
    var contexto = canvas.getContext("2d");

    lienzo = new Tablero(contexto,"fondo.png",0,0);

    lienzo.mostrarBtn(inputWord, btn);
    btn.addEventListener('click', function ()
    {
        lienzo.checkWorks(inputWord,randomNumber,panelLetrasUsadas);
    });

    btnAviso.addEventListener('click', function ()
    {
        lienzo.resetGame();
    });

    cabeza = new Tablero(contexto,"cabeza-normal.png",150,110);

    poste = new Tablero(contexto,"poste.png",0,104);

    torso = new Tablero(contexto,"torso.png",157,280);

    piernas = new Tablero(contexto,"piernas.png",141,335);

    brazos = new Tablero(contexto,"brazos.png",141,285);

    camposPalabra = new Texto(contexto,lienzo.chooseRandomWord(randomNumber), 350,450);
}

window.onload = function() {
    lienzo.dibujar();
    camposPalabra.dibujar();
}

function getRandom(min, max) {
    return Math.floor((Math.random() * max) + min);
}

function cleanInput (input) {
    input.value = '';
    input.focus();
}