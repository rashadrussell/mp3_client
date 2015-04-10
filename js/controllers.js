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

  $scope.removeUser = function(idx) {
    var userID = $scope.users[idx]._id;

    $scope.users.splice(idx, 1);
    
    Users.remove(userID).
      success(function(data, status) {
        console.log(data);
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
      console.log($scope.user);
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


demoControllers.controller('TasksController', ['$scope', '$http', 'Tasks', '$window' , function($scope, $http,  Tasks, $window) {

  $scope.start = 0;
  $scope.end = 10;

  Tasks.get().success(function(data) {
    $scope.tasks = data.data;
    $scope.currTasks = $scope.tasks.slice($scope.start, $scope.end);
    $scope.hidePrev = true;

    if($scope.end >= $scope.tasks.length) {
      $scope.hideNext = true;
    }    
     
  });

  $scope.status="all";

  $scope.updateStatus = function($event) {
    if($event.target.value === "completed") {
      $scope.status = "compeleted";
    } else if($event.target.value === "pending") {
      scope.status = "pending";
    } else {
      scope.status = "all";
    }

  };


  $scope.page = 1;
  $scope.nextPage = function() {
    
    $scope.start += 10;
    $scope.end += 10;
    $scope.currTasks = $scope.tasks.slice($scope.start, $scope.end);

    if($scope.start+10 > $scope.tasks.length) {
      $scope.hideNext = true;
    } else {
      $scope.hidePrev = false;
      
    }
  };

  $scope.prevPage = function() {

    $scope.start -= 10;;
    $scope.end -= 10;
    $scope.currTasks = $scope.tasks.slice($scope.start, $scope.end);

    if($scope.start - 10 < 0) {
      $scope.hidePrev = true;
    } else {
      $scope.hideNext = false;
    }
  };

  $scope.removeTask = function(idx) {

    Tasks.remove($scope.tasks[idx]._id).
      success(function(status) {
        $scope.tasks.splice(idx, 1);
        console.log(status);
      }).
      error(function(status) {

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
    });
  
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


    $scope.editTask = function(name, description, deadline, user, completed) {
      console.log(user);
      if(!user) {
        user = {_id: "", name: ""};
      }

      var editedUser = {
        "id": $scope.task._id,
        "name": name,
        "description": description,
        "deadline": deadline,
        "assignedUser": user._id,
        "assignedUserName": user.name,
        "completed": completed
      }

      Tasks.edit(editedUser).
        success(function(data, status) {
          console.log(data);
        });

    };

}]);




