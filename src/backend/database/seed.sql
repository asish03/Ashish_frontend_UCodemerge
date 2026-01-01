-- AsembleAI Database Seed Data
-- Creates demo users and sample data

-- Insert demo users
-- Password for both: owner123 and dev123 (hashed with bcrypt)
-- Hash: $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzS0MYqC5W

INSERT INTO users (id, email, password_hash, name, role, status, created_at)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'owner@asembleai.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzS0MYqC5W', 'Alex Morgan', 'owner', 'active', NOW() - INTERVAL '90 days'),
    ('22222222-2222-2222-2222-222222222222', 'dev@asembleai.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzS0MYqC5W', 'Sam Williams', 'developer', 'active', NOW() - INTERVAL '60 days'),
    ('33333333-3333-3333-3333-333333333333', 'sarah.chen@asembleai.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzS0MYqC5W', 'Sarah Chen', 'developer', 'active', NOW() - INTERVAL '45 days'),
    ('44444444-4444-4444-4444-444444444444', 'mike.johnson@asembleai.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzS0MYqC5W', 'Mike Johnson', 'developer', 'active', NOW() - INTERVAL '30 days'),
    ('55555555-5555-5555-5555-555555555555', 'emma.davis@asembleai.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzS0MYqC5W', 'Emma Davis', 'developer', 'inactive', NOW() - INTERVAL '15 days')
ON CONFLICT (email) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (id, name, user_id, source, language, framework, size_bytes, file_count, s3_path, created_at)
VALUES 
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'lovable-project', '22222222-2222-2222-2222-222222222222', 'Lovable', 'TypeScript', 'React', 2400000, 47, 's3://asembleai-artifacts/projects/lovable-project.zip', NOW() - INTERVAL '10 days'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cursor-backend', '22222222-2222-2222-2222-222222222222', 'Cursor', 'JavaScript', 'Node.js', 5300000, 89, 's3://asembleai-artifacts/projects/cursor-backend.zip', NOW() - INTERVAL '9 days'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'replit-dashboard', '33333333-3333-3333-3333-333333333333', 'Replit', 'Python', 'FastAPI', 3100000, 56, 's3://asembleai-artifacts/projects/replit-dashboard.zip', NOW() - INTERVAL '7 days'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'v0-components', '33333333-3333-3333-3333-333333333333', 'V0', 'TypeScript', 'Next.js', 1800000, 34, 's3://asembleai-artifacts/projects/v0-components.zip', NOW() - INTERVAL '5 days'),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bolt-api', '44444444-4444-4444-4444-444444444444', 'Bolt', 'Go', 'Gin', 4200000, 72, 's3://asembleai-artifacts/projects/bolt-api.zip', NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;

