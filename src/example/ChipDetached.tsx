import * as React from "react";

// import { useChipper } from "chipper";
import { useChipper } from "../lib";

import { NewChipper } from "../App";
import { useRenderCounter } from "./Counter";

type Apple = {
  shiny: boolean;
  color: string;
};

const compKey = "apple";
export const ChipDetached: React.FC = () => {
  const [count] = useRenderCounter(compKey);
  const apple = useChipper<Apple>(NewChipper, compKey);

  const onClick = () => {
    apple.set((apple) => {
      apple.color = "asdasds";
    });
  };
  const onMockClick = () => {
    apple.set(
      (apple) => {
        apple.color = "i don't know";
      },
      {
        timeout: 2000,
      }
    );
  };
  const onAsyncClick = async () => {
    // const someAsyncRequest = mockAsync({ shiny: false, color: "hydy" }, 1234);
    // apple.set(someAsyncRequest);
  };
  const onOther = () => {
    apple.api.set({ uid: "099998", name: "ko9876" }, "user");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p>{compKey} chipper</p>
      <div>
        <button onClick={onClick}>set {compKey}</button>
        <button onClick={onMockClick}>set mock {compKey} 2s</button>
        <button onClick={onAsyncClick}>set async {compKey}</button>
        <button onClick={onOther}>set user</button>
      </div>
      <pre>
        {compKey} data: {JSON.stringify(apple.data)}
      </pre>
      <pre>
        {compKey} status: {JSON.stringify(apple.status)}
      </pre>
      {/* <pre>theme status: {JSON.stringify(theme.status)}</pre> */}
      <pre>renders: {count}</pre>
    </div>
  );
};
