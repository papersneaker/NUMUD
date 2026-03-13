CREATE TABLE "exits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_room_id" uuid NOT NULL,
	"to_room_id" uuid NOT NULL,
	"direction" varchar(16) NOT NULL,
	"description" text,
	"properties" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "exits_from_room_direction_uniq" UNIQUE("from_room_id","direction")
);
--> statement-breakpoint
ALTER TABLE "exits" ADD CONSTRAINT "exits_from_room_id_rooms_id_fk" FOREIGN KEY ("from_room_id") REFERENCES "public"."rooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exits" ADD CONSTRAINT "exits_to_room_id_rooms_id_fk" FOREIGN KEY ("to_room_id") REFERENCES "public"."rooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "exits_from_room_id_idx" ON "exits" USING btree ("from_room_id");