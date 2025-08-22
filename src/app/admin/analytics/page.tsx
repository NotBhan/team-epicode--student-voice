
'use client';

import withAuth from '@/components/auth/with-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComplaintStatusChart } from '@/components/charts/complaint-status-chart';
import { ComplaintsOverviewChart } from '@/components/charts/complaints-overview-chart';
import { useComplaints } from '@/hooks/use-complaints';

function AnalyticsPage() {
  const { problems } = useComplaints();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Complaints Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ComplaintsOverviewChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ComplaintStatusChart data={problems} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default withAuth(AnalyticsPage, ['admin']);
