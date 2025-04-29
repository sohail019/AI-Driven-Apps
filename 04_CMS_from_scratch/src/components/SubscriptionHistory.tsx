import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { DataTable, DataTableColumn } from "./ui/data-table/DataTable";
import { Badge } from "./ui/badge";
import { format } from "date-fns";

interface SubscriptionHistoryRecord {
  _id: string;
  userId: string;
  subscriptionPlanId: string;
  changeType: "plan_change" | "feature_change" | "status_change";
  previousPlanId?: string;
  newPlanId?: string;
  previousFeatures?: string[];
  newFeatures?: string[];
  previousStatus?: string;
  newStatus?: string;
  changeDate: string;
  plan?: {
    name: string;
    price: number;
  };
  previousPlan?: {
    name: string;
    price: number;
  };
  newPlan?: {
    name: string;
    price: number;
  };
}

interface SubscriptionHistoryProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionHistory: React.FC<SubscriptionHistoryProps> = ({
  userId,
  isOpen,
  onClose,
}) => {
  const [history, setHistory] = useState<SubscriptionHistoryRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, userId]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/subscriptions/history/${userId}`
      );
      const data = await response.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to fetch subscription history");
      console.error("Error fetching history:", error);
      setHistory([]);
    }
  };

  const getChangeTypeLabel = (type: string) => {
    switch (type) {
      case "plan_change":
        return "Plan Change";
      case "feature_change":
        return "Feature Change";
      case "status_change":
        return "Status Change";
      default:
        return type;
    }
  };

  const getChangeTypeVariant = (type: string) => {
    switch (type) {
      case "plan_change":
        return "default";
      case "feature_change":
        return "secondary";
      case "status_change":
        return "outline";
      default:
        return "default";
    }
  };

  const columns: DataTableColumn<SubscriptionHistoryRecord>[] = [
    {
      id: "changeDate",
      header: "Date",
      cell: (record) => format(new Date(record.changeDate), "PPp"),
    },
    {
      id: "changeType",
      header: "Change Type",
      cell: (record) => (
        <Badge variant={getChangeTypeVariant(record.changeType)}>
          {getChangeTypeLabel(record.changeType)}
        </Badge>
      ),
    },
    {
      id: "plan",
      header: "Plan",
      cell: (record) => {
        if (record.changeType === "plan_change") {
          return (
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">
                From: {record.previousPlan?.name || "N/A"}
              </div>
              <div className="text-sm font-medium">
                To: {record.newPlan?.name || "N/A"}
              </div>
            </div>
          );
        }
        return record.plan?.name || "N/A";
      },
    },
    {
      id: "features",
      header: "Features",
      cell: (record) => {
        if (record.changeType === "feature_change") {
          return (
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">
                Previous: {record.previousFeatures?.join(", ") || "N/A"}
              </div>
              <div className="text-sm font-medium">
                New: {record.newFeatures?.join(", ") || "N/A"}
              </div>
            </div>
          );
        }
        return record.newFeatures?.join(", ") || "N/A";
      },
    },
    {
      id: "status",
      header: "Status",
      cell: (record) => {
        if (record.changeType === "status_change") {
          return (
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">
                From: {record.previousStatus || "N/A"}
              </div>
              <div className="text-sm font-medium">
                To: {record.newStatus || "N/A"}
              </div>
            </div>
          );
        }
        return record.newStatus || "N/A";
      },
    },
  ];

  const totalPages = Math.ceil(history.length / itemsPerPage);
  const paginatedData = history.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Subscription History</DialogTitle>
        </DialogHeader>
        <DataTable
          columns={columns}
          data={paginatedData}
          keyField="_id"
          pagination={{
            currentPage,
            totalPages,
            onPageChange: setCurrentPage,
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionHistory;
