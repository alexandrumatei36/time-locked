import {Button, CircularProgress, Container, MenuItem, Paper, Select, TextField, Typography} from "@material-ui/core";
import {DateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import React, {useContext, useEffect, useState} from "react";
import {EthereumContext} from "../contexts/ethereum";
import {ethers} from "ethers";
import {erc20abi} from "../abis/erc20abi";
import {timeLockedAbi} from "../abis/timeLockedAbi";
import {Token} from "../utils";

const contract = '0xc7847fe3B3427c0f5AeFd6df17a3ED6E7668C3cc'

type Props = {
  tokens: Token[],
  onError: (error: string) => void,
}

export function Lock(props: Props) {
  const { address } = useContext(EthereumContext);
  const [selectedToken, setSelectedToken] = useState('')
  const [locking, setLocking] = useState(false)
  const [approving, setApproving] = useState(false)
  const [date, setDate] = useState<Date>(new Date());
  const [isApproved, setIsApproved] = useState(false);
  const [tokensAmount, setTokensAmount] = useState('10');
  const [claimer, setClaimer] = useState('');

  useEffect(() => {
    checkAllowance();
  }, [address, selectedToken])

  async function checkAllowance() {
    if (address && selectedToken) {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum)
      const erc20Contract = new ethers.Contract(selectedToken, erc20abi, provider);
      const allowance = await erc20Contract.allowance(address, contract);
      setIsApproved(allowance.toString() !== '0')
    }
  }

  async function onClickApprove() {
    try {
      if (address && selectedToken) {
        setApproving(true)
        const provider = new ethers.providers.Web3Provider((window as any).ethereum)
        const signer = provider.getSigner()
        const erc20Contract = new ethers.Contract(selectedToken, erc20abi, provider);
        const amount = ethers.BigNumber.from(2).pow(256).sub(1).toString();
        const result = await erc20Contract.connect(signer).approve(contract, amount)
        await result.wait()
        setApproving(false)
      }
    } catch {
      props.onError('Failed to approve tokens')
      setApproving(false)
    }
  }

  async function onClickLock() {
    try {
      setLocking(true);
      const provider = new ethers.providers.Web3Provider((window as any).ethereum)
      const signer = provider.getSigner()
      const erc20Contract = new ethers.Contract(contract, timeLockedAbi, provider);
      const result = await erc20Contract.connect(signer).deposit(
        selectedToken,
        claimer,
        ethers.utils.parseEther(tokensAmount),
        Math.floor((date as Date).getTime() / 1000)
      )
      await result.wait()
      setLocking(false);
    } catch (error) {
      setLocking(false);
      props.onError('Failed to lock tokens')
    }
  }

  return (
    <Paper elevation={1} style={{ padding: '16px 0 32px', marginBottom: 32 }}>
      <Container>
        <Typography variant="h6">Lock funds</Typography>
      </Container>
      <Container>
        <Select
          fullWidth
          label="Token"
          value={selectedToken}
          onChange={(e) => { setSelectedToken(e.target.value as string) }}
          variant="outlined"
        >
          {props.tokens.map((token) => (
            <MenuItem key={token.address} value={token.address}>{token.symbol}</MenuItem>
          ))}
        </Select>
        <TextField fullWidth label="Tokens amount" variant="outlined" style={{ margin: '24px 0' }} value={tokensAmount} onChange={(e => { setTokensAmount(e.target.value) })} />
        <TextField fullWidth label="Claimer address" variant="outlined" style={{ margin: '0 0 24px' }} value={claimer} onChange={(e => { setClaimer(e.target.value) })} />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DateTimePicker label="Select unlock date" inputVariant="outlined" value={date} onChange={(date) => {setDate(date as Date)}} />
        </MuiPickersUtilsProvider>
      </Container>
      {selectedToken && address && claimer && (
        <Container style={{ margin: '24px 0 0' }}>
          {!isApproved && (
            <Button disabled={approving} color="inherit" variant="outlined" onClick={onClickApprove} style={{ marginRight: 16 }}>
              Enable
              {approving && <CircularProgress size={16} style={{ marginLeft: 8 }} />}
            </Button>
          )}
          {isApproved && (
            <Button disabled={locking} color="inherit" variant="outlined" onClick={onClickLock}>
              Lock funds
              {locking && <CircularProgress size={16} style={{ marginLeft: 8 }} />}
            </Button>
          )}
        </Container>
      )}
    </Paper>
  );
}
