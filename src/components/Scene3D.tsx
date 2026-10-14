"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const Canvas3D = dynamic(() => import("./Canvas3D"), { ssr: false });
function hasWebGL() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; }
}
// Decorative 3D layer; falls back to nothing without WebGL.
export default function Scene3D({ mode, className = "" }: { mode: "statue" | "ribbon"; className?: string }) {
  const [ok, setOk] = useState(false); const [reduce, setReduce] = useState(false);
  useEffect(() => { setOk(hasWebGL()); setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);
  return <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>{ok && <Canvas3D mode={mode} reduceMotion={reduce} />}</div>;
}
