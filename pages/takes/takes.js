// pages/takes/takes.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    number: '',
    companyData: [],
    sitesData: [],
    phone: '',
    customerInfo: {},
    siteIndex: -1,
    companyIndex: -1,
    userInfo: null,
    customerName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getSiteData();
    that.getCompanyData();

    var globalData = getApp().globalData;
    try {
      var userInfo = wx.getStorageSync('user');
      if (userInfo) {
        // Do something with return value
        this.setData({
          userInfo: userInfo
        })
      } else {
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.request({
              url: globalData.baseUrl + 'isRegisterCourier', //仅为示例，并非真实的接口地址
              method: 'POST',
              header: {
                'content-type': 'application/json' // 默认值
              },
              data: {
                code: res.code
              },
              success: function (res) {
                if (res.data.isRegister == true) {
                  that.setData({
                    userInfo: userInfo
                  })
                  wx.setStorage({
                    key: "user",
                    data: res.data.result,
                    success: function (e) {
                      console.log(e)
                    },
                  });
                } else {
                  wx.redirectTo({
                    url: '/pages/addCourier/addCourier',
                    success: function (e) {
                      console.log(e)
                    },
                    fail: function (e) {
                      console.log(e)
                    },
                    complete: function (e) {
                      console.log(e)
                    }
                  })
                }
              },
              complete: function (res) {
                console.log(res);
              }
            })
          }
        })
      }
    } catch (e) {
      // Do something when catch error
    }
  },
  onPullDownRefresh: function () {
    wx.startPullDownRefresh()
  },
  getCompanyData: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.baseUrl + 'getCompany', //仅为示例，并非真实的接口地址
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          companyData: res.data.result
        })
      },
      complete: function (res) {
        console.log(res);
      }
    })
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
        this.getCompanyByNum(res.result);
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
  setCustomerName: function (e) {
    this.setData({
      customerName: e.detail.value
    })
  },
  getCustomer: function (e) {
    var that = this;
    var data = this.data;
    if (!that.testPhone(data.phone)) {
      wx.showModal({
        title: '说明',
        content: '电话号码格式不对，请重新输入！',
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
        if (res.data.result[0]) {
          var siteID = res.data.result[0].siteID;
          var siteIndex = that.getSiteIndex(siteID);
          that.setData({
            customerInfo: res.data.result[0],
            siteIndex: siteIndex
          })
        }
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },
  getCompanyByNum: function(data) {
    var that = this;
    if (data.detail) {
      data = data.detail.value;
    }
    wx.request({
      url: getApp().globalData.baseUrl + 'getCompanyByNum', //通过快递单号获取到快递公司等
      method: 'POST',
      data: {
        LogisticCode: data
      },
      header: {
        'content-type': 'application/json' 
      },
      success: function (res) {
        var data = res.data.result[0];
        if (data) {
          that.setCompanyIndex(data);
        }
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },
  setCompanyIndex: function (data) {
    var companyData = this.data.companyData;
    for (var i = 0; i < companyData.length; i++) {
      if (companyData[i].name == data.ShipperName) {
        this.setData({
          companyIndex: i
        })
      }
    }
  },
  bindCompanyChange: function (e) {
    this.setData({
      companyIndex: e.detail.value
    })
  },
  bindSiteChange: function (e) {
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
   
    if (!data.number || !data.userInfo.id || !data.companyData[data.companyIndex] || !data.sitesData[data.siteIndex]) {
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
    if (!data.customerInfo.id) {
      var formatData = that.formatData(data);
      wx.showModal({
        title: '说明',
        content: '该客户为新客户，新增该客户并录入快递！',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            that.addCustomer(formatData);
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      }) 
      return;
    }
    var formatData = that.formatData(data);
    that.addExpressOnce(formatData)
    
  },
  addExpressOnce: function (formatData) {
    var that = this;
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
        } else {
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
  addCustomer: function (formatData) {
    var data = this.data;
    var that = this;
    var formData = {
      name: data.customerName,
      mPhone: data.phone,
      siteID: data.sitesData[data.siteIndex].id
    }
    wx.request({
      url: getApp().globalData.baseUrl + 'addUpdateCustomer', //仅为示例，并非真实的接口地址
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: formData,
      success: function (res) {
        if (res.data.result[0]) {
          wx.showToast({
            title: '客户新增成功',
            icon: 'success',
            duration: 2000
          })
          formatData.customerID = res.data.result[0].id;
          that.setData({
            customerInfo: res.data.result[0]
          })
          that.addExpressOnce(formatData);
        }else {
          wx.showToast({
            title: '客户新增失败',
            icon: 'fail',
            duration: 2000
          })
        }
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },
  formatData: function (data) {
    return {
      number: data.number,
      customerID: data.customerInfo.id,
      companyName: data.companyData[data.companyIndex].name,
      courierID: data.userInfo.id,
      siteID: data.sitesData[data.siteIndex].id,
      state: "集散中心接收快递"
    }
  },
  clearData: function () {
    this.setData({
      number: '',
      phone: '',
      customerInfo: {},
      siteIndex: -1,
      companyIndex: -1,
      customerName: ''
    })
  },
  testPhone: function (phone) {
    return /^1([3578]\d{9}|4\d{9})$/.test(phone);
  }
})