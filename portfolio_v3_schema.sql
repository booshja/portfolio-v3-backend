CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(40) NOT NULL,
  email VARCHAR(40) NOT NULL,
  message VARCHAR(200) NOT NULL,
  received TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_archived BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(40) NOT NULL,
  description VARCHAR(200) NOT NULL,
  tags VARCHAR(200) NOT NULL,
  thoughts VARCHAR(200) NOT NULL,
  image_url TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1614469723922-c043ad9fd036?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2709&q=80',
  github_url TEXT NOT NULL,
  live_url TEXT DEFAULT null,
  position INTEGER
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_first_name VARCHAR(40) NOT NULL,
  customer_last_name VARCHAR(40) NOT NULL,
  customer_email VARCHAR(40) NOT NULL,
  shipping_name VARCHAR(40) NOT NULL,
  shipping_street VARCHAR(40) NOT NULL,
  shipping_town_city VARCHAR(40) NOT NULL,
  shipping_county_state VARCHAR(5) NOT NULL,
  shipping_postal_zip_code INTEGER NOT NULL,
  shipping_country VARCHAR(2) NOT NULL,
  billing_name VARCHAR(40) NOT NULL,
  billing_street VARCHAR(40) NOT NULL,
  billing_town_city VARCHAR(40) NOT NULL,
  billing_county_state VARCHAR(5) NOT NULL,
  billing_postal_zip_code INTEGER NOT NULL,
  billing_country VARCHAR(2) NOT NULL,
  payment_gateway VARCHAR(6) NOT NULL,
  payment_card_token VARCHAR(40) NOT NULL,
  list_items VARCHAR(200) NOT NULL,
  total NUMERIC(4, 2) NOT NULL,
  status VARCHAR(9) NOT NULL default 'PENDING'
);
