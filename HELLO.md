# Chipper

Chipper is a minimalistic state-management tool aimed at perfect (for me 🤡 ) developer experience and idiot-proof 🙈 🙉 🙊 (because I need it) API.<br>

Chipper is my personal experiment. I needed to learn about classes and observables. Context API has been great for me in all my personal projects, but using observables solves more problems.

### Why?

I got bored with conventional solutions (looking at you, Redux). Don't get me wrong, [Redux](https://redux.js.org/) is a great tool (especially now, ever since [redux-toolkit](https://redux-toolkit.js.org/) is a thing), but setting up global store and making it work with [TypeScript](https://www.typescriptlang.org/) is always a treat...<br>

Since I don't get to set up fresh redux store very often, I always have to re-learn the docs in order to have the whole thing working the way I like it. Well, not anymore.

Chipper's API reflects my idea of a perfect (experience may vary 🤷) state-management tool that handles async and TypeScript out of the box with microscopic setup.

### How again?

In the terminal

```javascript
yarn add @lumberyard/chipper
// or
npm install @lumberyard/chipper
```

In the code

```javascript
import Chipper, { useChip } from "@lumberyard/chipper";

Chipper.loadChips([
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

### What now?

[CLICK HERE](example.md) for more elaborate example or [CLICK HERE](CHIPPER.md) to read the docs

### TODO

Chipper is a work in progress. I wanna use it in production at some point. You guys' help would speed things up, if you want to contribute. Todos below are sugary improvements, which would further sweeten our time with this tool:

- implement developer tools
- unit tests (you're not my real mom!)
- performance fixes?<br>
  **Note**: I don't really know that much about performance-wise programming yet, but as far as my own testing of Chipper goes, it works, lol 🙈 <br>
  I have never paid much attention to performance between tools - Redux, Context API, Zustand, Jotai - they all perform the same to me. All I care about is dev-ex and neither has fully satisfied my way of coding
- suggestions?

---

### [Chipper demo](https://codesandbox.io/s/chipper-demo-tgi65)

### [READ THE DOCS](CHIPPER.md)

[README](README.md)
