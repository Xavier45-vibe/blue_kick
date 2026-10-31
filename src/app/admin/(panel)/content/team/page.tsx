import { TeamManager } from "@/components/admin/team-manager";
import { listTeam } from "@/repositories/admin";

export const metadata = { title: "Team Members" };

export default async function TeamPage() {
  const rows = await listTeam();
  return (
    <TeamManager
      rows={rows.map((m) => ({ id: m.id, name: m.name, role: m.role, bio: m.bio, position: m.position, photoUrl: m.photoUrl ?? "", tone: [m.toneFrom, m.toneTo] }))}
    />
  );
}
