import Footer from '@/components/Footer';
import {LockOutlined, UserOutlined,} from '@ant-design/icons';
import {LoginForm, ProFormText,} from '@ant-design/pro-components';
import {message, Tabs} from 'antd';
import React, {useState} from 'react';
import {history} from 'umi';
import styles from './index.less';
import {userRegisterUsingPOST} from '@/services/wxapi-backend/userController';

const Register: React.FC = () => {
  const [type, setType] = useState<string>('account');

  //表单提交
  const handleSubmit = async (values: API.UserRegisterRequest) => {
    const {userPassword, checkPassword} = values;
    //校验
    if (userPassword !== checkPassword){
      message.error("两次输入的密码不一致");
      return;
    }

    try {
      // 注册
      const id = await userRegisterUsingPOST(values);
      if (id) {
        const defaultLoginSuccessMessage = '注册成功！';
        message.success(defaultLoginSuccessMessage);

        /** 此方法会跳转到 redirect 参数所在的位置 */
        // if (!history) return;
        // const { query } = history.location;
        // history.push({
        //   pathname:'user/login',
        //   query,
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect') || '/'; // 获取 redirect 参数，默认为根路径

        history.push({
          pathname: '/user/login',
          search: `?redirect=${encodeURIComponent(redirect)}`, // 使用 search 而不是 query
        });
        return;
      }
    } catch (error: any) {
      const defaultLoginFailureMessage = '注册失败，请重试！';
      message.error(defaultLoginFailureMessage);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
            submitter={{
              searchConfig:{
                submitText:'注册'
              }
            }}
            logo={<img alt="logo" src="/logo2.jpg" />}
            title="wenxin接口"
            subTitle={'Always believe in the good things'}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.UserRegisterRequest);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane key="account" tab={'账号注册'} />
          </Tabs>

          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入账号'}
                rules={[
                  {
                    required: true,
                    message: '账号是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    min: 8,
                    message: '密码至少为8位！',
                  },
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请再次输入相同密码'}
                rules={[
                  {
                    required: true,
                    message: "确认密码是必填项",
                  },
                  {
                    min: 8,
                    message: '密码至少为8位！',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('userPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不匹配！'));
                    },
                  }),
                ]}
              />
            </>
          )}
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Register;
