export type ProposalRequestData = {
  id: string;
  proposalTitle: string;
  vendorName: string;
  vendorEmail: string | null;
  vendorProposalTitle: string;
  vendorSummary: string;
  vendorAttachments: string[];
  createdAt: Date;
};
