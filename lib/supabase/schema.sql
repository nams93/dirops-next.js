-- Ce fichier est à exécuter dans l'éditeur SQL de Supabase pour créer la table nécessaire

-- Création de la table evaluations
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  agent_evalue TEXT NOT NULL,
  section TEXT NOT NULL,
  matricule TEXT NOT NULL,
  indicatif TEXT NOT NULL,
  contexte TEXT NOT NULL,
  -- Savoirs et connaissances
  connaissances_juridiques INTEGER NOT NULL,
  connaissance_structure INTEGER NOT NULL,
  connaissance_patrimoine INTEGER NOT NULL,
  -- Savoirs-faire
  transmissions INTEGER NOT NULL,
  vigilance INTEGER NOT NULL,
  deplacement INTEGER NOT NULL,
  distances INTEGER NOT NULL,
  positionnement INTEGER NOT NULL,
  contact INTEGER NOT NULL,
  stress INTEGER NOT NULL,
  participation INTEGER NOT NULL,
  -- Savoirs-être
  maitrise INTEGER NOT NULL,
  equipements INTEGER NOT NULL,
  tenue INTEGER NOT NULL,
  proprete INTEGER NOT NULL,
  vehicule INTEGER NOT NULL,
  comportement INTEGER NOT NULL,
  exemplarite INTEGER NOT NULL,
  motivation INTEGER NOT NULL,
  interaction INTEGER NOT NULL,
  hierarchie INTEGER NOT NULL,
  observation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer Row Level Security
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Créer une politique pour permettre à tous les utilisateurs authentifiés de lire les évaluations
CREATE POLICY "Tous les utilisateurs authentifiés peuvent lire les évaluations" 
ON evaluations FOR SELECT 
TO authenticated 
USING (true);

-- Créer une politique pour permettre à tous les utilisateurs authentifiés de créer des évaluations
CREATE POLICY "Tous les utilisateurs authentifiés peuvent créer des évaluations" 
ON evaluations FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Créer une politique pour permettre aux utilisateurs anonymes de créer des évaluations
-- Utile pour le formulaire public
CREATE POLICY "Les utilisateurs anonymes peuvent créer des évaluations" 
ON evaluations FOR INSERT 
TO anon 
WITH CHECK (true);

-- Désactiver temporairement RLS pour le débogage si nécessaire
-- ALTER TABLE evaluations DISABLE ROW LEVEL SECURITY;

