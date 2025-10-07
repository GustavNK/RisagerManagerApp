using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace RisagerBackend.Services
{
    public interface IBlobStorageService
    {
        Task<string> UploadFileAsync(IFormFile file, string containerName = "risager");
        Task<BlobDownloadInfo> DownloadFileAsync(string fileName, string containerName = "risager");
        Task DeleteFileAsync(string fileName, string containerName = "risager");
        Task<string> GetFileUrlAsync(string fileName, string containerName = "risager");
    }

    public class BlobStorageService : IBlobStorageService
    {
        private readonly BlobServiceClient _blobServiceClient;

        public BlobStorageService(IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("AzureBlobStorage");
            _blobServiceClient = new BlobServiceClient(connectionString);
        }

        public async Task<string> UploadFileAsync(IFormFile file, string containerName = "risager")
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);

            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var blobClient = containerClient.GetBlobClient(fileName);

            using var stream = file.OpenReadStream();
            await blobClient.UploadAsync(stream, new BlobHttpHeaders
            {
                ContentType = file.ContentType
            });

            return fileName;
        }

        public async Task<BlobDownloadInfo> DownloadFileAsync(string fileName, string containerName = "risager")
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(fileName);

            return await blobClient.DownloadAsync();
        }

        public async Task DeleteFileAsync(string fileName, string containerName = "risager")
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(fileName);

            await blobClient.DeleteIfExistsAsync();
        }

        public Task<string> GetFileUrlAsync(string fileName, string containerName = "risager")
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(fileName);

            return Task.FromResult(blobClient.Uri.ToString());
        }
    }
}