'use strict';
angular.module('app')
  .service('dataService', ['$http', function($http) {
    var baseUrl = 'http://localhost:5000';

    this.getRecipes = function() {
      return $http.get(baseUrl + '/api/recipes');
    };

    this.getRecipesByCat = function(cat) {
      return $http.get(baseUrl + '/api/recipes?category=' + cat);
    };

    this.getRecipeById = function(id) {
      return $http.get(baseUrl + '/api/recipes/' + id);
    };

    this.updateRecipeById = function(id, data) {
      return $http.put(baseUrl + '/api/recipes/' + id, data);
    };

    this.addRecipe = function(data) {
      return $http.post(baseUrl + '/api/recipes', data);
    };

    this.deleteRecipeById = function(id) {
      return $http.delete(baseUrl + '/api/recipes/' + id);
    };

    this.getCategories = function() {
      return $http.get(baseUrl + '/api/categories');
    };

    this.getFoodItems = function() {
      return $http.get(baseUrl + '/api/fooditems');
    };
  }])

  .service('navigationService', ['$location', '$window', function($location, $window) {
    this.home = function() {
      $location.path('/');
    };

    this.back = function() {
      $window.history.back();
    };

    this.add = function() {
      $location.path('/add');
    };

    this.edit = function(id) {
      $location.path('/edit/' + id);
    };

    this.details = function(id) {
      $location.path('/details/' + id);
    };

    this.getMode = function() {
      return $location.url().split('/')[1];
    };
  }]);