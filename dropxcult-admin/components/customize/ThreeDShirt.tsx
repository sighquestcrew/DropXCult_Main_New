"use client";

import { useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Decal,
  OrbitControls,
  useTexture,
  useGLTF,
  Center,
  Text,
} from "@react-three/drei";
import * as THREE from "three";

// Preload models
useGLTF.preload("/models/oversized_t-shirt.glb");
useGLTF.preload("/models/hoodie.glb");

// ---------- DECAL LAYER ----------

function DecalLayer({ url, position, rotation, scale }: any) {
  const texture = useTexture(url) as any;
  return (
    <Decal position={position} rotation={rotation} scale={scale}>
      <meshBasicMaterial
        map={texture}
        transparent
        polygonOffset
        polygonOffsetFactor={-1}
      />
    </Decal>
  );
}

// ---------- FLOATING / CURVED TEXT ----------

function FloatingText({ text, config, position, rotation }: any) {
  if (!text) return null;

  return (
    <group position={position} rotation={rotation}>
      <Text
        position={[0, 0, 0]}
        fontSize={config.fontSize || 0.15}
        color={config.color || "#000000"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={config.thickness ? config.thickness * 0.01 : 0}
        outlineColor={config.color || "#000000"}
        font="https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxM.woff"
        // troika-three-text extra prop
        {...({ curveRadius: config.curve || 0 } as any)}
      >
        {text}
      </Text>
    </group>
  );
}

// ---------- SHIRT + TEXT COMPOSITION ----------

function ShirtMesh({ config }: any) {
  const {
    type,
    color,
    frontImage,
    backImage,
    leftSleeveImage,
    rightSleeveImage,
    designConfig,
    textConfig,
  } = config;

  const isHoodie = type === "Hoodie";
  const modelUrl = isHoodie
    ? "/models/hoodie.glb"
    : "/models/oversized_t-shirt.glb";

  const { scene } = useGLTF(modelUrl) as any;
  const clone = scene.clone();

  // Recolour the model with base color
  useEffect(() => {
    clone.traverse((node: any) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;

        if (node.material) {
          const newMaterial = node.material.clone();
          newMaterial.color.set(color);
          newMaterial.roughness = 0.7;
          newMaterial.metalness = 0.0;
          node.material = newMaterial;
        }
      }
    });
  }, [clone, color]);

  const frontCfg = designConfig.front;
  const backCfg = designConfig.back;
  const leftCfg = designConfig.left;
  const rightCfg = designConfig.right;

  const frontTextCfg = textConfig.front;
  const backTextCfg = textConfig.back;

  // 1. Vertical Alignment & Scale Tuning
  // Hoodies are taller/bulkier, so we scale them down slightly and move them down more
  const modelScale = isHoodie ? 3.8 : 4.0;
  const yOffset = isHoodie ? -0.6 : -0.3; // Push Hoodie lower (-0.6) to center chest

  // 2. Text Z-Depth Tuning
  // 0.3 was too far. 0.25 sits tighter to the mesh.
  // Note: If text clips INSIDE the shirt, increase slightly (e.g. 0.28)
  const textZ = 0.25; 

  return (
    // Center centers the object at (0,0,0), then 'position' offsets it from there
    <Center position={[0, yOffset, 0]} scale={modelScale}>
      <group dispose={null}>
        {/* Base mesh */}
        <primitive object={clone} />

        {/* ---------- IMAGES / DECALS ---------- */}
        {frontImage && (
          <DecalLayer
            url={frontImage}
            position={[
              frontCfg.x || 0,
              (frontCfg.y || 0) + 0.2,
              0.3, // Image slightly closer than text
            ]}
            rotation={[0, 0, 0]}
            scale={[frontCfg.scale || 0.5, frontCfg.scale || 0.5, 1]}
          />
        )}

        {backImage && (
          <DecalLayer
            url={backImage}
            position={[
              backCfg.x || 0,
              (backCfg.y || 0) + 0.2,
              -0.3,
            ]}
            rotation={[0, Math.PI, 0]}
            scale={[backCfg.scale || 0.5, backCfg.scale || 0.5, 1]}
          />
        )}

        {rightSleeveImage && (
          <DecalLayer
            url={rightSleeveImage}
            position={[
              0.6 + (rightCfg.x || 0),
              rightCfg.y || 0,
              0,
            ]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[rightCfg.scale || 0.5, rightCfg.scale || 0.5, 1]}
          />
        )}

        {leftSleeveImage && (
          <DecalLayer
            url={leftSleeveImage}
            position={[
              -0.6 + (leftCfg.x || 0),
              leftCfg.y || 0,
              0,
            ]}
            rotation={[0, -Math.PI / 2, 0]}
            scale={[leftCfg.scale || 0.5, leftCfg.scale || 0.5, 1]}
          />
        )}

        {/* ---------- TEXT (front/back) ---------- */}
        
        {/* Front text */}
        <FloatingText
          text={frontTextCfg.content}
          config={frontTextCfg}
          position={[
            frontTextCfg.x || 0,
            (frontTextCfg.y || 0) + 0.2,
            textZ, // Tighter to chest
          ]}
          rotation={[0, 0, 0]}
        />

        {/* Back text */}
        <FloatingText
          text={backTextCfg.content}
          config={backTextCfg}
          position={[
            backTextCfg.x || 0,
            (backTextCfg.y || 0) + 0.2,
            -textZ, // Tighter to back
          ]}
          rotation={[0, Math.PI, 0]}
        />
      </group>
    </Center>
  );
}

// ---------- MAIN COMPONENT ----------

export default function ThreeDShirt({ config, setConfig }: any) {
  return (
    <div className="h-[500px] w-full bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
      <Canvas
        shadows
        camera={{ position: [0, 0, 4.5], fov: 40 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <ambientLight intensity={0.8} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.5}
          penumbra={1}
          intensity={1.5}
          castShadow
        />
        <spotLight
          position={[-10, 10, -10]}
          angle={0.5}
          penumbra={1}
          intensity={1}
        />

        <Suspense fallback={null}>
          <ShirtMesh config={config} />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.3}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
    </div>
  );
}