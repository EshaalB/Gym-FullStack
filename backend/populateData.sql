-- Plain text passwords for all users (for development only!)
-- adminpass, trainerpass1, trainerpass2, ...

-- Clear all data (respecting FK constraints)
DELETE FROM Attendance;

DELETE FROM Class_Enrollment;

DELETE FROM ClassDays;

DELETE FROM Payment;

DELETE FROM WorkoutPlan;

DELETE FROM Class;

DELETE FROM MembershipDetails;

DELETE FROM TrainerData;

DELETE FROM gymUser;

-- Insert Admin with explicit userId=1
SET IDENTITY_INSERT gymUser ON;

INSERT INTO
    gymUser (
        userId,
        email,
        fName,
        lName,
        password,
        dateofBirth,
        gender,
        userRole
    )
VALUES (
        1,
        'admin@gym.com',
        'Admin',
        'User',
        'adminpass',
        '1980-01-01',
        'Other',
        'Admin'
    );

SET IDENTITY_INSERT gymUser OFF;

-- Insert Trainers and capture their IDs
DECLARE @trainer1Id INT,
@trainer2Id INT,
@trainer3Id INT,
@trainer4Id INT,
@trainer5Id INT;

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
        'trainer1@gym.com',
        'John',
        'Doe',
        'trainerpass1',
        '1985-05-10',
        'Male',
        'Trainer'
    );

SET
    @trainer1Id = SCOPE_IDENTITY ();

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
        'trainer2@gym.com',
        'Jane',
        'Smith',
        'trainerpass2',
        '1987-07-15',
        'Female',
        'Trainer'
    );

SET
    @trainer2Id = SCOPE_IDENTITY ();

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
        'trainer3@gym.com',
        'Mike',
        'Brown',
        'trainerpass3',
        '1982-03-22',
        'Male',
        'Trainer'
    );

SET
    @trainer3Id = SCOPE_IDENTITY ();

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
        'trainer4@gym.com',
        'Sara',
        'Lee',
        'trainerpass4',
        '1990-11-30',
        'Female',
        'Trainer'
    );

SET
    @trainer4Id = SCOPE_IDENTITY ();

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
        'trainer5@gym.com',
        'Alex',
        'Kim',
        'trainerpass5',
        '1984-09-18',
        'Other',
        'Trainer'
    );

SET
    @trainer5Id = SCOPE_IDENTITY ();

-- Insert TrainerData
INSERT INTO
    TrainerData (
        userId,
        specialization,
        experienceYears,
        salary
    )
VALUES (
        @trainer1Id,
        'Strength',
        5,
        50000
    ),
    (
        @trainer2Id,
        'Cardio',
        7,
        52000
    ),
    (
        @trainer3Id,
        'Yoga',
        10,
        54000
    ),
    (
        @trainer4Id,
        'Crossfit',
        2,
        51000
    ),
    (
        @trainer5Id,
        'Bodybuilding',
        8,
        53000
    );

-- Insert Members and capture their IDs
DECLARE @member1Id INT,
@member2Id INT,
@member3Id INT,
@member4Id INT,
@member5Id INT;

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
        'member1@gym.com',
        'Alice',
        'Wong',
        'memberpass1',
        '2000-01-01',
        'Female',
        'Member'
    );

SET
    @member1Id = SCOPE_IDENTITY ();

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
        'member2@gym.com',
        'Bob',
        'Green',
        'memberpass2',
        '1999-02-02',
        'Male',
        'Member'
    );

SET
    @member2Id = SCOPE_IDENTITY ();

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
        'member3@gym.com',
        'Carol',
        'White',
        'memberpass3',
        '1998-03-03',
        'Female',
        'Member'
    );

SET
    @member3Id = SCOPE_IDENTITY ();

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
        'member4@gym.com',
        'David',
        'Black',
        'memberpass4',
        '1997-04-04',
        'Male',
        'Member'
    );

SET
    @member4Id = SCOPE_IDENTITY ();

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
        'member5@gym.com',
        'Eva',
        'Gray',
        'memberpass5',
        '1996-05-05',
        'Female',
        'Member'
    );

SET
    @member5Id = SCOPE_IDENTITY ();

-- Insert MembershipDetails
INSERT INTO
    MembershipDetails (
        userId,
        membershipType,
        membershipStatus
    )
VALUES (@member1Id, 'Basic', 'Active'),
    (
        @member2Id,
        'Premium',
        'Active'
    ),
    (@member3Id, 'VIP', 'Inactive'),
    (@member4Id, 'Basic', 'Active'),
    (
        @member5Id,
        'Premium',
        'Inactive'
    );

-- Insert Classes (using captured trainer IDs)
DECLARE @class1Id INT,
@class2Id INT;

INSERT INTO
    Class (
        className,
        trainerId,
        genderSpecific,
        seats
    )
VALUES (
        'Strength Training',
        @trainer1Id,
        'Male',
        5
    );

SET
    @class1Id = SCOPE_IDENTITY ();

INSERT INTO
    Class (
        className,
        trainerId,
        genderSpecific,
        seats
    )
VALUES (
        'Cardio Blast',
        @trainer2Id,
        'Female',
        5
    );

SET
    @class2Id = SCOPE_IDENTITY ();

-- Insert ClassDays
INSERT INTO
    ClassDays (classId, Day)
VALUES (@class1Id, 'Monday'),
    (@class1Id, 'Wednesday'),
    (@class2Id, 'Tuesday');

-- Enroll members in classes
DECLARE @enrollment1Id INT,
@enrollment2Id INT;

INSERT INTO
    Class_Enrollment (memberId, classId)
VALUES (@member1Id, @class1Id);

SET
    @enrollment1Id = SCOPE_IDENTITY ();

INSERT INTO
    Class_Enrollment (memberId, classId)
VALUES (@member2Id, @class2Id);

SET
    @enrollment2Id = SCOPE_IDENTITY ();

-- Insert Attendance
INSERT INTO
    Attendance (
        enrollmentId,
        currDate,
        attendanceStatus
    )
VALUES (
        @enrollment1Id,
        '2024-06-01',
        'P'
    ),
    (
        @enrollment2Id,
        '2024-06-01',
        'A'
    );

-- Insert Payments
INSERT INTO
    Payment (
        memberId,
        amount,
        paymentDate,
        paymentMethod,
        status
    )
VALUES (
        @member1Id,
        1000,
        '2024-06-01',
        'Cash',
        'Completed'
    ),
    (
        @member2Id,
        1200,
        '2024-06-02',
        'Credit Card',
        'Pending'
    );

-- Insert Workout Plans
INSERT INTO
    WorkoutPlan (
        memberId,
        trainerId,
        plan_name,
        duration_weeks,
        assigned_on
    )
VALUES (
        @member1Id,
        @trainer1Id,
        'Strength Plan',
        6,
        '2024-06-01'
    ),
    (
        @member2Id,
        @trainer2Id,
        'Cardio Plan',
        4,
        '2024-06-02'
    );