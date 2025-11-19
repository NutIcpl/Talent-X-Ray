import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface RolePermission {
  id: string;
  role: string;
  resource: string;
  action: string;
  allowed: boolean;
}

export function useRolePermissions(role?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ["role-permissions", role],
    queryFn: async () => {
      let query = supabase.from("role_permissions").select("*");
      
      if (role) {
        query = query.eq("role", role);
      }
      
      const { data, error } = await query.order("resource").order("action");
      
      if (error) throw error;
      return data as RolePermission[];
    },
    enabled: !!role || role === undefined,
  });

  const updatePermissionsMutation = useMutation({
    mutationFn: async ({
      role,
      permissions,
    }: {
      role: string;
      permissions: { resource: string; action: string; allowed: boolean }[];
    }) => {
      // Delete existing permissions for this role
      const { error: deleteError } = await supabase
        .from("role_permissions")
        .delete()
        .eq("role", role);

      if (deleteError) throw deleteError;

      // Insert new permissions
      const permissionsToInsert = permissions.map((p) => ({
        role,
        resource: p.resource,
        action: p.action,
        allowed: p.allowed,
      }));

      const { error: insertError } = await supabase
        .from("role_permissions")
        .insert(permissionsToInsert);

      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role-permissions"] });
      toast({
        title: "บันทึกสำเร็จ",
        description: "อัปเดต permissions เรียบร้อยแล้ว",
      });
    },
    onError: (error) => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: `ไม่สามารถบันทึก permissions ได้: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    permissions,
    isLoading,
    updatePermissions: updatePermissionsMutation.mutate,
  };
}
