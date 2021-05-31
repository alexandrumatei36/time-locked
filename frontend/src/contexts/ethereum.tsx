import React, {useEffect, useState} from "react";

export const EthereumContext = React.createContext({
    address: '',
    connect: () => {},
    chainId: '',
    ethereum: '',
  }
);

type Props = {
  children: JSX.Element
}
export function EthereumProvider(props: Props) {
  const [address, setAddress] = useState('')
  const [chainId, setChainId] = useState('');
  const [ethereum, setEthereum] = useState<any>();

  useEffect(() => {
    const ethereum = (window as any).ethereum;

    if (ethereum) {
      ethereum.on('accountsChanged', function (accounts: any) {
        if (address !== accounts[0]) {
          setAddress(accounts[0])
          localStorage.setItem('account', accounts[0]);
        }
      });

      ethereum.on('disconnect', () => {
        setAddress('')
        localStorage.removeItem('account')
      });

      ethereum.on('chainChanged', (chainId: string) => {
        setChainId(chainId)
      });
      setEthereum(ethereum);
    }
  }, [])

  useEffect(() => {
    if (!ethereum) {
      return;
    }

    const enable = async() => {
      if (!localStorage.getItem('account')) {
        return;
      }
      const accounts = await ethereum.enable()
      setAddress(accounts[0])
      setChainId(ethereum.chainId)
    }

    enable()
  }, [ethereum])

  async function connect() {
    const accounts = await ethereum.enable()
    setAddress(accounts[0])
    setChainId(ethereum.chainId)
    localStorage.setItem('account', accounts[0]);
  }

  return (
    <EthereumContext.Provider
      value={{
        address,
        connect,
        chainId,
        ethereum,
      }}
    >
      {props.children}
    </EthereumContext.Provider>
  )
}
