import type { Report, RuleError } from "@dragee-io/type/asserter";
import type { ReportBuilder } from "..";

export const JsonReportBuilder: ReportBuilder = {
    buildReports: async (reports: Report[], filePath: string) => { await Bun.write(filePath + ".json", generateJsonReports(reports)) }
}

const generateJsonReports = (reports: Report[]) => JSON.stringify(extractErrors(reports), null, 4)

const extractErrors = (reports: Report[]) => 
    reports.flatMap(report => report.errors.map((error: RuleError) => ({
        namespace: report.namespace,
        ruleId: error.ruleId,
        drageeName: error.drageeName,
        error: error.message
    })));
