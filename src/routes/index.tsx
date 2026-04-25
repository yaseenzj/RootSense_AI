import { createFileRoute } from "@tanstack/react-router";
import { DentalChatWidget } from "@/components/DentalChatWidget";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "ToothBot — AI Chat for Dental Students" },
      { name: "description", content: "AI study assistant for dental students. Ask clinical questions and upload radiographs or intraoral photos for case discussion." },
    ],
  }),
});

function Index() {
  return <DentalChatWidget />;
}
