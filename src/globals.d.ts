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

declare module 'three/src/loaders/GLTFLoader.js' {
  export const GLTFLoader: any;
}

declare module 'three/examples/js/loaders/GLTFLoader.js' {
  export const GLTFLoader: any;
}

declare module 'mind-ar/dist/mindar-image-three.prod.js' {
  export const MindARThree: any;
}
declare module 'mind-ar' {
  export const MindARThree: any;
}

// declare global variable three
declare var THREEx: any;

declare var totalTime: number;
declare var deltaTime: number;
