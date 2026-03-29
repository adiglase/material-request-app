# Database Notes

This folder contains the PostgreSQL schema for the technical assessment.

Main file:

- [schema.sql](./schema.sql)

## Tables

- `material_requests`: stores the request header with `request_number`, `request_date`, `requester_name`, `purpose`, and `notes`
- `material_details`: stores the material rows for each request with `name`, `description`, `category`, `specification`, `quantity`, `unit`, and `remarks`

## Relationship

- one `material_requests` row can have many `material_details` rows
- `material_details.request_id` references `material_requests.id`

## Database Rules

- required fields use `NOT NULL`
- `request_number` is unique
- deleting a request also deletes its detail rows with `ON DELETE CASCADE`
- both tables include `created_at` and `updated_at`

- most field validation will be handled in NestJS with DTOs and `ValidationPipe`
