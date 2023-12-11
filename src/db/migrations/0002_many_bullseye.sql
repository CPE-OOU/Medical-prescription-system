ALTER TABLE "drugs" ADD COLUMN "condition" varchar(256);--> statement-breakpoint
ALTER TABLE "drugs" ADD COLUMN "medical_condition_url" varchar(256);--> statement-breakpoint
ALTER TABLE "drugs" ADD COLUMN "effective" numeric(3, 2);--> statement-breakpoint
ALTER TABLE "drugs" ADD COLUMN "side_effect" varchar(256);--> statement-breakpoint
ALTER TABLE "drugs" ADD COLUMN "drug_url" varchar(256);--> statement-breakpoint
ALTER TABLE "drugs" ADD COLUMN "related_drugs" json;