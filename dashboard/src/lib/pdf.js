import jsPDF from "jspdf";
import { contributionTrend, groupStats, loanHistory, memberContributions } from "./data";

export function exportMeetingReport() {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("PayLoop Meeting Report", 18, 20);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 18, 28);

  doc.setFontSize(13);
  doc.text("Group Snapshot", 18, 42);
  groupStats.forEach((stat, index) => {
    doc.setFontSize(10);
    doc.text(`${stat.label}: ${stat.value} (${stat.helper})`, 18, 52 + index * 7);
  });

  doc.setFontSize(13);
  doc.text("Contribution Trend", 18, 88);
  contributionTrend.forEach((item, index) => {
    doc.setFontSize(10);
    doc.text(`${item.month}: KES ${item.amount.toLocaleString()}`, 18, 98 + index * 6);
  });

  doc.setFontSize(13);
  doc.text("Top Contributors", 110, 88);
  memberContributions.forEach((item, index) => {
    doc.setFontSize(10);
    doc.text(`${item.name}: KES ${item.amount.toLocaleString()}`, 110, 98 + index * 6);
  });

  doc.setFontSize(13);
  doc.text("Loan Review", 18, 142);
  loanHistory.forEach((loan, index) => {
    doc.setFontSize(10);
    doc.text(
      `#${loan.id} ${loan.borrower} - KES ${loan.amount.toLocaleString()} - ${loan.status} - ${loan.purpose}`,
      18,
      152 + index * 7,
    );
  });

  doc.save("payloop-meeting-report.pdf");
}
