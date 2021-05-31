import React from 'react';
import { EthereumProvider} from "./contexts/ethereum";
import {TimeLocked} from "./components/TimeLocked";

function App() {
  return (
    <EthereumProvider>
      <TimeLocked />
    </EthereumProvider>
  );
}

export default App;
