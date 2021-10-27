import './style.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as TWEEN from '@tweenjs/tween.js';

const renderer = createRenderer();
const scene = createScene();
const camera = createCamera(); 


const controls = new OrbitControls(camera, renderer.domElement);
controlsLoop();

Array(200).fill().forEach(addStar);
// scene.add(getPhotoCube());

const moon = getMoon();
moon.position.set(10, 15, 0);
scene.add(moon);


const coin = getCoin();
scene.add(coin);

window.addEventListener("keydown", function(e) {
  if(e.code === 'Space') {
    moon.translateZ(1);

    flipCoin(coin);
  }
}, true);

animate((time) => {
  renderer.render(scene, camera);
  
  TWEEN.update(time);
});


function createRenderer() {
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#canvas'),
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  return renderer;
}

function createScene() {
  const scene = new THREE.Scene();
  scene.position.set(0, -10, 0);
  
  const pointLight = new THREE.PointLight(0xffffff);
  pointLight.position.set(-10, 35, 5);
  
  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(pointLight, ambientLight);
  
  const lightHelper = new THREE.PointLightHelper(pointLight);
  const gridHelper = new THREE.GridHelper(200, 50);
  scene.add(lightHelper, gridHelper);

  const pointLightRight = new THREE.PointLight(0x44ff88, .2);
  pointLightRight.position.set(0, 5, 0);
  scene.add(pointLightRight);
  
  const pointLightTop = new THREE.PointLight(0xdd3311, .2);
  pointLightTop.position.set(1, 7, 0);
  scene.add(pointLightTop);
  
  const spaceTexture = new THREE.TextureLoader().load('resources/space.jpg');
  scene.background = spaceTexture;

  return scene;
}

function createCamera() {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, -1, 20);

  return camera;
}

function controlsLoop() {
  requestAnimationFrame(controlsLoop);

  controls.update();
  renderer.render(scene, camera);
}

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

function getPhotoCube() {
  const photoTexture = new THREE.TextureLoader().load('resources/me.png');

  const photo = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.MeshBasicMaterial({ map: photoTexture })
  );

  return photo;
}

function getMoon() {
  const moonTexture = new THREE.TextureLoader().load('resources/moon.jpg');

  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial({
      map: moonTexture,
    })
  );

  return moon;
}

function getCoin() {
  const textureCirc = new THREE.TextureLoader().load('resources/coin-border.jpg');
  textureCirc.wrapS = THREE.RepeatWrapping;
  textureCirc.repeat.set(20, 0);
  const textureHeads = new THREE.TextureLoader().load('resources/head.png');
  const textureTails = new THREE.TextureLoader().load('resources/tails.png');
  const metalness = 0.7;
  const roughness = 0.3;

  const materials = [
    new THREE.MeshStandardMaterial({
      map: textureCirc,
      metalness: metalness,
      roughness: roughness
    }),
    new THREE.MeshStandardMaterial({
      map: textureHeads,
      metalness: metalness,
      roughness: roughness
    }),
    new THREE.MeshStandardMaterial({
      map: textureTails,
      metalness: metalness,
      roughness: roughness
    })
  ];

  var geometry = new THREE.CylinderGeometry(3, 3, 0.4, 100);
  const coin = new THREE.Mesh(geometry, materials);

  coin.rotation.y =1.2;
  // coin.rotation.x = Math.PI / 2;
  // coin.rotation.z = Math.PI;

  return coin;
}

function flipCoin(coin) {
  const flipsCount = Math.random() < 0.5 ? 7 : 8;
  const coordsRotate = { z: coin.rotation.z, y: coin.rotation.y };

  new TWEEN.Tween(coordsRotate)
    .to({ z: coordsRotate.z + flipsCount * Math.PI, y: Math.random() * 5 }, 2500)
    .easing(TWEEN.Easing.Sinusoidal.Out)
    .onUpdate(() => {
      coin.rotation.y = coordsRotate.y;
      coin.rotation.z = coordsRotate.z;
    })
    .start();

    const coordsMove = { y: coin.position.y };

    new TWEEN.Tween(coordsMove)
      .to({ y: coordsMove.y + 15 }, 1200, TWEEN.Easing.Exponential.InOut)
      .onUpdate(() => {
        coin.position.setY(coordsMove.y);
      })
      .onComplete(() => {
        const coordsMoveBack = { y: coin.position.y };

        const tweenMoveBack = new TWEEN.Tween(coordsMoveBack)
          .to({ y: 0 }, 900, TWEEN.Easing.Exponential.In)
          .onUpdate(() => {
            coin.position.setY(coordsMoveBack.y);
          })
          .start();
      })
      .start();
}

function animate(callback) {
  function loop(time) {
    callback(time);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}