using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using social_network_server.Models;
using social_network_server.Models.ModelBase;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly SocialNetworkContext _context;
    public UploadController(SocialNetworkContext context)
    {
        _context = context;
    }
    //[HttpPost]
    //[Consumes("multipart/form-data")]
    //public async Task<IActionResult> Upload([FromForm] FileUploadModel model)
    //{
    //    if (model.File == null || model.File.Length == 0)
    //        return BadRequest("No file.");

    //    var root = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
    //    Directory.CreateDirectory(root);

    //    var fileName = $"{Guid.NewGuid()}{Path.GetExtension(model.File.FileName)}";
    //    var path = Path.Combine(root, fileName);

    //    using (var stream = System.IO.File.Create(path))
    //    {
    //        await model.File.CopyToAsync(stream);
    //    }

    //    var url = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";
    //    return Ok(new { url });
    //}
    // Model (nếu muốn dùng model)
    public class FilesUploadModel
    {
        public List<IFormFile> Files { get; set; } = new();
    }

    //[HttpPost("upload")]
    //[Consumes("multipart/form-data")]
    //// [RequestSizeLimit(20_000_000)] // tùy chọn: giới hạn 20MB
    //public async Task<IActionResult> Upload([FromForm] FilesUploadModel model)
    //// hoặc: Upload([FromForm] List<IFormFile> files)
    //{
    //    var files = model.Files;
    //    if (files == null || files.Count == 0) return BadRequest("No files.");

    //    // wwwroot/uploads
    //    var webroot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
    //    var root = Path.Combine(webroot, "uploads");
    //    Directory.CreateDirectory(root);

    //    var allowed = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
    //    var urls = new List<string>();

    //    foreach (var file in files)
    //    {
    //        if (file.Length == 0) continue;
    //        if (!file.ContentType.StartsWith("image/"))
    //            return BadRequest("Only image files are allowed.");

    //        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
    //        if (!allowed.Contains(ext))
    //            return BadRequest($"Unsupported type: {ext}");

    //        var fileName = $"{Guid.NewGuid()}{ext}";
    //        var path = Path.Combine(root, fileName);

    //        await using var stream = System.IO.File.Create(path);
    //        await file.CopyToAsync(stream);

    //        urls.Add($"{Request.Scheme}://{Request.Host}/uploads/{fileName}");
    //    }

    //    return Ok(new { urls });
    //}

}
