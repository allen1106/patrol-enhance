// pages/comment/comment.js
var api = require("../../utils/api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tid: 0,
    commentList: null,
    currentTab: 0,
    canComment: 0, // 是否可以评价
    canOverall: 0, // 是否可以总评
    canUpdate: 0,
    scoreList: [],
    count1: 0,
    count2: 0,
    count3: 0,
    count4: 0,
    count5: 0,
    count6: 0,
    count7: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    let tid = Number(options.tid)
    that.setData({
      tid: tid
    })
    api.phpRequest({
      url: 'jurisdiction.php',
      data: {
        userid: wx.getStorageSync('userId'),
        state: 7,
        task_id: tid,
      },
      success: function (res) {
        that.setData({
          canUpdate: res.data.status
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    let tid = that.data.tid
    api.phpRequest({
      url: 'project_list.php',
      data: {
        'id': tid,
      },
      success: function (res) {
        that.setData({
          info: res.data
        })
      }
    })
    // 获取项目基本信息
    api.phpRequest({
      url: 'assesslist.php',
      data: {
        userid: wx.getStorageSync('userId'),
        task_id: tid,
      },
      success: function (res) {
        that.setData({
          tid: tid,
          commentList: res.data
        })
      }
    })
    api.phpRequest({
      url: 'score.php',
      data: {
        userid: wx.getStorageSync('userId'),
        task_id: tid,
      },
      success: function (res) {
        let count1 = 0,
            count2 = 0,
            count3 = 0,
            count4 = 0,
            count5 = 0,
            count6 = 0,
            weightCount = 0,
            totalWeight = 0
        for (let i in res.data) {
          count1 += Number(res.data[i].leixing_1)
          count2 += Number(res.data[i].leixing_2)
          count3 += Number(res.data[i].leixing_3)
          count4 += Number(res.data[i].leixing_4)
          count5 += Number(res.data[i].leixing_5)
          count6 += Number(res.data[i].count_leixing)
          weightCount += Number(res.data[i].weight)
          totalWeight += Number(res.data[i].weight * res.data[i].count_leixing)
        }
        
        for (var i in that.data.scoreList) {
          // totalWeight += Number(that.data.scoreList[i].weight * that.data.scoreList[i].count_leixing)
          if (that.data.scoreList[i].id == id) {
            weight = Number(that.data.scoreList[i].weight)
          }
        }
        that.setData({
          scoreList: res.data,
          count1: count1,
          count2: count2,
          count3: count3,
          count4: count4,
          count5: count5,
          count6: count6,
          weightCount: weightCount,
          count7: (totalWeight / weightCount).toFixed(2),
        })
      }
    })
    api.phpRequest({
      url: 'jurisdiction.php',
      data: {
        userid: wx.getStorageSync('userId'),
        state: 3,
        task_id: tid,
      },
      success: function (res) {
        that.setData({
          canComment: res.data.status
        })
      }
    })
    api.phpRequest({
      url: 'jurisdiction.php',
      data: {
        userid: wx.getStorageSync('userId'),
        state: 4,
        task_id: tid,
      },
      success: function (res) {
        that.setData({
          canOverall: res.data.status
        })
      }
    })
  },

  bindSwtichNav: function (e) {
    let tab = Number(e.currentTarget.dataset.tab)
    this.setData({
      currentTab: tab
    })
  },

  navigateToPost: function (e) {
    var that = this
    wx.navigateTo({
      url: '/pages/comment/post?tid=' + that.data.tid + '&status=' + e.currentTarget.dataset.status,
    })
  },

  updateWeight: function (id) {
    var that = this
    let weight = 0
    let weightCount = 0
    let totalWeight = 0
    for (var i in that.data.scoreList) {
      weightCount += Number(that.data.scoreList[i].weight)
      totalWeight += Number(that.data.scoreList[i].weight * that.data.scoreList[i].count_leixing)
      if (that.data.scoreList[i].id == id) {
        weight = Number(that.data.scoreList[i].weight)
      }
    }
    api.phpRequest({
      url: 'weight_save.php',
      method: 'Post',
      header: {'content-type': 'application/x-www-form-urlencoded'},
      data: {
        id: id,
        userid: wx.getStorageSync('userId'),
        weight: weight
      },
      success: function (res) {
        if (res.data.status == 1) {
          wx.showToast({
            title: '更新成功',
            icon: 'success',
          })
          that.setData({
            weightCount: weightCount,
            count7: (totalWeight / weightCount).toFixed(2)
          })
        } else {
          wx.showToast({
            title: '更新失败',
            icon: 'none',
          })
        }
      }
    })
  },

  bindInputWeight: function (e) {
    var that = this
    console.log(e)
    let id = Number(e.currentTarget.dataset.id)
    for (let i in that.data.scoreList) {
      if (that.data.scoreList[i].id == id) {
        that.data.scoreList[i].weight = e.detail.value
        break
      }
    }
    that.setData({
      scoreList: that.data.scoreList
    }, () => {that.updateWeight(id)})
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})