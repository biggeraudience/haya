// src/components/ColladaModelViewer.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader";

const ColladaModelViewer = ({ modelPath }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Create a basic scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Add lights to the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Load the Collada model
    const loader = new ColladaLoader();
    loader.load(
      modelPath,
      (collada) => {
        const model = collada.scene;
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error("Error loading Collada model:", error);
      }
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      // Optionally rotate the scene for a dynamic preview
      scene.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [modelPath]);

  return <div ref={mountRef} style={{ width: "100%", height: "500px" }} />;
};

export default ColladaModelViewer;
