import type { Report } from "@dragee-io/asserter-type";
import type { ReportBuilder } from "..";

export const JsonReportBuilder: ReportBuilder = {
    buildReports: async (reports: Report[], filePath: string) => { await Bun.write(filePath + ".json", generateJsonReports(reports)) }
}

const generateJsonReports = (reports: Report[]) => JSON.stringify(extractErrors(reports), null, 4)

const extractErrors = (reports: Report[]) => 
    reports.flatMap(report => report.errors.map((error: string) => ({
        namespace: report.namespace,
        error: error
    })));
