// Example created by Lee Stemkoski: https://github.com/stemkoski
// Based on the AR.js library and examples created by Jerome Etienne: https://github.com/jeromeetienne/AR.js/
import * as THREE from 'three';

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
});

// Set up renderer
renderer.setClearColor(new THREE.Color('lightgrey'), 0);
renderer.setSize(640, 480);
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0px';
renderer.domElement.style.left = '0px';
document.body.appendChild(renderer.domElement);

const render = () => {
  renderer.render(scene, camera);
};

// sun: 1.3914e6
// mercury: 2439.7
// venus: 6051.8
// earth: 6371
// mars: 3389.5
// jupiter: 69911
// saturn: 58232
// uranus: 25362
// neptune: 24622

type Planet = {
  name: string;
  size: number;
  texturePath: string;
  distance: number;
  texture: THREE.Texture;
};

type PlanetUnloaded = Planet & { texture: undefined };

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
];
// public/images/saturn-ring.png

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

const init = async () => {
  // loading
  const textures = await loadTextures();

  const markerRootA = new THREE.Group();
  const markerRootB = new THREE.Group();
  const markerRootC = new THREE.Group();
  const markerRootD = new THREE.Group();

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

  const earth = planets[4];
  const sun = planets[0];
  const mercury = planets[1];
  const venus = planets[2];

  const between = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  markerRootA.add(earth);
  markerRootB.add(sun);
  markerRootC.add(mercury);
  markerRootD.add(venus);

  scene.add(markerRootA);
  scene.add(markerRootB);
  scene.add(markerRootC);
  scene.add(markerRootD);

  scene.add(ambientLight);
  scene.add(camera);

  const animateMesh = (mesh: THREE.Mesh) => {
    mesh.rotation.y += 0.02;
  };

  // Create a point light
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

  // Create tree for the scene
  pointLight.add(pointLightMesh);
  markerRootA.add(pointLight);

  // put sun in the middle
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
    if (markerRootA.visible) {
      animateMesh(earth);
    }

    if (markerRootB.visible) {
      animateMesh(sun);
    }

    if (markerRootC.visible) {
      animateMesh(mercury);
    }

    if (markerRootD.visible) {
      animateMesh(venus);
    }

    if (arToolkitSource.ready !== false) {
      arToolkitContext.update(arToolkitSource.domElement);
    }
  };

  const animate = () => {
    requestAnimationFrame(animate);

    deltaTime = clock.getDelta();
    totalTime += deltaTime;

    update();
    render();
  };

  animate();
};

init();

// Create a point light
// const pointLight = new THREE.PointLight(0xffffff, 1, 100);
// pointLight.position.set(0.5, 3, 2);

// const pointLightGeometry = new THREE.SphereGeometry(0.1, 16, 8);
// const pointLightMaterial = new THREE.MeshBasicMaterial({
//   color: 0xffffff,
//   opacity: 0.5
// });
// const pointLightMesh = new THREE.Mesh(pointLightGeometry, pointLightMaterial)

// Create tree for the scene
// pointLight.add(pointLightMesh);
// markerRoot1.add(pointLight);
