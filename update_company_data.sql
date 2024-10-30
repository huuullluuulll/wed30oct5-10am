-- Update the company with properly formatted JSON data for directors and shareholders
UPDATE public.companies
SET 
  directors = '[
    {
      "name": "علي عمر",
      "role": "director",
      "appointed_date": "2024-01-15"
    }
  ]',
  shareholders = '[
    {
      "name": "علي عمر",
      "shares": 100,
      "share_type": "ordinary",
      "issue_date": "2024-01-15"
    }
  ]'
WHERE user_id = '394cb26a-2e48-4727-8546-145766c8aac7';