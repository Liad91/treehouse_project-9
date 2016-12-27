describe('Testing RecipesController', function() {
  var scope, ctrl, dataServiceMock, q, deferred, window;

  beforeEach(function() {
    dataServiceMock = {
      getCategories: function() {
        deferred = q.defer();
        return deferred.promise;
      },
      getRecipesByCat: function() {
        deferred = q.defer();
        return deferred.promise;
      },
      getRecipes: function() {
        deferred = q.defer();
        return deferred.promise;
      },
      deleteRecipeById: function() {
        deferred = q.defer();
        return q.resolve(true);
      }
    };
  });

  beforeEach(function() {
    module('app');
    inject(function($rootScope, $controller, $q, $window) {
      q = $q;
      window = $window;
      scope = $rootScope.$new();
      ctrl = $controller('RecipesController', {
        $scope: scope,
        dataService: dataServiceMock
      });
    });
  });

  it('should get recipes list by selected category', function() {
    spyOn(dataServiceMock, 'getRecipesByCat').and.callThrough();

    expect(ctrl.category).toBeNull();
    expect(ctrl.recipes).toBeUndefined();

    ctrl.category = 'Salad';
    
    scope.$apply();
    
    expect(dataServiceMock.getRecipesByCat).toHaveBeenCalled();
  });

  it('should get all the recipes if selected category is null', function() {
    spyOn(dataServiceMock, 'getRecipes').and.callThrough();

    ctrl.category = null;

    scope.$apply();

    expect(dataServiceMock.getRecipes).toHaveBeenCalled();
  });

  it('should delete recipe if the user clicked "OK"', function() {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(dataServiceMock, 'deleteRecipeById').and.callThrough();

    var recipe = {
      name: 'Chocolate Cake'
    };

    ctrl.recipes = ['Healthy Salad', 'Chocolate Cake'];
    ctrl.deleteRecipe(recipe, 1);
    scope.$digest();

    expect(dataServiceMock.deleteRecipeById).toHaveBeenCalled();
    expect(ctrl.recipes.length).toBe(1);
    expect(ctrl.recipes[0]).toBe('Healthy Salad');
  });
});
