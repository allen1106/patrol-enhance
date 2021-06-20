// pages/question/question.js
var util = require("../../utils/util.js")
var api = require("../../utils/api.js")
var plugin = requirePlugin("WechatSI")

let manager = plugin.getRecordRecognitionManager()

//index.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pid: 0, // 任务id
    id: 0,
    isFb: 0,
    isself: 0,
    taskInfo: null,
    realname: '',
    taskTime: util.formatTime(new Date()),
    question: '',
    solve: '',
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
    distributionList: [{"name": "个别", "distribution": 1}, {"name": "中", "distribution": 2}, {"name": "多", "distribution": 3}, {"name": "全区", "distribution": 4}],
    distributionIdx: 1,
    distributionId: 2,
    degreeList: [{"name": "低", "degree": 1}, {"name": "中", "degree": 2}, {"name": "高", "degree": 3}, {"name": "全盘", "degree": 4}],
    degreeIdx: 1,
    degreeId: 2,
    taskList: [{"title": "请选择巡检项目", "name": "请选择巡检项目","id": 0}],
    taskIdx: 0,
    taskId: 0,
    //最多可上传的图片数量
    count: 3,
    imageList: [],
    image1List: [],
    comments: [],
    canComment: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    let pid = Number(options.tid) || 0
    let id = Number(options.id) || 0
    let isFb = Number(options.isfb) || 0
    let isself = Number(options.isself) || 0
    that.setData({
      pid: pid,
      id: id,
      isFb: isFb,
      isself: isself,
    })
    if (id == 0) {
      let info = app.globalData.userInfo
      that.setData({
        realname: info.realname
      })
      that.fetchAreaList((res) => {
        if (app.globalData.areaIdx) {
          let areaObj = res[app.globalData.areaIdx]
          that.setData({
            areaIdx: app.globalData.areaIdx,
            areaId: areaObj.area_id
          })
        }
      })
      that.fetchIndustryList((res) => {
        if (app.globalData.industryIdx) {
          let obj = res[app.globalData.industryIdx]
          that.setData({
            industryIdx: app.globalData.industryIdx,
            industryId: obj.industry_id
          }, () => {
            that.fetchSystemList((res) => {
              if (app.globalData.systemIdx) {
                let obj = res[app.globalData.systemIdx]
                that.setData({
                  systemIdx: app.globalData.systemIdx,
                  systemId: obj.system_id
                })
              }
            })
          })
        }
      })
      that.fetchAssessList((res) => {
        if (app.globalData.assessIdx) {
          let obj = res[app.globalData.assessIdx]
          that.setData({
            assessIdx: app.globalData.assessIdx,
            assessId: obj.assess_id
          }, () => {
            that.fetchProblemList((res) => {
              if (app.globalData.problemIdx) {
                let obj = res[app.globalData.problemIdx]
                that.setData({
                  problemIdx: app.globalData.problemIdx,
                  problemId: obj.problem_id
                })
              }
            })
          })
        }
      })
      if (pid == 0) {
        that.fetchTaskList()
      }
      if (app.globalData.degreeIdx) {
        let obj = that.data.degreeList[app.globalData.degreeIdx]
        that.setData({
          degreeIdx: app.globalData.degreeIdx,
          degreeId: obj.degree
        })
      }
      if (app.globalData.distributionIdx) {
        let obj = that.data.distributionList[app.globalData.distributionIdx]
        that.setData({
          distributionIdx: app.globalData.distributionIdx,
          distributionId: obj.distribution
        })
      }
      that.setData({
        question: app.globalData.question,
        solve: app.globalData.solve,
      })
    } else if (id != 0) {
      // api.phpRequest({
      //   url: 'report_list.php',
      //   data: {
      //     id: id
      //   },
      //   success: function (res) {
      //     let taskInfo = res.data
      //     that.setData({
      //       id: id,
      //       isFb: isFb,
      //       taskInfo: taskInfo,
      //       imageList: taskInfo.imgs ? taskInfo.imgs.split(',') : [],
      //     })
      //     let areaId = taskInfo.area_id
      //     that.fetchAreaList((res) => {
      //       let areaIdx = res.findIndex((item)=>item.area_id==areaId)
      //       that.setData({
      //         areaId: areaId,
      //         areaIdx: areaIdx
      //       })
      //     })
      //     let industryId = taskInfo.industry_id
      //     that.fetchIndustryList((res) => {
      //       let industryIdx = res.findIndex((item)=>item.industry_id==industryId)
      //       that.setData({
      //         industryId: industryId,
      //         industryIdx: industryIdx
      //       }, () => {
      //         let systemId = taskInfo.system_id
      //         that.fetchSystemList((res) => {
      //           let systemIdx = res.findIndex((item)=>item.system_id==systemId)
      //           that.setData({
      //             systemId: systemId,
      //             systemIdx: systemIdx
      //           })
      //         })
      //       })
      //     })
      //     let assessId = taskInfo.assess_id
      //     that.fetchAssessList((res) => {
      //       let assessIdx = res.findIndex((item)=>item.assess_id==assessId)
      //       that.setData({
      //         assessId: assessId,
      //         assessIdx: assessIdx
      //       }, () => {
      //         let problemId = taskInfo.problem_id
      //         that.fetchProblemList((res) => {
      //           let problemIdx = res.findIndex((item)=>item.problem_id==problemId)
      //           that.setData({
      //             problemId: problemId,
      //             problemIdx: problemIdx
      //           })
      //         })
      //       })
      //     })
      //     let distribution = taskInfo.distribution
      //     let distributionIdx = that.data.distributionList.findIndex((item)=>item.distribution==distribution)
      //     that.setData({
      //       distributionId: distribution,
      //       distributionIdx: distributionIdx
      //     })
      //     let degree = taskInfo.degree
      //     let degreeIdx = that.data.degreeList.findIndex((item)=>item.degree==degree)
      //     that.setData({
      //       degreeId: degree,
      //       degreeIdx: degreeIdx
      //     })
      //   }
      // })
      api.phpRequest({
        url: 'jurisdiction.php',
        data: {
          userid: wx.getStorageSync('userId'),
          state: 2,
          task_id: pid,
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
          state: 8,
          task_id: pid,
        },
        success: function (res) {
          that.setData({
            canReject: res.data.status
          })
        }
      })
    }
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
      wx.showToast({
        title: "正在聆听，松开结束语音",
      })
    }
    manager.onError = (res) => {
      wx.showToast({
        title: '说话时间太短，请重试',
      })
    }
    if (that.data.id != 0) {
      api.phpRequest({
        url: 'report_list.php',
        data: {
          id: that.data.id
        },
        success: function (res) {
          let taskInfo = res.data
          that.setData({
            id: that.data.id,
            isFb: that.data.isFb,
            taskInfo: taskInfo,
            imageList: taskInfo.imgs ? taskInfo.imgs.split(',') : [],
          })
          let areaId = taskInfo.area_id
          that.fetchAreaList((res) => {
            let areaIdx = res.findIndex((item)=>item.area_id==areaId)
            that.setData({
              areaId: areaId,
              areaIdx: areaIdx
            })
          })
          let industryId = taskInfo.industry_id
          that.fetchIndustryList((res) => {
            let industryIdx = res.findIndex((item)=>item.industry_id==industryId)
            that.setData({
              industryId: industryId,
              industryIdx: industryIdx
            }, () => {
              let systemId = taskInfo.system_id
              that.fetchSystemList((res) => {
                let systemIdx = res.findIndex((item)=>item.system_id==systemId)
                that.setData({
                  systemId: systemId,
                  systemIdx: systemIdx
                })
              })
            })
          })
          let assessId = taskInfo.assess_id
          that.fetchAssessList((res) => {
            let assessIdx = res.findIndex((item)=>item.assess_id==assessId)
            that.setData({
              assessId: assessId,
              assessIdx: assessIdx
            }, () => {
              let problemId = taskInfo.problem_id
              that.fetchProblemList((res) => {
                let problemIdx = res.findIndex((item)=>item.problem_id==problemId)
                that.setData({
                  problemId: problemId,
                  problemIdx: problemIdx
                })
              })
            })
          })
          let distribution = taskInfo.distribution
          let distributionIdx = that.data.distributionList.findIndex((item)=>item.distribution==distribution)
          that.setData({
            distributionId: distribution,
            distributionIdx: distributionIdx
          })
          let degree = taskInfo.degree
          let degreeIdx = that.data.degreeList.findIndex((item)=>item.degree==degree)
          that.setData({
            degreeId: degree,
            degreeIdx: degreeIdx
          })
        }
      })
      api.phpRequest({
        url: 'evaluate_list.php',
        data: {
          report_id: that.data.id,
        },
        success: function (res) {
          for (var i in res.data) {
            res.data[i].evaluate_imgs = res.data[i].evaluate_imgs && res.data[i].evaluate_imgs.split(',')
          }
          that.setData({
            comments: res.data,
          })
        }
      })
    }
  },

  onUnload: function () {
    var that = this
    if (that.data.id == 0) {
      app.globalData.question = that.data.question
      app.globalData.solve = that.data.solve
    }
  },

  fetchTaskList: function () {
    let that = this
    api.phpRequest({
      url: 'task.php',
      data: {
        userid: wx.getStorageSync('userId'),
        state: 6
      },
      success: function (res) {
        var list = res.data
        console.log(list.length)
        if (list.length > 0) {
          for (var i in list) {
            list[i].name = list[i].xmmc + list[i].title
          }
          list = that.data.taskList.concat(list)
          console.log(list.length)
          that.setData({
            taskList: list,
            taskIdx: 1,
            taskId: list[1].id
          })
        }
      }
    })
  },

  fetchAreaList: function (fn) {
    var that = this
    // 获取区段信息
    api.phpRequest({
      url: 'area.php',
      success: function (res) {
        var list = res.data
        list = that.data.areaList.concat(list)
        that.setData({
          areaList: list
        }, () => {
          if (fn) {fn(list)}
        })
      }
    })
  },

  fetchIndustryList: function (fn) {
    var that = this
    // 获取专业信息
    api.phpRequest({
      url: 'industry.php',
      success: function (res) {
        var list = res.data
        list = that.data.industryList.concat(list)
        that.setData({
          industryList: list
        }, () => {
          if (fn) {fn(list)}
        })
      }
    })
  },

  fetchSystemList: function (fn) {
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
        }, () => {
          if (fn) {fn(list)}
        })
      }
    })
  },

  fetchAssessList: function (fn) {
    var that = this
    // 获取评价维度信息
    api.phpRequest({
      url: 'assess.php',
      success: function (res) {
        var list = res.data
        list = that.data.assessList.concat(list)
        that.setData({
          assessList: list
        }, () => {
          if (fn) {fn(list)}
        })
      }
    })
  },

  fetchProblemList: function (fn) {
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
        }, () => {
          if (fn) {fn(list)}
        })
      }
    })
  },

  bindTaskChange: function (e) {
    var idx = e.detail.value
    var that = this
    that.setData({
      taskIdx: idx,
      taskId: that.data.taskList[idx].id
    })
  },

  bindAreaChange: function (e) {
    var idx = e.detail.value
    var that = this
    that.setData({
      areaIdx: idx,
      areaId: that.data.areaList[idx].area_id
    }, () => {
      app.globalData.areaIdx = idx
    })
  },

  bindIndustryChange: function (e) {
    var that = this
    var idx = e.detail.value
    this.setData({
      industryIdx: idx,
      industryId: this.data.industryList[idx].industry_id
    }, () => {
      app.globalData.industryIdx = idx
      if (that.data.industryIdx != 0) {
        that.initSystemList(that.fetchSystemList)
      } else {
        that.initSystemList()
      }
    })
  },

  bindSystemChange: function (e) {
    var idx = e.detail.value
    var that = this
    that.setData({
      systemIdx: idx,
      systemId: this.data.systemList[idx].system_id
    }, () => {
      app.globalData.systemIdx = idx
    })
  },

  bindAssessChange: function (e) {
    var idx = e.detail.value
    var that = this
    that.setData({
      assessIdx: idx,
      assessId: that.data.assessList[idx].assess_id
    }, () => {
      app.globalData.assessIdx = idx
      if (that.data.assessIdx != 0) {
        that.initProblemList(that.fetchProblemList)
      } else {
        that.initProblemList()
      }
    })
  },

  bindProblemChange: function (e) {
    var idx = e.detail.value
    var that = this
    that.setData({
      problemIdx: idx,
      problemId: this.data.problemList[idx].problem_id
    }, () => {
      app.globalData.problemIdx = idx
    })
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

  // 图片上传预览和删除
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: that.data.count - that.data.imageList.length,
      success: function (res) {
        that.setData({
          imageList: that.data.imageList.concat(res.tempFilePaths)
        })
      }
    })
  },

  chooseImage1: function (e) {
    var that = this;
    wx.chooseImage({
      count: that.data.count - that.data.image1List.length,
      success: function (res) {
        that.setData({
          image1List: that.data.image1List.concat(res.tempFilePaths)
        })
      }
    })
  },


  previewImage: function (e) {
    var current = e.target.dataset.src
    var imgList = this.data.imageList
    wx.previewImage({
      current: current,
      urls: imgList
    })
  },

  previewImage1: function (e) {
    var current = e.target.dataset.src
    var imgList = this.data.image1List
    wx.previewImage({
      current: current,
      urls: imgList
    })
  },


  delImg: function (e) {
    var current = e.target.dataset.src
    var imgList = this.data.imageList
    var idx = imgList.indexOf(current)
    imgList.splice(idx, 1)
    this.setData({
      imageList: imgList
    })
  },

  delImg1: function (e) {
    var current = e.target.dataset.src
    var imgList = this.data.image1List
    var idx = imgList.indexOf(current)
    imgList.splice(idx, 1)
    this.setData({
      image1List: imgList
    })
  },

  // 语音输入开始事件
  bindTouchUp: function () {
    manager.stop()
    wx.showToast({
      title: '正在解析……',
      icon: 'loading',
      duration: 2000
    })
  },

  // 表单输入事件
  bindDegreeChange: function (e) {
    var idx = e.detail.value
    var that = this
    that.setData({
      degreeIdx: idx,
      degreeId: this.data.degreeList[idx].degree
    }, () => {
      app.globalData.degreeIdx = idx
    })
  },

  bindDistributionChange: function (e) {
    var idx = e.detail.value
    var that = this
    that.setData({
      distributionIdx: idx,
      distributionId: this.data.distributionList[idx].distribution
    }, () => {
      app.globalData.distributionIdx = idx
    })
  },

  bindInputRealname: function (e) {
    this.setData({
      realname: e.detail.value
    })
  },
  
  bindInputTaskTime: function (e) {
    this.setData({
      taskTime: e.detail.value
    })
  },
  
  bindInputQuestion: function (e) {
    this.setData({
      question: e.detail.value
    })
  },
  
  bindInputSolve: function (e) {
    this.setData({
      solve: e.detail.value
    })
  },

  bindSetReject: function (e) {
    this.setData({
      reject: e.detail.value
    })
  },

  // 语音输入结束事件
  bindSetQuestion: function (res) {
    var that = this
    that.bindInput = (res) => {
      that.setData({
        question: res
      })
    }
    manager.start({
      lang: "zh_CN"
    })
  },
  
  bindSetSolve: function (res) {
    var that = this
    that.bindInput = (res) => {
      that.setData({
        solve: res
      })
    }
    manager.start({
      lang: "zh_CN"
    })
  },

  uploadImg: function (url, data) {
    var that = this
    var uploadedImgs = [],
        imgs = this.data.imageList
    for (var i in imgs) {
      if (imgs[i].startsWith(api.HTTP_HOST)) {
        uploadedImgs.push(imgs.splice(i, 1))
      }
    }
    var allImgs = imgs
    if (allImgs.length == 0) {
      data['imgs'] = uploadedImgs
      that.submitForm(url, data)
    } else {
      var i = 0
      that.uploadSingleImg(i, uploadedImgs, imgs, allImgs, url, data)
    }
  },

  uploadSingleImg: function (i, uploadedImgs, imgs, allImgs, url, data) {
    var that = this
    wx.uploadFile({
      url: api.API_HOST + "fileup.php",
      filePath: allImgs[i],
      name: 'imgs',
      success: function (res) {
        if (typeof(res.data) != Object) {
          res.data = res.data.replace("\ufeff", "")
        }
        res.data = JSON.parse(res.data)
        if (res.statusCode != 200) {
          wx.showModal({
            title: '提示',
            content: '上传失败',
            showCancel: false
          })
          return;
        } else {
          switch (res.data.status) {
            case 1:
              uploadedImgs.push(res.data.imgpath)
              if (i >= allImgs.length - 1) {
                data['imgs'] = uploadedImgs
                that.submitForm(url, data)
              } else {
                i++
                that.uploadSingleImg(i, uploadedImgs, imgs, allImgs, url, data)
              }
              break
            default:
              wx.showModal({
                title: '提示',
                content: '上传失败',
                showCancel: false
              })
              return
          }
        }
      },
      complete: function () {
        wx.hideToast();  //隐藏Toast
      }
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
          // 记忆提交信息，方便下次使用
          app.globalData.question = ''
          app.globalData.solve = ''
          that.setData({
            question: '',
            solve: '',
          })
          wx.showToast({
            title: '提交成功',
            icon: 'success',
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
    if (!data['task_id']) return '任务'
    if (!data['area_id']) return '区域'
    if (!data['industry_id']) return '专业'
    // if (!data['system_id']) return '系统'
    if (!data['assess_id']) return '评价维度'
    if (!data['problem_id']) return '缺陷类别'
    if (!data['question']) return '问题描述'
    if (!data['solve']) return '整改建议'
    if (!data['distribution']) return '数量分布'
    if (!data['degree']) return '影响程度'
    return 'success'
  },

  validateInfo1: function (data) {
    if (!data['question']) return '问题描述'
    return 'success'
  },

  bindSubmitForm: function (e) {
    var value = e.detail.value
    var btnId = e.detail.target.dataset.id
    var that = this
    if (btnId == "2") {
      that.handleSuccess()
      return
    }
    if (btnId == "3") {
      that.handleReject()
      return
    }
    if (btnId == "4") {
      that.handleDelete()
      return
    }

    var url = btnId == 1 ? 'report_submit.php' : 'report_save.php'
    var data = {
      userid: wx.getStorageSync('userId'),
      task_id: that.data.pid || that.data.taskId,
      task_time: value.taskTime,
      area_id: that.data.areaId,
      industry_id: that.data.industryId,
      system_id: that.data.systemId,
      assess_id: that.data.assessId,
      problem_id: that.data.problemId,
      question: value.question,
      solve: value.solve,
      distribution: that.data.distributionId,
      degree: that.data.degreeId,
      report_id: that.data.id,
    }
    var valid = 'success'
    if (btnId == 1) {
      valid = that.validateInfo(data)
    } else {
      valid = that.validateInfo1(data)
    }
    if (valid != "success") {
      wx.showToast({
        title: valid + '不能为空',
        icon: 'none',
      })
      return
    }
    // 获取位置信息，如果没有弹出提示框
    wx.getSetting({
      success: function (res) {
        wx.getLocation({
          type: 'gcj02',
          altitude: true,//高精度定位
          //定位成功，更新定位结果
          success (res) {
            data['lng'] = res.longitude,
            data['lat'] = res.latitude
            that.uploadImg(url, data)
            // }
          },
          //定位失败回调
          fail: function () {
            wx.showModal({
              title: '警告',
              content: '您没有授权获取位置信息，将无法提交报告。请10分钟后再次点击授权，或者删除小程序重新进入。',
              showCancel: false,
              confirmText: '我知道了'
            })
          },
          complete: function () {
            //隐藏定位中信息进度
            wx.hideLoading()
          }
        })
      }
    })
  },

  bindBackToIndex: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  bindSubmitComment: function (e) {
    var that = this
    console.log(e)
    let value = e.detail.value
    let submitType = Number(e.detail.target.dataset.id)
    let data = null
    if (submitType == 1) {
      if (!value.comment) {
        wx.showToast({
          title: '请输入回复内容',
          icon: 'none',
        })
        return
      }
      data = {
        'userid': wx.getStorageSync('userId'),
        'report_id': that.data.id,
        'content': value.comment,
      }
    } else if (submitType == 2) {
      if (!value.reject) {
        wx.showToast({
          title: '请输入驳回原因',
          icon: 'none',
        })
        return
      }
      data = {
        'userid': wx.getStorageSync('userId'),
        'report_id': that.data.id,
        'content': value.reject,
        'flag': 2
      }
    } else {
      data = {
        'userid': wx.getStorageSync('userId'),
        'report_id': that.data.id,
        'flag': 1
      }
    }
    api.phpRequest({
      url:  submitType == 1 ? 'evaluate_save.php' : 'report_result.php',
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
        } else {
          wx.showToast({
            title: '提交失败',
            icon: 'none'
          })
        }
      }
    })
  },

  bindUpdate: function () {
    wx.navigateTo({
      url: '/pages/question/question?id=' + this.data.id + '&isfb=0' + '&tid=' + this.data.pid + '&isself=' + this.data.isself,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})