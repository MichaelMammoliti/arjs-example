// Example created by Lee Stemkoski: https://github.com/stemkoski
// Based on the AR.js library and examples created by Jerome Etienne: https://github.com/jeromeetienne/AR.js/
import { CSSProperties } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Scene } from './AR-Examples-master/js/three';

import ThreeMeshUI from 'three-mesh-ui';

type Planet = {
  name: string;
  size: number;
  texturePath: string;
  distance: number;
  texture: THREE.Texture;
};

type PlanetUnloaded = Planet & { texture: undefined };

const between = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

// Play a specific animation
// const clip = THREE.AnimationClip.findByName(clips, 'dance');
// const action = mixer.clipAction( clip );
// action.play();

// Play all animations

const loadGLTF = (path: string) => {
  return new Promise((resolve, reject) => {
    const instance = new GLTFLoader();

    instance.load(
      path,
      (gltf: any) => {
        resolve(gltf);
      },
      (xhr: any) => {},
      (error: any) => {
        reject(error);
      },
    );
  });
};

type ProductPanel = {
  title: string;
  child: THREE.Mesh | THREE.Group | THREE.Scene;
};

type Text = {
  width: number;
  height: number;
  padding: number;
  text: string;
};

type ButtonProps = {
  content?: string;
  backgroundColor?: THREE.Color | string;
  width?: number;
  height?: number;
  fontSize?: number;
  color?: string;
  backgroundOpacity?: number;
};

const createVideo = async () => {
  const video = document.createElement('video');
  const toKebabCase = (str: string) => {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  };
  const toStyle = (styles: CSSProperties) => {
    return Object.entries(styles)
      .map(([key, value]) => `${toKebabCase(key)}:${value}`)
      .join(';');
  };

  video.setAttribute(
    'style',
    toStyle({
      position: 'fixed',
      top: '0px',
      left: '0px',
      zIndex: '-1',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    }),
  );

  video.srcObject = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: 'user',
    },
  });
  video.play();
  document.body.appendChild(video);
};

const planetDetails: PlanetUnloaded[] = [
  {
    name: 'sun',
    size: 0.8,
    texturePath: 'public/images/sun-sphere.jpg',
    texture: undefined,
    distance: 0,
  },
  {
    name: 'mercury',
    size: 0.8,
    texturePath: 'public/images/mercury-sphere.jpg',
    texture: undefined,
    distance: 0.4,
  },
  {
    name: 'venus',
    size: 0.8,
    texturePath: 'public/images/venus-sphere.jpg',
    texture: undefined,
    distance: 0.7,
  },
  {
    name: 'earth',
    size: 0.8,
    texturePath: 'public/images/earth-sphere.jpg',
    texture: undefined,
    distance: 1,
  },
  {
    name: 'mars',
    size: 0.8,
    texturePath: 'public/images/mars-sphere.jpg',
    texture: undefined,
    distance: 1.5,
  },
  {
    name: 'jupiter',
    size: 0.8,
    texturePath: 'public/images/jupiter-sphere.jpg',
    texture: undefined,
    distance: 2.2,
  },
  {
    name: 'saturn',
    size: 0.8,
    texturePath: 'public/images/saturn-sphere.jpg',
    texture: undefined,
    distance: 3.7,
  },
  {
    name: 'uranus',
    size: 0.8,
    texturePath: 'public/images/uranus-sphere.jpg',
    texture: undefined,
    distance: 5.9,
  },
  {
    name: 'neptune',
    size: 0.8,
    texturePath: 'public/images/neptune-sphere.jpg',
    texture: undefined,
    distance: 7.2,
  },
  // public/images/saturn-ring.png
];

const createPointLight = () => {
  const pointLight = new THREE.PointLight(0xffffff, 1, 100);

  pointLight.position.x = 0;
  pointLight.position.y = 3;
  pointLight.position.z = 0;

  const pointLightGeometry = new THREE.SphereGeometry(0.1, 16, 8);
  const pointLightMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    opacity: 1,
  });
  const pointLightMesh = new THREE.Mesh(pointLightGeometry, pointLightMaterial);

  pointLight.add(pointLightMesh);

  return pointLight;
};

