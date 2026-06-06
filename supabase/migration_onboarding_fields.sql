-- Run this in Supabase SQL Editor if profile save fails
-- Adds onboarding fields to existing profiles table

alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists vehicle_type text;
alter table public.profiles add column if not exists shift_preference text;
alter table public.profiles add column if not exists onboarding_completed boolean default false not null;
