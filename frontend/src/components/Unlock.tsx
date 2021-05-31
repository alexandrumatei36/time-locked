import React, {useContext, useEffect, useState} from "react";
import {Button, CircularProgress, Container, MenuItem, Paper, Select, Typography} from "@material-ui/core";
import {EthereumContext} from "../contexts/ethereum";
import {ethers} from "ethers";
import {timeLockedAbi} from "../abis/timeLockedAbi";
import {Token} from "../utils";

const contract = '0xc7847fe3B3427c0f5AeFd6df17a3ED6E7668C3cc'

type Props = {
  tokens: Token[],
  onError: (error: string) => void,
}

export function Unlock(props: Props) {
  const { address } = useContext(EthereumContext);
  const [unlockToken, setUnlockToken] = useState('')
  const [unlocking, setUnlocking] = useState(false)
  const [balanceToUnlock, setBalanceToUnlock] = useState('');

  useEffect(() => {
    checkBalanceToUnlock();
  }, [address, unlockToken])

  async function checkBalanceToUnlock() {
    if (address && unlockToken) {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum)
      const signer = provider.getSigner()
      const timeLocked = new ethers.Contract(contract, timeLockedAbi, provider);
      const balance = await timeLocked.connect(signer).deposits(address, unlockToken)
      setBalanceToUnlock(ethers.utils.formatEther(balance.amount.toString()))
    }
  }

  async function onClickUnlock() {
    try {
      setUnlocking(true)
      const provider = new ethers.providers.Web3Provider((window as any).ethereum)
      const signer = provider.getSigner()
      const erc20Contract = new ethers.Contract(contract, timeLockedAbi, provider);
      const result = await erc20Contract.connect(signer).claim(unlockToken)
      await result.wait()
      setUnlocking(false)
      setBalanceToUnlock('')
    } catch {
      setUnlocking(false)
      props.onError('Failed to unlock tokens')
    }
  }

  return (
    <Paper elevation={1} style={{ padding: '16px 0 32px'}}>
      <Container>
        <Typography variant="h6">{`Claim funds ${balanceToUnlock ? balanceToUnlock : ''}`}</Typography>
      </Container>
      <Container>
        <Select
          fullWidth
          label="Token"
          value={unlockToken}
          onChange={(e) => { setUnlockToken(e.target.value as string) }}
          variant="outlined"
        >
          {props.tokens.map((token) => (
            <MenuItem key={token.address} value={token.address}>{token.symbol}</MenuItem>
          ))}
        </Select>
        {!!balanceToUnlock && (
          <Button disabled={unlocking} style={{margin: '24px 0 0'}} color="inherit" variant="outlined" onClick={onClickUnlock}>
            Unlock funds
            {unlocking && <CircularProgress size={16} style={{ marginLeft: 8 }} />}
          </Button>
        )}
      </Container>
    </Paper>
  )
}
