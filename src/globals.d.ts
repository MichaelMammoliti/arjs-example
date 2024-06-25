// scss
declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.gltf" {
  const content: string;
  export default content;
}

// declare global variable three
declare var THREEx: any;