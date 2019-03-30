import BigNumber from "bignumber.js"

/**
 * This file contains all function helper we provide to simplify the exercice.
 * Please fully study what the functions are doing and feel free to modify it in your own projects.
 * Feel free to add more feature if needed.
 */

export const isValidEthereum = address => address.match(/^0x[0-9a-fA-F]{40}$/);

/**
 * fetchTxs allows to retrieve all transactions of an Ethereum address with Ledger's API
 * It takes an ethereum address and returns a Promise of an array of transactions (from the blockchain).
 *
 * Feel free to play with it beforehand and look at the returned value objects.
 */
export const fetchTxs = async address => {
  const fetchTxsPage = (address, block) => {
    const url = `http://eth-mainnet.explorers.prod.aws.ledger.fr/blockchain/v3/addresses/${address}/transactions?batch_size=2000&partial=true&no_token=true${
      block ? "&block_hash=" + block : ""
    }`;
    console.log("GET", url);
    return fetch(url).then(async r => {
      if (!r.ok) {
        const res = await r.text();
        throw res;
      }
      return r.json();
    });
  };

  console.log(`fetching txs for ${address}`);
  let { txs } = await fetchTxsPage(address);
  while (true) {
    const last = txs[txs.length - 1];
    if (!last) break;
    const { block } = last;
    if (!block) break;
    const next = await fetchTxsPage(address, block.hash);
    const nextTxs = next.txs.filter(tx => !txs.some(t => t.hash === tx.hash));
    if (nextTxs.length === 0) break;
    txs = txs.concat(nextTxs);
  }
  txs.reverse();
  console.log(`finished fetching ${txs.length} txs for ${address}`);
  return txs;
};

/**
 * txsToOperations takes the retrieved array of transactions
 * and transform it to an array of operations.
 *
 * NB: a blockchain transaction can produce multiple operations.
 * Not only a "SELF" transaction produces 2 moves but also, with ERC20,
 * we in fact can have many token operations in one transaction.
 *
 * Please study the function below and test it with different transactions.
 */
export const txsToOperations = async (txs, address) => {
  const ops = [];
  const ethPrice = await fetchCurrencyPrice("ETH");
  for (let i = 0; i < txs.length; i++) {
    const tx = txs[i];
    const fee = tx.gas_price * tx.gas_used;
    const sending = address === tx.from;
    const receiving = address === tx.to;
    const value = tx.value;
    if (sending) {
      ops.push({
        symbol: "ETH",
        magnitude: 18,
        id: `${tx.hash}-OUT`,
        hash: tx.hash,
        type: "OUT",
        value: value + fee,
        price: new BigNumber(value).plus(fee).dividedBy(10**(18)).multipliedBy(ethPrice["USD"]),
        address: tx.to,
        date: new Date(tx.received_at)
      });
    }
    if (receiving) {
      ops.push({
        symbol: "ETH",
        magnitude: 18,
        id: `${tx.hash}-IN`,
        hash: tx.hash,
        type: "IN",
        value,
        price: new BigNumber(value).dividedBy(10**(18)).multipliedBy(ethPrice["USD"]),
        address: tx.from,
        date: new Date(tx.received_at)
      });
    }
    const transfers = tx.transfer_events.list;
    for (let j = 0; j < transfers.length; j++) {
      const event = transfers[j];
      if (event.symbol) {
        const symbol = event.symbol.match(/([^ ]+)/g)[0];
        const sending = address === event.from;
        const receiving = address === event.to;
        const value = event.count;
        const tokenPrice = await fetchCurrencyPrice(event.symbol);
        if (sending) {
          ops.push({
            symbol,
            magnitude: event.decimal,
            id: `${tx.hash}-${j}-OUT`,
            hash: tx.hash,
            type: "OUT",
            value,
            price: new BigNumber(value).dividedBy(10**(event.decimal)).multipliedBy(tokenPrice["USD"]),
            address: event.to,
            date: new Date(tx.received_at)
          });
        }
        if (receiving) {
          ops.push({
            symbol,
            magnitude: event.decimal,
            id: `${tx.hash}-${j}-IN`,
            hash: tx.hash,
            type: "IN",
            value,
            price: new BigNumber(value).dividedBy(10**(event.decimal)).multipliedBy(tokenPrice["USD"]),
            address: event.from,
            date: new Date(tx.received_at)
          });
        }
      }
    }
  }

  return Promise.all(ops);
};

/**
 * This is an example to calculate the balance.
 * You might want to diverge from it to add more feature!
 *
 * It takes an array of operations and calculates balances of ETH and ERC20
 * as well as other information.
 *
 * Feel free to play with it.
 */
const getSummary = operations => {
  const tokensMagnitude = {};
  const balances = {};
  const prices = {};
  operations.map(op => {
    if (op.type === "OUT") {
      balances[op.symbol] = new BigNumber(balances[op.symbol] || 0).minus(new BigNumber(op.value));
      prices[op.symbol] = new BigNumber(prices[op.symbol] || 0).minus(new BigNumber(op.price));
    } else {
      balances[op.symbol] = new BigNumber(balances[op.symbol] || 0).plus(new BigNumber(op.value));
      prices[op.symbol] = new BigNumber(prices[op.symbol] || 0).plus(new BigNumber(op.price));
    }
    tokensMagnitude[op.symbol] = op.magnitude;
  });
  return { balances, tokensMagnitude, prices};
};

// retrieve currency price by symbol with cryptocompare's API
export const fetchCurrencyPrice = async currencySymbol => {
  const url = `https://min-api.cryptocompare.com/data/price?fsym=${currencySymbol}&tsyms=USD`;
  // console.log("GET", url);
  return fetch(url, {
    headers : {
      'authorization': 'Apikey d6778ed43bb33711aed42b3fd7060d152566b52f703fd33b1b26dbf4de0709af'
  }}).then(async r => {
    if (r.ok) {
      return r.json();
    }
  });
};

export const getBalance = async address => {
  const txs = await fetchTxs(address);
  const ops = await txsToOperations(txs, address);
  const summary = await getSummary(ops);;
  return { summary, ops };
};
/**
 * formatValue will returns a string that is human readable for a cryptocurrency amount.
 * Example: formatValue(100000, 8) is 0.001 (because 100000 satoshis is 0.001 btc)
 *
 * - value is an amount in cryptocurrencies smallest unit (e.g. the satoshi / the wei)
 * - magnitude is the number of digits that the coin supports
 */
export const formatValue = (value, magnitude) =>
  (value / Math.pow(10, magnitude)).toLocaleString();