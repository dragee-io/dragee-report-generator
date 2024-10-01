import type { Report } from "@dragee-io/type/asserter";
import type { ReportBuilder } from "..";

export const MarkdownReportBuilder: ReportBuilder = {
    buildReports: async (reports: Report[], filePath: string) => { await Bun.write(filePath + ".md", generateMdReports(reports)) }
}

const generateMdReports = (reports: Report[]) =>  {
    if(!reports?.length) return 'Nothing to report';
    return `${reports.map(generateMermaidPieChart).join('\n')}`
}

const generateMermaidPieChart = (report: Report) => {
    return `\`\`\`mermaid
        pie showData
            title ${report.namespace} - Rules
            "Success": ${report.stats.passCount}
            "Errors": ${report.stats.errorsCount}
    \`\`\``;
}