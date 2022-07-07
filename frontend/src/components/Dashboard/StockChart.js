import React, {useEffect, useRef, useState} from 'react'
import Chart from "./Chart";
import {_getChart, styleData} from "../../containers/utils/Dashboard";

const StockChart = (
  {
    symbolChart,
    stockSymbols,
    selectedStockSymbol,
    stockPrice,
    stockChange,
    changesColor,
    darkTheme
  }
) => {
  const [fillChart, setFillChart] = useState(false)
  const [loader, setLoader] = useState(true)
  const [chartData, setChartData] = useState([])
  const [chartLabels, setChartLabels] = useState([])
  const chartRef = useRef()
  useEffect(() => {
      if (symbolChart) {
        (async () => {
          const {data, labels} = await _getChart(symbolChart, stockSymbols);
          setChartData(data || []);
          setChartLabels(labels || []);
        })()
      }
    },
    [symbolChart])
  // update chart
  useEffect(() => {
    if (chartData.length > 0) {
      let chart = chartRef.current;
      if (
        chartData.length >= 2 &&
        chart
      ) {
        setLoader(true);
        setFillChart(true);
        chart.href = "/stocks/" + selectedStockSymbol;
      } else {
        setLoader(false);
        if (chart) {
          chart.href = "#";
        }
      }
    }
  }, [chartData]);
  const styleData = () => {
    const canvas = document.createElement("CANVAS");
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 600, 10);
    gradient.addColorStop(0, "#7c83ff");
    gradient.addColorStop(1, "#7cf4ff");
    let gradientFill = ctx.createLinearGradient(0, 0, 0, 100);
    gradientFill.addColorStop(0.1, "rgba(124, 131, 255,.3)");
    if (darkTheme) {
      gradientFill.addColorStop(0.8, "rgba(55, 58, 70, 0)");
    } else {
      gradientFill.addColorStop(0.8, "rgba(255, 255, 255, 0)");
    }
    ctx.shadowColor = "rgba(124, 131, 255,.3)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
    return {
      labels: chartLabels,
      datasets: [
        {
          lineTension: 0.3,
          label: symbolChart,
          pointBorderWidth: 0,
          pointHoverRadius: 0,
          borderColor: gradient,
          backgroundColor: gradientFill,
          pointBackgroundColor: gradient,
          fill: true,
          borderWidth: 2,
          data: chartData,
        },
      ],
    };
  };
  const renderChart = () => {
    if (!fillChart) {
      return (
        <span className="flex h-3 w-3 position-relative">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"
          />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"/>
        </span>
      );
    }
    return (
      <Chart
        loader={loader}
        data={styleData()}
        stockSymbol={selectedStockSymbol}
        stockPrice={stockPrice}
        stockChange={stockChange}
        changesColor={changesColor}
      />
    );
  }

  return (
    <div
      ref={chartRef}
      className="flex justify-center items-center flex-1 bg-surface-light rounded-md h-32 mr-4"
    >
      {renderChart()}
    </div>
  )
}

export default StockChart
