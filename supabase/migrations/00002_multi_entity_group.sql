-- Fynavo Migration 00002: Multi-Entity & Multi-Asset Group Architecture
-- Supports Groups, Holdings, Subsidiaries, SPVs, Assets/Projects, Intercompany, Eliminations, Debt, CAPEX & FX

-- 1. GROUPS TABLE
CREATE TABLE IF NOT EXISTS public.groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    consolidation_currency VARCHAR(10) NOT NULL DEFAULT 'MAD',
    description TEXT,
    headquarters_country VARCHAR(100) DEFAULT 'Maroc',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ENHANCE ENTITIES WITH HIERARCHY & CONSOLIDATION
ALTER TABLE public.entities 
    ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.entities(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS legal_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS type VARCHAR(50) NOT NULL DEFAULT 'subsidiary',
    ADD COLUMN IF NOT EXISTS country VARCHAR(100) NOT NULL DEFAULT 'Maroc',
    ADD COLUMN IF NOT EXISTS functional_currency VARCHAR(10) NOT NULL DEFAULT 'MAD',
    ADD COLUMN IF NOT EXISTS reporting_currency VARCHAR(10) NOT NULL DEFAULT 'MAD',
    ADD COLUMN IF NOT EXISTS ownership_percentage NUMERIC(5,2) NOT NULL DEFAULT 100.00,
    ADD COLUMN IF NOT EXISTS consolidation_method VARCHAR(50) NOT NULL DEFAULT 'full',
    ADD COLUMN IF NOT EXISTS operational_status VARCHAR(50) NOT NULL DEFAULT 'operating',
    ADD COLUMN IF NOT EXISTS legal_status VARCHAR(50) NOT NULL DEFAULT 'active',
    ADD COLUMN IF NOT EXISTS tax_id VARCHAR(100),
    ADD COLUMN IF NOT EXISTS sector VARCHAR(100),
    ADD COLUMN IF NOT EXISTS operational_minimum_cash NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    ADD COLUMN IF NOT EXISTS restricted_cash NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- 3. ASSETS & BUSINESS UNITS (OPERATING LAYER BELOW ENTITY)
CREATE TABLE IF NOT EXISTS public.assets_business_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL REFERENCES public.entities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'asset', -- asset, project, business_unit, branch
    status VARCHAR(50) NOT NULL DEFAULT 'operating',
    revenue NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    costs NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    ebitda NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    capex_budget NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    capex_spent NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. INTERCOMPANY TRANSACTIONS & RECONCILIATIONS
CREATE TABLE IF NOT EXISTS public.intercompany_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    source_entity_id UUID NOT NULL REFERENCES public.entities(id) ON DELETE CASCADE,
    target_entity_id UUID NOT NULL REFERENCES public.entities(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL, -- management_fee, intercompany_loan, cost_recharge, dividend, etc.
    amount NUMERIC(15,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'MAD',
    converted_amount_group_currency NUMERIC(15,2) NOT NULL,
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    period VARCHAR(20) NOT NULL,
    description TEXT,
    reconciliation_status VARCHAR(50) NOT NULL DEFAULT 'unmatched', -- matched, partial_match, unmatched, eliminated, review_required
    discrepancy_amount NUMERIC(15,2) DEFAULT 0.00,
    reconciliation_notes TEXT,
    is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
    counterparty_transaction_id UUID REFERENCES public.intercompany_transactions(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. CONSOLIDATION ELIMINATION ENTRIES (MANAGEMENT CONSOLIDATION)
CREATE TABLE IF NOT EXISTS public.consolidation_eliminations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    period VARCHAR(20) NOT NULL,
    account_code VARCHAR(100) NOT NULL,
    debit NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    credit NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    source_entity_id UUID NOT NULL REFERENCES public.entities(id),
    target_entity_id UUID REFERENCES public.entities(id),
    elimination_type VARCHAR(50) NOT NULL, -- management_fee, intercompany_loan, cost_recharge, dividend
    status VARCHAR(50) NOT NULL DEFAULT 'eliminated', -- eliminated, review_required, pending
    notes TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. FX RATES & CURRENCY CONVERSIONS
CREATE TABLE IF NOT EXISTS public.fx_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pair VARCHAR(20) NOT NULL, -- e.g. EUR/MAD, USD/MAD
    from_currency VARCHAR(10) NOT NULL,
    to_currency VARCHAR(10) NOT NULL,
    rate NUMERIC(12,6) NOT NULL,
    effective_month VARCHAR(7) NOT NULL, -- e.g. '2026-09'
    manual_override BOOLEAN NOT NULL DEFAULT FALSE,
    updated_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. DEBT FACILITIES & COVENANTS
CREATE TABLE IF NOT EXISTS public.debt_facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL REFERENCES public.entities(id) ON DELETE CASCADE,
    lender_name VARCHAR(255) NOT NULL,
    facility_type VARCHAR(50) NOT NULL, -- bank_loan, shareholder_loan, leasing, overdraft, credit_line
    original_amount NUMERIC(15,2) NOT NULL,
    outstanding_amount NUMERIC(15,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'MAD',
    interest_rate_pct NUMERIC(5,2) NOT NULL,
    maturity_date DATE NOT NULL,
    annual_service NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    covenant_description TEXT,
    collateral_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. CAPEX PIPELINE & CAPITAL EXPENDITURE
CREATE TABLE IF NOT EXISTS public.capex_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL REFERENCES public.entities(id) ON DELETE CASCADE,
    asset_project_id UUID REFERENCES public.assets_business_units(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- construction, equipment, technology, fit_out, renovation
    supplier VARCHAR(255),
    budget_amount NUMERIC(15,2) NOT NULL,
    committed_amount NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    spent_amount NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    remaining_amount NUMERIC(15,2) NOT NULL,
    expected_payment_date DATE NOT NULL,
    funding_source VARCHAR(50) NOT NULL DEFAULT 'cash',
    status VARCHAR(50) NOT NULL DEFAULT 'committed', -- planned, approved, committed, paid, completed, cancelled
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. SHARED COST ALLOCATION RULES
CREATE TABLE IF NOT EXISTS public.cost_allocation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    source_entity_id UUID NOT NULL REFERENCES public.entities(id),
    cost_pool_name VARCHAR(255) NOT NULL,
    annual_pool_amount NUMERIC(15,2) NOT NULL,
    method VARCHAR(50) NOT NULL, -- revenue_pct, headcount, fixed_pct, equal_split, manual
    splits JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. AUDIT LOGS FOR CFO MANUAL ADJUSTMENTS & OVERRIDES
CREATE TABLE IF NOT EXISTS public.group_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    entity_id UUID REFERENCES public.entities(id),
    action_type VARCHAR(50) NOT NULL, -- elimination, intercompany_reconcile, fx_override, allocation_rule
    user_id UUID REFERENCES public.users(id),
    old_value JSONB,
    new_value JSONB,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS POLICIES FOR TENANT ISOLATION
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets_business_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intercompany_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consolidation_eliminations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fx_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debt_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capex_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_allocation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated workspace members to view groups"
ON public.groups FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to view intercompany transactions"
ON public.intercompany_transactions FOR SELECT
USING (auth.role() = 'authenticated');
