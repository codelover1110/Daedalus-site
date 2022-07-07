import React, {useEffect, useState} from 'react'
import {Button, Modal, ModalBody, ModalFooter} from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";
import Input from "../../../components/elements/Input";
import {useSelector} from "react-redux";
import {config} from "../../../config";
import {cryptoSymbols} from "../../../assets/cryptoSymbols";
import {stockSymbols} from "../../../assets/stockSymbols";
import AsyncSelect from 'react-select/async';
import {callService} from "../../../_services/callableFunction";
import { NotificationManager } from "react-notifications";


const BuySellModal = ({type = 'buy', isOpen, onClose, onSave}) => {
  console.log(type,' type')
  const account = useSelector(state => state.account)
  const [price, setPrice] = useState(0)
  const [quantity, setQuantity] = useState(0)
  const [symbol, setSymbol] = useState('')
  const [processing, setProcessing] = useState(false)
  const filterSymbols = (inputValue) => {
    const options = account.type === 'stock' ? stockSymbols : cryptoSymbols
    return options.filter((item) =>
      (item.symbol + ' - ' + item.name).toLowerCase().includes(inputValue.toLowerCase())
    ).splice(0, 100).map((item)=>({
      label: item.symbol + ' - ' + item.name,
      value: item.symbol
    }));
  };
  useEffect(()=>{
    if(!isOpen) {
      setPrice(0)
      setQuantity(0)
    }
  },[isOpen])
  const loadOptions = (inputValue, callback) => {callback(filterSymbols(inputValue))};

  const process = async () => {
    if(!(quantity > 0)) return alert('Quantity is invalid.')
    if(!symbol) return alert('Symbol is invalid.')
    setProcessing(true)
    const params = {
      accountType: account.type,
      accountName: account.name,
      quantity: Number(quantity),
      symbol,
    }
    await callService(type, params)
      .then(result=>{
        setProcessing(false)
        onSave()
        return NotificationManager.success('Successfully processed.')
      })
      .catch((error)=>{
        setProcessing(false)
        if(error.error){
          return NotificationManager.success(error.error.message)
        }
    });
  }

  const applyPrice = (data) => {
    (async ()=>{
      if(data?.value) {
        setSymbol(data.value.replace('USD',''))
        const url = `${config.iex_base_url}/stable/${account.type}/${data.value}/quote?token=${config.iex_publish_key}`;
        const response = await fetch(url);
        const result = await response.json()
        if (result.latestPrice) {
          setPrice(result.latestPrice)
        }
      }else{
        setPrice(0)
      }
    })()
  }
  const handleInputChange = (newValue) => {
      const inputValue = newValue.replace(/\W/g, '');
      return inputValue;
    };
  return (
    <Modal show={isOpen} contentClassName="bg-dark">
      <ModalHeader>
        <h1>{type === 'buy'? 'Buy': 'Sell'}</h1>
      </ModalHeader>
      <ModalBody>
        <AsyncSelect
          cacheOptions
          loadOptions={loadOptions}
          defaultOptions
          onInputChange={(newValue)=>handleInputChange(newValue)}
          onChange={(data)=>{applyPrice(data)}}
          isClearable={true}
        />
        {/*{*/}
        {/*  account.type === 'stock' && <Select options={stockSymbolOptions} className="mt-3" onChange={(data)=>{applyPrice('stock',data)}} />*/}
        {/*}*/}
        {/*{*/}
        {/*  account.type === 'crypto' && <Select options={cryptoSymbolOptions} className="mt-3" onChange={(data)=>{applyPrice('crypto',data)}} />*/}
        {/*}*/}
        <Input type="number" label="Price: " disabled={true} value={price} size="sm" className="bg-secondary" />
        <Input type="number" label="Quantity: " size="sm" onChange={(e)=>setQuantity(e.target.value)} value={quantity} />
        {
          (quantity > 0 && price > 0) && <p className="mt-3 mb-3">Your balance will be {type==='buy' ? 'deducted' :'added'} {(quantity * price).toFixed(2)}.</p>
        }
      </ModalBody>
      <ModalFooter>
        <Button variant="success" size="sm" onClick={()=>process()} disabled={processing}>Save</Button>
        <Button variant="danger" size="sm" onClick={()=>onClose()} disabled={processing}>Close</Button>
      </ModalFooter>
    </Modal>
  )
}
export default BuySellModal
