import * as THREE from 'three';

import { CSSProperties } from 'react';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { planetDetails } from './constants';
import { PlanetProps } from '../components/types';

export const between = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const createVideo = async () => {
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

export const loadGLTF = (path: string) => {
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

export const loadTextures = () => {
  const loader = new THREE.TextureLoader();

  const promises: Promise<PlanetProps>[] = planetDetails.map((planetDetail) => {
    return new Promise((resolve) => {
      loader.load(planetDetail.texturePath, (texture) =>
        resolve({ ...planetDetail, texture }),
      );
    });
  });

  return Promise.all(promises);
};

export const GLTFhandler = (model: any) => {
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

const stack: Function[] = [];
