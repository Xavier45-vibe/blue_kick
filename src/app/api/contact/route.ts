import { container } from "@/services/container";
import { ValidationError } from "@/services/newsletter-service";

export async function POST(request: Request) {
  try {
    const b = await request.json();
    await container.contact.submit({ name: String(b.name ?? ""), email: String(b.email ?? ""), message: String(b.message ?? "") });
    return Response.json({ ok: true });
  } catch (e) {
    const status = e instanceof ValidationError ? 400 : 500;
    return Response.json({ ok: false, error: e instanceof ValidationError ? e.message : "Something went wrong." }, { status });
  }
}
