#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float drawBox(vec2 pos,vec2 st) {
    float  size = 0.2;
    vec2 left = step(pos-0.1,st);
    vec2 right = 1.0 - step(pos+size-0.1,st);
    
    return left.x * left.y * right.x * right.y;
    
    
}

float drawLine(vec2 pos, vec2 st) {
    float width = 0.064;
    float height = 0.468;
    
    // Calculate local position
    vec2 local = st - pos;

    // Early exit if outside vertical bounds
    if (local.y < 0.0 || local.y > height) return 0.0;

    // Taper the left edge inward at the top
    float taperAmount = 0.120; // how much to taper left side at the top
    float taper = taperAmount * (0.472 - local.y / height); // more taper at top

    // Adjust left boundary
    if (local.x < taper || local.x > width) return 0.000;

    // Optional fade based on horizontal position
    float fade = clamp((local.x - taper) / (width - taper), 0.0, 0.808);
    float value = mix(0.0, 0.464, fade);

    // Optional vertical curve modifier
    float curveStart = mix(3.708, 0.0, local.y * 2.208) * mix(0.0, 1.240, fade);

    return value * curveStart;
}
    
float arrowFunction(vec2 pos, float blur, float gap, float stretch, float time) {
    float arrow = fract(abs(pos.x * 2.0 - 1.0) * 0.25 * gap - pos.y * 0.66 * gap + time);
    
    return smoothstep(0.5 - stretch - blur, 0.5 - stretch, arrow) * 
        smoothstep(0.6 + stretch + blur, 0.6 + stretch, arrow) * 0.75 + 0.25;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    //st.x *= u_resolution.x / u_resolution.y;
    //st = st * 2.0 - 1.0;
    
    float lineCount = 1.0;
    
    float line ;//=  drawLine(vec2(0.5,0.0),st);

    
  int totalLines = 10;
  for (int i = 0; i < 10; i++) {
    float x = float(i) / float(totalLines - 1); // spreads from 0.0 to 1.0
    line += drawLine(vec2(x, 0.0), st);
  }

    vec3 color = vec3(line);

    gl_FragColor = vec4(vec3(color), 1.0);
}

