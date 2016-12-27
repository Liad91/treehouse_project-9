angular.module('app')
  .controller('RecipesController', ['$scope', '$window', 'dataService', 'navigationService', function($scope, $window, dataService, navigationService) {
    var vm = this;

    vm.category = null;

    vm.addRecipe = navigationService.add;

    vm.getRecipeDetails = navigationService.details;

    vm.editRecipe = navigationService.edit;

    /** Delete the recipe from the DB and update the recipes array */
    vm.deleteRecipe = function(recipe, index) {
      if ($window.confirm('Delete ' + recipe.name + '?')) {
        dataService.deleteRecipeById(recipe._id).then(function(res) {
          vm.recipes.splice(index, 1);
        });
      }
    };

    dataService.getCategories().then(function(res) {
      vm.categories = res.data;
    });
    
    /** Update the "Recipes" list by selected category */
    $scope.$watch(function() {
      return vm.category;
    }, function() {
      if (vm.category !== null) {
        dataService.getRecipesByCat(vm.category.name).then(function(res) {
          vm.recipes = res.data;
        });
      }
      else {
        dataService.getRecipes().then(function(res) {
          vm.recipes = res.data;
        });
      }
    });
  }])

  .controller('RecipeDetailController', ['$scope', '$q', '$routeParams', 'dataService', 'navigationService', function($scope, $q, $routeParams, dataService, navigationService) {
    var vm = this;
  
    vm.mode = navigationService.getMode();
    
    vm.id = $routeParams.id;

    vm.back = navigationService.back;

    vm.home = navigationService.home;

    vm.edit = navigationService.edit;

    dataService.getFoodItems().then(function(res) {
      vm.ingredients = res.data;
    });

    $scope.$watch(
      function() {
        return vm.mode
      }, function() {
      if (vm.mode === 'details') {
        vm.detailsMode = true;
      } else {
        vm.detailsMode = false;
      }
    });
    
    /** If not add mode get the recipe details and set the save method to update the recipe in the DB */
    if (vm.mode !== 'add') {
      vm.getRecipe = function() {
        var deferred = $q.defer();
        dataService.getRecipeById(vm.id).then(function(res) {
          vm.recipe = res.data;
          deferred.resolve(res.data.category);
        });
        return deferred.promise;
      }
      
      vm.promise = vm.getRecipe();
      
      vm.promise.then(
        vm.getRecipeCategory = function(category) {
          dataService.getCategories().then(function(res) {
            vm.categories = res.data;
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].name === category) {
                vm.category = res.data[i];
                vm.watchCategory();
              }
            }
          });
        }
      );

      if (vm.mode === 'edit') {
        vm.promise.then(function() {
          vm.save = function() {
            dataService.updateRecipeById(vm.id, vm.recipe).then(function(res) {
              if (res.status === 200) {
                navigationService.details(vm.id);
              }
            }, vm.errorsHandler);
          };
        });
      }
    }
    
    /** If add mode define a new recipe object and set the save method to add the recipe to the DB */
    else {
      vm.recipe = {};
      vm.recipe.ingredients = [];
      vm.recipe.steps = [];
      
      dataService.getCategories().then(function(res) {
        vm.categories = res.data;
        vm.category = res.data[0];
        vm.watchCategory();
      });

      vm.save = function() {
        dataService.addRecipe(vm.recipe).then(function() {
          vm.home()
        }, vm.errorsHandler);
      };
    }

    /** Update the recipe.category property by the selected category */
    vm.watchCategory = function() {
      $scope.$watch(function() {
        return vm.category;
      }, function() {
        vm.recipe.category = vm.category.name;
      });
    }

    /** check for errors, if error found, push the error 'userMessage' into the errors list */
    vm.errorsHandler = function(error) {
      vm.errors = [];
      for (key in error.data.errors) {
        for (var i = 0; i < error.data.errors[key].length; i++) {
          if (error.data.errors[key][i].userMessage) {
            vm.errors.push({message: error.data.errors[key][i].userMessage});
          }
        }
      }
    }
  }]);