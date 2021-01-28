import { Fragment, useState, useMemo, useCallback } from 'react';
import {
  Menu,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Cascader,
  Button,
  Icon,
  Dropdown,
  message,
} from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import styles from './index.less';
import { useEffect } from 'react';

const { MonthPicker } = DatePicker;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const MenuItem = Menu.Item;
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

/**
 * Description: 搜索组件
 * @param {array} fields - 表单组
 * @param {array} btns - 按钮组
 * @param {object} [searchObj] - 搜索表单值，开始没有封装进来，后面需要用来判断清空表单，所以非必传
 * @callback OnSearch - 搜索的回调方法
 * @callback OnReset - 重置的回调方法
 * @return:
 */

function CommonSearch(props) {
  // 是否展开
  const [expandStatus, setExpandStatus] = useState(false);

  // 属性值
  let { form, fields = [], btns, OnSearch, OnReset, searchObj } = props;
  let { getFieldDecorator, validateFields, resetFields } = form;

  useEffect(() => {
    // 清空表单
    if (window.isEffective(searchObj) && JSON.stringify(searchObj) === '{}') {
      resetFields();
    }
  }, [resetFields, searchObj]);

  // 操作按钮处理
  const formatBtns = useMemo(() => {
    const directBtns = btns && btns.length > 0 ? btns.slice(0, 2) : [];
    const otherBtns = btns && btns.length > 0 ? btns.slice(2) : [];
    const returnBtns = [];
    // 基本操作按钮
    directBtns.forEach((item, index) => {
      returnBtns.push(
        <Button
          className={styles.button}
          key={index}
          disabled={item.disabled}
          style={item.style}
          type={item.type || 'primary'}
          icon={item.icon}
          onClick={item.handleBtnClick}
        >
          {item.label || '新增'}
        </Button>,
      );
    });

    // 更多操作按钮
    if (otherBtns && otherBtns.length > 0) {
      const dropDownBtns = (
        <Menu>
          {otherBtns.map((item, index) => (
            <MenuItem key={index + 2} onClick={item.handleBtnClick}>
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      );
      const btnDropDown = (
        <Dropdown key="more" overlay={dropDownBtns} placement="bottomCenter">
          <Button>更多操作</Button>
        </Dropdown>
      );
      returnBtns.push(btnDropDown);
    }

    return returnBtns;
  }, [btns]);

  // 表单控件集合
  let formTypes = {
    input: createInput, // 输入框
    select: createSelect, //下拉框
    cascader: createCascader, // 级联选择器
    datePicker: createDatePicker, // 日期选择器
    monthPicker: createMonthPicker, // 日期选择器
    rangePicker: createRangePicker, // 日期范围选择器
    inputNumber: createInputNumber, // 数字输入框
  };

  // 展开全部
  const toggleExpandStatus = useCallback(() => {
    setExpandStatus(!expandStatus);
  }, [expandStatus]);

  // 提交搜索
  const handleSearch = useCallback(() => {
    validateFields((err, values) => {
      if (err) return;
      let queryObj = {}; // 放置处理后的搜索内容
      fields.forEach((item) => {
        let key = item.key;
        let value = values[key];

        if (window.checkType('String', value)) {
          // 去除字符串前后空格
          value = value.trim();
        }

        if (window.isEffective(value)) {
          // 去除值为undefined或''或null的key
          if (item.type === 'datePicker') {
            // 时间选择器处理
            queryObj[key] = moment(value).format(item.format || 'YYYY-MM-DD') || undefined;
          } else if (item.type === 'rangePicker') {
            // 时间范围选择器处理
            queryObj[item.keyStart] =
              (value && value.length > 0 && moment(value[0]).format(item.format || 'YYYY-MM-DD')) ||
              undefined;
            queryObj[item.keyEnd] =
              (value && value.length > 0 && moment(value[1]).format(item.format || 'YYYY-MM-DD')) ||
              undefined;
          } else {
            queryObj[key] = value;
          }
        }
      });

      // 是否传入搜索方法
      if (typeof OnSearch === 'function') {
        // 搜索内容queryObj是否为空对象
        if (Object.keys(queryObj).length === 0) {
          message.warn('搜索内容不能为空');
        } else {
          OnSearch(queryObj, form);
        }
      } else {
        throw new Error('OnSearch is not a function');
      }
    });
  }, [OnSearch, fields, form, validateFields]);

  // 重置搜索表单
  const handleReset = useCallback(() => {
    resetFields();
    if (!OnReset) {
      throw new Error('OnReset undefined');
    } else {
      OnReset({});
    }
  }, [OnReset, resetFields]);

  /**
   * Description: Input控件
   * Author： xiongziting
   * @param {object} item - 输入框组件属性对象
   * @param {string} item.key - 字段名
   * @param {string} [item.disabled=false] - 是否禁用
   * @param {array} [item.initialValue] - 默认值
   * @param {string} [item.placeholder="请输入"] - 输入框占位文本
   * @param {object} [item.style] - 自定义样式
   * @return:
   */

  function createInput(item) {
    return (
      <FormItem label={item.label}>
        {getFieldDecorator(item.key, {
          initialValue: item.initialValue || undefined,
        })(
          <Input
            className={styles.form_item_container}
            allowClear
            disabled={item.disabled || false}
            placeholder={item.placeholder || '请输入'}
            style={{ width: '200px', ...item.style }}
          />,
        )}
      </FormItem>
    );
  }

  /**
   * Description: InputNumber控件
   * Author： xiongziting
   * @param {object} item - 输入框组件属性对象
   * @param {string} item.key - 字段名
   * @param {array} [item.initialValue] - 默认值
   * @param {string} item.key - 最小值
   * @param {string} item.key - 最大值
   * @param {boolean} [item.disabled=false] - 禁用
   * @param {string} [item.decimalSeparator="0"] - 小数点
   * @param {string} [item.placeholder="请输入"] - 输入框占位文本
   * @param {object} [item.style] - 自定义样式
   * @return:
   */

  function createInputNumber(item) {
    return (
      <FormItem label={item.label}>
        {getFieldDecorator(item.key, {
          initialValue: item.initialValue || undefined,
        })(
          <InputNumber
            min={item.min || 1}
            max={item.max || 99999}
            className={styles.form_item_container}
            disabled={item.disabled || false}
            decimalSeparator={item.decimalSeparator || '0'}
            placeholder={item.placeholder || '请输入'}
            style={{ width: '200px', ...item.style }}
          />,
        )}
      </FormItem>
    );
  }
  /**
   * Description: 下拉选择Select组件
   * Author: xiongziting
   * @param {object} item - 下拉框组件属性对象
   * @param {string} item.key - 字段名
   * @param {array} item.options - 选项数组
   * @param {boolean} [item.showSearch=false] - 搜索
   * @param {array} [item.initialValue] - 默认值
   * @param {boolean} [item.disabled=false]
   * @param {boolean} [item.allowClear] - 允许清空
   * @param {string} [item.placeholder="请选择"] - 输入框占位文本
   * @param {object} [item.styles] - 自定义样式
   * @callback onChange(values,form) - 值改变的回调
   * @return:
   */

  function createSelect(item) {
    if (!item.options) {
      // 判断options是否传入
      throw new Error('select options undefined');
    }
    if (!window.checkType('Array', item.options)) {
      // 检测options是否是数组
      throw new Error('options is not Array');
    }
    let opt_value = item.opt_value || 'value';
    let opt_label = item.opt_label || 'label';
    return (
      <FormItem label={item.label}>
        {getFieldDecorator(item.key, {
          initialValue: item.initialValue || undefined,
        })(
          <Select
            className={styles.form_item_container}
            allowClear={item.allowClear}
            optionFilterProp="children"
            notFoundContent="未找到搜索项"
            disabled={item.disabled || false}
            showSearch={item.showSearch || true}
            style={{ width: '200px', ...item.style }}
            placeholder={item.placeholder || '请选择'}
            onChange={item.onChange && ((value) => item.onChange(value, form))}
          >
            {!!item.options &&
              item.options.length > 0 &&
              item.options.map((opt, index) => {
                return (
                  <Option key={index} value={opt[opt_value]}>
                    {opt[opt_label]}
                  </Option>
                );
              })}
          </Select>,
        )}
      </FormItem>
    );
  }

  /**
   * Description: 级联选择组件
   * Author：xiongziting
   * @param {object} item -  级联选择属性对象
   * @param {string} item.key - 字段名
   * @param {array} item.options - 可选项数据源
   * @param {object} [item.fieldNames] - 自定义字段名
   * @example { label: 'name', value: 'code', children: 'items' }
   * @param {string} [item.size="small"] - 输入框大小
   * @param {array} [item.initialValue] - 默认值
   * @param {string} [item.placeholder="请选择"] - 输入框占位文本
   * @param {object} [item.styles] - 自定义样式
   * @return:
   */

  function createCascader(item) {
    if (!item.options) {
      // options是否传入
      throw new Error('cascader options undefined');
    }
    if (!window.checkType('Array', item.options)) {
      // options是否为数组
      throw new Error('options is not Array');
    }
    return (
      <FormItem label={item.label}>
        {getFieldDecorator(item.key, {
          initialValue: item.initialValue || [],
        })(
          <Cascader
            className={styles.form_item_container}
            allowClear
            notFoundContent="未找到搜索项"
            options={item.options}
            fieldNames={item.fieldNames}
            size={item.size}
            style={{ width: '200px', ...item.style }}
            placeholder={item.placeholder || '请选择'}
            onChange={item.cascaderChange}
          />,
        )}
      </FormItem>
    );
  }
  /**
   * Description: 日期选择DatePicker组件
   * Author: xiongziting
   * @param {object} item - 组件属性对象
   * @param {string} item.key - 字段名
   * @param {string} [item.format="YYYY-MM-DD HH:mm:ss"] - 日期格式
   * @param {boolean} [item.showTime=false] - 是否显示时间
   * @param {string} [item.size="default"] 控件大小
   * @param {string} [item.placeholder="请选择"] - 输入框占位文本
   * @param {object} [item.styles] - 自定义样式
   * @return:
   */

  function createDatePicker(item) {
    return (
      <FormItem label={item.label}>
        {getFieldDecorator(item.key, {
          initialValue: item.initialValue || undefined,
        })(
          <DatePicker
            className={styles.form_item_container}
            locale={locale}
            allowClear
            format={item.format || 'YYYY-MM-DD HH:mm:ss'}
            showTime={item.showTime || false}
            size={item.size || 'default'}
            style={{ width: '200px', ...item.style }}
            placeholder={item.placeholder || '请选择'}
          />,
        )}
      </FormItem>
    );
  }

  /**
   * Description: 月份选择MonthPicker组件
   * Author: xiongziting
   * @param {object} item - 组件属性对象
   * @param {string} item.key - 字段名
   * @param {string} [item.format="YYYY-MM"] - 日期格式
   * @param {string} [item.size="default"] 控件大小
   * @param {string} [item.placeholder="请选择"] - 输入框占位文本
   * @param {object} [item.styles] - 自定义样式
   * @return:
   */

  function createMonthPicker(item) {
    return (
      <FormItem label={item.label}>
        {getFieldDecorator(item.key, {
          initialValue: item.initialValue || undefined,
        })(
          <MonthPicker
            className={styles.form_item_container}
            locale={locale}
            allowClear
            format={item.format || 'YYYY-MM'}
            size={item.size || 'default'}
            style={{ width: '200px', ...item.style }}
            placeholder={item.placeholder || '请选择'}
          />,
        )}
      </FormItem>
    );
  }
  /**
   * Description: 日期范围选择RangePicker组件
   * Author: xiongziting
   * @param {object} item - 组件属性对象
   * @param {string} item.key - 字段名
   * @param {string} [item.format="YYYY-MM-DD HH:mm:ss"] - 日期格式
   * @param {boolean} [item.showTime=false] - 是否显示时间
   * @param {string} [item.size="default"] 控件大小
   * @param {string} [item.placeholder] - 输入框占位文本
   * @param {object} [item.styles] - 自定义样式
   * @return:
   */

  function createRangePicker(item) {
    return (
      <FormItem label={item.label}>
        {getFieldDecorator(item.key, {
          initialValue: item.initialValue || undefined,
        })(
          <RangePicker
            className={styles.form_item_container}
            locale={locale}
            allowClear
            placeholder={item.placeholder || ['开始时间', '结束时间']}
            format={item.format || 'YYYY-MM-DD HH:mm:ss'}
            showTime={item.showTime || false}
            size={item.size || 'default'}
            style={{ width: '230px', ...item.style }}
            onChange={item.onChange && ((value) => item.onChange(value, form))}
          />,
        )}
      </FormItem>
    );
  }

  const fieldsFlag = fields && fields.length > 0;

  const defaultFields = useMemo(
    () =>
      (fieldsFlag &&
        fields.slice(0, 3).map((item, index) => {
          if (item.key) {
            return <div key={`default_${item.key}`}>{formTypes[item.type](item)}</div>;
          }
          return null;
        })) ||
      [],
    [fields, fieldsFlag, formTypes],
  );

  const otherFields = useMemo(
    () =>
      (expandStatus &&
        fieldsFlag &&
        fields.slice(3).map((item, index) => {
          if (item.key) {
            return <div key={`other_${item.key}`}>{formTypes[item.type](item)}</div>;
          }
          return null;
        })) ||
      [],
    [expandStatus, fields, fieldsFlag, formTypes],
  );

  const searchBtn = useMemo(
    () =>
      (fieldsFlag && (
        <Fragment>
          <Button type="primary" className={styles.button} onClick={handleSearch} key="search">
            <Icon type="search" />
            搜索
          </Button>
          <Button className={styles.button} onClick={handleReset} key="reload">
            <Icon type="reload" />
            重置
          </Button>
          {(fields.length > 3 && (
            <Button
              type="link"
              className={styles.button}
              onClick={toggleExpandStatus}
              key="up_down"
            >
              {expandStatus ? '收起' : '展开全部'} <Icon type={expandStatus ? 'up' : 'down'} />
            </Button>
          )) ||
            null}
        </Fragment>
      )) ||
      [],
    [fieldsFlag, handleSearch, handleReset, fields.length, toggleExpandStatus, expandStatus],
  );

  return (
    <Form layout="vertical" className={styles.form_container} {...formItemLayout}>
      {/* 搜索表单 */}
      <div>
        {defaultFields}
        {otherFields}
        {searchBtn}
      </div>

      {/* 操作按钮组 */}
      <div className={styles.btn_container}>{formatBtns}</div>
    </Form>
  );
}

export default Form.create()(CommonSearch);
