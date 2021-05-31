import React, {useEffect, useState} from "react";

export const EthereumContext = React.createContext({
    address: '',
    connect: () => {},
    chainId: '',
    ethereum: undefined,
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
    const eth = (window as any).ethereum;

    if (eth) {
      eth.on('accountsChanged', function (accounts: any) {
        if (address !== accounts[0]) {
          setAddress(accounts[0])
          localStorage.setItem('account', accounts[0]);
        }
      });

      eth.on('disconnect', () => {
        setAddress('')
        localStorage.removeItem('account')
      });

      eth.on('chainChanged', (chainId: string) => {
        setChainId(chainId)
      });
      setEthereum(eth);
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
