// // made defult export of User component
// import React from "react";


// export const Requests: React.FC = () => {
   
//     return (
//         <div className="flex justify-center items-center h-[90vh] w-full">
//            <h1>Request Page</h1>
//         </div>
//     );
// }

// import React, { useState } from "react";
// import {
//   Table,
//   Button,
//   Input,
//   Tag,
//   Drawer,
//   Form,
//   Upload,
//   message,
//   Space,
// } from "antd";
// import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
// import type { UploadProps } from "antd/es/upload";
// import type { RcFile } from "antd/es/upload";

// interface Request {
//   id: number;
//   name: string;
//   description: string;
//   createdAt: string;
//   documentCount: number;
//   status: "Draft" | "In Progress" | "Completed";
// }

// const mockData: Request[] = [
//   {
//     id: 1,
//     name: "Sample Request 1",
//     description: "Initial draft for review",
//     createdAt: "2024-01-15",
//     documentCount: 5,
//     status: "Draft",
//   },
//   {
//     id: 2,
//     name: "Sample Request 2",
//     description: "Quarterly report submission",
//     createdAt: "2024-02-20",
//     documentCount: 3,
//     status: "In Progress",
//   },
// ];

// export const Requests: React.FC = () => {
//   const [data, setData] = useState(mockData);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [form] = Form.useForm();

//   const showDrawer = () => setIsDrawerOpen(true);
//   const closeDrawer = () => {
//     form.resetFields();
//     setIsDrawerOpen(false);
//   };

//   const onFinish = (values: any) => {
//     const newRequest: Request = {
//       id: data.length + 1,
//       name: values.name,
//       description: values.description,
//       createdAt: new Date().toISOString().split("T")[0],
//       documentCount: 1,
//       status: "Draft",
//     };
//     setData([newRequest, ...data]);
//     message.success("New request added");
//     closeDrawer();
//   };

//   const fileProps: UploadProps = {
//     beforeUpload: (file: RcFile) => {
//       const isPDF = file.type === "application/pdf";
//       if (!isPDF) {
//         message.error("Only PDF files are allowed!");
//       }
//       return isPDF || Upload.LIST_IGNORE;
//     },
//     maxCount: 1,
//   };

