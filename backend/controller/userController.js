import bcrypt from 'bcrypt';
import userModel from '../models/user.js'; // Adjust the path as necessary

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({
            error: 'Email is not valid',
        });
    }
    const isMatch = await bcrypt.compare(password, user.password); // ✅ using bcrypt directly

    if (!isMatch) {
        return res.status(400).json({ error: 'Password is not valid' });
    }
    if (user.status !== 1) {
        return res.status(400).json({
            error: 'User is not active',
        });
    }

    req.session.userId = user.id;
    req.session.email = user.email;
    req.session.role = user.role;
    req.session.name = user.name;
    req.session.courtId = user.courtId;
    req.session.phoneNumber = user.phoneNumber;
    req.session._internal = {};
    return res.json({ message: 'success' });
};

export const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to log out' });
        }
        return res.json({ message: 'Logged out successfully' });
    });
};
export const newuser = async (req, res) => {
    // const { name, email, password, role, courtId, phoneNumber } = req.body;
    console.log('New user data:', req.data);
    // const hashedPassword = await bcrypt.hash(password, 10);
    // const user = new userModel({
    //     name,
    //     email,
    //     password: hashedPassword,
    //     role,
    //     courtId,
    //     phoneNumber,
    // });
    // try {
    //     await user.save();
    //     res.status(201).json({ message: 'User created successfully' });
    // } catch (error) {
    //     res.status(400).json({ error: error.message });
    // }
};