const fn = async () => {
  let deltaTime = 0;
  let totalTime = 0;
  const loader = new THREE.TextureLoader();
  const clock = new THREE.Clock();
  const scene = new THREE.Scene();
  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.5);
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
    sourceWidth: 1280,
    sourceHeight: 960,
    displayWidth: 1280,
    displayHeight: 960,
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

  const render = () => {
    renderer.render(scene, camera);
  };

  const loadTextures = () => {
    const promises: Promise<Planet>[] = planetDetails.map((planetDetail) => {
      return new Promise((resolve) => {
        loader.load(planetDetail.texturePath, (texture) =>
          resolve({ ...planetDetail, texture }),
        );
      });
    });

    return Promise.all(promises);
  };

  const createPlanet = ({ size, texture }: Planet) => {
    const globeMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      opacity: 1,
    });

    const globeGeometry = new THREE.SphereGeometry(size, 32, 32);
    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);

    return globeMesh;
  };

  const stack: Function[] = [];

  const Text = (props: ThreeMeshUI.TextOptions) => {
    return new ThreeMeshUI.Text({
      ...props,
      fontFamily: 'public/fonts/Roboto-msdf.json',
      fontTexture: 'public/fonts/Roboto-msdf.png',
    });
  };

  const Button = ({
    content,
    backgroundColor = 'white',
    backgroundOpacity = 0,
    width = 0,
    height = 0,
    fontSize = 1,
    color = 'black',
  }: ButtonProps) => {
    const block = new ThreeMeshUI.Block({
      width,
      height,
      backgroundColor: new THREE.Color(backgroundColor),
      backgroundOpacity,
    });

    block.add(
      Text({
        content,
        width: 0.5,
        height: 0.5,
        padding: 0,
        fontSize,
        color,
      }),
    );

    return block;
  };

  const ProductPanel = ({ title, child }: ProductPanel) => {
    const Wrapper = new ThreeMeshUI.Block({
      width: 3,
      height: 4,
      padding: 0.25,
      backgroundColor: new THREE.Color('white'),
      backgroundOpacity: 0.5,
    });

    const Title = Button({
      content: title,
      width: 3,
      height: 1,
      backgroundOpacity: 0,
    });

    const PlusButton = Button({
      content: '+',
      backgroundColor: '#ffffff',
      width: 1,
      height: 1,
    });
    PlusButton.position.x = 0.75;

    const MinusButton = Button({
      content: '-',
      backgroundColor: 'red',
      width: 1,
      height: 1,
    });
    MinusButton.position.x = -0.75;

    const Header = new THREE.Group();
    Header.add(Title);
    Header.position.y = 2;
    Header.position.z = 0.5;

    const Body = new THREE.Group();
    Body.add(child);
    Body.position.y = Header.position.y - 1.5;
    Body.position.z = 0.5;

    const Footer = new THREE.Group();
    Footer.add(PlusButton, MinusButton);
    Footer.position.y = Body.position.y - 1.5;
    Footer.position.z = 0.5;

    Wrapper.add(Header, Body, Footer);

    return Wrapper;
  };

  const GLTFhandler = (model: any) => {
    const mixer = new THREE.AnimationMixer(model.scene);

    model.animations.forEach((clip: any) => {
      mixer.clipAction(clip).play();
    });

    return {
      mixer,
      update: (deltaTime: number) => {
        mixer.update(deltaTime);
      },
    };
  };

  const init = async () => {
    const trumpModel: any = await loadGLTF('public/models/trump/scene.gltf');
    const textures = await loadTextures();

    const markerRootA = new THREE.Group();
    const markerRootB = new THREE.Group();
    const markerRootC = new THREE.Group();
    const markerRootD = new THREE.Group();

    const trumpModelHandler = GLTFhandler(trumpModel);

    const trumpScene = trumpModel.scene as THREE.Scene;

    const markerA = new THREEx.ArMarkerControls(arToolkitContext, markerRootA, {
      type: 'pattern',
      patternUrl: 'public/data/letterA.patt',
    });

    const markerB = new THREEx.ArMarkerControls(arToolkitContext, markerRootB, {
      type: 'pattern',
      patternUrl: 'public/data/letterB.patt',
    });

    const markerC = new THREEx.ArMarkerControls(arToolkitContext, markerRootC, {
      type: 'pattern',
      patternUrl: 'public/data/letterC.patt',
    });

    const markerD = new THREEx.ArMarkerControls(arToolkitContext, markerRootD, {
      type: 'pattern',
      patternUrl: 'public/data/letterD.patt',
    });

    const planets = textures.map(createPlanet);

    const sun = planets[0];
    const mercury = planets[1];
    const venus = planets[2];
    const earth = planets[3];

    // trumpScene.scale.set(0.01, 0.01, 0.01);
    trumpScene.rotation.x = -Math.PI / 2;
    trumpScene.position.z = 0.5;

    const panel1 = ProductPanel({
      title: 'Earth',
      child: earth,
    });

    panel1.rotation.x = -Math.PI / 2;
    panel1.position.z = 0;
    panel1.scale.x = 1.5;
    panel1.scale.y = 1.5;
    panel1.scale.z = 1.5;

    markerRootA.add(panel1);
    markerRootB.add(sun);
    markerRootC.add(mercury);
    markerRootD.add(venus);

    scene.add(markerRootA);
    scene.add(markerRootB);
    scene.add(markerRootC);
    scene.add(markerRootD);

    scene.add(ambientLight);
    scene.add(camera);

    const animatePlanet = (mesh: THREE.Mesh) => {
      mesh.rotation.y += 0.05;
      mesh.position.x = Math.cos(totalTime) * 1;
      mesh.position.z = 1 + Math.sin(totalTime) * 1;
    };

    // Create a point light
    // const pointLight = createPointLight();
    // markerRootA.add(pointLight);

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

    const update = (deltaTime: number) => {
      ThreeMeshUI.update();

      if (markerRootA.visible) {
        animatePlanet(earth);
        trumpModelHandler.update(deltaTime);
        // trumpModel.scene.position.y += 0.02;
      }

      if (markerRootB.visible) {
        animatePlanet(sun);
      }

      if (markerRootC.visible) {
        animatePlanet(mercury);
      }

      if (markerRootD.visible) {
        animatePlanet(venus);
      }

      if (arToolkitSource.ready !== false) {
        arToolkitContext.update(arToolkitSource.domElement);
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);

      deltaTime = clock.getDelta();
      totalTime += deltaTime;

      update(deltaTime);
      render();
    };

    animate();
  };

  init();
};

fn();
