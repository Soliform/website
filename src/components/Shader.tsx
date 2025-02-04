"use client";
import { FC, useEffect, useRef } from "react";
import GlslCanvas from "glslCanvas";
import { sand } from "@radix-ui/colors";

interface ShaderCanvasProps {
  frag: string;
  setUniforms?: { [key: string]: string };
}

const ShaderCanvas: FC<ShaderCanvasProps> = (props): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>();
  const containerRef = useRef<HTMLDivElement>();

  const resizer = (
    canvas: HTMLCanvasElement,
    container: HTMLDivElement 
  ): void => {
    canvas.width = container.clientWidth * window.devicePixelRatio;
    canvas.height = container.clientHeight * window.devicePixelRatio;
    canvas.style.width = container.clientWidth + "px";
    canvas.style.height = container.clientHeight + "px";
  };

  useEffect(() => {
    const node = canvasRef.current;
    const container = containerRef.current;
    const sandbox = new GlslCanvas(canvasRef.current);
    for (let k in props.setUniforms) {
      sandbox.setUniform(k, props.setUniforms[k]);
    }

    resizer(canvasRef.current, containerRef.current);
    sandbox.load(props.frag);

    const handler = () => {
      if (
        node.clientWidth !== container.clientWidth ||
        node.clientHeight !== container.clientHeight
      )
        resizer(canvasRef.current, containerRef.current);
    };
  
    window.addEventListener("resize", handler);
    
    return () => {
      window.removeEventListener("resize", handler);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="rounded-md overflow-hidden aspect-square w-full"
    >
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  );
};

export default ShaderCanvas;
