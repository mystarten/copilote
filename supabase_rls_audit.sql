-- ============================================================
-- COPILOTE — Audit & Configuration RLS Supabase
-- À exécuter dans Supabase SQL Editor (https://app.supabase.com)
-- ============================================================

-- 1. ACTIVER RLS SUR TOUTES LES TABLES
-- ---------------------------------------------------------------
ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients           ENABLE ROW LEVEL SECURITY;
ALTER TABLE livre_de_police   ENABLE ROW LEVEL SECURITY;

-- 2. SUPPRIMER LES ANCIENNES POLICIES (re-run safe)
-- ---------------------------------------------------------------
DROP POLICY IF EXISTS "profiles_self"     ON profiles;
DROP POLICY IF EXISTS "clients_owner"     ON clients;
DROP POLICY IF EXISTS "ldp_owner"         ON livre_de_police;

-- 3. POLICIES — profiles
-- Un utilisateur ne voit et modifie QUE son propre profil
-- ---------------------------------------------------------------
CREATE POLICY "profiles_self" ON profiles
  FOR ALL
  USING      (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 4. POLICIES — clients
-- Un utilisateur ne voit et modifie QUE ses propres clients
-- ---------------------------------------------------------------
CREATE POLICY "clients_owner" ON clients
  FOR ALL
  USING      (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 5. POLICIES — livre_de_police
-- Un utilisateur ne voit et modifie QUE ses propres véhicules
-- ---------------------------------------------------------------
CREATE POLICY "ldp_owner" ON livre_de_police
  FOR ALL
  USING      (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 6. VÉRIFICATION — lister toutes les policies actives
-- ---------------------------------------------------------------
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 7. VÉRIFICATION — confirmer que RLS est bien activé
-- ---------------------------------------------------------------
SELECT
  relname AS table_name,
  relrowsecurity AS rls_enabled
FROM pg_class
WHERE relname IN ('profiles', 'clients', 'livre_de_police')
  AND relkind = 'r';

-- ============================================================
-- STORAGE — Bucket "documents" (CNI, logos, signatures)
-- ============================================================

-- Autoriser les utilisateurs authentifiés à lire leurs propres fichiers
-- (via le chemin {user_id}/...)
-- Ces policies sont à configurer dans Supabase Dashboard >
-- Storage > Policies, ou via SQL ci-dessous :

-- Policy lecture (SELECT)
CREATE POLICY "storage_read_own" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy upload (INSERT)
CREATE POLICY "storage_insert_own" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy suppression (DELETE)
CREATE POLICY "storage_delete_own" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
