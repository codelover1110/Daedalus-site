import React, {useEffect, useRef, useState} from 'react'
import {useSelector} from "react-redux";
import {callService} from "../../_services/callableFunction";
import Chart from "./Chart";

const initialChartData = {
  labels : [],
  datasets: [
    {
      label: "Total Account value",
      data : [],
      fill: true,
      backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(75,192,192,1)"
    },
  ]
}

const AccountPortfolio = (props) => {
  const account = useSelector(state => state.account);
  const portfolioRef = useRef();
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState(initialChartData)
  useEffect(() => {
    (async () => {
      let result = await callService("getBalancehistories", {type:account.type, account: props.account_name});
      setLoading(false)
      const labels = [];
      const data = [];
      let histories = result.data.histories
      if (props.account_name == 'Alpaca' && Object.keys(histories).length > 0) {
        histories.timestamp.forEach((history) => {
          const label = new Date((history * 1000)).toLocaleString()
          labels.push(label)
        })
        histories.equity.forEach((history) => {
          data.push(history)
        })
      } else {
        if(Array.isArray(histories)){
          histories = histories.sort((a, b)=>(parseFloat(a.date._seconds) - parseFloat(b.date._seconds)))
          histories.forEach((history) => {
            const label = new Date((history.date._seconds * 1000)).toLocaleString()
            labels.push(label)
            let totalAccount = 0;
            totalAccount += history.balance;
            history.positions.forEach((position)=>{
              totalAccount+=position.price * position.quantity
            })
            data.push(totalAccount)
          })
        }
      }
     
      const newChartData = {
        labels : labels,
        datasets: [
          {
            label: "Total Account value",
            data,
            fill: true,
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)"
          },
        ]
      }
      setChartData(newChartData)
      setLoading(false)
    })()
  }, [])
  return (
    <div className="panel__item__charts flex mt-3 ">
      <div
        ref={portfolioRef}
        id="portfolioRef"
        className="flex justify-center item-center flex-1 bg-surface-light rounded-md h-32 pt-5"
      >
        {loading ? (
            <span className="flex h-3 w-3 position-relative">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"
              />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"/>
            </span>
          ): <Chart loader={true} data={chartData} chartWidth={800}/>
        }
      </div>
    </div>
  )
}
export default AccountPortfolio
