export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "owner" | "admin" | "cfo" | "analyst" | "viewer";
export type OrganizationType = "enterprise" | "cfo" | "fractional_cfo" | "accounting_firm" | "holding";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["users"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["users"]["Row"]>;
      };
      workspaces: {
        Row: {
          id: string;
          name: string;
          slug: string;
          type: OrganizationType;
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["workspaces"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["workspaces"]["Row"]>;
      };
      workspace_members: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          role: UserRole;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["workspace_members"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["workspace_members"]["Row"]>;
      };
      companies: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          legal_name: string | null;
          identifier: string | null; // ICE / Tax ID (Morocco)
          sector: string | null;
          currency: string;
          fiscal_year_start_month: number;
          status: "active" | "archived" | "demo";
          accounting_source: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["companies"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["companies"]["Row"]>;
      };
      company_members: {
        Row: {
          id: string;
          company_id: string;
          user_id: string;
          role: UserRole;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["company_members"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["company_members"]["Row"]>;
      };
      entities: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          code: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["entities"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["entities"]["Row"]>;
      };
      financial_periods: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          start_date: string;
          end_date: string;
          is_closed: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["financial_periods"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["financial_periods"]["Row"]>;
      };
      financial_imports: {
        Row: {
          id: string;
          company_id: string;
          file_name: string;
          file_type: "csv" | "xlsx" | "json";
          source_type: "sage" | "odoo" | "ebp" | "cegid" | "generic_excel" | "bank_statement";
          status: "pending" | "mapping" | "validating" | "completed" | "failed";
          records_count: number;
          error_log: Json | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["financial_imports"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["financial_imports"]["Row"]>;
      };
      import_files: {
        Row: {
          id: string;
          company_id: string;
          import_id: string;
          file_path: string;
          mime_type: string;
          size_bytes: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["import_files"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["import_files"]["Row"]>;
      };
      import_mappings: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          source_system: string;
          field_mappings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["import_mappings"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["import_mappings"]["Row"]>;
      };
      chart_of_accounts: {
        Row: {
          id: string;
          company_id: string;
          account_number: string;
          label: string;
          account_type: "asset" | "liability" | "equity" | "revenue" | "expense";
          classification: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["chart_of_accounts"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["chart_of_accounts"]["Row"]>;
      };
      account_mappings: {
        Row: {
          id: string;
          company_id: string;
          source_account: string;
          target_category: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["account_mappings"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["account_mappings"]["Row"]>;
      };
      ledger_entries: {
        Row: {
          id: string;
          company_id: string;
          period_id: string;
          account_id: string;
          entry_date: string;
          journal_code: string | null;
          reference: string | null;
          description: string | null;
          debit: number;
          credit: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["ledger_entries"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["ledger_entries"]["Row"]>;
      };
      financial_statements: {
        Row: {
          id: string;
          company_id: string;
          period_id: string;
          type: "income_statement" | "balance_sheet" | "cash_flow";
          data: Json;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["financial_statements"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["financial_statements"]["Row"]>;
      };
      bank_accounts: {
        Row: {
          id: string;
          company_id: string;
          bank_name: string;
          account_number: string;
          iban: string | null;
          currency: string;
          current_balance: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["bank_accounts"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["bank_accounts"]["Row"]>;
      };
      bank_transactions: {
        Row: {
          id: string;
          bank_account_id: string;
          company_id: string;
          transaction_date: string;
          amount: number;
          description: string;
          category: string;
          is_reconciled: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["bank_transactions"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["bank_transactions"]["Row"]>;
      };
      customers: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          tax_id: string | null;
          payment_terms_days: number;
          credit_limit: number | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["customers"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["customers"]["Row"]>;
      };
      suppliers: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          tax_id: string | null;
          payment_terms_days: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["suppliers"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["suppliers"]["Row"]>;
      };
      receivables: {
        Row: {
          id: string;
          company_id: string;
          customer_id: string;
          invoice_number: string;
          invoice_date: string;
          due_date: string;
          amount: number;
          amount_paid: number;
          status: "pending" | "partially_paid" | "paid" | "overdue" | "disputed";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["receivables"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["receivables"]["Row"]>;
      };
      payables: {
        Row: {
          id: string;
          company_id: string;
          supplier_id: string;
          bill_number: string;
          bill_date: string;
          due_date: string;
          amount: number;
          amount_paid: number;
          status: "pending" | "partially_paid" | "paid" | "overdue";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["payables"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["payables"]["Row"]>;
      };
      budgets: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          year: number;
          version: string;
          is_approved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["budgets"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["budgets"]["Row"]>;
      };
      budget_lines: {
        Row: {
          id: string;
          budget_id: string;
          company_id: string;
          category: string;
          sub_category: string | null;
          month: number;
          amount: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["budget_lines"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["budget_lines"]["Row"]>;
      };
      forecasts: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          type: "13_week_cash" | "annual_pl" | "working_capital";
          base_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["forecasts"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["forecasts"]["Row"]>;
      };
      forecast_lines: {
        Row: {
          id: string;
          forecast_id: string;
          week_number: number;
          start_date: string;
          opening_cash: number;
          collections: number;
          supplier_payments: number;
          payroll: number;
          taxes: number;
          debt_service: number;
          capex: number;
          other_inflows: number;
          other_outflows: number;
          closing_cash: number;
        };
        Insert: Database["public"]["Tables"]["forecast_lines"]["Row"];
        Update: Partial<Database["public"]["Tables"]["forecast_lines"]["Row"]>;
      };
      scenarios: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          description: string | null;
          is_base_case: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["scenarios"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["scenarios"]["Row"]>;
      };
      scenario_assumptions: {
        Row: {
          id: string;
          scenario_id: string;
          key: string;
          value: number;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["scenario_assumptions"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["scenario_assumptions"]["Row"]>;
      };
      reports: {
        Row: {
          id: string;
          company_id: string;
          period_id: string;
          title: string;
          executive_summary: string | null;
          content: Json;
          status: "draft" | "published";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reports"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["reports"]["Row"]>;
      };
      insights: {
        Row: {
          id: string;
          company_id: string;
          category: "cash" | "margin" | "ar" | "budget" | "executive";
          severity: "low" | "medium" | "high" | "critical";
          title: string;
          summary: string;
          recommended_action: string | null;
          source_metric: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["insights"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["insights"]["Row"]>;
      };
      alerts: {
        Row: {
          id: string;
          company_id: string;
          severity: "critical" | "warning" | "info";
          title: string;
          explanation: string;
          suggested_next_step: string;
          source_metric: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["alerts"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["alerts"]["Row"]>;
      };
      tasks: {
        Row: {
          id: string;
          company_id: string;
          title: string;
          description: string | null;
          due_date: string | null;
          status: "todo" | "in_progress" | "done";
          priority: "low" | "medium" | "high";
          assigned_to: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["tasks"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["tasks"]["Row"]>;
      };
      documents: {
        Row: {
          id: string;
          company_id: string;
          folder: "Financials" | "Bank" | "Budget" | "Reports" | "Tax" | "Contracts" | "Other";
          name: string;
          file_url: string;
          file_type: string;
          size_bytes: number;
          period_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["documents"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["documents"]["Row"]>;
      };
      integrations: {
        Row: {
          id: string;
          company_id: string;
          provider: "sage" | "odoo" | "ebp" | "cegid" | "excel" | "bank_morocco";
          status: "available" | "file_import" | "api_coming_soon" | "connected";
          config: Json | null;
          last_sync_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["integrations"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["integrations"]["Row"]>;
      };
      audit_logs: {
        Row: {
          id: string;
          company_id: string | null;
          user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          details: Json | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["audit_logs"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["audit_logs"]["Row"]>;
      };
    };
  };
}
