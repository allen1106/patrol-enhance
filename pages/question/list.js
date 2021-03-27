// pages/question/list.js
var api = require("../../utils/api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tid: 0,
    taskInfo: null,
    isFb: 0,
    isself: 0,
    isdown: 0,
    areaList: [{"name": "请选择区段", "area_id": 0}],
    areaIdx: 0,
    areaId: 0,
    industryList: [{"name": "请选择专业", "industry_id": 0}],
    industryIdx: 0,
    industryId: 0,
    systemList: [{"name": "请选择子系统", "system_id": 0}],
    systemIdx: 0,
    systemId: 0,
    assessList: [{"name": "请选择评价维度", "assess_id": 0}],
    assessIdx: 0,
    assessId: 0,
    problemList: [{"name": "请选择缺陷类别", "problem_id": 0}],
    problemIdx: 0,
    problemId: 0,
    statusList: [{"name": "请选择状态", "flag": -1},{"name": "审核中", "flag": 0},{"name": "审核成功", "flag": 1},{"name": "审核失败", "flag": 2}],
    statusIdx: 0,
    statusId: -1,
    submitList: [],
    fileUrl: '',
    showCheckbox: 0,
    reportIds: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    let tid = Number(options.tid) || 0
    let isFb = Number(options.isfb) || 0
    let isself = Number(options.isself) || 0
    let isdown = Number(options.isdown) || 0
    let hidedown = Number(options.hidedown) || 0
    that.setData({
      tid: tid,
      isFb: isFb,
      isself: isself,
      isdown: isdown,
      hidedown: hidedown
    })
    if (isdown && !hidedown) {
      that.setData({
        statusList: [{"name": "审核成功", "flag": 1}],
        statusIdx: 0,
        statusId: 1
      })
    }
    
    api.phpRequest({
      url: 'project_list.php',
      data: {
        'id': tid,
      },
      success: function (res) {
        that.setData({
          taskInfo: res.data
        })
      }
    })
    if (isdown && !hidedown) {that.setData({showCheckbox: true})}
    that.fetchAreaList()
    that.fetchIndustryList()
    that.fetchAssessList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    that.fetchTaskList()
  },

  fetchAreaList: function () {
    var that = this
    // 获取区段信息
    api.phpRequest({
      url: 'area.php',
      success: function (res) {
        var list = res.data
        list = that.data.areaList.concat(list)
        that.setData({
          areaList: list
        })
      }
    })
  },

  fetchIndustryList: function () {
    var that = this
    // 获取专业信息
    api.phpRequest({
      url: 'industry.php',
      success: function (res) {
        var list = res.data
        list = that.data.industryList.concat(list)
        that.setData({
          industryList: list
        })
      }
    })
  },

  fetchSystemList: function () {
    var that = this
    // 获取缺陷类别信息
    api.phpRequest({
      url: 'system.php',
      data: {
        'industry_id': that.data.industryId
      },
      success: function (res) {
        var list = res.data
        list = that.data.systemList.concat(list)
        that.setData({
          systemList: list
        })
      }
    })
  },

  fetchAssessList: function () {
    var that = this
    // 获取评价维度信息
    api.phpRequest({
      url: 'assess.php',
      success: function (res) {
        var list = res.data
        list = that.data.assessList.concat(list)
        that.setData({
          assessList: list
        })
      }
    })
  },

  fetchProblemList: function () {
    var that = this
    // 获取缺陷类别信息
    api.phpRequest({
      url: 'problem.php',
      data: {
        'assess_id': that.data.assessId
      },
      success: function (res) {
        var list = res.data
        list = that.data.problemList.concat(list)
        that.setData({
          problemList: list
        })
      }
    })
  },

  bindAreaChange: function (e) {
    var idx = e.detail.value
    var that = this
    that.setData({
      areaIdx: idx,
      areaId: that.data.areaList[idx].area_id
    }, that.fetchTaskList)
  },

  bindIndustryChange: function (e) {
    var that = this
    var idx = e.detail.value
    this.setData({
      industryIdx: idx,
      industryId: this.data.industryList[idx].industry_id
    }, () => {
      if (that.data.industryIdx != 0) {
        that.initSystemList(that.fetchSystemList)
      } else {
        that.initSystemList()
      }
      that.fetchTaskList()
    })
  },

  bindSystemChange: function (e) {
    var idx = e.detail.value
    var that = this
    that.setData({
      systemIdx: idx,
      systemId: this.data.systemList[idx].system_id
    }, that.fetchTaskList)
  },

  bindAssessChange: function (e) {
    var idx = e.detail.value
    var that = this
    that.setData({
      assessIdx: idx,
      assessId: that.data.assessList[idx].assess_id
    }, () => {
      if (that.data.assessIdx != 0) {
        that.initProblemList(that.fetchProblemList)
      } else {
        that.initProblemList()
      }
      that.fetchTaskList()
    })
  },

  bindProblemChange: function (e) {
    var idx = e.detail.value
    var that = this
    that.setData({
      problemIdx: idx,
      problemId: this.data.problemList[idx].problem_id
    }, that.fetchTaskList)
  },

  bindStatusChange: function (e) {
    var idx = e.detail.value
    var that = this
    that.setData({
      statusIdx: idx,
      statusId: that.data.statusList[idx].flag
    }, that.fetchTaskList)
  },

  initSystemList: function (fn) {
    this.setData({
      systemList: [{"name": "请选择系统", "problem_id": 0}],
      systemIdx: 0,
      systemId: 0
    }, () => {
      if (fn) { fn() }
    })
  },

  initProblemList: function (fn) {
    this.setData({
      problemList: [{"name": "请选择缺陷类别", "problem_id": 0}],
      problemIdx: 0,
      problemId: 0
    }, () => {
      if (fn) { fn() }
    })
  },

  fetchTaskList: function (concatFlag) {
    var that = this
    var data = {
      task_id: that.data.tid
    }
    // 巡检任务报告栏目中的问题显示所有的问题
    if (!that.data.isdown) {
      data['userid'] = wx.getStorageSync("userId")
    }
    if (that.data.hidedown) {
      data['shrid'] = wx.getStorageSync("userId")
    }
    console.log(that.data)
    if (that.data.areaId != 0) {data["area_id"] = that.data.areaId}
    if (that.data.industryId != 0) {data["industry_id"] = that.data.industryId}
    if (that.data.systemId != 0) {data["system_id"] = that.data.systemId}
    if (that.data.assessId != 0) {data["assess_id"] = that.data.assessId}
    if (that.data.problemId != 0) {data["problem_id"] = that.data.problemId}
    if (that.data.statusId != -1) {data["flag"] = that.data.statusId}
    data["is_fb"] = that.data.isFb
    api.phpRequest({
      url: 'report.php',
      data: data,
      success: function (res) {
        console.log(res)
        var list = res.data
        if (concatFlag) {
          list = that.data.submitList.concat(list)
        }
        that.setData({
          submitList: list
        })
      }
    })
  },

  viewDetail: function (e) {
    wx.navigateTo({
      url: '/pages/question/question?id=' + e.currentTarget.dataset.rid + '&isfb=' + this.data.isFb + '&tid=' + this.data.tid + '&isself=' + this.data.isself,
    })
  },

  showCheckbox: function () {
    this.setData({
      showCheckbox: true
    })
  },
  hideCheckbox: function () {
    this.setData({
      showCheckbox: false
    })
  },
  checkboxChange: function (e) {
    var rids = e.detail.value
    this.setData({
      reportIds: rids
    })
  },
  bindDelete: function() {
    var that = this
    var reportIds = that.data.reportIds.join(',')
    api.phpRequest({
      url: 'report_delete.php',
      data: {'report_id_s': reportIds},
      success: function (res) {
        wx.showToast({
          title: '删除成功',
        })
        that.hideCheckbox()
        that.fetchTaskList()
      }
    })
  },
  bindBatchDownload: function () {
    var that = this
    if (that.data.reportIds.length == 0) {
      wx.showToast({
        title: '请选择问题',
      })
      return
    }
    var reportIds = that.data.reportIds.join(',')
    api.phpRequest({
      url: 'batch_download.php',
      data: {
        report_id_s: reportIds,
        task_id: that.data.tid
      },
      success: function (res) {
        if (res.data.status == 1) {
          api.phpRequest({
            url: 'project_list.php',
            data: {
              'id': that.data.tid,
            },
            success: function (res) {
              that.setData({
                taskInfo: res.data
              })
              wx.showToast({
                title: '报告生成成功',
                icon: 'success',
              })
            }
          })
        } else {
          wx.showToast({
            title: '报告生成失败',
            icon: 'none'
          })
        }
        // that.setData({
        //   fileUrl: res.data.file
        // }, that.openFile)
      }
    })
  },
  
  openFile: function (e) {
    var that = this
    let fileName = new Date().valueOf()
    wx.downloadFile({
      url: that.data.fileUrl,
      header: {
        'content-type': 'application/word'
      },
      filePath: wx.env.USER_DATA_PATH + '/' + fileName + '.doc',
      success (res) {
          wx.openDocument({
            filePath: wx.env.USER_DATA_PATH + '/' + fileName + '.doc',
            showMenu: true
          })
      }
  })
  },

  downloadReport: function (e) {
    var that = this
    let typeId = e.currentTarget.dataset.id
    if (typeId == 1) {
      that.setData({
        fileUrl: that.data.taskInfo.file_1
      }, that.openFile)
    } else {
      that.setData({
        fileUrl: that.data.taskInfo.file
      }, that.openFile)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})