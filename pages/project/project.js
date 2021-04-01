// pages/project/project.js
var api = require("../../utils/api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tid: 0,
    state: 1,
    info: null,
    currentTab: 0,
    teamList: [],
    canPost: 0,
    canDown: 0,
    showImg: 0,
    showImg1: 0,
    showImg2: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    let tid = Number(options.id) || 0
    let state = Number(options.state) || 1
    // 获取项目基本信息
    api.phpRequest({
      url: 'project_list.php',
      data: {
        'id': tid,
      },
      success: function (res) {
        if (res.data.img) {res.data.img = res.data.img.split(',')}
        if (res.data.img1) {res.data.img1 = res.data.img1.split(',')}
        if (res.data.img2) {res.data.img2 = res.data.img2.split(',')}
        that.setData({
          tid: tid,
          state: state,
          info: res.data
        })
      }
    })
    // 获取巡检小组信息
    api.phpRequest({
      url: 'team.php',
      data: {
        'task_id': tid,
      },
      success: function (res) {
        for (let i in res.data) {
          res.data[i].team_list = res.data[i].team_list.split(",")
        }
        that.setData({
          teamList: res.data
        })
      }
    })
    if (state == 1) {
      api.phpRequest({
        url: 'jurisdiction.php',
        data: {
          userid: wx.getStorageSync('userId'),
          state: 1,
          task_id: tid,
        },
        success: function (res) {
          that.setData({
            canPost: res.data.status
          })
        }
      })
      api.phpRequest({
        url: 'jurisdiction.php',
        data: {
          userid: wx.getStorageSync('userId'),
          state: 2,
          task_id: tid,
        },
        success: function (res) {
          that.setData({
            canDown: res.data.status
          })
        }
      })
    }
  },

  bindSwtichNav: function (e) {
    let tab = Number(e.currentTarget.dataset.tab)
    this.setData({
      currentTab: tab
    })
  },

  navigateToPost: function () {
    wx.navigateTo({
      url: '/pages/question/question?tid=' + this.data.tid,
    })
  },

  navigateToDraft: function (e) {
    wx.navigateTo({
      url: '/pages/question/list?tid=' + this.data.tid + '&isfb=' + e.currentTarget.dataset.isfb + '&isself=1',
    })
  },

  navigateToComment: function () {
    wx.navigateTo({
      url: '/pages/comment/comment?tid=' + this.data.tid,
    })
  },

  downloadReport: function (e) {
    var that = this
    let typeId = e.currentTarget.dataset.id
    if (typeId == 1) {
      that.setData({
        fileUrl: that.data.info.file_1
      }, that.openFile)
    } else if (typeId == 0) {
      that.setData({
        fileUrl: that.data.info.file
      }, that.openFile)
    } else {
      that.setData({
        fileUrl: that.data.info.file_2
      }, that.openFile)
    }
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

  previewImage: function (e) {
    var current = e.target.dataset.src
    var imgList = this.data.info.img
    wx.previewImage({
      current: current,
      urls: imgList
    })
  },

  previewImage1: function (e) {
    var current = e.target.dataset.src
    var imgList = this.data.info.img1
    wx.previewImage({
      current: current,
      urls: imgList
    })
  },

  previewImage2: function (e) {
    var current = e.target.dataset.src
    var imgList = this.data.info.img2
    wx.previewImage({
      current: current,
      urls: imgList
    })
  },

  switchImg: function (e) {
    this.setData({
      showImg: !this.data.showImg
    })
  },

  switchImg1: function (e) {
    this.setData({
      showImg1: !this.data.showImg1
    })
  },

  switchImg2: function (e) {
    this.setData({
      showImg2: !this.data.showImg2
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})