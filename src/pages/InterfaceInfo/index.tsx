import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import {Button, Card, Descriptions, Form, message, Input, Spin, Divider} from 'antd';
import {
  getInterfaceInfoByIdUsingGET,
  invokeInterfaceInfoUsingPOST,
} from '@/services/yuapi-backend/interfaceInfoController';

import {useModel, useParams} from '@@/exports';
import {getRemainingCallsUsingGET,
  incrementCallCountUsingPOST,} from "@/services/yuapi-backend/userInterfaceInfoController";


/**
 * 主页
 * @constructor
 */
const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<API.InterfaceInfo>();
  const [invokeRes, setInvokeRes] = useState<any>();
  const [invokeLoading, setInvokeLoading] = useState(false);
  const [remainingCalls, setRemainingCalls] = useState<number>(0);

  const params = useParams();

  const { initialState } = useModel('@@initialState');
  const userId = initialState?.loginUser?.id;


  const loadData = async () => {
    if (!params.id) {
      message.error('参数不存在');
      return;
    }
    setLoading(true);
    try {
      const res = await getInterfaceInfoByIdUsingGET({
        id: Number(params.id),
      });
      setData(res.data);
    } catch (error: any) {
      message.error('请求失败，' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const fetchRemainingCalls = async () => {
    if (!userId || !params.id) {
      message.error('用户未登录或接口ID未提供');
      return;
    }
    try {
      const resOfRemain = await getRemainingCallsUsingGET({ userId, interfaceInfoId: Number(params.id) });
      setRemainingCalls(resOfRemain.data ?? 0);  // 使用空值合并运算符提供默认值
    } catch (error) {
      message.error('获取剩余调用次数失败');
    }
  };

  useEffect(() => {
    fetchRemainingCalls();
  }, [userId, params.id, fetchRemainingCalls]); // 依赖 userId 和 params.id

  // 用于增加调用次数的函数
  const incrementCalls = async () => {
    const interfaceInfoId = params.id;  // 从 URL 参数获取接口 ID
    try {
      if (userId === undefined) {
        message.error('用户未登录');
        return;
      }
      await incrementCallCountUsingPOST({ userId, interfaceInfoId: Number(interfaceInfoId) });
      message.success('调用次数增加成功');
      await fetchRemainingCalls();  // 更新显示的剩余调用次数
    } catch (error: any) {
      message.error('增加调用次数失败：' + error.message);
    }
  };





  const onFinish = async (values: any) => {
    if (!params.id) {
      message.error('接口不存在');
      return;
    }
    setInvokeLoading(true);
    try {
      const res = await invokeInterfaceInfoUsingPOST({
        id: params.id,
        ...values,
      });
      setInvokeRes(res.data);
      message.success('请求成功');
      await fetchRemainingCalls();  // 再次获取最新的剩余调用次数
    } catch (error: any) {
      message.error('操作失败，' + error.message);
    }
    setInvokeLoading(false);
  };

  return (
    <PageContainer title="查看接口文档">
      <Card>
        {data ? (
          <Descriptions title={data.name} column={1}>
            <Descriptions.Item label="接口状态">{data.status ? '开启' : '关闭'}</Descriptions.Item>
            <Descriptions.Item label="描述">{data.description}</Descriptions.Item>
            <Descriptions.Item label="请求地址">{data.url}</Descriptions.Item>
            <Descriptions.Item label="请求方法">{data.method}</Descriptions.Item>
            <Descriptions.Item label="请求参数">{data.requestParams}</Descriptions.Item>
            <Descriptions.Item label="请求头">{data.requestHeader}</Descriptions.Item>
            <Descriptions.Item label="响应头">{data.responseHeader}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{data.updateTime}</Descriptions.Item>
          </Descriptions>
        ) : (
          <>接口不存在</>
        )}
      </Card>
      <Divider />
      <Card title="在线测试">
        <Descriptions>
          <Descriptions.Item label="剩余调用次数">{remainingCalls}</Descriptions.Item>
        </Descriptions>
        <Button onClick={incrementCalls} type="primary">获取调用次数</Button>
        <Divider />
        <Form name="invoke" layout="vertical" onFinish={onFinish}>
          <Form.Item label="请求参数" name="userRequestParams">
            <Input.TextArea />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 16 }}>
            <Button type="primary" htmlType="submit">
              调用
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Divider />
      <Card title="返回结果" loading={invokeLoading}>
        {invokeRes}
      </Card>
    </PageContainer>
  );
};

export default Index;
