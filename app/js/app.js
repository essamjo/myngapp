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



jhSys.config(function($stateProvider,$urlRouterProvider,$httpProvider,USER_ROLES){
    $httpProvider.interceptors.push([
        '$injector',
        function ($injector) {
          return $injector.get('AuthInterceptor');
        }
    ]);
    $urlRouterProvider.otherwise('/login');

    $stateProvider
    .state('login',{
        url:'/login',
        templateUrl:'/tpls/login.ng.html',
        data: {
           authorizedRoles: []
        }
    })
    .state('dashboard',{
        url:'/dashboard',
        templateUrl:'/tpls/dashboard.ng.html',
        data: {
          authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
        },
        resolve: {
            auth: function resolveAuthentication(AuthResolver) { 
              return AuthResolver.resolve();
            }
        }
    })
    .state('sample',{
        url:'/sample',
        templateUrl:'/tpls/sample.html',
        data: {
          authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
        }
    })
});

jhSys.run(function ($rootScope, AUTH_EVENTS, AuthService) {
  $rootScope.$on('$stateChangeStart', function (event, next) {    
    var authorizedRoles = next.data.authorizedRoles;
    if (!AuthService.isAuthorized(authorizedRoles)&& authorizedRoles != 0) {
      event.preventDefault();
      if (AuthService.isAuthenticated()) {
        // user is not allowed
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
      } else {
        // user is not logged in
        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
      }
    }
  });
})