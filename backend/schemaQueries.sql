USE gymFinal;
GO

------------------------------------ATIKA QUERIES---------------------------------------------
-- Count Active and Inactive Members
SELECT m.membershipStatus, COUNT(*) AS member_count
FROM
    MembershipDetails m
    JOIN gymUser u ON m.userId = u.userId
WHERE
    u.userRole = 'Member'
GROUP BY
    m.membershipStatus;

-- Retrieve Members Who Have Not Attended Any Class in the Last Month
SELECT u.userId, u.fName, u.lName
FROM
    gymUser u
    JOIN MembershipDetails m ON u.userId = m.userId
    LEFT JOIN Class_Enrollment ce ON m.userId = ce.memberId
    LEFT JOIN Attendance a ON ce.enrollmentId = a.enrollmentId
    AND DATEDIFF(MONTH, a.currDate, GETDATE ()) = 1
WHERE
    u.userRole = 'Member'
    AND a.enrollmentId IS NULL;

-- View: Active Members
CREATE
OR
ALTER VIEW active_members AS
SELECT u.userId, u.fName, u.lName, m.membershipType
FROM
    gymUser u
    JOIN MembershipDetails m ON u.userId = m.userId
WHERE
    u.userRole = 'Member'
    AND m.membershipStatus = 'Active';

-- Class Attendance Rate
SELECT
    ce.memberId,
    COUNT(*) AS TotalClasses,
    COUNT(
        CASE
            WHEN a.attendanceStatus = 'P' THEN 1
        END
    ) AS presentCount,
    COUNT(
        CASE
            WHEN a.attendanceStatus = 'A' THEN 1
        END
    ) AS absentCount,
    (
        COUNT(
            CASE
                WHEN a.attendanceStatus = 'P' THEN 1
            END
        ) * 100.0
    ) / COUNT(*) AS percent_rate
FROM
    Class_Enrollment ce
    JOIN Attendance a ON ce.enrollmentId = a.enrollmentId
GROUP BY
    ce.memberId;

-- Members Who Have Attended More Than 10 Classes in the Last Month
SELECT ce.memberId, u.fName, u.lName, COUNT(*) AS attendance_count
FROM
    Attendance a
    JOIN Class_Enrollment ce ON a.enrollmentId = ce.enrollmentId
    JOIN gymUser u ON ce.memberId = u.userId
WHERE
    a.attendanceStatus = 'P'
    AND DATEDIFF(MONTH, a.currDate, GETDATE ()) = 1
GROUP BY
    ce.memberId,
    u.fName,
    u.lName
HAVING
    COUNT(*) >= 10;

-- View: Members Who Regularly Skip Sessions (More Than 5 Absences in Last Week)
CREATE
OR
ALTER VIEW regular_absentees AS
SELECT ce.memberId, COUNT(*) AS absentsInLastWeek
FROM
    Attendance a
    JOIN Class_Enrollment ce ON a.enrollmentId = ce.enrollmentId
WHERE
    a.attendanceStatus = 'A'
    AND a.currDate >= DATEADD (DAY, -7, GETDATE ())
GROUP BY
    ce.memberId
HAVING
    COUNT(*) >= 5;

