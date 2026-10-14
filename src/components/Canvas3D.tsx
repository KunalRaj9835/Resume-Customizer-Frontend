"use client";
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import * as THREE from "three";

// Clone, centre and scale a model so its chosen dimension equals `target`.
function Fitted({ url, target, axis }: { url: string; target: number; axis: "x" | "y" }) {
  const { scene } = useGLTF(url);
  const root = useMemo(() => {
    const c = scene.clone(true);
    if (url.includes("statue")) {
      // Blender's iridescent shader doesn't survive glTF export; rebuild it as a thin-film physical material.
      const mat = new THREE.MeshPhysicalMaterial({ color: "#1a2a8c", metalness: 0.7, roughness: 0.3, iridescence: 1, iridescenceIOR: 2.2, iridescenceThicknessRange: [300, 1100], envMapIntensity: 1.2 });
      c.traverse(o => { if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).material = mat; });
    }
    if (url.includes("curve")) {
      const mat = new THREE.MeshPhysicalMaterial({ color: "#e0541c", metalness: 1, roughness: 0.14, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.4 });
      c.traverse(o => { if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).material = mat; });
    }
    return c;
  }, [scene, url]);
  const holder = useRef<THREE.Group>(null);
  useLayoutEffect(() => {
    // Measure at unit scale; otherwise a resize re-measures the already-scaled model and scales compound.
    if (holder.current) { holder.current.scale.setScalar(1); holder.current.position.set(0, 0, 0); holder.current.updateMatrixWorld(true); }
    root.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const c = box.getCenter(new THREE.Vector3());
    const s = target / (axis === "x" ? size.x : size.y);
    if (holder.current) { holder.current.scale.setScalar(s); holder.current.position.copy(c.multiplyScalar(-s)); }
  }, [root, target, axis]);
  return <group ref={holder}><primitive object={root} /></group>;
}

function Statue({ reduceMotion }: { reduceMotion: boolean }) {
  const g = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const m = (e: PointerEvent) => { mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1; mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1; };
    window.addEventListener("pointermove", m); return () => window.removeEventListener("pointermove", m);
  }, []);
  useFrame(({ clock }) => {
    if (!g.current) return;
    const t = reduceMotion ? 0 : clock.elapsedTime;
    g.current.rotation.y = Math.sin(t * 0.5) * 0.12 + (reduceMotion ? 0 : mouse.current.x * 0.35);
    g.current.rotation.x = reduceMotion ? 0 : mouse.current.y * 0.08;
  });
  return <group ref={g} position={[0, viewport.height * 0.06, 0]}><Fitted url="/models/statue.glb" target={viewport.height * 0.56} axis="y" /></group>;
}

function Ribbon({ reduceMotion }: { reduceMotion: boolean }) {
  const g = useRef<THREE.Group>(null);
  const { viewport, invalidate } = useThree();
  useEffect(() => {
    if (reduceMotion) return;
    const s = () => invalidate(); window.addEventListener("scroll", s, { passive: true }); return () => window.removeEventListener("scroll", s);
  }, [reduceMotion, invalidate]);
  useFrame(() => {
    if (!g.current) return;
    const p = reduceMotion ? 0 : window.scrollY / 1200;
    g.current.rotation.set(0.5 + p * 0.25, -0.35 + p * 0.5, -0.25 + p * 0.1);
    g.current.position.y = Math.sin(p) * 0.4;
  });
  return <group ref={g}><Fitted url="/models/curve.glb" target={viewport.width * (viewport.width < 4 ? 1.9 : 1.15)} axis="x" /></group>;
}

// Procedural reflection environment: no network fetch, unlike drei's HDR presets.
function Env() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const tex = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = tex;
    return () => { scene.environment = null; tex.dispose(); pm.dispose(); };
  }, [gl, scene]);
  return null;
}

export default function Canvas3D({ mode, reduceMotion }: { mode: "statue" | "ribbon"; reduceMotion: boolean }) {
  return (
    <Canvas dpr={[1, 1.75]} frameloop={mode === "ribbon" ? "demand" : "always"} camera={{ position: [0, 0, 6], fov: 40 }} gl={{ alpha: true, antialias: true }} style={{ pointerEvents: "none" }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={2} />
      <directionalLight position={[-4, -1, 2]} intensity={mode === "statue" ? 2.5 : 1} color={mode === "statue" ? "#3df2b5" : "#ff6a2a"} />
      {mode === "statue" && <directionalLight position={[4, -2, 3]} intensity={2.5} color="#ff3df0" />}
      <Suspense fallback={null}>
        <Env />
        {mode === "statue" ? <Statue reduceMotion={reduceMotion} /> : <Ribbon reduceMotion={reduceMotion} />}
      </Suspense>
    </Canvas>
  );
}
