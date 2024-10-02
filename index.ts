import type { Report } from "@dragee-io/type/asserter";

export type ReportBuilder = {
    buildReports: (reports: Report[], filePath: string) => Promise<void>
}

export { JsonReportBuilder } from "./src/json-report-builder";
export { HtmlReportBuilder } from "./src/html-report-builder";
export { MarkdownReportBuilder } from "./src/markdown-report-builder";