// js/services/todos.js
angular.module('demoServices', [])
    .factory('CommonData', function(){
        var data = "";
        return{
            getData : function(){
                return data;
            },
            setData : function(newData){
                data = newData;                
            }
        }
    })
    .factory('Users', function($http, $window) {      
        return {
            get : function(id) {
                var baseUrl = $window.sessionStorage.baseurl;

                if(id) return $http.get(baseUrl+'/api/users/'+id);
                return $http.get(baseUrl+'/api/users');
            },

            add : function(newUser) {
                var url = $window.sessionStorage.baseurl + '/api/users';
                return $http.post(url, newUser);
            },

            remove : function(id) {
                var url = $window.sessionStorage.baseurl + '/api/users/' + id;
                return $http.delete(url);
            },
        }
    })
    .factory('Tasks', function($http, $window) {      
        return {
            get : function(id) {
                var baseUrl = $window.sessionStorage.baseurl;

                if(id) return $http.get(baseUrl+'/api/tasks/'+id);
                return $http.get(baseUrl+'/api/tasks');
            },

            add : function(newTask) {
                var url = $window.sessionStorage.baseurl + '/api/tasks';
                return $http.post(url, newTask);
            },

            remove : function(id) {
                var url = $window.sessionStorage.baseurl + '/api/tasks/' + id;
                return $http.delete(url);
            },

            edit : function(updatedTask) {
                var url = $window.sessionStorage.baseurl + '/api/tasks/' + updatedTask.id;
                return $http.put(url, updatedTask);
            }
        }
    });