-- Stored Procedure: Register User
CREATE OR ALTER PROCEDURE registerUser 
    @fname VARCHAR(100), 
    @lname VARCHAR(100), 
    @email VARCHAR(100), 
    @password VARCHAR(100),
    @dateofbirth DATE, 
    @gender VARCHAR(20), 
    @userrole VARCHAR(20), 
    @specialization VARCHAR(100) = NULL, 
    @experienceyears INT = NULL, 
    @salary DECIMAL(10,2) = NULL,
    @membershiptype VARCHAR(10) = 'Temporary', 
    @membershipstatus VARCHAR(15) = 'Active'
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if email already exists
    IF EXISTS (SELECT 1 FROM gymUser WHERE email = @email)
    BEGIN
        RAISERROR ('FAILED: Email already registered! Try again!', 16, 1);
        RETURN;
    END

    -- Check password length
    IF LEN(@password) < 6
    BEGIN
        RAISERROR ('FAILED: Password must be at least 6 characters long! Try again!', 16, 1);
        RETURN;
    END

    -- Check age constraint
    IF @dateofbirth > DATEADD(YEAR, -13, GETDATE())
    BEGIN
        RAISERROR ('FAILED: User must be at least 13 years old.', 16, 1);
        RETURN;
    END

    -- Check gender constraint
    IF @gender NOT IN ('Male', 'Female', 'Other')
    BEGIN
        RAISERROR ('FAILED: Gender must be Male, Female, or Other.', 16, 1);
        RETURN;
    END

    -- Check user role constraint
    IF @userrole NOT IN ('Member', 'Trainer', 'Admin')
    BEGIN
        RAISERROR ('FAILED: User role must be Member, Trainer, or Admin.', 16, 1);
        RETURN;
    END

    -- Role-based constraints
    IF @userrole = 'Trainer' AND (@specialization IS NULL OR @experienceyears IS NULL OR @experienceyears < 2)
    BEGIN
        RAISERROR ('FAILED: Trainers must have a specialization and at least 2 years of experience.', 16, 1);
        RETURN;
    END

    IF @userrole = 'Admin' AND (@specialization IS NOT NULL OR @experienceyears IS NOT NULL OR @salary IS NOT NULL)
    BEGIN
        RAISERROR ('FAILED: Admins should not have specialization, experience years, or salary.', 16, 1);
        RETURN;
    END

    IF @userrole = 'Member' AND (@salary IS NOT NULL OR @experienceyears IS NOT NULL OR @specialization IS NOT NULL)
    BEGIN
        RAISERROR ('FAILED: Members should not have salary, experience years, or specialization.', 16, 1);
        RETURN;
    END

    -- Check membership type
    IF @membershiptype NOT IN ('Basic', 'Premium', 'VIP', 'Temporary')
    BEGIN
        RAISERROR ('FAILED: Membership type must be Basic, Premium, VIP, or Temporary.', 16, 1);
        RETURN;
    END

    -- Check membership status
    IF @membershipstatus NOT IN ('Active', 'Inactive')
    BEGIN
        RAISERROR ('FAILED: Membership status must be Active or Inactive.', 16, 1);
        RETURN;
    END

    BEGIN TRY
        -- Begin transaction
        BEGIN TRANSACTION;

        -- Insert user into gymUser table
        INSERT INTO gymUser (fName, lName, email, password, dateofBirth, gender, userRole)
        VALUES (@fname, @lname, @email, @password, @dateofbirth, @gender, @userrole);

        DECLARE @userId INT = SCOPE_IDENTITY();

        -- Insert into TrainerData if user is a Trainer
        IF @userrole = 'Trainer'
        BEGIN
            INSERT INTO TrainerData (userId, specialization, experienceYears, salary)
            VALUES (@userId, @specialization, @experienceyears, @salary);
        END

        -- Insert into MembershipDetails if user is a Member
        IF @userrole = 'Member'
        BEGIN
            INSERT INTO MembershipDetails (userId, membershipType, membershipStatus)
            VALUES (@userId, @membershiptype, @membershipstatus);
        END

        -- Commit transaction
        COMMIT TRANSACTION;
        PRINT 'Successfully registered a new user!';
    END TRY
    BEGIN CATCH
        -- Rollback transaction on error
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR (@ErrorMessage, 16, 1);
    END CATCH
END;

-- Example Execution
EXEC registerUser @fname = 'John',
@lname = 'Doe',
@email = 'john.lee@email.com',
@password = 'secure123',
@dateofbirth = '1993-05-10',
@gender = 'Male',
@userrole = 'Trainer',
@specialization = 'Strength Training',
@experienceyears = 5,
@salary = 50000;

EXEC registerUser @fname = 'Adam',
@lname = 'Henry',
@email = 'adamhenry@email.com',
@password = 'mypassword',
@dateofbirth = '1998-07-15',
@gender = 'Female',
@userrole = 'Member';

-- Stored Procedure: Mark Attendance
CREATE OR ALTER PROCEDURE markAttendance
    @memberId INT,
    @classId INT,  
    @attendanceStatus VARCHAR(2),
    @currDate DATE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @enrollmentId INT;
    DECLARE @result INT = 0; -- 0 = success, 1 = not enrolled, 2 = already marked, 3 = invalid status, 4 = user not found

    -- Check if user exists
    IF NOT EXISTS (SELECT 1 FROM gymUser WHERE userId = @memberId AND userRole = 'Member')
    BEGIN
        SELECT @result = 4;
        SELECT @result AS Result, 'User does not exist or is not a Member!' AS Message;
        RETURN;
    END

    -- Check if member is enrolled in the class
    SELECT @enrollmentId = enrollmentId
    FROM Class_Enrollment
    WHERE memberId = @memberId AND classId = @classId;

    IF @enrollmentId IS NULL
    BEGIN
        SELECT @result = 1;
        SELECT @result AS Result, 'Member not enrolled in given class!' AS Message;
        RETURN;
    END

    -- Check if attendance is already marked
    IF EXISTS (
        SELECT 1 
        FROM Attendance
        WHERE enrollmentId = @enrollmentId 
            AND currDate = @currDate
    )
    BEGIN
        SELECT @result = 2;
        SELECT @result AS Result, 'Attendance already marked for this day!' AS Message;
        RETURN;
    END

    -- Validate attendance status
    IF @attendanceStatus NOT IN ('P', 'A', 'L')
    BEGIN
        SELECT @result = 3;
        SELECT @result AS Result, 'Invalid attendance status! Use P for Present, A for Absent, or L for Late.' AS Message;
        RETURN;
    END

    -- Insert attendance record
    INSERT INTO Attendance (enrollmentId, currDate, attendanceStatus)
    VALUES (@enrollmentId, @currDate, @attendanceStatus);

    SELECT @result AS Result, 'Attendance marked successfully!' AS Message;
