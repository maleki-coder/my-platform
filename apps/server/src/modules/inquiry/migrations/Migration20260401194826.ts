import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260401194826 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "inquiry_cart" ("id" text not null, "customer_id" text null, "status" text check ("status" in ('active', 'submitted', 'contacted')) not null default 'active', "email" text null, "phone" text null, "customer_name" text null, "notes" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "inquiry_cart_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_inquiry_cart_deleted_at" ON "inquiry_cart" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "inquiry_cart_item" ("id" text not null, "product_id" text not null, "variant_id" text null, "title" text not null, "thumbnail" text null, "quantity" integer not null default 1, "target_price" text null, "currency" text check ("currency" in ('USD', 'CYN', 'IRR')) not null default 'USD', "product_handle" text null, "package" text null, "brand" text null, "link" text null, "description" text null, "datasheet_url" text null, "cart_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "inquiry_cart_item_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_inquiry_cart_item_cart_id" ON "inquiry_cart_item" ("cart_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_inquiry_cart_item_deleted_at" ON "inquiry_cart_item" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "inquiry_cart_item" add constraint "inquiry_cart_item_cart_id_foreign" foreign key ("cart_id") references "inquiry_cart" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "inquiry_cart_item" drop constraint if exists "inquiry_cart_item_cart_id_foreign";`);

    this.addSql(`drop table if exists "inquiry_cart" cascade;`);

    this.addSql(`drop table if exists "inquiry_cart_item" cascade;`);
  }

}
