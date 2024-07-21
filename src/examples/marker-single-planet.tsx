import * as THREE from 'three';

import { loadTextures } from './utilities';
import { Planet } from './components';

window.totalTime = 0;
window.deltaTime = 0;

const fn = async () => {
  // Set up renderer
  const clock = new THREE.Clock();
  const scene = new THREE.Scene();
  const camera = new THREE.Camera();
  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: false,
  });
  const arToolkitContext: any = new THREEx.ArToolkitContext({
    cameraParametersUrl: 'public/data/camera_para.dat',
    detectionMode: 'mono',
  });

  const arToolkitSource: any = new THREEx.ArToolkitSource({
    sourceType: 'webcam',
    sourceWidth: window.screen.width * window.screen.pixelDepth,
    sourceHeight: window.screen.height * window.screen.pixelDepth,
    displayWidth: window.screen.width * window.screen.pixelDepth,
    displayHeight: window.screen.height * window.screen.pixelDepth,
  });

  // Set up renderer
  renderer.setClearColor(new THREE.Color('lightgrey'), 0);
  renderer.setSize(window.outerWidth, window.outerHeight);
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0px';
  renderer.domElement.style.left = '0px';
  document.body.appendChild(renderer.domElement);

  const init = async () => {
    // wait for all textures to load
    const textures = await loadTextures();
    // we create wrapper groups for each marker
    const markerRootA = new THREE.Group();

    // we create markers
    new THREEx.ArMarkerControls(arToolkitContext, markerRootA, {
      type: 'pattern',
      patternUrl: 'public/data/hiro.patt',
    });

    // we create meshes
    const earth = Planet(textures[3]);

    // we create a parent for each marker so we can rotate the entire group
    const wrapperA = new THREE.Group();
    wrapperA.rotation.x = -Math.PI / 2;

    // we then add the meshes to the scene
    wrapperA.add(earth.mesh);
    markerRootA.add(wrapperA);
    scene.add(markerRootA);

    // render
    const animate = () => {
      // we declare into the window these variables so we can easily access them throughout the code
      window.deltaTime = clock.getDelta();
      window.totalTime += deltaTime;

      // we render the earth if the marker is visible
      // the render function is defined in the Planet component
      // and takes care of rotating the planet
      if (markerRootA.visible) {
        earth.render();
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
