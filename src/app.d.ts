// See https://svelte.dev/docs/kit/types#app.d.ts

interface PaintWorklet {
  addModule(module: string): Promise<void>;
}

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  namespace CSS {
    var paintWorklet: PaintWorklet;
  }

  interface Painter {
    readonly inputProperties?: string[];
    readonly inputArguments?: string[];
    readonly contextOptions?: object;
    paint(
      ctx: CanvasRenderingContext2D,
      geom: { width: number; height: number },
      properties: Map<string, string | CSSStyleValue>,
    ): void;
  }

  interface PaintWorkletGlobalScope {
    registerPaint(name: string, painterClass: typeof Painter): void;
  }

  var registerPaint: PaintWorkletGlobalScope['registerPaint'];
}

export {};
