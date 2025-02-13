import { getGroupById, getHisabsByGroupId } from "@/lib/api";

import { Card } from "@/components/ui/card";
import GroupClient from "@/components/group-component";

export default async function GroupPage({ params }: { params: { id: string } }) {
  const group = await getGroupById(params.id);
  const hisabs = await getHisabsByGroupId(params.id);
  
  if (!group) {
    return (
      <div className="container py-8">
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-xl font-semibold text-muted-foreground">Group Not Found</h2>
            <p className="text-sm text-muted-foreground">
              The group you're looking for doesn't exist or you don't have access to it.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return <GroupClient group={group} hisabs={hisabs} />;
}