import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { JobRequisition } from "@/hooks/useJobRequisitions";
import { format } from "date-fns";
import { th } from "date-fns/locale";

// Add Thai font support (using a basic fallback)
const addThaiFont = (doc: jsPDF) => {
  // Note: For production, you'd want to embed a proper Thai font
  // This is a simplified version
  doc.setFont("helvetica");
};

export const exportRequisitionsPDF = (requisitions: JobRequisition[]) => {
  const doc = new jsPDF();
  
  addThaiFont(doc);

  // Title
  doc.setFontSize(18);
  doc.text("Job Requisitions Report", 14, 20);
  
  // Date
  doc.setFontSize(10);
  doc.text(`Generated: ${format(new Date(), "d MMMM yyyy HH:mm", { locale: th })}`, 14, 28);

  // Summary
  const totalRequisitions = requisitions.length;
  const pendingCount = requisitions.filter(r => r.status === "pending").length;
  const approvedCount = requisitions.filter(r => r.status === "approved").length;
  const rejectedCount = requisitions.filter(r => r.status === "rejected").length;

  doc.setFontSize(12);
  doc.text("Summary", 14, 38);
  doc.setFontSize(10);
  doc.text(`Total: ${totalRequisitions} | Pending: ${pendingCount} | Approved: ${approvedCount} | Rejected: ${rejectedCount}`, 14, 44);

  // Table
  const tableData = requisitions.map(req => [
    req.requisition_number,
    req.department,
    req.position,
    req.quantity.toString(),
    format(new Date(req.date_needed), "dd/MM/yyyy"),
    req.status === "pending" ? "Pending" : req.status === "approved" ? "Approved" : "Rejected",
    req.requester?.name || "N/A",
  ]);

  autoTable(doc, {
    startY: 50,
    head: [["Req. No.", "Department", "Position", "Qty", "Date Needed", "Status", "Requested By"]],
    body: tableData,
    styles: {
      font: "helvetica",
      fontSize: 9,
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 30 },
      2: { cellWidth: 35 },
      3: { cellWidth: 15 },
      4: { cellWidth: 25 },
      5: { cellWidth: 25 },
      6: { cellWidth: 30 },
    },
  });

  // Save
  doc.save(`job-requisitions-${format(new Date(), "yyyy-MM-dd")}.pdf`);
};

export const exportRequisitionDetailPDF = (
  requisition: JobRequisition,
  approvals: Array<{
    id: string;
    action: string;
    comment?: string;
    created_at: string;
    approver?: { name: string };
  }>
) => {
  const doc = new jsPDF();
  
  addThaiFont(doc);

  let yPos = 20;

  // Title
  doc.setFontSize(18);
  doc.text("Job Requisition Detail", 14, yPos);
  yPos += 10;

  // Requisition Number
  doc.setFontSize(12);
  doc.text(`Requisition No: ${requisition.requisition_number}`, 14, yPos);
  yPos += 8;

  // Status
  const statusText = requisition.status === "pending" ? "Pending" : 
                     requisition.status === "approved" ? "Approved" : "Rejected";
  doc.text(`Status: ${statusText}`, 14, yPos);
  yPos += 12;

  // General Information
  doc.setFontSize(14);
  doc.text("General Information", 14, yPos);
  yPos += 8;
  
  doc.setFontSize(10);
  const generalInfo = [
    ["Department:", requisition.department],
    ["Position:", requisition.position],
    ["Quantity:", `${requisition.quantity} person(s)`],
    ["Date Needed:", format(new Date(requisition.date_needed), "dd/MM/yyyy")],
    ["Work Location:", requisition.work_location],
    ["Reports To:", requisition.reports_to],
    ["Requested By:", requisition.requester?.name || "N/A"],
  ];

  generalInfo.forEach(([label, value]) => {
    doc.text(`${label} ${value}`, 14, yPos);
    yPos += 6;
  });

  yPos += 6;

  // Justification
  doc.setFontSize(14);
  doc.text("Justification", 14, yPos);
  yPos += 8;
  
  doc.setFontSize(10);
  const splitJustification = doc.splitTextToSize(requisition.justification, 180);
  doc.text(splitJustification, 14, yPos);
  yPos += (splitJustification.length * 6) + 10;

  // Qualifications
  if (requisition.min_education || requisition.min_experience) {
    doc.setFontSize(14);
    doc.text("Qualifications", 14, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    if (requisition.min_education) {
      doc.text(`Education: ${requisition.min_education}`, 14, yPos);
      yPos += 6;
    }
    if (requisition.field_of_study) {
      doc.text(`Field of Study: ${requisition.field_of_study}`, 14, yPos);
      yPos += 6;
    }
    if (requisition.min_experience) {
      doc.text(`Experience: ${requisition.min_experience} years`, 14, yPos);
      yPos += 6;
    }
    yPos += 6;
  }

  // Approval History
  if (approvals.length > 0) {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.text("Approval History", 14, yPos);
    yPos += 8;

    const approvalData = approvals.map(approval => [
      format(new Date(approval.created_at), "dd/MM/yyyy HH:mm"),
      approval.approver?.name || "N/A",
      approval.action === "approved" ? "Approved" : 
        approval.action === "rejected" ? "Rejected" : "Commented",
      approval.comment || "-",
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Date", "Approver", "Action", "Comment"]],
      body: approvalData,
      styles: {
        font: "helvetica",
        fontSize: 9,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 80 },
      },
    });
  }

  // Save
  doc.save(`requisition-${requisition.requisition_number}.pdf`);
};