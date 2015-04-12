var demoControllers = angular.module('demoControllers', []);

demoControllers.controller('SettingsController', ['$scope' , '$window', function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url; 
    $scope.displayText = "URL set";

  };

}]);

demoControllers.controller('UsersController', ['$scope', '$http', 'Users', function($scope, $http, Users) {

  Users.get().success(function(data) {
    $scope.users = data.data;
  });

  $scope.removeUser = function(rmUser) {
    
    Users.remove(rmUser._id).
      success(function(data, status) {

        angular.forEach($scope.users, function(user, idx) {
          if(user._id === rmUser._id) {
            $scope.users.splice(idx, 1);
          }
        });
        
    }).
    error(function(data, status) {

    });
    
  }

}]);

demoControllers.controller('UserDetailController', ['$scope', '$location', 'Users', 'Tasks', function($scope, $location, Users, Tasks) {
  $scope.data = "";
  $scope.tasks = [];

  var userID = $location.path().substr($location.path().lastIndexOf('/')+1);

  Users.get(userID).
    success(function(data) {
      $scope.user = data.data;

      angular.forEach($scope.user.pendingTasks, function(taskID) {
        Tasks.get(taskID).
          success(function(data) {
              $scope.tasks.push(data.data);
          });
      });

    }).
    error(function(data, status) {

    });

  $scope.getData = function(){
    $scope.data = CommonData.getData();
  };

}]);

demoControllers.controller('AddUserController', ['$scope', '$http', 'Users', function($scope, $http, Users) {

  $scope.url = window.sessionStorage.baseurl + '/api/users';

  $scope.addUser = function(name, email) {
    var newUser = {"name": name, "email": email, "pendingTasks": []};
    
    Users.add(newUser). 
      success(function(data) {
        console.log(data);
      }).
      error(function(data, status) {

      });
  }

}]);


demoControllers.controller('TasksController', ['$scope', '$http', 'Tasks', '$window', '$routeParams', function($scope, $http,  Tasks, $window, $routeParams) {

  $scope.skipAmount = 0;
  $scope.whereClause = {};
  $scope.query = ['where={}', 'limit=10', 'skip=0'];
  $scope.status = "all";

  Tasks.get().
    success(function(data) {
      $scope.initTasksLen = data.data.length;
      $scope.tasks = data.data.slice(0, 10);
      $scope.skipAmount = 0;

      if($scope.skipAmount > $scope.initTasksLen) {
        $scope.hideNext = true;
      }
      $scope.hidePrev = true;
   
     
  });

  $scope.status = {"completed": false};

  $scope.updateStatus = function($event) {
    var statusQuery;

    if($event.target.value === "completed") {
      $scope.whereClause['completed'] = true;
      $scope.status = "completed";
    } else if($event.target.value === "pending") {
      $scope.whereClause['completed'] = false;
      $scope.status = "pending";
    } else {
      delete $scope.whereClause['completed'];
      $scope.status = "all";
    }    

    statusQuery = JSON.stringify($scope.whereClause);
    $scope.query[0] = "where="+statusQuery;

    Tasks.get(id=null, $scope.query.join('&')).
      success(function(data) {
        $scope.tasks = data.data;
        if($scope.skipAmount+10 > $scope.tasks.length) {
          $scope.hideNext = true;
        } else {
          $scope.hideNext = false;
        }
      });

  };


  $scope.page = 0;
  $scope.nextPage = function() {

    $scope.skipAmount+=10;
    $scope.query[2] = "skip=" + $scope.skipAmount; 


    Tasks.get(id=null, $scope.query.join('&')).
      success(function(data) {
        $scope.tasks = data.data;
      });

    if($scope.skipAmount+10 > $scope.initTasksLen) {
      $scope.hideNext = true;
      $scope.hidePrev = false;
    } else {
      $scope.hideNext = false;
      $scope.hidePrev = false;
    }
  };

  

  $scope.prevPage = function() {

    $scope.skipAmount-=10;
    $scope.query[2] = "skip=" + $scope.skipAmount; 

    Tasks.get(id=null, $scope.query.join('&')).
      success(function(data) {
        $scope.tasks = data.data;
      });

    if($scope.skipAmount - 10 < 0) {
      $scope.hidePrev = true;
      $scope.hideNext = false;
    } else {
      $scope.hidePrev = false;
      $scope.hideNext = false;
    }
  };

  $scope.removeTask = function(rmTask) {

    Tasks.remove(rmTask._id).
      success(function(data, status) {

        angular.forEach($scope.tasks, function(task, idx) {
          if(task._id === rmTask._id) {
            $scope.tasks.splice(idx, 1);
          }
        });
        
    }).
    error(function(data, status) {

    });
  };


}]);

demoControllers.controller('TaskDetailController', ['$scope', '$location', 'Tasks' , function($scope, $location, Tasks) {

  var taskID = $location.path().substr($location.path().lastIndexOf('/')+1);

  Tasks.get(taskID).
    success(function(data) {
      $scope.task = data.data;
      var date = new Date($scope.task.deadline);
      $scope.deadline = (date.getUTCMonth()+1) + '/' + date.getUTCDate() + '/' + date.getUTCFullYear();
    });

}]);

demoControllers.controller('AddTaskController', ['$scope', '$http', 'Tasks', 'Users', function($scope, $http, Tasks, Users) {
  $scope.url = window.sessionStorage.baseurl + '/api/takss';
  $scope.user = {};

  Users.get().
    success(function(data) {
        $scope.users = data.data;
    }).
    error(function(data, status) {

    });

  $scope.addTask = function(title, description, deadline, user) {

    var newTask = {
      "name": title, 
      "description": description, 
      "deadline": deadline, 
      "assignedUser": user._id, 
      "assignedUserName": user.name
    };
    
    Tasks.add(newTask). 
      success(function(data) {
        console.log(data);
      }).
      error(function(data, status) {
        
      });
    
  };

}]);

demoControllers.controller('EditTaskController', ['$scope', '$location', 'Tasks', 'Users', function($scope, $location, Tasks, Users) {
  
  var taskID = $location.path().split('/')[2];

  Tasks.get(taskID).
    success(function(data) {
      var deadline;
      $scope.task = data.data;
      
      deadline = new Date($scope.task.deadline);
      deadline = (deadline.getUTCMonth()+1) + '/' + deadline.getUTCDate() + '/' + deadline.getUTCFullYear();
      
      $scope.name = $scope.task.name;
      $scope.description = $scope.task.description;
      $scope.deadline = deadline;
      $scope.completed = $scope.task.completed;

      Users.get().success(function(data) {

        var selectedUser = "";

        angular.forEach(data.data, function(user) {
          if(user.name === $scope.task.assignedUserName) {
            selectedUser = user;
          }
        });

        $scope.users = {
          value: selectedUser || "",
          values: data.data
        }

      });
    });
  
    


    $scope.editTask = function(name, description, deadline, user, completed) {
      if(!user) {
        user = {_id: "", name: ""};
      }

      var editedTask = {
        "id": $scope.task._id,
        "name": name,
        "description": description,
        "deadline": deadline,
        "assignedUser": user._id,
        "assignedUserName": user.name,
        "completed": completed
      }

      Tasks.edit(editedTask).
        success(function(data, status) {
          console.log(data);
        });

    };

}]);




