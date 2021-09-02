import del from "rollup-plugin-delete";
import copy from "rollup-plugin-copy";
const { nodeResolve } = require("@rollup/plugin-node-resolve");
import commonjs from "@rollup/plugin-commonjs";

export default [
  {
    input: "src/sw.js",
    output: {
      file: "dist/sw.js",
      format: "iife",
    },
    plugins: [
      del({ targets: "dist/" }),
      copy({
        targets: [
          { src: "src/manifest.json", dest: "dist/" },
          { src: "src/icons/*.png", dest: "dist/" },
        ],
      }),
      nodeResolve(),
      commonjs(),
    ],
  },
];
