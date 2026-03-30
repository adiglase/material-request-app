DROP TABLE IF EXISTS material_details;
DROP TABLE IF EXISTS material_requests;

CREATE TABLE material_requests (
  id SERIAL PRIMARY KEY,
  request_number VARCHAR(30) NOT NULL,
  request_date DATE NOT NULL,
  requester_name VARCHAR(100) NOT NULL,
  purpose TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_material_requests_request_number UNIQUE (request_number)
);

CREATE TABLE material_details (
  id SERIAL PRIMARY KEY,
  request_id INTEGER NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  specification TEXT,
  quantity NUMERIC(12, 2) NOT NULL,
  unit VARCHAR(30) NOT NULL,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_material_details_request_id
    FOREIGN KEY (request_id) REFERENCES material_requests(id) ON DELETE CASCADE,
  CONSTRAINT chk_material_details_quantity_positive CHECK (quantity > 0)
);

CREATE INDEX idx_material_requests_request_date_id
  ON material_requests (request_date DESC, id DESC);

CREATE INDEX idx_material_details_request_id
  ON material_details (request_id);
