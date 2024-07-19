module.exports = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <title>App</title>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
    	<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
      
      <!-- 
        <script src="public/lib/aframe.min.js"></script>
        <script src="public/lib/aframe-ar.js"></script>
      -->

      <!-- include three.js library -->
      <script src='public/lib/js/three.js'></script>

      <!-- include jsartookit -->
      <script src="public/lib/jsartoolkit5/artoolkit.min.js"></script>
      <script src="public/lib/jsartoolkit5/artoolkit.api.js"></script>

      <!-- include threex.artoolkit -->
      <script src="public/lib/threex/threex-artoolkitsource.js"></script>
      <script src="public/lib/threex/threex-artoolkitcontext.js"></script>
      <script src="public/lib/threex/threex-arbasecontrols.js"></script>
      <script src="public/lib/threex/threex-armarkercontrols.js"></script>
      <script type="importmap">
        {
          "imports": {
            "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
            "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/",
            "mindar-face-three":"https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-face-three.prod.js"
          }
        }
      </script>
    </head>
    <body>
      <div id="app"></div>
    </body>
  </html>
`;
