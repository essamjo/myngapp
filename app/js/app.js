/**
 * 
 * @authors Zhou Guanqing (essamjo@163.com)
 * @date    2016-03-07 15:56:23
 * @version $Id$
 */

var jhSys=angular.module('jhSys',['ui.router'],function($httpProvider){
    // 头部配置  
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';  
    $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';  
    $httpProvider.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';  
  
    /**  
     * 重写angular的param方法，使angular使用jquery一样的数据序列化方式  The workhorse; converts an object to x-www-form-urlencoded serialization.  
     * @param {Object} obj  
     * @return {String}  
     */  
    var param = function (obj) {  
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;  
  
        for (name in obj) {  
            value = obj[name];  
  
            if (value instanceof Array) {  
                for (i = 0; i < value.length; ++i) {  
                    subValue = value[i];  
                    fullSubName = name + '[' + i + ']';  
                    innerObj = {};  
                    innerObj[fullSubName] = subValue;  
                    query += param(innerObj) + '&';  
                }  
            }  
            else if (value instanceof Object) {  
                for (subName in value) {  
                    subValue = value[subName];  
                    fullSubName = name + '[' + subName + ']';  
                    innerObj = {};  
                    innerObj[fullSubName] = subValue;  
                    query += param(innerObj) + '&';  
                }  
            }  
            else if (value !== undefined && value !== null)  
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';  
        }  
  
        return query.length ? query.substr(0, query.length - 1) : query;  
    };  
  
    // Override $http service's default transformRequest  
    $httpProvider.defaults.transformRequest = [function (data) {  
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;  
    }];  
});


jhSys.factory('UserInterceptor', ["$q","$rootScope",function ($q,$rootScope) {
    return {
        request:function(config){
            config.headers["TOKEN"] = $rootScope.user.token;
            return config;
        },
        responseError: function (response) {
            var data = response.data;
            // 判断错误码，如果是未登录
            if(data["errorCode"] == "500999"){
                // 清空用户本地token存储的信息，如果
                $rootScope.user = {token:""};
                // 全局事件，方便其他view获取该事件，并给以相应的提示或处理
                $rootScope.$emit("userIntercepted","notLogin",response);
            }
            // 如果是登录超时
            if(data["errorCode"] == "500998"){
                $rootScope.$emit("userIntercepted","sessionOut",response);
            }
            return $q.reject(response);
        }
    };
}]);


jhSys.config(function($stateProvider,$urlRouterProvider,$httpProvider){
    $httpProvider.interceptors.push('UserInterceptor');
    $urlRouterProvider.otherwise('/login');

    $stateProvider
    .state('login',{
        url:'/login',
        templateUrl:'/tpls/login.ng.html'
    })
    .state('dashboard',{
        url:'/dashboard',
        templateUrl:'/tpls/dashboard.ng.html'
    })
    .state('sample',{
        url:'/sample',
        templateUrl:'/tpls/sample.html'
    })
});


jhSys.run(['$rootScope', function($rootScope,$state){
    $rootScope.user={};
    $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
        if(toState.name=='login')return;// 如果是进入登录界面则允许
        // 如果用户不存在
        if(!$rootScope.user || !$rootScope.user.token){
            event.preventDefault();// 取消默认跳转行为
            $state.go("login",{from:fromState.name,w:'notLogin'});//跳转到登录界面
        }
    });
}])