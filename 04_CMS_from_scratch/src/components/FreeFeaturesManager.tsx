import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { DataTable, DataTableColumn } from "./ui/data-table/DataTable";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";

interface FreeFeature {
  _id?: string;
  name: string;
  description: string;
  isActive: boolean;
}

const FreeFeaturesManager: React.FC = () => {
  const [features, setFeatures] = useState<FreeFeature[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<FreeFeature | null>(
    null
  );
  const [formData, setFormData] = useState<Omit<FreeFeature, "_id">>({
    name: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/subscriptions/free-features"
      );
      const data = await response.json();
      setFeatures(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to fetch free features");
      console.error("Error fetching features:", error);
      setFeatures([]);
    }
  };

  const handleCreate = () => {
    setEditingFeature(null);
    setFormData({
      name: "",
      description: "",
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (feature: FreeFeature) => {
    setEditingFeature(feature);
    setFormData({
      name: feature.name,
      description: feature.description,
      isActive: feature.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(
        `http://localhost:3000/api/subscriptions/free-features/${id}`,
        {
          method: "DELETE",
        }
      );
      toast.success("Free feature deleted successfully");
      fetchFeatures();
    } catch (error) {
      toast.error("Failed to delete free feature");
      console.error("Error deleting feature:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingFeature
        ? `http://localhost:3000/api/subscriptions/free-features/${editingFeature._id}`
        : "http://localhost:3000/api/subscriptions/free-features";
      const method = editingFeature ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save free feature");
      }

      toast.success(
        `Free feature ${editingFeature ? "updated" : "created"} successfully`
      );
      setIsDialogOpen(false);
      fetchFeatures();
    } catch (error) {
      toast.error("Failed to save free feature");
      console.error("Error saving feature:", error);
    }
  };

  const handleToggleActive = async (feature: FreeFeature) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/subscriptions/free-features/${feature._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...feature,
            isActive: !feature.isActive,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update feature status");
      }

      toast.success("Feature status updated successfully");
      fetchFeatures();
    } catch (error) {
      toast.error("Failed to update feature status");
      console.error("Error updating feature status:", error);
    }
  };

  const columns: DataTableColumn<FreeFeature>[] = [
    {
      id: "name",
      header: "Name",
      cell: (feature) => feature.name,
    },
    {
      id: "description",
      header: "Description",
      cell: (feature) => (
        <div className="max-w-xs truncate">{feature.description}</div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (feature) => (
        <div className="flex items-center space-x-2">
          <Switch
            checked={feature.isActive}
            onCheckedChange={() => handleToggleActive(feature)}
          />
          <Badge variant={feature.isActive ? "default" : "secondary"}>
            {feature.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      ),
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
      onClick: (feature: FreeFeature) => handleDelete(feature._id!),
      icon: <Trash2 className="h-4 w-4" />,
      variant: "destructive" as const,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-4">
        <Button onClick={handleCreate} className="text-white">
          <Plus className="mr-2 h-4 w-4 text-white" />
          Add Free Feature
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={features || []}
        actions={actions}
        keyField="_id"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingFeature ? "Edit Free Feature" : "Add Free Feature"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Feature Name</Label>
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

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
              <Label htmlFor="isActive">Active</Label>
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
                {editingFeature ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FreeFeaturesManager;
