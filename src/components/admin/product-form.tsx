"use client";

import { saveProduct } from "@/app/admin/actions/products";
import { ImageUploader } from "./image-uploader";
import { ProductFormMain } from "./product-form-main";
import type { ProductFormData } from "./product-form-types";
import { useToastAction } from "./use-action";
import { VariantsEditor } from "./variants-editor";

export function ProductForm({ initial, categories }: { initial: ProductFormData; categories: { id: string; name: string }[] }) {
  const { formAction, pending } = useToastAction(saveProduct);

  return (
    <form action={formAction} className="grid gap-6 xl:grid-cols-[1fr_22rem]">
      <input type="hidden" name="id" value={initial.id} />
      <input type="hidden" name="status" value={initial.status} />

      <div className="space-y-6">
        <ProductFormMain initial={initial} categories={categories} />
        <VariantsEditor initial={initial.variants} />
      </div>

      <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
        <section className="panel p-5">
          <ImageUploader initial={initial.images} initialPrimary={initial.primaryIndex} />
        </section>

        <section className="panel space-y-3 p-5">
          <h2 className="text-lg font-black">Visibility</h2>
          <label className="flex min-h-11 items-center gap-3 text-sm font-semibold"><input type="checkbox" name="isFeatured" defaultChecked={initial.isFeatured} className="h-5 w-5 accent-violet" /> Featured on homepage</label>
          <label className="flex min-h-11 items-center gap-3 text-sm font-semibold"><input type="checkbox" name="isNew" defaultChecked={initial.isNew} className="h-5 w-5 accent-violet" /> Show “New” badge</label>
          <p className="text-xs text-grey-500">Current status: <strong>{initial.status}</strong></p>
        </section>

        <section className="panel space-y-4 p-5">
          <h2 className="text-lg font-black">SEO</h2>
          <div><label htmlFor="seoTitle" className="label">SEO title</label><input id="seoTitle" name="seoTitle" className="field" defaultValue={initial.seoTitle} /></div>
          <div><label htmlFor="seoDescription" className="label">SEO description</label><textarea id="seoDescription" name="seoDescription" rows={3} className="field" defaultValue={initial.seoDescription} /></div>
        </section>

        <div className="flex gap-3">
          <button type="submit" name="intent" value="draft" className="btn btn-ghost flex-1" disabled={pending}>Save draft</button>
          <button type="submit" name="intent" value="publish" className="btn btn-primary flex-1" disabled={pending}>{pending ? "Saving…" : "Publish"}</button>
        </div>
      </aside>
    </form>
  );
}
