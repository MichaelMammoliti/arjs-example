import * as THREE from 'three';
import './styles.css';
import { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js';
import { loadTextures } from './utilities';
import { Model, Planet } from './components';

const mindarThree = new MindARThree({
  container: document.querySelector('#app'),
  imageTargetSrc: 'public/mindar/galaxy.mind',
});

const { renderer, scene, camera } = mindarThree;
const degrees = (deg: number) => Math.PI * (deg / 180);
const light = new THREE.DirectionalLight(0xffffff, 1);

light.position.set(2, 2, 2);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: true }),
);

light.position.set(2, 2, 2);

scene.add(sphere);
scene.add(light);

const anchor = mindarThree.addAnchor(0);

window.totalTime = 0;
window.deltaTime = 0;

const clock = new THREE.Clock();

const SpaceMan = () => {
  const modelObject = Model('public/models/spaceman/scene.gltf');

  modelObject.onLoad((model) => {
    model.scene.scale.set(0.05, 0.05, 0.05);
    model.scene.rotation.y = degrees(45);
    model.scene.position.x = -0.5;
  });

  modelObject.animate((model) => {
    model.scene.position.x += 0.001;
    model.scene.rotation.y += 0.001;
  });

  return modelObject;
};

const start = async () => {
  try {
    // const textures = await loadTextures();

    // const planets = textures.map((props) => Planet(props));
    // const earth = planets[3];

    const spaceMan = SpaceMan();

    const spaceManModel = await spaceMan.load();

    anchor.group.add(spaceManModel.scene);

    await mindarThree.start();

    renderer.setAnimationLoop(() => {
      window.deltaTime = clock.getDelta();
      window.totalTime += deltaTime;

      spaceMan.render();
      renderer.render(scene, camera);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
