import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Avatar, Button, Modal, Form, Input, message } from 'antd';
import { useModel } from '@umijs/max';
import { getUserByIdUsingGET, updateUserUsingPOST } from '@/services/wxapi-backend/userController';

const Center: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [user, setUser] = useState<API.UserVO>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (initialState?.loginUser?.id) {
        const res = await getUserByIdUsingGET({ id: initialState.loginUser.id });
        setUser(res.data);
      }
    };
    fetchUser();
  }, [initialState]);

  const handleUpdate = async (values: API.UserUpdateRequest) => {
    try {
      await updateUserUsingPOST({ ...values, id: user?.id });
      message.success('更新成功');
      setIsModalVisible(false);
      const updatedUser = await getUserByIdUsingGET({ id: user?.id });
      setUser(updatedUser.data);
      setInitialState((s) => ({ ...s, loginUser: updatedUser.data }));
    } catch (error: any) {
      message.error('更新失败：' + error.message);
    }
  };

  return (
    <Card>
      <Descriptions title="个人中心">
        <Descriptions.Item label="用户账号">{user?.userAccount}</Descriptions.Item>
        <Descriptions.Item label="用户昵称">{user?.userName}</Descriptions.Item>
        <Descriptions.Item label="用户角色">{user?.userRole}</Descriptions.Item>
        <Descriptions.Item label="用户头像">
          <Avatar src={user?.userAvatar} />
        </Descriptions.Item>
      </Descriptions>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>修改信息</Button>
      <Modal
        title="修改信息"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={user}
          onFinish={handleUpdate}
        >
          <Form.Item name="userAccount" label="用户账号">
            <Input />
          </Form.Item>
          <Form.Item name="userName" label="用户昵称">
            <Input />
          </Form.Item>
          <Form.Item name="userAvatar" label="用户头像">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">保存</Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Center;
