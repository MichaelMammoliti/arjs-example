import * as THREE from 'three';

import { Trump } from '../components';
import { degrees } from '../utilities';

window.totalTime = 0;
window.deltaTime = 0;

const fn = async () => {
  const clock = new THREE.Clock();
  const scene = new THREE.Scene();
  const camera = new THREE.Camera();

  // Set up AR.js
  const arToolkitContext: any = new THREEx.ArToolkitContext({
    cameraParametersUrl: 'public/data/camera_para.dat',
    detectionMode: 'mono',
  });

  const arToolkitSource: any = new THREEx.ArToolkitSource({
    sourceType: 'webcam',
    sourceWidth: window.screen.width,
    sourceHeight: window.screen.height,
    displayWidth: window.screen.width,
    displayHeight: window.screen.height,
  });

  // Set up renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: false,
  });
  renderer.setClearColor(new THREE.Color('lightgrey'), 0);
  renderer.setSize(window.outerWidth, window.outerHeight);
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0px';
  renderer.domElement.style.left = '0px';
  document.body.appendChild(renderer.domElement);

  const light = new THREE.AmbientLight(0xffffff);

  const init = async () => {
    // we create wrapper groups for each marker
    const markerRootA = new THREE.Group();

    // we create markers
    new THREEx.ArMarkerControls(arToolkitContext, markerRootA, {
      type: 'pattern',
      patternUrl: 'public/data/hiro.patt',
    });

    // we create a parent for each marker so we can rotate the entire group
    const wrapperA = new THREE.Group();

    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(2, 0.1, 2),
      new THREE.MeshStandardMaterial(),
    );

    // floor.rotation.x = degrees(90);
    floor.position.y = -0.005;
    wrapperA.add(floor);

    const trump = Trump();

    trump.load();

    trump.onLoad((model) => {
      wrapperA.add(model.scene);

      model.scene.scale.set(0.01, 0.01, 0.01);
      model.scene.position.y = 0;
    });

    wrapperA.rotation.x = degrees(-90);
    wrapperA.rotation.y = degrees(45);

    // we then add the meshes to the scene
    markerRootA.add(wrapperA);
    scene.add(markerRootA);
    scene.add(light);

    // render
    const animate = () => {
      // we declare into the window these variables so we can easily access them throughout the code
      window.deltaTime = clock.getDelta();
      window.totalTime += deltaTime;

      // we render the earth if the marker is visible
      // the render function is defined in the Planet component
      // and takes care of rotating the planet
      if (markerRootA.visible) {
        trump.render();
      }

      if (arToolkitSource.ready !== false) {
        arToolkitContext.update(arToolkitSource.domElement);
      }

      renderer.render(scene, camera);

      requestAnimationFrame(animate);
    };

    // events
    const onResize = () => {
      arToolkitSource.onResize();

      if (renderer.domElement) {
        arToolkitSource.copySizeTo(renderer.domElement);
      }

      if (arToolkitContext.arController !== null) {
        arToolkitSource.copySizeTo(arToolkitContext.arController.canvas);
      }
    };

    window.addEventListener('resize', () => {
      onResize();
    });

    arToolkitSource.init(() => {
      onResize();
    });

    arToolkitContext.init(() => {
      camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    });

    animate();
  };

  init();
};

fn();
