import { compareSync, hashSync } from "bcrypt";
import { prismaClient } from "../routes/index.js";
import jwt from "jsonwebtoken";

// ================= REGISTER =================
export const RegisterController = async (req, res) => {
    const { name, email, password, phoneNo, address, pincode } = req.body;

    if (!name || !email || !password || !phoneNo || !address || !pincode) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

    try {
        const userExists = await prismaClient.user.findFirst({ where: { email } });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const hashPassword = hashSync(password, 10);

        const user = await prismaClient.user.create({
            data: { name, email, password: hashPassword, phoneNo, address, pincode }
        });

        return res.status(201).json({ message: "User Registered Successfully", user });
    } catch (err) {
        console.error("RegisterController Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// ================= LOGIN =================
export const LoginController = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Please fill all the fields" });

    try {
        // ===== Check critical environment variables =====
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET missing!");
            return res.status(500).json({ message: "Server misconfigured" });
        }

        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
            console.warn("Admin credentials not set in environment variables");
        }

        // ===== Fetch user =====
        let user;
        try {
            user = await prismaClient.user.findFirst({ where: { email } });
        } catch (err) {
            console.error("Prisma findFirst error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (!user) return res.status(400).json({ message: "User Not Found" });

        // ===== Admin login =====
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ id: user.id, role: user.role || "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });
            return res.status(200).json({ message: "Admin LoggedIn Successfully", token, user });
        }

        // ===== Password check =====
        let isPasswordValid = false;
        try {
            isPasswordValid = compareSync(password, user.password);
        } catch (err) {
            console.error("Password comparison error:", err);
            return res.status(500).json({ message: "Password comparison failed" });
        }

        if (!isPasswordValid) return res.status(400).json({ message: "Invalid Password" });

        // ===== JWT generation =====
        let token;
        try {
            token = jwt.sign({ id: user.id, role: user.role || "user" }, process.env.JWT_SECRET, { expiresIn: "1d" });
        } catch (err) {
            console.error("JWT sign error:", err);
            return res.status(500).json({ message: "JWT generation failed" });
        }

        return res.status(200).json({ message: "Login Successful", token, user });

    } catch (err) {
        console.error("LoginController Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
