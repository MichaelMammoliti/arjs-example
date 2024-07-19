import { MindARThree } from './mind-ar/src/image-target/three';
import './styles.css';
import * as THREE from 'three';

const startButton = document.createElement('button');
startButton.id = 'startButton';
startButton.textContent = 'Start';
document.body.appendChild(startButton);

const mindarThree = new MindARThree({
  container: document.querySelector('#app'),
  imageTargetSrc:
    'https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.mind',
} as any);

const { renderer, scene, camera } = mindarThree;
const anchor = mindarThree.addAnchor(0);
const geometry = new THREE.PlaneGeometry(1, 0.55);
const material = new THREE.MeshBasicMaterial({
  color: 0x00ffff,
  transparent: true,
  opacity: 0.5,
});

const plane = new THREE.Mesh(geometry, material);

anchor.group.add(plane);

const start = async () => {
  await mindarThree.start();
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
};

startButton.addEventListener('click', () => {
  console.log('start');
  start();
});

// stopButton.addEventListener('click', () => {
//   mindarThree.stop();
//   mindarThree.renderer.setAnimationLoop(null);
// });
