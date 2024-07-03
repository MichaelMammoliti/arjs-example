import ThreeMeshUI from 'three-mesh-ui';
import * as THREE from 'three';
import { ButtonProps, PlanetProps, ProductPanelProps } from './types';
import { GLTFhandler, loadGLTF } from '../utilities';

export const Text = (props: ThreeMeshUI.TextOptions) => {
  return new ThreeMeshUI.Text({
    ...props,
    fontFamily: 'public/fonts/Roboto-msdf.json',
    fontTexture: 'public/fonts/Roboto-msdf.png',
  });
};

export const Button = ({
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
    borderRadius: 0.1,
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

export const ProductPanel = ({ title, child }: ProductPanelProps) => {
  const Wrapper = new ThreeMeshUI.Block({
    width: 3,
    height: 4,
    padding: 0.25,
    backgroundColor: new THREE.Color('white'),
    backgroundOpacity: 0.5,
    borderRadius: 0.1,
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
    backgroundOpacity: 0.5,
    color: '#eeeeee',
  });
  PlusButton.position.x = 0.75;

  const MinusButton = Button({
    content: '-',
    backgroundColor: '#fafafa',
    backgroundOpacity: 0.5,
    color: '#eeeeee',
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

  Wrapper.rotation.x = -Math.PI / 2;
  Wrapper.position.z = 1;
  Wrapper.scale.x = 1;
  Wrapper.scale.y = 1;
  Wrapper.scale.z = 1;

  return Wrapper;
};

export const PointLight = () => {
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

type GeometryOptions = [
  radius?: number,
  widthSegments?: number,
  heightSegments?: number,
  phiStart?: number,
  phiLength?: number,
  thetaStart?: number,
  thetaLength?: number,
];

export const BasicMesh = (
  materialOptions: THREE.MeshBasicMaterialParameters,
  geometryOptions: GeometryOptions,
) => {
  const actions: Function[] = [];

  const material = new THREE.MeshBasicMaterial({
    opacity: 1,
    ...materialOptions,
  });

  const geometry = new THREE.SphereGeometry(...geometryOptions);
  const mesh = new THREE.Mesh(geometry, material);

  const render = () => {
    actions.forEach((action) => action());
  };

  return {
    mesh,
    render,
    add: (action: Function) => actions.push(action),
  };
};

export const Planet = ({ size, texture }: PlanetProps) => {
  const meshObject = BasicMesh({ map: texture }, [size, 32, 32]);

  const animate = () => {
    meshObject.mesh.rotation.y += 0.05;
    meshObject.mesh.position.x = Math.cos(window.totalTime) * 1;
    meshObject.mesh.position.z = 1 + Math.sin(window.totalTime) * 1;
  };

  meshObject.add(animate);

  return meshObject;
};

export const Model = (path: string) => {
  let model: any = undefined;
  let loaded = false;
  let actions: Function[] = [];

  const load = async () => {
    model = await loadGLTF(path);
    loaded = true;
  };

  const render = () => {
    if (!loaded) {
      return;
    }

    actions.forEach((action) => action(model));

    const modelHandler = GLTFhandler(model);

    modelHandler.update(0);
  };

  return {
    model,
    load,
    render,
    push: (action: Function) => actions.push(action),
  };
};

export const Trump = () => {
  const modelObject = Model('public/models/trump/scene.gltf');
  const model = modelObject.model;

  modelObject.push(() => {
    const scene = model.scene as THREE.Scene;

    scene.scale.set(0.01, 0.01, 0.01);
    scene.rotation.x = -Math.PI / 2;
    scene.position.z = 0.5;
  });

  return modelObject;
};
