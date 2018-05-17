import React from 'react';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import  'echarts/lib/chart/bar';
// 引入饼图
import  'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';

export default class Wuhan extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      business: [],
      type: [],
      business_count: [],
      type_count: [],
      chartData: [],
      major: 'business',
      chart: 'pie',
    };
  }

  reqData = (city) => {
    const storage = localStorage.getItem(city);
    if ( storage !== null ){
      const {business, type, business_count, type_count} = JSON.parse(storage);
      this.setState({business, type, business_count, type_count}, () => {
        this.initChart();
      });
    } else {
      fetch(`http://localhost:8888/getData/${city}`, {
        method: 'get',
      }).then(response => {
        return response.json();
      }).then(data => {
        data && this.setState({chartData: data}, () => {
          this.formatData(city);
        });
      })
    }
  }

  formatData = (city) => {
    const data = this.state.chartData;
    const business = [];
    const type =[];
    const obj = {};
    data.forEach((elem, i) => {
      if (!obj[elem.BUSINESS]) {
        business.push(elem.BUSINESS);
        obj[elem.BUSINESS] = {};
        obj[elem.BUSINESS][elem.TYPE] = 1;
      } else {
        !obj[elem.BUSINESS][elem.TYPE] ? obj[elem.BUSINESS][elem.TYPE] = 1 :
          obj[elem.BUSINESS][elem.TYPE] += 1;
      }
      if (!obj[elem.TYPE]) {
        type.push(elem.TYPE);
        obj[elem.TYPE] = {};
        obj[elem.TYPE][elem.BUSINESS] = 1;
      } else {
        !obj[elem.TYPE][elem.BUSINESS] ? obj[elem.TYPE][elem.BUSINESS] = 1 :
          obj[elem.TYPE][elem.BUSINESS] += 1;
      }
    })
    const business_count = [];
    const type_count = [];
    for (let key in obj) {
      type.indexOf(key) >-1 ? type_count.push({type: key, value: obj[key]}) :
      business_count.push({business: key, value: obj[key]});
    }
    this.setState({business, type, business_count, type_count}, () => {
      this.initChart();
      localStorage.setItem(city, JSON.stringify({business, type, business_count, type_count}));
    });
  }

  initChart = () => {
    const {
      major,
      type_count,
      business_count,
    } = this.state;
    const count = major === 'type' ? type_count : business_count;
    count.forEach((e, i) => {
      const myChart = echarts.init(document.getElementById(`main${i}`));
      const option = this.getOption(e, major);
      myChart.setOption(option, {notMerge: true});
    });
  }

  getOption = (e, major) => {
    const {chart} = this.state;
    let option = {};
    chart === 'pie' ? 
    option = {
      title: {
        text: `${e[major]}饼状图`,
        subtext: '数据来源-百度地图',
        sublink:'http://map.baidu.com/',
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        data: this.state.type,
        orient: 'vertical',
        right: 50
      },
      series: [{
        name: e[major],
        type: 'pie',
        radius : '55%',
        center: ['50%', '60%'],
        data: (()=>{
          const arr=[];
          for (let key in e.value) {
            arr.push({name: key, value: e.value[key]})
          }
          return arr;
        })(),
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    } : option = {
      title: {
        text: `${e[major]}柱状图`,
        subtext: '数据来源-百度地图',
        sublink:'http://map.baidu.com/',
        x:'center'
      },
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          splitNumber: e.value.length,
          axisLabel: {
              rotate:45
          },
          data: (()=>{
              const arr=[];
              for (let key in e.value) {
                arr.push(key)
              }
              return arr;
          })(),
          axisTick: {
              alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: e[major],
          type: 'bar',
          barWidth: '60%',
          data: (()=>{
            const arr=[];
            for (let key in e.value) {
              arr.push(e.value[key])
            }
            return arr;
          })(),
        }
      ]
    }
    return option;
  }

  componentDidMount() {
    this.reqData('wuhan');
  }
  render() {
    const major = this.state.major;
    let count = this.state[major].length;
    const chartDom = [];
    const width = count < 4 ? `${(100/count).toFixed(2)}%` : `${(100/(count%2===0?count/2:Math.floor(count/2)+1)).toFixed(2)}%`;
    while(count --) {
      chartDom.push(<div key={`main${count}`} id={`main${count}`} style={{float: 'left', width: width, height: '48%' }}></div>);
    }
    return (
      <div style={{width: '100%', height: '100%', marginTop: '15px'}}>
        {chartDom}
        <button onClick={() => {this.setState({major: this.state.major === 'business' ? 'type' : 'business'}, () => {this.initChart();}); }}>切换主体</button>
        <button onClick={() => {this.setState({chart: this.state.chart === 'pie' ? 'bar' : 'pie'}, () => {this.initChart();}); }}>切换图形</button>
      </div>
    );
  }
}