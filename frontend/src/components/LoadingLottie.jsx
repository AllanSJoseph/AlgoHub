function LoadingLottie({ size = 120, label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-4">
      <dotlottie-wc
        src="https://lottie.host/f24fc5a6-dd4a-46fa-bc8a-2902be6cc832/SRBOJJ3FEe.lottie"
        style={{ width: `${size}px`, height: `${size}px` }}
        autoplay
        loop
      ></dotlottie-wc>
      {label && <span className="text-sm text-base-content/70">{label}</span>}
    </div>
  );
}

export default LoadingLottie;
