import * as THREE from 'three';

import ThreeMeshUI from 'three-mesh-ui';
import { loadTextures } from '../utilities';
import { Planet, ProductPanel } from '../components';

window.totalTime = 0;
window.deltaTime = 0;

const fn = async () => {
  const clock = new THREE.Clock();
  const scene = new THREE.Scene();
  const camera = new THREE.Camera();
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
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

  window.addEventListener('resize', () => {
    renderer.setSize(window.outerWidth, window.outerHeight);
  });

  const init = async () => {
    const textures = await loadTextures();
    const markerRootA = new THREE.Group();
    const markerA = new THREEx.ArMarkerControls(arToolkitContext, markerRootA, {
      type: 'pattern',
      patternUrl: 'public/data/hiro.patt',
    });

    const planets = textures.map((props) => Planet(props));
    const earth = planets[3];
    const panel = ProductPanel({
      title: 'Earth',
      child: earth.mesh,
    });

    markerRootA.add(panel);
    scene.add(markerRootA);
    scene.add(camera);

    const onResize = () => {
      arToolkitSource.onResize();
      arToolkitSource.copySizeTo(renderer.domElement);

      if (arToolkitContext.arController !== null) {
        arToolkitSource.copySizeTo(arToolkitContext.arController.canvas);
      }
    };

    const handleArToolkitSourceInit = () => {
      onResize();
    };

    const handleArToolkitContextInit = () => {
      camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    };

    const handleWindowResize = () => {
      onResize();
    };

    window.addEventListener('resize', handleWindowResize);
    arToolkitSource.init(handleArToolkitSourceInit);
    arToolkitContext.init(handleArToolkitContextInit);

    const update = () => {
      ThreeMeshUI.update();

      if (markerRootA.visible) {
        earth.render();
      }

      if (arToolkitSource.ready !== false) {
        arToolkitContext.update(arToolkitSource.domElement);
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);

      window.deltaTime = clock.getDelta();
      window.totalTime += deltaTime;

      update();
      renderer.render(scene, camera);
    };

    animate();
  };

  init();
};

fn();
