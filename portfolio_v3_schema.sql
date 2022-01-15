CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE messages {
  id SERIAL PRIMARY KEY,
  name VARCHAR(40) NOT NULL,
  email VARCHAR(40) NOT NULL,
  message VARCHAR(200) NOT NULL,
  received TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_archived BOOLEAN NOT NULL DEFAULT false
}

CREATE TABLE orders {
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
  total NUMERIC(4, 2) NOT NULL
}
