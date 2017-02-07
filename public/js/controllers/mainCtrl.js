angular
	.module("cosmosCloud", ['ngRoute', 'angularFileUpload', 'ngSanitize', 'ezfb', 'ngCookies', 'angular.filter', 'ngMaterial', 'ngMessages'])
	.config(['$routeProvider', '$locationProvider', '$sceDelegateProvider', 'ezfbProvider', function($routeProvider, $locationProvider, $sceDelegateProvider, ezfbProvider) {
		/*$sceDelegateProvider.resourceUrlWhitelist(['self']);

		ezfbProvider.setInitParams({
			appId: '1563639673932807'
		})*/

		$routeProvider
			.when('/home', {
				templateUrl: '/html/home.html'
			})
			.when('/movies', {
				templateUrl: '/html/movies.html'
			})
			.when('/pictures', {
				templateUrl: '/html/pictures.html'
			})
			.when('/docs', {
				templateUrl: '/html/doc.html'
			})
			.when('/pictureUpload', {
				templateUrl: '/html/pictureUpload.html'
			})
			.when('/movieUpload', {
				templateUrl: '/html/movieUpload.html'
			})
			.when('/docUpload', {
				templateUrl: '/html/docUpload.html'
			})
			.when('/ledger', {
				templateUrl: '/html/ledger.html'
			})
			.when('/remote', {
				templateUrl: '/html/remote.html'
			})
			.when('/control', {
				templateUrl: '/html/control.html'
			})
			.when('/alarm', {
				templateUrl: '/html/alarm.html'
			})
			.otherwise({ redirectTo: '/home'});
	}])
	.filter('bytes', function() {
		return function(bytes, precision) {
			if (bytes == 0 || isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
			if (typeof precision === 'undefined') precision = 1;
			var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
				number = Math.floor(Math.log(bytes) / Math.log(1024));
			return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
		}
	})
	.controller("mainCtrl", ['$scope', '$http', '$location', 'ezfb', '$cookies', '$rootScope', function($scope, $http, $location, ezfb, $cookies, $rootScope) {
		$rootScope.user = {};
		//updateLoginStatus(updateApiMe);

		$scope.login = function() {
			ezfb.login(function (res) {
				if (res.authResponse) {
					updateLoginStatus(updateApiMe);
				}
			}, {scope: 'email,user_likes,public_profile'});
		};

		$scope.logout = function() {
			ezfb.logout(function() {
				updateLoginStatus(updateApiMe)
			})
		}


		function updateLoginStatus(more) {
			ezfb.getLoginStatus(function(res) {
				$scope.loginStatus = res;
				(more || angular.noop)();
			})
		}

		function updateApiMe() {
			ezfb.api('/me', function(res) {
				$scope.apiMe = res;
				$rootScope.user.name = res.name
				if (res.error)
					$cookies.remove("name");
				else {
					$cookies.put("name", res.name);
				}
			})
		}

		$scope.isActive = function(viewLocation) {
			var active = (viewLocation === $location.path());
			return active;
		};
		$scope.changePage = function(page) {
			$location.path('/' + page);
		}

		$scope.movieUploadPage = function() {
			$location.path("/movieUpload")
		}
		$scope.moviePage = function() {
			$location.path("/movies")
		}
		$scope.homePage = function() {
			$location.path("/home")
		}
		
		/* gets all users from database
		 * used with metadata to determine who is playing music */
		$http.get('/users').success(function(users) {
			$scope.users = users;
		})

		/* Grabs weather from wunderground - don't steal my key
		 */
		$http.get('http://api.wunderground.com/api/8f3ad647b3101ad1/conditions/q/PA/Philadelphia.json').success(function (data) {
			var weather = data.current_observation;
			$scope.time = weather.observation_epoch;
			$scope.weather = weather.weather;
			$scope.temp = weather.temp_f
			$scope.icon = weather.icon_url;
		})

		$scope.rgb = function() {
			$http.get('/rgb/toggle').success(function(data) {
				console.log("Good!");
			})
		}

		$scope.lights = function() {
			$http.get('http://10.0.0.12:8080/toggle').success(function(data) {
				console.log("okay");
			})
		}

		$scope.spook = function() {
			$http.get('http://10.0.0.12:8080/spook').success(function(data) {
				console.log("okay");
			})
		}

		$scope.night = function() {
			$http.get('/night').success(function(data) {
				console.log(data);
			})
		}
		
		/*************SHAIRPORT************/
		/* Uncomment for AirPlay metadata
		/**/
		$scope.shairport = function() {
			$http.get('/shairport/metadata').success(function(data) {
				console.log(data);
				$scope.artist = data.artist
				$scope.album = data.album
				$scope.title = data.title
				for (var i = 0; i < $scope.users.length; i++) {
					if ($scope.users[i].IP == data.user)
						$scope.user = $scope.users[i];
					//do some stuff
				}
			})
		}
		$scope.shairport();

	}]);
