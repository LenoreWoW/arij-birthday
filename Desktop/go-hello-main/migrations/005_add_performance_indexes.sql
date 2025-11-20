-- =====================================================
-- Migration: 005_add_performance_indexes
-- Description: Add missing database indexes for performance optimization
-- Created: 2025-11-20
-- Security Audit Recommendation
-- =====================================================

-- ============== MIGRATION UP ==============

-- Performance optimization indexes for VPN connections table
CREATE INDEX IF NOT EXISTS idx_vpn_connections_server_id
    ON vpn_connections(server_id);

CREATE INDEX IF NOT EXISTS idx_vpn_connections_ip_address
    ON vpn_connections(ip_address);

CREATE INDEX IF NOT EXISTS idx_vpn_connections_connected_at
    ON vpn_connections(connected_at DESC);

CREATE INDEX IF NOT EXISTS idx_vpn_connections_disconnected_at
    ON vpn_connections(disconnected_at DESC)
    WHERE disconnected_at IS NOT NULL;

-- Performance optimization indexes for auth_users table
CREATE INDEX IF NOT EXISTS idx_auth_users_last_login
    ON auth_users(last_login DESC);

CREATE INDEX IF NOT EXISTS idx_auth_users_locked_until
    ON auth_users(locked_until)
    WHERE locked_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_auth_users_created_at
    ON auth_users(created_at DESC);

-- Composite index for active connections query
CREATE INDEX IF NOT EXISTS idx_vpn_connections_active
    ON vpn_connections(user_id, connected_at)
    WHERE disconnected_at IS NULL;

-- Index for audit log queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
    ON audit_logs(created_at DESC)
    WHERE created_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_action
    ON audit_logs(user_id, action, created_at DESC);

-- Index for server health monitoring
CREATE INDEX IF NOT EXISTS idx_server_health_status_check
    ON server_health(server_id, last_check DESC);

-- Add comments to document the indexes
COMMENT ON INDEX idx_vpn_connections_server_id IS 'Optimizes queries filtering connections by server';
COMMENT ON INDEX idx_vpn_connections_ip_address IS 'Optimizes IP-based connection lookups';
COMMENT ON INDEX idx_auth_users_last_login IS 'Optimizes queries ordering users by last login';
COMMENT ON INDEX idx_auth_users_locked_until IS 'Optimizes lookup of locked accounts';
COMMENT ON INDEX idx_vpn_connections_active IS 'Optimizes queries for active VPN connections';

-- ============== ROLLBACK DOWN ==============

/*
-- To rollback this migration, run the following SQL:

DROP INDEX IF EXISTS idx_vpn_connections_server_id;
DROP INDEX IF EXISTS idx_vpn_connections_ip_address;
DROP INDEX IF EXISTS idx_vpn_connections_connected_at;
DROP INDEX IF EXISTS idx_vpn_connections_disconnected_at;
DROP INDEX IF EXISTS idx_auth_users_last_login;
DROP INDEX IF EXISTS idx_auth_users_locked_until;
DROP INDEX IF EXISTS idx_auth_users_created_at;
DROP INDEX IF EXISTS idx_vpn_connections_active;
DROP INDEX IF EXISTS idx_audit_logs_created_at;
DROP INDEX IF EXISTS idx_audit_logs_user_action;
DROP INDEX IF EXISTS idx_server_health_status_check;

*/
