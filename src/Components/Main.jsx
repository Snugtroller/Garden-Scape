import  { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const Main = () => {
  const mountRef = useRef(null); // Ref for the DOM element
  const loadedModelRef = useRef(null); // Ref for the loaded model

  useEffect(() => {
    // Set up the renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Append the renderer to the DOM element
    mountRef.current.appendChild(renderer.domElement);

    // Set up the scene and camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set(4, 5, 11);

    // Set up orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 5;
    controls.maxDistance = 20;
    controls.minPolarAngle = 0.5;
    controls.maxPolarAngle = 1.5;
    controls.autoRotate = false;
    controls.target = new THREE.Vector3(0, 1, 0);
    controls.update();

    // Create a ground plane
    const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
    groundGeometry.rotateX(-Math.PI / 2);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x555555,
      side: THREE.DoubleSide,
    });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.castShadow = false;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Add a spotlight to the scene
    const spotLight = new THREE.SpotLight(0xffffff, 3000, 100, 0.22, 1);
    spotLight.position.set(0, 25, 0);
    spotLight.castShadow = true;
    spotLight.shadow.bias = -0.0001;
    scene.add(spotLight);

    // Load the GLTF model
    const loader = new GLTFLoader().setPath("/Garden/");
    loader.load("scene.glb", (gltf) => {
      console.log("loading model");
      const mesh = gltf.scene;

      mesh.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      mesh.position.set(0, 1.05, -1);
      scene.add(mesh);

      // Store the loaded model in the ref
      loadedModelRef.current = mesh;

      // Hide the progress bar
      const progressContainer = document.getElementById("progress-container");
      if (progressContainer) {
        progressContainer.style.display = "none";
      }
    });

    // Handle window resizing
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    const raycaster = new THREE.Raycaster();
    document.addEventListener("mousedown", onMouseDown);
    function onMouseDown(event) {
      const coords = new THREE.Vector2(
        (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        -((event.clientY / renderer.domElement.clientHeight) * 2 - 1)
      );

      raycaster.setFromCamera(coords, camera);

      const intersections = raycaster.intersectObjects(scene.children, true);
      if (intersections.length > 0) {
        const selectedObject = intersections[0].object;
        console.log(`${selectedObject.name} was clicked!`);
      }
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the model if it has been loaded
      if (loadedModelRef.current) {
        loadedModelRef.current.rotation.y += 0.0009; // Rotate around the Y-axis
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup function to remove listeners and clean up Three.js scene
    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current.removeChild(renderer.domElement);
      controls.dispose();
    };
  }, []);

  return <div ref={mountRef}></div>; // Reference div for mounting the canvas
};

export default Main;