// ===========================
// 怨世パジャマゲドン専用シェーダー背景
// Grid Floor + Celestial Sphere + Drifting Debris (crystals/cubes/orbs) + Nebula/Starfield
// （このページ専用。他ページの共通背景 background.js には影響しません）
// ===========================
(function () {
    // 低速回線・非力端末では重いWebGL演出を出さない（quality-detect-pajamageddon.js が判定）
    // body の通常のグラデーション背景（base.css）だけが残るので見た目も破綻しない
    if (window.PJ_REDUCE_FX) return;

    // このページの主目的は画像・動画を見せること。背景演出はあくまで脇役なので、
    // ページの画像・iframeなど主要リソースが出そろう window の load イベントまで起動を待つ。
    if (document.readyState === 'complete') {
        initShaderBackground();
    } else {
        window.addEventListener('load', initShaderBackground);
    }

    function initShaderBackground() {

    const canvas = document.getElementById('shaderCanvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) {
    console.warn('WebGL not supported');
    document.body.classList.add('webgl-unavailable');
} else {
    // レイマーチングのコストは「画面ピクセル数 × ステップ数」に比例するので、
    // 内部解像度を少し落として描画し、CSS(width:100%/height:100%)で引き伸ばす。
    // 背景の暗いムード演出なので、多少の解像度低下は見た目にはほぼ影響しない。
    const RENDER_SCALE = 0.75;

    function setCanvasSize() {
        canvas.width = Math.round(window.innerWidth * RENDER_SCALE);
        canvas.height = Math.round(window.innerHeight * RENDER_SCALE);
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    setCanvasSize();

    window.addEventListener('resize', setCanvasSize);

    const vertexShaderSource = `
        attribute vec2 a_position;
        void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;

    const fragmentShaderSource = `
        #extension GL_OES_standard_derivatives : enable
        precision highp float;
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;

        #define PI 3.14159265359
        #define MAX_STEPS 80
        #define MAX_DIST 50.0
        #define SURF_DIST 0.003

        // SDF for sphere
        float sdSphere(vec3 p, float r) {
            return length(p) - r;
        }

        // SDF for octahedron (used for the drifting debris crystals)
        float sdOctahedron(vec3 p, float s) {
            p = abs(p);
            return (p.x + p.y + p.z - s) * 0.57735027;
        }

        // SDF for box (second debris silhouette, for visual variety)
        float sdBox(vec3 p, vec3 b) {
            vec3 q = abs(p) - b;
            return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
        }

        // 2D rotation helper (used to spin the drifting debris)
        vec2 rot2D(vec2 p, float a) {
            float s = sin(a);
            float c = cos(a);
            return mat2(c, -s, s, c) * p;
        }

        // Scene SDF: grid floor, wireframe sphere, drifting debris
        vec2 map(vec3 p) {
            // Circular grid floor - smoothly transitions to celestial sphere
            float floorPlane = p.y + 2.0;
            float floorRadius = 30.0;
            float distFromCenter = length(p.xz);

            // Create circular floor with smooth edges
            float floor = max(floorPlane, distFromCenter - floorRadius);

            // Wireframe cylinder wall - inner surface exactly at r=30 (no thickness gap)
            float cylinderWall = 30.0 - distFromCenter;
            cylinderWall = max(cylinderWall, -(p.y + 2.0)); // clip below floor level

            // Drifting debris - a large swarm of crystals/cubes/orbs pushed out
            // toward the far left/right edges, well clear of the center text column.
            // Sized up and pulled closer to camera so they actually read on screen.
            vec3 d1 = p - vec3(6.6, 1.8 + sin(u_time * 0.4) * 0.5, 1.5);
            d1.xz = rot2D(d1.xz, u_time * 0.25);
            d1.xy = rot2D(d1.xy, u_time * 0.18);
            float debris1 = sdOctahedron(d1, 0.85);

            vec3 d2 = p - vec3(-6.6, 1.8 + cos(u_time * 0.35) * 0.4, 1.5);
            d2.yz = rot2D(d2.yz, u_time * 0.3);
            d2.xz = rot2D(d2.xz, u_time * 0.1);
            float debris2 = sdBox(d2, vec3(0.62));

            vec3 d3 = p - vec3(8.4, 4.4 + sin(u_time * 0.5) * 0.3, 3.2);
            float debris3 = sdSphere(d3, 0.58);

            vec3 d4 = p - vec3(-8.4, 4.4 + cos(u_time * 0.28) * 0.4, 3.2);
            d4.xz = rot2D(d4.xz, u_time * 0.16);
            d4.yz = rot2D(d4.yz, u_time * 0.2);
            float debris4 = sdOctahedron(d4, 0.6);

            vec3 d5 = p - vec3(7.2, 6.2 + sin(u_time * 0.45) * 0.4, 0.0);
            d5.xy = rot2D(d5.xy, u_time * 0.3);
            float debris5 = sdBox(d5, vec3(0.46));

            vec3 d6 = p - vec3(-7.2, 6.2 + cos(u_time * 0.4) * 0.3, 0.0);
            float debris6 = sdSphere(d6, 0.5);

            vec3 d7 = p - vec3(9.6, 2.8 + sin(u_time * 0.33) * 0.5, -1.6);
            d7.xz = rot2D(d7.xz, -u_time * 0.19);
            d7.xy = rot2D(d7.xy, u_time * 0.14);
            float debris7 = sdOctahedron(d7, 0.5);

            vec3 d8 = p - vec3(-9.6, 2.8 + sin(u_time * 0.37) * 0.4, -1.6);
            d8.xy = rot2D(d8.xy, -u_time * 0.17);
            float debris8 = sdBox(d8, vec3(0.42));

            vec3 d9 = p - vec3(6.0, 5.0 + sin(u_time * 0.42) * 0.4, -3.6);
            float debris9 = sdSphere(d9, 0.4);

            vec3 d10 = p - vec3(-6.0, 5.0 + cos(u_time * 0.44) * 0.4, -3.6);
            d10.yz = rot2D(d10.yz, u_time * 0.19);
            float debris10 = sdBox(d10, vec3(0.34));

            // Union of debris via chained min() (WebGL1 has no dynamic arrays, so unrolled)
            // Kept to 10 instances - each one adds an SDF evaluation on every ray march
            // step, so this is the single biggest lever for shader performance.
            float debris = debris1;
            debris = min(debris, debris2);
            debris = min(debris, debris3);
            debris = min(debris, debris4);
            debris = min(debris, debris5);
            debris = min(debris, debris6);
            debris = min(debris, debris7);
            debris = min(debris, debris8);
            debris = min(debris, debris9);
            debris = min(debris, debris10);

            // Return distance and material ID
            // 1.0 = floor, 3.0 = cylinder wall, 5.0 = debris
            float minDist = floor;
            float matID = 1.0;

            if(cylinderWall < minDist) {
                minDist = cylinderWall;
                matID = 3.0;
            }
            if(debris < minDist) {
                minDist = debris;
                matID = 5.0;
            }

            return vec2(minDist, matID);
        }

        // ---- Hash / noise / fbm for the background nebula & starfield ----
        float hash21(vec2 p) {
            p = fract(p * vec2(123.34, 456.21));
            p += dot(p, p + 45.32);
            return fract(p.x * p.y);
        }

        float noise2(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            float a = hash21(i);
            float b = hash21(i + vec2(1.0, 0.0));
            float c = hash21(i + vec2(0.0, 1.0));
            float d = hash21(i + vec2(1.0, 1.0));
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        // Octave count trimmed for performance (3 is enough for a soft background gas look)
        float fbm(vec2 p) {
            float v = 0.0;
            float amp = 0.5;
            for(int i = 0; i < 3; i++) {
                v += amp * noise2(p);
                p *= 2.02;
                amp *= 0.5;
            }
            return v;
        }

        // Volumetric-looking nebula gas drifting behind the scene
        vec3 nebula(vec3 rd, float time) {
            vec2 p = rd.xy / (abs(rd.z) + 0.35);
            p += vec2(time * 0.015, -time * 0.01);
            float n1 = fbm(p * 1.4);
            float n2 = fbm(p * 2.7 + 11.0);
            vec3 purple = vec3(0.34, 0.14, 0.52);
            vec3 magenta = vec3(0.42, 0.08, 0.32);
            return purple * n1 * n1 * 0.6 + magenta * n2 * 0.22;
        }

        // Twinkling starfield - two layers for depth and density
        float stars(vec3 rd) {
            vec2 p1 = rd.xy * 420.0 + rd.z * 90.0;
            float s1 = hash21(floor(p1));
            float tw1 = sin(u_time * 3.0 + s1 * 62.0) * 0.5 + 0.5;
            float star1 = smoothstep(0.975, 1.0, s1) * tw1;

            vec2 p2 = rd.xy * 220.0 - rd.z * 60.0 + 31.0;
            float s2 = hash21(floor(p2));
            float tw2 = sin(u_time * 2.2 + s2 * 48.0) * 0.5 + 0.5;
            float star2 = smoothstep(0.978, 1.0, s2) * tw2 * 0.7;

            return star1 + star2;
        }

        // Normal calculation via the tetrahedron technique - 4 map() taps instead of
        // the naive 6-tap central-difference version, ~33% cheaper per ray hit
        vec3 calcNormal(vec3 p) {
            const float h = 0.0005;
            const vec2 k = vec2(1.0, -1.0);
            return normalize(
                k.xyy * map(p + k.xyy * h).x +
                k.yyx * map(p + k.yyx * h).x +
                k.yxy * map(p + k.yxy * h).x +
                k.xxx * map(p + k.xxx * h).x
            );
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

        // Ambient occlusion (step count trimmed for performance)
        float calcAO(vec3 p, vec3 n) {
            float occ = 0.0;
            float sca = 1.0;
            for(int i = 0; i < 3; i++) {
                float h = 0.01 + 0.12 * float(i) / 2.0;
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

                // Soft shadow - only the debris material actually uses this, so it's
                // computed inside that branch instead of on every ray hit (floor/wall
                // cover most of the screen and don't need the extra softShadow() cost)

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

                    // No fade - floor is clipped at r=30 by cylinder wall, no need to fade
                    float distFade = 1.0 - smoothstep(30.5, 32.0, distFromCenter);

                    // Base floor color - deep black
                    col = vec3(0.012);

                    // Animated wave pattern traveling from center - subtle
                    float wave = sin(distFromCenter * 2.0 - u_time * 0.8) * 0.5 + 0.5;
                    float waveIntensity = smoothstep(0.0, 5.0, distFromCenter) * (1.0 - smoothstep(30.5, 32.0, distFromCenter));
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
                    // Wireframe cylinder wall - x-lines with fwidth AA, fade at grazing angles
                    float gX = abs(fract(p.x * 0.5) - 0.5);
                    float fw = fwidth(gX);
                    float wireframe = smoothstep(fw * 1.5, fw * 0.3, gX);

                    // Height fade - bright near floor, fades toward ceiling
                    float heightFade = 1.0 - smoothstep(3.0, 16.0, p.y + 2.0);

                    // Angle fade - fade to 0 at grazing (prevents jagged edges on sides)
                    float viewAngle = abs(dot(n, -rd));
                    float angleFade = smoothstep(0.08, 0.45, viewAngle);

                    float combinedFade = heightFade * angleFade;

                    // Pulsing
                    float pulse = sin(u_time * 0.2) * 0.5 + 0.5;

                    // Base wireframe
                    col = vec3(0.18) * wireframe * combinedFade;
                    col += vec3(0.10) * wireframe * combinedFade * 0.5;
                    col += vec3(0.08) * wireframe * combinedFade * pulse * 0.4;

                    // Shimmer
                    float shimmer1 = sin(p.x * 3.0 + u_time * 1.8) * sin(p.z * 3.0 - u_time * 1.3) * 0.5 + 0.5;
                    col += vec3(0.06) * shimmer1 * wireframe * combinedFade * 0.25;

                    // Fresnel glow at base
                    float fresnel1 = pow(1.0 - viewAngle, 2.0);
                    col += vec3(0.11) * fresnel1 * heightFade * 0.4;

                } else if(matID == 5.0) {
                    // Drifting debris - crystals/cubes/orbs with a violet rim light,
                    // brightened so the larger shapes actually read on screen
                    float fresnelD = pow(1.0 - max(dot(n, -rd), 0.0), 2.5);
                    float diffD = diff1 * 0.6 + diff2 * 0.3 + 0.12;
                    vec3 debrisTint = vec3(0.6, 0.28, 0.85);
                    col = vec3(0.09, 0.06, 0.13) * diffD * ao;
                    col += debrisTint * fresnelD * 0.85;
                    col += debrisTint * 0.25 * (sin(u_time * 1.5 + p.x + p.y) * 0.5 + 0.5);
                }

                // Atmospheric fog - subtle depth
                float fogAmount = 1.0 - exp(-t * 0.02);
                vec3 fogColor = vec3(0.008, 0.004, 0.012);
                col = mix(col, fogColor, fogAmount * 0.7);

                // Subtle depth-based glow for richness
                float depthGlow = smoothstep(15.0, 3.0, t) * 0.05;
                col += vec3(depthGlow) * ao;

            } else {
                // The void beyond the arena - drifting nebula gas + twinkling stars
                col = nebula(rd, u_time);
                col += vec3(0.85, 0.8, 1.0) * stars(rd);
            }

            // Refined vignette
            float distFromCenter = length(uv);
            float vignette = 1.0 - smoothstep(0.3, 1.4, distFromCenter);
            vignette = pow(vignette, 1.5);
            col *= (0.2 + vignette * 0.8);

            // CRT-style scanlines - faint broadcast/monitor texture
            float scanline = sin(gl_FragCoord.y * 1.3 - u_time * 2.0) * 0.5 + 0.5;
            col *= 0.965 + scanline * 0.035;

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

    gl.getExtension('OES_standard_derivatives');
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

        // WebGLのステートは変更しない限り維持されるので、毎フレーム同じ設定を
        // やり直すのは無駄。バッファ/プログラム/属性は一度だけセットしておく。
        gl.clearColor(0, 0, 0, 1);
        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        let rafId = null;

        function render() {
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.uniform1f(timeLoc, (Date.now() - start) / 1000);
            gl.uniform2f(resLoc, canvas.width, canvas.height);
            gl.uniform2f(mouseLoc, mouseX, mouseY);
            gl.drawArrays(gl.TRIANGLES, 0, 6);

            rafId = requestAnimationFrame(render);
        }

        // タブがバックグラウンドにある間は描画を止めて無駄なGPU/CPU消費を避ける
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (rafId !== null) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
            } else if (rafId === null) {
                render();
            }
        });

        render();
    }
}
    }
})();
