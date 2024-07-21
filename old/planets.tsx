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

type Planet = {
  name: string;
  size: number;
  texturePath: string;
  distance: number;
  texture: THREE.Texture;
};

type PlanetUnloaded = Planet & { texture: undefined };

const planetDiameters = {
  sun: 100,
  mercury: 1398200 * 0.0349,
  venus: 1398200 * 0.0892,
  earth: 1398200 * 0.0893,
  mars: 1398200 * 0.0472,
  jupiter: 1398200 * 0.1,
  saturn: 1398200 * 0.0837,
  uranus: 1398200 * 0.0365,
  neptune: 1398200 * 0.0354,
};

const planetDetails: PlanetUnloaded[] = [
  {
    name: 'sun',
    size: 1,
    texturePath: 'public/images/sun-sphere.jpg',
    texture: undefined,
    distance: 0,
  },
  {
    name: 'mercury',
    size: 0.3,
    texturePath: 'public/images/mercury-sphere.jpg',
    texture: undefined,
    distance: 0.4,
  },
  {
    name: 'venus',
    size: 0.3,
    texturePath: 'public/images/venus-sphere.jpg',
    texture: undefined,
    distance: 0.7,
  },
  {
    name: 'earth',
    size: 0.3,
    texturePath: 'public/images/earth-sphere.jpg',
    texture: undefined,
    distance: 1,
  },
  {
    name: 'mars',
    size: 0.3,
    texturePath: 'public/images/mars-sphere.jpg',
    texture: undefined,
    distance: 1.5,
  },
  {
    name: 'jupiter',
    size: 0.3,
    texturePath: 'public/images/jupiter-sphere.jpg',
    texture: undefined,
    distance: 2.2,
  },
  {
    name: 'saturn',
    size: 0.3,
    texturePath: 'public/images/saturn-sphere.jpg',
    texture: undefined,
    distance: 3.7,
  },
  {
    name: 'uranus',
    size: 0.3,
    texturePath: 'public/images/uranus-sphere.jpg',
    texture: undefined,
    distance: 5.9,
  },
  {
    name: 'neptune',
    size: 0.3,
    texturePath: 'public/images/neptune-sphere.jpg',
    texture: undefined,
    distance: 7.2,
  },
];

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
  const globeMaterial = new THREE.MeshLambertMaterial({
    map: texture,
    opacity: 1,
    transparent: true,
  });

  const globeGeometry = new THREE.SphereGeometry(size, 32, 32);
  const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);

  return globeMesh;
};

const stack: Function[] = [];

const init = async () => {
  // loading
  const planets = await loadTextures();

  const markerRoot1 = new THREE.Group();

  const markerControls1 = new THREEx.ArMarkerControls(
    arToolkitContext,
    markerRoot1,
    {
      type: 'pattern',
      patternUrl: 'public/data/hiro.patt',
    },
  );

  const planetMeshes = planets.map((planet) => {
    return createPlanet(planet);
  });

  const galaxy = new THREE.Group();

  galaxy.add(...planetMeshes);
  markerRoot1.add(galaxy);
  scene.add(markerRoot1);
  scene.add(ambientLight);
  scene.add(camera);

  planets.forEach((planet, index) => {
    stack.push(() => {
      const planetMesh = planetMeshes[index];
      const angle = totalTime * 0.1;
      const x = Math.cos(angle) * planet.distance;
      const z = Math.sin(angle) * planet.distance;
      planetMesh.position.set(x, 0, z);
    });
  });

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
    if (markerRoot1.visible) {
      stack.forEach((fn) => fn());
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
