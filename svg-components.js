/**
 * svg-components.js
 * Reusable, parameterized SVG component library for bird drawings.
 * Each function returns an SVG string fragment ready to be inserted into an <svg> element.
 *
 * Patterns extracted from:
 *   freehand.html, traced.html, bluejay.html, hummingbird.html,
 *   baseline.html, baseline-bezier.html
 */

'use strict';

const svgComponents = (() => {

  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------

  /** Cubic-bezier constant for approximating circles/ellipses. */
  const K = 0.5523;

  /**
   * Convert degrees to radians.
   */
  function deg2rad(d) { return d * Math.PI / 180; }

  /**
   * Build a cubic-bezier ellipse path string.
   * Equivalent to <ellipse cx cy rx ry> but as a <path d="...">.
   */
  function ellipsePath(cx, cy, rx, ry) {
    const kx = K * rx, ky = K * ry;
    return [
      `M ${cx},${cy - ry}`,
      `C ${cx + kx},${cy - ry}  ${cx + rx},${cy - ky}  ${cx + rx},${cy}`,
      `C ${cx + rx},${cy + ky}  ${cx + kx},${cy + ry}  ${cx},${cy + ry}`,
      `C ${cx - kx},${cy + ry}  ${cx - rx},${cy + ky}  ${cx - rx},${cy}`,
      `C ${cx - rx},${cy - ky}  ${cx - kx},${cy - ry}  ${cx},${cy - ry} Z`
    ].join(' ');
  }

  /**
   * Rotate a point (px, py) around (ox, oy) by angle in degrees.
   */
  function rotatePt(px, py, ox, oy, angleDeg) {
    const a = deg2rad(angleDeg);
    const cos = Math.cos(a), sin = Math.sin(a);
    const dx = px - ox, dy = py - oy;
    return [ox + dx * cos - dy * sin, oy + dx * sin + dy * cos];
  }

  /**
   * Format a number to two decimal places, stripping trailing zeros.
   */
  function n(v) { return parseFloat(v.toFixed(2)); }

  /**
   * Generate a unique id prefix for this call so multiple components on the
   * same page don't clash.
   */
  let _uid = 0;
  function uid() { return `sc${++_uid}`; }

  // ---------------------------------------------------------------------------
  // 1. eye
  // ---------------------------------------------------------------------------
  /**
   * A bird eye: dark iris, pupil, and one or two specular highlights.
   *
   * @param {Object} opts
   * @param {number} opts.cx           - Centre x
   * @param {number} opts.cy           - Centre y
   * @param {number} [opts.r=12]       - Outer iris radius
   * @param {number} [opts.pupilRatio=0.55] - Pupil radius as fraction of r
   * @param {number} [opts.highlightAngle=315] - Angle (degrees) of primary highlight (0=right, 90=down)
   * @param {string} [opts.irisColor='#0C0604']  - Iris fill
   * @param {string} [opts.ringColor='']  - Optional outer ring colour ('' = none)
   * @param {number} [opts.ringOpacity=0.2]
   * @returns {string} SVG string
   */
  function eye(opts = {}) {
    const {
      cx = 200, cy = 150, r = 12,
      pupilRatio = 0.55,
      highlightAngle = 315,
      irisColor = '#0C0604',
      ringColor = '',
      ringOpacity = 0.2,
    } = opts;

    const pr = r * pupilRatio;
    // Primary highlight: offset 35% of r in the highlight direction
    const ha = deg2rad(highlightAngle);
    const hd = r * 0.35;
    const hx = n(cx + hd * Math.cos(ha));
    const hy = n(cy + hd * Math.sin(ha));
    const hr = n(r * 0.28);

    // Secondary highlight (faint, opposite side)
    const ha2 = deg2rad(highlightAngle + 180);
    const hx2 = n(cx + r * 0.22 * Math.cos(ha2));
    const hy2 = n(cy + r * 0.22 * Math.sin(ha2));
    const hr2 = n(r * 0.12);

    let out = `<g class="sc-eye">`;
    if (ringColor) {
      out += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r * 1.4)}" fill="${ringColor}" opacity="${ringOpacity}"/>`;
    }
    out += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="${irisColor}"/>`;
    out += `<circle cx="${n(hx)}" cy="${n(hy)}" r="${n(hr)}" fill="white" opacity="0.92"/>`;
    out += `<circle cx="${n(hx2)}" cy="${n(hy2)}" r="${n(hr2)}" fill="white" opacity="0.30"/>`;
    out += `</g>`;
    return out;
  }

  // ---------------------------------------------------------------------------
  // 2. beak
  // ---------------------------------------------------------------------------
  /**
   * A bird beak.
   *
   * @param {Object} opts
   * @param {number} opts.x            - Base x (where beak meets face)
   * @param {number} opts.y            - Base y (vertical midpoint of beak base)
   * @param {number} [opts.length=24]  - Length of beak
   * @param {number} [opts.angle=0]    - Angle in degrees (0=pointing right, 180=left)
   * @param {number} [opts.thickness=8] - Thickness at the base (total height of both mandibles)
   * @param {string} [opts.color='#1A1410']
   * @param {string} [opts.style='conical'] - 'conical' | 'hooked' | 'thin'
   * @returns {string} SVG string
   */
  function beak(opts = {}) {
    const {
      x = 200, y = 170,
      length = 24,
      angle = 0,
      thickness = 8,
      color = '#1A1410',
      style = 'conical',
    } = opts;

    const a = deg2rad(angle);
    const cos = Math.cos(a), sin = Math.sin(a);

    // Tip of beak
    const tipX = n(x + length * cos);
    const tipY = n(y + length * sin);

    // Upper mandible half-thickness
    const ht = thickness * 0.5;
    // Upper base corner
    const ubx = n(x - ht * sin), uby = n(y + ht * cos);
    // Lower base corner
    const lbx = n(x + ht * sin), lby = n(y - ht * cos);

    let upper, lower;
    if (style === 'hooked') {
      // Hook: tip curves downward
      const hookX = n(tipX - thickness * 0.3 * sin);
      const hookY = n(tipY + thickness * 0.3 * cos);
      const midX = n((x + tipX) * 0.5);
      const midY = n((y + tipY) * 0.5 - thickness * 0.25);
      upper = `M ${ubx},${uby} Q ${midX},${n(midY)} ${tipX},${tipY} Q ${hookX},${hookY} ${lbx},${lby} Z`;
      lower = '';
    } else if (style === 'thin') {
      // Needle beak (hummingbird)
      const ht2 = thickness * 0.2;
      const ubx2 = n(x - ht2 * sin), uby2 = n(y + ht2 * cos);
      const lbx2 = n(x + ht2 * sin), lby2 = n(y - ht2 * cos);
      upper = `M ${ubx2},${uby2} L ${tipX},${tipY} L ${lbx2},${lby2} Z`;
      lower = '';
    } else {
      // Conical (default, robin/baseline style): two separate mandibles
      const midX = n((x + tipX) * 0.5);
      const midY = n((y + tipY) * 0.5);
      // Upper mandible
      upper = `M ${ubx},${uby} L ${tipX},${tipY} L ${n(x)},${n(y)} Z`;
      // Lower mandible (slightly lighter)
      lower = `<path class="sc-beak-lower" d="M ${n(x)},${n(y)} L ${tipX},${tipY} L ${lbx},${lby} Z" fill="${color}" opacity="0.75"/>`;
    }

    return `<g class="sc-beak">
  <path class="sc-beak-upper" d="${upper}" fill="${color}"/>
  ${lower}
</g>`;
  }

  // ---------------------------------------------------------------------------
  // 3. body
  // ---------------------------------------------------------------------------
  /**
   * The main body ellipse (or bezier-equivalent path).
   *
   * @param {Object} opts
   * @param {number} opts.cx
   * @param {number} opts.cy
   * @param {number} [opts.rx=120]
   * @param {number} [opts.ry=65]
   * @param {string} [opts.color='#F09060']
   * @param {boolean} [opts.gradient=false]  - If true, insert a linearGradient
   * @param {string} [opts.gradientEnd='']   - Second stop colour (defaults to darker version of color)
   * @param {string} [opts.style='ellipse']  - 'ellipse' | 'bezier'
   * @param {number} [opts.rotationDeg=0]    - Rotate the shape
   * @returns {string} SVG string
   */
  function body(opts = {}) {
    const {
      cx = 250, cy = 280,
      rx = 120, ry = 65,
      color = '#F09060',
      gradient = false,
      gradientEnd = '',
      style = 'ellipse',
      rotationDeg = 0,
    } = opts;

    const id = uid();
    let fillAttr, defsStr = '';

    if (gradient) {
      const gid = `bodyGrad${id}`;
      const endColor = gradientEnd || darken(color, 0.25);
      defsStr = `<defs><linearGradient id="${gid}" x1="80%" y1="20%" x2="20%" y2="90%">
  <stop offset="0%" stop-color="${color}"/>
  <stop offset="100%" stop-color="${endColor}"/>
</linearGradient></defs>`;
      fillAttr = `url(#${gid})`;
    } else {
      fillAttr = color;
    }

    let shape;
    const rotStr = rotationDeg ? ` transform="rotate(${rotationDeg},${n(cx)},${n(cy)})"` : '';
    if (style === 'bezier') {
      shape = `<path class="sc-body" d="${ellipsePath(cx, cy, rx, ry)}" fill="${fillAttr}"${rotStr}/>`;
    } else {
      shape = `<ellipse class="sc-body" cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry)}" fill="${fillAttr}"${rotStr}/>`;
    }

    return defsStr + shape;
  }

  // ---------------------------------------------------------------------------
  // 4. head
  // ---------------------------------------------------------------------------
  /**
   * A circular head.
   *
   * @param {Object} opts
   * @param {number} opts.cx
   * @param {number} opts.cy
   * @param {number} [opts.r=50]
   * @param {string} [opts.color='#1D2B3A']
   * @param {boolean} [opts.gradient=false]
   * @param {string} [opts.gradientEnd='']
   * @param {string} [opts.style='circle'] - 'circle' | 'bezier'
   * @returns {string} SVG string
   */
  function head(opts = {}) {
    const {
      cx = 355, cy = 182,
      r = 50,
      color = '#1D2B3A',
      gradient = false,
      gradientEnd = '',
      style = 'circle',
    } = opts;

    const id = uid();
    let fillAttr, defsStr = '';

    if (gradient) {
      const gid = `headGrad${id}`;
      const endColor = gradientEnd || darken(color, 0.3);
      defsStr = `<defs><radialGradient id="${gid}" cx="42%" cy="35%" r="60%">
  <stop offset="0%" stop-color="${color}"/>
  <stop offset="100%" stop-color="${endColor}"/>
</radialGradient></defs>`;
      fillAttr = `url(#${gid})`;
    } else {
      fillAttr = color;
    }

    let shape;
    if (style === 'bezier') {
      shape = `<path class="sc-head" d="${ellipsePath(cx, cy, r, r)}" fill="${fillAttr}"/>`;
    } else {
      shape = `<circle class="sc-head" cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="${fillAttr}"/>`;
    }

    return defsStr + shape;
  }

  // ---------------------------------------------------------------------------
  // 5. wing
  // ---------------------------------------------------------------------------
  /**
   * A wing shape defined by control points.
   *
   * @param {Object} opts
   * @param {number} opts.cx     - Approximate centre x of the wing
   * @param {number} opts.cy     - Approximate centre y of the wing
   * @param {number} [opts.width=120]
   * @param {number} [opts.height=160]
   * @param {string} [opts.color='#1D2B3A']
   * @param {string} [opts.style='flat'] - 'flat' | 'feathered'
   * @param {number} [opts.rotationDeg=0] - Tilt the wing
   * @param {boolean} [opts.featherLines=false]
   * @returns {string} SVG string
   */
  function wing(opts = {}) {
    const {
      cx = 200, cy = 270,
      width = 120, height = 160,
      color = '#1D2B3A',
      style = 'flat',
      rotationDeg = 0,
      featherLines = false,
    } = opts;

    // Build a wing shape using cubic bezier paths.
    // The wing is an arch from upper-right, sweeping left and down.
    const rx = width * 0.5, ry = height * 0.5;
    const top    = [cx,      cy - ry];
    const right  = [cx + rx, cy];
    const bottom = [cx,      cy + ry];
    const left   = [cx - rx, cy];

    // Rough bezier wing: starts top, curves toward right-back, bottom, and back
    const d = [
      `M ${n(top[0])},${n(top[1])}`,
      `C ${n(cx + rx * 0.5)},${n(cy - ry)} ${n(right[0])},${n(cy - ry * 0.3)} ${n(right[0])},${n(right[1])}`,
      `C ${n(right[0])},${n(cy + ry * 0.6)} ${n(cx + rx * 0.3)},${n(bottom[1])} ${n(bottom[0])},${n(bottom[1])}`,
      `C ${n(cx - rx * 0.5)},${n(bottom[1])} ${n(left[0])},${n(cy + ry * 0.3)} ${n(left[0])},${n(left[1])}`,
      `C ${n(left[0])},${n(cy - ry * 0.6)} ${n(cx - rx * 0.3)},${n(top[1])} ${n(top[0])},${n(top[1])} Z`,
    ].join(' ');

    const rotStr = rotationDeg ? ` transform="rotate(${rotationDeg},${n(cx)},${n(cy)})"` : '';
    let out = `<path class="sc-wing" d="${d}" fill="${color}"${rotStr}/>`;

    if (featherLines) {
      const fl = [];
      for (let i = 1; i <= 4; i++) {
        const t = i / 5;
        const fy1 = n(top[1] + (bottom[1] - top[1]) * t);
        const fy2 = fy1;
        fl.push(`<path d="M ${n(cx - rx * 0.6)},${fy1} Q ${n(cx)},${fy2} ${n(cx + rx * 0.5)},${fy2}"
     stroke="${darken(color, 0.3)}" stroke-width="1" fill="none" opacity="0.3"/>`);
      }
      out += `<g class="sc-wing-feathers">${fl.join('')}</g>`;
    }

    return out;
  }

  // ---------------------------------------------------------------------------
  // 6. tail
  // ---------------------------------------------------------------------------
  /**
   * A wedge tail.
   *
   * @param {Object} opts
   * @param {number} opts.x      - Base x (where tail meets body)
   * @param {number} opts.y      - Base y
   * @param {number} [opts.width=60]
   * @param {number} [opts.length=70]
   * @param {string} [opts.color='#E06040']
   * @param {number} [opts.angle=200]   - Pointing direction in degrees (0=right, 180=left, 200=lower-left)
   * @param {boolean} [opts.split=false] - Fan tail with two lobes
   * @returns {string} SVG string
   */
  function tail(opts = {}) {
    const {
      x = 150, y = 320,
      width = 60, length = 70,
      color = '#E06040',
      angle = 200,
      split = false,
    } = opts;

    const a = deg2rad(angle);
    const cos = Math.cos(a), sin = Math.sin(a);

    // Tip of tail
    const tipX = n(x + length * cos);
    const tipY = n(y + length * sin);

    // Half-width perpendicular direction
    const pw = width * 0.5;
    const px = n(x - pw * sin);
    const py = n(y + pw * cos);
    const px2 = n(x + pw * sin);
    const py2 = n(y - pw * cos);

    if (split) {
      // Two lobes fanning out
      const spread = deg2rad(20);
      const lobe = (da) => {
        const la = a + da;
        const lcos = Math.cos(la), lsin = Math.sin(la);
        const tx = n(x + length * 1.1 * lcos);
        const ty = n(y + length * 1.1 * lsin);
        return `<path d="M ${n(x)},${n(y)} C ${n(px)},${n(py)} ${tx},${ty} ${tx},${ty} C ${tx},${ty} ${n(px2)},${n(py2)} ${n(x)},${n(y)} Z" fill="${color}" opacity="0.9"/>`;
      };
      return `<g class="sc-tail">
  ${lobe(-spread)}
  ${lobe(spread)}
</g>`;
    }

    const d = `M ${px},${py} C ${n((px + tipX) * 0.5)},${n((py + tipY) * 0.5)} ${tipX},${tipY} ${tipX},${tipY} C ${tipX},${tipY} ${n((px2 + tipX) * 0.5)},${n((py2 + tipY) * 0.5)} ${px2},${py2} Z`;
    return `<path class="sc-tail" d="${d}" fill="${color}"/>`;
  }

  // ---------------------------------------------------------------------------
  // 7. legs
  // ---------------------------------------------------------------------------
  /**
   * A pair of legs with toes.
   *
   * @param {Object} opts
   * @param {number} opts.x            - Horizontal centre between legs
   * @param {number} opts.y            - Top of legs (bottom of body)
   * @param {number} [opts.legLength=45]
   * @param {number} [opts.spread=22]  - Half-distance between legs horizontally
   * @param {number} [opts.toeCount=3] - Toes per foot (forward) + 1 back toe
   * @param {number} [opts.toeLength=18]
   * @param {string} [opts.color='#9B7B5A']
   * @param {number} [opts.strokeWidth=3]
   * @param {string} [opts.style='perched'] - 'perched' | 'rect' (flat geometric)
   * @returns {string} SVG string
   */
  function legs(opts = {}) {
    const {
      x = 260, y = 380,
      legLength = 45,
      spread = 22,
      toeCount = 3,
      toeLength = 18,
      color = '#9B7B5A',
      strokeWidth = 3,
      style = 'perched',
    } = opts;

    if (style === 'rect') {
      // Flat geometric style (baseline.html)
      const lw = strokeWidth * 3;
      const fh = Math.round(strokeWidth * 2.5);
      const fw = Math.round(toeLength * 2.5);
      const rx = Math.round(strokeWidth * 1.5);
      const lx1 = n(x - spread), lx2 = n(x + spread);
      const fy = n(y + legLength);
      return `<g class="sc-legs-rect">
  <rect x="${n(lx1 - lw / 2)}" y="${n(y)}" width="${lw}" height="${n(legLength)}" rx="${rx}" fill="${color}"/>
  <rect x="${n(lx1 - fw / 2)}" y="${n(fy)}" width="${fw}" height="${fh}" rx="${rx}" fill="${color}"/>
  <rect x="${n(lx2 - lw / 2)}" y="${n(y)}" width="${lw}" height="${n(legLength)}" rx="${rx}" fill="${color}"/>
  <rect x="${n(lx2 - fw / 2)}" y="${n(fy)}" width="${fw}" height="${fh}" rx="${rx}" fill="${color}"/>
</g>`;
    }

    // Perched style: stroke-based legs and toe spokes
    const leg = (lx) => {
      const footY = n(y + legLength);
      const toeAngles = [];
      // Front toes spread evenly
      for (let i = 0; i < toeCount; i++) {
        toeAngles.push(-40 + i * (80 / (toeCount - 1)));
      }
      const toeLines = toeAngles.map(ta => {
        const tra = deg2rad(ta + 90); // +90 so 0 = downward
        const tx = n(lx + toeLength * Math.cos(tra));
        const ty = n(footY + toeLength * Math.sin(tra));
        return `<path d="M ${lx},${footY} Q ${n((lx + tx) * 0.5)},${n(footY + 4)} ${tx},${ty}" stroke="${color}" stroke-width="${n(strokeWidth * 0.7)}" fill="none" stroke-linecap="round"/>`;
      });
      // Back toe
      const btra = deg2rad(-90 + 90);
      const btx = n(lx - toeLength * 0.8 * Math.cos(btra));
      const bty = n(footY - toeLength * 0.8 * Math.sin(btra));
      toeLines.push(`<path d="M ${lx},${footY} L ${btx},${bty}" stroke="${color}" stroke-width="${n(strokeWidth * 0.6)}" fill="none" stroke-linecap="round" opacity="0.8"/>`);

      return `<path d="M ${lx},${n(y)} L ${lx},${footY}" stroke="${color}" stroke-width="${strokeWidth}" fill="none" stroke-linecap="round"/>
${toeLines.join('\n')}`;
    };

    return `<g class="sc-legs" stroke-linecap="round">
${leg(n(x - spread))}
${leg(n(x + spread))}
</g>`;
  }

  // ---------------------------------------------------------------------------
  // 8. branch
  // ---------------------------------------------------------------------------
  /**
   * A branch the bird can perch on.
   *
   * @param {Object} opts
   * @param {number} [opts.x1=50]
   * @param {number} [opts.y1=390]
   * @param {number} [opts.x2=450]
   * @param {number} [opts.y2=385]
   * @param {number} [opts.thickness=16]
   * @param {string} [opts.color='#7A5028']
   * @param {string} [opts.highlightColor='#B08040']
   * @param {boolean} [opts.bark=true]  - Add knot texture
   * @param {boolean} [opts.gradient=true]
   * @returns {string} SVG string
   */
  function branch(opts = {}) {
    const {
      x1 = 50, y1 = 390,
      x2 = 450, y2 = 385,
      thickness = 16,
      color = '#7A5028',
      highlightColor = '#B08040',
      bark = true,
      gradient = true,
    } = opts;

    // Control point for a gentle curve
    const mx = n((x1 + x2) * 0.5);
    const my = n(Math.min(y1, y2) - thickness * 0.5);

    const id = uid();
    let defsStr = '', fillStr;

    if (gradient) {
      const gid = `branchGrad${id}`;
      defsStr = `<defs><linearGradient id="${gid}" x1="0%" y1="0%" x2="0%" y2="100%">
  <stop offset="0%" stop-color="${highlightColor}"/>
  <stop offset="45%" stop-color="${color}"/>
  <stop offset="100%" stop-color="${darken(color, 0.3)}"/>
</linearGradient></defs>`;
      fillStr = `url(#${gid})`;
    } else {
      fillStr = color;
    }

    let out = defsStr;
    // Shadow
    out += `<path d="M ${x1},${n(y1 + 4)} Q ${mx},${n(my + 4)} ${x2},${n(y2 + 4)}" stroke="${darken(color, 0.4)}" stroke-width="${n(thickness * 1.3)}" fill="none" stroke-linecap="round" opacity="0.5"/>`;
    // Main branch
    out += `<path class="sc-branch" d="M ${x1},${y1} Q ${mx},${my} ${x2},${y2}" stroke="${fillStr}" stroke-width="${thickness}" fill="none" stroke-linecap="round"/>`;
    // Top highlight
    out += `<path d="M ${x1},${n(y1 - thickness * 0.3)} Q ${mx},${n(my - thickness * 0.3)} ${x2},${n(y2 - thickness * 0.3)}" stroke="${highlightColor}" stroke-width="${n(thickness * 0.28)}" fill="none" stroke-linecap="round" opacity="0.35"/>`;

    if (bark) {
      // Two knot arcs
      const kx1 = n(x1 + (x2 - x1) * 0.3);
      const ky1 = n(y1 + (y2 - y1) * 0.3 - thickness * 0.05);
      const kx2 = n(x1 + (x2 - x1) * 0.65);
      const ky2 = n(y1 + (y2 - y1) * 0.65 - thickness * 0.05);
      out += `<path d="M ${n(kx1 - 8)},${ky1} Q ${kx1},${n(ky1 - 3)} ${n(kx1 + 8)},${ky1}" stroke="${darken(color, 0.25)}" stroke-width="2" fill="none" opacity="0.55"/>`;
      out += `<path d="M ${n(kx2 - 6)},${ky2} Q ${kx2},${n(ky2 - 2)} ${n(kx2 + 6)},${ky2}" stroke="${darken(color, 0.25)}" stroke-width="1.5" fill="none" opacity="0.45"/>`;
    }

    return out;
  }

  // ---------------------------------------------------------------------------
  // 9. vignette
  // ---------------------------------------------------------------------------
  /**
   * A photographic vignette overlay (dark edges, transparent centre).
   *
   * @param {Object} opts
   * @param {number} [opts.width=500]
   * @param {number} [opts.height=500]
   * @param {number} [opts.opacity=0.55]
   * @param {string} [opts.color='#000000']
   * @returns {string} SVG string
   */
  function vignette(opts = {}) {
    const {
      width = 500, height = 500,
      opacity = 0.55,
      color = '#000000',
    } = opts;

    const id = uid();
    const gid = `vignetteGrad${id}`;
    return `<defs>
  <radialGradient id="${gid}" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
    <stop offset="0%" stop-color="${color}" stop-opacity="0"/>
    <stop offset="100%" stop-color="${color}" stop-opacity="${opacity}"/>
  </radialGradient>
</defs>
<rect class="sc-vignette" x="0" y="0" width="${width}" height="${height}" fill="url(#${gid})" pointer-events="none"/>`;
  }

  // ---------------------------------------------------------------------------
  // 10. bokeh
  // ---------------------------------------------------------------------------
  /**
   * Soft background bokeh circles (out-of-focus foliage simulation).
   *
   * @param {Object} opts
   * @param {number} [opts.width=500]
   * @param {number} [opts.height=500]
   * @param {string[]} [opts.colors=['#2d5016','#4a7c23']]
   * @param {number} [opts.count=10]
   * @param {number} [opts.minR=30]
   * @param {number} [opts.maxR=100]
   * @param {number} [opts.seed=42]   - Deterministic random seed
   * @returns {string} SVG string
   */
  function bokeh(opts = {}) {
    const {
      width = 500, height = 500,
      colors = ['#2d5016', '#4a7c23', '#3d6b1c'],
      count = 10,
      minR = 30, maxR = 100,
      seed = 42,
    } = opts;

    const id = uid();
    const fid = `bokehBlur${id}`;

    // Simple seeded LCG random
    let s = seed;
    function rand() {
      s = (s * 1664525 + 1013904223) & 0xffffffff;
      return (s >>> 0) / 4294967296;
    }

    const circles = [];
    for (let i = 0; i < count; i++) {
      const cx = n(rand() * width);
      const cy = n(rand() * height);
      const r  = n(minR + rand() * (maxR - minR));
      const c  = colors[Math.floor(rand() * colors.length)];
      const op = n(0.25 + rand() * 0.35);
      circles.push(`<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${n(r * (0.7 + rand() * 0.6))}" fill="${c}" opacity="${op}" filter="url(#${fid})"/>`);
    }

    return `<defs>
  <filter id="${fid}" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur stdDeviation="18"/>
  </filter>
</defs>
<g class="sc-bokeh">
${circles.join('\n')}
</g>`;
  }

  // ---------------------------------------------------------------------------
  // 11. featherTexture
  // ---------------------------------------------------------------------------
  /**
   * An feTurbulence-based organic feather/spot texture overlay.
   * Apply inside a clipPath region.
   *
   * @param {Object} opts
   * @param {number} opts.cx
   * @param {number} opts.cy
   * @param {number} [opts.rx=55]
   * @param {number} [opts.ry=90]
   * @param {string} [opts.color='#189870']
   * @param {number} [opts.opacity=0.75]
   * @param {number} [opts.baseFreqX=0.038]
   * @param {number} [opts.baseFreqY=0.028]
   * @param {number} [opts.seed=11]
   * @param {number} [opts.alphaScale=8]
   * @param {number} [opts.alphaBias=-3.2]
   * @returns {string} SVG string
   */
  function featherTexture(opts = {}) {
    const {
      cx = 300, cy = 250,
      rx = 55, ry = 90,
      color = '#189870',
      opacity = 0.75,
      baseFreqX = 0.038,
      baseFreqY = 0.028,
      seed = 11,
      alphaScale = 8,
      alphaBias = -3.2,
    } = opts;

    const id = uid();
    const fid = `featherFilter${id}`;
    const cid = `featherClip${id}`;

    return `<defs>
  <filter id="${fid}" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
    <feTurbulence type="turbulence" baseFrequency="${baseFreqX} ${baseFreqY}" numOctaves="3" seed="${seed}" result="noise"/>
    <feColorMatrix type="matrix"
      values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${alphaScale} 0 0 0 ${alphaBias}"
      in="noise" result="blobAlpha"/>
    <feComposite in="SourceGraphic" in2="blobAlpha" operator="in"/>
    <feGaussianBlur stdDeviation="1.2"/>
  </filter>
  <clipPath id="${cid}">
    <ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry)}"/>
  </clipPath>
</defs>
<ellipse class="sc-feather-texture" cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry)}"
         fill="${color}" opacity="${opacity}"
         clip-path="url(#${cid})"
         filter="url(#${fid})"/>`;
  }

  // ---------------------------------------------------------------------------
  // 12. shadow
  // ---------------------------------------------------------------------------
  /**
   * A ground shadow ellipse under the bird.
   *
   * @param {Object} opts
   * @param {number} opts.cx
   * @param {number} opts.cy
   * @param {number} [opts.rx=80]
   * @param {number} [opts.ry=7]
   * @param {string} [opts.color='#c0c5cc']
   * @param {number} [opts.opacity=0.5]
   * @returns {string} SVG string
   */
  function shadow(opts = {}) {
    const {
      cx = 250, cy = 445,
      rx = 80, ry = 7,
      color = '#c0c5cc',
      opacity = 0.5,
    } = opts;
    return `<ellipse class="sc-shadow" cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry)}" fill="${color}" opacity="${opacity}"/>`;
  }

  // ---------------------------------------------------------------------------
  // Colour helper
  // ---------------------------------------------------------------------------
  /**
   * Darken a hex colour by a factor (0–1).
   */
  function darken(hex, factor) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const r = Math.round(parseInt(hex.slice(0, 2), 16) * (1 - factor));
    const g = Math.round(parseInt(hex.slice(2, 4), 16) * (1 - factor));
    const b = Math.round(parseInt(hex.slice(4, 6), 16) * (1 - factor));
    return '#' + [r, g, b].map(v => Math.max(0, v).toString(16).padStart(2, '0')).join('');
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------
  return {
    eye,
    beak,
    body,
    head,
    wing,
    tail,
    legs,
    branch,
    vignette,
    bokeh,
    featherTexture,
    shadow,
    // Expose helpers for playground use
    _ellipsePath: ellipsePath,
    _darken: darken,
  };

})();

// CommonJS / ES module compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = svgComponents;
}
