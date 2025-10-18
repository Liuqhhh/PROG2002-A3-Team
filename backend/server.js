const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 创建数据库连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '143511', 
  database: 'prog2002_a3',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 日期格式转换函数
function convertToMySQLDate(isoDate) {
  if (!isoDate) return isoDate;
  
  if (isoDate.includes('T')) {
    const dateObj = new Date(isoDate);
    return dateObj.toISOString().slice(0, 19).replace('T', ' ');
  }
  
  return isoDate;
}

// 测试数据库连接
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT 1 + 1 AS solution');
    res.json({ 
      message: '🎉 数据库连接成功!', 
      data: rows,
      database: 'prog2002_a3'
    });
  } catch (error) {
    res.status(500).json({ 
      error: '❌ 数据库连接失败: ' + error.message,
      tip: '请检查：1. MySQL是否启动 2. 数据库名是否正确 3. 密码是否正确'
    });
  }
});

// 获取所有活动
app.get('/api/events', async (req, res) => {
  try {
    console.log('📨 接收到获取活动列表请求');
    
    const [rows] = await pool.execute(`
      SELECT * FROM events 
      ORDER BY event_date ASC
    `);
    
    console.log(`✅ 成功返回 ${rows.length} 个活动`);
    res.json(rows);
    
  } catch (error) {
    console.error('❌ 获取活动失败:', error);
    res.status(500).json({ error: '获取活动列表失败: ' + error.message });
  }
});

// 获取单个活动详情 + 注册列表
app.get('/api/events/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    console.log(`📨 请求活动详情 ID: ${eventId}`);
    
    const [eventRows] = await pool.execute(
      'SELECT * FROM events WHERE id = ?', 
      [eventId]
    );
    
    if (eventRows.length === 0) {
      return res.status(404).json({ error: '活动未找到' });
    }
    
    const [registrationRows] = await pool.execute(
      `SELECT * FROM registrations 
       WHERE event_id = ? 
       ORDER BY registration_date DESC`,
      [eventId]
    );
    
    console.log(`✅ 返回活动详情，包含 ${registrationRows.length} 个注册`);
    res.json({
      event: eventRows[0],
      registrations: registrationRows
    });
    
  } catch (error) {
    console.error('❌ 获取活动详情失败:', error);
    res.status(500).json({ error: error.message });
  }
});

