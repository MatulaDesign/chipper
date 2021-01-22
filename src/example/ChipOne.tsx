import * as React from "react";
import { useChip } from "../lib";
import { mockAsync } from "../lib/utils";
import { useRenderCounter } from "./Counter";

type User = {
  uid: string;
  name: string;
};
type Theme = {
  dark: boolean;
  color: string;
};

const compKey = "user";
export const ChipOne: React.FC = () => {
  const [count] = useRenderCounter(compKey);
  const user = useChip<User>(compKey);

  const onUser = () => {
    user.set((user) => {
      user.name = "dragonsaurus";
    });
  };
  const onMockClick = () => {
    user.set(
      (user) => {
        user.name = "pierogi";
      },
      {
        timeout: 2000,
      }
    );
  };
  const onAsyncClick = async () => {
    const someAsyncRequest = mockAsync({ uid: "56789", name: "tigger" }, 1234);
    user.set(someAsyncRequest);
  };
  const onTheme = () => {
    user.api.set<Theme>({ dark: true, color: "bobololo" }, "themes");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p>{compKey} chip</p>
      <div>
        <button onClick={onUser}>set {compKey}</button>
        <button onClick={onMockClick}>set mock {compKey} 2s</button>
        <button onClick={onAsyncClick}>set async {compKey}</button>
        <button onClick={onTheme}>set theme</button>
      </div>
      <pre>
        {compKey} data: {JSON.stringify(user.data)}
      </pre>
      <pre>
        {compKey} status: {JSON.stringify(user.status)}
      </pre>
      {/* <pre>theme status: {JSON.stringify(theme.status)}</pre> */}
      <pre>renders: {count}</pre>
    </div>
  );
};
