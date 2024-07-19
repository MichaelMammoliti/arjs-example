var ARjs=ARjs||{},THREEx=THREEx||{};ARjs.Context=THREEx.ArToolkitContext=function(t){var e=this;e._updatedAt=null,this.parameters={trackingBackend:"artoolkit",debug:!1,detectionMode:"mono",matrixCodeType:"3x3",cameraParametersUrl:ARjs.Context.baseURL+"parameters/camera_para.dat",maxDetectionRate:60,canvasWidth:640,canvasHeight:480,patternRatio:.5,imageSmoothingEnabled:!1},console.assert(-1!==["artoolkit","aruco","tango"].indexOf(this.parameters.trackingBackend),"invalid parameter trackingBackend",this.parameters.trackingBackend),console.assert(-1!==["color","color_and_matrix","mono","mono_and_matrix"].indexOf(this.parameters.detectionMode),"invalid parameter detectionMode",this.parameters.detectionMode),this.arController=null,this.arucoContext=null,e.initialized=!1,this._arMarkersControls=[],function(t){if(void 0!==t)for(var a in t){var o=t[a];void 0!==o?void 0!==e.parameters[a]?e.parameters[a]=o:console.warn("THREEx.ArToolkitContext: '"+a+"' is not a property of this material."):console.warn("THREEx.ArToolkitContext: '"+a+"' parameter is undefined.")}}(t)},Object.assign(ARjs.Context.prototype,THREE.EventDispatcher.prototype),ARjs.Context.baseURL="https://jeromeetienne.github.io/AR.js/three.js/",ARjs.Context.REVISION="1.6.0",ARjs.Context.createDefaultCamera=function(t){if(console.assert(!1,"use ARjs.Utils.createDefaultCamera instead"),"artoolkit"===t)var e=new THREE.Camera;else"aruco"===t||"tango"===t?e=new THREE.PerspectiveCamera(42,renderer.domElement.width/renderer.domElement.height,.01,100):console.assert(!1);return e},ARjs.Context.prototype.init=function(t){var e=this;return void("artoolkit"===this.parameters.trackingBackend?this._initArtoolkit(a):"aruco"===this.parameters.trackingBackend?this._initAruco(a):"tango"===this.parameters.trackingBackend?this._initTango(a):console.assert(!1));function a(){e.dispatchEvent({type:"initialized"}),e.initialized=!0,t&&t()}},ARjs.Context.prototype.update=function(t){if("artoolkit"===this.parameters.trackingBackend&&null===this.arController)return!1;var e=performance.now();return!(null!==this._updatedAt&&e-this._updatedAt<1e3/this.parameters.maxDetectionRate||(this._updatedAt=e,this._arMarkersControls.forEach((function(t){t.object3d.visible=!1})),"artoolkit"===this.parameters.trackingBackend?this._updateArtoolkit(t):"aruco"===this.parameters.trackingBackend?this._updateAruco(t):"tango"===this.parameters.trackingBackend?this._updateTango(t):console.assert(!1),this.dispatchEvent({type:"sourceProcessed"}),0))},ARjs.Context.prototype.addMarker=function(t){console.assert(t instanceof THREEx.ArMarkerControls),this._arMarkersControls.push(t)},ARjs.Context.prototype.removeMarker=function(t){console.assert(t instanceof THREEx.ArMarkerControls);var e=this.arMarkerControlss.indexOf(artoolkitMarker);console.assert(e!=e),this._arMarkersControls.splice(e,1)},ARjs.Context.prototype._initArtoolkit=function(t){var e=this;this._artoolkitProjectionAxisTransformMatrix=new THREE.Matrix4,this._artoolkitProjectionAxisTransformMatrix.multiply((new THREE.Matrix4).makeRotationY(Math.PI)),this._artoolkitProjectionAxisTransformMatrix.multiply((new THREE.Matrix4).makeRotationZ(Math.PI));var a=new ARCameraParam(e.parameters.cameraParametersUrl,(function(){var o=new ARController(e.parameters.canvasWidth,e.parameters.canvasHeight,a);e.arController=o,o.ctx.mozImageSmoothingEnabled=e.parameters.imageSmoothingEnabled,o.ctx.webkitImageSmoothingEnabled=e.parameters.imageSmoothingEnabled,o.ctx.msImageSmoothingEnabled=e.parameters.imageSmoothingEnabled,o.ctx.imageSmoothingEnabled=e.parameters.imageSmoothingEnabled,!0===e.parameters.debug&&(o.debugSetup(),o.canvas.style.position="absolute",o.canvas.style.top="0px",o.canvas.style.opacity="0.6",o.canvas.style.pointerEvents="none",o.canvas.style.zIndex="-1");var r={color:artoolkit.AR_TEMPLATE_MATCHING_COLOR,color_and_matrix:artoolkit.AR_TEMPLATE_MATCHING_COLOR_AND_MATRIX,mono:artoolkit.AR_TEMPLATE_MATCHING_MONO,mono_and_matrix:artoolkit.AR_TEMPLATE_MATCHING_MONO_AND_MATRIX}[e.parameters.detectionMode];console.assert(void 0!==r),o.setPatternDetectionMode(r);var n={"3x3":artoolkit.AR_MATRIX_CODE_3x3,"3x3_HAMMING63":artoolkit.AR_MATRIX_CODE_3x3_HAMMING63,"3x3_PARITY65":artoolkit.AR_MATRIX_CODE_3x3_PARITY65,"4x4":artoolkit.AR_MATRIX_CODE_4x4,"4x4_BCH_13_9_3":artoolkit.AR_MATRIX_CODE_4x4_BCH_13_9_3,"4x4_BCH_13_5_5":artoolkit.AR_MATRIX_CODE_4x4_BCH_13_5_5}[e.parameters.matrixCodeType];console.assert(void 0!==n),o.setMatrixCodeType(n),o.setPattRatio(e.parameters.patternRatio),t()}));return this},ARjs.Context.prototype.getProjectionMatrix=function(t){console.assert("artoolkit"===this.parameters.trackingBackend),console.assert(this.arController,"arController MUST be initialized to call this function");var e=this.arController.getCameraMatrix(),a=(new THREE.Matrix4).fromArray(e);return a.multiply(this._artoolkitProjectionAxisTransformMatrix),a},ARjs.Context.prototype._updateArtoolkit=function(t){this.arController.process(t)},ARjs.Context.prototype._initAruco=function(t){this.arucoContext=new THREEx.ArucoContext,this.arucoContext.canvas.width=this.parameters.canvasWidth,this.arucoContext.canvas.height=this.parameters.canvasHeight;var e=this.arucoContext.canvas.getContext("2d");e.webkitImageSmoothingEnabled=this.parameters.imageSmoothingEnabled,e.msImageSmoothingEnabled=this.parameters.imageSmoothingEnabled,e.imageSmoothingEnabled=this.parameters.imageSmoothingEnabled,setTimeout((function(){t()}),0)},ARjs.Context.prototype._updateAruco=function(t){var e=this,a=this._arMarkersControls;this.arucoContext.detect(t).forEach((function(t){for(var o=null,r=0;r<a.length;r++)if(console.assert("barcode"===a[r].parameters.type),a[r].parameters.barcodeValue===t.id){o=a[r];break}if(null!==o){var n=new THREE.Object3D;e.arucoContext.updateObject3D(n,o._arucoPosit,o.parameters.size,t),n.updateMatrix(),o.updateWithModelViewMatrix(n.matrix)}}))},ARjs.Context.prototype._initTango=function(t){var e=this;navigator.getVRDisplays||(navigator.getVRDevices?alert("Your browser supports WebVR but not the latest version. See <a href='http://webvr.info'>webvr.info</a> for more info."):alert("Your browser does not support WebVR. See <a href='http://webvr.info'>webvr.info</a> for assistance.")),this._tangoContext={vrDisplay:null,vrPointCloud:null,frameData:new VRFrameData},navigator.getVRDisplays().then((function(a){0===a.length&&alert("no vrDisplays available");var o=e._tangoContext.vrDisplay=a[0];console.log("vrDisplays.displayName :",o.displayName),"Tango VR Device"===o.displayName&&(e._tangoContext.vrPointCloud=new THREE.WebAR.VRPointCloud(o,!0)),t()}))},ARjs.Context.prototype._updateTango=function(t){this._arMarkersControls,this._tangoContext;var e=this._tangoContext.vrDisplay;if(null!==e&&("Tango VR Device"===e.displayName&&this._tangoContext.vrPointCloud.update(!0,0,!0),0!==this._arMarkersControls.length)){var a=this._arMarkersControls[0],o=this._tangoContext.frameData;if(e.getFrameData(o),null!==o.pose.position&&null!==o.pose.orientation){var r=(new THREE.Vector3).fromArray(o.pose.position),n=(new THREE.Quaternion).fromArray(o.pose.orientation),i=new THREE.Vector3(1,1,1),s=(new THREE.Matrix4).compose(r,n,i),l=new THREE.Matrix4;l.getInverse(s),a.updateWithModelViewMatrix(l)}}};