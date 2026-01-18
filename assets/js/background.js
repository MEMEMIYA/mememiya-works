// ===========================
// Refined 3D Grid Floor with Celestial Sphere (Monochrome)
// ===========================
const canvas = document.getElementById('shaderCanvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

if (!gl) {
    console.warn('WebGL not supported');
    document.body.style.background = '#000000';
} else {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    });

    const vertexShaderSource = `
        attribute vec2 a_position;
        void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;

    const fragmentShaderSource = `
        precision highp float;
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;

        #define PI 3.14159265359
        #define MAX_STEPS 120
        #define MAX_DIST 50.0
        #define SURF_DIST 0.003

        // SDF for sphere
        float sdSphere(vec3 p, float r) {
            return length(p) - r;
        }

        // Scene SDF with floor and wireframe sphere
        vec2 map(vec3 p) {
            // Circular grid floor - smoothly transitions to celestial sphere
            float floorPlane = p.y + 2.0;
            float floorRadius = 20.0;
            float distFromCenter = length(p.xz);

            // Create circular floor with smooth edges
            float floor = max(floorPlane, distFromCenter - floorRadius);

            // Wireframe celestial sphere - much further away
            float celestialRadius = 30.0;
            float celestialThickness = 0.06;
            float celestialSphere = abs(sdSphere(p, celestialRadius)) - celestialThickness;

            // Return distance and material ID (1.0 = floor, 3.0 = celestial sphere)
            float minDist = floor;
            float matID = 1.0;

            if(celestialSphere < minDist) {
                minDist = celestialSphere;
                matID = 3.0;
            }

            return vec2(minDist, matID);
        }

        // Normal calculation with higher precision
        vec3 calcNormal(vec3 p) {
            vec2 e = vec2(0.0005, 0.0);
            return normalize(vec3(
                map(p + e.xyy).x - map(p - e.xyy).x,
                map(p + e.yxy).x - map(p - e.yxy).x,
                map(p + e.yyx).x - map(p - e.yyx).x
            ));
        }

        // Ray marching
        vec2 rayMarch(vec3 ro, vec3 rd) {
            float dO = 0.0;
            float matID = 0.0;

            for(int i = 0; i < MAX_STEPS; i++) {
                vec3 p = ro + rd * dO;
                vec2 res = map(p);
                dO += res.x;
                matID = res.y;
                if(abs(res.x) < SURF_DIST || dO > MAX_DIST) break;
            }

            return vec2(dO, matID);
        }

        // Soft shadows
        float softShadow(vec3 ro, vec3 rd, float mint, float maxt, float k) {
            float res = 1.0;
            float t = mint;
            for(int i = 0; i < 16; i++) {
                float h = map(ro + rd * t).x;
                res = min(res, k * h / t);
                t += clamp(h, 0.02, 0.2);
                if(h < 0.001 || t > maxt) break;
            }
            return clamp(res, 0.0, 1.0);
        }

        // Ambient occlusion
        float calcAO(vec3 p, vec3 n) {
            float occ = 0.0;
            float sca = 1.0;
            for(int i = 0; i < 5; i++) {
                float h = 0.01 + 0.12 * float(i) / 4.0;
                float d = map(p + h * n).x;
                occ += (h - d) * sca;
                sca *= 0.95;
            }
            return clamp(1.0 - 1.5 * occ, 0.0, 1.0);
        }

        void main() {
            vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;

            // Deep black background
            vec3 col = vec3(0.0);

            // Camera setup - fixed position
            float camDist = 9.0;
            float camAngle = 0.0; // 0 degrees
            float camHeight = 2.5; // Fixed height

            vec3 ro = vec3(
                sin(camAngle) * camDist,
                camHeight,
                cos(camAngle) * camDist
            );
            vec3 target = vec3(0.0, 0.5, 0.0);

            vec3 forward = normalize(target - ro);
            vec3 right = normalize(cross(vec3(0, 1, 0), forward));
            vec3 up = cross(forward, right);

            vec3 rd = normalize(forward + uv.x * right + uv.y * up);

            // Ray march
            vec2 res = rayMarch(ro, rd);
            float t = res.x;
            float matID = res.y;

            if(t < MAX_DIST) {
                vec3 p = ro + rd * t;
                vec3 n = calcNormal(p);

                // Lighting setup
                vec3 lightDir1 = normalize(vec3(0.8, 0.6, 0.5));
                vec3 lightDir2 = normalize(vec3(-0.5, 0.3, -0.4));

                // Calculate lighting components
                float diff1 = max(dot(n, lightDir1), 0.0);
                float diff2 = max(dot(n, lightDir2), 0.0) * 0.5;

                // Ambient occlusion
                float ao = calcAO(p, n);

                // Soft shadows
                float shadow1 = softShadow(p + n * 0.01, lightDir1, 0.02, 5.0, 8.0);
                float shadow2 = softShadow(p + n * 0.01, lightDir2, 0.02, 5.0, 8.0);

                if(matID == 1.0) {
                    // Grid floor - thin and stylish pattern with anti-aliasing
                    float distFromCenter = length(p.xz);

                    // Main grid - thin elegant lines
                    vec2 grid = abs(fract(p.xz * 0.5) - 0.5);
                    float gridLine = min(grid.x, grid.y);
                    float gridPattern = smoothstep(0.012, 0.004, gridLine);

                    // Medium grid - refined thin lines
                    vec2 medGrid = abs(fract(p.xz * 1.0) - 0.5);
                    float medGridLine = min(medGrid.x, medGrid.y);
                    float medGridPattern = smoothstep(0.008, 0.003, medGridLine);

                    // Fine grid overlay - delicate thin lines
                    vec2 fineGrid = abs(fract(p.xz * 2.0) - 0.5);
                    float fineGridLine = min(fineGrid.x, fineGrid.y);
                    float fineGridPattern = smoothstep(0.005, 0.002, fineGridLine);

                    // Distance-based fade - smooth transition at circular edge
                    float distFade = 1.0 - smoothstep(15.0, 20.0, distFromCenter);

                    // Base floor color - deep black
                    col = vec3(0.012);

                    // Animated wave pattern traveling from center - subtle
                    float wave = sin(distFromCenter * 2.0 - u_time * 0.8) * 0.5 + 0.5;
                    float waveIntensity = smoothstep(0.0, 5.0, distFromCenter) * (1.0 - smoothstep(15.0, 20.0, distFromCenter));
                    col += vec3(0.03) * wave * waveIntensity * 0.3;

                    // Main grid lines - thin and refined
                    vec3 gridColor = vec3(0.28) * ao;
                    col = mix(col, gridColor, gridPattern * distFade);
                    col += vec3(0.12) * gridPattern * distFade * 0.4; // Subtle glow

                    // Medium grid lines with pulse - delicate
                    float pulse = sin(u_time * 0.5) * 0.5 + 0.5;
                    vec3 medGridColor = vec3(0.18) * ao;
                    col = mix(col, medGridColor, medGridPattern * 0.7 * distFade);
                    col += vec3(0.07) * medGridPattern * distFade * pulse * 0.25;

                    // Fine grid lines - very delicate shimmer
                    float shimmer = sin(p.x * 3.0 + u_time) * sin(p.z * 3.0 - u_time) * 0.5 + 0.5;
                    vec3 fineGridColor = vec3(0.12) * ao;
                    col = mix(col, fineGridColor, fineGridPattern * 0.45 * distFade);
                    col += vec3(0.05) * fineGridPattern * shimmer * distFade * 0.15;

                    // Grid intersection highlights - subtle glowing points
                    float gridIntersection = gridPattern * (medGridPattern + fineGridPattern);
                    col += vec3(0.20) * gridIntersection * distFade * 0.4;

                    // Central glow - subtle gradient
                    float centerGlow = 1.0 - smoothstep(0.0, 12.0, distFromCenter);
                    col += vec3(0.08) * centerGlow * centerGlow * ao;
                    col += vec3(0.05) * pow(centerGlow, 3.0) * ao;

                    // Pulsing rings emanating from center - delicate
                    float ringPulse = sin(distFromCenter * 1.5 - u_time * 1.0) * 0.5 + 0.5;
                    float centerPulse = 1.0 - smoothstep(0.0, 8.0, distFromCenter);
                    col += vec3(0.07) * centerPulse * ringPulse * 0.5;

                    // Energy particles effect - subtle sparkles
                    float particle1 = sin(p.x * 20.0 + u_time * 1.5) * sin(p.z * 15.0 - u_time * 1.3);
                    float particle2 = sin(p.x * 12.0 - u_time * 1.0) * sin(p.z * 18.0 + u_time * 1.8);
                    float particles = max(0.0, particle1 * particle2);
                    col += vec3(0.12) * particles * distFade * 0.12;

                    // Reflection effect - refined
                    float fresnel = pow(1.0 - max(dot(n, -rd), 0.0), 2.5);
                    col += vec3(0.11) * fresnel * distFade * 0.5;

                    // Specular highlights on grid lines - subtle
                    float spec = pow(max(dot(n, normalize(lightDir1 - rd)), 0.0), 16.0);
                    col += vec3(0.16) * spec * gridPattern * distFade * 0.4;

                    // Smooth fade to black at edges for natural transition
                    col *= distFade;

                } else if(matID == 3.0) {
                    // Wireframe celestial sphere - subtle and elegant with anti-aliasing
                    vec3 spherePos = normalize(p);
                    float theta = atan(spherePos.z, spherePos.x);
                    float phi = asin(spherePos.y);

                    // Main latitude and longitude grid lines - thin and stylish
                    float latLines = 16.0;
                    float lonLines = 28.0;
                    float lat = abs(fract(phi / PI * latLines) - 0.5);
                    float lon = abs(fract(theta / (2.0 * PI) * lonLines) - 0.5);
                    float latPattern = smoothstep(0.010, 0.003, lat);
                    float lonPattern = smoothstep(0.010, 0.003, lon);
                    float wireframe = max(latPattern, lonPattern);

                    // Fine detail lines - very thin
                    float fineLatLines = 32.0;
                    float fineLonLines = 56.0;
                    float fineLat = abs(fract(phi / PI * fineLatLines) - 0.5);
                    float fineLon = abs(fract(theta / (2.0 * PI) * fineLonLines) - 0.5);
                    float fineLatPattern = smoothstep(0.006, 0.002, fineLat);
                    float fineLonPattern = smoothstep(0.006, 0.002, fineLon);
                    float fineWireframe = max(fineLatPattern, fineLonPattern);

                    // Ultra-fine layer - extremely delicate
                    float ultraFineLatLines = 64.0;
                    float ultraFineLonLines = 112.0;
                    float ultraFineLat = abs(fract(phi / PI * ultraFineLatLines) - 0.5);
                    float ultraFineLon = abs(fract(theta / (2.0 * PI) * ultraFineLonLines) - 0.5);
                    float ultraFineLatPattern = smoothstep(0.004, 0.001, ultraFineLat);
                    float ultraFineLonPattern = smoothstep(0.004, 0.001, ultraFineLon);
                    float ultraFineWireframe = max(ultraFineLatPattern, ultraFineLonPattern);

                    // Intersection points
                    float intersection = latPattern * lonPattern;
                    float fineIntersection = fineLatPattern * fineLonPattern;
                    float ultraFineIntersection = ultraFineLatPattern * ultraFineLonPattern;

                    // Fade based on viewing angle
                    float viewAngle = abs(dot(n, -rd));
                    float angleFade = smoothstep(0.0, 0.5, viewAngle);

                    // Refined slow pulsing - elegant breathing effect
                    float pulse = sin(u_time * 0.2) * 0.5 + 0.5;
                    float slowPulse = sin(u_time * 0.1) * 0.5 + 0.5;
                    float fastPulse = sin(u_time * 0.4) * 0.5 + 0.5;
                    float medPulse = sin(u_time * 0.25) * 0.5 + 0.5;

                    // Base wireframe - thin and refined
                    col = vec3(0.18) * wireframe * angleFade;
                    col += vec3(0.10) * wireframe * angleFade * 0.5;

                    // Fine and ultra-fine wireframes - delicate layers
                    col += vec3(0.10) * fineWireframe * angleFade * 0.4;
                    col += vec3(0.05) * ultraFineWireframe * angleFade * 0.25;

                    // Intersection nodes - subtle highlights
                    col += vec3(0.22) * intersection * angleFade * 0.8;
                    col += vec3(0.14) * intersection * angleFade * 0.6;
                    col += vec3(0.11) * fineIntersection * angleFade * 0.4;
                    col += vec3(0.07) * ultraFineIntersection * angleFade * 0.25;

                    // Gentle pulsing
                    col += vec3(0.08) * wireframe * angleFade * pulse * 0.4;
                    col += vec3(0.05) * fineWireframe * angleFade * fastPulse * 0.3;

                    // Subtle shimmer
                    float shimmer1 = sin(theta * 8.0 + u_time * 1.8) * sin(phi * 7.0 - u_time * 1.3) * 0.5 + 0.5;
                    col += vec3(0.06) * shimmer1 * wireframe * angleFade * 0.25;

                    // Fresnel glow - more subtle
                    float fresnel1 = pow(1.0 - viewAngle, 2.0);
                    col += vec3(0.11) * fresnel1 * 0.4;
                }

                // Atmospheric fog - subtle depth
                float fogAmount = 1.0 - exp(-t * 0.02);
                vec3 fogColor = vec3(0.005);
                col = mix(col, fogColor, fogAmount * 0.7);

                // Subtle depth-based glow for richness
                float depthGlow = smoothstep(15.0, 3.0, t) * 0.05;
                col += vec3(depthGlow) * ao;
            }

            // Refined vignette
            float distFromCenter = length(uv);
            float vignette = 1.0 - smoothstep(0.3, 1.4, distFromCenter);
            vignette = pow(vignette, 1.5);
            col *= (0.2 + vignette * 0.8);

            // Subtle film grain for texture
            float grain = fract(sin(dot(uv * 1000.0 + u_time * 0.1, vec2(12.9898, 78.233))) * 43758.5453);
            col += vec3(grain) * 0.015;

            // Color grading - enhance contrast
            col = pow(col, vec3(0.9));

            // S-curve for refined contrast
            col = col * col * (3.0 - 2.0 * col);

            // Keep it appropriately dark
            col *= 0.7;

            gl_FragColor = vec4(col, 1.0);
        }
    `;

    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    function createProgram(gl, vs, fs) {
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program error:', gl.getProgramInfoLog(program));
            return null;
        }
        return program;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vs, fs);

    if (program) {
        const posLoc = gl.getAttribLocation(program, 'a_position');
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);

        const timeLoc = gl.getUniformLocation(program, 'u_time');
        const resLoc = gl.getUniformLocation(program, 'u_resolution');
        const mouseLoc = gl.getUniformLocation(program, 'u_mouse');

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const start = Date.now();

        function render() {
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.useProgram(program);
            gl.uniform1f(timeLoc, (Date.now() - start) / 1000);
            gl.uniform2f(resLoc, canvas.width, canvas.height);
            gl.uniform2f(mouseLoc, mouseX, mouseY);

            gl.enableVertexAttribArray(posLoc);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLES, 0, 6);

            requestAnimationFrame(render);
        }
        render();
    }
}
