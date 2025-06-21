#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float drawCircle(float radius,vec2 position,vec2 st) {
    float dist = distance(position,st);
    //dist = distance(position+0.100,st) + distance(position+0.012,st); //oval
    //dist = distance(position+-0.028,st) * distance(position+0.036,st); // doublly merged
    //dist = max(distance(position+-0.028,st), distance(position+-0.028,st)); //rugby
    //dist = pow(distance(position+-0.036,st), distance(position+0.332,st)); //zoom 

    dist = smoothstep(radius,radius+0.02,dist);
    return dist;
}

float drawSquare(float side,vec2 position,vec2 st) {
    float box;
    vec2 start = step(position,st);
    vec2 end   = 1.0 - step(position+side,st);
    box = start.x * start.y * end.x * end.y;
    
    return box;
}


void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    //st.x *= u_resolution.x / u_resolution.y;
    
    vec3 color;
   
    vec2 center = vec2(0.5);
    
    float dist = distance(center,st);
    
    float pct = drawCircle(0.120,vec2(0.5),st);
    
    //float pct = drawSquare(0.3,vec2(0.270,0.450),st);
    
    
    color = vec3(pct);
    
    gl_FragColor = vec4(color,1.0);
}

