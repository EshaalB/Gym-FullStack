-- Drop and recreate database
DROP DATABASE IF EXISTS gymFinal;
CREATE DATABASE gymFinal;
GO
USE gymFinal;
GO

-- Table Definitions
CREATE TABLE gymUser (
    userId INT PRIMARY KEY IDENTITY(1,1),
    email VARCHAR(100) NOT NULL CONSTRAINT UQ_GymUser_Email UNIQUE,
    fName VARCHAR(100) NOT NULL,
    lName VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL CONSTRAINT pass_check CHECK (DATALENGTH(password) >= 6),
    age AS DATEDIFF(YEAR, dateofBirth, GETDATE()),
    dateofBirth DATE CONSTRAINT age_check CHECK (dateofBirth <= DATEADD(YEAR, -13, GETDATE())) NOT NULL,
    gender VARCHAR(20) CONSTRAINT gender_check CHECK (gender IN ('Male', 'Female', 'Other')) NOT NULL,
    userRole VARCHAR(20) CONSTRAINT user_check CHECK (userRole IN ('Member', 'Trainer', 'Admin')) NOT NULL
);

CREATE TABLE TrainerData (
    userId INT PRIMARY KEY,
    specialization VARCHAR(100),  
    experienceYears INT CHECK (experienceYears >= 2),
    salary DECIMAL(10,2),
    FOREIGN KEY (userId) REFERENCES gymUser(userId) ON DELETE NO ACTION
);

CREATE TABLE MembershipDetails (
    userId INT PRIMARY KEY,
    membershipType VARCHAR(10) CHECK (membershipType IN ('Basic', 'Premium', 'VIP', 'Temporary')) DEFAULT 'Temporary',
    membershipStatus VARCHAR(15) CHECK (membershipStatus IN ('Active', 'Inactive')) DEFAULT 'Active',
    FOREIGN KEY (userId) REFERENCES gymUser(userId) ON DELETE NO ACTION
);

CREATE TABLE Class (
    classId INT PRIMARY KEY IDENTITY(1,1),
    className VARCHAR(100) NOT NULL,
    trainerId INT,
    FOREIGN KEY (trainerId) REFERENCES TrainerData(userId) ON DELETE NO ACTION,
    genderSpecific VARCHAR(10) CHECK (genderSpecific IN ('Male', 'Female')) NOT NULL,
    seats INT NOT NULL DEFAULT 50
);

