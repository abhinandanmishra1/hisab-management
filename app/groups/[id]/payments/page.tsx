import { getGroupById, getHisabsByGroupId } from "@/app/lib/api/server";

import { Card } from "@/components/ui/card";
import PaymentsClient from "@/components/payments-client";

export default async function PaymentsPage({ params }: { params: { id: string } }) {
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

  return <PaymentsClient group={group} hisabs={hisabs} />;
}