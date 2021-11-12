-- upgrade --
CREATE UNIQUE INDEX "uid_chat_vk_id_4a052c" ON "chat" ("vk_id");
-- downgrade --
DROP INDEX "idx_chat_vk_id_4a052c";
