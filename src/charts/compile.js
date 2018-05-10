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
      bj: '北京',
      wh: '武汉'
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
    if (bj !== '北京') {
      const index = business.indexOf(bj);
      const value = business_count[index].value;
      type.forEach(e => {
        bjData.push(value[e] || 0);
      })
    } else {
      business_count.slice(0, ~~(business_count.length/2)).forEach((elem) => {
        let i = 0;
        for (let key in elem.value){
          bjData[i] !== undefined ? bjData[i] += elem.value[key] : (bjData[i] = 0);
          i ++;
        }
      })
    }
    if (wh !== '武汉') {
      const index = business.indexOf(wh);
      const value = business_count[index].value;
      type.forEach(e => {
        whData.push(value[e] || 0);
      })
    } else {
      business_count.slice(~~(business_count.length/2)).forEach((elem) => {
        let i = 0;
        for (let key in elem.value){
          whData[i] !== undefined ? whData[i] += elem.value[key] : (whData[i] = 0);
          i ++;
        }
      })
    }
    const option = {
      title: {
        text: `${bj}与${wh}——第三产业结构比较`,
        subtext: '数据来源-百度地图',
        sublink:'http://map.baidu.com/',
        x:'center'
      },
      calculable : true,
      legend: {
        data: [bj, wh],
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
          axisLabel: {
              rotate:45
          },
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
          name: bj,
          type: 'bar',
          barWidth: '30%',
          data: bjData,
        },
        {
          name: wh,
          type: 'bar',
          barWidth: '30%',
          data: whData,
        }
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
    const select_1 = [<option key={99} value='北京'>全北京</option>];
    const select_2 = [<option key={99} value='武汉'>全武汉</option>];
    business.slice(0).forEach((e, i) => {
      select_1.push(<option key={i} value={e}>{e}</option>);
      if (i === ~~(business.length/2)) select_1.push(<option key="wh" disabled>下面是武汉</option>);
    })
    business.slice(~~(business.length/2)).forEach((e, i) => {
      select_2.push(<option key={i} value={e}>{e}</option>)
    })
    return (
      <div style={{height: '80%', width: '80%'}}>
        <div id="main" style={{height: '100%', width: '100%'}}></div>
        <select value={this.state.bj} onChange={e => {this.changeBusiness('bj', e)}}>
          {select_1}
        </select>
        <select value={this.state.wh} onChange={e => {this.changeBusiness('wh', e)}}>
          {select_2}
        </select>
        
      </div>
    );
  }
}