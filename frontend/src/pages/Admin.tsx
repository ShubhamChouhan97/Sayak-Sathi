// import React, { useState } from "react";
// import { Button, Drawer, Form, Input, Popconfirm, Select, Space } from "antd";
// import CustomTable from "../components/CustomTable";
// import { roles } from "../libs/constants";
// import { courtClient, useAppStore, userClient } from "../store";
// import MainAreaLayout from "../components/main-layout/main-layout";
// import { useMessage } from "../hooks/message";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { Link } from "react-router";
import { adduser } from "../Api/userAdd";

import React, { useState } from "react";
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

interface User {
	id: string;
	name: string;
	email: string;
	role: number;
	phoneNumber: string;
	countryCode: string;
}

export const Admin: React.FC = () => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [form] = Form.useForm();

	// Dummy data for demo
	const staticUsers: User[] = [
		{
			id: "1",
			name: "John Doe",
			email: "john@example.com",
			role: roles.user,
			phoneNumber: "9876543210",
			countryCode: "+91",
		},
		{
			id: "2",
			name: "Jane Smith",
			email: "jane@example.com",
			role: roles.user,
			phoneNumber: "9123456780",
			countryCode: "+1",
		},
	];

	const staticCourts = [
		{ value: "court1", label: "Supreme Court" },
		{ value: "court2", label: "High Court" },
	];

	const getRoleLabel = (role: roles.user | roles.admin) =>
		role === roles.user ? "user" : "admin";

	const resetFormState = () => {
		setIsDrawerOpen(false);
		setSelectedUser(null);
		setTimeout(() => {
			form.resetFields();
			setIsEditing(false);
		}, 100);
	};

	const handleSubmit = async (values: any) => {
	const formData = new FormData();

	// Append form values to FormData
	for (const key in values) {
		if (values.hasOwnProperty(key)) {
			formData.append(key, values[key]);
		}
	}
	
    console.log("Form Data:", formData);
  await adduser(formData)
	

	resetFormState();
};


	const handleEditUser = (user: User) => {
		setSelectedUser(user);
		form.setFieldsValue({
			...user,
			role: `${user.role}`,
		});
		setIsEditing(true);
		setIsDrawerOpen(true);
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
			title: "User Type",
			dataIndex: "role",
			key: "role",
			render: (role: number) => getRoleLabel(role),
		},
		{
			title: "Court",
			dataIndex: "courtId",
			key: "court",
			render: (courtId: { name: string; id: string }) => (
				<Link to={`/dashboard/court/${courtId?.id}`}>
					{courtId?.name}
				</Link>
			),
		},
		{
			key: "actions",
			render: (record: User) => (
				<Space>
					<Button onClick={() => handleEditUser(record)}>Edit</Button>
					<Popconfirm
						title="Delete this user?"
						onConfirm={() => console.log("Delete", record)}
					>
						<Button danger>Delete</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<MainAreaLayout
			title={`Manage Users`}
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
				data={staticUsers}
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
							{/* Add more if needed */}
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
