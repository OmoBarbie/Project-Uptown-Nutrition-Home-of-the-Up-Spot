'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS: Record<string, string> = {
  pending: '#fbbf24', confirmed: '#60a5fa', preparing: '#a78bfa',
  ready_for_pickup: '#34d399', out_for_delivery: '#f97316',
  delivered: '#10b981', completed: '#16a34a', cancelled: '#f87171', refunded: '#94a3b8',
};

interface Props {
  data: { status: string; count: number }[];
}

export function StatusDonut({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="status" innerRadius={50} outerRadius={80}>
          {data.map((entry) => <Cell key={entry.status} fill={COLORS[entry.status] ?? '#94a3b8'} />)}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
