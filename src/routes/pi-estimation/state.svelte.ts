// In a .svelte.ts file, we can use runes directly.

export type Dart = {
  x: number;
  y: number;
  inCircle: boolean;
};

export const state = $state({
  darts: [] as Dart[],
  totalDarts: 0,
  dartsInsideCircle: 0,
  isRunning: false,
});

export const reset = () => {
  state.darts = [];
  state.totalDarts = 0;
  state.dartsInsideCircle = 0;
  state.isRunning = false;
};

export const initialize = () => {
  $effect(() => {
    if (!state.isRunning) return;

    let frame = requestAnimationFrame(function gameLoop() {
      const x = Math.random();
      const y = Math.random();
      const distance = Math.sqrt((x - 0.5) ** 2 + (y - 0.5) ** 2);
      const inCircle = distance <= 0.5;

      // Create a new array for reactivity
      state.darts = [...state.darts, { x, y, inCircle }];
      state.totalDarts++;
      if (inCircle) {
        state.dartsInsideCircle++;
      }
      frame = requestAnimationFrame(gameLoop);
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  });
};
