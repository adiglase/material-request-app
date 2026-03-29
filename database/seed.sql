INSERT INTO material_requests (
  request_number,
  request_date,
  requester_name,
  purpose,
  notes
) VALUES
  (
    'MR-202603-001',
    '2026-03-26',
    'Adi Gunawan Lase',
    'Fabrication materials for pump base repair',
    'Needed before Monday maintenance window'
  ),
  (
    'MR-202603-002',
    '2026-03-27',
    'Rina Saputra',
    'Consumables replenishment for workshop operations',
    NULL
  ),
  (
    'MR-202603-003',
    '2026-03-28',
    'Budi Hartono',
    'Safety and electrical items for inspection follow-up',
    'Prioritize items with available stock first'
  );

INSERT INTO material_details (
  request_id,
  name,
  description,
  category,
  specification,
  quantity,
  unit,
  remarks
) VALUES
  (
    (SELECT id FROM material_requests WHERE request_number = 'MR-202603-001'),
    'Steel Plate A36',
    'Mild steel plate for base frame fabrication',
    'Raw Material',
    '6 mm thickness, 1200 x 2400 mm',
    4.00,
    'sheet',
    'For pump skid repair'
  ),
  (
    (SELECT id FROM material_requests WHERE request_number = 'MR-202603-001'),
    'Welding Rod E6013',
    'Electrode for general welding work',
    'Consumable',
    '3.2 mm',
    20.00,
    'kg',
    NULL
  ),
  (
    (SELECT id FROM material_requests WHERE request_number = 'MR-202603-002'),
    'Hex Bolt M12',
    'High tensile bolts for machine guard assembly',
    'Hardware',
    'Grade 8.8, 50 mm length',
    50.00,
    'pcs',
    'Include matching nuts and washers'
  ),
  (
    (SELECT id FROM material_requests WHERE request_number = 'MR-202603-002'),
    'Cutting Disc 4 inch',
    'Disc for angle grinder cutting work',
    'Consumable',
    'Metal cutting type',
    30.00,
    'pcs',
    NULL
  ),
  (
    (SELECT id FROM material_requests WHERE request_number = 'MR-202603-003'),
    'Safety Gloves',
    'Hand protection for inspection and repair team',
    'PPE',
    'Cut resistant level 3',
    15.00,
    'pair',
    NULL
  ),
  (
    (SELECT id FROM material_requests WHERE request_number = 'MR-202603-003'),
    'Cable Ties',
    'Nylon cable ties for cable management',
    'Electrical',
    '200 mm, black',
    100.00,
    'pcs',
    'For temporary routing cleanup'
  );
