use wrap;

-- Create the WRAP Plans
insert into wrap_plan (id, plan_name, createdAt, updatedAt) 
select 1, 'What is WRAP?', NOW(), NOW() union
select 2, 'Daily plan', NOW(), NOW() union
select 3, 'Stressors', NOW(), NOW() union
select 4, 'Early warning signs', NOW(), NOW() union
select 5, 'When things are breaking down or getting much worse', NOW(), NOW() union
select 6, 'Crisis Planning', NOW(), NOW() union
select 7, 'Post-Crisis Plan', NOW(), NOW();


-- Add WRAP Plan Sections
insert into wrap_plan_section (wrap_plan_id, section_text, isActionable, sort_weight, createdAt, updatedAt) 
select 1, 'What do I want to accomplish with my WRAP?', 0, 100, NOW(), NOW() union
select 2, 'What am I like on my best day?', 0, 100, NOW(), NOW() union
select 2, 'What do I need to do every day to stay well or to stay on track with my goals?', 1, 200, NOW(), NOW() union
select 2, 'What things might I need to do some days to stay well or to stay on track with my goals? When or how often do I need to do them?', 1, 300, NOW(), NOW() union
select 2, 'What does a typical day look like when I am taking care of my wellness or staying focused on my goals?', 1, 400, NOW(), NOW() union
select 3, 'What things might make me feel unwell or throw me off track if they happen?', 0, 100, NOW(), NOW() union
select 3, 'What actions will I take and what wellness tools will I use to respond when stressors come up in my life?', 1, 200, NOW(), NOW() union
select 3, 'What can I do to limit my exposure to stressors?', 1, 300, NOW(), NOW() union
select 4, 'What are my early warning signs?', 0, 100, NOW(), NOW() union
select 4, 'What actions will I take and what wellness tools will I use to respond when I notice my early warning signs?', 1, 200, NOW(), NOW() union
select 4, 'What additional actions or tools might I use to respond to my early warning signs if I feel like they would help?', 1, 300, NOW(), NOW() union
select 5, 'What are my signs that things are breaking down or getting much worse?', 0, 100, NOW(), NOW() union
select 5, 'What actions will I take and whata wellness tools will I use to respond when things are breaking down or getting much worse?', 1, 200, NOW(), NOW() union
select 5, 'What additional actions or tools might I use to respond to signs that things are breaking down or getting much worse if I feel like they would help?', 1, 300, NOW(), NOW() union
select 6, 'This is what I look like when I''m well:', 0, 100, NOW(), NOW() union
select 6, 'This is what I look like when it gets too bad for me to handle on my own:', 0, 200, NOW(), NOW() union
select 6, 'If my behavior endangers or has negative effects on me or others, I want my supporters to:', 0, 300, NOW(), NOW() union
select 6, 'If my supporters disagree on a course of action, I want them to settle the dispute in this way:', 0, 400, NOW(), NOW() union
select 6, 'When I''m in a crisis, please do these things to help me feel better and get back to wellness:', 0, 500, NOW(), NOW() union
select 6, 'When I''m in crisis, please do not do these things, which do not help and would make things much worse:', 0, 600, NOW(), NOW() union
select 6, 'These are the signs that will let my supporters know it''s safe to stop using this crisis plan:', 0, 700, NOW(), NOW() union
select 7, 'This is what I look like when I''m out of this crisis and ready to use this post-crisis plan:', 0, 100, NOW(), NOW() union
select 7, 'This is how I want to feel when I''m fully recovered from this crisis:', 0, 200, NOW(), NOW() union
select 7, 'What are choices I made or things I did that contributed to this crisis?', 0, 300, NOW(), NOW() union
select 7, 'What did I learn from this crisis?', 0, 400, NOW(), NOW() union
select 7, 'What are changes I want to make in my lifestyle and life goals?', 0, 500, NOW(), NOW() union
select 7, 'When and how will I make these changes', 0, 600, NOW(), NOW() union
select 7, 'What help do I want or need to make these changes?', 0, 700, NOW(), NOW() union
select 7, 'These are changes in my WRAP that might help prevent a crisis in the future:', 0, 800, NOW(), NOW() union
select 7, 'These are things that will ease my transition back to everyday life if they are taken care of:', 0, 900, NOW(), NOW() union
select 7, 'These are things I can ask someone else to do for me:', 0, 1000, NOW(), NOW() union
select 7, 'These are things that can wait until I''ve successfully transitioned out of the crisis and into recovery:', 0, 1100, NOW(), NOW() union
select 7, 'These are things I need to do for myself every day:', 1, 1200, NOW(), NOW() union
select 7, 'These are other things I might need to do every day:', 1, 1300, NOW(), NOW() union
select 7, 'These are people, places, and things I need to avoid:', 0, 1400, NOW(), NOW() union
select 7, 'These are things I need to do to prevent more negative effects from this crisis:', 1, 1500, NOW(), NOW();