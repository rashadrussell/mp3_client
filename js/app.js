// var demoApp = angular.module('demoApp', ['demoControllers']);

var demoApp = angular.module('demoApp', ['ngRoute', 'demoControllers', 'demoServices', '720kb.datepicker']);

demoApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/settings', {
    templateUrl: 'partials/settings.html',
    controller: 'SettingsController'
  }).
    when('/users', {
    templateUrl: 'partials/users.html',
    controller: 'UsersController'
  }).
    when('/users/addUser', {
    templateUrl: 'partials/addUser.html',
    controller: 'AddUserController'
  }).
    when('/users/:id', {
    templateUrl: 'partials/userDetail.html',
    controller: 'UserDetailController'
  }).
  when('/tasks', {
    templateUrl: 'partials/tasks.html',
    controller: 'TasksController'
  }).
    when('/tasks/addTask', {
    templateUrl: 'partials/addTask.html',
    controller: 'AddTaskController'
  }).
  when('/tasks/:id', {
    templateUrl: 'partials/taskDetail.html',
    controller: 'TaskDetailController'
  }).
  when('/tasks/:id/edit', {
    templateUrl: 'partials/editTask.html',
    controller: 'EditTaskController'
  }).
  otherwise({
    redirectTo: '/settings'
  });
}]);