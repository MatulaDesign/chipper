import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";

export default {
  input: "src/lib/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      strict: false,
    },
  ],
  plugins: [typescript({ clean: true, objectHashIgnoreUnknownHack: false })],
  external: ["react", "react-dom"],
};
