var canvas = document.querySelector('canvas');
canvas.width =  window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var mouse = {
    x:undefined,
    y:undefined
}

var colorArray= 
[
    '#ffaa33',
    '#99ffaa',
    '#00ff00',
    '#4411aa',
    '#ff1100'
];


window.addEventListener('mousemove', function(event)
{
    mouse.x = event.x;
    mouse.y = event.y;
})

window.addEventListener('resize', function(event)
{
    canvas.width =  window.innerWidth;
    canvas.height = window.innerHeight;
})

function PID ()
{
    this.kP = 10;
    this.kD = 200;
    this.kI = 0 //.01;
    this.lastErr =0;
    this.I = 0;
    this.cal = function(err , elapsedTime)
    {
        KP = this.kP * err;

        intErr = (err + this.lastErr)/2 * elapsedTime;
        this.I += this.kI * intErr;

        deltaErr = err - this.lastErr;
        KD = deltaErr / elapsedTime;

        PID = KP + this.I + KD; 

        this.lastErr = err;

        return PID/10
    }
    return this;
}

function leg(OSX = 0,OSY = 0,OSZ = 0,FAY = 0,FAR = 0,FAP = 0,FX = 0,FY = 0
                        ,FZ = 0,MAY = 0,MAR = 0,MAP = 0,MX = 0,MY = 0,MZ = 0)
{
    this.offSetX = OSX;
    this.offSetY = OSY;
    this.offSetZ = OSZ;
    this.forceX  = FX;
    this.forceY  = FY;
    this.forceZ  = FZ;
    this.forceAngleYaw = FAY;
    this.forceAngleRoll = FAR;
    this.forceAnglePitch = FAP;
    this.momentX = MX;
    this.momentY = MY;
    this.momentZ = MZ;
    this.momentAngleYaw = MAY;
    this.momentAngleRoll = MAR;
    this.momentAnglePitch = MAP;

    this.pwm =0;

    this.legPos = [];
    this.forcePos = []; 
    this.momentPos = [];
    this.toplamForce = [0,0,0];
    this.etkenForce = [0,0,0];

    this.cal = function(yaw,roll,pitch)
    {
        this.legPos = eulerCal(yaw,roll,pitch,this.offSetX,this.offSetY,this.offSetZ);
        u = Math.sqrt(this.legPos[0]*this.legPos[0]  + this.legPos[1]*this.legPos[1]);
        u = Math.sqrt( u*u + this.legPos[2]*this.legPos[2]);
        loc121 = eulerCal(this.forceAngleYaw,this.forceAngleRoll,this.forceAnglePitch,this.forceX,this.forceY,this.forceZ)
        this.forcePos = eulerCal(yaw,roll,pitch,this.offSetX+loc121[0],this.offSetY+loc121[1],this.offSetZ + loc121[2])

        loc131 = eulerCal(this.momentAngleYaw,this.momentAngleRoll,this.momentAnglePitch,this.momentX,this.momentY,this.momentZ)
        this.momentPos = eulerCal(yaw,roll,pitch,this.offSetX+loc131[0],this.offSetY+loc131[1],this.offSetZ+loc131[2])

        y1 = Math.sign(this.legPos[1]) * ( (this.momentPos[0] - this.legPos[0]) + (this.forcePos[0] - this.legPos[0]) );
        y2 = - Math.sign(this.legPos[0]) * ( (this.momentPos[1] - this.legPos[1]) + (this.forcePos[1] - this.legPos[1]) );
        
        this.etkenForce[0] = u * Math.sign(y1+y2) * Math.sqrt(y1*y1  + y2*y2);
        
        r1 = Math.sign(this.legPos[2]) * ( (this.momentPos[0] - this.legPos[0]) + (this.forcePos[0] - this.legPos[0]) );
        r2 = - Math.sign(this.legPos[0]) * ( (this.momentPos[2] - this.legPos[2]) + (this.forcePos[2] - this.legPos[2]) );
        
        this.etkenForce[1] = -u *  Math.sign(r1+r2) * Math.sqrt(r1*r1+r2*r2)

        p1 = Math.sign(this.legPos[2]) * ( (this.momentPos[1] - this.legPos[1]) + (this.forcePos[1] - this.legPos[1]) );
        p2 = - Math.sign(this.legPos[1]) * ( (this.momentPos[2] - this.legPos[2]) + (this.forcePos[2] - this.legPos[2]) );
        
        this.etkenForce[2] = -u *  Math.sign(p1+p2) * Math.sqrt(p1*p1+p2*p2)

    }
    this.sim =function()
    {
        this.toplamForce[0] = this.etkenForce[0]*this.pwm;
        this.toplamForce[1] = this.etkenForce[1]*this.pwm;
        this.toplamForce[2] = this.etkenForce[2]*this.pwm;
    }
    this.draw = function()
    {

        drawArc(this.legPos);
        drawLine(this.legPos,this.forcePos)
        drawLine(this.legPos,this.momentPos)
    }
    return this;
}

kollar =[];
pidler =[];
ddd = []
scaler = [];


ddd.push(1);
kollar.push(new leg(1,-1,0,0,0,0,0,0,ddd[0],-135,0,0,ddd[0],0,0));  // Sag Ust
pidler.push(new PID);
scaler.push(1)


ddd.push(1);
kollar.push(new leg(1,1,0,0,0,0,0,0,ddd[1],135,0,0,ddd[1],0,0));    // Sag Alt
pidler.push(new PID);
scaler.push(1)

ddd.push(1);
kollar.push(new leg(-1,-1,0,0,0,0,0,0,ddd[2],-45,0,0,ddd[2],0,0));  //  Sol Ust
pidler.push(new PID);
scaler.push(1)

