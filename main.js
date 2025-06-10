import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(3, 5, 6);
camera.lookAt(0, 2.5, 0);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
const light = new THREE.DirectionalLight(0xffffff, 0.8);
light.position.set(5, 10, 7);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// Strike zone frame
const zoneFrame = new THREE.BoxHelper(
  new THREE.Mesh(new THREE.BoxGeometry(3, 3, 0.1)),
  0x000000
);
zoneFrame.position.set(0, 2.5, 0);
scene.add(zoneFrame);

// Load data
fetch('pitch_value_surface.json')
  .then(response => response.json())
  .then(data => {
    const xStep = 0.6; // width per bin
    const zStep = 0.6; // height per bin
    const xStart = -1.2;
    const zStart = 1.0;

    data.forEach(point => {
      const x = xStart + point.x_bin * xStep;
      const z = zStart + point.z_bin * zStep;
      const value = point.delta_run_exp;

      const height = 0.1;
      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(xStep * 0.9, zStep * 0.9, height),
        new THREE.MeshLambertMaterial({ color: getColor(value) })
      );
      cube.position.set(x + xStep / 2, z + zStep / 2, 0);
      scene.add(cube);
    });
  });

function getColor(value) {
  if (value === null || isNaN(value)) return 0xaaaaaa;
  const clamped = Math.max(-1, Math.min(1, value)); // clamp to [-1, 1]
  const red = clamped > 0 ? 255 : 255 + Math.floor(clamped * 255);
  const green = clamped < 0 ? 255 : 255 - Math.floor(clamped * 255);
  return (red << 16) | (green << 8);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
