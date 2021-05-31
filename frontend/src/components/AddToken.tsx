import React, {SyntheticEvent, useContext, useState} from 'react';
import {Button, CircularProgress, Container, Grid, Paper, TextField, Typography} from "@material-ui/core";
import {ethers} from "ethers";
import {erc20abi} from "../abis/erc20abi";
import {EthereumContext} from "../contexts/ethereum";
import {saveToken, tokenExists} from "../utils";

type Props = {
  onError: (error: string) => void,
  onAddToken: () => void,
}

export function AddToken(props: Props) {
  const [address, setAddress] = useState('')
  const [saving, setSaving] = useState(false);
  const { ethereum } = useContext(EthereumContext);

  async function onSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!address) {
      return;
    }

    if (tokenExists(address)) {
      props.onError('Token already added')
      return;
    }

    try {
      setSaving(true);
      const provider = new ethers.providers.Web3Provider(ethereum as any)
      const erc20Contract = new ethers.Contract(address, erc20abi, provider);
      const symbol = await erc20Contract.symbol();
      const decimals = await erc20Contract.decimals();
      saveToken({ address, decimals, symbol});
      setSaving(false);
      setAddress('')
      props.onAddToken();
    } catch {
      setSaving(false);
      props.onError('Failed to add token')
    }
  }

  return (
    <Paper style={{ padding: '16px 0 24px', marginBottom: 32 }}>
      <Container>
        <Typography variant="h6">Add custom token</Typography>
        <form onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField label="Token address" variant="outlined" fullWidth size="small" value={address} onChange={(e) => { setAddress(e.currentTarget.value) }}/>
            </Grid>
            <Grid item xs={4}>
              <Button
                color="inherit"
                variant="outlined"
                fullWidth
                style={{ height: '100%' }}
                type="submit"
                disabled={saving}
              >
                Add token
                {saving && <CircularProgress size={16} style={{ marginLeft: 8 }} />}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Paper>
  )
}
