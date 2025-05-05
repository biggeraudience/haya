// src/components/Product3DPreview.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Product3DPreview = ({ modelPath }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!modelPath) {
      console.error("modelPath is undefined. Please provide a valid 3D model path.");
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 3);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // OrbitControls for user interactivity
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Load the Collada model using ColladaLoader
    const loader = new ColladaLoader();
    loader.load(
      modelPath,
      (collada) => {
        const model = collada.scene;
        // Optionally adjust scale or position (tweak these as needed)
        model.scale.set(0.5, 0.5, 0.5);
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error("Error loading the model", error);
      }
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resizing
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

    // Cleanup on unmount
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

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "500px", border: "1px solid #ddd" }}
    ></div>
  );
};

export default Product3DPreview;