// 用户注册活动
app.post('/api/registrations', async (req, res) => {
  try {
    const { event_id, user_name, user_email, tickets_purchased } = req.body;
    
    console.log('📨 接收到注册请求:', { event_id, user_name, user_email, tickets_purchased });
    
    if (!event_id || !user_name || !user_email || !tickets_purchased) {
      return res.status(400).json({ error: '请填写所有必填字段' });
    }
    
    if (tickets_purchased <= 0) {
      return res.status(400).json({ error: '票数必须大于0' });
    }
    
    const [eventRows] = await pool.execute(
      'SELECT id, title, available_tickets FROM events WHERE id = ?',
      [event_id]
    );
    
    if (eventRows.length === 0) {
      return res.status(404).json({ error: '活动不存在' });
    }
    
    const [existing] = await pool.execute(
      'SELECT id FROM registrations WHERE event_id = ? AND user_email = ?',
      [event_id, user_email]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ error: '该邮箱已经注册过此活动' });
    }
    
    const [result] = await pool.execute(
      `INSERT INTO registrations 
       (event_id, user_name, user_email, tickets_purchased) 
       VALUES (?, ?, ?, ?)`,
      [event_id, user_name, user_email, tickets_purchased]
    );
    
    console.log(`✅ 注册成功，注册ID: ${result.insertId}`);
    res.json({ 
      message: '注册成功!', 
      registrationId: result.insertId,
      eventTitle: eventRows[0].title
    });
    
  } catch (error) {
    console.error('❌ 注册失败:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== 管理员API ====================

// 创建新活动 (管理员)
app.post('/api/admin/events', async (req, res) => {
  try {
    const { title, description, event_date, location, ticket_price, available_tickets } = req.body;
    
    console.log('📨 接收到创建活动请求:', { title, event_date, location });
    
    // 🟢 修复日期格式
    const mysqlDate = convertToMySQLDate(event_date);
    console.log(`🔄 日期格式转换: ${event_date} -> ${mysqlDate}`);
    
    if (!title || !mysqlDate || !location || ticket_price === undefined || !available_tickets) {
      return res.status(400).json({ 
        error: '请填写所有必填字段: title, event_date, location, ticket_price, available_tickets' 
      });
    }
    
    if (ticket_price < 0 || available_tickets <= 0) {
      return res.status(400).json({ error: '票价不能为负数，可用票数必须大于0' });
    }
    
    const [result] = await pool.execute(
      `INSERT INTO events 
       (title, description, event_date, location, ticket_price, available_tickets) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, mysqlDate, location, ticket_price, available_tickets]
    );
    
    console.log(`✅ 活动创建成功，活动ID: ${result.insertId}`);
    res.json({ 
      message: '活动创建成功!', 
      eventId: result.insertId,
      event: {
        id: result.insertId,
        title,
        description,
        event_date: mysqlDate,
        location,
        ticket_price,
        available_tickets
      }
    });
    
  } catch (error) {
    console.error('❌ 创建活动失败:', error);
    res.status(500).json({ error: error.message });
  }
});

// 更新活动 (管理员) - 🟢 修复日期格式问题
app.put('/api/admin/events/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    console.log(`📨 接收到更新活动请求 ID: ${eventId}`, req.body);
    
    const { 
      title, 
      description, 
      event_date, 
      location, 
      ticket_price, 
      available_tickets, 
      event_status, 
      category 
    } = req.body;
    
    // 🟢 修复日期格式
    const mysqlDate = convertToMySQLDate(event_date);
    console.log(`🔄 日期格式转换: ${event_date} -> ${mysqlDate}`);
    
    console.log('🔍 处理后的数据:', {
      title, description, event_date: mysqlDate, location, ticket_price, available_tickets
    });
    
    if (!title || !mysqlDate || !location || ticket_price === undefined || available_tickets === undefined) {
      console.log('❌ 验证失败 - 缺少必填字段');
      return res.status(400).json({ 
        success: false,
        error: '请填写所有必填字段: 标题、活动日期、地点、票价、可用票数' 
      });
    }
    
    console.log(`🔍 检查活动是否存在: ${eventId}`);
    const [existingEvent] = await pool.execute(
      'SELECT id, title FROM events WHERE id = ?',
      [eventId]
    );
    
    console.log(`🔍 现有活动查询结果:`, existingEvent);
    
    if (existingEvent.length === 0) {
      console.log(`❌ 活动未找到: ${eventId}`);
      return res.status(404).json({ 
        success: false,
        error: '活动未找到' 
      });
    }
    
    console.log(`🔄 开始更新活动 ${eventId}`);
    
    const [result] = await pool.execute(
      `UPDATE events 
       SET title = ?, description = ?, event_date = ?, location = ?, 
           ticket_price = ?, available_tickets = ?, event_status = ?, category = ?
       WHERE id = ?`,
      [
        title, 
        description || '', 
        mysqlDate,
        location, 
        parseFloat(ticket_price), 
        parseInt(available_tickets), 
        event_status || 'active', 
        category || '', 
        parseInt(eventId)
      ]
    );
    
    console.log(`✅ 更新成功，影响行数: ${result.affectedRows}`);
    
    res.json({ 
      success: true,
      message: '活动更新成功!',
      eventId: parseInt(eventId),
      affectedRows: result.affectedRows
    });
    
  } catch (error) {
    console.error('❌ 更新活动失败 - 详细错误:', error);
    console.error('🔍 SQL错误信息:', error.sqlMessage);
    console.error('📝 错误代码:', error.code);
    
    res.status(500).json({ 
      success: false,
      error: '服务器内部错误: ' + error.message,
      sqlError: error.sqlMessage,
      code: error.code
    });
  }
});

// 删除活动 (管理员)
app.delete('/api/admin/events/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    console.log(`📨 接收到删除活动请求 ID: ${eventId}`);
    
    const [registrations] = await pool.execute(
      'SELECT id, user_name FROM registrations WHERE event_id = ?',
      [eventId]
    );
    
    if (registrations.length > 0) {
      return res.status(409).json({ 
        error: '无法删除此活动，因为已有用户注册。请先删除相关注册记录。',
        registrationsCount: registrations.length,
        registrations: registrations
      });
    }
    
    const [result] = await pool.execute(
      'DELETE FROM events WHERE id = ?',
      [eventId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '活动未找到' });
    }
    
    console.log(`✅ 活动删除成功，活动ID: ${eventId}`);
    res.json({ 
      message: '活动删除成功!',
      eventId: parseInt(eventId)
    });
    
  } catch (error) {
    console.error('❌ 删除活动失败:', error);
    res.status(500).json({ error: error.message });
  }
});

// 获取所有注册记录 (管理员)
app.get('/api/admin/registrations', async (req, res) => {
  try {
    console.log('📨 接收到获取所有注册记录请求');
    
    const [rows] = await pool.execute(`
      SELECT r.*, e.title as event_title, e.event_date, e.location
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      ORDER BY r.registration_date DESC
    `);
    
    console.log(`✅ 成功返回 ${rows.length} 个注册记录`);
    res.json(rows);
    
  } catch (error) {
    console.error('❌ 获取注册记录失败:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 后端服务器运行在: http://localhost:${PORT}`);
  console.log('🎯 日期格式问题已修复！');
});