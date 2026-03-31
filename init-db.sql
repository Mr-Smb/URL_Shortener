-- URL Shortener Database Initialization Script
-- Comprehensive schema for URL shortener and Analytics

CREATE TABLE IF NOT EXISTS urls (
    id SERIAL PRIMARY KEY,
    short_code VARCHAR(20) UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    custom_alias VARCHAR(255) UNIQUE,
    expiry_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP    
);

CREATE TABLE IF NOT EXISTS click_events (
    id SERIAL PRIMARY KEY,
    short_code VARCHAR(20) NOT NULL,
    ip VARCHAR(45),
    country VARCHAR(100),
    city VARCHAR(100),
    device VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (short_code) REFERENCES urls(short_code) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls(short_code);
CREATE INDEX IF NOT EXISTS idx_urls_custom_alias ON urls(custom_alias);
CREATE INDEX IF NOT EXISTS idx_urls_expiry_time ON urls(expiry_time);
CREATE INDEX IF NOT EXISTS idx_clicks_short_code ON click_events(short_code);
CREATE INDEX IF NOT EXISTS idx_clicks_clicked_at ON click_events(clicked_at);
CREATE INDEX IF NOT EXISTS idx_clicks_country ON click_events(country);
CREATE INDEX IF NOT EXISTS idx_clicks_device ON click_events(device);

-- Views for Grafana Dashboards

-- 1. Total clicks per link
CREATE OR REPLACE VIEW grafana_clicks_per_link AS
SELECT 
    u.short_code, 
    u.original_url, 
    COALESCE(u.custom_alias, '') as custom_alias,
    COUNT(c.id) as total_clicks
FROM urls u
LEFT JOIN click_events c ON u.short_code = c.short_code
GROUP BY u.short_code, u.original_url, u.custom_alias;

-- 2. Clicks over time (Daily)
CREATE OR REPLACE VIEW grafana_clicks_over_time AS
SELECT 
    DATE_TRUNC('day', clicked_at) as click_date,
    COUNT(id) as total_clicks
FROM click_events
GROUP BY click_date
ORDER BY click_date ASC;

-- 3. Top Countries
CREATE OR REPLACE VIEW grafana_top_countries AS
SELECT 
    country,
    COUNT(id) as total_clicks
FROM click_events
WHERE country IS NOT NULL
GROUP BY country
ORDER BY total_clicks DESC;

-- 4. Device Distribution
CREATE OR REPLACE VIEW grafana_device_distribution AS
SELECT 
    device,
    COUNT(id) as total_clicks
FROM click_events
WHERE device IS NOT NULL
GROUP BY device
ORDER BY total_clicks DESC;
