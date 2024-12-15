-- Create the profiles table
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text NULL,
  avatar text NULL,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS on the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "can only view own profile data"
ON public.profiles
FOR SELECT
TO public
USING (auth.uid() = id);

CREATE POLICY "can only update own profile data"
ON public.profiles
FOR UPDATE
TO public
USING (auth.uid() = id);

-- Create the function to create a profile when a new user is added
CREATE OR REPLACE FUNCTION create_profile()
RETURNS trigger 
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER

-- Create the trigger to call the create_profile function after a new user is inserted
CREATE TRIGGER create_profile_trigger
AFTER INSERT ON auth.users 
FOR EACH ROW 
EXECUTE FUNCTION create_profile();

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

-- Create the subscriptions table
CREATE TABLE public.subscriptions (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  "lemonsqueezyId" text NOT NULL,
  "orderId" integer NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  status text NOT NULL,
  "statusFormatted" text NOT NULL,
  "renewsAt" timestamp with time zone NULL,
  "endsAt" timestamp with time zone NULL,
  "trialEndsAt" timestamp with time zone NULL,
  price integer NOT NULL,
  "isUsageBased" boolean NULL DEFAULT false,
  "isPaused" boolean NULL DEFAULT false,
  "subscriptionItemId" bigint NULL,
  "userId" uuid NOT NULL,
  "planId" uuid NOT NULL,
  CONSTRAINT subscriptions_pkey PRIMARY KEY (id),
  CONSTRAINT subscriptions_lemonsqueezyid_key UNIQUE ("lemonsqueezyId"),
  CONSTRAINT subscriptions_planid_fkey FOREIGN KEY ("planId") REFERENCES plans(id),
  CONSTRAINT subscriptions_userid_fkey FOREIGN KEY ("userId") REFERENCES auth.users(id)
);

-- Create the webhook_event table
CREATE TABLE public.webhook_event (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
  "eventName" text NOT NULL,
  processed boolean NULL DEFAULT false,
  body jsonb NOT NULL,
  "processingError" text NULL,
  CONSTRAINT webhookevent_pkey PRIMARY KEY (id)
);

-- Enable RLS on the subscriptions table
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for subscriptions
CREATE POLICY "Allow users to select their own subscriptions" 
ON public.subscriptions 
FOR SELECT 
TO authenticated 
USING ("userId" = auth.uid());

CREATE POLICY "Allow service role to insert subscriptions" 
ON public.subscriptions 
FOR INSERT 
TO service_role 
WITH CHECK (true);

CREATE POLICY "Users can update their own subscriptions" 
ON public.subscriptions 
FOR UPDATE 
TO authenticated 
USING ("userId" = auth.uid()) 
WITH CHECK ("userId" = auth.uid());

CREATE POLICY "Users can delete their own subscriptions" 
ON public.subscriptions 
FOR DELETE 
TO authenticated 
USING ("userId" = auth.uid());

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

-- Enable RLS on the webhook_event table
ALTER TABLE public.webhook_event ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for webhook_event
CREATE POLICY "Allow service role to manage webhook events" 
ON public.webhook_event 
FOR INSERT 
TO service_role 
WITH CHECK (true);

CREATE POLICY "Allow service role to select webhook events" 
ON public.webhook_event 
FOR SELECT 
TO service_role 
USING (true);

CREATE POLICY "Allow service role to update webhook events" 
ON public.webhook_event 
FOR UPDATE 
TO service_role 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow service role to delete webhook events" 
ON public.webhook_event 
FOR DELETE 
TO service_role 
USING (true);