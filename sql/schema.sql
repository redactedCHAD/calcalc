-- Profiles table to store user profile information
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  username TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  daily_calorie_goal INTEGER DEFAULT 2000,
  daily_protein_goal INTEGER DEFAULT 120,
  daily_carbs_goal INTEGER DEFAULT 250,
  daily_fat_goal INTEGER DEFAULT 70,
  PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for row-level security
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create trigger to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Food entries table to store user food logs
CREATE TABLE public.food_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  food_name TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein DECIMAL(10, 1),
  carbs DECIMAL(10, 1),
  fat DECIMAL(10, 1),
  serving_size TEXT,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.food_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for row-level security
CREATE POLICY "Users can view their own food entries" ON public.food_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own food entries" ON public.food_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own food entries" ON public.food_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own food entries" ON public.food_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before update
CREATE TRIGGER set_timestamp_profiles
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_food_entries
BEFORE UPDATE ON public.food_entries
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp(); 