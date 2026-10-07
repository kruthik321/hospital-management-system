-- ============================================================
-- HOSPITAL MANAGEMENT SYSTEM - PL/SQL (PL/pgSQL) 
-- Stored Procedures, Functions, and Triggers
-- Database: PostgreSQL
-- ============================================================


-- ===========================
-- STORED PROCEDURES
-- ===========================

-- 1. Procedure to generate a bill for a patient
CREATE OR REPLACE PROCEDURE generate_bill(
    p_patient_id INTEGER,
    p_appointment_id INTEGER DEFAULT NULL,
    p_description VARCHAR DEFAULT 'Consultation Charges',
    p_amount DECIMAL DEFAULT 500.00
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_billing_id INTEGER;
    v_tax DECIMAL;
    v_net_amount DECIMAL;
    v_user_id INTEGER;
BEGIN
    -- Calculate tax (18% GST)
    v_tax := p_amount * 0.18;
    v_net_amount := p_amount + v_tax;

    -- Create billing record
    INSERT INTO billing (patient_id, appointment_id, total_amount, tax, net_amount, status, created_at, updated_at)
    VALUES (p_patient_id, p_appointment_id, p_amount, v_tax, v_net_amount, 'PENDING', NOW(), NOW())
    RETURNING id INTO v_billing_id;

    -- Add billing item
    INSERT INTO billing_items (billing_id, description, category, quantity, unit_price, total_price, created_at)
    VALUES (v_billing_id, p_description, 'CONSULTATION', 1, p_amount, p_amount, NOW());

    -- Notify patient
    SELECT user_id INTO v_user_id FROM patients WHERE id = p_patient_id;
    
    INSERT INTO notifications (user_id, title, message, type, created_at)
    VALUES (v_user_id, 'New Bill Generated', 
            FORMAT('A bill of ₹%s has been generated for you.', v_net_amount),
            'BILLING', NOW());

    RAISE NOTICE 'Bill #% generated successfully. Net amount: ₹%', v_billing_id, v_net_amount;
END;
$$;

-- Usage: CALL generate_bill(1, NULL, 'Consultation Charges', 1000.00);


-- 2. Procedure to admit a patient to a room/bed
CREATE OR REPLACE PROCEDURE admit_patient(
    p_patient_id INTEGER,
    p_bed_id INTEGER,
    p_reason TEXT DEFAULT 'General Admission'
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_bed_occupied BOOLEAN;
    v_admission_id INTEGER;
BEGIN
    -- Check if bed is available
    SELECT is_occupied INTO v_bed_occupied FROM beds WHERE id = p_bed_id;
    
    IF v_bed_occupied THEN
        RAISE EXCEPTION 'Bed % is already occupied', p_bed_id;
    END IF;

    -- Create admission record
    INSERT INTO admissions (patient_id, admit_date, reason, status, created_at, updated_at)
    VALUES (p_patient_id, NOW(), p_reason, 'ADMITTED', NOW(), NOW())
    RETURNING id INTO v_admission_id;

    -- Assign bed
    INSERT INTO room_assignments (patient_id, bed_id, assigned_at, status, created_at, updated_at)
    VALUES (p_patient_id, p_bed_id, NOW(), 'ACTIVE', NOW(), NOW());

    -- Mark bed as occupied
    UPDATE beds SET is_occupied = TRUE, updated_at = NOW() WHERE id = p_bed_id;

    RAISE NOTICE 'Patient % admitted successfully. Admission ID: %', p_patient_id, v_admission_id;
END;
$$;

-- Usage: CALL admit_patient(1, 1, 'Surgery recovery');


-- 3. Procedure to discharge a patient
CREATE OR REPLACE PROCEDURE discharge_patient(
    p_admission_id INTEGER,
    p_summary TEXT DEFAULT 'Patient recovered and discharged',
    p_discharged_by VARCHAR DEFAULT 'Admin'
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_patient_id INTEGER;
    v_bed_id INTEGER;
BEGIN
    -- Get patient and bed info
    SELECT a.patient_id INTO v_patient_id FROM admissions a WHERE a.id = p_admission_id;
    
    -- Update admission status
    UPDATE admissions SET status = 'DISCHARGED', updated_at = NOW() WHERE id = p_admission_id;

    -- Create discharge record
    INSERT INTO discharges (admission_id, discharge_date, summary, discharged_by, created_at, updated_at)
    VALUES (p_admission_id, NOW(), p_summary, p_discharged_by, NOW(), NOW());

    -- Free up bed
    SELECT ra.bed_id INTO v_bed_id 
    FROM room_assignments ra 
    WHERE ra.patient_id = v_patient_id AND ra.status = 'ACTIVE'
    ORDER BY ra.assigned_at DESC LIMIT 1;

    IF v_bed_id IS NOT NULL THEN
        UPDATE room_assignments SET status = 'DISCHARGED', discharged_at = NOW(), updated_at = NOW()
        WHERE patient_id = v_patient_id AND bed_id = v_bed_id AND status = 'ACTIVE';
        
        UPDATE beds SET is_occupied = FALSE, updated_at = NOW() WHERE id = v_bed_id;
    END IF;

    RAISE NOTICE 'Patient discharged successfully from admission %', p_admission_id;
END;
$$;


-- ===========================
-- FUNCTIONS
-- ===========================

-- 1. Function to calculate doctor workload (appointment count for a date range)
CREATE OR REPLACE FUNCTION calculate_doctor_workload(
    p_doctor_id INTEGER,
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    total_appointments BIGINT,
    completed BIGINT,
    cancelled BIGINT,
    pending BIGINT,
    workload_percentage DECIMAL
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_max_daily_appointments INTEGER := 20;
    v_working_days INTEGER;
BEGIN
    v_working_days := (p_end_date - p_start_date);
    IF v_working_days <= 0 THEN v_working_days := 1; END IF;

    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT AS total_appointments,
        COUNT(*) FILTER (WHERE a.status = 'COMPLETED')::BIGINT AS completed,
        COUNT(*) FILTER (WHERE a.status = 'CANCELLED')::BIGINT AS cancelled,
        COUNT(*) FILTER (WHERE a.status IN ('SCHEDULED', 'CONFIRMED'))::BIGINT AS pending,
        ROUND((COUNT(*)::DECIMAL / (v_working_days * v_max_daily_appointments)) * 100, 2) AS workload_percentage
    FROM appointments a
    WHERE a.doctor_id = p_doctor_id
    AND a.appointment_date BETWEEN p_start_date AND p_end_date;
END;
$$;

-- Usage: SELECT * FROM calculate_doctor_workload(1, '2026-01-01', '2026-03-31');


-- 2. Function to get room occupancy rate
CREATE OR REPLACE FUNCTION get_room_occupancy(p_room_id INTEGER DEFAULT NULL)
RETURNS TABLE (
    room_id INTEGER,
    room_number VARCHAR,
    room_type VARCHAR,
    total_beds BIGINT,
    occupied_beds BIGINT,
    occupancy_rate DECIMAL
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id AS room_id,
        r.room_number::VARCHAR,
        r.type::VARCHAR AS room_type,
        COUNT(b.id)::BIGINT AS total_beds,
        COUNT(b.id) FILTER (WHERE b.is_occupied = TRUE)::BIGINT AS occupied_beds,
        CASE 
            WHEN COUNT(b.id) > 0 THEN ROUND((COUNT(b.id) FILTER (WHERE b.is_occupied = TRUE)::DECIMAL / COUNT(b.id)) * 100, 2)
            ELSE 0
        END AS occupancy_rate
    FROM rooms r
    LEFT JOIN beds b ON b.room_id = r.id
    WHERE (p_room_id IS NULL OR r.id = p_room_id)
    GROUP BY r.id, r.room_number, r.type
    ORDER BY r.room_number;
END;
$$;

-- Usage: SELECT * FROM get_room_occupancy();
-- Usage: SELECT * FROM get_room_occupancy(1);


-- 3. Function to calculate patient total bill
CREATE OR REPLACE FUNCTION get_patient_total_dues(p_patient_id INTEGER)
RETURNS TABLE (
    total_billed DECIMAL,
    total_paid DECIMAL,
    total_due DECIMAL,
    pending_bills BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(b.net_amount), 0)::DECIMAL AS total_billed,
        COALESCE(SUM(COALESCE(p.paid, 0)), 0)::DECIMAL AS total_paid,
        COALESCE(SUM(b.net_amount) - SUM(COALESCE(p.paid, 0)), 0)::DECIMAL AS total_due,
        COUNT(b.id) FILTER (WHERE b.status = 'PENDING')::BIGINT AS pending_bills
    FROM billing b
    LEFT JOIN (
        SELECT billing_id, SUM(amount) AS paid FROM payments WHERE status = 'COMPLETED' GROUP BY billing_id
    ) p ON p.billing_id = b.id
    WHERE b.patient_id = p_patient_id;
END;
$$;


-- ===========================
-- TRIGGERS
-- ===========================

-- 1. Trigger: Auto-create notification when appointment is created
CREATE OR REPLACE FUNCTION fn_appointment_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_doctor_user_id INTEGER;
    v_patient_name VARCHAR;
BEGIN
    -- Get doctor's user_id
    SELECT d.user_id INTO v_doctor_user_id FROM doctors d WHERE d.id = NEW.doctor_id;
    
    -- Get patient name
    SELECT CONCAT(u.first_name, ' ', u.last_name) INTO v_patient_name 
    FROM patients p JOIN users u ON u.id = p.user_id 
    WHERE p.id = NEW.patient_id;

    -- Create notification for doctor
    INSERT INTO notifications (user_id, title, message, type, created_at)
    VALUES (v_doctor_user_id, 'New Appointment Booked',
            FORMAT('Patient %s has booked an appointment on %s at %s', 
                   v_patient_name, NEW.appointment_date::DATE, NEW.time_slot),
            'APPOINTMENT', NOW());

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_appointment_created
    AFTER INSERT ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION fn_appointment_notification();


-- 2. Trigger: Update billing status when payment is made
CREATE OR REPLACE FUNCTION fn_payment_update_billing()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_paid DECIMAL;
    v_net_amount DECIMAL;
    v_new_status VARCHAR;
BEGIN
    -- Calculate total payments for this bill
    SELECT COALESCE(SUM(amount), 0) INTO v_total_paid 
    FROM payments WHERE billing_id = NEW.billing_id AND status = 'COMPLETED';

    -- Get net amount
    SELECT net_amount INTO v_net_amount FROM billing WHERE id = NEW.billing_id;

    -- Determine new status
    IF v_total_paid >= v_net_amount THEN
        v_new_status := 'PAID';
    ELSIF v_total_paid > 0 THEN
        v_new_status := 'PARTIAL';
    ELSE
        v_new_status := 'PENDING';
    END IF;

    -- Update billing status
    UPDATE billing SET status = v_new_status, updated_at = NOW() WHERE id = NEW.billing_id;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_payment_update_billing
    AFTER INSERT ON payments
    FOR EACH ROW
    EXECUTE FUNCTION fn_payment_update_billing();


-- 3. Trigger: Audit trail for all important table changes 
CREATE OR REPLACE FUNCTION fn_audit_trail()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (action, table_name, record_id, new_values, created_at)
        VALUES ('CREATE', TG_TABLE_NAME, NEW.id, row_to_json(NEW)::TEXT, NOW());
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (action, table_name, record_id, old_values, new_values, created_at)
        VALUES ('UPDATE', TG_TABLE_NAME, NEW.id, row_to_json(OLD)::TEXT, row_to_json(NEW)::TEXT, NOW());
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (action, table_name, record_id, old_values, created_at)
        VALUES ('DELETE', TG_TABLE_NAME, OLD.id, row_to_json(OLD)::TEXT, NOW());
        RETURN OLD;
    END IF;
END;
$$;

-- Apply audit trigger to important tables
CREATE TRIGGER trg_audit_appointments
    AFTER INSERT OR UPDATE OR DELETE ON appointments
    FOR EACH ROW EXECUTE FUNCTION fn_audit_trail();

CREATE TRIGGER trg_audit_billing
    AFTER INSERT OR UPDATE OR DELETE ON billing
    FOR EACH ROW EXECUTE FUNCTION fn_audit_trail();

CREATE TRIGGER trg_audit_prescriptions
    AFTER INSERT OR UPDATE OR DELETE ON prescriptions
    FOR EACH ROW EXECUTE FUNCTION fn_audit_trail();

CREATE TRIGGER trg_audit_admissions
    AFTER INSERT OR UPDATE OR DELETE ON admissions
    FOR EACH ROW EXECUTE FUNCTION fn_audit_trail();


-- 4. Trigger: Auto-update inventory when pharmacy order is dispensed
CREATE OR REPLACE FUNCTION fn_update_inventory_on_dispense()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_med_id INTEGER;
    v_med_cursor CURSOR FOR
        SELECT pi.medication_id FROM prescription_items pi WHERE pi.prescription_id = NEW.prescription_id;
BEGIN
    IF NEW.status = 'DISPENSED' AND (OLD.status IS NULL OR OLD.status != 'DISPENSED') THEN
        FOR v_rec IN v_med_cursor LOOP
            UPDATE inventory SET quantity = quantity - 1, updated_at = NOW()
            WHERE medication_id = v_rec.medication_id AND quantity > 0;
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_pharmacy_dispense
    AFTER UPDATE ON pharmacy_orders
    FOR EACH ROW
    EXECUTE FUNCTION fn_update_inventory_on_dispense();
