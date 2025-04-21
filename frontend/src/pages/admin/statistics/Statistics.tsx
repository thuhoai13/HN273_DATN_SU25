import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Spin, Skeleton } from 'antd';
import { 
  ArrowUpOutlined, 
  UserOutlined, 
  ShoppingOutlined, 
  DollarCircleOutlined 
} from '@ant-design/icons';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StatisticsData {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  newUsersLastWeek: number;
  newOrdersToday: number;
  revenueByDay: { day: string; revenue: number }[];
  ordersByDay: { day: string; orders: number }[];
  newUsersByDay: { day: string; users: number }[];
  ordersByMonth: { month: string; orders: number; canceledOrders: number }[]; // Dữ liệu theo tháng
}

const Statistics = () => {
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/db.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const db = await response.json();

        const users = db.users || [];
        const orders = db.orders || [];

        const totalUsers = users.length;
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum: number, order: { total: number }) => sum + (order.total || 0), 0);

        // Lọc dữ liệu theo tuần
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const newUsersLastWeek = users.filter((user: { createdAt: string }) => 
          user.createdAt && new Date(user.createdAt) > oneWeekAgo
        ).length;

        // Đếm số đơn hàng hôm nay
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const newOrdersToday = orders.filter((order: { createdAt: string }) => {
          const orderDate = new Date(order.createdAt);
          orderDate.setHours(0, 0, 0, 0);
          return orderDate.getTime() === today.getTime();
        }).length;

        // Tạo dữ liệu doanh thu theo ngày
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const revenueByDay = days.map(day => ({
          day,
          revenue: orders
            .filter((order: { createdAt: string }) => new Date(order.createdAt).getDay() === days.indexOf(day))
            .reduce((sum: number, order: { total: number }) => sum + (order.total || 0), 0),
        }));

        // Đếm số đơn hàng theo ngày
        const ordersByDay = days.map(day => ({
          day,
          orders: orders.filter((order: { createdAt: string }) => new Date(order.createdAt).getDay() === days.indexOf(day)).length,
        }));

        // Đếm người dùng mới theo ngày
        const newUsersByDay = days.map(day => ({
          day,
          users: users.filter((user: { createdAt: string }) => new Date(user.createdAt).getDay() === days.indexOf(day)).length,
        }));

        // Tính toán dữ liệu theo tháng
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const ordersByMonth = months.map((month, index) => ({
          month,
          orders: orders.filter((order: { createdAt: string }) => new Date(order.createdAt).getMonth() === index).length,
          canceledOrders: orders.filter((order: { createdAt: string, status: string }) => new Date(order.createdAt).getMonth() === index && order.status === 'canceled').length,
        }));

        setStatistics({
          totalUsers,
          totalOrders,
          totalRevenue,
          newUsersLastWeek,
          newOrdersToday,
          revenueByDay,
          ordersByDay,
          newUsersByDay,
          ordersByMonth,  // Dữ liệu theo tháng
        });
      } catch (err: any) {
        setError('Không thể lấy dữ liệu. Vui lòng kiểm tra kết nối mạng.');
        console.error('Lỗi khi lấy dữ liệu:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) return <Skeleton active />;
  if (error) return <div style={{ color: 'red', textAlign: 'center', fontSize: '16px' }}>{error}</div>;
  if (!statistics) return <div style={{ textAlign: 'center' }}>Không có dữ liệu thống kê.</div>;

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>📊 Thống kê</h1>

      <Row gutter={16}>
        <Col span={6}>
          <Card bordered hoverable>
            <Statistic title="Tổng số người dùng" value={statistics.totalUsers.toLocaleString()} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered hoverable>
            <Statistic title="Tổng số đơn hàng" value={statistics.totalOrders.toLocaleString()} prefix={<ShoppingOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered hoverable>
            <Statistic
              title="Tổng doanh thu"
              value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(statistics.totalRevenue)}
              prefix={<DollarCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered hoverable>
            <Statistic
              title="Người dùng mới (tuần trước)"
              value={statistics.newUsersLastWeek}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="Doanh thu hàng ngày">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={statistics.revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Đơn hàng hàng ngày">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={statistics.ordersByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="Đơn hàng theo tháng">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={statistics.ordersByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#82ca9d" name="Đơn hàng đã đặt" />
                <Bar dataKey="canceledOrders" fill="#ff4d4f" name="Đơn hàng hủy" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics;
