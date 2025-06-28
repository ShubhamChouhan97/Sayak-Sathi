import bcrypt from 'bcrypt';
import userModel from '../models/user.js'; // Adjust the path as necessary
import { sendNewUserEmail } from '../services/passwordEmail.js'; // Adjust the path as necessary
import { roles, status } from '../constants/index.js'; // Adjust the path as necessary

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

    req.session.userId = user._id;
    req.session.email = user.email;
    req.session.role = user.role;
    req.session.name = user.name;
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
	const { name, email, phoneNumber, countryCode } = req.body;
    	console.log("Received user:", { name, email, phoneNumber, countryCode });
    try {
        const password = '123456'; // Assuming the password is sent in the request data
          const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({
        name,
        email,
        password: hashedPassword,
        role: roles.user, // Assuming 1 is the role for a normal user
        phoneNumber,
        countryCode,
        status: status.active, // Assuming 1 is the status for active users
        createdBy: req.session.userId, // Assuming the user creating this is the logged-in user
        updatedBy: req.session.userId, // Assuming the user creating this is the logged
    });
    console.log("user created:", user);
        // Send email notification
        sendNewUserEmail(email, password);
         await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

};

export const getUsers = async (req, res) => {
    // get all users and send only that user that are active and role is user
    const users = await userModel.find({ role: roles.user, status: status.active });
    res.json(users);
};
export const deleteUser = async (req, res) => {
    try{
        const id = req.params.id;
    console.log('id',id);
  await userModel.findByIdAndDelete(id);

    res.json({ message: 'User deleted successfully' });
    }catch{
        res.status(400).json({ error: 'User not found' });
    }
    };