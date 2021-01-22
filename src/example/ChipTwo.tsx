import * as React from "react";

import { useChip } from "../lib";
import { mockAsync } from "../lib/utils";
import { useRenderCounter } from "./Counter";

type Theme = {
  dark: boolean;
  color: string;
};
type User = {
  uid: string;
  name: string;
};

const compKey = "theme";
export const ChipTwo: React.FC = () => {
  const [count] = useRenderCounter(compKey);
  const theme = useChip<Theme>(compKey);

  const onTheme = () => {
    theme.set((theme) => {
      theme.dark = false;
      theme.color = "tinejghu";
    });
  };
  const onMockClick = () => {
    theme.set(
      { dark: true, color: "rongeugr" },
      {
        timeout: 2000,
      }
    );
  };
  const onAsyncClick = async () => {
    const someAsyncRequest = mockAsync({ dark: true, color: "worvnjwrnv" }, 1234);
    theme.set(someAsyncRequest);
  };
  const onUser = () => {
    theme.api.set<User>({ uid: "orwue777", name: "call me maybe" }, "user");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p>{compKey} chip</p>
      <div>
        <button onClick={onTheme}>set {compKey}</button>
        <button onClick={onMockClick}>set mock {compKey} 2s</button>
        <button onClick={onAsyncClick}>set async {compKey}</button>
        <button onClick={onUser}>set user</button>
      </div>
      <pre>
        {compKey} data: {JSON.stringify(theme.data)}
      </pre>
      <pre>
        {compKey} status: {JSON.stringify(theme.status)}
      </pre>
      {/* <pre>user status: {JSON.stringify(user.status)}</pre> */}
      <pre>renders: {count}</pre>
    </div>
  );
};
