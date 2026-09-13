import { WorkshopRoom } from "@/components/workshop-room";

export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return <WorkshopRoom code={code.toUpperCase()} host />;
}
