import React, { useState, FC, ReactNode } from "react";
import "./App.css";

interface Props {
  children?: ReactNode;
}

const App: FC<Props> = (props) => {
  const [count, setCount] = useState(0);
  const handleClick = () => setCount(count + 1);
  return (
    <div className="app">
      <h1 className="m">Welcome to banana React cli</h1>
      <h2 className="m">try to click button</h2>
      <p className="m">count: {count}</p>
      <button onClick={handleClick} className="m">
        +1
      </button>
    </div>
  );
};

export default App;
