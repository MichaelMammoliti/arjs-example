import * as THREE from 'three';

export type ProductPanelProps = {
  title: string;
  child: THREE.Mesh | THREE.Group | THREE.Scene;
};

export type TextProps = {
  width: number;
  height: number;
  padding: number;
  text: string;
};

export type ButtonProps = {
  content?: string;
  backgroundColor?: THREE.Color | string;
  width?: number;
  height?: number;
  fontSize?: number;
  color?: string;
  backgroundOpacity?: number;
};

export type PlanetProps = {
  name: string;
  size: number;
  texturePath: string;
  texture: THREE.Texture;
};

export type PlanetUnloaded = PlanetProps & { texture: undefined };
