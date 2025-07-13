const sql = require('mssql');

// SQL Server Configuration using environment variables
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        trustServerCertificate: true,
        trustedConnection: false,
        enableArithAbort: true,
        instancename: process.env.DB_INSTANCE
    },
    port: parseInt(process.env.DB_PORT, 10)
};

let pool = null;

// Initialize database connection
const initializeDatabase = async () => {
    try {
        pool = await sql.connect(dbConfig);
        console.log('✅ Connected to SQL Server');
        return pool;
    } catch (err) {
        console.error('❌ Database connection failed:', err);
        throw err;
    }
};

// Get database pool
const getPool = () => {
    if (!pool) {
        throw new Error('Database not initialized. Call initializeDatabase() first.');
    }
    return pool;
};

// Helper function to execute queries
const executeQuery = async (query, inputs = []) => {
    try {
        const request = getPool().request();
        inputs.forEach(input => request.input(input.name, input.type, input.value));
        const result = await request.query(query);
        return result.recordset;
    } catch (err) {
        throw new Error(`Database query error: ${err.message}`);
    }
};

// Helper function to execute stored procedures
const executeProcedure = async (procName, inputs = []) => {
    try {
        const request = getPool().request();
        inputs.forEach(input => request.input(input.name, input.type, input.value));
        const result = await request.execute(procName);
        return result.recordset;
    } catch (err) {
        throw new Error(`Stored procedure error: ${err.message}`);
    }
};

// Helper function to execute single row queries
const executeSingleQuery = async (query, inputs = []) => {
    const result = await executeQuery(query, inputs);
    return result.length > 0 ? result[0] : null;
};

// Helper function to check if database is connected
const isConnected = () => {
    return pool !== null;
};

// Close database connection
const closeConnection = async () => {
    if (pool) {
        await pool.close();
        pool = null;
        console.log('Database connection closed');
    }
};

module.exports = {
    initializeDatabase,
    getPool,
    executeQuery,
    executeProcedure,
    executeSingleQuery,
    isConnected,
    closeConnection,
    sql // Export sql for type definitions
}; 