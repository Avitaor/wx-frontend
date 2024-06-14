import { Modal, Table } from 'antd';
import React from 'react';

export type Props = {
  visible: boolean;
  onCancel: () => void;
  data: API.UserInterfaceInfo[];
};

const ViewInterfaceCallsModal: React.FC<Props> = ({ visible, onCancel, data }) => {
  const columns = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '接口ID',
      dataIndex: 'interfaceInfoId',
      key: 'interfaceInfoId',
    },
    {
      title: '总调用次数',
      dataIndex: 'totalNum',
      key: 'totalNum',
    },
    {
      title: '剩余调用次数',
      dataIndex: 'leftNum',
      key: 'leftNum',
    },
  ];

  return (
    <Modal visible={visible} title="接口调用次数" footer={null} onCancel={onCancel}>
      <Table columns={columns} dataSource={data} rowKey="id" />
    </Modal>
  );
};

export default ViewInterfaceCallsModal;
