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
    appInstance.getRegister(this.data);
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