END;

-- Example Execution
EXEC markAttendance @memberId = 2,
@classId = 3,
@attendanceStatus = 'P',
@currDate = '2024-03-23';

------------------------------------ROHAIL QUERIES---------------------------------------------

-- Query: Trainers and Their Assigned Classes
SELECT
    u.userId AS TrainerID,
    u.fName AS FirstName,
    u.lName AS LastName,
    c.classId,
    c.className
FROM
    gymUser u
    JOIN TrainerData td ON u.userId = td.userId
    JOIN Class c ON td.userId = c.trainerId
WHERE
    u.userRole = 'Trainer';

-- Query: List of Trainers with Less Than 2 Classes Assigned
SELECT
    u.userId AS TrainerID,
    u.fName AS FirstName,
    u.lName AS LastName,
    COUNT(c.classId) AS AssignedClasses
FROM
    gymUser u
    JOIN TrainerData td ON u.userId = td.userId
    LEFT JOIN Class c ON td.userId = c.trainerId
WHERE
    u.userRole = 'Trainer'
GROUP BY
    u.userId,
    u.fName,
    u.lName
HAVING
    COUNT(c.classId) < 2;

-- Stored Procedure: Assign Trainer to a Class (Handles Workload Constraints)
CREATE OR ALTER PROCEDURE AssignTrainerToClass
    @trainerId INT,
    @classId INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @result INT = 0; -- 0 = success, 1 = class has trainer, 2 = trainer not found, 3 = trainer overloaded

    -- Check if trainer exists
    IF NOT EXISTS (
        SELECT 1 
        FROM TrainerData 
        WHERE userId = @trainerId
    )
    BEGIN
        SELECT @result = 2;
        SELECT @result AS Result, 'Trainer does not exist.' AS Message;
        RETURN;
    END
    
    -- Check trainer's workload (allow reassignment, just warn if overloaded)
    IF (
        SELECT COUNT(*) 
        FROM Class 
        WHERE trainerId = @trainerId
    ) >= 3
    BEGIN
        SELECT @result = 3;
        SELECT @result AS Result, 'Warning: Trainer already has 3 or more classes assigned.' AS Message;
        -- Don't return, just warn but allow assignment
    END
    
    -- Assign trainer to class (this will update if trainer already exists)
    UPDATE Class 
    SET trainerId = @trainerId 
    WHERE classId = @classId;

    -- Check if update was successful
    IF @@ROWCOUNT = 0
    BEGIN
        SELECT @result = 4;
        SELECT @result AS Result, 'Class does not exist.' AS Message;
        RETURN;
    END

    SELECT @result AS Result, 'Trainer assigned to class successfully!' AS Message;
END;

-- Example Execution
EXEC AssignTrainerToClass @trainerId = 1, @classId = 1;

