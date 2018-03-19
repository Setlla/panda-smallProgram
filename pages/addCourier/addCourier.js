// pages/addCourier/addCourier.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    phone: '',
    siteID: null,
    code: '',
    sitesData: '',
    siteIndex: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSiteData();
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
  addCourier: function () {
    var appInstance = getApp();
    var data = this.data;
    if (!data.name || !data.phone || !data.siteIndex) {
      wx.showModal({
        title: '说明',
        content: '请将注册信息填写完整！',
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
    appInstance.getRegister(data);
  },
  getName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  getPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  getSiteID: function (e) {
    var index = parseInt(e.detail.value);
    var siteID = this.data.sitesData[index].id;
    this.setData({
      siteIndex: index,
      siteID: siteID
    })
  }
})