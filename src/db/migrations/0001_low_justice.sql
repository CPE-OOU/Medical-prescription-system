ALTER TYPE "auth_action" ADD VALUE 'account-verify';--> statement-breakpoint
ALTER TYPE "auth_action" ADD VALUE 'reset-password';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" varchar(24) NOT NULL,
	"action" "auth_action" NOT NULL,
	"expires_in" timestamp with time zone NOT NULL,
	"user_ip" varchar(16),
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "single_user_auth" UNIQUE("user_id","action")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_tokens" ADD CONSTRAINT "auth_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
