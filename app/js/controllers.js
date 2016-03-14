/**
 * 
 * @authors Zhou Guanqing (essamjo@163.com)
 * @date    2016-03-08 15:51:30
 * @version $Id$
 */

jhSys.controller('ApplicationController', function ($scope,USER_ROLES,AuthService) {
  $scope.currentUser = null;
  $scope.userRoles = USER_ROLES;
  $scope.isAuthorized = AuthService.isAuthorized;
 
  $scope.setCurrentUser = function (user) {
    $scope.currentUser = user;
  };
});

jhSys.controller('loginController', function ($scope, $rootScope, $state, AUTH_EVENTS, AuthService) {
  $scope.credentials = {
    username: '',
    password: ''
  };
  $scope.login = function (credentials) {
    AuthService.login(credentials).then(function (user) {
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      $scope.setCurrentUser(user);  
      $state.go('app.overview') 
      //console.log( $state)
      
    }, function () {
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
    });
  };

})

// jhSys.controller('loginController', function($scope,$http,$state,$rootScope){   

//     // 如果用户已经登录了，则立即跳转到一个默认主页上去，无需再登录
//     // if($rootScope.user.token){
//     //     $state.go($rootScope.dashboard);
//     //     return;
//     // } 
//     // process the form
    
//     $scope.processForm = function() {
//         console.log('正在请求中');
//         var pwdmd5=md5(md5($scope.user.password));
//         //var jsonpurl='http://192.168.31.171/yds/app/v1_0_0/';
//         // myUrl = "http://192.168.31.171/yds/app/v1_0_0/callback=JSON_CALLBACK&mobile=15994467675&password=14e1b600b1fd579f47433b88e8d85291";
//         // $http.jsonp(myUrl).success(
//         //     function(data){
//         //     alert(data);
//         // }
//         // ).error(function(error){
//         //     console.log(error);
//         // });
//         //$http.jsonp(jsonpurl,{'service':'User.LocalLogin','mobile':$scope.user.username,'password':pwdmd5});
//         $http({    
//             method  : 'JSONP',    
//             url     : 'http://192.168.31.171/yds/app/v1_0_0/?callback=JSON_CALLBACK',   
//             params    : {'service':'User.LocalLogin','mobile':$scope.user.username,'password':pwdmd5},  // pass in data as strings  
//             timeout : 2000

//         })
//         .then(function(response){
//             console.log('返回成功');
//             console.log(response);
//             var rspData=response.data.data;
//             if(response.data.ret!=200){
//                 console.log('系统出错，请稍后。')
//             }
//             if(rspData.code==0){
//                 //$rootScope.user.token=rspData.info.user_token;
//                 $state.go('dashboard');
//             }else 
//             if(rspData.code==1){
//                 console.log(rspData.message);
//             }else if(rspData.code==2){
//                 console.log(rspData.message)
//             }
//         }, function(response){
//             console.log('返回失败');
//             console.log(response);
//         })
    
//     };


// })

jhSys.controller('myCtrl', function($scope){
    $scope.phones = [
    {"name": "Nexus S",
     "snippet": "Fast just got faster with Nexus S."},
    {"name": "Motorola XOOM™ with Wi-Fi",
     "snippet": "The Next, Next Generation tablet."},
    {"name": "MOTOROLA XOOM™",
     "snippet": "The Next, Next Generation tablet."}
  ];
})

