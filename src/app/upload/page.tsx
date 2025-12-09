import UploadForm from '@/components/UploadForm'

export default function UploadPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
          ⬆️ Upload Dataset
        </h1>
        <p className="text-gray-600">
          Tambahkan buku baru ke database dengan upload file CSV
        </p>
      </div>

      <UploadForm />
    </div>
  )
}