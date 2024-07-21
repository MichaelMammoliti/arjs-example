import * as THREE from 'three';
import './styles.css';
import { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js';
import { Model, Planet } from './components';

const mindarThree = new MindARThree({
  container: document.querySelector('#app'),
  imageTargetSrc: 'public/mindar/qr-code.mind',
  filterMinCF: 10,
  filterBeta: 10,
});

const kebabCase = (str: string) => {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
};

const inlineStyle = (obj: any) => {
  let style = '';
  for (const key in obj) {
    style += `${kebabCase(key)}: ${obj[key]};`;
  }
  return style;
};

const button = document.createElement('button');
button.setAttribute(
  'style',
  inlineStyle({
    position: 'fixed',
    bottom: '10px',
    left: '10px',
    right: '10px',
    borderRadius: '8px',
    overflow: 'hidden',
    border: 0,
    color: '#000',
    cursor: 'pointer',
    background: '#ffd814',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '40px',
  }),
);

const span = document.createElement('span');
span.innerText = 'Buy Now';
button.appendChild(span);

document.body.appendChild(button);

const { renderer, scene, camera } = mindarThree;
const degrees = (deg: number) => Math.PI * (deg / 180);

const lightgroup = new THREE.Group();
const light = new THREE.DirectionalLight(0xffffff, 1);

light.castShadow = true;

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: true }),
);

sphere.scale.set(0.01, 0.01, 0.01);

lightgroup.add(sphere);
lightgroup.add(light);

scene.add(lightgroup);

lightgroup.position.set(0, 0.75, 1.5);

const anchor = mindarThree.addAnchor(0);

window.totalTime = 0;
window.deltaTime = 0;

const clock = new THREE.Clock();

const Pokemon = (path: string) => {
  const modelObject = Model(path);

  modelObject.onLoad((model) => {
    model.scene.scale.set(0.05, 0.05, 0.05);
    model.scene.rotation.y = degrees(45);
    model.scene.position.x = -0.5;
  });

  modelObject.animate((model) => {
    model.scene.rotation.y = degrees(Math.cos(window.totalTime) * 45);
  });

  return modelObject;
};

const start = async () => {
  try {
    const pokemonGroup = new THREE.Group();

    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.01, 0.5),
      new THREE.MeshStandardMaterial(),
    );

    floor.position.y = -0.005;

    pokemonGroup.add(floor);

    const pokemons = await Promise.all(
      [
        Pokemon('public/models/bulbasaur/scene.gltf'),
        Pokemon('public/models/squirtle/scene.gltf'),
        Pokemon('public/models/charmander/scene.gltf'),
      ].map(async (pokemon, index) => {
        const model = await pokemon.load();

        model.scene.position.x = -0.15 + index * 0.15;
        model.scene.position.z = 0.1;
        model.scene.rotation.y = degrees(-20 + index * 20);

        if (index) {
          model.scene.scale.set(0.2, 0.2, 0.2);
        } else {
          model.scene.scale.set(13.5, 13.5, 13.5);
        }

        pokemonGroup.add(model.scene);

        return pokemon;
      }),
    );

    const experience = new THREE.Group();

    experience.add(pokemonGroup);
    experience.scale.set(3, 3, 3);

    anchor.group.add(experience);

    await mindarThree.start();

    renderer.setAnimationLoop(() => {
      window.deltaTime = clock.getDelta();
      window.totalTime += deltaTime;

      // group.rotation.x += Math.cos(totalTime) * 0.001;

      pokemons[0].render();
      pokemons[1].render();
      pokemons[2].render();

      renderer.render(scene, camera);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
