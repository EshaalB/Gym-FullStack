-- Gym Management System - Sample Data Population Script
-- Run this script in SQL Server Management Studio or any SQL client

USE gymFinal;
GO

-- Clear existing data (except admin user)
DELETE FROM Attendance;

DELETE FROM Class_Enrollment;

DELETE FROM ClassDays;

DELETE FROM Class;

DELETE FROM WorkoutPlan;

DELETE FROM Payment;

DELETE FROM MembershipDetails WHERE userId != 8;

DELETE FROM TrainerData WHERE userId != 8;

DELETE FROM gymUser WHERE userId != 8;
GO

-- Insert Members (15 members)
INSERT INTO
    gymUser (
        email,
        fName,
        lName,
        password,
        dateofBirth,
        gender,
        userRole
    )
VALUES (
        'john.doe@email.com',
        'John',
        'Doe',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        '1995-03-15',
        'Male',
        'Member'
    ),
    (
        'sarah.wilson@email.com',
        'Sarah',
        'Wilson',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        '1992-07-22',
        'Female',
        'Member'
    ),
    (
        'mike.chen@email.com',
        'Mike',
        'Chen',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        '1988-11-08',
        'Male',
        'Member'
    ),
    (
        'emma.rodriguez@email.com',
        'Emma',
        'Rodriguez',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        '1990-04-12',
        'Female',
        'Member'
    ),
    (
        'david.kim@email.com',
        'David',
        'Kim',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        '1993-09-30',
        'Male',
        'Member'
    ),
    (
        'lisa.thompson@email.com',
        'Lisa',
        'Thompson',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        '1987-12-05',
        'Female',
        'Member'
    ),
    (
        'james.brown@email.com',
        'James',
        'Brown',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        '1991-06-18',
        'Male',
        'Member'
    ),
    (
        'anna.garcia@email.com',
        'Anna',
        'Garcia',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        '1994-01-25',
        'Female',
        'Member'
    ),
    (
        'robert.taylor@email.com',
        'Robert',
        'Taylor',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        '1989-08-14',
        'Male',
        'Member'
    ),
    (
        'maria.lee@email.com',
        'Maria',
        'Lee',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        '1996-02-28',
        'Female',
        'Member'
    ),
    (
        'chris.martinez@email.com',
        'Chris',
        'Martinez',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        '1990-10-03',
        'Male',
        'Member'
    ),
    (
        'jennifer.white@email.com',
        'Jennifer',
        'White',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        '1993-05-20',
        'Female',
        'Member'
    ),
    (
        'alex.johnson@email.com',
        'Alex',
        'Johnson',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        '1988-12-11',
        'Male',
        'Member'
    ),
    (
        'sophia.davis@email.com',
        'Sophia',
        'Davis',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        '1995-07-07',
        'Female',
        'Member'
    ),
    (
        'ryan.miller@email.com',
        'Ryan',
        'Miller',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        '1992-03-16',
        'Male',
        'Member'
    );
GO

-- Insert Trainers (5 trainers)
INSERT INTO
    gymUser (
        email,
        fName,
        lName,
        password,
        dateofBirth,
        gender,
        userRole
    )
VALUES (
        'trainer.james@email.com',
        'James',
        'Wilson',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        '1985-04-15',
        'Male',
        'Trainer'
    ),
    (
        'trainer.emma@email.com',
        'Emma',
        'Thompson',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        '1990-08-22',
        'Female',
        'Trainer'
    ),
    (
        'trainer.marcus@email.com',
        'Marcus',
        'Johnson',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        '1987-12-10',
        'Male',
        'Trainer'
    ),
    (
        'trainer.sophia@email.com',
        'Sophia',
        'Anderson',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        '1992-06-05',
        'Female',
        'Trainer'
    ),
    (
        'trainer.daniel@email.com',
        'Daniel',
        'Martinez',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        '1988-03-18',
        'Male',
        'Trainer'
    );
GO

-- Insert Trainer Data
INSERT INTO
    TrainerData (
        userId,
        specialization,
        experienceYears,
        salary
    )
VALUES (
        9,
        'Strength Training',
        8,
        65000.00
    ),
    (
        10,
        'Cardio & HIIT',
        6,
        58000.00
    ),
    (11, 'CrossFit', 7, 62000.00),
    (
        12,
        'Yoga & Pilates',
        5,
        55000.00
    ),
    (
        13,
        'Bodybuilding',
        9,
        68000.00
    );
GO

-- Insert Membership Details
INSERT INTO
    MembershipDetails (
        userId,
        membershipType,
        membershipStatus
    )
VALUES (1, 'Basic', 'Active'),
    (2, 'Premium', 'Active'),
    (3, 'VIP', 'Active'),
    (4, 'Basic', 'Active'),
    (5, 'Temporary', 'Active'),
    (6, 'Premium', 'Active'),
    (7, 'VIP', 'Active'),
    (8, 'Basic', 'Active'),
    (9, 'Premium', 'Active'),
    (10, 'Temporary', 'Active'),
    (11, 'Basic', 'Active'),
    (12, 'Premium', 'Active'),
    (13, 'VIP', 'Active'),
    (14, 'Basic', 'Active'),
    (15, 'Premium', 'Active');
GO

-- Insert Classes
INSERT INTO
    Class (
        className,
        trainerId,
        genderSpecific,
        seats
    )
VALUES (
        'Morning Strength',
        9,
        'Male',
        20
    ),
    (
        'Cardio Blast',
        10,
        'Female',
        25
    ),
    (
        'CrossFit Elite',
        11,
        'Male',
        15
    ),
    ('Yoga Flow', 12, 'Female', 30),
    (
        'Bodybuilding Basics',
        13,
        'Male',
        18
    ),
    (
        'HIIT Training',
        9,
        'Male',
        22
    ),
    (
        'Pilates Core',
        12,
        'Female',
        20
    ),
    (
        'Powerlifting',
        11,
        'Male',
        12
    );
