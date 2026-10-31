import { container } from "@/services/container";
import { ValidationError } from "@/services/newsletter-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await container.newsletter.subscribe(String(body.email ?? ""), String(body.source ?? "website"));
    return Response.json({ ok: true, created: result.created });
  } catch (e) {
    const status = e instanceof ValidationError ? 400 : 500;
    return Response.json({ ok: false, error: e instanceof ValidationError ? e.message : "Something went wrong." }, { status });
  }
}
