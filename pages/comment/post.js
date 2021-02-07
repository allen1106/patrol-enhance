// pages/comment/post.js
var api = require("../../utils/api.js")
var plugin = requirePlugin("WechatSI")

let manager = plugin.getRecordRecognitionManager()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tid: 0,
    status: 0,
    industryList: [{"name": "请选择专业", "industry_id": 0}],
    industryIdx: 0,
    industryId: 0,
    content1: '',
    content2: '',
    pointList: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    idx1: 2,
    idx2: 2,
    idx3: 2,
    idx4: 2,
    idx5: 2,
    idx6: 2,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    let tid = Number(options.tid)
    let status = Number(options.status)
    that.setData({
      tid: tid,
      status: status
    })
    that.fetchIndustryList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    manager.onStop = (res) => {
      that.bindInput(res.result)
    }

    manager.onStart = (res) => {
      console.log("正在聆听", res)
      wx.showToast({
        title: "正在聆听，松开结束语音",
      })
    }
    manager.onError = (res) => {
      console.log("error msg", res.msg)
      wx.showToast({
        title: '说话时间太短，请重试',
      })
    }
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

  bindIndustryChange: function (e) {
    var idx = e.detail.value
    this.setData({
      industryIdx: idx,
      industryId: this.data.industryList[idx].industry_id
    })
  },

  // 语音输入结束事件
  bindSetContent1: function (res) {
    var that = this
    that.bindInput = (res) => {
      that.setData({
        content1: res
      })
    }
    manager.start({
      lang: "zh_CN"
    })
  },

  bindSetContent2: function (res) {
    var that = this
    that.bindInput = (res) => {
      that.setData({
        content2: res
      })
    }
    manager.start({
      lang: "zh_CN"
    })
  },

  bindBackToIndex: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  submitForm: function (url, data) {
    var that = this
    // 获取到位置信息后，调用api提交表单
    api.phpRequest({
      url: url,
      data: data,
      method: 'post',
      header: {'content-type': 'application/x-www-form-urlencoded'},
      success: function (res) {
        if (res.data.status == 1) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            success: function () {
              setTimeout(that.bindBackToIndex, 1500);
            }
          })
        } else if (res.data.status == 2) {
          wx.showToast({
            title: '您已评价，无需重复评价',
            success: function () {
              setTimeout(that.bindBackToIndex, 1500);
            }
          })
        } else {
          wx.showToast({
            title: '提交失败',
            icon: 'none'
          })
        }
      }
    })
  },

  validateInfo: function (data) {
    if (!data['leixing_1']) return '产品定位'
    if (!data['leixing_2']) return '产品设计'
    if (!data['leixing_3']) return '成本适配'
    if (!data['leixing_4']) return '图纸符合'
    if (!data['leixing_5']) return '建筑质量'
    if (!data['content']) return '评语'
    if (this.data.status == 0) {
      if (!data['industry_id']) return '专业'
    }
    return 'success'
  },

  bindSubmitForm: function (e) {
    var that = this
    var value = e.detail.value

    let url = 'assess_save.php',
        data = {}
    
      data = {
        userid: wx.getStorageSync('userId'),
        task_id: that.data.tid,
        leixing_1: that.data.pointList[that.data.idx1],
        leixing_2: that.data.pointList[that.data.idx2],
        leixing_3: that.data.pointList[that.data.idx3],
        leixing_4: that.data.pointList[that.data.idx4],
        leixing_5: that.data.pointList[that.data.idx5],
        content: value.content1
      }

    if (that.data.status == 0) {
      data['industry_id'] = that.data.industryId
    } else {
      url = 'count_assess_save.php'
    }
    var valid = that.validateInfo(data)
    if (valid != "success") {
      wx.showToast({
        title: valid + '不能为空',
        icon: 'none',
      })
      return
    }
    that.submitForm(url, data)
  },

  bindIdx1Change: function (e) {
    this.setData({
      idx1: e.detail.value,
    })
  },

  bindIdx2Change: function (e) {
    this.setData({
      idx2: e.detail.value,
    })
  },

  bindIdx3Change: function (e) {
    this.setData({
      idx3: e.detail.value,
    })
  },

  bindIdx4Change: function (e) {
    this.setData({
      idx4: e.detail.value,
    })
  },

  bindIdx5Change: function (e) {
    this.setData({
      idx5: e.detail.value,
    })
  },

  bindIdx6Change: function (e) {
    this.setData({
      idx6: e.detail.value,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})