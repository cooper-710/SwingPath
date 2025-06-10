import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

// Camera setup - catcher-side offset
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(3, 2, 6);
camera.lookAt(0, 1, 2);

// Renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshPhongMaterial({ color: 0xcccccc, side: THREE.DoubleSide })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Home plate
const plate = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 0.01, 0.5),
  new THREE.MeshBasicMaterial({ color: 0x000000 })
);
plate.position.set(0, 0.01, 0);
scene.add(plate);

// Strike zone
const zone = new THREE.BoxHelper(
  new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.6, 0.6)),
  0x000000
);
zone.position.set(0, 1, 1.5);
scene.add(zone);

// Swing path (lowered Y-values by ~0.4)
const swingCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-0.6, 0.4, 0.3),     // Start of swing
  new THREE.Vector3(-0.2, 0.6, 1.2),     // Approach
  new THREE.Vector3( 0.15, 0.65, 2.31),  // Contact point
  new THREE.Vector3( 0.5, 0.8, 3.0),     // Follow-through
  new THREE.Vector3( 0.8, 1.0, 3.8)      // End of arc
]);
const swingPoints = swingCurve.getPoints(50);
const swingGeometry = new THREE.BufferGeometry().setFromPoints(swingPoints);
const swingMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
const swingLine = new THREE.Line(swingGeometry, swingMaterial);
scene.add(swingLine);

// Bat mesh
const bat = new THREE.Mesh(
  new THREE.CylinderGeometry(0.03, 0.05, 1, 16),
  new THREE.MeshPhongMaterial({ color: 0x8B4513 })
);
bat.rotation.z = Math.PI / 2;  // rotate horizontally
bat.rotation.y = THREE.MathUtils.degToRad(14);  // attack angle tilt
scene.add(bat);

// Animate bat along arc
let progress = 0;
function animate() {
  requestAnimationFrame(animate);
  progress += 0.01;
  if (progress > 1) progress = 0;
  const point = swingCurve.getPoint(progress);
  bat.position.copy(point);
  renderer.render(scene, camera);
}

animate();
