SELECT
    *,
    to_json(dataset_setting) AS dataset_setting,
    to_json(model_setting) AS model_setting
FROM (
    -- 第一部分查询：直接拥有的应用
    SELECT
        application.*,
        ARRAY['USE', 'MANAGE'] AS operate  -- 对于用户直接拥有的应用，operate 字段设置为 ["USE", "MANAGE"]
    FROM
        application
    ${application_custom_sql}

    UNION

    -- 第二部分查询：通过权限关联的应用
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
            ${team_member_permission_custom_sql}
        )
) AS temp_application
 ${default_sql}