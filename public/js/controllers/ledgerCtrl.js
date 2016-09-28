angular
	.module("cosmosCloud")
	.controller("ledgerCtrl", ["$scope", "$http","$route", "$rootScope", function($scope, $http, $route, $rootScope) {
		var name = ""
		if ($rootScope.user.name)
			name = $rootScope.user.name.split(" ")[0]
		$scope.post = {
			User: name,
			Date: new Date(),
			Description: "",
			Cost: 0,
		}
		$scope.users = ['Alex', 'Ian', 'Jody', 'Wil', 'Jon', 'Daniel']
		$scope.entries = [];
		$http.get("/ledger/SQL").success(function(data) {
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
			$http.post("/SQL/Transactions", $scope.post).success( function() {
				$route.reload();
			})
		}
		$scope.remove = function(entry) {
			$http.get("/SQL/remove/" + entry.ID).success(function(data) {
				$route.reload();
			})
		}
	}])
