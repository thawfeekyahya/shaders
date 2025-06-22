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

float drawCrossHair(float size, vec2 pos,vec2 st) {
    float hLine;
    
    float buff = size;
    float height = 0.016;
    
    //Vertical Line
    float inX = step(pos.x-buff,st.x) * step(st.x,pos.x+buff);
    float inY = step(pos.y-height,st.y) * step(st.y,pos.y+height);
    
    hLine = inX * inY;

    
    float width = 0.015;
    
    inX = step(pos.x-width,st.x) * step(st.x,pos.x+width);
    inY = step(pos.y-buff,st.y) * step(st.y,pos.y+buff);
    
    hLine += inX * inY;
    
    return hLine;
}


void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color;
    
    st = st * 2.0 - 1.0;
    
    
    float pct = drawCrossHair(0.07,vec2(cos(u_time),sin(u_time)),st);
    
    color = vec3(pct);
    
    gl_FragColor = vec4(color,1.0);
}

