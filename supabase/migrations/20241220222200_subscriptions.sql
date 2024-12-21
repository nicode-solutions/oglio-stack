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
