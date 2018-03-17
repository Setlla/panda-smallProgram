// pages/sites/sites.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    expressInfo: null,
    number: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  getExpressCodeInfo: function (e) {
    wx.scanCode({
      success: (res) => {
        this.setData({
          number: res.result
        })
        this.getExpressInfo(res.result);
      }
    })
  },
  getExpressInfo: function (number) {
    var that = this;
    if (number.detail) {
      number = number.detail.value;
    }
    wx.request({
      url: getApp().globalData.baseUrl + 'getListExpressDetail', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        number: number
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (!res.data.result[0]) {
          wx.showModal({
            title: '说明',
            content: '该快递尚未录入系统！',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }else {
          that.setData({
            expressInfo: res.data.result[0]
          })
        }
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },
  setNumber: function (e) {
    this.setData({
      number: e.detail.value
    })
  },
  updateExpressINSite: function (e) {
    var that = this;
    var data = that.data;
    if (!data.expressInfo || !data.userInfo) {
      wx.showModal({
        title: '提示',
        content: '请将信息填写完整！',
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
    
    var formatData = that.formatData(data.expressInfo);
    
    wx.request({
      url: getApp().globalData.baseUrl + 'updateExpress', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: formatData,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.clearData()
        if (res.data.result[0]) {
          wx.showModal({
            title: '说明',
            content: '该快递站点录入成功！',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          wx.showModal({
            title: '失败',
            content: '请重新录入！',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
        
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },
  formatData:function (data) {
    return {
      id: data.id,
      courierID: this.data.userInfo.id,
      state: '达到站点' + data.siteName
    }
  },
  clearData: function () {
    this.setData({
      expressInfo: {},
      number: ''
    })
  }  
})