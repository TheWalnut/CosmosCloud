angular
	.module("cosmosCloud")
	.controller("ledgerCtrl", ["$scope", "$http","$route", function($scope, $http, $route) {
		$scope.post = {
			User: "null",
			Date: new Date(),
			Description: "",
			Cost: 0,
			idtablename: (new Date().getTime())
		}
		$scope.users = ['Alex', 'Ian', 'Jody', 'Wil', 'Jon', 'Dan']
		$scope.entries = [];
		$http.get("/SQL").success(function(data) {
			$scope.entries = data;
		})
		$scope.total = function() {
			var total = 0;
			for (var i = 0; i < $scope.entries.length; i++) {
				total += $scope.entries[i].Cost
			}
			return total;
		}
		$scope.getTotal = function(user) {
			var total = 0;
			for (var i = 0; i < $scope.entries.length; i++) {
				if ($scope.entries[i].User === user) {
					total += $scope.entries[i].Cost
				}
			}	
			return total;
		}
		$scope.owes = function(user) {
			var spent = $scope.getTotal(user);
			return -1 *(spent - ($scope.total()/6))
		}
		$scope.submitForm = function() {
			$http.post("/SQL/Transactions", $scope.post, function() {
				$scope.post = {
				}
				$route.reload();
			})
		}
		$scope.remove = function(entry) {
			$http.get("/SQL/remove/" + entry.idtablename).success(function(data) {
				$route.reload();
			})
		}
	}])