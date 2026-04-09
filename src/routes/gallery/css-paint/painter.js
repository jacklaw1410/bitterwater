/** @implements {Painter} */
class CheckerboardPainter {
  static get inputProperties() {
    return ['--checker-color-1', '--checker-color-2', '--checker-size'];
  }

  /** @type {Painter['paint']} */
  paint(ctx, geom, properties) {
    const color1 = properties.get('--checker-color-1')?.toString() || '#ccc';
    const color2 = properties.get('--checker-color-2')?.toString() || '#fff';
    const size = parseInt(properties.get('--checker-size')?.toString() || '10', 10);

    const cols = Math.ceil(geom.width / size);
    const rows = Math.ceil(geom.height / size);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        ctx.fillStyle = (row + col) % 2 === 0 ? color1 : color2;
        ctx.fillRect(col * size, row * size, size, size);
      }
    }
  }
}

/** @implements {Painter} */
class CirclePainter {
  static get inputProperties() {
    return ['--circle-color'];
  }

  /** @type {Painter['paint']} */
  paint(ctx, geom, properties) {
    const color = properties.get('--circle-color')?.toString() || 'blue';
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(geom.width / 2, geom.height / 2, Math.min(geom.width, geom.height) / 2, 0, 2 * Math.PI);
    ctx.fill();
  }
}

/** @implements {Painter} */
class PunchHolePainter {
  static get inputProperties() {
    return ['--punch-hole-bg', '--punch-hole-size'];
  }

  /** @type {Painter['paint']} */
  paint(ctx, geom, properties) {
    const bg = properties.get('--punch-hole-bg')?.toString();
    const size = parseInt(properties.get('--punch-hole-size')?.toString() || '8', 10);

    if (bg) {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, geom.width, geom.height);
    }

    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'unset';
    ctx.beginPath();
    ctx.arc(0, geom.height / 2, size, -Math.PI / 2, Math.PI / 2);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(geom.width, geom.height / 2, size, -Math.PI / 2, Math.PI / 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }
}

registerPaint('checkerboard', CheckerboardPainter);
registerPaint('circle', CirclePainter);
registerPaint('punch-hole', PunchHolePainter);
