interface ErrorPageProps {
  code?: number | string;
  message?: string;
}

function ErrorPage({ code, message }: ErrorPageProps) {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>{code || "500"}</h1>
      <p>{message || "An error occurred"}</p>
      <a href="/">Go back home</a>
    </div>
  );
}
export default ErrorPage;
