const request = require("supertest");
const app = require("../index");
const { sequelize } = require("../models");
const { userModel, orgModel } = require("../models");
const jwt = require("jsonwebtoken");

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
  await process.exit;
});

describe("POST /auth/register", () => {
  test("It Should Register User Successfully with Default Organisation", async () => {
    const user = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
      phone: "1234567890",
    };

    const res = await request(app)
      .post("/auth/register")
      .send(user)
      .expect(201);

    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("Registration successful");
    expect(res.body.data.user.firstName).toBe("John");
    expect(res.body.data.user.email).toBe("john@example.com");
    expect(res.body.data).toHaveProperty("accessToken");
  });

  it("should fail if one required field missing", async () => {
    const res = await request(app).post("/auth/register").send({
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(422);
    expect(res.body.errors[0].field).toBe("firstName");
    expect(res.body.errors[0].field).toBe(
      "firstName",
      "First name is required"
    );
  });

  it("should fail if required fields are missing", async () => {
    const res = await request(app).post("/auth/register").send({
      lastName: "Doe",
      password: "password123",
    });

    expect(res.statusCode).toEqual(422);
    expect(res.body.errors[0].field).toBe("firstName");
    expect(res.body.errors[0].field).toBe(
      "firstName",
      "First name is required"
    );
    expect(res.body.errors[1].field).toBe("email");
    expect(res.body.errors[1].field).toBe("email", "Email is required");
  });

  it("should fail if there's duplicate email or userId", async () => {
    await userModel.create({
      userId: "uniqueUserId",
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      password: "password123",
      phone: "0987654321",
    });

    const res = await request(app).post("/auth/register").send({
      userId: "uniqueUserId",
      firstName: "John",
      lastName: "Doe",
      email: "jane@example.com",
      password: "password123",
      phone: "1234567890",
    });

    expect(res.statusCode).toEqual(409);
    expect(res.body.status).toBe("Bad Request");
    expect(res.body.message).toBe("User already exists");
  });

  it("should log the user in successfully", async () => {
    await request(app).post("/auth/register").send({
      userId: "uniqueUserId",
      firstName: "Jane",
      lastName: "Doe",
      email: "alice@example.com",
      password: "password123",
      phone: "1234567890",
    });

    const res = await request(app).post("/auth/login").send({
      email: "alice@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("Login successful");
    expect(res.body.data.user).toHaveProperty("userId");
    expect(res.body.data.user.firstName).toBe("Jane");
    expect(res.body.data.user.lastName).toBe("Doe");
    expect(res.body.data.user.email).toBe("alice@example.com");
    expect(res.body.data.user.phone).toBe("1234567890");
    expect(res.body.data).toHaveProperty("accessToken");
  });

  it("should fail with incorrect password", async () => {
    const user = {
      firstName: "John",
      lastName: "Doe",
      email: "testlogin.com",
      password: "password123",
      phone: "1234567890",
    };

    await request(app).post("/auth/register").send(user);

    const res = await request(app).post("/auth/login").send({
      email: "testlogin.com",
      password: "wrongpassword",
    });
    expect(res.status).toEqual(400);
    expect(res.body.status).toBe("Bad Request");
    expect(res.body.message).toBe("Authentication failed");
  });

  it("should fail if require field is missing", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "alice@example.com",
    });

    expect(res.statusCode).toEqual(422);
    expect(res.body.errors[0].field).toBe("password");
  });
});

describe("POST /auth/login", () => {
  it("Should return a valid JWT with correct expiry and user details", async () => {
    const userData = {
      firstName: "John",
      lastName: "Doe",
      email: "testlogin.com",
      password: "password123",
      phone: "1234567890",
    };
    await request(app).post("/auth/register").send(userData);

    // Mock JWT generation (replace with your actual token generation logic)
    const token = jwt.sign({ email: userData.email }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    const res = await request(app).post("/auth/login").send(userData);
    expect(res.statusCode).toEqual(200); // Replace with expected successful login status code
    expect(res.body.status).toBe("success"); // Replace with expected success message property
    expect(res.body.message).toBe("Login successful"); // Replace with expected success message property
    expect(res.body).toHaveProperty("data");
    const { accessToken } = res.body.data;
    expect(accessToken).toBeDefined();

    // Verify token validity and expiry
    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
    expect(decodedToken.email).toEqual(userData.email);

    // Check token expiry (use a library like moment.js for more precise time comparisons)
    const now = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds
    expect(decodedToken.exp - now).toBeGreaterThan(3 * 3600 - 60); 
  });
});
