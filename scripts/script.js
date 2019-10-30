
var app = angular.module("myApp", []);
app.controller("myCtrl", function($scope) {

  
  $scope.fullName = function(obj) {
    $scope.records[] = obj;
    console.log($scope.records);
  };

    var HttpClient = function() {
      this.get = function(aUrl, aCallback) {
          var anHttpRequest = new XMLHttpRequest();
          anHttpRequest.onreadystatechange = function() { 
              if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                  aCallback(anHttpRequest.responseText);
          }
    
          anHttpRequest.open( "GET", aUrl, true );            
          anHttpRequest.send( null );
      }
    }
    
    var client = new HttpClient();
    client.get('https://raw.githubusercontent.com/vega/vega/master/docs/data/movies.json', function(response) {
    
      var parsedData = JSON.parse(response);
    
      for(var i = 0; i < parsedData.length; i++) {
        var obj = parsedData[i];

        $scope.fullName(obj);   
    }
        // do something with response
    });
    
    
});