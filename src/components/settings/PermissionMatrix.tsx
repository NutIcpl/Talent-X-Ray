import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PermissionMatrixProps {
  role: string;
  initialPermissions: { resource: string; action: string; allowed: boolean }[];
  onSave: (permissions: { resource: string; action: string; allowed: boolean }[]) => void;
  disabled?: boolean;
}

const RESOURCES = [
  { key: "home", label: "Home" },
  { key: "jobs", label: "Jobs" },
  { key: "job_application", label: "Job Application" },
  { key: "job_requisitions", label: "Job Requisitions" },
  { key: "candidates", label: "Candidates" },
  { key: "interviews", label: "Interviews" },
  { key: "reports", label: "Reports" },
  { key: "settings", label: "Settings" },
];

const ACTIONS = ["view", "create", "edit", "delete"];

export function PermissionMatrix({
  role,
  initialPermissions,
  onSave,
  disabled = false,
}: PermissionMatrixProps) {
  const [permissions, setPermissions] = useState<
    Record<string, Record<string, boolean>>
  >({});

  useEffect(() => {
    // Initialize permissions from initialPermissions
    const permMap: Record<string, Record<string, boolean>> = {};
    RESOURCES.forEach((resource) => {
      permMap[resource.key] = {};
      ACTIONS.forEach((action) => {
        const perm = initialPermissions.find(
          (p) => p.resource === resource.key && p.action === action
        );
        permMap[resource.key][action] = perm?.allowed || false;
      });
    });
    setPermissions(permMap);
  }, [initialPermissions]);

  const handleToggle = (resource: string, action: string) => {
    if (disabled) return;
    setPermissions((prev) => ({
      ...prev,
      [resource]: {
        ...prev[resource],
        [action]: !prev[resource]?.[action],
      },
    }));
  };

  const handleSelectAllView = () => {
    if (disabled) return;
    setPermissions((prev) => {
      const newPerms = { ...prev };
      RESOURCES.forEach((resource) => {
        newPerms[resource.key] = { ...newPerms[resource.key], view: true };
      });
      return newPerms;
    });
  };

  const handleSelectAllEdit = () => {
    if (disabled) return;
    setPermissions((prev) => {
      const newPerms = { ...prev };
      RESOURCES.forEach((resource) => {
        newPerms[resource.key] = {
          ...newPerms[resource.key],
          view: true,
          create: true,
          edit: true,
          delete: true,
        };
      });
      return newPerms;
    });
  };

  const handleClearAll = () => {
    if (disabled) return;
    setPermissions((prev) => {
      const newPerms = { ...prev };
      RESOURCES.forEach((resource) => {
        ACTIONS.forEach((action) => {
          newPerms[resource.key][action] = false;
        });
      });
      return newPerms;
    });
  };

  const handleSave = () => {
    const permArray: { resource: string; action: string; allowed: boolean }[] = [];
    RESOURCES.forEach((resource) => {
      ACTIONS.forEach((action) => {
        permArray.push({
          resource: resource.key,
          action,
          allowed: permissions[resource.key]?.[action] || false,
        });
      });
    });
    onSave(permArray);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={handleSelectAllView} variant="outline" size="sm" disabled={disabled}>
          Select All View
        </Button>
        <Button onClick={handleSelectAllEdit} variant="outline" size="sm" disabled={disabled}>
          Select All Edit
        </Button>
        <Button onClick={handleClearAll} variant="outline" size="sm" disabled={disabled}>
          Clear All
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Resource</TableHead>
              <TableHead className="text-center">View</TableHead>
              <TableHead className="text-center">Create</TableHead>
              <TableHead className="text-center">Edit</TableHead>
              <TableHead className="text-center">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {RESOURCES.map((resource) => (
              <TableRow key={resource.key}>
                <TableCell className="font-medium">{resource.label}</TableCell>
                {ACTIONS.map((action) => (
                  <TableCell key={action} className="text-center">
                    <Checkbox
                      checked={permissions[resource.key]?.[action] || false}
                      onCheckedChange={() => handleToggle(resource.key, action)}
                      disabled={disabled}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={disabled}>
          บันทึก Permissions
        </Button>
      </div>
    </div>
  );
}
