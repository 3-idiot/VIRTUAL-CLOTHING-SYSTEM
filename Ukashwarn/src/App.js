import React, { useRef, useState, Suspense } from 'react'
import * as THREE from "three";
import { Canvas, useFrame } from 'react-three-fiber'
import { useGLTF, OrbitControls, ContactShadows } from 'drei'
import './App.css';

// let scene,camera,renderer;

// function init(){
//   scene = new THREE.Scene();
//   scene.background = new THREE.Color(0xdddddd);
//   camera = new THREE.PerspectiveCamera(40,window.innerWidth/window.innerHeight,1,5000);
//   renderer = new THREE.WebGLRenderer({antialias:true});
//   renderer.setSize(window.innerWidth,window.innerHeight);
//   document.body.appendChild(renderer.domElement);

// }
// init();

function Sample(props) {
  const group = useRef()
  const { nodes, materials } = useGLTF('sample.glb')
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        material={materials.skin}
        geometry={nodes['Mesh157_l-hip-upper-abdomen_b'].geometry}
        // position={[-0.26, 7.9, -1.39]}
        rotation={[3.14, 0.09, -0.02]}
      />
      <mesh
        material={materials.skin}
        geometry={nodes['Mesh157_l-hip-upper-abdomen_b001'].geometry}
        // position={[-0.26, 7.9, -1.39]}
        scale={[1,1,1]}
        rotation={[3.14, 0.09, -0.02]}
      />
    </group>
  )
}

function App() {
  return (
    <div className="canvas">
    <Canvas camera={{ position: [0, 5, 15] }} >
      <ambientLight intensity={0.05} />
      {/* <pointLight position={[10, 10, 10]}/> */}
      <spotLight intensity={0.3}  position={[5, 20, 20]} />
      <Suspense fallback={null}>
        <Sample position={[0 ,0, 0]} scale={[1,1,1]}/>
        {/* <ContactShadows rotation-x={Math.PI / 2} position={[0, -0.8, 0]} opacity={0.25} width={10} height={10} blur={2} far={1} /> */}
      </Suspense>
      <OrbitControls minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 2.5} enableZoom={false} enablePan={false} />
    </Canvas>
    </div>
  )
}

export default App;
