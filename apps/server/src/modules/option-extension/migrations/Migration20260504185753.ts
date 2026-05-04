import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260504185753 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "option_extension" ("id" text not null, "is_main_character" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "option_extension_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_option_extension_deleted_at" ON "option_extension" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "option_extension" cascade;`);
  }

}
