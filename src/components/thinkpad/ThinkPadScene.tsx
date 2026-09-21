'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, type RefObject } from 'react';
import { Group, Mesh, OrthographicCamera, Vector3, type MeshBasicMaterial } from 'three';
import { pose, type Point } from './choreography';
import type { NarrativeStore } from './scroll-bridge';
import type { Configuration, RequestRecord } from './simulation';

export type SceneProps = {
  narrative: NarrativeStore; config: Configuration; record: RequestRecord | null;
  playback: number | null; stage: RefObject<HTMLDivElement | null>; onFailure: () => void;
};
const up = new Vector3(0, 1, 0);
function Rod({ color = '#607451', radius = .018 }: { color?: string; radius?: number }) {
  return <mesh><cylinderGeometry args={[radius, radius, 1, 8]} /><meshBasicMaterial color={color} /></mesh>;
}
function join(mesh: Mesh, a: Point, b: Point) {
  const start = new Vector3(...a), finish = new Vector3(...b);
  const direction = finish.clone().sub(start);
  mesh.position.copy(start.add(finish).multiplyScalar(.5));
  mesh.scale.y = direction.length();
  mesh.quaternion.setFromUnitVectors(up, direction.normalize());
}
function Box({ position, size, color, ...props }: { position: Point; size: Point; color: string; rotation?: Point }) {
  return <mesh position={position} {...props}><boxGeometry args={size} /><meshStandardMaterial color={color} roughness={.85} /></mesh>;
}
function World({ narrative, config, record, playback, stage, onFailure }: SceneProps) {
  const { size, invalidate, gl } = useThree();
  const phone = useRef<Group>(null), service = useRef<Group>(null), folder = useRef<Group>(null);
  const boundary = useRef<Group>(null), marker = useRef<Mesh>(null), links = useRef<Group>(null);
  const frames = useRef(0);
  const labels = useRef<{ service: HTMLElement | null; folder: HTMLElement | null; home: HTMLElement | null }>({ service: null, folder: null, home: null });
  useEffect(() => {
    labels.current = { service: stage.current?.querySelector('[data-object-label="service"]') ?? null, folder: stage.current?.querySelector('[data-object-label="folder"]') ?? null, home: stage.current?.querySelector('[data-object-label="home"]') ?? null };
  }, [stage]);
  useEffect(() => narrative.subscribe(() => { if (narrative.get().visible) invalidate(); }), [narrative, invalidate]);
  useEffect(() => { if (narrative.get().visible) invalidate(); }, [config, record, playback, size, invalidate, narrative]);
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    canvas.addEventListener('webglcontextlost', lost);
    return () => canvas.removeEventListener('webglcontextlost', lost);
  }, [gl, onFailure]);
  useFrame(({ camera, gl, scene }) => {
    const n = narrative.get();
    if (!n.visible) return;
    if (!phone.current || !service.current || !folder.current || !boundary.current || !marker.current || !links.current) return;
    const p = pose(n, config, record, playback);
    camera.position.set(...p.camera); camera.lookAt(-.5, .55, 0);
    const ortho = camera as OrthographicCamera;
    ortho.zoom = Math.min(size.width / (n.mobile ? 7.1 : 7.9), size.height / 4.3);
    ortho.updateProjectionMatrix();
    phone.current.position.set(...p.phone); service.current.position.set(...p.service); folder.current.position.set(...p.folder);
    boundary.current.visible = p.boundary;
    marker.current.position.set(...p.marker); marker.current.visible = !!record;
    const rods = links.current.children as Mesh[];
    const connection: Point = [-1.65, .22, .8];
    join(rods[0], p.phone, connection); join(rods[1], connection, p.service); join(rods[2], p.service, p.folder);
    rods[0].visible = config.connectivity && (!config.remote || (config.tailscale && config.permission));
    rods[1].visible = config.host; rods[2].visible = config.mount;
    // Render once here so the verification attributes describe a completed paint.
    gl.render(scene, camera);
    for (const [key, point] of [['service', p.service], ['folder', p.folder], ['home', [0, 0, 1.95]]] as const) {
      const label = labels.current[key];
      if (label) {
        const projected = new Vector3(...point).project(camera);
        const x = (projected.x + 1) * size.width / 2;
        const y = (1 - projected.y) * size.height / 2;
        label.style.setProperty('transform', `translate(${x + (key === 'folder' ? 12 : -28)}px, ${y + (key === 'folder' ? 14 : -34)}px)`);
        label.style.setProperty('visibility', key === 'home' && !p.boundary ? 'hidden' : 'visible');
      }
    }
    if (stage.current) {
      stage.current.setAttribute('data-renderer', 'webgl');
      stage.current.setAttribute('data-frames', String(++frames.current));
      stage.current.setAttribute('data-sc-verify-state', JSON.stringify({ camera: camera.position.toArray().map(v => +v.toFixed(2)), zoom: +ortho.zoom.toFixed(1), phone: phone.current.position.toArray(), service: service.current.position.toArray().map(v => +v.toFixed(2)), folder: folder.current.position.toArray().map(v => +v.toFixed(2)), marker: record ? marker.current.position.toArray().map(v => +v.toFixed(2)) : null, host: config.host, running: config.host && config.service, display: config.host && config.display, markerColor: record ? (marker.current.material as MeshBasicMaterial).color.getHexString() : null, file: config.file, mount: config.mount, route: rods[0].visible, boundary: boundary.current.visible }));
      stage.current.setAttribute('data-sc-verify-hold', String(p.hold && playback === null));
    }
  }, 1);
  return <>
    <color attach="background" args={['#f8f7f2']} />
    <ambientLight intensity={1.8} /><directionalLight position={[-3, 8, 5]} intensity={3.2} /><directionalLight position={[6, 3, -4]} intensity={1.2} />
    <group position={[.35, 0, 0]} rotation={[0, -.08, 0]}>
      <Box position={[0, .06, 0]} size={[3.05, .13, 2]} color="#292d2b" />
      <Box position={[0, .135, -.2]} size={[2.75, .026, 1.1]} color="#151a18" />
      {Array.from({ length: 5 }, (_, row) => Array.from({ length: 12 }, (_, col) => <Box key={`${row}-${col}`} position={[-1.22 + col * .22, .16, -.65 + row * .2]} size={[.175, .045, .15]} color={row === 4 ? '#515950' : '#424943'} />))}
      <Box position={[0, .145, .67]} size={[.91, .025, .39]} color="#3e4540" />
      <mesh position={[0, .205, -.12]}><cylinderGeometry args={[.055, .055, .025, 16]} /><meshBasicMaterial color="#ac392f" /></mesh>
      <Box position={[-1.18, .15, .82]} size={[.28, .016, .05]} color="#b7bcb0" />
      <mesh position={[1.32, .15, .83]}><sphereGeometry args={[.035, 10, 8]} /><meshBasicMaterial color={config.host ? '#97b882' : '#515950'} /></mesh>
      <group position={[0, .13, -.89]} rotation={[-.25, 0, 0]}>
        <Box position={[0, .94, 0]} size={[3.04, 1.88, .1]} color="#252b27" />
        <Box position={[0, .96, .056]} size={[2.73, 1.54, .014]} color={config.display && config.host ? '#aab99e' : '#151c18'} />
        {config.display && config.host && <>
          <Box position={[-.65, 1.25, .07]} size={[.63, .025, .008]} color="#364831" />
          <Box position={[-.4, 1.07, .07]} size={[1.12, .025, .008]} color="#718565" />
          <Box position={[-.55, .9, .07]} size={[.82, .025, .008]} color="#718565" />
          <Box position={[-.7, .6, .07]} size={[.52, .22, .008]} color="#3c5433" />
        </>}
        <mesh position={[0, 1.81, .06]}><sphereGeometry args={[.022, 8, 8]} /><meshBasicMaterial color="#85917d" /></mesh>
      </group>
    </group>
    <group ref={phone} rotation={[-.12, 0, .03]}>
      <Box position={[0, .07, 0]} size={[.67, .12, 1.24]} color="#29332c" />
      <Box position={[0, .138, 0]} size={[.55, .015, 1.01]} color="#d9dfcf" />
      <Box position={[0, .15, -.13]} size={[.34, .025, .34]} color="#536c44" />
      <Box position={[0, .15, .2]} size={[.34, .025, .02]} color="#536c44" />
      <mesh position={[0, .17, .35]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[.06, 16]} /><meshBasicMaterial color="#536c44" /></mesh>
    </group>
    <group ref={service}>
      <Box position={[0, 0, 0]} size={[.77, .12, .58]} color={config.host && config.service ? '#4c6941' : '#8b3527'} />
      {[0, 1, 2].map(i => <Box key={i} position={[-.2 + i * .2, .07, 0]} size={[.06, .016, .22]} color={config.service ? '#d8e5cd' : '#f8f7f2'} />)}
    </group>
    <group ref={folder}>
      <Box position={[0, 0, 0]} size={[.61, .08, .58]} color="#b6bc9f" />
      <Box position={[-.18, .025, -.31]} size={[.24, .05, .12]} color="#b6bc9f" />
      {config.file && <><Box position={[0, .06, 0]} size={[.34, .025, .39]} color="#f8f7f2" /><Box position={[0, .077, -.05]} size={[.18, .01, .03]} color="#536c44" /></>}
    </group>
    <group ref={boundary} position={[-.2, -.04, -.1]}>
      <Box position={[-2.7, 0, 0]} size={[.018, .012, 4.5]} color="#8c9a80" /><Box position={[2.7, 0, 0]} size={[.018, .012, 4.5]} color="#8c9a80" />
      <Box position={[0, 0, -2.25]} size={[5.4, .012, .018]} color="#8c9a80" /><Box position={[0, 0, 2.25]} size={[5.4, .012, .018]} color="#8c9a80" />
    </group>
    <group ref={links}><Rod /><Rod /><Rod color="#8a956b" /></group>
    <mesh ref={marker}><sphereGeometry args={[.085, 16, 12]} /><meshBasicMaterial color={record?.result.ok ? '#345229' : '#8b3527'} /></mesh>
  </>;
}
export default function ThinkPadScene(props: SceneProps) {
  return <Canvas orthographic frameloop="demand" dpr={[1, 1.5]} camera={{ position: [0, 7, 9], zoom: 55, near: .1, far: 50 }} gl={{ antialias: true, alpha: false, powerPreference: 'low-power' }} fallback={<span>3D is unavailable. Choose lightweight view.</span>} style={{ touchAction: 'auto', pointerEvents: 'none' }}>
    <World {...props} />
  </Canvas>;
}
