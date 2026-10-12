-- scripts/schema.sql
-- HOMELINE — full schema for Aiven MySQL

CREATE TABLE IF NOT EXISTS locations (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  city          VARCHAR(100) NOT NULL,
  neighborhood  VARCHAR(100) NOT NULL,
  map_link      TEXT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_location_city (city),
  INDEX idx_location_neighborhood (neighborhood)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS agents (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  name              VARCHAR(150) NOT NULL,
  email             VARCHAR(150) UNIQUE NOT NULL,
  password          VARCHAR(255) NOT NULL,
  phone_number      VARCHAR(30),
  bio               TEXT,
  profile_image_url VARCHAR(500),
  rating            DECIMAL(2,1) DEFAULT 5.0,
  role              ENUM('admin','agent') DEFAULT 'agent',
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS properties (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  listing_id      VARCHAR(30) UNIQUE NOT NULL,
  title           VARCHAR(255) NOT NULL,
  property_type   ENUM('House','Apartment','Villa','Land',
                       'Townhouse','Bungalow','Residence',
                       'Loft','Office','Commercial') NOT NULL,
  status          ENUM('For Sale','For Rent','Sold','Draft') DEFAULT 'For Sale',
  price           DECIMAL(15,2) NOT NULL,
  bedrooms        INT DEFAULT 0,
  bathrooms       INT DEFAULT 0,
  size_sqm        INT DEFAULT 0,
  description     TEXT,
  location_id     INT,
  agent_id        INT,
  is_featured     BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
  FOREIGN KEY (agent_id)    REFERENCES agents(id)    ON DELETE SET NULL,
  INDEX idx_prop_type   (property_type),
  INDEX idx_prop_status (status),
  INDEX idx_prop_price  (price),
  INDEX idx_prop_beds   (bedrooms)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS property_images (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  property_id       INT NOT NULL,
  image_url         VARCHAR(500) NOT NULL,
  image_title       VARCHAR(150),
  image_description TEXT,
  room_type         VARCHAR(80),
  is_featured       BOOLEAN DEFAULT FALSE,
  display_order     INT DEFAULT 0,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  INDEX idx_img_property (property_id),
  INDEX idx_img_featured (is_featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS property_rooms (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  property_id   INT NOT NULL,
  room_type     VARCHAR(80) NOT NULL,
  room_name     VARCHAR(150),
  description   TEXT,
  area_sqm      INT,
  display_order INT DEFAULT 0,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  INDEX idx_room_property (property_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS property_amenities (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  property_id   INT NOT NULL,
  amenity_name  VARCHAR(100) NOT NULL,
  amenity_icon  VARCHAR(60),
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  INDEX idx_amen_property (property_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS inquiries (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  property_id   INT,
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(150) NOT NULL,
  phone         VARCHAR(30),
  message       TEXT,
  status        ENUM('New','Read','Replied') DEFAULT 'New',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
  INDEX idx_inq_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;