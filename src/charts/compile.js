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
import 'echarts/lib/component/grid';


export default class Compile extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      type: [],
      business: [],
      type_count: [],
      business_count: [],
      cityMap: {wuhan: '武汉', beijing: '北京'},
      bj: '北京商圈',
      wh: '武汉商圈'
    };
  }

  getData = (citys = []) => {
    let type = [];
    let business = [];
    let type_count = [];
    let business_count = [];
    for (let city of citys) {
      const storage = JSON.parse(localStorage.getItem(city));
      if (storage === null) {
        alert(`${this.state.cityMap[city]}数据尚未获取，请先点击左侧${this.state.cityMap[city]}获得数据!`);
      } else {
        this.mergeData(storage, type, business, type_count, business_count);
      }
    }
    this.setState({type, business, type_count, business_count}, () => {
      this.initChart();
    })
  }

  mergeData = (storage, type, business, type_count, business_count) => {
    storage.type.length > type.length && type.push(...storage.type);
    business.push(...storage.business);
    if (type_count.length === 0) {
      type_count.push(...storage.type_count);
    } else {
      type_count.forEach((elem, i) => {
        Object.assign(elem.value, storage.type_count[i].value);
      })
    }
    business_count.push(...storage.business_count)
  }

  initChart = () => {
    const myChart = echarts.init(document.getElementById('main'));
    const option = this.getOption();
    myChart.setOption(option, {notMerge: true});
    const myChart_wh = echarts.init(document.getElementById('wh'));
    const myChart_bj = echarts.init(document.getElementById('bj'));
    const option_wh = this.getOption_wh();
    const option_bj = this.getOption_bj();
    myChart_wh.setOption(option_wh, {notMerge: true});
    myChart_bj.setOption(option_bj, {notMerge: true});
  }

  getOption_wh = () => {
    const {
      business,
      business_count,
      wh,
    } = this.state;
    const option = {
      title: {
        text: `${wh}饼状图`,
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
        name: wh,
        type: 'pie',
        radius : '55%',
        center: ['50%', '60%'],
        data: (()=>{
          const arr=[];
          if (wh !== '武汉商圈') {
            const index = business.indexOf(wh);
            const value = business_count[index].value;
            for (let key in value){
              arr.push({name: key, value: value[key]})
            }
          } else {
            business_count.slice(~~(business_count.length/2)).forEach((elem) => {
              let i = 0;
              for (let key in elem.value){
                arr[i] !== undefined ? arr[i].value += elem.value[key] : arr[i] = {name: key, value: elem.value[key]};
                i ++;
              }
            })
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
    };
    return option;
  }
  getOption_bj = () => {
    const {
      business,
      business_count,
      bj,
    } = this.state;
    const option = {
      title: {
        text: `${bj}饼状图`,
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
        name: bj,
        type: 'pie',
        radius : '55%',
        center: ['50%', '60%'],
        data: (()=>{
          const arr=[];
          if (bj !== '北京商圈') {
            const index = business.indexOf(bj);
            const value = business_count[index].value;
            for (let key in value){
              arr.push({name: key, value: value[key]})
            }
          } else {
            business_count.slice(0, ~~(business_count.length/2)).forEach((elem) => {
              let i = 0;
              for (let key in elem.value){
                arr[i] !== undefined ? arr[i].value += elem.value[key] : arr[i] = {name: key, value: elem.value[key]};
                i ++;
              }
            })
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
    };
    return option;
  }

  getOption = () => {
    const {
      bj,
      wh,
      type,
      business,
      business_count,
    } = this.state;
    const bjData = [];
    const whData = [];
    if (bj !== '北京商圈') {
      const index = business.indexOf(bj);
      const value = business_count[index].value;
      type.forEach(e => {
        bjData.push(value[e] || 0);
      })
    } else {
      business_count.slice(0, ~~(business_count.length/2)).forEach((elem) => {
        let i = 0;
        for (let key in elem.value){
          bjData[i] !== undefined ? bjData[i] += elem.value[key] : (bjData[i] = elem.value[key]);
          i ++;
        }
      })
    }
    if (wh !== '武汉商圈') {
      const index = business.indexOf(wh);
      const value = business_count[index].value;
      type.forEach(e => {
        whData.push(value[e] || 0);
      })
    } else {
      business_count.slice(~~(business_count.length/2)).forEach((elem) => {
        let i = 0;
        for (let key in elem.value){
          whData[i] !== undefined ? whData[i] += elem.value[key] : (whData[i] = elem.value[key]);
          i ++;
        }
      })
    }
    const option = {
      title: {
        text: `${wh}与${bj}——第三产业结构比较`,
        subtext: '数据来源-百度地图',
        sublink:'http://map.baidu.com/',
        x:'center'
      },
      calculable : true,
      legend: {
        data: [wh, bj],
        orient: 'vertical',
        right: 50
      },
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
          splitNumber: type.length,
          data: type,
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
          name: wh,
          type: 'bar',
          barWidth: '30%',
          data: whData,
        },
        {
          name: bj,
          type: 'bar',
          barWidth: '30%',
          data: bjData,
        },
        {
          name: wh,
          type: 'line',
          lineStyle: {
            color: '#675bba'
          },
          smooth: true,
          data: whData,
        },
        {
          name: bj,
          type: 'line',
          lineStyle: {
            color: '#5793f3'
          },
          smooth: true,
          data: bjData,
        },
      ]
    };
    return option;
  }

  changeBusiness = (type, e) => {
    const tempState = Object.assign({}, this.state);
    tempState[type] = e.target.value;
    this.setState(tempState, () => {
      this.initChart();
    });
  }

  componentDidMount() {
    this.getData(['beijing', 'wuhan']);
  }

  render() {
    const {
      business,
    } = this.state;
    const select_1 = [<option key={99} value='北京商圈'>全北京</option>];
    const select_2 = [<option key={99} value='武汉商圈'>全武汉</option>];
    business.slice(0).forEach((e, i) => {
      select_1.push(<option key={i} value={e}>{e}</option>);
      if (i === ~~(business.length/2)) select_1.push(<option key="wh" disabled>下面是武汉</option>);
    })
    // business.slice(~~(business.length/2)).forEach((e, i) => {
    //   select_2.push(<option key={i} value={e}>{e}</option>)
    // })
    business.slice(0).forEach((e, i) => {
      select_2.push(<option key={i} value={e}>{e}</option>);
      if (i === ~~(business.length/2)) select_2.push(<option key="wh" disabled>下面是武汉</option>);
    })
    return (
      <div style={{height: '100%', width: '100%'}}>
        <div id="main" style={{display: 'inline-block', height: '50%', width: '50%'}}></div>
        <div id="wh" style={{display: 'inline-block',height: '48%', width: '25%'}}></div>
        <div id="bj" style={{display: 'inline-block',height: '48%', width: '25%'}}></div>
        <select value={this.state.wh} onChange={e => {this.changeBusiness('wh', e)}}>
          {select_2}
        </select>
        <select value={this.state.bj} onChange={e => {this.changeBusiness('bj', e)}}>
          {select_1}
        </select>
      </div>
    );
  }
}