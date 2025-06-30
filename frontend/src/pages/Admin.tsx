import React, { useState,useEffect } from "react";
import {
	Button,
	Drawer,
	Form,
	Input,
	Popconfirm,
	Select,
	Space,
} from "antd";
import CustomTable from "../components/CustomTable";
import { roles } from "../libs/constants";
import MainAreaLayout from "../components/main-layout/main-layout";
import { Link } from "react-router";
import { adduser,getUsers,deleteUser } from "../Api/userAdd";

interface User {
	_id: string;
	name: string;
	email: string;
	phoneNumber: string;
	countryCode: string;
}
export const Admin: React.FC = () => {
	const [user ,setUser] =  useState([]);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [form] = Form.useForm();


	const fetchuser = async()=>{
	try{
	   const userdata =	await getUsers();
	   setUser(userdata);
	}catch{
		alert('Unable to fetch user');
	}
      }

	  useEffect(() => {
		fetchuser();
	}, []);

	const resetFormState = () => {
		setIsDrawerOpen(false);
		setSelectedUser(null);
		setTimeout(() => {
			form.resetFields();
			setIsEditing(false);
		}, 100);
	};

	const handleSubmit = async (values: any) => {
		try {
			console.log("Form values:", values);
			await adduser(values); // backend will assign role
			fetchuser();
			resetFormState();
		} catch (error) {
			console.error("Failed to add user:", error);
		}
	};

	const handleEditUser = (user: User) => {
		setSelectedUser(user);
		form.setFieldsValue(user);
		setIsEditing(true);
		setIsDrawerOpen(true);
	};
   const  handelDeleteUser = async (_id: string) => {
	try {
		await deleteUser(_id);
		fetchuser();
		} catch (error) {
			console.error("Failed to delete user:", error);
			}
			};
	const columns = [
		{ title: "Name", dataIndex: "name", key: "name" },
		{ title: "Email", dataIndex: "email", key: "email" },
		{
			title: "Phone",
			key: "phone",
			render: (_: any, record: User) =>
				`${record.countryCode} ${record.phoneNumber}`,
		},
		{
			key: "actions",
			render: (record: User) => (
				<Space>
					<Button onClick={() => handleEditUser(record)}>Edit</Button>
					<Popconfirm
						title="Delete this user?"
						onConfirm={() => handelDeleteUser(record._id)  }
					>
						<Button danger>Delete</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<MainAreaLayout
			title="Manage Users"
			extra={
				<Button
					type="primary"
					onClick={() => {
						setIsDrawerOpen(true);
						setIsEditing(false);
						form.resetFields();
					}}
				>
					Add User
				</Button>
			}
		>
			<CustomTable
				columns={columns}
				data={user}
				loading={false}
				serialNumberConfig={{ name: "", show: true }}
			/>

			<Drawer
				title={isEditing ? "Edit User" : "Add User"}
				placement="right"
				width={400}
				open={isDrawerOpen}
				onClose={resetFormState}
			>
				<Form
					layout="vertical"
					form={form}
					onFinish={handleSubmit}
					initialValues={{ countryCode: "+91" }}
				>
					<Form.Item
						label="Name"
						name="name"
						rules={[{ required: true, message: "Name is required" }]}
					>
						<Input placeholder="Enter name" />
					</Form.Item>

					<Form.Item
						label="Email"
						name="email"
						rules={[
							{ required: true, type: "email", message: "Valid email is required" },
						]}
					>
						<Input placeholder="Enter email" disabled={isEditing} />
					</Form.Item>

					<Form.Item
						label="Country Code"
						name="countryCode"
						rules={[{ required: true, message: "Country code is required" }]}
					>
						<Select placeholder="Select country code">
							<Select.Option value="+91">+91 (India)</Select.Option>
							<Select.Option value="+1">+1 (USA)</Select.Option>
							<Select.Option value="+44">+44 (UK)</Select.Option>
						</Select>
					</Form.Item>

					<Form.Item
						label="Phone Number"
						name="phoneNumber"
						rules={[{ required: true, message: "Phone number is required" }]}
					>
						<Input placeholder="Enter phone number" />
					</Form.Item>

					<Button type="primary" block htmlType="submit">
						{isEditing ? "Update User" : "Add User"}
					</Button>
				</Form>
			</Drawer>
		</MainAreaLayout>
	);
};
