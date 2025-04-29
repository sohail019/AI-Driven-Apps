import React, { useState, useEffect } from "react";
import {
  subscriptionService,
  SubscriptionPlan,
} from "../api/subscriptionService";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { DataTable, DataTableColumn } from "./ui/data-table/DataTable";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import FeaturesModal from "./FeaturesModal";

const SubscriptionManager: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [formData, setFormData] = useState<Omit<SubscriptionPlan, "_id">>({
    name: "",
    price: 0,
    description: "",
    features: [""],
    durationMonths: 1,
    userCount: 0,
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const data = await subscriptionService.getAllPlans();
      setPlans(data);
    } catch (error: unknown) {
      toast.error("Failed to fetch subscription plans");
      console.error("Error fetching plans:", error);
    }
  };

  const handleCreate = () => {
    setEditingPlan(null);
    setFormData({
      name: "",
      price: 0,
      description: "",
      features: [""],
      durationMonths: 1,
      userCount: 0,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      description: plan.description,
      features: plan.features,
      durationMonths: plan.durationMonths,
      userCount: plan.userCount,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (plan: SubscriptionPlan) => {
    try {
      await subscriptionService.deletePlan(plan._id!);
      toast.success("Subscription plan deleted successfully");
      fetchPlans();
    } catch (error: unknown) {
      toast.error("Failed to delete subscription plan");
      console.error("Error deleting plan:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        await subscriptionService.updatePlan(editingPlan._id!, formData);
        toast.success("Subscription plan updated successfully");
      } else {
        await subscriptionService.createPlan(formData);
        toast.success("Subscription plan created successfully");
      }
      setIsDialogOpen(false);
      fetchPlans();
    } catch (error: unknown) {
      toast.error("Failed to save subscription plan");
      console.error("Error saving plan:", error);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ""],
    });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleViewMoreFeatures = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setIsFeaturesModalOpen(true);
  };

  const renderFeatures = (features: string[]) => {
    const displayFeatures = features.slice(0, 3);
    const hasMore = features.length > 5;

    return (
      <div className="flex flex-wrap gap-2 items-center">
        {displayFeatures.map((feature, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="max-w-[150px] truncate">
                  {feature}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{feature}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2"
            onClick={() =>
              handleViewMoreFeatures({ ...selectedPlan!, features })
            }
          >
            +{features.length - 5} more
          </Button>
        )}
      </div>
    );
  };

  const columns: DataTableColumn<SubscriptionPlan>[] = [
    {
      id: "name",
      header: "Name",
      cell: (plan) => plan.name,
    },
    {
      id: "price",
      header: "Price",
      cell: (plan) => `₹${plan.price.toFixed(2)}`,
    },
    {
      id: "duration",
      header: "Duration",
      cell: (plan) => `${plan.durationMonths} months`,
    },
    {
      id: "description",
      header: "Description",
      cell: (plan) => (
        <div className="max-w-xs truncate">{plan.description}</div>
      ),
    },
    {
      id: "features",
      header: "Features",
      cell: (plan) => renderFeatures(plan.features),
    },
    {
      id: "userCount",
      header: "Subscribers",
      cell: (plan) => <div className="font-medium">{plan.userCount}</div>,
    },
  ];

  const actions = [
    {
      label: "Edit",
      onClick: handleEdit,
      icon: <Pencil className="h-4 w-4" />,
    },
    {
      label: "Delete",
      onClick: handleDelete,
      icon: <Trash2 className="h-4 w-4" />,
      variant: "destructive" as const,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-4">
        <Button onClick={handleCreate} className="text-white">
          <Plus className="mr-2 h-4 w-4 text-white" />
          Create New Plan
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={plans}
        actions={actions}
        keyField="_id"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPlan
                ? "Edit Subscription Plan"
                : "Create Subscription Plan"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Plan Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value),
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (months)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.durationMonths}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    durationMonths: parseInt(e.target.value),
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Features</Label>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      value={feature}
                      onChange={(e) =>
                        handleFeatureChange(index, e.target.value)
                      }
                      required
                    />
                    {formData.features.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={addFeature}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Feature
              </Button>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="text-white">
                {editingPlan ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {selectedPlan && (
        <FeaturesModal
          isOpen={isFeaturesModalOpen}
          onClose={() => setIsFeaturesModalOpen(false)}
          features={selectedPlan.features}
          title={`${selectedPlan.name} - Features`}
        />
      )}
    </div>
  );
};

export default SubscriptionManager;
