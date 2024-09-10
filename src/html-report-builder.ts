import type { Report, RuleError } from "@dragee-io/asserter-type";
import type { ReportBuilder } from "..";

export const HtmlReportBuilder: ReportBuilder = {
    buildReports: async (reports: Report[], filePath: string) => { await Bun.write(filePath + ".html", generateHtmlReports(reports)) }
}

const generateHtmlReports = (reports: Report[]) =>
   `<!DOCTYPE html>
    <html>
        <body>
            ${buildReportsBody(reports)}
        </body>
    </html>`;

const buildReportsBody = (reports: Report[]) => {
    if(!reports?.length) return '';
    return `
        ${reports.map(reportHtml).join('')}
        <script type="module">
            import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
        </script>`;
}

const reportHtml = (report: Report): string =>
    `<div>
    <h1>${report.namespace}</h1>
    ${generateMermaidPieChart(report)}
    ${generateErrorList(report.errors)}
    </div>
    `

const generateErrorList = (errors: RuleError[]): string => {
    const errorsList = errors.map(e => `<li>${e.drageeName}: ${e.message}</li>`).join('')
    return `<ul>${errorsList}</ul>`
}

const generateMermaidPieChart = (report: Report): string =>
    `<pre class="mermaid">
        pie showData
            title ${report.namespace} - Rules
            "Success": ${report.stats.passCount}
            "Errors": ${report.stats.errorsCount}
    </pre>`
