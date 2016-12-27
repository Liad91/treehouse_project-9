describe('Testing RecipeDetailController', function() {
  var scope, ctrl, ctrlFactory, q, deferred, window, dataServiceMock;

  beforeEach(function() {
    dataServiceMock = {
			getFoodItems: function() {
				deferred = q.defer();
        return deferred.promise;
			},
      getRecipeById: function() {
        deferred = q.defer();
        return q.resolve({
          data: {category: 'test'}
        });
      },
      getCategories: function() {
        deferred = q.defer();
        return q.resolve({
          data: [
            {
              id: 1,
              name: 'Dessert'
            },
            {
              id: 2,
              name: 'Salad'
            },
            {
              id: 3,
              name: 'Soup'
            }
          ]
        });
      },
      updateRecipeById: function() {
        deferred = q.defer();
        return q.resolve({
          status: 200
        });
      },
      addRecipe: function() {
				deferred = q.defer();
        return q.resolve(true);
			}
    };

    navigationServiceMock = {
			getMode: function() {
				return 'details';
			},
      details: function() {},
      home: function() {},
    };
  });

  beforeEach(function() {
    module('app');
    inject(function($rootScope, $controller, $q, $window) {
      q = $q;
      window = $window;
      scope = $rootScope.$new();
      ctrlFactory = $controller.bind(this,'RecipeDetailController', {
        $scope: scope,
        dataService: dataServiceMock,
        navigationService: navigationServiceMock
      });
      ctrl = ctrlFactory();
    });
  });

  it('should get the mode by the url', function() {
    expect(ctrl.mode).toBe('details');
  });

  it('should watch and set the ctrl.recipe.category to equal ctrl.category.name', function() {
    ctrl.recipe = {
      category: 'Salad'
    }
    ctrl.category = {
      name: 'Vegan'
    }

    ctrl.watchCategory();

    scope.$digest();

    expect(ctrl.recipe.category).toBe('Vegan');
  });

  it('should push the error.userMessage into the errors list', function() {
    var error = {
      data: {
        errors: {
          ingredients: [
            {userMessage: 'Ingredients Item #1'},
            {userMessage: 'Ingredients Item #2'},
          ],
          name: [
            {userMessage: 'Please provide a value for "Name"'}
          ],
          steps: [
            {message: 'Please provide a non-empty array for the "steps" property'}
          ]
        }
      }
    }

    ctrl.errorsHandler(error);

    expect(ctrl.errors.length).toBe(3);
    expect(ctrl.errors[0].message).toBe('Ingredients Item #1');
    expect(ctrl.errors[1].message).toBe('Ingredients Item #2');
    expect(ctrl.errors[2].message).toBe('Please provide a value for "Name"');
  });

  describe('details mode', function() {
    it('should set "detailsMode" to true only when the url is "/details"', function() {

      scope.$digest();

      expect(ctrl.detailsMode).toBe(true);

      ctrl.mode = 'something-else';

      scope.$digest();

      expect(ctrl.detailsMode).toBe(false);
    });

    it('should get the recipe by id', function() {
      spyOn(dataServiceMock, 'getRecipeById').and.callThrough();

      scope.$digest();
      ctrl.getRecipe();

      expect(dataServiceMock.getRecipeById).toHaveBeenCalled();
      expect(ctrl.recipe).toBeDefined();
      expect(ctrl.recipe).toEqual(jasmine.objectContaining({
        category: 'test'
      }));
    });

    it('should get the recipe category', function() {
      spyOn(dataServiceMock, 'getCategories').and.callThrough();
      
      ctrl.getRecipeCategory('Salad');
      scope.$digest();

      expect(dataServiceMock.getCategories).toHaveBeenCalled();
      expect(ctrl.category).toEqual(jasmine.objectContaining({
        id: 2,
        name: 'Salad'
      }));
    });
  });

  describe('edit mode', function() {
    beforeEach(function() {
      navigationServiceMock.getMode = function() {
        return 'edit';
      }
      ctrl = ctrlFactory();
    });

    it('should be edit mode', function() {
      expect(ctrl.mode).toBe('edit');
    });

    it('ctrl.save() should update the recipe and redirect to recipe details page', function() {
      spyOn(dataServiceMock, 'updateRecipeById').and.callThrough();
      spyOn(navigationServiceMock, 'details').and.callThrough();

      scope.$digest();

      ctrl.save();

      expect(dataServiceMock.updateRecipeById).toHaveBeenCalled();

      scope.$digest();

      expect(navigationServiceMock.details).toHaveBeenCalled();
    });
  });

  describe('add mode', function() {
    beforeEach(function() {
      navigationServiceMock.getMode = function() {
        return 'add';
      }
      ctrl = ctrlFactory();
    });

    it('should be add mode', function() {
      expect(ctrl.mode).toBe('add');
    });

    it('should set the ctrl.category to the first category of the dataService.getCategories list', function() {
      spyOn(dataServiceMock, 'getCategories').and.callThrough();

      scope.$digest();

      expect(dataServiceMock.getCategories).toHaveBeenCalled();
      expect(ctrl.category).toBeDefined();
      expect(ctrl.category).toEqual(jasmine.objectContaining({
        id: 1,
        name: 'Dessert'
      }));  
    });

    it('ctrl.save() should save the recipe into the database and redirect to the home page', function() {
      spyOn(dataServiceMock, 'addRecipe').and.callThrough();
      spyOn(ctrl, 'home').and.callThrough();

      ctrl.save();

      expect(dataServiceMock.addRecipe).toHaveBeenCalled();

      scope.$digest();

      expect(ctrl.home).toHaveBeenCalled();
    });
  });
});
