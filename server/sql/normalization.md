# Database Normalization Documentation

## Hospital Management System — Normalization Process

This document demonstrates the normalization process (1NF → 2NF → 3NF) applied to the Hospital Management System database.

---

## Example 1: Appointment & Patient Data

### Unnormalized Form (UNF)

Consider a flat table storing appointment data:

| AppointmentID | PatientName | PatientPhone | PatientEmail | PatientBloodGroup | DoctorName | DoctorSpecialization | DoctorDept | AppointmentDate | TimeSlot | Status | PrescriptionMeds |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Rahul Sharma | 9876543210 | rahul@email.com | B+ | Dr. Priya Patel | Cardiology | Heart Dept | 2026-01-15 | 10:00 AM | COMPLETED | Aspirin 75mg, Atorvastatin 10mg |
| 2 | Rahul Sharma | 9876543210 | rahul@email.com | B+ | Dr. Anil Kumar | Neurology | Brain Dept | 2026-01-20 | 11:00 AM | SCHEDULED | |

**Problems:**
- Patient data is repeated for every appointment (redundancy)
- Doctor data is repeated for every appointment
- PrescriptionMeds is a multi-valued attribute (violates 1NF)
- Update anomalies if patient changes phone number
- Deletion of appointment loses prescription data

---

### First Normal Form (1NF)

**Rule:** All attributes must contain only atomic (indivisible) values. No repeating groups.

**Changes:**
- Split `PrescriptionMeds` into separate rows
- Make every cell contain a single value

| AppointmentID | PatientName | PatientPhone | PatientEmail | PatientBloodGroup | DoctorName | DoctorSpecialization | DoctorDept | AppointmentDate | TimeSlot | Status | MedicineName | MedicineDosage |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Rahul Sharma | 9876543210 | rahul@email.com | B+ | Dr. Priya Patel | Cardiology | Heart Dept | 2026-01-15 | 10:00 AM | COMPLETED | Aspirin | 75mg |
| 1 | Rahul Sharma | 9876543210 | rahul@email.com | B+ | Dr. Priya Patel | Cardiology | Heart Dept | 2026-01-15 | 10:00 AM | COMPLETED | Atorvastatin | 10mg |
| 2 | Rahul Sharma | 9876543210 | rahul@email.com | B+ | Dr. Anil Kumar | Neurology | Brain Dept | 2026-01-20 | 11:00 AM | SCHEDULED | | |

✅ **1NF achieved:** All values are atomic.

---

### Second Normal Form (2NF)

**Rule:** Must be in 1NF + no partial dependencies. Every non-key attribute must depend on the ENTIRE primary key.

**Functional Dependencies identified:**
- AppointmentID → PatientName, PatientPhone, PatientEmail, PatientBloodGroup, DoctorName, DoctorSpecialization, DoctorDept, AppointmentDate, TimeSlot, Status
- PatientEmail → PatientName, PatientPhone, PatientBloodGroup (partial dependency!)
- DoctorName → DoctorSpecialization, DoctorDept (partial dependency!)

**Changes:** Split into separate tables to remove partial dependencies.

**Table: Patients**
| PatientID (PK) | PatientName | PatientPhone | PatientEmail | PatientBloodGroup |
|---|---|---|---|---|
| 1 | Rahul Sharma | 9876543210 | rahul@email.com | B+ |

**Table: Doctors**
| DoctorID (PK) | DoctorName | DoctorSpecialization | DoctorDept |
|---|---|---|---|
| 1 | Dr. Priya Patel | Cardiology | Heart Dept |
| 2 | Dr. Anil Kumar | Neurology | Brain Dept |

**Table: Appointments**
| AppointmentID (PK) | PatientID (FK) | DoctorID (FK) | AppointmentDate | TimeSlot | Status |
|---|---|---|---|---|---|
| 1 | 1 | 1 | 2026-01-15 | 10:00 AM | COMPLETED |
| 2 | 1 | 2 | 2026-01-20 | 11:00 AM | SCHEDULED |

**Table: Prescription_Medicines**
| ID (PK) | AppointmentID (FK) | MedicineName | MedicineDosage |
|---|---|---|---|
| 1 | 1 | Aspirin | 75mg |
| 2 | 1 | Atorvastatin | 10mg |

✅ **2NF achieved:** No partial dependencies remain.

---

### Third Normal Form (3NF)

**Rule:** Must be in 2NF + no transitive dependencies. No non-key attribute should depend on another non-key attribute.

**Transitive Dependencies identified:**
- In Doctors table: DoctorSpecialization → DoctorDept (specialization determines department — transitive!)
- In Prescription_Medicines: MedicineName → MedicineDosage possibilities (transitive!)

**Changes:** Further decompose tables.

**Table: Departments**
| DepartmentID (PK) | DepartmentName | Description |
|---|---|---|
| 1 | Cardiology | Heart and cardiovascular |
| 2 | Neurology | Brain and nervous system |

**Table: Doctors** (revised)
| DoctorID (PK) | DoctorName | Specialization | DepartmentID (FK) |
|---|---|---|---|
| 1 | Dr. Priya Patel | Cardiology | 1 |
| 2 | Dr. Anil Kumar | Neurology | 2 |

**Table: Medications**
| MedicationID (PK) | Name | GenericName | DosageForm | Strength | Price |
|---|---|---|---|---|---|
| 1 | Aspirin | Acetylsalicylic Acid | Tablet | 75mg | 5.00 |
| 2 | Atorvastatin | Atorvastatin Calcium | Tablet | 10mg | 12.00 |

**Table: Prescriptions**
| PrescriptionID (PK) | PatientID (FK) | DoctorID (FK) | AppointmentID (FK) | DiagnosisNotes | CreatedAt |
|---|---|---|---|---|---|
| 1 | 1 | 1 | 1 | Mild hypertension | 2026-01-15 |

**Table: Prescription_Items**
| ID (PK) | PrescriptionID (FK) | MedicationID (FK) | Dosage | Frequency | Duration |
|---|---|---|---|---|---|
| 1 | 1 | 1 | 75mg | Once daily | 30 days |
| 2 | 1 | 2 | 10mg | Once daily | 30 days |

✅ **3NF achieved:** No transitive dependencies remain.

---

## Example 2: Billing Data

### UNF → 3NF

**Unnormalized:**
| BillID | PatientName | Items | TotalAmount | PaymentMethod | PaymentDate |
|---|---|---|---|---|---|
| 1 | Rahul | Consultation ₹500, Blood Test ₹300 | 800 | Cash, UPI | 2026-01-15, 2026-01-16 |

**3NF Tables:**

**Billing** (BillID PK, PatientID FK, TotalAmount, Tax, NetAmount, Status)

**Billing_Items** (ItemID PK, BillID FK, Description, Category, Quantity, UnitPrice, TotalPrice)

**Payments** (PaymentID PK, BillID FK, Amount, PaymentMethod, TransactionID, PaidAt)

---

## Summary

| Normal Form | Rule | What We Did |
|---|---|---|
| 1NF | Atomic values, no repeating groups | Split multi-valued medicine field into separate rows |
| 2NF | No partial dependencies | Separated patient, doctor, and appointment into distinct tables |
| 3NF | No transitive dependencies | Created departments and medications as independent entities |

All 37 tables in the Hospital Management System are in **Third Normal Form (3NF)**.
