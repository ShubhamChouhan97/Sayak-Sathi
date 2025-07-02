
// import React, { useState, useEffect } from "react";
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
//   Spin,
// } from "antd";
// import {
//   PlusOutlined,
// } from "@ant-design/icons";
// import { createRequest,getRequest } from "../Api/Request"; // Adjust the import path as necessary


// interface Request {
//   id: number;
//   name: string;
//   description: string;
//   createdAt: string;
//   documentCount: number;
//   status: "Draft" | "In Progress" | "Completed";
// }

// export const Requests: React.FC = () => {
//   const [data, setData] = useState<Request[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [form] = Form.useForm();

//   //  Simulated server fetch (replace with real API)
//   const fetchRequests = async () => {
//     setLoading(true);
//     try {
//       const data = await getRequest(); // ← replace with your endpoint
//       console.log("Fetched requests:", data);
//       setData(data);
//     } catch (err) {
//       message.error("No Data Found");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const showDrawer = () => setIsDrawerOpen(true);

//   const closeDrawer = () => {
//     form.resetFields();
//     setIsDrawerOpen(false);
//   };

// const onFinish = async (values: any) => {
//   const file = values.file?.[0];

//   if (!file) {
//     message.error("No file selected");
//     return;
//   }

//   const formData = new FormData();
//   formData.append("name", values.name);
//   formData.append("description", values.description);
//   formData.append("file", file);

//   try {
//     await createRequest(formData);
//      fetchRequests();
//     message.success("New request added");
//     closeDrawer();
//   } catch (error) {
//     console.error("Request creation failed:", error);
//     message.error("Failed to create request");
//   }
// };


//   const handlePreview = (record: Request) => {
//     message.info(`Preview: ${record.name}`);
//   };

//   const handleGenerate = (record: Request) => {
//     message.success(`Generated document for: ${record.name}`);
//   };

//   const handleDelete = (id: number) => {
//     setData(prev => prev.filter(req => req.id !== id));
//     message.success("Request deleted successfully");
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
//     {
//       title: "Action",
//       key: "action",
//       render: (_: any, record: Request) => (
//         <div className="border border-gray-300 rounded-md p-2 w-fit bg-white shadow-sm">
//           <Space direction="horizontal" size="middle" wrap>
//             <Button
//               type="primary"
//               size="small"
//               onClick={() => handlePreview(record)}
//             >
//               Preview
//             </Button>
//             <Button
//               type="default"
//               size="small"
//               onClick={() => handleGenerate(record)}
//             >
//               Generate
//             </Button>
//             <Button
//               type="primary"
//               danger
//               size="small"
//               onClick={() => handleDelete(record.id)}
//             >
//               Delete
//             </Button>
//           </Space>
//         </div>
//       ),
//     },
//   ];


//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-bold">Requests</h2>
//         <Button
//           type="primary"
//           icon={<PlusOutlined />}
//           onClick={showDrawer}
//         >
//           New Request
//         </Button>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-60">
//           <Spin tip="Loading requests..." size="large" />
//         </div>
//       ) : (
//         <Table
//           dataSource={data}
//           columns={columns}
//           rowKey="id"
//           scroll={{ x: "max-content" }}
//         />
//       )}

//       <Drawer
//         title="New Request"
//         width={400}
//         onClose={closeDrawer}
//         visible={isDrawerOpen}
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
//             rules={[
//               { required: true, message: "Please enter a description" },
//             ]}
//           >
//             <Input.TextArea rows={3} />
//           </Form.Item>

//       <Form.Item
//   name="file"
//   label="Upload PDF"
//   rules={[{ required: true, message: "Please upload a PDF file" }]}
//  valuePropName="files"
//   getValueFromEvent={(e) => e.target.files}
// >
//   <input
//     type="file"
//     accept="application/pdf"
//     className="block w-full border px-2 py-1"
//   />
// </Form.Item>



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
  Modal
} from "antd";
import { useAppStore } from "../store";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { createRequest, getRequest,deleteRequest,previewRequestTemplate,generateRequest } from "../Api/Request"; // Adjust path
import { io } from 'socket.io-client';

const socket = io("http://localhost:3000", {
  withCredentials: true
});

interface Request {
  _id: string;
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
  const [fileList, setFileList] = useState<any[]>([]);

const [previewUrl, setPreviewUrl] = useState<string | null>(null);
 const [previewModal,setPreviewModal] = useState(false);
 const [previewRequest ,setPreviewRequest] = useState('');
 const [loadvar, setLoadvar] = useState(0);

  const session = useAppStore().session;
  const myId = useAppStore().session?.userId;
  console.log("Session ID:", myId);

