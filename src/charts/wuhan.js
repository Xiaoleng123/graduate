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
    };
  }

  reqData = (city) => {
    fetch(`http://localhost:8888/getData/${city}`,{
      method: 'get',
    }).then(response => {
      return response.json();
    }).then(data => {
      data && this.setState({chartData: data});
      this.formatData();
    })
  }

  formatData = () => {
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
    this.setState({business, type, business_count, type_count});
    this.initChart();
  }

  initChart = () => {
    const {
      type,
      business,
      type_count,
      business_count,
    } = this.state;
    console.log(business_count);
    business_count.forEach((e, i) => {
      const myChart = echarts.init(document.getElementById(`main${i}`));
      myChart.setOption({
        title: {
          text: `${e.business}结构`,
          subtext: '数据来源-百度地图',
          sublink:'http://map.baidu.com/',
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [{
          name: e.business,
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
      })
    });
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
      </div>
    );
  }
}