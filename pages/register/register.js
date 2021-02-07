// pages/register/register.js
var api = require("../../utils/api.js")
var util = require("../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    departList: [{"name": "请选择单位", "depart_id": 0}],
    departIdx: 0,
    departId: 0,
  },

  onLoad: function (e) {
    var that = this
    that.fetchDepartList()
  },

  register: function (e) {
    var that = this
    var userId = wx.getStorageSync('userId')
    var value = e.detail.value
    var tipMsg = ""
    if (!value.tel) { tipMsg="手机号不能为空" }
    if (!value.realname) { tipMsg="姓名不能为空" }
    if (value.password != value.repeatpass) { tipMsg="两次密码不一致" }
    if (!value.password) { tipMsg="密码不能为空" }
    if (that.data.departId == 0) { tipMsg="请选择单位" }
    if (tipMsg) {
      wx.showToast({
        title: tipMsg,
        icon: 'none',
      })
      return
    }
    var data = {
      'userid': userId,
      'tel': value.tel,
      'password': value.password,
      'realname': value.realname,
      'department_id': that.data.departId
    }
    console.log("提交数据")
    console.log(data)
    api.phpRequest({
      url: 'regedit.php',
      method: 'Post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: data,
      success: function(res){
        var status = Number(res.data.status)
        console.log(res);
        switch (status) {
          case 1:
            wx.setStorageSync('userId', data['userid'])
            wx.setStorageSync('userBind', 1)
            wx.showToast({
              title: '注册成功',
              icon: 'success',
            })
            wx.navigateBack({
              delta: 2
            })
            break
          case 2:
            wx.showToast({
              title: '用户名已存在',
              icon: 'none',
            })
            break
          default:
            wx.showToast({
              title: '注册失败',
              icon: 'none',
            })
        }
      },
      fail: function(){
        wx.showToast({
          title: '注册失败',
          icon: 'none',
        })
        this.onLoad();
      }
    })
  },

  navigateToLogin: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },

  fetchDepartList: function () {
    var that = this
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

  bindDepartChange: function (e) {
    var idx = e.detail.value
    var that = this
    that.setData({
      departIdx: idx,
      departId: that.data.departList[idx].department_id
    })
  },
})