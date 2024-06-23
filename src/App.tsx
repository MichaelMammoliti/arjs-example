import React from "react";

import "./styles.css";

import model from "./model.gltf";

export const App = () => (
  <div
    dangerouslySetInnerHTML={{
      __html: `
        <a-scene embedded arjs>
          <a-marker preset="hiro">
            <a-entity
              position="0 0 0"
              scale="0.05 0.05 0.05"
              gltf-model="${model}"
            ></a-entity>
          </a-marker>
        </a-scene>
      `,
    }}
  />
);
