
const crypto = require("crypto");
const User = require("../models/User");
const mailSender  = require("../utils/mailSender");
const bcrypt = require("bcrypt");

// Request Password Reset
exports.resetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim(),
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email",
            });
        }

        const token = crypto.randomUUID();

        user.token = token;
        user.resetPasswordExpires = new Date(
            Date.now() + 5 * 60 * 1000
        );

        await user.save();

        const url =
            `http://localhost:3000/update-password/${token}`;

        await mailSender(
            user.email,
            "Password Reset Link",
            `Use this link to reset your password: ${url}\n\n` +
            "This link expires in 5 minutes. If you did not request " +
            "a password reset, ignore this email."
        );

        return res.status(200).json({
            success: true,
            message: "Password reset link sent. Please check your email.",
        });
    } catch (error) {
        console.error("Reset Password Token Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to send reset link",
        });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;

        if (!password || !confirmPassword || !token) {
            return res.status(400).json({
                success: false,
                message: "Password, confirmation, and token are required",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long",
            });
        }

        const user = await User.findOne({
            token,
            resetPasswordExpires: { $gt: new Date() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token",
            });
        }

        user.password = await bcrypt.hash(password, 10);
        user.token = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        console.error("Reset Password Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to reset password",
        });
    }
};
