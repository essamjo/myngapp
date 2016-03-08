/**
 * 
 * @authors Zhou Guanqing (essamjo@163.com)
 * @date    2016-03-07 15:56:23
 * @version $Id$
 */

var jhSys=angular.module('jhSys',['ui.router']);
jhSys.config(function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise('/sample');

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
