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

    if (vm.mode === 'details') {
      vm.detailsMode = true;
    }
    
    /** If not add mode get the recipe details and set the save method to update the recipe in the DB */
    if (this.mode !== 'add') {
      function getRecipe() {
        var deferred = $q.defer();
        dataService.getRecipeById(vm.id).then(function(res) {
          vm.recipe = res.data;
          deferred.resolve(res.data.category);
        });
        return deferred.promise;
      }
      
      var promise = getRecipe();
      
      promise.then(function(category) {
        dataService.getCategories().then(function(res) {
          vm.categories = res.data;
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].name === category) {
              vm.category = res.data[i];
              watchCategory();
            }
          }
        });
      });

      if (vm.mode === 'edit') {
        promise.then(function() {
          vm.save = function() {
            dataService.updateRecipeById(vm.id, vm.recipe).then(function(res) {
              if (res.status === 200) {
                navigationService.details(vm.id);
              }
            }, errorsHandler);
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
        watchCategory();
      });

      vm.save = function() {
        dataService.addRecipe(vm.recipe).then(function() {
          vm.home()
        }, errorsHandler);
      };

    }

    /** Update the recipe.category property by the selected category */
    function watchCategory() {
      $scope.$watch(function() {
        return vm.category;
      }, function() {
        vm.recipe.category = vm.category.name;
      });
    }

    /** check for errors, if error found, push the error 'userMessage' into the errors array */
    function errorsHandler(error) {
      vm.errors = [];
      for (key in error.data.errors) {
        for (var i = 0; i < error.data.errors[key].length; i++) {
          vm.errors.push({message: error.data.errors[key][i].userMessage});
        }
      }
    }
  }]);