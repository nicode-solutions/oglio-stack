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
CREATE OR REPLACE FUNCTION public.create_profile()
RETURNS trigger 
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO '';


-- Create the trigger on auth.users
CREATE TRIGGER create_profile_trigger
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_profile();
