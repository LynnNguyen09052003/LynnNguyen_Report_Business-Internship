import { useParams, useNavigate } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import { PhoneOff, Mic, MicOff, Video, VideoOff, Video as VideoIcon, EyeOff, Eye, Minimize2, Maximize2
} from "lucide-react"

export default function Call() {
  const { chatId, type } = useParams()
  const navigate = useNavigate()

  // Lấy dữ liệu từ sessionStorage (truyền từ BoxChat)
  const savedCallData = sessionStorage.getItem("callData")
  const callData = savedCallData ? JSON.parse(savedCallData) : null

  const caller = callData?.caller || {
    name: "Người dùng",
    avatar: "https://i.pravatar.cc/150", // view tạm thời
  }

  const [callType, setCallType] = useState(type)
  const [muted, setMuted] = useState(false)
  const [cameraOn, setCameraOn] = useState(type === "video")
  const [showPreview, setShowPreview] = useState(true)
  const [previewSmall, setPreviewSmall] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [showEndScreen, setShowEndScreen] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const videoRef = useRef(null)
  const previewRef = useRef(null)
  const localStream = useRef(null)
  const missedCallTimeout = useRef(null)

  // Bắt đầu đếm thời gian
  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Khởi tạo camera/mic khi vào trang hoặc khi bật camera
  useEffect(() => {
    if (callType === "video" && cameraOn) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localStream.current = stream
          if (videoRef.current) videoRef.current.srcObject = stream
          if (previewRef.current) previewRef.current.srcObject = stream
        })
        .catch((err) => console.error("Không lấy được camera/mic:", err))
    } else {
      stopStream()
    }

    return () => stopStream()
  }, [callType, cameraOn])

  // Hẹn giờ tự động kết thúc nếu không có tương tác
  useEffect(() => {
    missedCallTimeout.current = setTimeout(() => {
      if (!hasInteracted) {
        sendCallStatus("missed")
        showAndClose("Cuộc gọi nhỡ")
      }
    }, 30000)

    return () => clearTimeout(missedCallTimeout.current)
  }, [hasInteracted])

  const stopStream = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop())
      localStream.current = null
    }
  }

  const formatDuration = (sec) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }

  const sendCallStatus = (status) => {
    localStorage.setItem(
      "call_ended",
      JSON.stringify({
        chatId,
        type: callType,
        duration: callDuration,
        endedAt: Date.now(),
        status, // "ended" | "missed"
      })
    )
  }

  const showAndClose = (message) => {
    stopStream()
    setShowEndScreen(message)

    setTimeout(() => {
      window.close()
    }, 3000)
  }

  const handleToggleCamera = () => {
    setHasInteracted(true)
    setCameraOn((prev) => !prev)
  }

  const handleToggleMute = () => {
    setHasInteracted(true)
    setMuted((prev) => !prev)
    if (localStream.current) {
      localStream.current.getAudioTracks().forEach((track) => (track.enabled = muted))
    }
  }

  const endCall = () => {
    setHasInteracted(true)
    sendCallStatus("ended")
    showAndClose("Cuộc gọi đã kết thúc")
  }

  return (
    <div className="relative w-full h-screen flex flex-col bg-black overflow-hidden">
      {/* Background mờ */}
      <div
        className="absolute inset-0 bg-center bg-cover blur-xl opacity-50"
        style={{ backgroundImage: `url(${caller.avatar})` }}
      />

      {/* Nội dung chính */}
      <div className="flex-1 relative z-10 flex items-center justify-center pb-24">
        {callType === "video" ? (
          cameraOn ? (
            <video
              ref={videoRef}
              className="max-w-5xl max-h-[80vh] w-full rounded-2xl shadow-lg object-contain bg-black"
              autoPlay
              playsInline
              muted={muted}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-black text-gray-400 text-lg rounded-2xl">
              Camera đã tắt
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center text-white">
            <img
              src={caller.avatar}
              alt={caller.name}
              className="w-28 h-28 rounded-full mb-4 shadow-lg"
            />
            <h2 className="text-2xl font-semibold">{caller.name}</h2>
            <p className="text-gray-300 mt-2">Đang trong cuộc gọi thoại...</p>
            <p className="text-gray-400 text-sm">{formatDuration(callDuration)}</p>
          </div>
        )}

        {/* Preview video nhỏ */}
        {callType === "video" && showPreview && (
          <div
            className={`absolute bottom-6 right-6 ${
              previewSmall ? "w-24 h-16" : "w-40 h-28"
            } rounded-xl overflow-hidden border-2 border-white shadow-lg bg-gray-900 transition-all duration-300`}
          >
            <div className="absolute top-1 right-1 flex gap-1">
              <button
                onClick={() => {
                  setHasInteracted(true)
                  setPreviewSmall(!previewSmall)
                }}
                className="bg-black/60 text-white p-1 rounded-full hover:bg-black/80"
              >
                {previewSmall ? (
                  <Maximize2 className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => {
                  setHasInteracted(true)
                  setShowPreview(false)
                }}
                className="bg-black/60 text-white p-1 rounded-full hover:bg-black/80"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>

            {cameraOn ? (
              <video ref={previewRef} className="w-full h-full object-cover" autoPlay playsInline muted />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
                Camera tắt
              </div>
            )}
          </div>
        )}

        {!showPreview && callType === "video" && (
          <button
            onClick={() => {
              setHasInteracted(true)
              setShowPreview(true)
            }}
            className="absolute bottom-6 right-6 bg-gray-700 hover:bg-gray-600 p-2 rounded-full shadow-lg"
          >
            <Eye className="text-white w-5 h-5" />
          </button>
        )}
      </div>

      {/* Thanh điều khiển */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-6 z-20">
        {callType === "video" && (
          <button
            onClick={handleToggleCamera}
            className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full"
          >
            {cameraOn ? <Video className="text-white w-6 h-6" /> : <VideoOff className="text-white w-6 h-6" />}
          </button>
        )}

        {callType === "audio" && (
          <button
            onClick={() => {
              setHasInteracted(true)
              setCallType("video")
              setCameraOn(true)
            }}
            className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full"
          >
            <VideoIcon className="text-white w-6 h-6" />
          </button>
        )}

        <button
          onClick={handleToggleMute}
          className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full"
        >
          {muted ? <MicOff className="text-white w-6 h-6" /> : <Mic className="text-white w-6 h-6" />}
        </button>

        <button
          onClick={endCall}
          className="p-4 bg-red-600 hover:bg-red-700 rounded-full"
        >
          <PhoneOff className="text-white w-6 h-6" />
        </button>
      </div>

      {/* Overlay kết thúc */}
      {showEndScreen && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white z-50 animate-fade-in">
          <h2 className="text-2xl font-bold mb-2">{showEndScreen}</h2>
          {showEndScreen === "Cuộc gọi đã kết thúc" && (
            <p className="text-gray-300 text-lg">Thời gian: {formatDuration(callDuration)}</p>
          )}
        </div>
      )}
    </div>
  )
}
