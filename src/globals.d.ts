// scss
declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.gltf' {
  const content: string;
  export default content;
}

declare module 'three/addons/loaders/GLTFLoader.js' {
  export const GLTFLoader: any;
}

// declare global variable three
declare var THREEx: any;

declare var totalTime: number;
declare var deltaTime: number;
