
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


// Euler Matrisi
/*  siralama
r11 r12 r13
r21 r22 r23
r31 r32 r33
*/
/*  hesap
cos(a)*cos(b)   cos(a)*sin(b)*sin(c)-sin(a)*cos(c)  cos(a)*sin(b)*cos(c)-sin(a)*sin(c)  d1
sin(a)*cos(b)   sin(a)*sin(b)*sin(c)-cos(a)*cos(c)  sin(a)*sin(b)*cos(c)-cos(a)*sin(c)  d2
-sin(b)         cos(b)*sin(c)                       cos(b)*cos(c)                       d3
0               0                                   0                                   1
*/