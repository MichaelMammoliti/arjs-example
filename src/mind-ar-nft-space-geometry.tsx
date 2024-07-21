import * as THREE from 'three';
import './styles.css';
import { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js';
import { loadTextures } from './utilities';
import { Planet } from './components';

const mindarThree = new MindARThree({
  container: document.querySelector('#app'),
  imageTargetSrc: 'public/mindar/galaxy.mind',
});

const { renderer, scene, camera } = mindarThree;

const anchor = mindarThree.addAnchor(0);

window.totalTime = 0;

const clock = new THREE.Clock();

const start = async () => {
  try {
    const textures = await loadTextures();

    const planets = textures.map((props) => Planet(props));
    const earth = planets[3];

    anchor.group.add(earth.mesh);

    await mindarThree.start();

    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      window.totalTime += delta;

      earth.render();
      renderer.render(scene, camera);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
