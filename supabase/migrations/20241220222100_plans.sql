
-- Create the plans table
CREATE TABLE public.plans (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NULL,
  price integer NOT NULL,
  interval text NULL,
  "intervalCount" integer NULL,
  "isUsageBased" boolean NULL DEFAULT false,
  "productId" bigint NOT NULL,
  "variantId" bigint NOT NULL,
  "productName" text NOT NULL,
  "trialInterval" text NULL,
  "trialIntervalCount" integer NULL,
  sort integer NULL DEFAULT 0,
  CONSTRAINT plans_pkey PRIMARY KEY (id),
  CONSTRAINT plans_variant_id_key UNIQUE ("variantId")
);

-- Enable RLS on the plans table
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for plans
CREATE POLICY "Allow authenticated users to select plans" 
ON public.plans 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow service role to insert plans" 
ON public.plans 
FOR INSERT 
TO service_role 
WITH CHECK (true);

CREATE POLICY "Allow service role to update plans" 
ON public.plans 
FOR UPDATE 
TO service_role 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow service role to delete plans" 
ON public.plans 
FOR DELETE 
TO service_role 
USING (true);