ddd.push(1);
kollar.push(new leg(-1,1,0,0,0,0,0,0,ddd[3],45,0,0,ddd[3],0,0));    //  Sol Alt
pidler.push(new PID);
scaler.push(1)



/*

setInterval(function()
{
    a = (Math.random()-0.5)*2;
    kollar[3].forceZ  = a
    kollar[3].momentX = a
} ,2000)

*/

yaw=0;
pitch=0;
roll=0;

setYaw = 0;
setRoll = 0;
setPitch = 0;
time = new Date();
lastTime = 0;


delay=10;

function animate()
{
    
    time = new Date();
    //requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height);
    toplam = [0,0,0]
    
    while(delay == 0)
    {
        // Cal
        kollar.forEach((kol ,i) => {
            if(lastTime !=0)
            {
                elapsedTime = (time - lastTime)/20;
                yawErr = (setYaw - yaw) / 90;
                rollErr = (setRoll - roll) / 90;
                pitchErr = (setPitch - pitch) / 90;
                err = - (kol.etkenForce[0]*yawErr) - (kol.etkenForce[1]*rollErr) + (kol.etkenForce[2]*pitchErr);

                pid = pidler[i].cal(err,elapsedTime)
                if(pid>=1) pid = 1;
                else if(pid<=0) pid = 0;
                kol.pwm = pid;
            }
            delay=10;
            
        });
    }
    delay--;
    
    lastTime = time;
    // Sim
    kollar.forEach((kol ,i) => {
        kol.cal(yaw,roll,pitch);
        kol.sim();
        kol.draw();
        toplam[0] += kol.toplamForce[0] * scaler[i];
        toplam[1] += kol.toplamForce[1] * scaler[i];
        toplam[2] += kol.toplamForce[2] * scaler[i];
    });
    //yaw++;
    //pitch++;
    //roll++;    

    tStartPoint = 0.05;
    drawText(" Speed Yaw = " + Math.round(toplam[0]*res)/res , canvas.width*0.01,canvas.height*tStartPoint )
    drawText(" Speed Roll = " + Math.round(toplam[1]*res)/res ,canvas.width*0.01,canvas.height*(tStartPoint+0.05))
    drawText(" Speed Pitch= " + Math.round(toplam[2]*res)/res ,canvas.width*0.01,canvas.height*(tStartPoint+0.1))
    drawText(" Yaw = "  + Math.round(yaw*res)/res   ,canvas.width*0.01,canvas.height*(tStartPoint+0.15))
    drawText(" Roll = " + Math.round(roll*res)/res ,canvas.width*0.01,canvas.height*(tStartPoint+0.2))
    drawText(" Pitch= " + Math.round(pitch*res)/res  ,canvas.width*0.01,canvas.height*(tStartPoint+0.25))
    drawText("  Test ", canvas.width*0.2,canvas.height*tStartPoint)
    yaw-=toplam[0]*0.7;
    roll-=toplam[1]*0.7; 
    pitch+=toplam[2]*0.7;
}

animate();
setInterval(animate,1000/60  )

function drawText(text,x,y)
{
    c.font = "30px Times New Roman";
    c.fillText(text, x, y);
}


function drawArc(a)
{
    c.beginPath();
    c.arc(canvas.width/2 + a[0]*100, canvas.height/2 +  a[1]*100,  a[2]*5+10, 0, 2 * Math.PI);
    c.stroke();
}

function drawLine(start,end)
{
    c.moveTo(canvas.width/2 + start[0]*100, canvas.height/2 + start[1]*100);
    c.lineTo(canvas.width/2 + end[0]*100, canvas.height/2 + end[1]*100);
    c.stroke();
}

function eulerCal(aDeg,bDeg,cDeg,d1,d2,d3)
{

    
    var c = cDeg / 180 * Math.PI;
    var b = bDeg / 180 * Math.PI; // Asla 90 yada - 90 olmamalı
    var a = aDeg / 180 * Math.PI;

    var r11 = cos(a)*cos(b);
    var r12 = cos(a)*sin(b)*sin(c)-sin(a)*cos(c);
    var r13 = cos(a)*sin(b)*cos(c)+sin(a)*sin(c);

    var r21 = sin(a)*cos(b);
    var r22 = sin(a)*sin(b)*sin(c)+cos(a)*cos(c);
    var r23 = sin(a)*sin(b)*cos(c)-cos(a)*sin(c);


    var r31 = -sin(b);
    var r32 = cos(b)*sin(c);
    var r33 = cos(b)*cos(c);


    var cb =kok(kare(r11)+kare(r21));
    var yaw = - Math.atan2( r31 , cb );
    var pitch = Math.atan2( r21/cb , r11/cb );
    var roll = Math.atan2( r32/cb , r33/cb );


    res = 1000;

    pitch = Math.round((pitch*180/Math.PI)*res)/res
    roll = Math.round((roll*180/Math.PI)*res)/res
    yaw = Math.round((yaw*180/Math.PI)*res)/res

    x = r11*d1 + r12*d2 + r13*d3;
    y = r21*d1 + r22*d2 + r23*d3;
    z = r31*d1 + r32*d2 + r33*d3;

    x = Math.round(x*res)/res
    y = Math.round(y*res)/res
    z = Math.round(z*res)/res

    return [x , y , z];

}

function sin(x)
{
    return Math.sin(x);
}
function cos(x)
{
    return Math.cos(x);
}
function kok(x)
{
    return Math.sqrt(x); 
}
function kare(x)
{
    return Math.pow(x, 2); 
}
