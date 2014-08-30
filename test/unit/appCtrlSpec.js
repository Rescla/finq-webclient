//
// test/unit/controllers/app.js
//
describe("Unit: AppCtrl initialization", function() {

    var AppCtrl,
        scope;

    beforeEach(module('finqApp'));
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        AppCtrl = $controller('AppCtrl', {
            $scope: scope
        });
    }));

    it('should set an initial title for the page', function () {
        expect(AppCtrl.title).toBe('Finq');
    });

});

describe("Unit: AppCtrl receiving configuration loaded event", function() {

    var AppCtrl,
        E,
        scope,
        NEW_TITLE = 'Awesomeness';

    beforeEach(module('finqApp'));
    beforeEach(inject(function ($controller, $rootScope, EVENTS) {
        E = EVENTS;
        scope = $rootScope.$new();
        AppCtrl = $controller('AppCtrl', {
            $scope: scope
        });
        scope.$broadcast(E.CONFIG_LOADED,{
            title: NEW_TITLE
        });
    }));

    it('should update the title with the configured title', function () {
        expect(AppCtrl.title).toBe(NEW_TITLE);
    });

});

describe("Unit: AppCtrl receiving controller updated event", function() {

    var AppCtrl,
        E,
        MOD,
        scope,
        pageFactory,
        eventData;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
    });
    beforeEach(inject(function ($controller, $rootScope, EVENTS, MODULES, page) {
        E = EVENTS;
        MOD = MODULES;
        pageFactory = page;
        eventData = {
            module: MOD.RUNNER,
            section: MOD.RUNNER.sections.AVAILABLE
        };
        scope = $rootScope.$new();
        AppCtrl = $controller('AppCtrl', {
            $scope: scope
        });
        spyOn(scope, '$broadcast');
        scope.$emit(E.PAGE_CONTROLLER_UPDATED,eventData);
    }));

    it('should trigger the broadcasting of a navigation event', function () {
        expect(scope.$broadcast).toHaveBeenCalledWith(E.NAVIGATION_UPDATED,eventData);
    });

    it('should update the active module and section in the page factory', function () {
        var activeSection = pageFactory.getActiveSection();
        expect(activeSection.moduleId).toBe(MOD.RUNNER.id);
        expect(activeSection.sectionId).toBe(MOD.RUNNER.sections.AVAILABLE.id);
    });

});
