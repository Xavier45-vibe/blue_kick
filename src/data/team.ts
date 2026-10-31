import type { TeamMember } from "@/domain/product";

export const team: TeamMember[] = [
  { id: "team-1", name: "Amara Okoye", role: "Founder & Creative Director", bio: "Started Blue Kick at the family kitchen table and still hand-picks every colour we stock.", position: 1, tone: ["#C084FC", "#F472B6"] },
  { id: "team-2", name: "David Okoye", role: "Head of Operations", bio: "Keeps the shelves full and the parcels moving. Amara's brother and our logistics wizard.", position: 2, tone: ["#9CA3AF", "#374151"] },
  { id: "team-3", name: "Ngozi Okoye", role: "Community & Brand", bio: "Our mum and the heart of the shop. She hosts our weekend sketch-along sessions.", position: 3, tone: ["#FBBF24", "#F472B6"] },
  { id: "team-4", name: "Tobi Adeyemi", role: "Product Specialist", bio: "A working illustrator who tests every product before it reaches you.", position: 4, tone: ["#6B7280", "#C084FC"] },
];
