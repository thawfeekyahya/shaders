#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

// Arrow shape: triangle head + rectangle tail
float arrowShape(vec2 uv, float width, float height) {
    // Align base of arrow at (0, 0)
    uv.y += height;

    float arrowHeadHeight = height * -0.448;
    float arrowTailHeight = height * 1.640;
    float halfWidth = width * 1.108;

    // Arrow head (triangle)
    float head = 0.0;
    if (uv.y > arrowTailHeight && uv.y <= height) {
        float yInHead = uv.y - arrowTailHeight;
        float headProgress = yInHead / arrowHeadHeight; // [0, 1]
        float maxX = (1.0 - headProgress) * halfWidth;
        head = step(abs(uv.x), maxX);
    }

    // Arrow tail (rectangle)
    float tail = 0.0;
    if (uv.y >= 0.0 && uv.y <= arrowTailHeight) {
        tail = step(abs(uv.x), halfWidth * 0.3);
    }

    return max(head, tail);
}


// Feather shape: narrow bottom, wide top
float featherShape(vec2 uv, float width, float height) {
    // Shift UV so bottom is at y = 0
    uv.y += height;

    // Compute "growth" from bottom to top
    float taper = clamp(uv.y / (1.472 * height), -0.944, 1.328);

    // Control shape width using upward taper (wide at top)
    float halfWidth = width * mix(0.092, 1.256, taper);  // 0.3 = narrow base

    // Horizontal feather silhouette
    float feather = smoothstep(halfWidth, 0.0, abs(uv.x));

    // Limit vertical bounds (from 0.0 to 2.0 * height)
    feather *= step(0.0, uv.y) * step(uv.y, 2.0 * height);

    return feather;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st -= 0.5;
    st.x *= u_resolution.x / u_resolution.y;

    int count = 9;
    float radius = 0.392;
    float baseWidth = 0.066;
    float baseHeight = 1.104;
    float speed = 0.5;

    float angleOffset = u_time * speed;
    float color = 0.0;

    for (int i = 0; i < 9; i++) {
        float a = float(i) / float(count) * 6.28318 + angleOffset;

        float x = radius * cos(a);
        float z = radius * sin(a);
        float perspective = 1.048 / (1.472 + z * 0.252);

        float xpos = x * perspective;
        float width = baseWidth * perspective;
        float height = baseHeight * perspective;

        // Feather origin is aligned at bottom (Y = -0.5)
        vec2 local = st - vec2(xpos, -0.5);

        float feather = arrowShape(local, width, height);

        color += feather * perspective;
    }

    gl_FragColor = vec4(vec3(color), 1.0);
}

