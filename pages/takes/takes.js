// pages/takes/takes.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    number: '',
    computersData: [],
    sitesData: [],
    phone: '',
    customerInfo: {},
    siteIndex: -1,
    computerIndex: 0,
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getSiteData();
    try {
      var userInfo = wx.getStorageSync('user');
      if (userInfo) {
        // Do something with return value
        this.setData({
          userInfo: userInfo
        })
      } else {
        var data = {};
        getApp().getRegister(data);
      }
    } catch (e) {
      // Do something when catch error
    }
  },
  onPullDownRefresh: function () {
    wx.startPullDownRefresh()
  },
  getSiteData: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.baseUrl + 'getSite', //仅为示例，并非真实的接口地址
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          sitesData: res.data.result
        })
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },
  getExpressCodeInfo: function (e) {
    wx.scanCode({
      success: (res) => {
        this.setData({
          number: res.result
        })
        this.getComputerByNum(res.result);
      }
    })
  },
  setNumber: function (e) {
    this.setData({
      number: e.detail.value
    })
  },
  setPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  getCustomer: function (e) {
    var that = this;
    var data = this.data;
    wx.request({
      url: getApp().globalData.baseUrl + 'getCustomer', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        mPhone: data.phone
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var siteID = res.data.result[0].siteID;
        var siteIndex = that.getSiteIndex(siteID);
        that.setData({
          customerInfo: res.data.result[0],
          siteIndex: siteIndex
        })
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },
  getComputerByNum: function(data) {
    var that = this;
    if (data.detail) {
      data = data.detail.value;
    }
    wx.request({
      url: getApp().globalData.baseUrl + 'getComputerByNum', //通过快递单号获取到快递公司等
      method: 'POST',
      data: {
        LogisticCode: data
      },
      header: {
        'content-type': 'application/json' 
      },
      success: function (res) {
        that.setData({
          computersData: res.data.result
        })
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      siteIndex: e.detail.value
    })
  },
  getSiteIndex: function (siteID) {
    var sitesData = this.data.sitesData;
    for(var i = 0; i < sitesData.length; i++) {
      if(siteID == sitesData[i].id) {
        return i;
        break;
      }
    }
    return -1;
  },
  addExpress: function() {
    var that = this;
    var data = that.data;
    if (!data.number || !data.customerInfo.id || !data.computersData[data.computerIndex].ShipperName || !data.userInfo.id || !data.sitesData[data.siteIndex].id) {
      wx.showModal({
        title: '说明',
        content: '请将快递信息补充完整！',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return;
    }
    var formatData = that.formatData(data);

    wx.request({
      url: getApp().globalData.baseUrl + 'addExpress', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: formatData,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.isSuccess) {
          wx.showModal({
            title: '成功',
            content: '该快递录入成功！',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }else {
          wx.showModal({
            title: '提示',
            content: '该快递已扫描！',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }    
        that.clearData()
      },
      fail: function () {
        wx.showModal({
          title: '失败',
          content: '该快递扫描失败，请重新录入！',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        that.clearData()
      }
    })
  },
  formatData: function (data) {
    return {
      number: data.number,
      customerID: data.customerInfo.id,
      companyName: data.computersData[data.computerIndex].ShipperName,
      courierID: data.userInfo.id,
      siteID: data.sitesData[data.siteIndex].id,
      state: "集散中心接收快递"
    }
  },
  clearData: function () {
    this.setData({
      number: '',
      computersData: [],
      phone: '',
      customerInfo: {},
      siteIndex: -1,
      computerIndex: 0,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})