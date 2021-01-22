import * as React from "react";

import Chipper, { ChipperConveyor } from "./lib";
import { ChipOne } from "./example/ChipOne";
import { ChipTwo } from "./example/ChipTwo";
import { ChipDetached } from "./example/ChipDetached";

Chipper.createQueue([
  ["user", { uid: "12345", name: "piglet" }],
  ["theme", { dark: true, color: "pink" }],
]);

export const NewChipper = new ChipperConveyor();

NewChipper.createQueue([["apple", { shiny: true, color: "red" }]]);

export default function App() {
  return (
    <div className="App">
      <ChipOne />
      <ChipTwo />
      <ChipDetached />
    </div>
  );
}
