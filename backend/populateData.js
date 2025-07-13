require('dotenv').config();
const sql = require('mssql');
const bcrypt = require('bcryptjs');

const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'yourStrong(!)Password',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE || 'gymFinal',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  },
  port: parseInt(process.env.DB_PORT) || 1433
};

async function populateDatabase() {
  let pool;
  try {
    console.log('Connecting to database with config:', {
      server: config.server,
      database: config.database,
      port: config.port
    });
    
    pool = await sql.connect(config);
    console.log('✅ Connected to database successfully');

    // Hash passwords
    const hashedPassword = await bcrypt.hash('pass123', 10);
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);

    // Clear existing data (except admin)
    console.log('Clearing existing data...');
    await pool.request().query(`
      DELETE FROM Attendance;
      DELETE FROM Class_Enrollment;
      DELETE FROM ClassDays;
      DELETE FROM Class;
      DELETE FROM WorkoutPlan;
      DELETE FROM Payment;
      DELETE FROM MembershipDetails WHERE userId != 8;
      DELETE FROM TrainerData WHERE userId != 8;
      DELETE FROM gymUser WHERE userId != 8;
    `);

    console.log('Inserting users...');
    // Insert Users (Members)
    const memberUsers = [
      { email: 'john.doe@email.com', fName: 'John', lName: 'Doe', dateofBirth: '1995-03-15', gender: 'Male' },
      { email: 'sarah.wilson@email.com', fName: 'Sarah', lName: 'Wilson', dateofBirth: '1992-07-22', gender: 'Female' },
      { email: 'mike.chen@email.com', fName: 'Mike', lName: 'Chen', dateofBirth: '1988-11-08', gender: 'Male' },
      { email: 'emma.rodriguez@email.com', fName: 'Emma', lName: 'Rodriguez', dateofBirth: '1990-04-12', gender: 'Female' },
      { email: 'david.kim@email.com', fName: 'David', lName: 'Kim', dateofBirth: '1993-09-30', gender: 'Male' },
      { email: 'lisa.thompson@email.com', fName: 'Lisa', lName: 'Thompson', dateofBirth: '1987-12-05', gender: 'Female' },
      { email: 'james.brown@email.com', fName: 'James', lName: 'Brown', dateofBirth: '1991-06-18', gender: 'Male' },
      { email: 'anna.garcia@email.com', fName: 'Anna', lName: 'Garcia', dateofBirth: '1994-01-25', gender: 'Female' },
      { email: 'robert.taylor@email.com', fName: 'Robert', lName: 'Taylor', dateofBirth: '1989-08-14', gender: 'Male' },
      { email: 'maria.lee@email.com', fName: 'Maria', lName: 'Lee', dateofBirth: '1996-02-28', gender: 'Female' },
      { email: 'chris.martinez@email.com', fName: 'Chris', lName: 'Martinez', dateofBirth: '1990-10-03', gender: 'Male' },
      { email: 'jennifer.white@email.com', fName: 'Jennifer', lName: 'White', dateofBirth: '1993-05-20', gender: 'Female' },
      { email: 'alex.johnson@email.com', fName: 'Alex', lName: 'Johnson', dateofBirth: '1988-12-11', gender: 'Male' },
      { email: 'sophia.davis@email.com', fName: 'Sophia', lName: 'Davis', dateofBirth: '1995-07-07', gender: 'Female' },
      { email: 'ryan.miller@email.com', fName: 'Ryan', lName: 'Miller', dateofBirth: '1992-03-16', gender: 'Male' }
    ];

    for (const user of memberUsers) {
      await pool.request()
        .input('email', sql.VarChar, user.email)
        .input('fName', sql.VarChar, user.fName)
        .input('lName', sql.VarChar, user.lName)
        .input('password', sql.VarChar, hashedPassword)
        .input('dateofBirth', sql.Date, user.dateofBirth)
        .input('gender', sql.VarChar, user.gender)
        .input('userRole', sql.VarChar, 'Member')
        .query(`
          INSERT INTO gymUser (email, fName, lName, password, dateofBirth, gender, userRole)
          VALUES (@email, @fName, @lName, @password, @dateofBirth, @gender, @userRole)
        `);
    }

    console.log('Inserting trainers...');
    // Insert Trainers
    const trainerUsers = [
      { email: 'trainer.james@email.com', fName: 'James', lName: 'Wilson', dateofBirth: '1985-04-15', gender: 'Male', specialization: 'Strength Training', experienceYears: 8, salary: 65000 },
      { email: 'trainer.emma@email.com', fName: 'Emma', lName: 'Thompson', dateofBirth: '1990-08-22', gender: 'Female', specialization: 'Cardio & HIIT', experienceYears: 6, salary: 58000 },
      { email: 'trainer.marcus@email.com', fName: 'Marcus', lName: 'Johnson', dateofBirth: '1987-12-10', gender: 'Male', specialization: 'CrossFit', experienceYears: 7, salary: 62000 },
      { email: 'trainer.sophia@email.com', fName: 'Sophia', lName: 'Anderson', dateofBirth: '1992-06-05', gender: 'Female', specialization: 'Yoga & Pilates', experienceYears: 5, salary: 55000 },
      { email: 'trainer.daniel@email.com', fName: 'Daniel', lName: 'Martinez', dateofBirth: '1988-03-18', gender: 'Male', specialization: 'Bodybuilding', experienceYears: 9, salary: 68000 }
    ];

    for (const trainer of trainerUsers) {
      await pool.request()
        .input('email', sql.VarChar, trainer.email)
        .input('fName', sql.VarChar, trainer.fName)
        .input('lName', sql.VarChar, trainer.lName)
        .input('password', sql.VarChar, hashedPassword)
        .input('dateofBirth', sql.Date, trainer.dateofBirth)
        .input('gender', sql.VarChar, trainer.gender)
        .input('userRole', sql.VarChar, 'Trainer')
        .query(`
          INSERT INTO gymUser (email, fName, lName, password, dateofBirth, gender, userRole)
          VALUES (@email, @fName, @lName, @password, @dateofBirth, @gender, @userRole)
        `);

      // Get the trainer's userId
      const result = await pool.request()
        .input('email', sql.VarChar, trainer.email)
        .query('SELECT userId FROM gymUser WHERE email = @email');

      const trainerId = result.recordset[0].userId;

      // Insert trainer data
      await pool.request()
        .input('userId', sql.Int, trainerId)
        .input('specialization', sql.VarChar, trainer.specialization)
        .input('experienceYears', sql.Int, trainer.experienceYears)
        .input('salary', sql.Decimal(10, 2), trainer.salary)
        .query(`
          INSERT INTO TrainerData (userId, specialization, experienceYears, salary)
          VALUES (@userId, @specialization, @experienceYears, @salary)
        `);
    }

    // Get all user IDs
    const usersResult = await pool.request().query('SELECT userId FROM gymUser WHERE userRole = \'Member\'');
    const memberIds = usersResult.recordset.map(row => row.userId);

    const trainersResult = await pool.request().query('SELECT userId FROM gymUser WHERE userRole = \'Trainer\'');
    const trainerIds = trainersResult.recordset.map(row => row.userId);

    console.log('Inserting membership details...');
    // Insert Membership Details
    const membershipTypes = ['Basic', 'Premium', 'VIP', 'Temporary'];
    const membershipStatuses = ['Active', 'Inactive'];

    for (let i = 0; i < memberIds.length; i++) {
      const membershipType = membershipTypes[i % membershipTypes.length];
      const membershipStatus = membershipStatuses[i % membershipStatuses.length];

      await pool.request()
        .input('userId', sql.Int, memberIds[i])
        .input('membershipType', sql.VarChar, membershipType)
        .input('membershipStatus', sql.VarChar, membershipStatus)
        .query(`
          INSERT INTO MembershipDetails (userId, membershipType, membershipStatus)
          VALUES (@userId, @membershipType, @membershipStatus)
        `);
    }

    console.log('Inserting classes...');
    // Insert Classes
    const classes = [
      { className: 'Morning Strength', trainerId: trainerIds[0], genderSpecific: 'Male', seats: 20 },
      { className: 'Cardio Blast', trainerId: trainerIds[1], genderSpecific: 'Female', seats: 25 },
      { className: 'CrossFit Elite', trainerId: trainerIds[2], genderSpecific: 'Male', seats: 15 },
      { className: 'Yoga Flow', trainerId: trainerIds[3], genderSpecific: 'Female', seats: 30 },
      { className: 'Bodybuilding Basics', trainerId: trainerIds[4], genderSpecific: 'Male', seats: 18 },
      { className: 'HIIT Training', trainerId: trainerIds[0], genderSpecific: 'Male', seats: 22 },
      { className: 'Pilates Core', trainerId: trainerIds[3], genderSpecific: 'Female', seats: 20 },
      { className: 'Powerlifting', trainerId: trainerIds[2], genderSpecific: 'Male', seats: 12 }
    ];

    for (const classData of classes) {
      await pool.request()
        .input('className', sql.VarChar, classData.className)
        .input('trainerId', sql.Int, classData.trainerId)
        .input('genderSpecific', sql.VarChar, classData.genderSpecific)
        .input('seats', sql.Int, classData.seats)
        .query(`
          INSERT INTO Class (className, trainerId, genderSpecific, seats)
          VALUES (@className, @trainerId, @genderSpecific, @seats)
        `);
    }

    // Get class IDs
    const classesResult = await pool.request().query('SELECT classId FROM Class');
    const classIds = classesResult.recordset.map(row => row.classId);

    console.log('Inserting class days...');
    // Insert Class Days
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    for (let i = 0; i < classIds.length; i++) {
      const classDays = [];
      if (i % 3 === 0) {
        classDays.push('Monday', 'Wednesday', 'Friday');
      } else if (i % 3 === 1) {
        classDays.push('Tuesday', 'Thursday', 'Saturday');
      } else {
        classDays.push('Monday', 'Tuesday', 'Wednesday', 'Thursday');
      }

      for (const day of classDays) {
        await pool.request()
          .input('classId', sql.Int, classIds[i])
          .input('day', sql.VarChar, day)
          .query(`
            INSERT INTO ClassDays (classId, Day)
            VALUES (@classId, @day)
          `);
      }
    }

    console.log('Inserting class enrollments...');
    // Insert Class Enrollments
    for (let i = 0; i < memberIds.length; i++) {
      const numClasses = Math.floor(Math.random() * 3) + 1; // 1-3 classes per member
      const selectedClasses = classIds.slice(0, numClasses);
      
      for (const classId of selectedClasses) {
        try {
          await pool.request()
            .input('memberId', sql.Int, memberIds[i])
            .input('classId', sql.Int, classId)
            .query(`
              INSERT INTO Class_Enrollment (memberId, classId)
              VALUES (@memberId, @classId)
            `);
        } catch (error) {
          // Skip if already enrolled
          console.log(`Member ${memberIds[i]} already enrolled in class ${classId}`);
        }
      }
    }

    // Get enrollment IDs
    const enrollmentsResult = await pool.request().query('SELECT enrollmentId, memberId FROM Class_Enrollment');
    const enrollments = enrollmentsResult.recordset;

    console.log('Inserting attendance records...');
    // Insert Attendance Records (last 30 days)
    const today = new Date();
    for (let day = 0; day < 30; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() - day);
      const dateStr = date.toISOString().split('T')[0];

      for (const enrollment of enrollments) {
        const attendanceStatus = Math.random() > 0.3 ? 'P' : 'A'; // 70% present, 30% absent
        
        try {
          await pool.request()
            .input('enrollmentId', sql.Int, enrollment.enrollmentId)
            .input('currDate', sql.Date, dateStr)
            .input('attendanceStatus', sql.VarChar, attendanceStatus)
            .query(`
              INSERT INTO Attendance (enrollmentId, currDate, attendanceStatus)
              VALUES (@enrollmentId, @currDate, @attendanceStatus)
            `);
        } catch (error) {
          // Skip if attendance already recorded
        }
      }
    }

    console.log('Inserting payments...');
    // Insert Payments (last 6 months)
    const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'Online'];
    const paymentStatuses = ['Completed', 'Pending', 'Failed'];
    
    for (let month = 0; month < 6; month++) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - month);
      
      for (let i = 0; i < memberIds.length; i++) {
        const amount = Math.floor(Math.random() * 2000) + 1000; // $1000-$3000
        const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
        const status = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
        
        await pool.request()
          .input('memberId', sql.Int, memberIds[i])
          .input('amount', sql.Decimal(10, 2), amount)
          .input('paymentDate', sql.Date, date.toISOString().split('T')[0])
          .input('paymentMethod', sql.VarChar, paymentMethod)
          .input('status', sql.VarChar, status)
          .query(`
            INSERT INTO Payment (memberId, amount, paymentDate, paymentMethod, status)
            VALUES (@memberId, @amount, @paymentDate, @paymentMethod, @status)
          `);
      }
    }

    console.log('Inserting workout plans...');
    // Insert Workout Plans
    const planNames = [
      'Fat Loss Beginner', 'Muscle Gain Intermediate', 'Endurance Pro',
      'Strength Building', 'Cardio Conditioning', 'Flexibility Focus',
      'Powerlifting Program', 'CrossFit Training', 'Yoga Journey'
    ];

    for (let i = 0; i < memberIds.length; i++) {
      const planName = planNames[i % planNames.length];
      const trainerId = trainerIds[i % trainerIds.length];
      const durationWeeks = Math.floor(Math.random() * 8) + 4; // 4-12 weeks

      await pool.request()
        .input('memberId', sql.Int, memberIds[i])
        .input('trainerId', sql.Int, trainerId)
        .input('planName', sql.VarChar, planName)
        .input('durationWeeks', sql.Int, durationWeeks)
        .query(`
          INSERT INTO WorkoutPlan (memberId, trainerId, plan_name, duration_weeks)
          VALUES (@memberId, @trainerId, @planName, @durationWeeks)
        `);
    }

    console.log('✅ Database populated successfully!');
    console.log(`📊 Added ${memberUsers.length} members`);
    console.log(`💪 Added ${trainerUsers.length} trainers`);
    console.log(`🏋️ Added ${classes.length} classes`);
    console.log('📅 Added attendance records, payments, and workout plans');
    console.log('\n🔑 Test Credentials:');
    console.log('Admin: admin@test.com / admin123');
    console.log('Trainer: trainer.james@email.com / pass123');
    console.log('Member: john.doe@email.com / pass123');

  } catch (error) {
    console.error('❌ Error populating database:', error.message);
    if (error.code === 'ESOCKET') {
      console.log('\n💡 Make sure SQL Server is running and accessible.');
      console.log('   You may need to:');
      console.log('   1. Start SQL Server service');
      console.log('   2. Check your database credentials in .env file');
      console.log('   3. Ensure the database "gymFinal" exists');
    }
  } finally {
    if (pool) {
      await pool.close();
      console.log('Database connection closed');
    }
  }
}

populateDatabase(); 