import { Table } from 'antd';
/**
 * @description: 表格组件
 * @param {type}
 * @return:
 */
function commonTable(props) {
  let {
    tableLayout,
    rowKey,
    loading,
    xScroll,
    yScroll,
    columns,
    dataSource,
    page,
    row,
    total,
    newTotal,
    showPagination = true,
    handleTableChange,
    showSizeChanger,
    showQuickJumper,
    handlePageChange,
    handleSizeChange,
    rowSelection,
  } = props;
  return (
    <Table
      tableLayout={tableLayout || 'fixed'}
      className="common_table"
      rowKey={rowKey || 'id'}
      loading={loading}
      columns={columns}
      rowSelection={rowSelection}
      onChange={handleTableChange}
      dataSource={dataSource}
      scroll={{ x: xScroll || 500, y: yScroll || 600 }}
      pagination={
        showPagination
          ? {
              current: page || 1,
              pageSize: row || 10,
              total: total || 0,
              showSizeChanger: showSizeChanger, // 改变pageSize
              showQuickJumper: showQuickJumper, // 快速跳转
              onShowSizeChange: handleSizeChange, // pageSize变化
              onChange: handlePageChange, // 页码变化
              showTotal: (total, range) => `共${newTotal || total}条记录`, // 显示数据总量
            }
          : false
      }
    />
  );
}

export default commonTable;