//   const columns = [
//     {
//       title: "Request No.",
//       dataIndex: "id",
//       key: "id",
//     },
//     {
//       title: "Request Name",
//       dataIndex: "name",
//       key: "name",
//       render: (text: string) => (
//         <span className="text-blue-600 cursor-pointer">{text}</span>
//       ),
//     },
//     {
//       title: "Description",
//       dataIndex: "description",
//       key: "description",
//     },
//     {
//       title: "Created At",
//       dataIndex: "createdAt",
//       key: "createdAt",
//     },
//     {
//       title: "Document Count",
//       dataIndex: "documentCount",
//       key: "documentCount",
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       render: (status: string) => {
//         const color =
//           status === "Draft"
//             ? "default"
//             : status === "In Progress"
//             ? "gold"
//             : "green";
//         return <Tag color={color}>{status}</Tag>;
//       },
//     },
//    {
//   title: "Action",
//   key: "action",
//   render: (_, record: Request) => (
//     <div>
//       <Space direction="horizontal" size="middle" wrap>
//         <Button type="primary" size="small" onClick={() => handlePreview(record)}>
//           Preview
//         </Button>
//         <Button type="default" size="small" onClick={() => handleGenerate(record)}>
//           Generate
//         </Button>
//         <Button type="primary" danger size="small" onClick={() => handleDelete(record.id)}>
//           Delete
//         </Button>
//       </Space>
//     </div>
//   ),
// },
//   ];

//   return (
//     <div className="p-6">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
//         <h2 className="text-2xl font-bold mb-2 sm:mb-0">Requests</h2>
//         <Button
//           type="primary"
//           icon={<PlusOutlined />}
//           onClick={showDrawer}
//           className="self-end"
//         >
//           New Request
//         </Button>
//       </div>

//       <Table
//         dataSource={data}
//         columns={columns}
//         rowKey="id"
//         pagination={{ pageSize: 5 }}
//         scroll={{ x: 'max-content' }}
//       />

//       <Drawer
//         title="New Request"
//         width={400}
//         onClose={closeDrawer}
//         open={isDrawerOpen}
//         destroyOnClose
//       >
//         <Form layout="vertical" form={form} onFinish={onFinish}>
//           <Form.Item
//             name="name"
//             label="Request Name"
//             rules={[{ required: true, message: "Please enter a name" }]}
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item
//             name="description"
//             label="Description"
//             rules={[{ required: true, message: "Please enter a description" }]}
//           >
//             <Input.TextArea rows={3} />
//           </Form.Item>

//           <Form.Item
//             name="file"
//             label="Upload PDF"
//             valuePropName="fileList"
//             getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
//             rules={[{ required: true, message: "Please upload a PDF file" }]}
//           >
//             <Upload {...fileProps}>
//               <Button icon={<UploadOutlined />}>Click to Upload PDF</Button>
//             </Upload>
//           </Form.Item>

//           <Form.Item>
//             <div className="flex justify-end gap-2">
//               <Button onClick={closeDrawer}>Cancel</Button>
//               <Button type="primary" htmlType="submit">
//                 Submit
//               </Button>
//             </div>
//           </Form.Item>
//         </Form>
//       </Drawer>
//     </div>
//   );
// };

import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Tag,
  Drawer,
  Form,
  Upload,
  message,
  Space,
  Spin,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd/es/upload";
import type { RcFile } from "antd/es/upload";

interface Request {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  documentCount: number;
  status: "Draft" | "In Progress" | "Completed";
}

export const Requests: React.FC = () => {
  const [data, setData] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form] = Form.useForm();

  // 🟡 Simulated server fetch (replace with real API)
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/requests"); // ← replace with your endpoint
      const result = await response.json();
      setData(result);
    } catch (err) {
      message.error("Failed to fetch requests from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const showDrawer = () => setIsDrawerOpen(true);

  const closeDrawer = () => {
    form.resetFields();
    setIsDrawerOpen(false);
  };

  const onFinish = (values: any) => {
    const newRequest: Request = {
      id: data.length + 1,
      name: values.name,
      description: values.description,
      createdAt: new Date().toISOString().split("T")[0],
      documentCount: 1,
      status: "Draft",
    };
    setData([newRequest, ...data]);
    message.success("New request added");
    closeDrawer();
  };

  const handlePreview = (record: Request) => {
    message.info(`Preview: ${record.name}`);
  };

  const handleGenerate = (record: Request) => {
    message.success(`Generated document for: ${record.name}`);
  };

  const handleDelete = (id: number) => {
    setData(prev => prev.filter(req => req.id !== id));
    message.success("Request deleted successfully");
  };

  const fileProps: UploadProps = {
    beforeUpload: (file: RcFile) => {
      const isPDF = file.type === "application/pdf";
      if (!isPDF) {
        message.error("Only PDF files are allowed!");
      }
      return isPDF || Upload.LIST_IGNORE;
    },
    maxCount: 1,
  };

  const columns = [
    {
      title: "Request No.",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Request Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span className="text-blue-600 cursor-pointer">{text}</span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Document Count",
      dataIndex: "documentCount",
      key: "documentCount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color =
          status === "Draft"
            ? "default"
            : status === "In Progress"
            ? "gold"
            : "green";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Request) => (
        <div className="border border-gray-300 rounded-md p-2 w-fit bg-white shadow-sm">
          <Space direction="horizontal" size="middle" wrap>
            <Button
              type="primary"
              size="small"
              onClick={() => handlePreview(record)}
            >
              Preview
            </Button>
            <Button
              type="default"
              size="small"
              onClick={() => handleGenerate(record)}
            >
              Generate
            </Button>
            <Button
              type="primary"
              danger
              size="small"
              onClick={() => handleDelete(record.id)}
            >
              Delete
            </Button>
          </Space>
        </div>
      ),
    },
  ];

 const RequestSubmit = (values: any)=>{
    // try{
        
    // }

 }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Requests</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showDrawer}
        >
          New Request
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <Spin tip="Loading requests..." size="large" />
        </div>
      ) : (
        <Table
          dataSource={data}
          columns={columns}
          rowKey="id"
          scroll={{ x: "max-content" }}
        />
      )}

      <Drawer
        title="New Request"
        width={400}
        onClose={closeDrawer}
        visible={isDrawerOpen}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Request Name"
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please enter a description" },
            ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="file"
            label="Upload PDF"
            valuePropName="fileList"
            getValueFromEvent={(e) =>
              Array.isArray(e) ? e : e?.fileList
            }
            rules={[
              { required: true, message: "Please upload a PDF file" },
            ]}
          >
            <Upload {...fileProps}>
              <Button icon={<UploadOutlined />}>Click to Upload PDF</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end gap-2">
              <Button onClick={closeDrawer}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