GO

-- Insert Class Days
INSERT INTO
    ClassDays (classId, Day)
VALUES (1, 'Monday'),
    (1, 'Wednesday'),
    (1, 'Friday'),
    (2, 'Tuesday'),
    (2, 'Thursday'),
    (2, 'Saturday'),
    (3, 'Monday'),
    (3, 'Wednesday'),
    (3, 'Friday'),
    (4, 'Tuesday'),
    (4, 'Thursday'),
    (4, 'Saturday'),
    (5, 'Monday'),
    (5, 'Wednesday'),
    (5, 'Friday'),
    (6, 'Tuesday'),
    (6, 'Thursday'),
    (6, 'Saturday'),
    (7, 'Monday'),
    (7, 'Tuesday'),
    (7, 'Wednesday'),
    (7, 'Thursday'),
    (8, 'Monday'),
    (8, 'Wednesday'),
    (8, 'Friday');
GO

-- Insert Class Enrollments
INSERT INTO
    Class_Enrollment (memberId, classId)
VALUES (1, 1),
    (1, 3),
    (1, 5),
    (2, 2),
    (2, 4),
    (2, 7),
    (3, 1),
    (3, 6),
    (3, 8),
    (4, 2),
    (4, 4),
    (4, 7),
    (5, 1),
    (5, 3),
    (5, 5),
    (6, 2),
    (6, 4),
    (6, 7),
    (7, 1),
    (7, 6),
    (7, 8),
    (8, 2),
    (8, 4),
    (8, 7),
    (9, 1),
    (9, 3),
    (9, 5),
    (10, 2),
    (10, 4),
    (10, 7),
    (11, 1),
    (11, 6),
    (11, 8),
    (12, 2),
    (12, 4),
    (12, 7),
    (13, 1),
    (13, 3),
    (13, 5),
    (14, 2),
    (14, 4),
    (14, 7),
    (15, 1),
    (15, 6),
    (15, 8);
GO

-- Insert Attendance Records (last 30 days)
DECLARE @StartDate DATE = DATEADD(DAY, -30, GETDATE());
DECLARE @CurrentDate DATE = @StartDate;

WHILE @CurrentDate <= GETDATE()
BEGIN
    INSERT INTO Attendance (enrollmentId, currDate, attendanceStatus)
    SELECT 
        enrollmentId,
        @CurrentDate,
        CASE WHEN RAND(CHECKSUM(NEWID())) > 0.3 THEN 'P' ELSE 'A' END
    FROM Class_Enrollment;
    
    SET @CurrentDate = DATEADD(DAY, 1, @CurrentDate);
END
GO

-- Insert Payments (last 6 months)
DECLARE @PaymentStartDate DATE = DATEADD(MONTH, -6, GETDATE());
DECLARE @PaymentDate DATE = @PaymentStartDate;

WHILE @PaymentDate <= GETDATE()
BEGIN
    INSERT INTO Payment (memberId, amount, paymentDate, paymentMethod, status)
    SELECT 
        userId,
        CAST(RAND(CHECKSUM(NEWID())) * 2000 + 1000 AS DECIMAL(10,2)),
        @PaymentDate,
        CASE 
            WHEN RAND(CHECKSUM(NEWID())) < 0.25 THEN 'Cash'
            WHEN RAND(CHECKSUM(NEWID())) < 0.5 THEN 'Credit Card'
            WHEN RAND(CHECKSUM(NEWID())) < 0.75 THEN 'Debit Card'
            ELSE 'Online'
        END,
        CASE 
            WHEN RAND(CHECKSUM(NEWID())) < 0.8 THEN 'Completed'
            WHEN RAND(CHECKSUM(NEWID())) < 0.95 THEN 'Pending'
            ELSE 'Failed'
        END
    FROM gymUser 
    WHERE userRole = 'Member';
    
    SET @PaymentDate = DATEADD(MONTH, 1, @PaymentDate);
END
GO

-- Insert Workout Plans
INSERT INTO
    WorkoutPlan (
        memberId,
        trainerId,
        plan_name,
        duration_weeks
    )
VALUES (1, 9, 'Fat Loss Beginner', 4),
    (
        2,
        10,
        'Muscle Gain Intermediate',
        6
    ),
    (3, 11, 'Endurance Pro', 8),
    (4, 12, 'Strength Building', 4),
    (
        5,
        13,
        'Cardio Conditioning',
        6
    ),
    (6, 9, 'Flexibility Focus', 8),
    (
        7,
        10,
        'Powerlifting Program',
        4
    ),
    (8, 11, 'CrossFit Training', 6),
    (9, 12, 'Yoga Journey', 8),
    (
        10,
        13,
        'Fat Loss Beginner',
        4
    ),
    (
        11,
        9,
        'Muscle Gain Intermediate',
        6
    ),
    (12, 10, 'Endurance Pro', 8),
    (
        13,
        11,
        'Strength Building',
        4
    ),
    (
        14,
        12,
        'Cardio Conditioning',
        6
    ),
    (
        15,
        13,
        'Flexibility Focus',
        8
    );
GO

PRINT 'Database populated successfully!';

PRINT 'Added 15 members, 5 trainers, 8 classes, and sample data for all tables.';

PRINT '';

PRINT 'Test Credentials:';

PRINT 'Admin: admin@test.com / admin123';

PRINT 'Trainer: trainer.james@email.com / pass123';

PRINT 'Member: john.doe@email.com / pass123';
GO