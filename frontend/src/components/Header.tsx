import {AppBar, Button, Toolbar, Typography} from "@material-ui/core";
import React, {SyntheticEvent, useContext} from "react";
import {EthereumContext} from "../contexts/ethereum";

export function Header() {
  const { address, connect, chainId } = useContext(EthereumContext);

  async function onClickWallet(e: SyntheticEvent<HTMLButtonElement>) {
    await connect();
  }

  return (
    <AppBar position="static">
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">
          TimeLocked
        </Typography>
        <span>
            {address ?
              `${address.slice(0, 10)}....${address.slice(30, address.length)}` :
              <Button color="inherit" onClick={onClickWallet}>Connect wallet</Button>}
          </span>
      </Toolbar>
    </AppBar>
  );
}
