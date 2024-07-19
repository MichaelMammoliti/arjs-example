import * as THREE from 'three';
import './styles.css';
import { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js';
import { loadTextures } from './utilities';
import { Planet } from './components';

const mindarThree = new MindARThree({
  container: document.querySelector('#app'),
  imageTargetSrc: 'public/mindar/card.mind',
});

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
  const textures = await loadTextures();

  const planets = textures.map((props) => Planet(props));
  const earth = planets[3];

  anchor.add(earth.mesh);

  await mindarThree.start();

  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
};

start();
