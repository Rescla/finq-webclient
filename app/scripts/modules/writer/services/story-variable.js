'use strict';
/**
 * @ngdoc function
 * @name finqApp.writer.service:storyVariables
 * @description
 * # Story variable service
 *
 * Bind helper functions to a data structure with variables.
 *
 */
angular.module('finqApp.writer.service')
    .service('storyVariable', function () {
        var INPUT = 'input', OUTPUT = 'output';
        this.setupVariables = setupVariables;
        this.setupVariable = setupVariable;
        this.setupNode = setupNode;
        var rootObject;

        /**
         * Look for variables 'upwards' in an attempt to find a declaration
         * @param node
         * @param name
         * @param [first]
         */
        function lookupPreviouslyDeclaredVariable(node, name, first) {
            var i, result;
            if (first === false){
                // Check variables
                var outputVariables = node.getOutputVariables();
                for (i = 0; i < outputVariables.length; i++) {
                    var outputVariable = outputVariables[i];
                    if (outputVariable.getName() === name) {
                        return outputVariable;
                    }
                }

                // Check child elements
                var children = findChildrenProperty(node);
                if (children !== null) {
                    for (i = children.length; i > 0; i--) {
                        result = lookupPreviouslyDeclaredVariable(children[i], name, false);
                        if (result !== null) {
                            return result;
                        }
                    }
                }
            }

            // Check previous sibling
            var previousSibling = node.getPreviousSibling();
            if (previousSibling !== null) {
                result = lookupPreviouslyDeclaredVariable(previousSibling, name, false);
                if (result !== null) {
                    return result;
                }
            }

            return null;
        }

        /**
         * Look for variables 'downwards' in an attempt to figure out if this variable is used later
         * @param node
         * @param name
         * @param first
         */
        function lookupLaterReferencedVariable(node, name, first){
            var i, result;
            if (first === false){
                // Check variables
                var inputVariables = node.getInputVariables();
                for (i = 0; i < inputVariables.length; i++) {
                    var inputVariable = inputVariables[i];
                    if (inputVariable.getValue() === name) {
                        return inputVariable;
                    }
                }

                // Check child elements
                var children = findChildrenProperty(node);
                if (children !== null) {
                    for (i = 0; i < children.length; i++) {
                        result = lookupLaterReferencedVariable(children[i], name, false);
                        if (result !== null) {
                            return result;
                        }
                    }
                }
            }

            // Check previous sibling
            var nextSibling = node.getNextSibling();
            if (nextSibling !== null) {
                result = lookupLaterReferencedVariable(nextSibling, name, false);
                if (result !== null) {
                    return result;
                }
            }

            return null;
        }

        /**
         * Get all output variables for a node, can be used for type ahead
         * @param node Node to inspect
         * @returns {Array}
         */
        function getAllChildOutputVariables(node) {
            var variables = node.getOutputVariables() || [];

            var children = findChildrenProperty(node);
            if (children !== null) {
                for (var i = 0; i < children.length; i++) {
                    mergeVariables(variables, getAllChildOutputVariables(children[i]));
                }
            }
            return variables;

            function mergeVariables(array, toMerge) {
                var arrayLength = array.length;
                for (var i = 0; i < toMerge.length; i++) {
                    var updated = false;
                    for (var j = 0; j < arrayLength; j++) {
                        if (toMerge[i].getName() === array[j].getName()) {
                            array[j] = toMerge[i];
                            updated = true;
                            break;
                        }
                    }
                    if (!updated) {
                        array.push(toMerge[i]);
                    }
                }
            }
        }


        /**
         * Bind helper functions to an object structure with variables
         * @param objectWithVariables (JSON) object with a variable structure
         */
        function setupVariables(objectWithVariables) {
            rootObject = objectWithVariables;
            setupVariablesRec(rootObject, null, null, null);
        }

        /**
         * Helper function for setupVariable
         * @param objectWithVariables (JSON) object with a variable structure
         * @param previousNode Previous (JSON) object with a variable structure
         * @param nextNode Next (JSON) object with a variable structure
         * @param parent Parent object
         */
        function setupVariablesRec(objectWithVariables, previousNode, nextNode, parent) {
            var i;
            if (objectWithVariables.variables !== undefined) {
                var input = objectWithVariables.variables.input;
                var output = objectWithVariables.variables.output;

                // Set up input and output variables
                for (i = 0; i < input.length; i++) {
                    setupVariable(input[i], objectWithVariables, INPUT);
                }
                for (i = 0; i < output.length; i++) {
                    setupVariable(output[i], objectWithVariables, OUTPUT);
                }


            }

            // Recursive call
            var children = findChildrenProperty(objectWithVariables);
            if (children !== null) {
                for (i = 0; i < children.length; i++) {
                    var previousChildNode = i > 0 ? children[i - 1] : null;
                    var nextChildNode = i < children.length - 1 ? children[i + 1] : null;
                    setupVariablesRec(children[i], previousChildNode, nextChildNode, objectWithVariables);
                }
            }

            // Register methods
            setupNode(objectWithVariables, previousNode, nextNode, parent);
        }

        /**
         * Bind helper functions to a node
         * @param node An object with variables
         * @param previousNode The previous object with variables
         * @param nextNode The next object with variables
         * @param parent Parent object to be linked
         */
        function setupNode(node, previousNode, nextNode, parent) {
            node.getInputVariables = getInputVariables;
            node.getOutputVariables = getOutputVariables;
            node.addInputVariable = addInputVariable;
            node.addOutputVariable = addOutputVariable;
            node.getParent = getParent;
            node.getPreviousSibling = getPreviousSibling;
            node.getNextSibling = getNextSibling;
            node.getAvailableOutputVariables = getAvailableOutputVariables;

            node.isIncomplete = isIncomplete;

            function getInputVariables() {
                if (node.variables !== undefined) {
                    return node.variables.input;
                }
            }

            function getOutputVariables() {
                if (node.variables !== undefined) {
                    return node.variables.output;
                }
            }

            function addInputVariable(variableData) {
                setupVariable(variableData, node);
                node.variables.input.push(variableData);
            }

            function addOutputVariable(variableData) {
                setupVariable(variableData, node);
                node.variables.output.push(variableData);
            }

            function getParent() {
                return parent;
            }

            function getPreviousSibling() {
                return previousNode;
            }

            function getNextSibling() {
                return nextNode;
            }

            function getAvailableOutputVariables() {
                return getAllChildOutputVariables(node);
            }

            /**
             * Check if the node has input variables which don't resolve to a value
             * @returns {boolean}
             */
            function isIncomplete() {
                var inputVariables = getInputVariables();

                for (var i = 0; i < inputVariables.length; i++) {
                    var inputVariable = inputVariables[i];
                    if (inputVariable.isReference() && !inputVariable.isLinked()) {
                        return true;
                    }
                }
                return false;
            }
        }

        /**
         * Bind helper functions to variable
         * @param variableData Variable data
         * @param parent Parent node
         * @param inputOutput Whether a variable is input or output
         */
        function setupVariable(variableData, parent, inputOutput) {
            variableData.getValue = getValue;
            variableData.getName = getName;
            variableData.setValue = setValue;
            variableData.getReferenceVariable = getReferenceVariable;
            variableData.isLinked = isLinked;
            variableData.isReference = isReference;

            function getValue() {
                return variableData.value;
            }

            function setValue(value) {
                variableData.value = value;
            }

            function getName(){
                return variableData.name;
            }

            function getReferenceVariable() {
                if (inputOutput === INPUT){
                    return lookupPreviouslyDeclaredVariable(parent, getValue());
                } else if (inputOutput === OUTPUT){
                    return lookupLaterReferencedVariable(parent, getName());
                }
            }

            function isLinked() {
                return getReferenceVariable() !== null;
            }

            function isReference() {
                if (inputOutput === INPUT){
                    return getValue().indexOf('$') === 0;
                } else if (inputOutput === OUTPUT){
                    return false;
                }
            }
        }

        /**
         * Uses a list of known names for child properties to provide the child property
         * @param object
         * @returns {*}
         */
        function findChildrenProperty(object) {
            var childNames = ['steps', 'scenarios'];
            for (var i = 0; i < childNames.length; i++) {
                if (object[childNames[i]] !== undefined) {
                    return object[childNames[i]];
                }
            }
            return null;
        }
    });
