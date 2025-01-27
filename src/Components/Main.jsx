import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import sunset from "../assets/sunset.png";
import * as TWEEN from "@tweenjs/tween.js"; // Correctly import TWEEN

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

    // Load and apply the texture to the sphere
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(sunset);

    // Set the texture wrapping to repeat
    texture.wrapS = THREE.RepeatWrapping; // Repeat horizontally
    texture.wrapT = THREE.ClampToEdgeWrapping; // Clamp vertically to avoid stretching

    // Offset the texture a little to prevent the seam from being in view
    texture.offset.x = 0.5; // Adjust this value to shift the seam

    // Create a large sphere with the texture
    const sphereGeometry = new THREE.SphereGeometry(100, 100, 100);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide, // Render the inside of the sphere
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // Load the GLTF model
    const gltfLoader = new GLTFLoader().setPath("/Garden/");
    gltfLoader.load("scene.glb", (gltf) => {
      console.log("loading model");
      const mesh = gltf.scene;

      // Set a custom property on the garden model to mark it as interactable
      mesh.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.isInteractable = true; // Mark the mesh as interactable
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
    const mouse = new THREE.Vector2();

    // Add click listener to zoom on objects
    const onMouseClick = (event) => {
      mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const selectedObject = intersects[0].object;

        // Only allow interaction with objects that have the `isInteractable` property
        if (selectedObject.isInteractable) {
          console.log(`${selectedObject.name} was clicked!`);
          zoomToObject(selectedObject);
        }
      }
    };

    window.addEventListener("click", onMouseClick);

    // Zoom function
    const zoomToObject = (object) => {
      if (!camera || !controls) return;

      const boundingBox = new THREE.Box3().setFromObject(object);
      const center = boundingBox.getCenter(new THREE.Vector3());
      const size = boundingBox.getSize(new THREE.Vector3());

      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

      cameraZ *= 1.5; // Zoom out a little so object fits in view

      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);

      const newPosition = center.clone().add(direction.multiplyScalar(cameraZ));

      // Animate camera position
      new TWEEN.Tween(camera.position)
        .to(newPosition, 1000)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();

      // Animate controls target
      new TWEEN.Tween(controls.target)
        .to(center, 1000)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();
    };

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the model if it has been loaded
      if (loadedModelRef.current) {
        loadedModelRef.current.rotation.y += 0.0009; // Rotate around the Y-axis
      }

      controls.update();
      renderer.render(scene, camera);
      TWEEN.update(); // Update TWEEN animations
    };

    animate();

    // Cleanup function to remove listeners and clean up Three.js scene
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", onMouseClick);
      mountRef.current.removeChild(renderer.domElement);
      controls.dispose();
    };
  }, []);

  return <div ref={mountRef}></div>; // Reference div for mounting the canvas
};

export default Main;
