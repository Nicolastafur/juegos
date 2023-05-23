canvas = document.getElementById('game')
    ctx = canvas.getContext('2d')
	
    var game = new function() {
		this.time = 0
        this.width = canvas.width
        this.height = canvas.height
        this.color = "#ddd"
        this.players = []
		this.balls = []
		this.particles = []
        this.update = function(){
            for (var i in game.players) {
                game.players[i].update()
            }
			for (var i in game.particles) {
				game.particles[i].update()
            }
			if (game.time>350) {
				for (var i in game.balls) {
					game.balls[i].update()
				}
			}
			game.time++
        }
        this.draw = function(){
			ctx.clearRect(0,0,game.width,game.height)
			ctx.fillStyle = 'rgba(0,0,0,0.1)'
			ctx.font = '300px helvetica'
			ctx.textBaseline = 'middle'
			ctx.textAlign = 'center'
			ctx.fillText(game.players[0].score,game.width/3,game.height/2)
			ctx.fillText(game.players[1].score,2*game.width/3,game.height/2)
            for (var i in game.players) {
                game.players[i].draw()
            }
			for (var i in game.particles) {
                game.particles[i].draw()
            }
			if (game.time>350 | game.time%100>50) {
				for (var i in game.balls) {
					game.balls[i].draw()
				}
			}
        }
        this.init = function(){
			document.addEventListener('keydown',game.keyDownHandeler)
			document.addEventListener('keyup',game.keyUpHandeler)
            setInterval(game.update,10)
            setInterval(game.draw,17)
			this.players.push(new Player(15,game.height/2,100,10,87,83,6,game.color,true,8))
			this.players.push(new Player(game.width-15,game.height/2,100,10,38,40,6,game.color,false,30))
			this.balls.push(new Ball(game.width/2,game.height/2,(Math.random()>0.5)?-4:4,((Math.random()>0.5)?-1:1)*(Math.random()*0.2+0.4),10,0.1,game.color))
        }
		this.keyDownHandeler = function(e){
			for (var i in game.players) {
				switch(e.keyCode){
					case game.players[i].keyUp:
						game.players[i].up = true
					break
					case game.players[i].keyDown:
						game.players[i].down = true
					break
				}	
			}
		}
		this.keyUpHandeler = function(e){
			for (var i in game.players) {
				switch(e.keyCode){
					case game.players[i].keyUp:
						game.players[i].up = false
					break
					case game.players[i].keyDown:
						game.players[i].down = false
					break
				}	
			}
		}
		this.newRound = function(){
			this.time = 0
			this.balls = []
			this.balls.push(new Ball(game.width/2,game.height/2,(game.players[0].score>game.players[1].score)?-4:4,((Math.random()>0.5)?-1:1)*(Math.random()*0.2+0.4),10,0.1,game.color))
		}
    }
    
    function Ball(x,y,xSpeed,ySpeed,size,acc,color) {
        this.x = x
        this.y = y
        this.xSpeed = xSpeed
        this.ySpeed = ySpeed
        this.size = size
		this.acc = acc
		this.maxAng = 0.8
        this.color = color
		this.particleCount = 20
		this.trail = []
		this.trailLength = 10
        this.update = function(){
			this.x += this.xSpeed
			var testY = this.y+this.ySpeed
            if (testY<this.size) {
				this.y = this.size
				this.ySpeed *= -1
			}else if (testY>game.height-this.size) {
				this.y = game.height-this.size
				this.ySpeed *= -1
			}else{
				this.y = testY
			}
			for (var i in game.players) {
				var player = game.players[i]
				var dir = this.xSpeed>0 ? 1 : -1
				if (this.x+this.size/2>player.x-player.width/2 & this.x-this.size/2<player.x+player.width/2 & this.y+this.size/2>player.y-player.height/2 & this.y-this.size/2<player.y+player.height/2) {
					this.x = dir>0 ? player.x-player.width/2-this.size/2 : player.x+player.width/2+this.size/2
					var speed = Math.sqrt(Math.pow(this.ySpeed,2)+Math.pow(this.xSpeed,2)) + acc
					var angle = this.maxAng*(this.y-player.y)/(player.height+this.size)
					this.ySpeed = Math.sin(angle*Math.PI)*speed
					this.xSpeed = -dir*Math.cos(angle*Math.PI)*speed
					for (var i=0; i<this.particleCount; i++) {
						game.particles.push(new Particle(this.x+dir*this.size/2,this.y,6,"rgba(255,255,255,"+0.06*Math.abs(this.xSpeed)+")",-dir*(Math.random()*3+1),Math.random()*8-4,10))
					}
				}
				this.trail.unshift([this.x,this.y])
				if (this.trail.length>this.trailLength) {
					this.trail.pop()
				}
			}
			if (this.x+this.size/2<0) {
				game.players[1].score += 1
				game.newRound()
			}
			if (this.x-this.size/2>game.width) {
				game.players[0].score += 1
				game.newRound()
			}
        }
        this.draw = function(){
			for (var i in this.trail) {
				ctx.fillStyle = 'rgba(255,255,255,'+0.5/i+')'
				ctx.fillRect(this.trail[i][0]-this.size/2,this.trail[i][1]-this.size/2,this.size,this.size)
			}
            ctx.fillStyle = this.color
            ctx.fillRect(this.x-this.size/2,this.y-this.size/2,this.size,this.size)
		}
    }
	
	function Player(x,y,height,width,keyUp,keyDown,speed,color,ai,z){
		this.x = x
		this.y = y
		this.height = height
		this.width = width
		this.color = color
		this.score = 0
		this.up = false
		this.down = false
		this.keyUp = keyUp
		this.keyDown = keyDown
		this.speed = speed
		this.enableAi = ai
		this.z = z
		this.ai = function(){
			if (Math.abs(this.x-game.balls[0].x-game.balls[0].xSpeed)<Math.abs(this.x-game.balls[0].x)) {
				var yd = game.balls[0].y-this.y+game.balls[0].ySpeed*z
				var s = yd/20
				this.y = (s<this.speed) ? this.y+s : this.y+this.speed
			}
		}
        this.update = function(){
			if(this.enableAi==true){
				this.ai()
			}else{
				if (this.up) {
					var testY = this.y-this.speed
					this.y = (testY-this.height/2>0) ? testY : this.height/2
				}
				if (this.down) {
					var testY = this.y+this.speed
					this.y = (testY+this.height/2<game.height) ? testY : game.height-this.height/2
				}
			}
        }
        this.draw = function(){
            ctx.fillStyle = this.color
            ctx.fillRect(this.x-this.width/2,this.y-this.height/2,this.width,this.height)
        }
	}
	
	function Particle(x,y,size,rgba,xSpeed,ySpeed,trailLength){
		this.x = x
		this.y = y
		this.size = size
		this.color = rgba
		this.xSpeed = xSpeed
		this.ySpeed = ySpeed
		this.trail = []
		this.time = 0
		this.trailLength = trailLength
        this.update = function(){
			this.trail.push([this.x,this.y])
			this.x += this.xSpeed
			this.y += this.ySpeed
			if (this.trail.length > this.trailLength) {
				this.trail.shift()
			}
			this.time++
        }
        this.draw = function(){
			var colorSplit = this.color.split(',')
			for (var i in this.trail) {
				var opacity = parseFloat(colorSplit[3])*i/(this.trailLength+this.time*this.time)
				ctx.fillStyle = colorSplit[0]+","+colorSplit[1]+","+colorSplit[2]+","+opacity+")"
				ctx.fillRect(this.trail[i][0]-this.size/2,this.trail[i][1]-this.size/2,this.size,this.size)		
			}
		}
		if (game.particles.length>20) {
			game.particles.shift()
		}
	}
	game.init()