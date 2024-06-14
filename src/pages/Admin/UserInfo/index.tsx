import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { FooterToolbar, PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Drawer, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import type { SortOrder } from 'antd/es/table/interface';
import {
  addUserUsingPOST,
  deleteUserUsingPOST,
  listUserByPageUsingGET,
  updateUserUsingPOST
} from '@/services/wxapi-backend/userController';
import { getAllInterfaceCallsByUserIdUsingGET } from '@/services/wxapi-backend/userInterfaceInfoController';
import CreateModal from '@/pages/Admin/InterfaceInfo/components/CreateModal';
import UpdateModal from "@/pages/Admin/InterfaceInfo/components/UpdateModal";
import ViewInterfaceCallsModal from './ViewInterfaceCallsModal'; // 引入新创建的组件

const TableList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [viewInterfaceCallsModalVisible, setViewInterfaceCallsModalVisible] = useState<boolean>(false);
  const [interfaceCallsData, setInterfaceCallsData] = useState<API.UserInterfaceInfo[]>([]);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.UserVO>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserVO[]>([]);

  const handleAdd = async (fields: API.UserVO) => {
    const hide = message.loading('正在添加');
    try {
      await addUserUsingPOST({
        ...fields,
      });
      hide();
      message.success('创建成功');
      handleModalVisible(false);
      return true;
    } catch (error: any) {
      hide();
      message.error('创建失败，' + error.message);
      return false;
    }
  };

  const handleUpdate = async (fields: API.UserVO) => {
    if (!currentRow) {
      return;
    }
    const hide = message.loading('修改中');
    try {
      await updateUserUsingPOST({
        id: currentRow.id,
        ...fields
      });
      hide();
      message.success('操作成功');
      return true;
    } catch (error: any) {
      hide();
      message.error('操作失败，' + error.message);
      return false;
    }
  };

  const handleRemove = async (record: API.UserVO) => {
    const hide = message.loading('正在删除');
    if (!record) return true;
    try {
      await deleteUserUsingPOST({
        id: record.id
      });
      hide();
      message.success('删除成功');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('删除失败，' + error.message);
      return false;
    }
  };

  const handleViewInterfaceCalls = async (userId: number) => {
    try {
      const res = await getAllInterfaceCallsByUserIdUsingGET({ userId });
      if (res?.data) {
        setInterfaceCallsData(res.data);
        setViewInterfaceCallsModalVisible(true);
      } else {
        message.error('获取接口调用次数失败');
      }
    } catch (error: any) {
      message.error('获取接口调用次数失败，' + error.message);
    }
  };

  const columns: ProColumns<API.UserVO>[] = [
    {
      title: '用户账号',
      dataIndex: 'userAccount',
      valueType: 'text',
      formItemProps: {
        rules: [{
          required: true,
        }]
      }
    },
    {
      title: '用户昵称',
      dataIndex: 'userName',
      valueType: 'text',
    },
    {
      title: '用户角色',
      dataIndex: 'userRole',
      valueType: 'text',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          style={{ marginRight: 8 }}
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          修改
        </a>,
        <a
          key="view"
          style={{ marginRight: 8 }}
          onClick={() => {
            handleViewInterfaceCalls(record.id);
          }}
        >
          查看接口调用次数
        </a>,
        <Button
          type="text"
          key="delete"
          danger
          onClick={() => {
            Modal.confirm({
              title: '确认删除',
              content: '确定要删除这个用户吗？',
              onOk: async () => {
                await handleRemove(record);
              },
            });
          }}
        >
          删除
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (
          params,
          sort: Record<string, SortOrder>,
          filter: Record<string, React.ReactText[] | null>,
        ) => {
          const res: any = await listUserByPageUsingGET({
            ...params,
          });
          if (res?.data) {
            return {
              data: res?.data.records || [],
              success: true,
              total: res?.data.total || 0,
            };
          } else {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reload();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
      <UpdateModal
        columns={columns}
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        visible={updateModalVisible}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.userAccount && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.userAccount}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.userAccount,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
      <CreateModal
        columns={columns}
        onCancel={() => {
          handleModalVisible(false);
        }}
        onSubmit={(values) => {
          handleAdd(values);
        }}
        visible={createModalVisible}
      />
      <ViewInterfaceCallsModal
        visible={viewInterfaceCallsModalVisible}
        onCancel={() => setViewInterfaceCallsModalVisible(false)}
        data={interfaceCallsData}
      />
    </PageContainer>
  );
};

export default TableList;
