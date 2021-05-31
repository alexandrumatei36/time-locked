export type Token = {
  address: string, symbol: string, decimals: number
}
export function saveToken(token: Token) {
  let storageTokens = localStorage.getItem('tokens')

  if (storageTokens) {
    let tokens = JSON.parse(storageTokens)
    tokens = [...tokens, token]
    localStorage.setItem('tokens', JSON.stringify(tokens))
  } else {
    localStorage.setItem('tokens', JSON.stringify([token]))
  }
}

export function getTokens() {
  let tokens = localStorage.getItem('tokens')

  if (tokens) {
    return JSON.parse(tokens);
  }

  return [];
}

export function tokenExists(address: string) {
  let tokens = localStorage.getItem('tokens')

  if (tokens) {
    return JSON.parse(tokens).filter((token: Token) => token.address === address).length > 0
  }

  return false;
}
