-- Theme Preferences Table
CREATE TABLE IF NOT EXISTS theme_preferences (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL UNIQUE,
  theme_variant VARCHAR(50) NOT NULL DEFAULT 'dark-cyberpunk',
  intensity DECIMAL(3, 2) NOT NULL DEFAULT 1.0,
  glow_intensity DECIMAL(3, 2) NOT NULL DEFAULT 1.0,
  animation_speed DECIMAL(3, 2) NOT NULL DEFAULT 1.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);

-- Theme Presets Table (for saving multiple theme configurations)
CREATE TABLE IF NOT EXISTS theme_presets (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  theme_variant VARCHAR(50) NOT NULL,
  intensity DECIMAL(3, 2) NOT NULL,
  glow_intensity DECIMAL(3, 2) NOT NULL,
  animation_speed DECIMAL(3, 2) NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  usage_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_is_public (is_public)
);

-- Notification Preferences Table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL UNIQUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  in_app_notifications BOOLEAN DEFAULT TRUE,
  sound_enabled BOOLEAN DEFAULT TRUE,
  digest_frequency VARCHAR(20) DEFAULT 'weekly',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  action_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at)
);

-- User Achievements Table
CREATE TABLE IF NOT EXISTS user_achievements (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  achievement_id VARCHAR(36) NOT NULL,
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_achievement (user_id, achievement_id),
  INDEX idx_user_id (user_id)
);

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  icon_url VARCHAR(500),
  points INT DEFAULT 0,
  criteria VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Points Table
CREATE TABLE IF NOT EXISTS user_points (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL UNIQUE,
  total_points INT DEFAULT 0,
  level INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);

-- Search Index Table
CREATE TABLE IF NOT EXISTS search_index (
  id VARCHAR(36) PRIMARY KEY,
  content_type VARCHAR(50) NOT NULL,
  content_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  tags VARCHAR(500),
  searchable_text LONGTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FULLTEXT INDEX ft_searchable_text (searchable_text),
  INDEX idx_content_type (content_type),
  INDEX idx_content_id (content_id)
);

-- API Keys Table
CREATE TABLE IF NOT EXISTS api_keys (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  key_hash VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  last_used TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_key_hash (key_hash)
);

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  event_type VARCHAR(100) NOT NULL,
  event_data JSON,
  session_id VARCHAR(36),
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_event_type (event_type),
  INDEX idx_created_at (created_at),
  INDEX idx_session_id (session_id)
);

-- Cache Table
CREATE TABLE IF NOT EXISTS cache_store (
  key VARCHAR(255) PRIMARY KEY,
  value LONGTEXT NOT NULL,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_expires_at (expires_at)
);
