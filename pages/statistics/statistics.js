// pages/statistics/statistics.js
import * as echarts from '../../ec-canvas/echarts';

var api = require("../../utils/api.js")
var util = require("../../utils/util.js")

function initChart(options) {
  return function (canvas, width, height, dpr) {
    const barChart = echarts.init(canvas, null, {
      width: width,
      height: height,
      devicePixelRatio: dpr // new
    });
    canvas.setChart(barChart);
    barChart.setOption(options);

    return barChart;
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: wx.getStorageSync('userId'),
    startDate: "请选择开始时间",
    endDate: "请选择结束时间",
    genreList: [{"name": "请选择巡检类别", "genre_id": 0}],
    genreIdx: 0,
    genreId: 0,
    batchList: [{"name": "请选择巡检批次", "batch_id": 0}],
    batchIdx: 0,
    batchId: 0,
    currentTab: 0,
    departData: null,
    projectData: null,
    evaluateData: null,
    eidx: -1,
    industryData: null,
    iidx: -1,
    loading: 0,
    ec0: {lazyLoad: true},
    ec1: {lazyLoad: true},
    ec2: {lazyLoad: true},
    ec3: {lazyLoad: true}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.fetchGenreList()
    that.fetchBatchList()
  },

  onReady: function () {
  },

  onShow: function () {
    this.fetchData()
  },

  fetchGenreList: function () {
    var that = this
    // 获取巡检类别
    api.phpRequest({
      url: 'genre.php',
      success: function (res) {
        var list = res.data
        list = that.data.genreList.concat(list)
        that.setData({
          genreList: list
        })
      }
    })
  },

  fetchBatchList: function (fn) {
    var that = this
    // 获取巡检类别
    api.phpRequest({
      url: 'batch.php',
      success: function (res) {
        var list = res.data
        list = that.data.batchList.concat(list)
        that.setData({
          batchList: list
        })
      }
    })
  },

  bindGenreChange: function (e) {
    var idx = e.detail.value
    var that = this
    that.setData({
      genreIdx: idx,
      genreId: that.data.genreList[idx].genre_id
    }, that.fetchData)
  },

  bindBatchChange: function (e) {
    var idx = e.detail.value
    this.setData({
      batchIdx: idx,
      batchId: this.data.batchList[idx].batch_id
    }, this.fetchData)
  },

  bindStartChange: function (e) {
    var date = e.detail.value
    this.setData({
      startDate: date
    }, this.fetchData)
  },

  bindEndChange: function (e) {
    var date = e.detail.value
    this.setData({
      endDate: date
    }, this.fetchData)
  },

  switchNav: function () {
    let that = this
    if (that.data.loading == 4) {
      if (that.data.currentTab == 0) that.setOption0()
      if (that.data.currentTab == 1) that.setOption1()
      if (that.data.currentTab == 2) {
        if (that.data.eidx != -1) {
          that.switchEvaluate()
        } else {
          that.setOption2()
        }
      }
      if (that.data.currentTab == 3) {
        if (that.data.iidx != -1) {
          that.switchIndustry()
        } else {
          that.setOption3()
        }
      }
    }
  },
  fetchData: function () {
    let that = this
    that.setData({
      loading: 0,
    })
    let data = {}

    if (that.data.genreId != 0) {data["genre_id"] = that.data.genreId}
    if (that.data.batchId != 0) {data["batch_id"] = that.data.batchId}
    if (that.data.startDate != "请选择开始时间") {data["startDate"] = that.data.startDate}
    if (that.data.endDate != "请选择结束时间") {data["endDate"] = that.data.endDate}

    api.phpRequest({
      url: 'statistics.php',
      data: data,
      success: function (res) {
        var list = res.data
        let nameList = []
        let dataList = []
        for (var i in list) {
          nameList.push(list[i].name)
          dataList.push(list[i].number)
        }
        that.setData({
          loading: that.data.loading + 1,
          departData: {
            nameList: nameList,
            dataList: dataList
          }
        }, that.switchNav)
      }
    })

    api.phpRequest({
      url: 'statistics1.php',
      data: data,
      success: function (res) {
        var list = res.data
        let nameList = []
        let dataList = []
        for (var i in list) {
          nameList.push(list[i].name)
          dataList.push(list[i].number)
        }
        that.setData({
          loading: that.data.loading + 1,
          projectData: {
            nameList: nameList,
            dataList: dataList
          }
        }, that.switchNav)
      }
    })

    api.phpRequest({
      url: 'statistics2.php',
      data: data,
      success: function (res) {
        that.setData({
          loading: that.data.loading + 1,
          evaluateData: res.data
        }, that.switchNav)
      }
    })
    api.phpRequest({
      url: 'statistics3.php',
      data: data,
      success: function (res) {
        that.setData({
          loading: that.data.loading + 1,
          industryData: res.data
        }, that.switchNav)
      }
    })
  },
  
  bindSwtichNav: function (e) {
    let that = this
    let tab = Number(e.currentTarget.dataset.tab)
    that.setData({
      currentTab: tab,
      eidx: -1,
      iidx: -1
    }, () => {
      if (tab == 0) that.setOption0()
      if (tab == 1) that.setOption1()
      if (tab == 2) that.setOption2()
      if (tab == 3) that.setOption3()
    })
  },

  setOption0: function () {
    let that = this
    that.selectComponent('#mychart-dom-bar0').init(initChart({
      color: ['#37a2da'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        confine: true
      },
      legend: {
        data: ['数量']
      },
      grid: {
        left: 20,
        right: 20,
        bottom: 15,
        top: 40,
        containLabel: true
      },
      xAxis: [
        {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666'
          }
        }
      ],
      yAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: that.data.departData.nameList,
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666'
          }
        }
      ],
      series: [
        {
          name: '数量',
          type: 'bar',
          label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },
          data: that.data.departData.dataList,
        }
      ]
    }))
  },
  setOption1: function () {
    let that = this
    that.selectComponent('#mychart-dom-bar0').init(initChart({
      color: ['#37a2da'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        confine: true
      },
      legend: {
        data: ['数量']
      },
      grid: {
        left: 20,
        right: 20,
        bottom: 15,
        top: 40,
        containLabel: true
      },
      xAxis: [
        {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666'
          }
        }
      ],
      yAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: that.data.projectData.nameList,
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666',
            formatter: function(value) {
              if (value.length > 12) {
                return value.substring(0, 12) + "...";
              } else {
                return value;
              }
            }
          }
        }
      ],
      series: [
        {
          name: '数量',
          type: 'bar',
          label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },
          data: that.data.projectData.dataList,
        }
      ]
    }))
  },
  setOption2: function (data) {
    let that = this
    if (!data) {
      data = []
      for (var i in that.data.evaluateData) {
        data.push({
          value: Number(that.data.evaluateData[i].number),
          name: that.data.evaluateData[i].name,
        })
      }
    }
    console.log(data)
    that.selectComponent('#mychart-dom-bar0').init(initChart({
      title: {
          text: '问题分布',
          left: 'center'
      },
      legend: {
        orient: 'vertical',
        icon: "circle",
        right: 50,
        top: 50,
        bottom: 20,
        formatter:  function(name) {
          var total = 0;
          var tarValue;
          for (var i = 0; i < data.length; i++) {
            total += Number(data[i].value);
            if (data[i].name == name) {
              tarValue = Number(data[i].value);
            }
          }
          var v = tarValue;
          var p = Math.round(((tarValue / total) * 100))
          return `${name}|  ${p}%  ${v}`
        },
      },
      series: [{
        type: 'pie',
        radius: '20%',
        center: ['20%', '20%'],
        label: null,
        data: data
      }]
    }))
  },
  setOption3: function (data) {
    let that = this
    if (!data) {
      data = []
      for (var i in that.data.industryData) {
        data.push({
          value: Number(that.data.industryData[i].number),
          name: that.data.industryData[i].name,
        })
      }
    }
    that.selectComponent('#mychart-dom-bar0').init(initChart({
      title: {
          text: '问题分布',
          left: 'center'
      },
      legend: {
        orient: 'vertical',
        icon: "circle",
        right: 50,
        top: 50,
        bottom: 20,
        formatter:  function(name) {
          var total = 0;
          var tarValue;
          for (var i = 0; i < data.length; i++) {
            total += data[i].value;
            if (data[i].name == name) {
              tarValue = data[i].value;
            }
          }
          var v = tarValue;
          var p = Math.round(((tarValue / total) * 100))
          return `${name}|  ${p}%  ${v}`
        },
      },
      series: [{
        type: 'pie',
        radius: '20%',
        center: ['20%', '20%'],
        label: null,
        data: data
      }]
    }))
  },

  bindSwitchEvaluate: function (e) {
    let eidx = Number(e.currentTarget.dataset.idx)
    this.setData({
      eidx: eidx
    }, this.switchEvaluate)
  },
  switchEvaluate: function () {
    let eidx = this.data.eidx
    let data = []
    for (var i in this.data.evaluateData[eidx].assess_sub) {
      data.push({
        value: this.data.evaluateData[eidx].assess_sub[i].number,
        name: this.data.evaluateData[eidx].assess_sub[i].name,
      })
    }
    this.setOption2(data)
  },

  bindswitchIndustry: function (e) {
    let iidx = Number(e.currentTarget.dataset.idx)
    this.setData({
      iidx: iidx
    }, this.switchIndustry)
  },
  switchIndustry: function () {
    let iidx = this.data.iidx
    let data = []
    for (var i in this.data.industryData[iidx].industry_sub) {
      data.push({
        value: this.data.industryData[iidx].industry_sub[i].number,
        name: this.data.industryData[iidx].industry_sub[i].name,
      })
    }
    this.setOption3(data)
  },
  saveImage: function () {
    let that = this
    that.selectComponent('#mychart-dom-bar0').canvasToTempFilePath({
      fileType: 'png',
      success: res => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath
        })
      }
    })
  },
})