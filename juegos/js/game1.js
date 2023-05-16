/*cuando termine de cargar se ejecute con el init o la funcion automaticamente
  un escucha a la ventana*/
  window.addEventListener('load',init,false);

  var canvas=null,ctx=null; //variables definidas en nulas para guardar el canvas y su contexto
  //animacion declaramos 2 variables
  //var x=50,y=50;
  var player=new Rectangle(40,40,10,10);
  var lastKey=null; //interaccion con usuario, var para tecla presionada
  var dir=0; //variable para almacenar la dirección de nuestro rectángulo
  var PAUSE=true; //poner el juego en pausa
  var food=new Rectangle(80,80,10,10); //nuevo elemento, variable food 
  var score=0; //declaramos el puntaje
  var GAMEOVER=true; //saber si perdio
  var wall=new Array(); //contendrra los elementos de pared
  
  wall.push(new Rectangle(100,50,10,10));
  wall.push(new Rectangle(100,100,10,10));
  wall.push(new Rectangle(200,50,10,10));
  wall.push(new Rectangle(200,100,10,10));
  
  //lugar random
  function random(max){
       return parseInt(Math.random()*max);
  }
  
  function init(){
      canvas=document.getElementById('canvas'); //buscamos por ID para desplegarlo
      canvas.style.background='#000'; //background en hexadecimal
      ctx=canvas.getContext('2d'); // el contexto 2D es nuestra herramienta para pintar dentro del lienzo
      //paint(ctx); //llamamos a la funcion de paint
      run(); //llamamos a la funcion run
  }
  
  //esta funcion permitira llamar a paint() una y otra vez
  function run(){
      /*llamamos a un temporizador, el cual volverá a llamar a “run” en 50 milisegundos
        imprimiendo 20 cuadros por segundo*/
       setTimeout(run,50);
       game();
       //x+=10; //aumento de la cordenada en x a 10
       //if(x>canvas.width) //si su posición es mayor a la del ancho de lienzo
       //x=0; //regrese a la posición 0.
       paint(ctx); //llamamos la funcion paint()
  }
  
  function reset(){
       score=0;
       dir=1;
       player.x=40;
       player.y=40;
       food.x=random(canvas.width/10-1)*10;
       food.y=random(canvas.height/10-1)*10;
       GAMEOVER=false;
  }
  
  function game(){
  
      if(!PAUSE){
      // GameOver Reset
      if(GAMEOVER)
          reset();
      /*las flechas con valores numericos*/
       // Change Direction
       if(lastKey==38)
       dir=0;
       if(lastKey==39)
       dir=1;
       if(lastKey==40)
       dir=2;
       if(lastKey==37)
       dir=3;
      //si no dejo el player se van solo x y
      // Move Rect
       if(dir==0)
       player.y-=10;
       if(dir==1)
       player.x+=10;
       if(dir==2)
       player.y+=10;
       if(dir==3)
       player.x-=10;
  
      // Out Screen
       if(player.x>canvas.width)
       player.x=0;
       if(player.y>canvas.height)
       player.y=0;
       if(player.x<0)
       player.x=canvas.width;
       if(player.y<0)
       player.y=canvas.height;
  
      // Food Intersects
       if(player.intersects(food)){
            score++;
            food.x=random(canvas.width/10-1)*10;
            food.y=random(canvas.height/10-1)*10;
       }
  
       // Wall Intersects 
       // comprobamos si hace una intersección con la comida o el jugador
      for (i=0;i<wall.length;i++){
           if(food.intersects(wall[i])){
             food.x=random(canvas.width/10-1)*10;
             food.y=random(canvas.height/10-1)*10;
           }
  
               if(player.intersects(wall[i])){
                   GAMEOVER=true;
                  PAUSE=true;
              }
      }
      }
      // Pause/Unpause
       if(lastKey==13){
           PAUSE=!PAUSE;
           lastKey=null;
      }
  }
  
  function paint(ctx){
      ctx.clearRect(0,0,canvas.width,canvas.height); //limpiamos la pantalla
       ctx.fillStyle='#0f0'; //color del rectangulo
       //ctx.fillRect(x,y,10,10); //posicion, ancho y largo
       ctx.fillRect(player.x,player.y,player.width,player.height);
       ctx.fillStyle='#f00';
       ctx.fillRect(food.x,food.y,food.width,food.height);
       ctx.fillStyle='#fff';
       ctx.fillStyle='#999';
      for(i=0;i<wall.length;i++){ //imprimir las paredes con un for
        ctx.fillRect(wall[i].x,wall[i].y,wall[i].width,wall[i].height);
       }
       //ctx.fillText('Last Key: '+lastKey,0,20); //saber cual fue la ultima tecla
       ctx.fillText('Score: '+score,0,10);
       //if(PAUSE) //imprimir la pausa
       if(PAUSE){
       ctx.textAlign='center';
       if(GAMEOVER)
        ctx.fillText('GAME OVER',150,75);
       else
        ctx.fillText('PAUSE',150,75);
       ctx.textAlign='left';
       }
       //ctx.fillText('PAUSE',140,75);
       //puntaje en la pantalla 	
  }
  
  /*Mediante este método, podremos tomar decisiones en el juego sabiendo la última tecla presionada. 
  Cada tecla tiene un valor numérico, el cual tendremos que comparar para realizar la acción deseada 
  dependiendo la tecla presionada. */
  
  document.addEventListener('keydown',function(evt){
       lastKey=evt.keyCode;
  },false);
  
  //nos dirá si está en una intersección con un segundo elemento
  // recibimos X, Y, Ancho y Alto
  function Rectangle(x,y,width,height){
       this.x=(x==null)?0:x;
       this.y=(y==null)?0:y;
       this.width=(width==null)?0:width;
       this.height=(height==null)?this.width:height;
       this.intersects=function(rect){
            if(rect!=null){
                return(this.x<rect.x+rect.width&&
                this.x+this.width>rect.x&&
                this.y<rect.y+rect.height&&
                this.y+this.height>rect.y);
            }
       }
  }
  