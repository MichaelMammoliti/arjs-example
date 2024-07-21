import * as THREE from 'three';
import { loadTextures } from '../utilities';
import { Planet } from '../components';

window.totalTime = 0;
window.deltaTime = 0;

const fn = async () => {
  const clock = new THREE.Clock();
  const scene = new THREE.Scene();
  const camera = new THREE.Camera();

  // setup arjs
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
    antialias: true,
    alpha: true,
  });
  renderer.setClearColor(new THREE.Color('lightgrey'), 0);
  renderer.setSize(window.screen.width, window.screen.height);
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

    const plane = new THREE.Mesh(
      new THREE.CircleGeometry(1, 32),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.DoubleSide,
      }),
    );

    plane.scale.set(2, 2, 2);
    earth.mesh.position.z = 0;

    const worldsGroup = new THREE.Group();

    const worldsSpeeds: number[] = [];

    const worlds = [...Array(textures.length)].map((_, index) => {
      const newEarth = Planet(textures[index]);
      const mesh = newEarth.mesh;

      mesh.material.opacity = 0;

      mesh.position.x = between(-1, 1);
      mesh.position.y = between(-1, 1);
      const scale = between(0.1, 0.4);
      mesh.scale.set(scale, scale, scale);

      worldsGroup.add(mesh);

      worldsSpeeds.push(between(0.08, 0.05));

      return mesh;
    });

    wrapperA.add(worldsGroup);

    // we then add the meshes to the scene
    // wrapperA.add(earth.mesh);
    wrapperA.add(plane);
    markerRootA.add(wrapperA);
    scene.add(markerRootA);
    scene.add(camera);

    // render
    const animate = () => {
      // we declare into the window these variables so we can easily access them throughout the code
      window.deltaTime = clock.getDelta();
      window.totalTime += deltaTime;

      // we render the earth if the marker is visible
      if (markerRootA.visible) {
        earth.render();
      }

      if (arToolkitSource.ready !== false) {
        arToolkitContext.update(arToolkitSource.domElement);
      }

      worlds.forEach((world, index) => {
        world.position.z += worldsSpeeds[index];

        if (world.position.z >= 3) {
          world.material.opacity = 0;
          world.position.z = -1;
          world.position.x = between(-1, 1);
          world.position.y = between(-1, 1);
          worldsSpeeds[index] = between(0.008, 0.05);
          const scale = between(0.1, 0.4);
          world.scale.set(scale, scale, scale);
        } else if (world.position.z >= 2) {
          world.material.opacity = 3 - world.position.z;
        } else if (world.position.z >= 1) {
          world.material.opacity = 1;
        } else {
          // world.material.opacity = world.position.z;
          world.material.opacity = 1;
        }
        world.rotation.y += 0.01;
      });

      renderer.render(scene, camera);

      requestAnimationFrame(animate);
    };

    // events
    const onResize = () => {
      arToolkitSource.onResize();
      arToolkitSource.copySizeTo(renderer.domElement);

      if (arToolkitContext.arController !== null) {
        arToolkitSource.copySizeTo(arToolkitContext.arController.canvas);
      }
    };

    window.addEventListener('resize', () => {
      onResize();
      renderer.setSize(window.outerWidth, window.outerHeight);
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
