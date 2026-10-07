-- 1. Create specialized roles
INSERT INTO "roles" ("name", "description", "updated_at")
VALUES 
('PARENT', 'Parent / Kids Health Portal User', NOW()),
('PREGNANT_WOMAN', 'Pregnant Woman Care Portal User', NOW())
ON CONFLICT ("name") DO NOTHING;

-- 2. Create sample users with hashed passwords (bcrypt for 'Portal@123')
DO $$
DECLARE
    parent_role_id INTEGER;
    pregnant_role_id INTEGER;
BEGIN
    SELECT id INTO parent_role_id FROM "roles" WHERE name = 'PARENT';
    SELECT id INTO pregnant_role_id FROM "roles" WHERE name = 'PREGNANT_WOMAN';

    -- Insert Parent User
    INSERT INTO "users" ("email", "password", "first_name", "last_name", "role_id", "updated_at")
    VALUES ('parent.test@hospital.com', '$2a$10$7/3GRF2t2XzPPGnnXiP2Y13efyGE.dq4e/1UmZGyJA5iHTKY', 'Lily', 'Potter', parent_role_id, NOW())
    ON CONFLICT ("email") DO NOTHING;

    -- Insert Pregnant Woman User
    INSERT INTO "users" ("email", "password", "first_name", "last_name", "role_id", "updated_at")
    VALUES ('mom.test@hospital.com', '$2a$10$7/3GRF2t2XzPPGnnXiP2Y13efyGE.dq4e/1UmZGyJA5iHTKY', 'Elena', 'Gilbert', pregnant_role_id, NOW())
    ON CONFLICT ("email") DO NOTHING;

    -- 3. Add Home Remedies
    INSERT INTO "home_remedies" ("title", "description", "category", "illness_type", "guidance", "updated_at")
    VALUES 
    ('Ginger Honey Tea', 'Excellent for mild pediatric cough.', 'KIDS', 'COLD', 'Use 1 teaspoon honey with warm ginger water.', NOW()),
    ('ORS Hydration', 'Standard protocol for fever management.', 'KIDS', 'FEVER', 'Standard ORS solution per weight.', NOW()),
    ('Ginger Infusion', 'Settles morning sickness symptoms.', 'PREGNANCY', 'NAUSEA', 'Sip slowly throughout morning.', NOW())
    ON CONFLICT DO NOTHING;

    -- 4. Add Vaccinations
    INSERT INTO "vaccinations" ("name", "recommended_age", "description", "updated_at")
    VALUES 
    ('BCG', 'At Birth', 'Tuberculosis preventive vaccine.', NOW()),
    ('Polio (IPV)', '6 Weeks', 'Critical viral immunization.', NOW()),
    ('MMR', '9 Months', 'Measles, Mumps, Rubella.', NOW())
    ON CONFLICT ("name") DO NOTHING;

END $$;
