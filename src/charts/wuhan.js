import React from 'react';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import  'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

export default class Wuhan extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      chartData: [],
    };
  }

  reqData = (callback) => {
    fetch('http://localhost:8888/getData/beijing',{
      method: 'get',
    }).then(response => {
      return response.json();
    }).then(data => {
      data && this.setState({chartData: data});
      callback();
    })
    // const xhr = new XMLHttpRequest();
    // xhr.open('GET', 'http://localhost:8888/getData/beijing',true);
    // xhr.send();
    // xhr.onreadystatechange = function () {
    //   if (xhr.readyState === 4) {
    //     if ( xhr.status === 200) {
    //       console.log(JSON.parse(xhr.responseText));
    //     }else {
    //       console.error(`error status:${xhr.status}`);
    //     }
    //   }
    // };
  }

  initChart = () => {
    console.log(this.state.chartData);
  }
  componentDidMount() {
    this.reqData(this.initChart);
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    // 绘制图表
    myChart.setOption({
        title: {
          text: '武汉市poi商圈结构'
        },
        tooltip: {},
        xAxis: {
            data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    });
  }
  render() {
    return (
      <div id="main" style={{ width: '100%', height: '100%' }}></div>
    );
  }
}