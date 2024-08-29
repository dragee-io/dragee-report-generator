import { afterEach, afterAll, describe, expect, test } from "bun:test";
import { HtmlReportBuilder } from "..";
import type { Report } from "@dragee-io/asserter-type";
import { unlinkSync, rmdirSync } from "node:fs"

const testResultDir = 'test/test-result/';
const testResultFile = testResultDir + 'testreport';

afterEach(() => {
    // Delete test file
    unlinkSync(testResultFile + '.html');
})

afterAll(() => {
    // Delete test directory
    rmdirSync(testResultDir);
})

describe('HtmlReportBuilder', () => {
    test('assert with no dragees', async () => {
        const reports: Report[] = [];
        await HtmlReportBuilder.buildReports(reports, testResultFile);
        const createdReport = await Promise.resolve(Bun.file(testResultFile + '.html').text());

        // No error, no chart, no mermaidjs
        expect(createdReport).not.toContain('error');
        expect(createdReport).not.toContain('import mermaid');  
        expect(createdReport).not.toContain('<pre class="mermaid">');
    });
    
    test('HTML with multiple reports with no errors', async () => {
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
        await HtmlReportBuilder.buildReports(reports, testResultFile);
        const createdReport = await Promise.resolve(Bun.file(testResultFile + '.html').text());

        // Charts and mermaidjs, but no error
        expect(createdReport).toContain('import mermaid');  
        expect(createdReport).toContain('<pre class="mermaid">');
        expect(createdReport).not.toContain('error');
    });

    
    test('HTML with multiple reports with errors', async () => {
        const reports: Report[] = [{
            errors: [
                'The aggregate "io.dragee.rules.relation.DrageeOne" must at least contain a "ddd/entity" type dragee',
                'The aggregate "io.dragee.rules.relation.DrageeTwo" must at least contain a "ddd/entity" type dragee'
            ],
            namespace: "ddd",
            pass: true,
            stats: {
                rulesCount: 7,
                errorsCount: 2,
                passCount: 5
            }
        },{
            errors: ["Test error"],
            namespace: "test",
            pass: true,
            stats: {
                rulesCount: 5,
                errorsCount: 1,
                passCount: 4
            }
        }];
        await HtmlReportBuilder.buildReports(reports, testResultFile);

        const createdReport = await Promise.resolve(Bun.file(testResultFile + '.html').text());

        // Charts, mermaidjs, and error list
        expect(createdReport).toContain('import mermaid');  
        expect(createdReport).toContain('<pre class="mermaid">');
        expect(createdReport).toContain('The aggregate "io.dragee.rules.relation.DrageeOne" must at least contain a "ddd/entity" type dragee');
        expect(createdReport).toContain('The aggregate "io.dragee.rules.relation.DrageeTwo" must at least contain a "ddd/entity" type dragee');
        expect(createdReport).toContain('Test error');
    });
})