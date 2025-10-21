export const audioReactiveVertexShader = `
  uniform float uTime;
  uniform float uAudioLow;
  uniform float uAudioMid;
  uniform float uAudioHigh;
  uniform float uIntensity;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;

  // 3D Perlin noise function
  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 permute(vec4 x) {
    return mod289(((x * 34.0) + 1.0) * x);
  }

  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  vec3 fade(vec3 t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  }

  float noise(vec3 P) {
    vec3 i0 = mod289(floor(P)), i1 = mod289(i0 + vec3(1.0));
    vec3 f0 = fract(P), f1 = f0 - vec3(1.0), f = fade(f0);
    vec4 ix = vec4(i0.x, i1.x, i0.x, i1.x), iy = vec4(i0.yy, i1.yy);
    vec4 iz0 = i0.zzzz, iz1 = i1.zzzz;
    vec4 ixy = permute(permute(ix) + iy), ixy0 = permute(ixy + iz0), ixy1 = permute(ixy + iz1);
    vec4 gx0 = ixy0 * (1.0 / 7.0), gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    vec4 gx1 = ixy1 * (1.0 / 7.0), gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0); gx1 = fract(gx1);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0), sz0 = step(gz0, vec4(0.0));
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1), sz1 = step(gz1, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5); gy0 -= sz0 * (step(0.0, gy0) - 0.5);
    gx1 -= sz1 * (step(0.0, gx1) - 0.5); gy1 -= sz1 * (step(0.0, gy1) - 0.5);
    vec3 g0 = vec3(gx0.x, gy0.x, gz0.x), g1 = vec3(gx0.y, gy0.y, gz0.y),
         g2 = vec3(gx0.z, gy0.z, gz0.z), g3 = vec3(gx0.w, gy0.w, gz0.w),
         g4 = vec3(gx1.x, gy1.x, gz1.x), g5 = vec3(gx1.y, gy1.y, gz1.y),
         g6 = vec3(gx1.z, gy1.z, gz1.z), g7 = vec3(gx1.w, gy1.w, gz1.w);
    vec4 norm0 = taylorInvSqrt(vec4(dot(g0, g0), dot(g2, g2), dot(g1, g1), dot(g3, g3)));
    vec4 norm1 = taylorInvSqrt(vec4(dot(g4, g4), dot(g6, g6), dot(g5, g5), dot(g7, g7)));
    g0 *= norm0.x; g2 *= norm0.y; g1 *= norm0.z; g3 *= norm0.w;
    g4 *= norm1.x; g6 *= norm1.y; g5 *= norm1.z; g7 *= norm1.w;
    vec4 nz = mix(vec4(dot(g0, vec3(f0.x, f0.y, f0.z)), dot(g1, vec3(f1.x, f0.y, f0.z)),
                       dot(g2, vec3(f0.x, f1.y, f0.z)), dot(g3, vec3(f1.x, f1.y, f0.z))),
                  vec4(dot(g4, vec3(f0.x, f0.y, f1.z)), dot(g5, vec3(f1.x, f0.y, f1.z)),
                       dot(g6, vec3(f0.x, f1.y, f1.z)), dot(g7, vec3(f1.x, f1.y, f1.z))), f.z);
    return 2.2 * mix(mix(nz.x, nz.z, f.y), mix(nz.y, nz.w, f.y), f.x);
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;

    // Multi-octave noise for organic displacement
    float noiseFreq = 1.5;
    float noiseAmp = 0.3;
    vec3 noisePos = position * noiseFreq + vec3(uTime * 0.1);

    float noise1 = noise(noisePos);
    float noise2 = noise(noisePos * 2.0 + vec3(uTime * 0.15)) * 0.5;
    float noise3 = noise(noisePos * 4.0 + vec3(uTime * 0.2)) * 0.25;

    float combinedNoise = (noise1 + noise2 + noise3) * noiseAmp;

    // Audio-reactive displacement
    float audioDisplacement =
      uAudioLow * 0.4 +
      uAudioMid * 0.35 +
      uAudioHigh * 0.25;

    // Combine noise and audio
    float totalDisplacement = (combinedNoise + audioDisplacement) * uIntensity;

    vDisplacement = totalDisplacement;

    // Displace vertices along normal
    vec3 newPosition = position + normal * totalDisplacement;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

export const audioReactiveFragmentShader = `
  uniform float uTime;
  uniform float uAudioLow;
  uniform float uAudioMid;
  uniform float uAudioHigh;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;

  void main() {
    // Fresnel effect for glow
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), 2.5);

    // Audio-reactive fresnel intensity
    float audioFresnel = fresnel * (1.0 + uAudioHigh * 0.8);

    // Color gradient based on displacement
    float colorMix = (vDisplacement + 0.5) * 0.5;
    colorMix = clamp(colorMix, 0.0, 1.0);

    // Three-color gradient
    vec3 color;
    if (colorMix < 0.5) {
      color = mix(uColorA, uColorB, colorMix * 2.0);
    } else {
      color = mix(uColorB, uColorC, (colorMix - 0.5) * 2.0);
    }

    // Audio-reactive brightness pulsing
    float audioPulse = 1.0 + (uAudioLow * 0.3 + uAudioMid * 0.4 + uAudioHigh * 0.3);

    // Combine all effects
    vec3 finalColor = color * audioPulse;

    // Add fresnel glow
    vec3 fresnelColor = mix(uColorB, uColorC, 0.5);
    finalColor += fresnelColor * audioFresnel * 0.8;

    // Edge highlighting based on normal
    float edge = pow(1.0 - abs(dot(vNormal, vec3(0.0, 1.0, 0.0))), 3.0);
    finalColor += edge * uColorC * 0.3 * uAudioMid;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export const organicVertexShader = `
  uniform float uTime;
  uniform float uNoiseStrength;
  uniform vec2 uMouse;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vElevation;

  // Simplex noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float noise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;

    // Multi-layered noise for organic movement
    float noiseScale = 0.8;
    vec3 noiseCoord = position * noiseScale;

    float n1 = noise(noiseCoord + uTime * 0.2);
    float n2 = noise(noiseCoord * 2.0 + uTime * 0.3) * 0.5;
    float n3 = noise(noiseCoord * 4.0 + uTime * 0.4) * 0.25;

    float elevation = (n1 + n2 + n3) * uNoiseStrength;

    // Mouse parallax influence
    float mouseInfluence = length(uMouse) * 0.1;
    vec3 mouseDirection = vec3(uMouse.x, uMouse.y, 0.0);
    elevation += dot(normalize(position), mouseDirection) * mouseInfluence;

    vElevation = elevation;

    vec3 newPosition = position + normal * elevation;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

export const organicFragmentShader = `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uTime;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vElevation;

  void main() {
    // Fresnel for rim lighting
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), 3.0);

    // Color based on elevation and position
    float colorMix = vElevation * 2.0 + 0.5;
    colorMix = clamp(colorMix, 0.0, 1.0);

    vec3 baseColor = mix(uColorA, uColorB, colorMix);

    // Subtle iridescence
    float iridescence = sin(vElevation * 10.0 + uTime * 2.0) * 0.1 + 0.9;
    baseColor *= iridescence;

    // Fresnel glow
    vec3 fresnelColor = uColorB * 1.2;
    vec3 finalColor = baseColor + fresnelColor * fresnel * 0.5;

    // Subtle specular highlight
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float specular = pow(max(dot(reflect(-lightDir, vNormal), viewDirection), 0.0), 32.0);
    finalColor += vec3(1.0) * specular * 0.3;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
