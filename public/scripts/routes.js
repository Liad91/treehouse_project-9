angular.module('app')
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    $routeProvider
    .when('/', {
      controller: 'RecipesController',
      controllerAs: 'vm',
      templateUrl: '/templates/recipes.html'
    })
    .when('/details/:id', {
      controller: 'RecipeDetailController',
      controllerAs: 'vm',
      templateUrl: '/templates/recipe-detail.html'
    })
    .when('/edit/:id', {
      controller: 'RecipeDetailController',
      controllerAs: 'vm',
      templateUrl: '/templates/recipe-detail.html'
    })
    .when('/add', {
      controller: 'RecipeDetailController',
      controllerAs: 'vm',
      templateUrl: '/templates/recipe-detail.html'
    })
    .otherwise({
      redirectTo: '/'
    });

    /** Removing the # */
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

}]);

