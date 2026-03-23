function ErrorFallbackPage({ error }) {
  return (
    <div className="size-full min-h-[100dvh] flex items-center justify-center bg-gray-100 p-4">
      <div className="mx-auto max-w-[600px]">
        <p>
          Mã lỗi: <code style={{ color: "red" }}>{error.code}</code>
        </p>
        <p>{error.message}</p>

        <button
          onClick={() => (window.location.href = "/")}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
}
export default ErrorFallbackPage;
