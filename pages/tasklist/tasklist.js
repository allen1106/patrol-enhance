// pages/tasklist/tasklist.js
var api = require("../../utils/api.js")
var util = require("../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: null,
    submitList: null,
    state: 0,
    genreList: [{"name": "请选择巡检类别", "genre_id": 0}],
    genreIdx: 0,
    genreId: 0,
    batchList: [{"name": "请选择巡检批次", "batch_id": 0}],
    batchIdx: 0,
    batchId: 0,
    departList: [{"name": "请选择受检单位", "department_id": 0}],
    departIdx: 0,
    departId: 0,
    projectList: [{"name": "请选择受检项目", "item_id": 0}],
    projectIdx: 0,
    projectId: 0,
    statusList: [],
    statusIdx: 0,
    startDate: "请选择开始时间",
    endDate: "请选择结束时间",
    showCheckbox: false,
    touchStart: 0,
    touchEnd: 0,
    canUpdateStatus: 0,
    flagList: ["待巡检", "进行中", "已结束"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var state = Number(options.state)
    var title = options.title
    that.setData({
      state: state,
      userId: wx.getStorageSync('userId')
    })
    wx.setNavigationBarTitle({
      title: title
    })
    let statusList = [{"name": "请选择状态", "key": "is_pj", "code": -1}, {"name": "未评价", "key": "is_pj", "code": 0}, {"name": "已评价", "key": "is_pj", "code": 1}]
    if (state == 1) {
      statusList = [{"name": "请选择状态", "key": "state", "code": 0}, {"name": "待巡检", "key": "state", "code": 1}, {"name": "巡检进行中", "key": "state", "code": 6}, {"name": "已完成巡检", "key": "state", "code": 2}]
    }
    if (state == 5) {
      statusList = [{"name": "请选择状态", "key": "is_hf", "code": -1}, {"name": "未回复", "key": "is_hf", "code": 0}, {"name": "已回复", "key": "is_hf", "code": 1}]
    }
    that.setData({
      statusIdx: 0,
      statusList: statusList
    })
    that.fetchGenreList()
    that.fetchBatchList()
    that.fetchDepartList()
  },

  onShow: function () {
    var that = this;
    that.fetchTaskList()
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

  fetchDepartList: function () {
    var that = this
    // 获取问题类型列表
    api.phpRequest({
      url: 'department.php',
      success: function (res) {
        var list = res.data
        list = that.data.departList.concat(list)
        that.setData({
          departList: list
        })
      }
    })
  },

  fetchProjectList: function () {
    var that = this
    // 获取项目列表
    api.phpRequest({
      url: 'project.php',
      data: {
        'department_id': that.data.departId
      },
      success: function (res) {
        var list = res.data
        list = that.data.projectList.concat(list)
        that.setData({
          projectList: list
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
    }, that.fetchTaskList)
  },

  bindBatchChange: function (e) {
    var idx = e.detail.value
    this.setData({
      batchIdx: idx,
      batchId: this.data.batchList[idx].batch_id
    }, this.fetchTaskList)
  },

  bindDepartChange: function (e) {
    var idx = e.detail.value
    var that = this
    that.setData({
      departIdx: idx,
      departId: that.data.departList[idx].department_id
    }, () => {
      if (that.data.departIdx != 0) {
        that.initProjectList(that.fetchProjectList)
      } else {
        that.initProjectList()
      }
      that.fetchTaskList()
    })
  },

  bindProjectChange: function (e) {
    var idx = e.detail.value
    var that = this
    that.setData({
      projectIdx: idx,
      projectId: this.data.projectList[idx].project_id
    }, this.fetchTaskList)
  },

  initProjectList: function (fn) {
    this.setData({
      projectList: [{"name": "请选择项目", "project_id": 0}],
      projectIdx: 0,
      projectId: 0
    }, () => {
      if (fn) { fn() }
    })
  },

  bindStatusChange: function (e) {
    this.setData({
      statusIdx: e.detail.value,
    }, this.fetchTaskList)
  },

  fetchTaskList: function (concatFlag) {
    var that = this
    var data = {
      userid: that.data.userId,
      state: that.data.state
    }
    if (that.data.state == 1) {
      data = {
        userid: that.data.userId
      }
    }
    if (that.data.genreId != 0) {data["genre_id"] = that.data.genreId}
    if (that.data.batchId != 0) {data["batch_id"] = that.data.batchId}
    if (that.data.departId != 0) {data["department_id"] = that.data.departId}
    if (that.data.projectId != 0) {data["project_id"] = that.data.projectId}
    if (that.data.statusIdx != 0) {
      let statusObj = that.data.statusList[that.data.statusIdx]
      data[statusObj['key']] = statusObj['code']
    }
    api.phpRequest({
      url: 'task.php',
      data: data,
      success: function (res) {
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
  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var fetchWrapper = function () {
      this.fetchTaskList()
    }
    this.setData({
      page: this.data.page + 1
    }, fetchWrapper)
  },

  viewDetail: function (e) {
    if (this.data.showCheckbox) return
    console.log(e.currentTarget.dataset.rid)

    let rid = e.currentTarget.dataset.rid

    if (this.data.state == 3) {
      wx.navigateTo({
        url: '/pages/comment/comment?tid=' + rid
      })
    } else if (this.data.state == 4) {
      wx.navigateTo({
        url: '/pages/question/list?tid=' + rid + '&isfb=1' + '&isdown=1'
      })
    } else if (this.data.state == 7) {
      wx.navigateTo({
        url: '/pages/question/list?tid=' + rid + '&isfb=0' + '&isself=1'
      })
    } else {
      wx.navigateTo({
        url: '/pages/project/project?id=' + rid + "&state=" + this.data.state,
      })
    }
  },

  showCheckbox: function () {
    // if (this.data.state == 4) {
    //   this.setData({
    //     showCheckbox: true
    //   })
    // }
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
  bindBatchDownload: function () {
    var that = this
    var reportIds = that.data.reportIds.join(',')
    api.phpRequest({
      url: 'batch_download.php',
      data: {'report_id_s': reportIds},
      success: function (res) {
        that.hideCheckbox()
        that.setData({
          fileUrl: res.data.file
        }, that.openFile)
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

  updateStatus: function (e) {
    var that = this
    let info = e.currentTarget.dataset.info
    api.phpRequest({
      url: "handle.php",
      data: {
        userid: wx.getStorageSync('userId'),
        task_id: info.id,
        state: info.status == 1 ? 2 : 1
      },
      success: function (res) {
        if (res.data.status == 1) {
          wx.showToast({
            title: '处理成功',
            icon: 'success',
          })
          for (let i in that.data.submitList) {
            if (that.data.submitList[i].id == info.id) {
              that.data.submitList[i].status = res.data.flag
              that.data.submitList[i].flag = that.data.flagList[that.data.submitList[i].status - 1]
              that.setData({
                submitList: that.data.submitList
              })
            }
          }
        } else {
          wx.showToast({
            title: '处理失败',
            icon: 'success',
          })
        }
      }
    })
  }
})