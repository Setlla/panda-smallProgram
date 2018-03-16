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
  bindKeyInput: function (e) {
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
        console.log(res.data)
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
    var formatData = that.formatData(that.data);

    wx.request({
      url: getApp().globalData.baseUrl + 'addExpress', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: formatData,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.isSuccess) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          });
        }else {
          wx.showToast({
            title: '该快递已扫描',
            icon: 'info',
            duration: 2000
          });
        }    
        wx.startPullDownRefresh();
      },
      fail: function () {
        wx.showToast({
          title: '失败',
          icon: 'fail',
          duration: 2000
        })
        wx.startPullDownRefresh();
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
  }
})