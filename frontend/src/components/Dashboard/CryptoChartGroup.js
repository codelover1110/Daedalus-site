import React, {useState} from 'react'

const CryptoChartGroup = () => {
  /** stock symbols */
  const [cryptoSymbols, setCryptoSymbols] = useState([]);
  /** stock changes */
  const [cryptoChanges, setCryptoChanges] = useState([]);

  /** stock prices */
  const [cryptoPrices, setCryptoPrices] = useState([]);

  const [changeColors, setChangeColors] = useState([]);
  return <h1>hello world</h1>
}
export default CryptoChartGroup