-- Stored Procedure: Assign Member to a Class (Prevents duplicate enrollment and checks seat limits)
CREATE OR ALTER PROCEDURE AssignMemberToClass
    @memberId INT,
    @classId INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @result INT = 0; -- 0 = success, 1 = already enrolled, 2 = class full, 3 = member not found, 4 = class not found

    -- Check if member is already enrolled in the class
    IF EXISTS (
        SELECT 1 FROM Class_Enrollment WHERE memberId = @memberId AND classId = @classId
    )
    BEGIN
        SELECT @result = 1;
        SELECT @result AS Result, 'Member is already enrolled in this class.' AS Message;
        RETURN;
    END

    -- Check if class exists and get seat info
    DECLARE @seats INT, @enrolled INT;
    SELECT @seats = seats FROM Class WHERE classId = @classId;
    IF @seats IS NULL
    BEGIN
        SELECT @result = 4;
        SELECT @result AS Result, 'Class does not exist.' AS Message;
        RETURN;
    END
    
    SELECT @enrolled = COUNT(*) FROM Class_Enrollment WHERE classId = @classId;
    IF @enrolled >= @seats
    BEGIN
        SELECT @result = 2;
        SELECT @result AS Result, 'Class is already full.' AS Message;
        RETURN;
    END

    -- Check if member exists and is active
    IF NOT EXISTS (
        SELECT 1 FROM MembershipDetails WHERE userId = @memberId AND membershipStatus = 'Active'
    )
    BEGIN
        SELECT @result = 3;
        SELECT @result AS Result, 'Member does not exist or is not active.' AS Message;
        RETURN;
    END

    -- Insert enrollment
    INSERT INTO Class_Enrollment (memberId, classId) VALUES (@memberId, @classId);
    SELECT @result AS Result, 'Member assigned to class successfully!' AS Message;
END;

-- Example Execution
-- EXEC AssignMemberToClass @memberId = 2, @classId = 1;

-- View: Underfilled Classes (<50% Seats Filled)
CREATE
OR
ALTER VIEW UnderfilledClasses AS
SELECT c.classId, c.className, c.seats, COUNT(ce.memberId) AS EnrolledMembers
FROM Class c
    LEFT JOIN Class_Enrollment ce ON c.classId = ce.classId
GROUP BY
    c.classId,
    c.className,
    c.seats
HAVING
    COUNT(ce.memberId) < (c.seats / 2);

-- Query to Select from View
SELECT * FROM UnderfilledClasses;

-- Query: Members Without a Workout Plan
SELECT u.userId, u.fName, u.lName
FROM
    gymUser u
    JOIN MembershipDetails m ON u.userId = m.userId
    LEFT JOIN WorkoutPlan wp ON u.userId = wp.memberId
WHERE
    u.userRole = 'Member'
    AND wp.planId IS NULL;

-- Query: Most Popular Workout Plan Based on Assignments
SELECT wp.planId, wp.plan_name, COUNT(wp.memberId) AS AssignedMembers
FROM WorkoutPlan wp
    JOIN gymUser u ON wp.memberId = u.userId
WHERE
    u.userRole = 'Member'
GROUP BY
    wp.planId,
    wp.plan_name
ORDER BY COUNT(wp.memberId) DESC;

-- Stored Procedure: Assign Workout Plan (Auto-selects a Trainer)
CREATE OR ALTER PROCEDURE AssignWorkoutPlan
    @memberId INT,
    @planName VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @trainerId INT;

    -- Check if member exists
    IF NOT EXISTS (
        SELECT 1 
        FROM MembershipDetails 
        WHERE userId = @memberId
    )
    BEGIN
        RAISERROR ('FAILED: Member does not exist.', 16, 1);
        RETURN;
    END

    -- Randomly select a trainer
    SET @trainerId = (
        SELECT TOP 1 userId 
        FROM TrainerData 
        ORDER BY NEWID()
    );

    IF @trainerId IS NULL
    BEGIN
        RAISERROR ('FAILED: No trainers available.', 16, 1);
        RETURN;
    END

    -- Insert workout plan
    INSERT INTO WorkoutPlan (memberId, trainerId, plan_name) 
    VALUES (@memberId, @trainerId, @planName);

    PRINT 'Workout plan assigned successfully!';
END;

-- Example Execution
EXEC AssignWorkoutPlan @memberId = 3,
@planName = 'Strength Training';

------------------------------------ESHAAL QUERIES---------------------------------------------
-- Query: Total Revenue by Membership Type
SELECT m.membershipType, SUM(p.amount) AS totalRevenue
FROM
    Payment p
    JOIN MembershipDetails m ON p.memberId = m.userId
WHERE
    p.status = 'Completed'
GROUP BY
    m.membershipType;

-- Query: Monthly Revenue Trend Over the Last 6 Months
SELECT YEAR(p.paymentDate) AS Year, MONTH(p.paymentDate) AS Month, m.membershipType, SUM(p.amount) AS totalRevenue
FROM
    Payment p
    JOIN MembershipDetails m ON p.memberId = m.userId
WHERE
    p.paymentDate >= DATEADD (
        MONTH,
        -6,
        EOMONTH (GETDATE ())
    )
    AND p.status = 'Completed'
GROUP BY
    YEAR(p.paymentDate),
    MONTH(p.paymentDate),
    m.membershipType