-- Insert sample jobs
INSERT INTO jobs (id, user_id, type, status, progress_percentage, input_data, output_data, started_at, completed_at, duration_ms, created_at)
VALUES 
    -- Completed jobs
    ('job-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'merge', 'completed', 100,
     '{"project_ids": ["aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"], "mode": "guided"}'::jsonb,
     '{"conflicts_resolved": 12, "files_merged": 136, "output_path": "s3://asembleai-artifacts/merged/merge-001.zip"}'::jsonb,
     NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour 57 minutes', 180000, NOW() - INTERVAL '2 hours'),
    
    ('job-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'conversion', 'completed', 100,
     '{"source_language": "JavaScript", "target_language": "TypeScript", "project_id": "cccccccc-cccc-cccc-cccc-cccccccccccc"}'::jsonb,
     '{"files_converted": 56, "type_annotations_added": 234, "confidence": 98.5}'::jsonb,
     NOW() - INTERVAL '5 hours', NOW() - INTERVAL '4 hours 55 minutes', 300000, NOW() - INTERVAL '5 hours'),
    
    ('job-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'import', 'completed', 100,
     '{"source": "github", "url": "https://github.com/example/repo", "branch": "main"}'::jsonb,
     '{"files_imported": 123, "total_size": 8900000}'::jsonb,
     NOW() - INTERVAL '1 day', NOW() - INTERVAL '23 hours 55 minutes', 300000, NOW() - INTERVAL '1 day'),
    
    -- Running jobs
    ('job-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'merge', 'running', 67,
     '{"project_ids": ["dddddddd-dddd-dddd-dddd-dddddddddddd"], "mode": "auto"}'::jsonb,
     NULL,
     NOW() - INTERVAL '15 minutes', NULL, NULL, NOW() - INTERVAL '15 minutes'),
    
    -- Pending jobs
    ('job-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'ai-integration', 'pending', 0,
     '{"job_id": "job-1111-1111-1111-111111111111", "mode": "suggestions"}'::jsonb,
     NULL,
     NULL, NULL, NULL, NOW() - INTERVAL '5 minutes'),
    
    -- Failed job
    ('job-6666-6666-6666-666666666666', '44444444-4444-4444-4444-444444444444', 'conversion', 'failed', 45,
     '{"source_language": "COBOL", "target_language": "Java"}'::jsonb,
     NULL,
     NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours 50 minutes', 600000, NOW() - INTERVAL '3 hours')
ON CONFLICT (id) DO NOTHING;

-- Update error message for failed job
UPDATE jobs 
SET error_message = 'Conversion failed: Unsupported legacy syntax in source file',
    error_stack = 'ConversionError at line 234: Cannot parse COBOL PERFORM UNTIL statement'
WHERE id = 'job-6666-6666-6666-666666666666';

-- Insert sample conflicts
INSERT INTO conflicts (id, job_id, file_path, line_number, conflict_type, severity, ai_suggestion, confidence_score, explanation, resolution, created_at)
VALUES 
    ('conf-1111-1111-1111-111111111111', 'job-1111-1111-1111-111111111111', 'src/components/Header.tsx', 42, 'Function Signature Mismatch', 'medium',
     'Use TypeScript union type: (props: HeaderProps | LegacyProps) => JSX.Element',
     94.5,
     'Both projects define Header component with different prop types. Merging into a union type maintains backward compatibility.',
     'accepted',
     NOW() - INTERVAL '2 hours'),
    
    ('conf-2222-2222-2222-222222222222', 'job-1111-1111-1111-111111111111', 'src/utils/api.ts', 18, 'Import Statement Conflict', 'low',
     'Merge imports and use named exports: import { fetch, axios } from "./lib"',
     98.2,
     'Both files import different HTTP clients. Recommend consolidating to a single utility module.',
     'accepted',
     NOW() - INTERVAL '2 hours'),
    
    ('conf-3333-3333-3333-333333333333', 'job-1111-1111-1111-111111111111', 'src/store/index.ts', 67, 'State Management Conflict', 'high',
     'Merge Redux and Zustand stores into a unified state management solution',
     89.7,
     'Conflicting state management libraries detected. Recommend choosing one primary solution.',
     'modified',
     NOW() - INTERVAL '2 hours'),
    
    ('conf-4444-4444-4444-444444444444', 'job-4444-4444-4444-444444444444', 'pages/dashboard.tsx', 123, 'Duplicate Component Definition', 'medium',
     'Rename to DashboardV1 and DashboardV2, then create wrapper component',
     91.3,
     'Two different Dashboard implementations found. Keep both with versioned names.',
     'pending',
     NOW() - INTERVAL '15 minutes')
ON CONFLICT (id) DO NOTHING;

-- Resolve some conflicts
UPDATE conflicts 
SET resolved_by = '22222222-2222-2222-2222-222222222222',
    resolved_at = NOW() - INTERVAL '1 hour 50 minutes'
WHERE resolution IN ('accepted', 'modified');

-- Insert sample backups
INSERT INTO backups (id, project_id, job_id, name, s3_path, size_bytes, checksum, created_at)
VALUES 
    ('back-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'job-1111-1111-1111-111111111111',
     'lovable-project-backup-20241214',
     's3://asembleai-backups/lovable-project-20241214.zip',
     2400000,
     'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
     NOW() - INTERVAL '2 hours'),
    
    ('back-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'job-2222-2222-2222-222222222222',
     'replit-dashboard-backup-20241214',
     's3://asembleai-backups/replit-dashboard-20241214.zip',
     3100000,
     'z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4',
     NOW() - INTERVAL '5 hours')
ON CONFLICT (id) DO NOTHING;

-- Insert statistics for the last 30 days
DO $$
DECLARE
    i INTEGER;
    random_user UUID;
    random_type VARCHAR(50);
    random_status VARCHAR(50);
BEGIN
    FOR i IN 1..2800 LOOP
        -- Pick random user
        random_user := (ARRAY['22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444'])[floor(random() * 3 + 1)];
        
        -- Pick random type
        random_type := (ARRAY['merge', 'conversion', 'import', 'ai-integration'])[floor(random() * 4 + 1)];
        
        -- Pick random status (90% completed, 8% failed, 2% pending/running)
        random_status := CASE 
            WHEN random() < 0.90 THEN 'completed'
            WHEN random() < 0.98 THEN 'failed'
            ELSE 'pending'
        END;
        
        INSERT INTO jobs (user_id, type, status, progress_percentage, started_at, completed_at, duration_ms, created_at)
        VALUES (
            random_user,
            random_type,
            random_status,
            CASE WHEN random_status = 'completed' THEN 100 ELSE floor(random() * 100) END,
            NOW() - (random() * INTERVAL '30 days'),
            CASE WHEN random_status = 'completed' THEN NOW() - (random() * INTERVAL '30 days') + (random() * INTERVAL '10 minutes') ELSE NULL END,
            CASE WHEN random_status = 'completed' THEN floor(random() * 60000 + 1000)::INTEGER ELSE NULL END,
            NOW() - (random() * INTERVAL '30 days')
        );
    END LOOP;
END $$;

-- Verify seed data
SELECT 'Users inserted:' as info, COUNT(*) as count FROM users
UNION ALL
SELECT 'Projects inserted:', COUNT(*) FROM projects
UNION ALL
SELECT 'Jobs inserted:', COUNT(*) FROM jobs
UNION ALL
SELECT 'Conflicts inserted:', COUNT(*) FROM conflicts
UNION ALL
SELECT 'Backups inserted:', COUNT(*) FROM backups;
