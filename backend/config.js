import dotenv from 'dotenv';

dotenv.config();  

const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;

const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD;

const STRIPE_SECRET_KEY =  "sk_test_51T41VdQnuZRSHLNiDRmSKyfmxkVQctOh9hiZtb87xDO7o3BY0OY6K3pmmuTULM4irzpGvS46EZfxTT5JsgTW055300cbFEYHHa"

export default {
    JWT_USER_PASSWORD,
    JWT_ADMIN_PASSWORD,
    STRIPE_SECRET_KEY,
};

