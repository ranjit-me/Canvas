-- Seed initial categories with IDs
INSERT INTO "category" ("id", "name", "description", "displayOrder", "createdAt", "updatedAt")
VALUES
  ('birthday', 'Birthday', 'Birthday celebration templates', 1, NOW(), NOW()),
  ('anniversary', 'Anniversary', 'Anniversary celebration templates', 2, NOW(), NOW()),
  ('wedding', 'Wedding', 'Wedding and engagement templates', 3, NOW(), NOW()),
  ('valentine', 'Valentine', 'Valentine''s Day special templates', 4, NOW(), NOW()),
  ('special-days', 'Special Days', 'Special occasion templates', 5, NOW(), NOW()),
  ('religious-cultural', 'Religious and Cultural', 'Religious and cultural celebration templates', 6, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- Seed Birthday subcategories
INSERT INTO "subcategory" ("id", "categoryId", "name", "displayOrder", "createdAt", "updatedAt")
VALUES
  ('birthday-girlfriend', 'birthday', 'Girlfriend', 1, NOW(), NOW()),
  ('birthday-boyfriend', 'birthday', 'Boyfriend', 2, NOW(), NOW()),
  ('birthday-mom', 'birthday', 'Mom', 3, NOW(), NOW()),
  ('birthday-dad', 'birthday', 'Dad', 4, NOW(), NOW()),
  ('birthday-sister', 'birthday', 'Sister', 5, NOW(), NOW()),
  ('birthday-brother', 'birthday', 'Brother', 6, NOW(), NOW()),
  ('birthday-kids', 'birthday', 'Kids', 7, NOW(), NOW()),
  ('birthday-friend', 'birthday', 'Friend', 8, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- Seed Anniversary subcategories
INSERT INTO "subcategory" ("id", "categoryId", "name", "displayOrder", "createdAt", "updatedAt")
VALUES
  ('anniversary-romantic', 'anniversary', 'Romantic', 1, NOW(), NOW()),
  ('anniversary-parents', 'anniversary', 'Parents', 2, NOW(), NOW()),
  ('anniversary-couple', 'anniversary', 'Couple', 3, NOW(), NOW()),
  ('anniversary-spouse', 'anniversary', 'Spouse', 4, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- Seed Wedding subcategories
INSERT INTO "subcategory" ("id", "categoryId", "name", "displayOrder", "createdAt", "updatedAt")
VALUES
  ('wedding-grand', 'wedding', 'Grand Wedding', 1, NOW(), NOW()),
  ('wedding-engagement', 'wedding', 'Engagement', 2, NOW(), NOW()),
  ('wedding-destination', 'wedding', 'Destination', 3, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- Seed Valentine subcategories
INSERT INTO "subcategory" ("id", "categoryId", "name", "displayOrder", "createdAt", "updatedAt")
VALUES
  ('valentine-day', 'valentine', 'Valentine''s Day', 1, NOW(), NOW()),
  ('valentine-rose', 'valentine', 'Rose Day', 2, NOW(), NOW()),
  ('valentine-chocolate', 'valentine', 'Chocolate Day', 3, NOW(), NOW()),
  ('valentine-teddy', 'valentine', 'Teddy Day', 4, NOW(), NOW()),
  ('valentine-promise', 'valentine', 'Promise Day', 5, NOW(), NOW()),
  ('valentine-hug', 'valentine', 'Hug Day', 6, NOW(), NOW()),
  ('valentine-kiss', 'valentine', 'Kiss Day', 7, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- Seed Special Days subcategories
INSERT INTO "subcategory" ("id", "categoryId", "name", "displayOrder", "createdAt", "updatedAt")
VALUES
  ('special-graduation', 'special-days', 'Graduation', 1, NOW(), NOW()),
  ('special-babyshower', 'special-days', 'Baby Shower', 2, NOW(), NOW()),
  ('special-housewarming', 'special-days', 'Housewarming', 3, NOW(), NOW()),
  ('special-achievements', 'special-days', 'Achievements', 4, NOW(), NOW()),
  ('special-reunion', 'special-days', 'Reunion', 5, NOW(), NOW()),
  ('special-thankyou', 'special-days', 'Thank You', 6, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- Seed Religious and Cultural subcategories
INSERT INTO "subcategory" ("id", "categoryId", "name", "displayOrder", "createdAt", "updatedAt")
VALUES
  ('religious-diwali', 'religious-cultural', 'Diwali', 1, NOW(), NOW()),
  ('religious-eid', 'religious-cultural', 'Eid', 2, NOW(), NOW()),
  ('religious-christmas', 'religious-cultural', 'Christmas', 3, NOW(), NOW()),
  ('religious-holi', 'religious-cultural', 'Holi', 4, NOW(), NOW()),
  ('religious-navratri', 'religious-cultural', 'Navratri', 5, NOW(), NOW()),
  ('religious-ganeshchaturthi', 'religious-cultural', 'Ganesh Chaturthi', 6, NOW(), NOW()),
  ('religious-nationaldays', 'religious-cultural', 'National Days', 7, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;
