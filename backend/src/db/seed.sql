-- seed.sql

-- Insert Users (Password: 'password123' hashed with bcrypt)
INSERT INTO users (id, email, password_hash, role, first_name, last_name) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@minierp.com', '$2a$10$wY.u18h1Z5F9pG.fR0xK0eG7.6X3sR.6f9Qz/R.1Wq.h9Z0.h.1Wq', 'ADMIN', 'Super', 'Admin'),
('22222222-2222-2222-2222-222222222222', 'sales@minierp.com', '$2a$10$wY.u18h1Z5F9pG.fR0xK0eG7.6X3sR.6f9Qz/R.1Wq.h9Z0.h.1Wq', 'SALES', 'John', 'Doe'),
('88888888-8888-8888-8888-888888888888', 'warehouse@minierp.com', '$2a$10$wY.u18h1Z5F9pG.fR0xK0eG7.6X3sR.6f9Qz/R.1Wq.h9Z0.h.1Wq', 'WAREHOUSE', 'Bob', 'Builder'),
('99999999-9999-9999-9999-999999999999', 'accounts@minierp.com', '$2a$10$wY.u18h1Z5F9pG.fR0xK0eG7.6X3sR.6f9Qz/R.1Wq.h9Z0.h.1Wq', 'ACCOUNTS', 'Alice', 'Smith');

-- Insert Customers
INSERT INTO customers (id, name, email, mobile, business_name, gst_number, customer_type, status, created_by) VALUES
('33333333-3333-3333-3333-333333333333', 'Acme Corp', 'contact@acme.com', '1234567890', 'Acme Corporation', 'GSTIN123456789', 'DISTRIBUTOR', 'ACTIVE', '22222222-2222-2222-2222-222222222222'),
('44444444-4444-4444-4444-444444444444', 'Jane Smith', 'jane.smith@retail.com', '0987654321', NULL, NULL, 'RETAIL', 'LEAD', '22222222-2222-2222-2222-222222222222');

-- Insert Customer Followups
INSERT INTO customer_followups (customer_id, notes, followup_date, created_by) VALUES
('44444444-4444-4444-4444-444444444444', 'Called Jane to discuss initial requirements.', '2023-10-01', '22222222-2222-2222-2222-222222222222');

-- Insert Products
INSERT INTO products (id, product_name, sku, category, description, unit_price, current_stock, minimum_stock_quantity, warehouse_location) VALUES
('55555555-5555-5555-5555-555555555555', 'Widget A', 'WDG-A-001', 'Widgets', 'Standard Widget', 10.00, 100, 20, 'A1'),
('66666666-6666-6666-6666-666666666666', 'Widget Pro', 'WDG-PRO-002', 'Widgets', 'Professional Grade Widget', 25.50, 50, 10, 'A2');

-- Insert Stock Movements (Initial Stock)
INSERT INTO stock_movements (product_id, movement_type, quantity, remarks, created_by) VALUES
('55555555-5555-5555-5555-555555555555', 'IN', 100, 'Initial setup', '11111111-1111-1111-1111-111111111111'),
('66666666-6666-6666-6666-666666666666', 'IN', 50, 'Initial setup', '11111111-1111-1111-1111-111111111111');

-- Insert Sales Challan
INSERT INTO sales_challans (id, challan_number, customer_id, status, total_amount, total_quantity, created_by) VALUES
('77777777-7777-7777-7777-777777777777', 'CH-2023-0001', '33333333-3333-3333-3333-333333333333', 'CONFIRMED', 120.00, 6, '22222222-2222-2222-2222-222222222222');

-- Insert Sales Challan Items
INSERT INTO sales_challan_items (challan_id, product_id, product_name_snapshot, sku_snapshot, quantity, unit_price) VALUES
('77777777-7777-7777-7777-777777777777', '55555555-5555-5555-5555-555555555555', 'Widget A', 'WDG-A-001', 2, 10.00), -- 20.00
('77777777-7777-7777-7777-777777777777', '66666666-6666-6666-6666-666666666666', 'Widget Pro', 'WDG-PRO-002', 4, 25.00); -- 100.00
