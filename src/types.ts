import * as THREE from 'three';

export type Planet = {
  name: string;
  size: number;
  texturePath: string;
  distance: number;
  texture: THREE.Texture;
};

export type PlanetUnloaded = Planet & { texture: undefined };
