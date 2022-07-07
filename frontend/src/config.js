export const config = {
  coinbase_client_id: "58054d15376a178e2129198e65f2713f9049e8f9c7c4dff472abec66c3825ced",
  coinbase_redirect_uri: window.location.origin + '/',
  coinbase_state: "coinbase_state_daedalus",
  coinbase_scope: ["wallet:accounts:read", "wallet:user:read", "wallet:user:email"],

  alpaca_client_id: "c44e66c3f86085894899596d1e049e14",
  alpaca_redirect_uri: window.location.origin + '/',
  alpaca_state: "alpaca_state_daedalus",
  alpaca_scope: "data",

  binance_client_id: "KlhyPQ4mrn51v2obn6Szb19fcfPct2wIwoG26dLDHSZJWRCMc9c2TSJgyFucmdqj",
  binance_client_secret: "qZdoqRruNd5hZiBRt5ngb2cihxSO9vaGaObjW6MXmGOI2LmKncVwMOg5MRZwJxva",
  binance_redirect_uri: window.location.origin + '/',
  binance_state: "377f36a4557ab5935b3611",
  binance_scope: "user:balance",

  iex_base_url: "https://cloud.iexapis.com",
  iex_publish_key: "pk_fde490c1a26e43798c9463412f26ada3",
  iex_secret_key: "Tsk_d2d73826817b46fd9b312af3845b4c0e",

  coinmarketap_key: "62543b0a-3afe-4539-a0eb-7044bd9a1767",
  // coinmarketap_key: "b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c",
  coinmarketap_base_url: "https://pro-api.coinmarketcap.com",
  //===test====
  stripe_publishable_key: "pk_test_51KHZbuENaAzJyBIeaUwIHqy8FuoPbaARZRvAp23QoutMD7IWNRneTS9v5ZA2brtpJiJ5HflSTNA35DRrUTBi4uiH00bvkV5qpO",
  //===live====
  // stripe_publishable_key: "pk_live_51KHZbuENaAzJyBIeYFCPncwyg007YH44qwUiIBnu6OnqGQnbbvttNRayMJkd4LrHk6Bw0y0out6oy3u7PDj2IGHC00dphVA2vD",

}

export const API = {
  key: process.env.FINANCIAL_MODEL_API_KEY || '8149215831d107c58f0ca191c40ebddd',
  url: 'https://financialmodelingprep.com/api/v3'

}
