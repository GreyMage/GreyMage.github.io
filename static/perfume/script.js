angular.module('main', [])

.directive('emulsifiers', function() {
	return {
		restrict: 'E',
		templateUrl: 'pages/emulsifiers.html'
	};
})

.controller('mainController', function($scope) {
		$scope.greeting = "Hello World";

		$scope.emulsifiers = [
			{
				name:"Glyceryl Stearate",
				hlb:3.8
			},
			{
				name:"Polysorbate 80",
				hlb:15
			},
			{
				name:"Ceteareth-20",
				hlb:15.2
			},
			{
				name:"Polysorbate 20",
				hlb:16.7
			},
		];
	   
});