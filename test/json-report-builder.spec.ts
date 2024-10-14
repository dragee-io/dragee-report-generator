import { afterAll, afterEach, describe, expect, test } from 'bun:test';
import { rmdirSync, unlinkSync } from 'node:fs';
import type { Report } from '@dragee-io/type/asserter';
import { JsonReportBuilder } from '..';

const expectedResultDir = 'test/expected-result/';
const testResultDir = 'test/test-result/';
const testResultFile = `${testResultDir}testreport`;

afterEach(() => {
    // Delete test file
    unlinkSync(`${testResultFile}.json`);
});

afterAll(() => {
    // Delete test directory
    rmdirSync(testResultDir);
});

describe('JsonReportBuilder', () => {
    test('JSON with no report', async () => {
        const reports: Report[] = [];
        await JsonReportBuilder.buildReports(reports, testResultFile);

        const createdReport = await Promise.resolve(Bun.file(`${testResultFile}.json`).text());
        expect(createdReport).toEqual('[]');
    });

    test('JSON with multiple reports with no errors', async () => {
        const reports: Report[] = [
            {
                errors: [],
                namespace: 'ddd',
                pass: true,
                stats: {
                    rulesCount: 7,
                    errorsCount: 0,
                    passCount: 7
                }
            },
            {
                errors: [],
                namespace: 'test',
                pass: true,
                stats: {
                    rulesCount: 5,
                    errorsCount: 0,
                    passCount: 5
                }
            }
        ];
        await JsonReportBuilder.buildReports(reports, testResultFile);

        const createdReport = await Promise.resolve(Bun.file(`${testResultFile}.json`).text());
        expect(createdReport).toEqual('[]');
    });

    test('JSON with multiple reports with errors', async () => {
        const reports: Report[] = [
            {
                errors: [
                    {
                        drageeName: 'io.dragee.rules.relation.DrageeOne',
                        message: 'This aggregate must at least contain a "ddd/entity" type dragee',
                        ruleId: 'ddd/aggregates-allowed-dependencies'
                    },
                    {
                        drageeName: 'io.dragee.rules.relation.DrageeTwo',
                        message: 'This aggregate must at least contain a "ddd/entity" type dragee',
                        ruleId: 'ddd/aggregates-allowed-dependencies'
                    }
                ],
                namespace: 'ddd',
                pass: true,
                stats: {
                    rulesCount: 7,
                    errorsCount: 2,
                    passCount: 5
                }
            },
            {
                errors: [
                    {
                        drageeName: 'DrageeTestError',
                        message: 'Test error',
                        ruleId: 'test-error'
                    }
                ],
                namespace: 'test',
                pass: true,
                stats: {
                    rulesCount: 5,
                    errorsCount: 1,
                    passCount: 4
                }
            }
        ];
        await JsonReportBuilder.buildReports(reports, testResultFile);

        const createdReport = await Promise.resolve(Bun.file(`${testResultFile}.json`).text());
        const expectedReport = await Promise.resolve(
            Bun.file(`${expectedResultDir}testreport.json`).text()
        );

        expect(createdReport).toEqual(expectedReport);
    });
});
