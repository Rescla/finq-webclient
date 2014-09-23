'use strict';

describe('Unit: MenuCtrl initialization', function() {

    var MenuCtrl,
        scope;

    beforeEach(module('finqApp'));
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        MenuCtrl = $controller('MenuCtrl', {
            $scope: scope
        });
    }));

    it('should initially have all main modules loaded', function () {
        expect(MenuCtrl.modules.length).to.equal(4);
        expect(MenuCtrl.modules[0].id).to.equal('REPORTER');
        expect(MenuCtrl.modules[1].id).to.equal('RUNNER');
        expect(MenuCtrl.modules[2].id).to.equal('ORGANIZER');
        expect(MenuCtrl.modules[3].id).to.equal('WRITER');
    });

    it('should initially have an empty sections list', function () {
        expect(MenuCtrl.sections).to.be.empty;
    });

    it('should initially set the active module to an empty string', function () {
        expect(MenuCtrl.activeModuleName.length).to.equal(0);
    });

    it('should initially set the module titles to an empty string', function () {
        for(var x = 0; x < MenuCtrl.modules.length; x++) {
            expect(MenuCtrl.modules[x].title.length).to.equal(0);
        }
    });

    it('should initially set the all modules to inactive', function () {
        for(var x = 0; x < MenuCtrl.modules.length; x++) {
            expect(MenuCtrl.modules[x].active).to.be.false;
        }
    });

    it('should initially have its loaded indication not set to true', function () {
        expect(MenuCtrl.loaded).not.to.be.true;
    });

});

describe('Unit: MenuCtrl receiving the first navigation event', function() {

    var MenuCtrl,
        EVENTS,
        MODULES,
        scope,
        FIRST_TARGET_MODULE = 'RUNNER',
        FIRST_TARGET_SECTION = 'RUNNER.AVAILABLE';

    beforeEach(module('finqApp'));
    beforeEach(inject(function ($controller, $rootScope, _EVENTS_, _MODULES_) {
        EVENTS = _EVENTS_;
        MODULES = _MODULES_;
        scope = $rootScope.$new();
        MenuCtrl = $controller('MenuCtrl', {
            $scope: scope
        });
        scope.$broadcast(EVENTS.SCOPE.SECTION_STATE_CHANGED,{
            module: {id : FIRST_TARGET_MODULE},
            section: {id : FIRST_TARGET_SECTION}
        });
    }));

    it('should set the active module to the target module', function() {
        for(var x = 0; x < MenuCtrl.modules.length; x++) {
            if (MenuCtrl.modules[x].id === FIRST_TARGET_MODULE) {
                expect(MenuCtrl.modules[x].active).to.be.true;
            } else {
                expect(MenuCtrl.modules[x].active).to.be.false;
            }
        }
    });

    it('should setup the sections matching to the selected module', function() {
        var activeModuleSectionCnt = Object.keys(MODULES[FIRST_TARGET_MODULE].sections).length;
        expect(MenuCtrl.sections.length).to.equal(activeModuleSectionCnt);
    });

    it('should set the active section to the target section', function() {
        for(var x = 0; x < MenuCtrl.sections.length; x++) {
            if (MenuCtrl.sections[x].id === FIRST_TARGET_SECTION) {
                expect(MenuCtrl.sections[x].active).to.be.true;
            } else {
                expect(MenuCtrl.sections[x].active).to.be.false;
            }
        }
    });

});

