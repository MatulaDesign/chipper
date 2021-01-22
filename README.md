# Chipper

### Chipper is a micro state-management tool aimed at perfect (for me 🤡 ) developer experience and idiot-proof 🙈 🙉 🙊 (because I need it) API.<br>

### Chipper is my personal experiment. I needed to learn about classes and observables. Context API has been great for me in all my personal projects, but using observables solves more problems.

<br>

## [CLICK HERE](./CHIPPER.md) to read the docs

<br>

# Wat? 🗿

- minimal setup
- written with TS
- no excess re-renders
- react and react-native friendly
- [immer](https://immerjs.github.io/immer/docs/introduction) is used somewhere inside (easier that way) 🎉
- built-in capabilities for handling status of async functions
- almost framework-agnostic (because there's a React hook you can use if you want)

<br>

# Why?

### I got bored with conventional solutions (looking at you, Redux). Don't get me wrong, [Redux](https://redux.js.org/) is a great tool (especially now, ever since [redux-toolkit](https://redux-toolkit.js.org/) is a thing), but setting up global store and making it work with [TypeScript](https://www.typescriptlang.org/) is always a treat...<br>

### Since I don't get to set up fresh redux store very often, I always have to re-learn the docs in order to have the whole thing working the way I like it. Well, not anymore.

### Chipper's API reflects my idea of a perfect (experience may vary 🤷) state-management tool that handles async and TypeScript out of the box with microscopic setup.

<br>

# How?

In the terminal

```javascript
yarn add chipper
// or
npm install chipper
```

In the code

```javascript
import Chipper, { useChip } from "chipper";

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

And that's pretty much it. Congratulations, you just spent 10 seconds setting up your global state. Time well spent, now go, procrastinate some more 🤡

<br>
<br>
<br>

# What now?

## Scroll down for more elaborate example or [CLICK HERE](./CHIPPER.md) to read the docs

<br>
<br>

## More elaborate example

```javascript
import Chipper, { useChip } from "chipper";

Chipper.createQueue([
  ["user", { uid: "12345", name: "piglet" }],
  ["theme", { dark: true, color: "pink" }],
]);

// for typescript
type User = { uid: string, name: string };
type Theme = { dark: boolean, color: string };
```

```javascript
const MyComponentA = () => {
  const { data, status, set, api } = useChip<User>('user');

  console.log(data); // { uid: "12345", name: "piglet" }
  console.log(status); // { type: "IDLE", message: undefined }

  set((user) => {
    user.name = 'pooh'
  });
  console.log(data); // { uid: "12345", name: "pooh" }
  console.log(status); // { type: "IDLE", message: undefined }

  // or
  set({ uid: "54321", name: "pooh" }, {
    timeout: 2000,
  })
  console.log(data); // after two seconds { uid: "54321", name: "pooh" }
  console.log(status); // after two seconds { type: "SUCCESS", message: undefined }

  // or
  set(someAsyncFunction, {
    onSuccess: (response) => shareGoodNews(to, response),
  })
  console.log(data); // after successfull async { uid: "xxx", name: "xxx" }
  console.log(status); // after successfull async { type: "SUCCESS", message: undefined }

  // or
  api.set<Theme>('whatever you want', 'theme')
  // aside from TS throwing an error here and Chipper not letting you set this data (new shape doesn't match original scheme) it does nothing to MyComponentA, but re-renders MyComponentB (or any other) subscribed to "theme" chip

  return (...)
}
```

```javascript
const MyComponentB = () => {
  const { data, status, set } = useChip<Theme>('theme');

  console.log(data); // { dark: true", color: "pink" }
  console.log(status); // { type: "IDLE", message: undefined }

  // after action taken in MyComponentA

  console.log(data); // 'whatever you want'
  console.log(status); // { type: "IDLE", message: undefined }

  return (...)
}
```

<br>

---

<br>

## TODO

### Chipper is ready to use (I wouldn't say it's production ready, but I am going to use it in production when I make sure it doesn't suck). You guys' help would speed things up, if you want to contribute. Todos below are sugary improvements, which would further sweeten our time with this tool:

<br>

- implement developer tools
- unit tests (you're not my real mom!)
- add persistance with [storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) and/or [react-native-async-storage](https://github.com/react-native-async-storage/async-storage)?<br>
  **Note**: react-native-async-storage is kinda heavy, soooo I don't wanna do it, but it'll work with both react and react-native. I will probably add some util function in the docs for folks who might want to have seamless experience with connecting global store and session/local storage
- performance fixes?<br>
  **Note**: I don't really know that much about performance-wise programming yet, but as far as my own testing of Chipper goes, it works, lol 🙈 <br>
  I have never paid much attention to performance between tools - Redux, Context API, Zustand, Jotai - they all perform the same to me. All I care about is dev-ex and neither has fully satisfied my way of coding
- suggestions?

<br>

---

<br>

## [READ THE DOCS](./CHIPPER.md)
