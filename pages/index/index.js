var util = require("../../utils/util.js")
var api = require("../../utils/api.js")

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    showLogin: true,
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  onShow: function () {
    var that = this
    // 提示用户先进行登录
    var userBind = wx.getStorageSync('userBind')
    if (userBind) {
      this.setData({
        showLogin: false
      })
    }
    var userId = wx.getStorageSync('userId')
    var userBind = wx.getStorageSync('userBind')
    if (userBind) {
      // 发送请求获取用户信息
      api.phpRequest({
        url: 'info.php',
        data: {
          userid: userId
        },
        success: function (res) {
          getApp().globalData.userInfo = res.data
          that.setData({
            userInfo: res.data
          })
        }
      })
    } else {
      // wx.navigateTo({
      //   url: '/pages/login/login'
      // })
    }
  },

  navigateToTaskList: function (e) {
    if (this.data.showLogin) {
      wx.showToast({
        title: '尚未登录',
        icon: 'error',
      })
    } else {
      wx.navigateTo({
        url: '/pages/tasklist/tasklist?state=' + e.currentTarget.dataset.state + '&title=' + e.currentTarget.dataset.title,
      })
    }
  },

  navigateToPost: function (e) {
    if (this.data.showLogin) {
      wx.showToast({
        title: '尚未登录',
        icon: 'error',
      })
    } else {
      wx.navigateTo({
        url: '/pages/question/question',
      })
    }
  },

  navigateToStatistics: function (e) {
    if (this.data.showLogin) {
      wx.showToast({
        title: '尚未登录',
        icon: 'error',
      })
    } else {
      wx.navigateTo({
        url: '/pages/statistics/statistics?tab=' + e.currentTarget.dataset.tab,
      })
    }
  },

  navigateToPersonal: function () {
      wx.navigateTo({
        url: '/pages/personal/personal',
      })
  },

  logout: function (e) {
    wx.showModal({
      title: '温馨提示',
      content: '您确定要退出登录吗？这可能导致您不能正常使用巡检功能',
      showCancel: true,
      cancelText: '我再想想',
      confirmText: '继续退出',
      success: function (res) {
        wx.removeStorageSync('userId');
        wx.removeStorageSync('userBind');
        app.globalData.userInfo = null;
        wx.reLaunch({
          url: '../index/index'
        })
      }
    })
  }
})
