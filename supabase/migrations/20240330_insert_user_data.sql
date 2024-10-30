-- Insert active subscription for user
INSERT INTO public.user_subscriptions (
    id,
    user_id,
    plan_id,
    status,
    start_date,
    end_date,
    created_at,
    updated_at
) VALUES (
    'f8c72a9b-1234-4567-8901-abcdef123456',
    '7a641917-c8a0-427f-9658-d2458d88b459',
    '1b59d1cc-bd4b-4067-a2e3-58694798621f', -- Professional plan
    'active',
    '2024-03-01 00:00:00+00',
    '2025-03-01 00:00:00+00',
    NOW(),
    NOW()
);

-- Insert active add-ons for user
INSERT INTO public.user_addons (
    id,
    user_id,
    addon_id,
    status,
    start_date,
    end_date,
    created_at,
    updated_at
) VALUES
-- Monthly Accounting Service
(
    'a1b2c3d4-1234-5678-90ab-cdef12345678',
    '7a641917-c8a0-427f-9658-d2458d88b459',
    '45f07b60-f7b1-4320-b0b3-a123d768a79c',
    'active',
    '2024-03-01 00:00:00+00',
    '2025-03-01 00:00:00+00',
    NOW(),
    NOW()
),
-- UK Phone Number
(
    'b2c3d4e5-2345-6789-01bc-def123456789',
    '7a641917-c8a0-427f-9658-d2458d88b459',
    'f0c720f7-affd-4336-96fe-792120e145a3',
    'active',
    '2024-03-01 00:00:00+00',
    '2025-03-01 00:00:00+00',
    NOW(),
    NOW()
),
-- Account Manager Service
(
    'c3d4e5f6-3456-7890-12cd-ef1234567890',
    '7a641917-c8a0-427f-9658-d2458d88b459',
    '5eeab360-2adf-4a7a-b79b-aece636006f0',
    'active',
    '2024-03-01 00:00:00+00',
    '2025-03-01 00:00:00+00',
    NOW(),
    NOW()
);