describe('Testing RecipeDetailController', function() {

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
      },
			getFoodItems: function() {
				deferred = q.defer();
        return deferred.promise;
			},
      getRecipeById: function() {
        deferred = q.defer();
        return deferred.promise;
      }
    };

    navigationServiceMock = {
			getMode: function() {
				return 'details';
			}
    };
  });

  beforeEach(function() {
    module('app');
    inject(function($rootScope, $controller, $q, $window) {
      q = $q;
      window = $window;
      scope = $rootScope.$new();
      ctrl = $controller('RecipeDetailController', {
        $scope: scope,
        dataService: dataServiceMock,
        navigationService: navigationServiceMock
      });
    });
  });

	it('should get the mode by the url', function() {
		expect(ctrl.mode).toBe('details');
	});

	it('should set "detailsMode" to true only when the url is "/details"', function() {

		scope.$digest();

		expect(ctrl.detailsMode).toBe(true);

		ctrl.mode = 'something-else';

		scope.$digest();

		expect(ctrl.detailsMode).toBe(false);
	});



});
