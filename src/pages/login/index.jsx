import { connect } from 'dva';
import { Form, Input, Icon, Button, message } from 'antd';
import styles from './index.less';
import md5 from 'js-md5';

const FormItem = Form.Item;

function login({ form, dispatch, nLogin }) {
  const { getFieldDecorator, validateFields } = form;

  //   let {namespace} = login;

  //   登录
  function handleSubmit() {
    validateFields((err, values) => {
      if (!err) {
        values.pwd = md5(values.pwd);
        dispatch({ type: 'nLogin/login', payload: values });
      } else {
          message.error('手机号或密码错误~')
      }
    });
  }

  return (
    <div className={styles.login_container}>
      <Form className={styles.form_container}>
        <div className={styles.title}>英语趣配音管理后台</div>
        {/* 用户名 */}
        <FormItem>
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: '请输入用户名' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="phone"
            />,
          )}
        </FormItem>

        {/* 密码 */}
        <Form.Item>
          {getFieldDecorator('pwd', {
            rules: [{ required: true, message: '请输入密码' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="passpwdword"
              placeholder="Password"
            />,
          )}
        </Form.Item>

        {/* 登录 */}
        <Form.Item>
          <Button type="primary" style={{ width: '100%' }} onClick={handleSubmit}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

function mapStateToProps({ nLogin }) {
  return { nLogin };
}
export default connect(mapStateToProps)(Form.create()(login));
