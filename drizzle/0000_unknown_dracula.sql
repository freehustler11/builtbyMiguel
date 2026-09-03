CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"business_name" text NOT NULL,
	"email" text NOT NULL,
	"location" text,
	"website_url" text,
	"message" text,
	"status" text DEFAULT 'new' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"keyword" text,
	"meta_description" text,
	"featured_image" text,
	"content" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
