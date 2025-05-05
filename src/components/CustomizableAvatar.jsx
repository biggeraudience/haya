import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader";

const CustomizableAvatar = ({ modelPath, productImage }) => {
  const mountRef = useRef(null);
  const [avatar, setAvatar] = useState(null);
  const sceneRef = useRef();
  const cameraRef = useRef();
  const rendererRef = useRef();

  // Load the Collada model and set up the scene
  useEffect(() => {
    if (!modelPath) {
      console.error("No model path provided.");
      return;
    }
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 3);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add basic lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Load the Collada model using ColladaLoader
    const loader = new ColladaLoader();
    loader.load(
      modelPath,
      (collada) => {
        const model = collada.scene;
        model.scale.set(0.01, 0.01, 0.01);
        model.updateMatrixWorld(true);

        scene.add(model);
        setAvatar(model);
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);
      scene.updateMatrixWorld(true);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (
        mountRef.current &&
        renderer.domElement.parentNode === mountRef.current
      ) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelPath]);

  // Apply the product image as a texture mask on the garment mesh
  useEffect(() => {
    if (!avatar || !productImage) return;
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      productImage,
      (texture) => {
        const mutableTexture = texture.clone();
        mutableTexture.needsUpdate = true;
        avatar.traverse((child) => {
          if (child.isMesh && child.name.toLowerCase().includes("garment")) {
            child.material.map = mutableTexture;
            child.material.needsUpdate = true;
          }
        });
      },
      undefined,
      (error) => {
        console.error("Error loading texture:", error);
      }
    );
  }, [avatar, productImage]);

  return <div ref={mountRef} style={{ width: "100%", height: "500px", border: "1px solid #ddd" }} />;
};

export default CustomizableAvatar;
