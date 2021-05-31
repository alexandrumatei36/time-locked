import {
  Container, Snackbar,
} from "@material-ui/core";
import React, {useContext, useEffect, useState} from "react";
import {EthereumContext} from "../contexts/ethereum";
import {Header} from "./Header";
import {Lock} from "./Lock";
import MuiAlert, {AlertProps} from '@material-ui/lab/Alert';
import {Unlock} from "./Unlock";
import {AddToken} from "./AddToken";
import {getTokens, Token} from "../utils";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export function TimeLocked() {
  const { ethereum } = useContext(EthereumContext);
  const [error, setError] = useState('');
  const [tokens, setTokens] = useState<Token[]>([]);

  function onError(error: string) {
    setError(error);
    setTimeout(() => { setError('') }, 2000)
  }

  useEffect(() => {
    setTokens(getTokens())
  }, [])


  if (!ethereum) {
    return null;
  }

  function onAddToken() {
    setTokens(getTokens())
  }

  return (
    <div className="App">
      <Header />
      <Container maxWidth="sm" style={{ padding: '32px 0'}}>
        <Snackbar open={!!error}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
        <AddToken onAddToken={onAddToken} onError={onError} />
        <Lock tokens={tokens} onError={onError} />
        <Unlock tokens={tokens} onError={onError} />
      </Container>
    </div>
  )
}