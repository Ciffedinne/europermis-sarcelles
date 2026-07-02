-- Revoke EXECUTE from anon and authenticated on trigger-only SECURITY DEFINER
-- functions. They are called by Postgres triggers (which run as the function
-- owner) — they must never be callable directly through the Data API/RPC.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, PUBLIC;

-- has_role() is called from RLS policies evaluated as the querying role,
-- so authenticated needs EXECUTE. Revoke from anon and PUBLIC only.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, PUBLIC;