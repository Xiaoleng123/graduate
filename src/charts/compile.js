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


export default class Compile extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      type: [],
      business: [],
      type_count: [],
      business_count: [],
      chartData: [],
      cityMap: {wuhan: '武汉', beijing: '北京'}
    };
  }

  getData = (citys = []) => {
    for (let city of citys) {
      const storage = JSON.parse(localStorage.getItem(city));
      if (storage === null) {
        alert(`${this.state.cityMap[city]}数据尚未获取，请先点击左侧${this.state.cityMap[city]}获得数据!`);
      } else {
        this.mergeData(storage);
      }
    }
  }

  mergeData = (storage) => {
    let type = [];
    let business = [];
    let type_count = [];
    let business_count = [];
    type = storage.type.length >= type.length ? storage.type : type;
    business.push(storage.business);
    if (type_count.length === 0) {
      type_count = type_count.concat(storage.type_count);
      business_count = business_count.concat(storage.business_count);
    } else {
      type_count.forEach((elem, i) => {
        elem[i].value.push(storage.type_count[i].value)
      });
      business_count.forEach((elem, i) => {
        elem[i].value.push(storage.business_count[i].value)
      });
    }
    this.setState({type, business, type_count, business_count}, () => {
      this.initChart();
    })
  }

  initChart = () => {
    
  }

  getOption = (e, major) => {

  }

  componentDidMount() {
    this.getData(['beijing', 'wuhan']);
  }

  render() {
    const {
      business,
      type,
    } = this.state;
    return (
      <div>
        
      </div>
    );
  }
}