# Chipper

A minimalistic state-management tool for your megalomaniac React needs

### Wat?

- minimal setup
- written with TS
- no excess re-renders
- react and react-native friendly
- [immer](https://immerjs.github.io/immer/docs/introduction) is used somewhere inside (easier that way)
- you can access state from outside of React components
- built-in capabilities for handling status of async functions

### How?

In the terminal

```javascript
yarn add @lumberyard/chipper
// or
npm install @lumberyard/chipper
```

In the code

```javascript
import Chipper, { useChip } from "@lumberyard/chipper";

Chipper.createQueue([
  ["user", { uid: "12345", name: "piglet" }],
  ["theme", { dark: true, color: "pink" }],
]);

const MyComponent = () => {
  const { data, status, set } = useChip('user');

  set((user) => {
    user.name = 'pooh';
  });

  return (...)
}
```

And that's pretty much it. Congratulations, you just spent 10 seconds setting up your global state. Time well spent, now go, procrastinate some more

## What now?

### [Chipper demo](https://codesandbox.io/s/chipper-demo-tgi65)

### [READ ON](https://github.com/MatulaDesign/lumberyard-chipper/blob/main/HELLO.md)

[Click here](https://github.com/MatulaDesign/lumberyard-chipper/blob/main/example.md) for more elaborate example or [click here](https://github.com/MatulaDesign/lumberyard-chipper/blob/main/CHIPPER.md) to read the docs
