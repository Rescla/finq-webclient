'use strict';
/**
 * Created by marc.fokkert on 3-4-2015.
 */


describe('Unit: Sortable directive', function () {
    beforeEach(module('finqApp'));
    var element, scope;
    var collection;

    beforeEach(function () {
        collection = [['li1', 'li2'],[]];

        inject(function ($compile, $rootScope) {
            scope = $rootScope.$new();
            scope.collection1 = collection[0];
            scope.collection2 = collection[1];
            var template = '<div>' +
                '<ul id="sortable1" sortable="collection1">' +
                '   <li id="li1"></li>' +
                '   <li id="li2"></li>' +
                '</ul>' +
                '<ul id="sortable2" sortable="collection2">' +
                '</ul>' +
                '</div>';

            element = $compile(template)(scope);

            scope.$digest();
        });
    });

    //it('should correctly get the collection from element attribute', function () {
    //    expect(scope.sortable).to.equal(collection);
    //});

    it('should record the starting index of the element', function () {
        var li1 = element.find('#li1');
        var ui = {item: li1};
        scope.sortableObjectStart(undefined, ui);

        expect(li1.scope().start).is.equal(li1.index());
    });

    it('should move objects within the same sortable', inject(function (arrayOperations) {
        sinon.spy(arrayOperations, 'moveItem');

        var li1 = element.find('#li1');
        var sortable1 = element.find('#sortable1');
        var ui = {item: li1, sender: null};

        // Start sort
        scope.sortableObjectStart(undefined, ui);

        // Emulate element movement
        li1.detach().appendTo(sortable1);

        // End sort
        scope.sortableObjectEnd(undefined, ui, sortable1);

        expect(arrayOperations.moveItem).to.be.calledWith(collection[0], 0, 1);
    }));

    it('should move objects between sortables', inject(function (arrayOperations) {
        sinon.spy(arrayOperations, 'removeItem');
        sinon.spy(arrayOperations, 'insertItem');

        var li1 = element.find('#li1');
        var sortable1 = element.find('#sortable1');
        var sortable2 = element.find('#sortable2');
        var ui = {item: li1, sender: null};

        var movedElement = collection[0][0];

        // Start sort
        scope.sortableObjectStart(undefined, ui);

        // Emulate element movement
        li1.detach().appendTo(sortable2);

        // End sort (1)
        scope.sortableObjectEnd(undefined, ui, sortable1);
        ui.sender = sortable1;
        scope.sortableObjectEnd(undefined, ui, sortable2);
        scope.$digest();

        expect(arrayOperations.removeItem).to.be.calledWith(collection, 0);
        expect(arrayOperations.insertItem).to.be.calledWith(collection, 1, movedElement);


    }));


});