 // socket
//   useEffect(() => {
//     // socket.on('request-statusUpdate', (data) => {
//     //   if (myId === data.yourId) {
//     //     setLoadvar((prev) => prev + 1);
//     //   }
//     // });

//     socket.on('request-statusUpdate', (data) => {
//   if (myId === data.yourId) {
//     setLoadvar((prev) => prev + 1);
//   }
// });


//     return () => {
//       socket.off('request-statusUpdate');
//     };
//   }, [myId]);

useEffect(() => {
  if (!myId) {
    return;
  }

  const handleStatusUpdate = (data: any) => {
    if (data.yourId === myId) {
      setLoadvar(prev => prev + 1);
    }
  };

  socket.on('request-statusUpdate', handleStatusUpdate);
  return () => {
    socket.off('request-statusUpdate', handleStatusUpdate);
  };
}, [myId]);



  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await getRequest();
      setData(data);
    } catch (err) {
      message.error("No Data Found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [loadvar]);

  const showDrawer = () => setIsDrawerOpen(true);

  const closeDrawer = () => {
    form.resetFields();
    setFileList([]);
    setIsDrawerOpen(false);
  };

  const onFinish = async (values: any) => {
    if (!fileList.length) {
      message.error("Please upload a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("file", fileList[0]);

    try {
      await createRequest(formData);
      fetchRequests();
      message.success("New request added");
      closeDrawer();
    } catch (error) {
      console.error("Request creation failed:", error);
      message.error("Failed to create request");
    }
  };

  const beforeUpload = (file: File) => {
    const isPdf = file.type === "application/pdf";
    if (!isPdf) {
      message.error("Only PDF files are allowed!");
      return Upload.LIST_IGNORE;
    }
    setFileList([file]); // Only one file
    return false; // prevent auto upload
  };

  const handleRemove = () => {
    setFileList([]);
  };

  const handleDelete = async (id: string) => {
    const response = await deleteRequest(id.toString());
    if (response.status !== 200) {
      message.error("Failed to delete request");
      return;
    }
    else{
     fetchRequests();
     message.success("Request deleted successfully");
    }
    
 
  };

  const handlePreview = async (requestId :string,name:string) => {
    setPreviewRequest(name);
    setPreviewModal(true);
    setLoading(true);
    try {
      const blob = await previewRequestTemplate(requestId);
      const url = window.URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (err) {
      console.error("Error downloading template:", err);
      message.error("Something went wrong while opening the template.");
    } finally {
      setLoading(false);
    }
  };

  


  const handleGenerate = async (requestId:string) => {
 try{
 const response = await generateRequest(requestId);
 if(response.status === 200){
  message.success("Request generated successfully");
  fetchRequests();
  }else{
  message.error("Failed to generate request");
  }
 }catch{
    message.error("Failed to generate document");
 }

  };

  const columns = [
     {
    title: "Request No.",
    key: "serial",
    render: (_: any, __: Request, index: number) => index + 1,
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
  render: (createdAt: string) => (
    new Date(createdAt).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  ),
},
    {
      title: "Document Count",
      dataIndex: "documentCount",
      key: "documentCount",
      render: (text: string) => (
        <span className="text-blue-600 cursor-pointer">{text}</span>
      )
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
          <Space>
            <Button type="primary" size="small" onClick={() => handlePreview(record._id,record.name)}>Preview</Button>
            <Button size="small" onClick={() => handleGenerate(record._id)}>Generate</Button>
            <Button danger size="small" onClick={() => handleDelete(record._id)}>Delete</Button>
          </Space>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Requests</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={showDrawer}>
          New Request
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <Spin tip="Loading requests..." size="large" />
        </div>
      ) : (
        <Table dataSource={data} columns={columns} rowKey="id" scroll={{ x: "max-content" }} />
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
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="file"
            label="Upload PDF"
            rules={[{ required: true, message: "Please upload a PDF file" }]}
          >
            <Upload
              beforeUpload={beforeUpload}
              onRemove={handleRemove}
              fileList={fileList}
              accept=".pdf"
              maxCount={1}
              multiple={false}
            >
              <Button icon={<UploadOutlined />}>Select PDF</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end gap-2">
              <Button onClick={closeDrawer}>Cancel</Button>
              <Button type="primary" htmlType="submit">Submit</Button>
            </div>
          </Form.Item>
        </Form>
      </Drawer>
      <Modal
      open={previewModal}
       onCancel={() => { setPreviewModal(false); setPreviewUrl(null); }}
        title={`Preview Request: ${previewRequest}`}
				footer={null}
				width="80%"
				centered
				bodyStyle={{ height: "80vh", padding: 0 }}>
      {loading ? (
       <div className="flex justify-center items-center h-[80vh]">
       <Spin tip="Loading Preview..." size="large" />
      </div>
      ) : previewUrl ? (
       <div className="mt-4 w-full h-[80vh] border">
       <iframe
      src={previewUrl}
      title="Document Preview"
      className="w-full h-full"
       />
     </div>
      ) : null}
     </Modal>
    </div>
  );
};
