SELECT
    application.*,
    ARRAY['USE', 'MANAGE'] AS operate  -- 对于用户直接拥有的应用，operate 字段设置为 ["USE", "MANAGE"]
FROM
    application
WHERE
    user_id = %s

UNION

SELECT
    application.*,
    team_member_permission.operate  -- 包含 team_member_permission 的 operate 字段
FROM
    application
JOIN
    team_member_permission
ON
    application.id = team_member_permission.target
WHERE
    application.id IN (
        SELECT
            team_member_permission.target
        FROM
            team_member
        LEFT JOIN
            team_member_permission
        ON
            team_member_permission.member_id = team_member.id
        WHERE
            team_member_permission.auth_target_type = 'APPLICATION'
            AND team_member_permission.operate::text[] @> ARRAY['USE']
            AND team_member.team_id = %s
            AND team_member.user_id = %s
    );