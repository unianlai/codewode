var f;
var path;
var polys;
var drawing = false;
var gui, params;
var anchorX, anchorY;

var particles = [];

function getPoints(){
    drawing = false;
    // new font : I use rune which create by b2renger
    console.log(params.font);
    f = new Rune.Font(params.font) 
    particles = [];
    // load the font
    f.load(function(err){       
        path = f.toPath(params.message, 0, 0, params.size)
        polys = path.toPolygons({ spacing:params.spacing })
        drawing= true;
    });
}


function setup(){
    createCanvas(windowWidth,windowHeight)  
    background(0)

   
    params = new Parameters();
}

var isStart = false;

function draw(){
    noStroke();
    fill(params.background)
    rect(0,0,windowWidth,windowHeight)

   if (drawing){

            for (var i = 0 ; i < particles.length ; i++){
                particles[i].update(); 
                 particles[i].check_bounds(); 
                if (params.show_particles)particles[i].draw();  
            }
    
            push()
            translate(params.xoffset, params.yoffset)
            strokeWeight(params.strokeWeight )
            stroke(params.color);

            for (var j=0; j < polys.length ; j++){ // get each polygon
                var poly = polys[j];      
                for(var k = 0; k < poly.state.vectors.length; k++) { // get each point of each polygon
                    var vec = poly.state.vectors[k];        
                    for (var i = 0 ; i < particles.length ; i++){
                        if (dist(particles[i].x-params.xoffset, particles[i].y-params.yoffset, vec.x, vec.y) < params.threshold){
                            line(particles[i].x-params.xoffset, particles[i].y-params.yoffset, vec.x, vec.y)
                        }
                    }
                }
            }
            pop()
    }

    if(mouseIsPressed && mouseX < windowWidth-300)  
	{
		if(!isStart)
		{
			getPoints();
			isStart = true;
		}
		particles.push(new Particle(mouseX,mouseY,mouseX,mouseY));
		particles.push(new Particle(mouseX,mouseY,mouseX,mouseY));
		particles.push(new Particle(mouseX,mouseY,mouseX,mouseY));
		particles.push(new Particle(mouseX,mouseY,mouseX,mouseY));

	}
}


function Particle(x,y,tx,ty){
    this.x =x ;
    this.y =y;
    this.size = 8;

    var r = random(1)
    var signe = 1
    if(r < 0.5){
        signe = -1
    }
    this.xspeed = signe * random(0.15,1.5)

    r = random(1)
    signe = 1
    if(r < 0.5){
        signe = -1
    }
    this.yspeed = signe * random(0.15,1.5)

    

    this.xacc= 0;
    this.yacc =0;

    this.targetX = tx;
    this.targetY = ty;
   

    this.draw = function(){
        fill(params.color);
        noStroke();
        ellipse(this.x, this.y, this.size, this.size);        
    }

    this.update = function(){
        this.xspeed += this.xacc
        this.yspeed += this.yacc

        this.x = this.x + this.xspeed
        this.y = this.y + this.yspeed

        this.xacc = 0;
        this.yacc = 0;

    }

    this.check_bounds = function(){

        if (this.x < 0 || this.x> windowWidth){
            this.xspeed = - this.xspeed;   
        }
        else if (this.y<0 || this.y>windowHeight){
            this.yspeed = - this.yspeed;
        }

    }

    
}


var Parameters = function(){

    this.font = "./fonts/AvenirNextLTW01-Medium.woff"
    this.message = 'space';
    this.spacing = 11;
    this.size = 350;

    this.background = [0,0,0,150]; 
    this.color = [255,255,255];
    this.strokeWeight = 0.5;
    this.threshold = 50;
    
    this.xoffset = windowWidth - this.size
    this.yoffset = windowHeight/3

    console.log(this.xoffset)
    console.log(this.yoffset)

    this.show_particles = true;

}
