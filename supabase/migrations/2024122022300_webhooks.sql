
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