ORDER BY Year ASC, Month ASC, m.membershipType;

-- Stored Procedure: Process Payment (Ensures Valid Transactions & Updates Member Status)
CREATE OR ALTER PROCEDURE ProcessPayment
    @memberId INT,
    @amount DECIMAL(10,2),
    @paymentDate DATE,
    @paymentMethod VARCHAR(30),
    @status VARCHAR(15) = 'Completed'
AS
BEGIN
    SET NOCOUNT ON;

    -- Validate member
    IF NOT EXISTS (
        SELECT 1 
        FROM MembershipDetails 
        WHERE userId = @memberId
    )
    BEGIN
        RAISERROR ('ERROR: Invalid Member ID', 16, 1);
        RETURN;
    END

    -- Validate amount
    IF @amount <= 0
    BEGIN
        RAISERROR ('ERROR: Invalid Payment Amount', 16, 1);
        RETURN;
    END

    -- Validate payment method
    IF @paymentMethod NOT IN ('Cash', 'Credit Card', 'Debit Card', 'Online')
    BEGIN
        RAISERROR ('ERROR: Invalid Payment Method', 16, 1);
        RETURN;
    END

    -- Validate status
    IF @status NOT IN ('Pending', 'Completed', 'Failed')
    BEGIN
        RAISERROR ('ERROR: Invalid Payment Status', 16, 1);
        RETURN;
    END

    -- Insert payment
    INSERT INTO Payment (memberId, amount, paymentDate, paymentMethod, status) 
    VALUES (@memberId, @amount, @paymentDate, @paymentMethod, @status);

    -- Update membership status if payment is completed
    IF @status = 'Completed'
    BEGIN
        UPDATE MembershipDetails 
        SET membershipStatus = 'Active'
        WHERE userId = @memberId;
    END

    PRINT 'Payment processed successfully!';
END;

-- Example Execution
EXEC ProcessPayment @memberId = 2,
@amount = 5000.00,
@paymentDate = '2025-03-23',
@paymentMethod = 'Credit Card',
@status = 'Completed';

-- View: Pending Payments
CREATE
OR
ALTER VIEW pendingPayments AS
SELECT p.paymentId, p.memberId, u.fName, u.lName, p.amount, p.paymentDate
FROM Payment p
    JOIN gymUser u ON p.memberId = u.userId
WHERE
    p.status = 'Pending';

CREATE PROCEDURE GetUserDetails
    @userId INT
AS
BEGIN
    SELECT userId, fName, lName, email, userRole 
    FROM gymUser
    WHERE userId = @userId;
END;

-- Stored Procedure to Fetch User Classes
CREATE PROCEDURE GetUserClasses
    @userId INT
AS
BEGIN
    SELECT c.className, c.classTime, t.fName AS trainerName
    FROM Class_Enrollment ce
    JOIN Class c ON ce.classId = c.classId
    JOIN gymUser t ON c.trainerId = t.userId
    WHERE ce.memberId = @userId;
END;

-- Stored Procedure to Fetch Membership Status
CREATE PROCEDURE GetMembershipStatus
    @userId INT
AS
BEGIN
    SELECT membershipStatus AS status
    FROM MembershipDetails
    WHERE userId = @userId;
END;

-- Stored Procedure to Fetch Workout Plan
CREATE PROCEDURE GetWorkoutPlan
    @userId INT
AS
BEGIN
    SELECT wp.plan_name AS planName, wp.duration_weeks AS durationWeeks, 
           t.fName AS trainerName, wp.assigned_on
    FROM WorkoutPlan wp
    JOIN gymUser t ON wp.trainerId = t.userId
    WHERE wp.memberId = @userId;
END;
GO

-- Stored Procedure to Fetch Attendance
CREATE PROCEDURE GetAttendance
    @userId INT
AS
BEGIN
    SELECT c.className, 
           COUNT(CASE WHEN a.attendanceStatus = 'P' THEN 1 END) AS presentCount,
           COUNT(CASE WHEN a.attendanceStatus = 'A' THEN 1 END) AS absentCount,
           COUNT(*) AS totalClasses,
           (COUNT(CASE WHEN a.attendanceStatus = 'P' THEN 1 END) * 100.0) / COUNT(*) AS percent
    FROM Attendance a
    JOIN Class_Enrollment ce ON a.enrollmentId = ce.enrollmentId
    JOIN Class c ON ce.classId = c.classId
    WHERE ce.memberId = @userId
    GROUP BY c.className;
END;
GO