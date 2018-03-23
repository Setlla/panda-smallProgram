//app.js
App({
  globalData: {
    baseUrl: 'https://data.yourhome.top/',
    // baseUrl: 'http://120.78.76.172:8000/',
    // baseUrl: 'http://192.168.0.103/',
  },
  onLaunch: function () {
    // 登录
    var that = this;
    that.userLogin();
    //获取站点信息
    wx.checkSession({
      success: function (e) {
        //session 未过期，并且在本生命周期一直有效
        console.log(e);
      },
      fail: function (e) {
        //登录态过期
        that.userLogin();
      }
    })
  },
  userLogin: function() {
    var that = this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: this.globalData.baseUrl + 'isRegisterCourier', //仅为示例，并非真实的接口地址
          method: 'POST',
          header: {
            'content-type': 'application/json' // 默认值
          },
          data: {
            code: res.code
          },
          success: function (res) {
            if(res.data.isRegister == true) {
              wx.setStorage({
                key: "user",
                data: res.data.result,
                success: function (e) {
                  console.log(e)
                },
              });
            }else {
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
  },
  getRegister: function(data) {
    var that = this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        data.code = res.code;
        wx.request({
          url: that.globalData.baseUrl + 'addCourierByWechat', //仅为示例，并非真实的接口地址
          method: 'POST',
          data: data,
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            that.globalData.userInfo = res.data.result;
            wx.setStorage({
              key: "user",
              data: res.data.result,
              success: function (e) {
                console.log(e)
              },
            });
            var pages = getCurrentPages();
            if (pages[0].route == "pages/addCourier/addCourier") {
              wx.showModal({
                title: '成功',
                content: '恭喜您注册成功！',
                showCancel: false,
                success: function (res) {
                  wx.switchTab({
                    url: '/pages/takes/takes',
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
              })
            }
          },
          complete: function (res) {
            console.log(res);
          }
        })
      }
    })
  },
  

})


  // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
