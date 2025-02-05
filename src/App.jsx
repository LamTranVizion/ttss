import { useState } from "react";
import { Client } from "@gradio/client";
import { Sparkles, Volume2 } from "lucide-react";
import { BeatLoader } from "react-spinners";

function App() {
  const [text, setText] = useState(
    "Xin chào, tôi là một mô hình chuyển đổi văn bản thành giọng nói tiếng Việt."
  );
  const [language, setLanguage] = useState("vi");
  const [audioFile, setAudioFile] = useState(null);
  const [normalizeText, setNormalizeText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Xử lý upload file audio
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
    }
  };

  // Gọi API TTS sử dụng @gradio/client
  const handleGenerateAudio = async () => {
    try {
      setLoading(true);

      // Connect to the Gradio client
      const client = await Client.connect("thinhlpg/vixtts-demo");

      // Call the predict API
      const result = await client.predict("/predict", {
        prompt: text,
        language: language,
        audio_file_pth: audioFile, // Sử dụng file đã tải lên
        normalize_text: normalizeText,
      });

      console.log(result.data);

      // Set the result state
      setResult({
        data: [
          { url: result.data[0].url }, // Lấy URL từ response
          result.data[1], // Phần metrics
        ],
      });
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      alert(`Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-red-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-2xl font-bold">Vizion Clone</h1>
          <Sparkles className="text-yellow-400" />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Text Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Prompt (Văn bản cần đọc)
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-32 p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language (Ngôn ngữ)
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="vi">Việt Nam</option>
                <option value="en">English</option>
                <option value="ru">Russian</option>
                <option value="jp">Japanese</option>
              </select>
            </div>

            {/* Reference Audio */}
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Reference Audio (Giọng mẫu)
                </span>
              </div>

              <label className="h-36 w-full bg-gray-100 rounded-md flex items-center justify-center cursor-pointer">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {audioFile ? (
                  <span className="text-sm">{audioFile.name}</span>
                ) : (
                  <span className="text-gray-500">Tải lên file audio</span>
                )}
              </label>

              {/* Normalize Text Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={normalizeText}
                  onChange={(e) => setNormalizeText(e.target.checked)}
                  className="w-4 h-4"
                />
                <label className="text-sm">Chuẩn hóa văn bản tiếng Việt</label>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateAudio}
              disabled={loading}
              className={`w-full py-2 px-4 ${
                loading ? "bg-gray-300" : "bg-orange-100 hover:bg-orange-200"
              } rounded-md text-orange-700 font-medium flex items-center justify-center gap-2`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{loading ? "Đang xử lý..." : "Đọc"}</span>
              <span>🔥</span>
            </button>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-4">
            {/* Synthesized Audio */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Âm thanh đã xử lí (Output)
                </span>
              </div>
              <div className="h-48 border rounded-md flex items-center justify-center relative">
                {loading ? (
                  <BeatLoader color="#ff6b6b" size={15} />
                ) : result?.data?.[0]?.url ? (
                  <>
                    <audio
                      controls
                      src={result.data[0].url}
                      className="w-full"
                    />
                  </>
                ) : (
                  <span className="text-4xl">🎵</span>
                )}
              </div>
            </div>

            {/* Metrics */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Metrics
              </label>
              <div className="h-48 border rounded-md p-4 overflow-auto">
                {result?.data?.[1] ? (
                  <pre className="text-sm whitespace-pre-wrap">
                    {result.data[1]}
                  </pre>
                ) : (
                  <span className="text-gray-500"></span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
