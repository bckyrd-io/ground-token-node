ALTER TABLE activities
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

ALTER TABLE activities
DROP CONSTRAINT IF EXISTS activities_latitude_check;

ALTER TABLE activities
ADD CONSTRAINT activities_latitude_check
CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90));

ALTER TABLE activities
DROP CONSTRAINT IF EXISTS activities_longitude_check;

ALTER TABLE activities
ADD CONSTRAINT activities_longitude_check
CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180));
