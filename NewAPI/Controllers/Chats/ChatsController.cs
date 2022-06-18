using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NewAPI.Data;
using NewAPI.Models;
using NewAPI.RequestBodies;
using NewAPI.Responses;
using Newtonsoft.Json;

namespace NewAPI.Controllers.Chats;

/// <summary>
/// Работа с коллекцией чатов
/// </summary>
[ApiController]
[Route("api/v2/[controller]")]
public class ChatsController : ControllerBase
{
    private readonly ApplicationContext _db;

    /// <summary>
    /// Конструктор контроллера
    /// </summary>
    /// <param name="context">Автоматически добавляемый контекст базы данных</param>
    public ChatsController(ApplicationContext context)
    {
        _db = context;
    }

    /// <summary>
    /// Получение всех доступных чатов
    /// </summary>
    /// <param name="parameters">Параметры пагинации</param>
    /// <response code="200">Данные успешно получены</response>
    [HttpGet]
    [Authorize]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<Paged<Chat>>> GetAllChats([FromQuery] PagingParameters parameters)
    {
        var queryResults = _db.Chats.OrderBy(p => p.Id);

        Paged<Chat> chats =
            await Paged<Chat>.ToPaged(queryResults, parameters.PageNumber, parameters.PageSize);

        var metadata = new
        {
            chats.TotalCount,
            chats.PageSize,
            chats.CurrentPage,
            chats.TotalPages,
            chats.HasPrevious,
            chats.HasNext
        };

        Response.Headers.Add("X-Pagination", JsonConvert.SerializeObject(metadata));

        return Ok(chats);
    }

    /// <summary>
    /// Создание чата
    /// </summary>
    /// <param name="chat">Модель чата</param>
    /// <response code="201">Ресурс успешно создан</response>
    [HttpPost]
    [Authorize]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<Chat>> CreateChat(Chat chat)
    {
        var created = _db.Chats.Add(chat);
        await _db.SaveChangesAsync();

        return Created("/api/v2/Chats", created.Entity);
    }
}