
var app = angular.module("myApp", []);
app.controller("myCtrl", function($scope, $http) {

 
$http({
  method: 'GET',
  url: 'https://raw.githubusercontent.com/vega/vega/master/docs/data/movies.json'
}).then(function successCallback(response) {
  if(response && response.data) {
    $scope.imdbrev = response.data.IMDB_Rating;
    $scope.records = response.data;
    console.log($scope.records);
  }
  else{
  $scope.records = []
  }

  }, function errorCallback(response) {
    $scope.records = []
  });

  $scope.orderByMe = function(record) {
    $scope.myOrderBy = record;
}

$scope.whatClassIsIt= function(){
  if($scope.imdbrev <= 5)
         return "badge-danger"
  else ($scope.imdbrev > 5)
      return "badge-success";
  
 }



});