CREATE TABLE ClassDays (
    classId INT NOT NULL,
    Day VARCHAR(255) CHECK (Day in ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')) NOT NULL,
    PRIMARY KEY (classId, Day),
    FOREIGN KEY (classId) REFERENCES Class(classId) ON DELETE CASCADE
);

CREATE TABLE Class_Enrollment (
    enrollmentId INT PRIMARY KEY IDENTITY(1,1),
    memberId INT NOT NULL,
    classId INT NOT NULL,
    enrolled_on DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (memberId) REFERENCES MembershipDetails(userId) ON DELETE NO ACTION,
    FOREIGN KEY (classId) REFERENCES Class(classId) ON DELETE NO ACTION,
    CONSTRAINT unique_member_class UNIQUE (memberId, classId)
);

CREATE TABLE Attendance (
    enrollmentId INT NOT NULL,
    currDate DATE NOT NULL,
    attendanceStatus VARCHAR(2) CHECK (attendanceStatus IN ('P', 'A')) NOT NULL,
    CONSTRAINT PK_Attendance PRIMARY KEY (enrollmentId, currDate),
    FOREIGN KEY (enrollmentId) REFERENCES Class_Enrollment(enrollmentId) ON DELETE CASCADE
);

CREATE TABLE Payment (
    paymentId INT PRIMARY KEY IDENTITY(1,1),
    memberId INT,
    amount DECIMAL(10,2),
    paymentDate DATE,
    paymentMethod VARCHAR(30) CHECK (paymentMethod IN ('Cash', 'Credit Card', 'Debit Card', 'Online')),
    status VARCHAR(15) CHECK (status IN ('Pending', 'Completed', 'Failed')) DEFAULT 'Pending',
    FOREIGN KEY (memberId) REFERENCES MembershipDetails(userId) ON DELETE NO ACTION
);

CREATE TABLE WorkoutPlan (
    planId INT PRIMARY KEY IDENTITY(1,1),
    memberId INT,
    trainerId INT,
    plan_name VARCHAR(100),
    duration_weeks INT DEFAULT 4,
    assigned_on DATE DEFAULT GETDATE(),
    CONSTRAINT FK_Workout_Member FOREIGN KEY (memberId) REFERENCES gymUser(userId) ON DELETE NO ACTION,
    CONSTRAINT FK_Workout_Trainer FOREIGN KEY (trainerId) REFERENCES gymUser(userId) ON DELETE NO ACTION
);

-- Insert Users
INSERT INTO gymUser (email, fName, lName, password, dateofBirth, gender, userRole) VALUES
('member1@test.com', 'Ali', 'One', 'pass123', '2001-01-01', 'Male', 'Member'),
('member2@test.com', 'Sara', 'Two', 'pass123', '2002-02-02', 'Female', 'Member'),
('member3@test.com', 'Ahmed', 'Three', 'pass123', '2000-03-03', 'Male', 'Member'),
('member4@test.com', 'Zara', 'Four', 'pass123', '1999-04-04', 'Female', 'Member'),
('member5@test.com', 'Omar', 'Five', 'pass123', '1998-05-05', 'Male', 'Member'),
('trainer1@test.com', 'Tariq', 'Coach', 'pass123', '1985-06-06', 'Male', 'Trainer'),
('trainer2@test.com', 'Hina', 'Fit', 'pass123', '1990-07-07', 'Female', 'Trainer'),
('admin@test.com', 'Admin', 'Boss', 'admin12', '1980-08-08', 'Other', 'Admin');

-- Insert Trainer Data
INSERT INTO TrainerData (userId, specialization, experienceYears, salary) VALUES
(6, 'Strength', 5, 50000.00),
(7, 'Cardio', 4, 48000.00);

-- Insert Membership Details
INSERT INTO MembershipDetails (userId, membershipType, membershipStatus) VALUES
(1, 'Basic', 'Active'),
(2, 'Premium', 'Active'),
(3, 'VIP', 'Active'),
(4, 'Basic', 'Active'),
(5, 'Temporary', 'Active');

-- Insert Class and Class Days
INSERT INTO Class (className, trainerId, genderSpecific) VALUES
('Morning Burn', 6, 'Male');

INSERT INTO ClassDays (classId, Day) VALUES
(1, 'Monday'),
(1, 'Wednesday'),
(1, 'Friday');

-- Enroll Members in Class
INSERT INTO Class_Enrollment (memberId, classId) VALUES
(1, 1),
(2, 1),
(3, 1);

-- Attendance Records
INSERT INTO Attendance (enrollmentId, currDate, attendanceStatus) VALUES
(1, '2025-04-24', 'P'),
(2, '2025-04-24', 'A'),
(3, '2025-04-24', 'P');

-- Payments
INSERT INTO Payment (memberId, amount, paymentDate, paymentMethod, status) VALUES
(1, 2000.00, '2025-04-20', 'Cash', 'Completed'),
(2, 2500.00, '2025-04-21', 'Online', 'Completed'),
(3, 3000.00, '2025-04-22', 'Debit Card', 'Completed');

-- Workout Plans
INSERT INTO WorkoutPlan (memberId, trainerId, plan_name, duration_weeks) VALUES
(1, 6, 'Fat Loss Beginner', 4),
(2, 6, 'Muscle Gain Intermediate', 6),
(3, 7, 'Endurance Pro', 8);
 