describe('Unit: MenuCtrl receiving two subsequent navigation events to different module', function() {

    var MenuCtrl,
        EVENTS,
        MODULES,
        scope,
        FIRST_TARGET_MODULE = 'RUNNER',
        FIRST_TARGET_SECTION = 'RUNNER.AVAILABLE',
        SECOND_TARGET_MODULE = 'WRITER',
        SECOND_TARGET_SECTION = 'WRITER.STEPS';

    beforeEach(module('finqApp'));
    beforeEach(inject(function ($controller, $rootScope, _EVENTS_, _MODULES_) {
        EVENTS = _EVENTS_;
        MODULES = _MODULES_;
        scope = $rootScope.$new();
        MenuCtrl = $controller('MenuCtrl', {
            $scope: scope
        });
        scope.$broadcast(EVENTS.SCOPE.SECTION_STATE_CHANGED,{
            module: {id : FIRST_TARGET_MODULE},
            section: {id : FIRST_TARGET_SECTION}
        });
        scope.$broadcast(EVENTS.SCOPE.SECTION_STATE_CHANGED,{
            module: {id : SECOND_TARGET_MODULE},
            section: {id : SECOND_TARGET_SECTION}
        });
    }));

    it('should set the active module to the target module', function() {
        for(var x = 0; x < MenuCtrl.modules.length; x++) {
            if (MenuCtrl.modules[x].id === SECOND_TARGET_MODULE) {
                expect(MenuCtrl.modules[x].active).to.be.true;
            } else {
                expect(MenuCtrl.modules[x].active).to.be.false;
            }
        }
    });

    it('should setup the sections matching to the selected module', function() {
        var activeModuleSectionCnt = Object.keys(MODULES[SECOND_TARGET_MODULE].sections).length;
        expect(MenuCtrl.sections.length).to.equal(activeModuleSectionCnt);
    });

    it('should set the active section to the target section', function() {
        for(var x = 0; x < MenuCtrl.sections.length; x++) {
            if (MenuCtrl.sections[x].id === SECOND_TARGET_SECTION) {
                expect(MenuCtrl.sections[x].active).to.be.true;
            } else {
                expect(MenuCtrl.sections[x].active).to.be.false;
            }
        }
    });

});

describe('Unit: MenuCtrl receiving two subsequent navigation events to different section', function() {

    var MenuCtrl,
        EVENTS,
        MODULES,
        scope,
        FIRST_TARGET_MODULE = 'RUNNER',
        FIRST_TARGET_SECTION = 'RUNNER.AVAILABLE',
        SECOND_TARGET_SECTION = 'RUNNER.RUNNING';

    beforeEach(module('finqApp'));
    beforeEach(inject(function ($controller, $rootScope, _EVENTS_, _MODULES_) {
        EVENTS = _EVENTS_;
        MODULES = _MODULES_;
        scope = $rootScope.$new();
        MenuCtrl = $controller('MenuCtrl', {
            $scope: scope
        });
        scope.$broadcast(EVENTS.SCOPE.SECTION_STATE_CHANGED,{
            module: {id : FIRST_TARGET_MODULE},
            section: {id : FIRST_TARGET_SECTION}
        });
        scope.$broadcast(EVENTS.SCOPE.SECTION_STATE_CHANGED,{
            module: {id : FIRST_TARGET_MODULE},
            section: {id : SECOND_TARGET_SECTION}
        });
    }));

    it('should set the active module to the target module', function() {
        for(var x = 0; x < MenuCtrl.modules.length; x++) {
            if (MenuCtrl.modules[x].id === FIRST_TARGET_MODULE) {
                expect(MenuCtrl.modules[x].active).to.be.true;
            } else {
                expect(MenuCtrl.modules[x].active).to.be.false;
            }
        }
    });

    it('should setup the sections matching to the selected module', function() {
        var activeModuleSectionCnt = Object.keys(MODULES[FIRST_TARGET_MODULE].sections).length;
        expect(MenuCtrl.sections.length).to.equal(activeModuleSectionCnt);
    });

    it('should set the active section to the target section', function() {
        for(var x = 0; x < MenuCtrl.sections.length; x++) {
            if (MenuCtrl.sections[x].id === SECOND_TARGET_SECTION) {
                expect(MenuCtrl.sections[x].active).to.be.true;
            } else {
                expect(MenuCtrl.sections[x].active).to.be.false;
            }
        }
    });

});
