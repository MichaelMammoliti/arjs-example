import * as THREE from 'three';

import { CSSProperties } from 'react';
import { planetDetails } from './constants';
import { PlanetProps } from '../components/types';
import { GLTF, GLTFLoader } from 'three-stdlib';

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

export const loadGLTF = (path: string): Promise<GLTF> => {
  return new Promise((resolve, reject) => {
    const instance = new GLTFLoader();

    instance.load(
      path,
      (gltf: GLTF) => {
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

export const betweenInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const kebabCase = (str: string) => {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
};

export const inlineStyle = (obj: any) => {
  let style = '';
  for (const key in obj) {
    style += `${kebabCase(key)}: ${obj[key]};`;
  }
  return style;
};

export const degrees = (deg: number) => Math.PI * (deg / 180);
