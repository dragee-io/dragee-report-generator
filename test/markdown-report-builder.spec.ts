import { afterEach, afterAll, describe, expect, test } from "bun:test";
import { MarkdownReportBuilder } from "..";
import type { Report } from "@dragee-io/asserter-type";
import { unlinkSync, rmdirSync } from "node:fs"

const expectedResultDir = 'test/expected-result/';
const testResultDir = 'test/test-result/';
const testResultFile = testResultDir + 'testreport';

afterEach(() => {
    // Delete test file
    unlinkSync(testResultFile + '.md');
})

afterAll(() => {
    // Delete test directory
    rmdirSync(testResultDir);
})

describe('MarkdownReportBuilder', () => {
    test('assert with no dragees', async () => {
        const reports: Report[] = [];
        await MarkdownReportBuilder.buildReports(reports, testResultFile);
        const createdReport = await Promise.resolve(Bun.file(testResultFile + '.md').text());

        // Nothing in the file
        expect(createdReport).toBe('Nothing to report');
    });
    
    test('Markdown with multiple reports with no errors', async () => {
        const reports: Report[] = [{
            errors: [],
            namespace: "ddd",
            pass: true,
            stats: {
                rulesCount: 7,
                errorsCount: 0,
                passCount: 7
            }
        },{
            errors: [],
            namespace: "test",
            pass: true,
            stats: {
                rulesCount: 5,
                errorsCount: 0,
                passCount: 5
            }
        }];
        await MarkdownReportBuilder.buildReports(reports, testResultFile);
        const createdReport = replaceWhitespaces(await Promise.resolve(Bun.file(testResultFile + '.md').text()));
        const expectedReport = replaceWhitespaces(await Promise.resolve(Bun.file(expectedResultDir + 'testreport_noerror.md').text()));
        
        expect(createdReport).toEqual(expectedReport);  
    });
    
    test('JSON with multiple reports with errors', async () => {
        const reports: Report[] = [{
            errors: [
                {
                    drageeName: 'io.dragee.rules.relation.DrageeOne',
                    message: 'This aggregate must at least contain a "ddd/entity" type dragee',
                    ruleId: 'ddd/aggregates-allowed-dependencies'
                },{
                    drageeName: 'io.dragee.rules.relation.DrageeTwo',
                    message: 'This aggregate must at least contain a "ddd/entity" type dragee',
                    ruleId: 'ddd/aggregates-allowed-dependencies'
                }
            ],
            namespace: "ddd",
            pass: true,
            stats: {
                rulesCount: 7,
                errorsCount: 2,
                passCount: 5
            }
        },{
            errors: [{
                drageeName: 'DrageeTestError',
                message: 'Test error',
                ruleId: 'test-error'
            }],
            namespace: "test",
            pass: true,
            stats: {
                rulesCount: 5,
                errorsCount: 1,
                passCount: 4
            }
        }];
        await MarkdownReportBuilder.buildReports(reports, testResultFile);

        const createdReport = replaceWhitespaces(await Promise.resolve(Bun.file(testResultFile + '.md').text()));
        const expectedReport = replaceWhitespaces(await Promise.resolve(Bun.file(expectedResultDir + 'testreport_witherrors.md').text()));
        
        expect(createdReport).toEqual(expectedReport);  
    });
})

const replaceWhitespaces = (str: string) => str.replace(/\s+/g, " ");