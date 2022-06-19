using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models;
using api.Responses;

namespace api.Controllers.Chats;

/// <summary>
/// Работа с отдельными элементами коллекции чатов
/// </summary>
[ApiController]
[Route("/api/v2/[controller]")]
public class ChatController : ControllerBase
{
    private readonly ApplicationContext _db;

    /// <summary>
    /// Конструктор контроллера
    /// </summary>
    /// <param name="context">Автоматически добавляемый контекст базы данных</param>
    public ChatController(ApplicationContext context)
    {
        _db = context;
    }

    /// <summary>
    /// Получение чата по идентификатору
    /// </summary>
    /// <param name="id">Идентификатор чата</param>
    /// <response code="200">Чат найден</response>
    /// <response code="401">Ошибка авторизации</response>
    /// <response code="404">Чат не найден</response>
    [Authorize]
    [HttpGet("{id:int}")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Chat>> GetChatById(int id)
    {
        var chat = await _db.Chats.FindAsync(id);

        if (chat is null)
        {
            return NotFound(new Error
            {
                Code = (int)HttpStatusCode.NotFound,
                Message = "Chat with this id was not found",
                Data = id
            });
        }

        return chat;
    }

    /// <summary>
    /// Получение чата по идентификатору ВК
    /// </summary>
    /// <param name="vkId">Идентификатор чата в ВК</param>
    /// <response code="200">Чат найден</response>
    /// <response code="401">Ошибка авторизации</response>
    /// <response code="404">Чат не найден</response>
    [Authorize]
    [HttpGet("vk/{vkId:int}")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Chat>> GetChatByVkId(int vkId)
    {
        try
        {
            return await _db.Chats.SingleAsync(p => p.VkId == vkId);
        }
        catch (InvalidOperationException)
        {
            return NotFound(new Error
            {
                Code = (int)HttpStatusCode.NotFound,
                Message = "Chat with this vkId was not found",
                Data = vkId
            });
        }
    }

    /// <summary>
    /// Обновление чата
    /// </summary>
    /// <param name="id">Идентификатор чата</param>
    /// <param name="chat">Запрос в формате JSON PATCH, обновляющий ресурс</param>
    /// <response code="200">Чат изменён</response>
    /// <response code="400">Тело запроса не передано или не валидно</response>
    /// <response code="401">Ошибка авторизации</response>
    /// <response code="404">Чат не найден</response>
    [Authorize]
    [HttpPatch("{id:int}")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Product>> UpdateChat(int id, [FromBody] JsonPatchDocument<Chat>? chat)
    {
        if (chat == null)
            return BadRequest(new Error
            {
                Code = (int)HttpStatusCode.BadRequest,
                Message = "Chat was not passed",
            });

        var entity = await _db.Chats.FindAsync(id);

        if (entity == null)
        {
            return NotFound(new Error
            {
                Code = (int)HttpStatusCode.NotFound,
                Message = "Chat with this id was not found",
                Data = id
            });
        }

        chat.ApplyTo(entity, ModelState);
        await _db.SaveChangesAsync();
        return Ok(entity);
    }

    /// <summary>
    /// Удаление чата
    /// </summary>
    /// <param name="id">Идентификатор чата</param>
    /// <response code="204">Чат удалён</response>
    /// <response code="401">Ошибка авторизации</response>
    /// <response code="404">Чат не найден</response>
    [Authorize]
    [HttpDelete("{id:int}")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> DeleteChat(int id)
    {
        var entity = await _db.Chats.FindAsync(id);

        if (entity is null)
        {
            return NotFound(new Error
            {
                Code = (int)HttpStatusCode.NotFound,
                Message = "Chat with this id was not found",
                Data = id
            });
        }

        _db.Chats.Remove(entity);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}