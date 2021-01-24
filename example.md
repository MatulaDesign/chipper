## More elaborate example

```javascript
import Chipper, { useChip } from '@lumberyard/chipper';

Chipper.createQueue([
  ['user', { uid: '12345', name: 'piglet' }],
  ['theme', { dark: true, color: 'pink' }],
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

[Chipper demo](https://codesandbox.io/s/chipper-demo-tgi65)
[README](HELLO.md)<br>
[READ THE DOCS](CHIPPER.md)
