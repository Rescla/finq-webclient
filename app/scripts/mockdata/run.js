'use strict';

/**
 * @ngdoc overview
 * @name finqApp.mock:runningServiceMock
 * @description
 * # FinqApp Mockservice - Runningservice
 *
 * Mock the running story service backend with the functions included in this mockservice.
 */
angular.module('finqApp.mock')
    .value('runServiceMock', {
        totalCount: 2,
        page: 0,
        pageSize: 50,
        data: [
            {
                id: 45432790,
                environment: {
                    id: 1,
                    name: 'Chuck Norris'
                },
                startedBy: {
                    name: 'John Doe',
                    first: 'John',
                    last: 'Doe'
                },
                status: 'RUNNING',
                stories: [
                    {
                        id: 46421532,
                        status: 'RUNNING',
                        scenarios: [
                            {
                                id: 23452343,
                                status: 'RUNNING',
                                steps: [
                                    {status: 'RUNNING'},
                                    {status: 'RUNNING'},
                                    {status: 'RUNNING'}
                                ]
                            },
                            {
                                id: 23452345,
                                status: 'RUNNING',
                                steps: [
                                    {status: 'RUNNING'},
                                    {status: 'RUNNING'},
                                    {status: 'RUNNING'},
                                    {status: 'RUNNING'}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                id: 45432791,
                environment: {
                    id: 2,
                    name: 'Steven Seagal'
                },
                startedBy: {
                    name: 'Jane Doe',
                    first: 'Jane',
                    last: 'Doe'
                },
                status: 'RUNNING',
                stories: [
                    {
                        id: 46421532,
                        status: 'RUNNING',
                        scenarios: [
                            {
                                id: 23452343,
                                status: 'RUNNING',
                                steps: [
                                    {status: 'RUNNING'},
                                    {status: 'RUNNING'},
                                    {status: 'RUNNING'}
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    });
